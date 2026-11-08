export interface OrderEntity {
  id: string;
  codigo: string;
  cliente: string;
  clienteRuc?: string;
  vendedor: string;
  fecha: string;
  total: number;
  estado: 'Pendiente' | 'Aprobado' | 'Facturado' | 'Anulado';
}

export const INITIAL_ORDERS_SEED: OrderEntity[] = [
  { id: '1', codigo: 'PED-2026-0891', cliente: 'SUPERMERCADOS METRO S.A.', clienteRuc: '20100070970', vendedor: 'Carlos Rivas', fecha: '07/11/2026', total: 4850.50, estado: 'Aprobado' },
  { id: '2', codigo: 'PED-2026-0892', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', clienteRuc: '20489632514', vendedor: 'Lucía Mendoza', fecha: '07/11/2026', total: 12400.00, estado: 'Pendiente' },
  { id: '3', codigo: 'PED-2026-0893', cliente: 'TIENDAS TAMBO SAC', clienteRuc: '20563458921', vendedor: 'Carlos Rivas', fecha: '06/11/2026', total: 3200.75, estado: 'Facturado' },
  { id: '4', codigo: 'PED-2026-0894', cliente: 'BODEGAS UNIDAS LIMA', clienteRuc: '20601239845', vendedor: 'Jorge Campos', fecha: '06/11/2026', total: 1890.00, estado: 'Aprobado' },
  { id: '5', codigo: 'PED-2026-0895', cliente: 'COMERCIAL EL SOL S.R.L.', clienteRuc: '20512897456', vendedor: 'Lucía Mendoza', fecha: '05/11/2026', total: 7650.20, estado: 'Pendiente' },
  { id: '6', codigo: 'PED-2026-0896', cliente: 'INVERSIONES SAN ROQUE', clienteRuc: '20508778920', vendedor: 'Jorge Campos', fecha: '05/11/2026', total: 950.00, estado: 'Anulado' },
];
