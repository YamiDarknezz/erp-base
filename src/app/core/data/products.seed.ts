export interface ProductEntity {
  id: string;
  sku: string;
  descripcion: string;
  unidad: string;
  categoria: string;
  precioUnitario: number;
  costo: number;
  stockActual: number;
  stockMinimo: number;
  depositoPrincipal: string;
}

export const INITIAL_PRODUCTS_SEED: ProductEntity[] = [
  {
    id: 'p1',
    sku: 'BEB-001',
    descripcion: 'INCA KOLA PET 500ML RETORNABLE PACK X24',
    unidad: 'CJA',
    categoria: 'BEBIDAS Y GASEOSAS',
    precioUnitario: 38.50,
    costo: 31.20,
    stockActual: 1420,
    stockMinimo: 200,
    depositoPrincipal: 'ALM_CENTRAL',
  },
  {
    id: 'p2',
    sku: 'BEB-002',
    descripcion: 'COCA COLA REGULAR 1.5L PACK X12',
    unidad: 'CJA',
    categoria: 'BEBIDAS Y GASEOSAS',
    precioUnitario: 52.00,
    costo: 42.10,
    stockActual: 980,
    stockMinimo: 150,
    depositoPrincipal: 'ALM_CENTRAL',
  },
  {
    id: 'p3',
    sku: 'BEB-003',
    descripcion: 'AGUA SAN LUIS SIN GAS 2.5L X6',
    unidad: 'FAR',
    categoria: 'AGUAS Y JUGOS',
    precioUnitario: 19.80,
    costo: 14.50,
    stockActual: 620,
    stockMinimo: 100,
    depositoPrincipal: 'ALM_SUR',
  },
  {
    id: 'p4',
    sku: 'ARR-101',
    descripcion: 'ARROZ EXTRA PAISANA BOLSA 5KG',
    unidad: 'BLS',
    categoria: 'ABARROTES',
    precioUnitario: 22.50,
    costo: 18.00,
    stockActual: 2100,
    stockMinimo: 300,
    depositoPrincipal: 'ALM_CENTRAL',
  },
  {
    id: 'p5',
    sku: 'ACE-201',
    descripcion: 'ACEITE VEGETAL PRIMOR CLÁSICO 1L CAJA X12',
    unidad: 'CJA',
    categoria: 'ABARROTES',
    precioUnitario: 88.00,
    costo: 72.50,
    stockActual: 750,
    stockMinimo: 120,
    depositoPrincipal: 'ALM_CENTRAL',
  },
  {
    id: 'p6',
    sku: 'LAC-301',
    descripcion: 'LECHE GLORIA ETIQUETA AZUL 400G PLANCHA X24',
    unidad: 'PLA',
    categoria: 'LÁCTEOS',
    precioUnitario: 94.00,
    costo: 81.00,
    stockActual: 1140,
    stockMinimo: 250,
    depositoPrincipal: 'ALM_SUR',
  },
  {
    id: 'p7',
    sku: 'CER-401',
    descripcion: 'CERVEZA CRISTAL RETORNABLE 650ML X12',
    unidad: 'CJA',
    categoria: 'LICORES Y CERVEZAS',
    precioUnitario: 49.50,
    costo: 40.00,
    stockActual: 840,
    stockMinimo: 180,
    depositoPrincipal: 'ALM_CENTRAL',
  },
];
