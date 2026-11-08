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

  it('should paginate items according to pageSize and navigate pages correctly', () => {
    const fixture = TestBed.createComponent(DataGrid);
    const manyItems = Array.from({ length: 25 }, (_, i) => ({
      codigo: `C${i + 1}`,
      nombre: `Item ${i + 1}`,
      anulado: false,
    }));
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', manyItems);
    fixture.componentRef.setInput('responsiveRows', false);
    fixture.componentRef.setInput('defaultPageSize', 10);
    fixture.detectChanges();

    const instance = fixture.componentInstance;
    instance['pageSize'].set(10);
    expect(instance['totalFiltered']()).toBe(25);
    expect(instance['totalPages']()).toBe(3);
    expect(instance['paginatedData']().length).toBe(10);
    expect(instance['currentPage']()).toBe(1);

    instance['goToNextPage']();
    expect(instance['currentPage']()).toBe(2);
    expect(instance['paginatedData']()[0].codigo).toBe('C11');

    instance['goToLastPage']();
    expect(instance['currentPage']()).toBe(3);
    expect(instance['paginatedData']().length).toBe(5);

    instance['goToPrevPage']();
    expect(instance['currentPage']()).toBe(2);

    instance['goToFirstPage']();
    expect(instance['currentPage']()).toBe(1);
  });

  it('should reset to page 1 when search query changes', () => {
    const fixture = TestBed.createComponent(DataGrid);
    const manyItems = Array.from({ length: 25 }, (_, i) => ({
      codigo: `C${i + 1}`,
      nombre: `Item ${i + 1}`,
      anulado: false,
    }));
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', manyItems);
    fixture.componentRef.setInput('responsiveRows', false);
    fixture.detectChanges();

    const instance = fixture.componentInstance;
    instance['pageSize'].set(10);
    instance['goToNextPage']();
    expect(instance['currentPage']()).toBe(2);

    instance['searchQuery'].set('Item 1');
    fixture.detectChanges();
    expect(instance['currentPage']()).toBe(1);
  });
});
