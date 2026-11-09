import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface ProveedorCliente {
  codigo: string;
  razonSocial: string;
  anulado: boolean;
  domicilio: string;
  provincia: string;
  departamento: string;
  localidad: string;
  telefono: string;
  tipoContribuyente: 'PJ' | 'PN';
  identificador: string;
  fechaAlta: string;
}

@Component({
  selector: 'app-clientes',
  imports: [DataGrid],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clientes {
  protected readonly columns: GridColumn[] = [
    { field: 'codigo', header: 'CÓDIGO', width: '70px', align: 'right', type: 'number' },
    { field: 'razonSocial', header: 'RAZÓN SOCIAL', minWidth: '220px' },
    { field: 'anulado', header: 'ANULADO', width: '80px', align: 'center', type: 'boolean' },
    { field: 'domicilio', header: 'DOMICILIO', minWidth: '180px' },
    { field: 'provincia', header: 'PROVINCIA', width: '100px' },
    { field: 'departamento', header: 'DEPARTAMENTO', width: '110px' },
    { field: 'localidad', header: 'LOCALIDAD', width: '100px' },
    { field: 'telefono', header: 'TELÉFONO', width: '110px', type: 'number' },
    { field: 'tipoContribuyente', header: 'T. CONTR', width: '75px', align: 'center' },
    { field: 'identificador', header: 'IDENTIFICADOR', width: '110px', type: 'number' },
    { field: 'fechaAlta', header: 'FECHA ALTA', width: '95px', align: 'center', type: 'date' },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver detalle del registro', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Editar datos del proveedor', color: 'emerald' },
    { id: 'file', icon: 'file', title: 'Ver comprobantes asociados', color: 'blue' },
    { id: 'delete', icon: 'delete', title: 'Anular registro', color: 'rose' },
  ];

  protected readonly registros = signal<ProveedorCliente[]>([
    { codigo: '0', razonSocial: 'MOVIMIENTOS S/CPBTE.FISCAL', anulado: false, domicilio: 'AV. LOS ROBLES 450', provincia: 'LIMA', departamento: 'LIMA', localidad: 'SAN ISIDRO', telefono: '', tipoContribuyente: 'PJ', identificador: '20501234567', fechaAlta: '01/02/2016' },
    { codigo: '1', razonSocial: 'CORPORACION LOGISTICA DEL CENTRO SAC', anulado: false, domicilio: 'AV. ARGENTINA N°...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '3136000..3136..', tipoContribuyente: 'PJ', identificador: '20100039207', fechaAlta: '27/06/2015' },
    { codigo: '2', razonSocial: 'RANSA COMERCIAL SA', anulado: false, domicilio: 'GREGORIO PAREDE...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '4313980', tipoContribuyente: 'PJ', identificador: '20508778920', fechaAlta: '23/02/2016' },
    { codigo: '3', razonSocial: 'INVERSIONES QUISSEL SRL', anulado: false, domicilio: 'AV ANTENOR ORR...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '044266065', tipoContribuyente: 'PJ', identificador: '20539721870', fechaAlta: '27/01/2020' },
    { codigo: '4', razonSocial: 'PROTEKTOR SEGURIDAD INTEGRAL S.A.C.', anulado: false, domicilio: 'AV ANTENOR ORR...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '2053607783', fechaAlta: '27/03/2020' },
    { codigo: '9', razonSocial: 'ESSALUD', anulado: false, domicilio: 'AV. SALAVERRY N°...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '20348624866', fechaAlta: '22/01/2020' },
    { codigo: '13', razonSocial: 'MERCANTIL INCA S.A.', anulado: false, domicilio: 'CALLE TIZON Y BU...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '2211259', tipoContribuyente: 'PJ', identificador: '20451583060', fechaAlta: '29/10/2016' },
    { codigo: '14', razonSocial: 'INVERSIONES WARNER MIC S.R.L.', anulado: false, domicilio: 'AV LA ALAMEDA S...', provincia: 'LIMA', departamento: 'LIMA', localidad: 'CHORRILLOS', telefono: '', tipoContribuyente: 'PJ', identificador: '20482656494', fechaAlta: '30/11/2016' },
    { codigo: '15', razonSocial: 'BODEGAS DON LUIS S.A.C.', anulado: false, domicilio: 'MZA. E LOTE. 16 U...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '763323', tipoContribuyente: 'PN', identificador: '10419440502', fechaAlta: '30/11/2016' },
    { codigo: '16', razonSocial: 'BALLARES NARRO WALTER PAUL', anulado: false, domicilio: 'MZ. C LT 1 URB LA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '20465876345', fechaAlta: '29/02/2020' },
    { codigo: '17', razonSocial: 'SERVICIOS LAS FLORES DEL GOLF S.A.C', anulado: false, domicilio: 'JR. PASEO DEL BO...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20131872233', fechaAlta: '01/01/1900' },
    { codigo: '18', razonSocial: 'AEROPAGO SA', anulado: false, domicilio: 'AV. JOSE FAUSTIN...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10467853321', fechaAlta: '01/01/1900' },
    { codigo: '19', razonSocial: 'ALATA CJUNO SONIA', anulado: false, domicilio: 'CARR. PANAMERIC...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '291010', tipoContribuyente: 'PJ', identificador: '20100128056', fechaAlta: '01/01/1900' },
    { codigo: '20', razonSocial: 'AGROBEX S.A.C.', anulado: false, domicilio: 'AV. PASEO DE LA R...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '20131872233', fechaAlta: '27/06/2018' },
    { codigo: '21', razonSocial: 'SAGA FALABELLA S.A.', anulado: false, domicilio: 'AV. PASEO DE LA R...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '20100128056', fechaAlta: '31/07/2018' },
    { codigo: '22', razonSocial: 'ALEJANDRO ARAUJO LUIS ERNESTO', anulado: false, domicilio: 'CAL.SANTO TOMA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10068142437', fechaAlta: '01/01/1900' },
    { codigo: '23', razonSocial: 'ALMACENES Y LOGISTICA DEL SUR S.A.C', anulado: false, domicilio: 'CAR.PANAMERICA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20535198901', fechaAlta: '01/01/1900' },
    { codigo: '24', razonSocial: 'AMERICA EXPRESS S.A.', anulado: false, domicilio: 'AV. 28 DE JULIO N...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20114111342', fechaAlta: '20/12/2019' },
    { codigo: '25', razonSocial: 'AMERICA MOVIL PERU S.A.C.', anulado: false, domicilio: 'AV. NICOLAS ARRI...', provincia: 'LIMA', departamento: 'LIMA', localidad: 'LA VICTORIA', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20467534026', fechaAlta: '06/01/2020' },
    { codigo: '26', razonSocial: 'ANDINA SERVICIOS Y REPRESENTACIONES EIRL', anulado: false, domicilio: 'JR. AMALIA PUGA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20113742047', fechaAlta: '01/01/1900' },
    { codigo: '27', razonSocial: 'ANTARA CHAVEZ KELY LISETH', anulado: true, domicilio: 'SIN DIRECCIÓN', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10470898577', fechaAlta: '01/01/1900' },
    { codigo: '28', razonSocial: 'AREQUIPA EXPRESO MARVISUR EIRL', anulado: false, domicilio: 'CAL. GARCI CARBA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20498199637', fechaAlta: '13/01/2020' },
    { codigo: '29', razonSocial: 'AUTO CENTER PERU S.A.C.', anulado: false, domicilio: 'AV. ANTENOR ORR...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20477535209', fechaAlta: '10/01/2020' },
    { codigo: '30', razonSocial: 'AUTOPISTA DEL NORTE S.A.C.', anulado: false, domicilio: 'AV. 28 DE JULIO N...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20520929658', fechaAlta: '08/01/2020' },
    { codigo: '31', razonSocial: 'AVA TRADING SOCIEDAD ANONIMA - AVA TRADING S...', anulado: false, domicilio: 'AV. REPUBLICA DE...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20565643496', fechaAlta: '01/01/1900' },
    { codigo: '32', razonSocial: 'BARNUEVO CUELLAR GINO EMILIO ERNESTO', anulado: false, domicilio: 'CAL ACACIAS N° 1...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10076217233', fechaAlta: '15/01/2020' },
    { codigo: '33', razonSocial: 'BAUER LUBRICENTROS S.A.C.', anulado: false, domicilio: 'AV. JOSE PARDO N...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20569290610', fechaAlta: '01/01/1900' },
    { codigo: '34', razonSocial: 'BENITES HATADA JUAN ANTONIO', anulado: false, domicilio: 'SIN DIRECCIÓN', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10178002584', fechaAlta: '01/01/1900' },
    { codigo: '35', razonSocial: 'CARGO EXPRESS AMERICANO S.A.C.', anulado: false, domicilio: 'NRO. S/N INT. B-12...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20532029008', fechaAlta: '06/01/2020' },
    { codigo: '36', razonSocial: 'CORPORACION LOGISTICA DEL CENTRO S.A.C.', anulado: false, domicilio: 'AV. LOS ROBLES 450', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20501234567', fechaAlta: '06/01/2020' },
    { codigo: '37', razonSocial: 'CENTRAL PARKING SYSTEM PERU S.A.', anulado: false, domicilio: 'AV. JAVIER PRADO...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20505205791', fechaAlta: '01/01/1900' },
  ]);

  protected handleNew(): void {
    console.info('Nuevo proveedor/cliente solicitado');
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} ejecutada para:`, evt.item.razonSocial);
  }
}
