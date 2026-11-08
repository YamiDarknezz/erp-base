export interface InvoiceEntity {
  id: string;
  serieNumero: string;
  cliente: string;
  ruc: string;
  fechaEmision: string;
  monto: number;
  igv: number;
  total: number;
  estadoEnvio: 'Aceptado' | 'Pendiente' | 'Rechazado';
}

export const INITIAL_INVOICES_SEED: InvoiceEntity[] = [
  { id: '1', serieNumero: 'F001-0004521', cliente: 'SUPERMERCADOS METRO S.A.', ruc: '20100070970', fechaEmision: '07/11/2026', monto: 4110.59, igv: 739.91, total: 4850.50, estadoEnvio: 'Aceptado' },
  { id: '2', serieNumero: 'F001-0004522', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', ruc: '20489632514', fechaEmision: '07/11/2026', monto: 10508.47, igv: 1891.53, total: 12400.00, estadoEnvio: 'Pendiente' },
  { id: '3', serieNumero: 'B001-0012890', cliente: 'TIENDAS TAMBO SAC', ruc: '20563458921', fechaEmision: '06/11/2026', monto: 2712.50, igv: 488.25, total: 3200.75, estadoEnvio: 'Aceptado' },
  { id: '4', serieNumero: 'F001-0004523', cliente: 'BODEGAS UNIDAS LIMA', ruc: '20601239845', fechaEmision: '06/11/2026', monto: 1601.69, igv: 288.31, total: 1890.00, estadoEnvio: 'Aceptado' },
  { id: '5', serieNumero: 'F001-0004524', cliente: 'COMERCIAL EL SOL S.R.L.', ruc: '20512897456', fechaEmision: '05/11/2026', monto: 6483.22, igv: 1166.98, total: 7650.20, estadoEnvio: 'Rechazado' },
];
