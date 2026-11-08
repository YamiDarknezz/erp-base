# ==============================================================================
# Etapa 1: Compilación de la aplicación Angular PWA
# ==============================================================================
FROM node:22-alpine AS build
WORKDIR /app

# Habilitar corepack para gestión exacta de pnpm
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

# Instalar dependencias con caché optimizado
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar código fuente y generar build de producción
COPY . .
RUN pnpm run build

# ==============================================================================
# Etapa 2: Servidor Nginx ligero y seguro de producción
# ==============================================================================
FROM nginx:alpine

# Copiar bundle de Angular compilado
COPY --from=build /app/dist/erp-base/browser /usr/share/nginx/html

# Copiar configuración optimizada de Nginx con gzip, caché y seguridad
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://0.0.0.0:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
