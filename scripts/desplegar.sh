#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Despliegue de ERP Base — Angular 21 Enterprise Dashboard
#
#   scripts/desplegar.sh <commit>     despliega ese commit exacto
#   scripts/desplegar.sh --volver     vuelve al commit anterior
#
# Lo ejecuta el CI en el VPS (con el SHA validado por las pruebas unitarias y
# build) y también se puede ejecutar manualmente vía SSH en el servidor.
#
# Garantías del pipeline:
#   1. Se despliega el commit VALIDADO por CI mediante git reset --hard <sha>.
#   2. Si el smoke test falla, ejecuta rollback automático al commit anterior.
#   3. Mantiene registro auditable de versiones y estados en despliegue.estado.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

FUENTE="${HOME}/data/repos/erp-base"
DEPLOY="${HOME}/data/deploy/erp-base"
ESTADO="${DEPLOY}/despliegue.estado"
LOG="${DEPLOY}/despliegues.log"

paso() { echo; echo "── $* ──"; }
aviso() { echo "   ⚠ $*"; }
error() { echo "   ✗ $*" >&2; }

# Verificar directorios base en el servidor
if [ ! -d "${DEPLOY}" ]; then
  mkdir -p "${DEPLOY}"
fi

if [ ! -d "${FUENTE}" ]; then
  error "No existe el repositorio en ${FUENTE}."
  exit 1
fi

# ── Utilidades ───────────────────────────────────────────────────────────────

commit_desplegado() {
  if [ -f "${ESTADO}" ]; then
    grep -E '^commit=' "${ESTADO}" 2>/dev/null | cut -d= -f2 || true
  else
    git -C "${FUENTE}" rev-parse HEAD 2>/dev/null || true
  fi
}

fijar_codigo() {
  local sha="$1"
  paso "Código: fijar el commit ${sha:0:8}"
  git -C "${FUENTE}" fetch --quiet --all --tags
  if ! git -C "${FUENTE}" reset --hard "${sha}" >/dev/null 2>&1; then
    error "El commit ${sha} no existe en el repositorio."
    exit 1
  fi
  echo "   ✓ ${FUENTE} en $(git -C "${FUENTE}" rev-parse --short HEAD) — $(git -C "${FUENTE}" log -1 --format=%s)"
}

construir_y_levantar() {
  paso "Construir y levantar contenedores Docker"
  cd "${DEPLOY}"
  docker compose build erp-base
  docker compose up -d --build --wait --wait-timeout 180 erp-base
  docker compose ps
}

smoke_test() {
  paso "Smoke test del despliegue"
  local dominio codigo
  if [ -f "${DEPLOY}/.env" ]; then
    dominio="$(grep -E '^ERP_DOMAIN=' "${DEPLOY}/.env" 2>/dev/null | cut -d= -f2 || echo "erp.darknezz.dev")"
  else
    dominio="erp.darknezz.dev"
  fi

  if [ -z "${dominio}" ]; then
    dominio="erp.darknezz.dev"
  fi

  if [ "${FORZAR_FALLO_SMOKE:-0}" = "1" ]; then
    aviso "FORZAR_FALLO_SMOKE=1: se simula fallo para probar rollback."
    return 1
  fi

  # 1. Comprobar endpoint de salud
  codigo=000
  for intento in $(seq 1 30); do
    codigo="$(curl -sk -o /dev/null -w '%{http_code}' -H "Host: ${dominio}" https://127.0.0.1/health || echo 000)"
    [ "${codigo}" = "200" ] && break
    echo "   intento ${intento}/30 -> ${codigo}"
    sleep 3
  done

  if [ "${codigo}" != "200" ]; then
    error "GET /health -> ${codigo}: el contenedor de ERP Base no responde con 200."
    return 1
  fi
  echo "   ✓ /health -> 200 (servidor saludable)"

  # 2. Comprobar que Nginx sirve la SPA (index.html)
  codigo="$(curl -sk -o /dev/null -w '%{http_code}' -H "Host: ${dominio}" https://127.0.0.1/ || echo 000)"
  if [ "${codigo}" != "200" ]; then
    error "GET / -> ${codigo}: el frontend SPA no se está entregando correctamente."
    return 1
  fi
  echo "   ✓ / -> 200 (frontend SPA Angular disponible)"

  return 0
}

guardar_estado() {
  local sha="$1"
  echo "commit=${sha}" > "${ESTADO}"
  echo "fecha=$(date -Is)" >> "${ESTADO}"
  echo "anterior=${2:-}" >> "${ESTADO}"
}

registrar() {
  echo "$(date -Is) | ${1} | commit ${2:0:8} | ${3}" >> "${LOG}"
}

# ── Vuelta atrás (Rollback) ──────────────────────────────────────────────────
volver_a() {
  local sha="$1" motivo="${2:-a mano}"
  [ -n "${sha}" ] || { error "No hay commit anterior al que volver."; return 1; }

  aviso "VOLVIENDO al commit ${sha:0:8} (${motivo})"
  fijar_codigo "${sha}"
  construir_y_levantar
  if FORZAR_FALLO_SMOKE=0 smoke_test; then
    guardar_estado "${sha}" ""
    registrar "vuelta atras OK" "${sha}" "${motivo}"
    aviso "El sistema quedó operando en ${sha:0:8}."
    return 0
  fi
  error "La vuelta atrás tampoco pasó el smoke test: requiere atención manual."
  registrar "vuelta atras FALLIDA" "${sha}" "${motivo}"
  return 1
}

# ── Flujo principal ──────────────────────────────────────────────────────────

if [ "${1:-}" = "--volver" ]; then
  ANTERIOR="$(grep -E '^anterior=' "${ESTADO}" 2>/dev/null | cut -d= -f2 || true)"
  [ -n "${ANTERIOR}" ] || { error "No hay commit anterior registrado en ${ESTADO}."; exit 1; }
  volver_a "${ANTERIOR}" "solicitado a mano"
  exit $?
fi

SHA="${1:-}"
if [ -z "${SHA}" ]; then
  error "Falta el commit. Uso: scripts/desplegar.sh <commit> | --volver"
  exit 2
fi

ANTERIOR="$(commit_desplegado)"
echo "════════════════════════════════════════════════════════════════════"
echo " Despliegue ERP Base — $(date -Is)"
echo "   commit a desplegar: ${SHA:0:12}"
echo "   commit en marcha:   ${ANTERIOR:0:12}"
echo "════════════════════════════════════════════════════════════════════"

fijar_codigo "${SHA}"
construir_y_levantar

if smoke_test; then
  guardar_estado "$(git -C "${FUENTE}" rev-parse HEAD)" "${ANTERIOR}"
  registrar "despliegue OK" "${SHA}" "anterior ${ANTERIOR:0:8}"
  echo
  echo "RESULTADO: OK — ${SHA:0:8} en producción."
  exit 0
fi

echo
error "El smoke test falló con el nuevo commit."
registrar "despliegue FALLIDO" "${SHA}" "smoke test"
if volver_a "${ANTERIOR}" "smoke test falló con ${SHA:0:8}"; then
  exit 1
fi
exit 1
