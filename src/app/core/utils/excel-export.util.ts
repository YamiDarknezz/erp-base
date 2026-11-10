/**
 * Utilidad corporativa para exportación de datos a hojas de cálculo (formato CSV/Excel compatible).
 * Aplica UTF-8 BOM (\uFEFF) para garantizar la apertura correcta de tildes, eñes y caracteres especiales
 * en Microsoft Excel, LibreOffice y Google Sheets sin desconfiguración regional.
 */

export interface ExcelExportColumn {
  header: string;
  field: string;
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'badge';
}

export interface ExcelExportOptions {
  fileName: string;
  columns: ExcelExportColumn[];
  data: any[];
  sheetName?: string;
}

/**
 * Escapa valores para formato CSV estándar (RFC 4180).
 */
function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }

  const str = String(value);
  // Reemplazar comillas dobles por dobles comillas dobles
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Formatea un valor según el tipo de columna.
 */
function formatCellValue(value: unknown, type?: string): string {
  if (value === null || value === undefined) return '';

  if (type === 'currency' && typeof value === 'number') {
    return value.toFixed(2);
  }

  if (type === 'boolean') {
    return value ? 'SÍ' : 'NO';
  }

  return String(value);
}

/**
 * Genera y descarga un archivo compatible con Excel con los datos y columnas especificados.
 */
export function exportToExcel(options: ExcelExportOptions): boolean {
  if (!options.data || options.columns.length === 0) {
    return false;
  }

  try {
    const bom = '\uFEFF';
    const delimiter = ';'; // Delimitador por defecto para compatibilidad directa con Excel en ES/LATAM

    // Cabeceras
    const headerRow = options.columns
      .map(col => escapeCsvCell(col.header))
      .join(delimiter);

    // Filas de datos
    const dataRows = options.data.map(item => {
      return options.columns
        .map(col => {
          const rawVal = item[col.field];
          const formatted = formatCellValue(rawVal, col.type);
          return escapeCsvCell(formatted);
        })
        .join(delimiter);
    });

    const csvContent = bom + [headerRow, ...dataRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // En navegadores que soporten descarga programática
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      const safeName = (options.fileName || 'exportacion')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_');

      link.setAttribute('href', url);
      link.setAttribute('download', `${safeName}_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return true;
  } catch (error) {
    console.error('Error al generar la exportación a Excel:', error);
    return false;
  }
}
