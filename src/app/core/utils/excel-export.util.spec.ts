import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToExcel, ExcelExportColumn } from './excel-export.util';

describe('exportToExcel', () => {
  const columns: ExcelExportColumn[] = [
    { header: 'CÓDIGO', field: 'codigo', type: 'text' },
    { header: 'DESCRIPCIÓN', field: 'descripcion', type: 'text' },
    { header: 'MONTO (S/)', field: 'monto', type: 'currency' },
    { header: 'ACTIVO', field: 'activo', type: 'boolean' },
  ];

  const data = [
    { codigo: 'ART-001', descripcion: 'Gaseosa 3L "Especial"', monto: 12.5, activo: true },
    { codigo: 'ART-002', descripcion: 'Galleta de Soda', monto: 3.0, activo: false },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('debe retornar false si no se envían columnas o datos', () => {
    expect(exportToExcel({ fileName: 'test', columns: [], data: [] })).toBe(false);
    expect(exportToExcel({ fileName: 'test', columns, data: null as any })).toBe(false);
  });

  it('debe procesar y generar la descarga correctamente en entorno browser', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    const result = exportToExcel({
      fileName: 'reporte-articulos',
      columns,
      data,
    });

    expect(result).toBe(true);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
