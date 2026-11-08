const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// 1. Calcular hash SHA-256 de archivos fuente
const hash = crypto.createHash('sha256');

function digest(relative) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) return;
  if (relative === 'public/app-version.json' || relative === 'src/app/core/version/app-build.ts') return;

  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(full).sort()) {
      digest(`${relative}/${child}`);
    }
  } else {
    hash.update(relative).update(fs.readFileSync(full));
  }
}

for (const entry of ['src', 'public', 'package.json', 'angular.json', 'ngsw-config.json']) {
  digest(entry);
}

const buildId = hash.digest('hex').slice(0, 12);
const builtAt = new Date().toISOString();

const metadata = {
  version: pkg.version || '1.0.0',
  id: buildId,
  builtAt: builtAt,
  storageSchema: 1,
};

// 2. Escribir public/app-version.json (servido estáticamente)
const publicDir = path.join(root, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'app-version.json'), JSON.stringify(metadata, null, 2) + '\n');

// 3. Escribir src/app/core/version/app-build.ts (embebido en el bundle de Angular)
const versionDir = path.join(root, 'src', 'app', 'core', 'version');
if (!fs.existsSync(versionDir)) fs.mkdirSync(versionDir, { recursive: true });

const appBuildContent = `// Archivo autogenerado en compilación por scripts/generate-version.cjs
export interface AppBuildInfo {
  readonly version: string;
  readonly id: string;
  readonly builtAt: string;
  readonly storageSchema: number;
}

export const APP_BUILD: AppBuildInfo = Object.freeze({
  version: '${metadata.version}',
  id: '${metadata.id}',
  builtAt: '${metadata.builtAt}',
  storageSchema: ${metadata.storageSchema},
});
`;
fs.writeFileSync(path.join(versionDir, 'app-build.ts'), appBuildContent);

// 4. Registrar en docs/VERSION_TRACKING.md si no está ya registrado
const trackingPath = path.join(root, 'docs', 'VERSION_TRACKING.md');
if (fs.existsSync(trackingPath)) {
  const currentTracking = fs.readFileSync(trackingPath, 'utf8');
  if (!currentTracking.includes(metadata.id)) {
    const entry = `| v${metadata.version} | \`${metadata.id}\` | ${metadata.builtAt} | Build generado automáticamente | Activo |\n`;
    const updated = currentTracking.replace(/(<!-- VERSION_ENTRIES -->\n)/, `$1${entry}`);
    fs.writeFileSync(trackingPath, updated);
  }
}

console.log(`[VERSIONING] Versión: ${metadata.version} | Build ID: ${metadata.id} | Timestamp: ${metadata.builtAt}`);
