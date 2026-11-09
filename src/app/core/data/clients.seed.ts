export interface ClientEntity {
  id: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
  departamento: string;
  provincia: string;
  localidad: string;
  telefono: string;
  tipoContribuyente: 'PJ' | 'PN';
  fechaAlta: string;
  limiteCredito: number;
  anulado: boolean;
  categoria?: string;
}

export const INITIAL_CLIENTS_SEED: ClientEntity[] = [
  {
    id: '1',
    ruc: '20501234567',
    razonSocial: 'CORPORACION LOGISTICA DEL CENTRO S.A.C.',
    direccion: 'AV. LOS ROBLES 450',
    departamento: 'LIMA',
    provincia: 'LIMA',
    localidad: 'SAN ISIDRO',
    telefono: '7105000',
    tipoContribuyente: 'PJ',
    fechaAlta: '27/06/2015',
    limiteCredito: 350000,
    anulado: false,
    categoria: 'VIP',
  },
  {
    id: '2',
    ruc: '20100039207',
    razonSocial: 'RANSA COMERCIAL SA',
    direccion: 'AV. ARGENTINA N° 2440',
    departamento: 'LIMA',
    provincia: 'CALLAO',
    localidad: 'CALLAO',
    telefono: '3136000',
    tipoContribuyente: 'PJ',
    fechaAlta: '23/02/2016',
    limiteCredito: 200000,
    anulado: false,
    categoria: 'Logística',
  },
  {
    id: '3',
    ruc: '20508778920',
    razonSocial: 'INVERSIONES QUISSEL SRL',
    direccion: 'GREGORIO PAREDES 214',
    departamento: 'LIMA',
    provincia: 'LIMA',
    localidad: 'ATE VITARTE',
    telefono: '4313980',
    tipoContribuyente: 'PJ',
    fechaAlta: '27/01/2020',
    limiteCredito: 80000,
    anulado: false,
  },
  {
    id: '4',
    ruc: '20539721870',
    razonSocial: 'PROTEKTOR SEGURIDAD INTEGRAL S.A.C.',
    direccion: 'AV ANTENOR ORREGO 120',
    departamento: 'LIMA',
    provincia: 'LIMA',
    localidad: 'MIRAFLORES',
    telefono: '044266065',
    tipoContribuyente: 'PJ',
    fechaAlta: '27/03/2020',
    limiteCredito: 100000,
    anulado: false,
  },
  {
    id: '5',
    ruc: '20353607783',
    razonSocial: 'MERCANTIL INCA S.A.',
    direccion: 'AV. SALAVERRY N° 1240',
    departamento: 'LIMA',
    provincia: 'LIMA',
    localidad: 'JESUS MARIA',
    telefono: '4221100',
    tipoContribuyente: 'PJ',
    fechaAlta: '29/10/2016',
    limiteCredito: 50000,
    anulado: false,
  },
  {
    id: '6',
    ruc: '20451583060',
    razonSocial: 'BODEGAS DON LUIS S.A.C.',
    direccion: 'AV LA ALAMEDA SUR 450',
    departamento: 'LIMA',
    provincia: 'LIMA',
    localidad: 'CHORRILLOS',
    telefono: '2541200',
    tipoContribuyente: 'PJ',
    fechaAlta: '30/11/2016',
    limiteCredito: 30000,
    anulado: false,
  },
  {
    id: '7',
    ruc: '20100128056',
    razonSocial: 'SAGA FALABELLA S.A.',
    direccion: 'AV. PASEO DE LA REPUBLICA 3220',
    departamento: 'LIMA',
    provincia: 'LIMA',
    localidad: 'SAN ISIDRO',
    telefono: '5120000',
    tipoContribuyente: 'PJ',
    fechaAlta: '31/07/2018',
    limiteCredito: 500000,
    anulado: false,
    categoria: 'Corporativo',
  },
  {
    id: '8',
    ruc: '20467533026',
    razonSocial: 'AMERICA MOVIL PERU S.A.C.',
    direccion: 'AV. NICOLAS ARRIOLA 480',
    departamento: 'LIMA',
    provincia: 'LIMA',
    localidad: 'LA VICTORIA',
    telefono: '6131000',
    tipoContribuyente: 'PJ',
    fechaAlta: '06/01/2020',
    limiteCredito: 450000,
    anulado: false,
  },
];
