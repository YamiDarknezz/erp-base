import { TestBed } from '@angular/core/testing';
import { DataGrid, GridColumn } from './data-grid';

describe('DataGrid', () => {
  const mockColumns: GridColumn[] = [
    { field: 'codigo', header: 'CÓDIGO' },
    { field: 'nombre', header: 'NOMBRE' },
  ];

  const mockData = [
    { codigo: '001', nombre: 'Item A', anulado: false },
    { codigo: '002', nombre: 'Item B', anulado: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGrid],
    }).compileComponents();
  });

  it('should create DataGrid', () => {
    const fixture = TestBed.createComponent(DataGrid);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should toggle column visibility when toggleColumnVisibility is called', () => {
    const fixture = TestBed.createComponent(DataGrid);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const instance = fixture.componentInstance;
    expect(instance['visibleColumns']().length).toBe(2);

    instance['toggleColumnVisibility']('codigo');
    expect(instance['visibleColumns']().length).toBe(1);
    expect(instance['visibleColumns']()[0].field).toBe('nombre');
  });

  it('should toggle configuration panel', () => {
    const fixture = TestBed.createComponent(DataGrid);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const instance = fixture.componentInstance;
    expect(instance['isConfigOpen']()).toBe(false);

    instance['toggleConfig']();
    expect(instance['isConfigOpen']()).toBe(true);

    instance['closeConfig']();
    expect(instance['isConfigOpen']()).toBe(false);
  });
});
