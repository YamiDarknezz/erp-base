export interface CollectionSheetEntity {
  id: string;
  numero: string;
  fecha: string;
  cobrador: string;
  zona: string;
  documentosCobradas: number;
  totalRecaudado: number;
  bancoDestino: string;
  estado: 'Liquidada' | 'En Proceso' | 'Pendiente';
}

export interface AgingAccountEntity {
  id: string;
  ruc: string;
  cliente: string;
  limiteCredito: number;
  deudaTotal: number;
  corriente: number;
  vencido1_30: number;
  vencido31_60: number;
  vencido90Mas: number;
  semaforo: 'Normal' | 'Precaución' | 'Crítico';
}

export const INITIAL_COLLECTIONS_SEED: CollectionSheetEntity[] = [
  {
    id: '1',
    numero: 'PLC-2026-00381',
    fecha: '08/11/2026',
    cobrador: 'Marcos Benítez Salazar',
    zona: 'Lima Este / Ate',
    documentosCobradas: 14,
    totalRecaudado: 48920.50,
    bancoDestino: 'BCP Cta Corriente Soles',
    estado: 'Liquidada',
  },
  {
    id: '2',
    numero: 'PLC-2026-00382',
    fecha: '08/11/2026',
    cobrador: 'Raúl Espinoza Peña',
    zona: 'Callao Centro / Ventanilla',
    documentosCobradas: 9,
    totalRecaudado: 23410.00,
    bancoDestino: 'BBVA Continental Soles',
    estado: 'En Proceso',
  },
  {
    id: '3',
    numero: 'PLC-2026-00383',
    fecha: '07/11/2026',
    cobrador: 'Christian Villegas Ruiz',
    zona: 'Lima Sur / Chorrillos',
    documentosCobradas: 22,
    totalRecaudado: 67180.25,
    bancoDestino: 'Interbank Recaudaciones',
    estado: 'Liquidada',
  },
  {
    id: '4',
    numero: 'PLC-2026-00384',
    fecha: '07/11/2026',
    cobrador: 'Marcos Benítez Salazar',
    zona: 'San Juan de Lurigancho',
    documentosCobradas: 6,
    totalRecaudado: 12850.00,
    bancoDestino: 'Scotiabank Empresas',
    estado: 'Pendiente',
  },
  {
    id: '5',
    numero: 'PLC-2026-00385',
    fecha: '06/11/2026',
    cobrador: 'Raúl Espinoza Peña',
    zona: 'Lima Norte / Los Olivos',
    documentosCobradas: 18,
    totalRecaudado: 54300.80,
    bancoDestino: 'BCP Cta Corriente Soles',
    estado: 'Liquidada',
  },
];

export const INITIAL_AGING_SEED: AgingAccountEntity[] = [
  {
    id: '1',
    ruc: '20100039207',
    cliente: 'RANSA COMERCIAL SA',
    limiteCredito: 200000,
    deudaTotal: 84500.00,
    corriente: 84500.00,
    vencido1_30: 0,
    vencido31_60: 0,
    vencido90Mas: 0,
    semaforo: 'Normal',
  },
  {
    id: '2',
    ruc: '20501234567',
    cliente: 'CORPORACION LOGISTICA DEL CENTRO S.A.C.',
    limiteCredito: 350000,
    deudaTotal: 142300.50,
    corriente: 110000.00,
    vencido1_30: 32300.50,
    vencido31_60: 0,
    vencido90Mas: 0,
    semaforo: 'Normal',
  },
  {
    id: '3',
    ruc: '20508778920',
    cliente: 'INVERSIONES QUISSEL SRL',
    limiteCredito: 80000,
    deudaTotal: 65400.00,
    corriente: 15000.00,
    vencido1_30: 25000.00,
    vencido31_60: 25400.00,
    vencido90Mas: 0,
    semaforo: 'Precaución',
  },
  {
    id: '4',
    ruc: '20353607783',
    cliente: 'MERCANTIL INCA S.A.',
    limiteCredito: 50000,
    deudaTotal: 49800.00,
    corriente: 0,
    vencido1_30: 5000.00,
    vencido31_60: 12000.00,
    vencido90Mas: 32800.00,
    semaforo: 'Crítico',
  },
  {
    id: '5',
    ruc: '20451583060',
    cliente: 'BODEGAS DON LUIS S.A.C.',
    limiteCredito: 30000,
    deudaTotal: 18200.00,
    corriente: 12000.00,
    vencido1_30: 6200.00,
    vencido31_60: 0,
    vencido90Mas: 0,
    semaforo: 'Normal',
  },
  {
    id: '6',
    ruc: '20539721870',
    cliente: 'PROTEKTOR SEGURIDAD INTEGRAL S.A.C.',
    limiteCredito: 100000,
    deudaTotal: 78900.00,
    corriente: 20000.00,
    vencido1_30: 18900.00,
    vencido31_60: 40000.00,
    vencido90Mas: 0,
    semaforo: 'Precaución',
  },
];
