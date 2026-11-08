import { TestBed } from '@angular/core/testing';
import { SearchableSelect, SelectOption } from './searchable-select';

describe('SearchableSelect', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchableSelect],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SearchableSelect);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should filter options by search query', () => {
    const fixture = TestBed.createComponent(SearchableSelect);
    const component = fixture.componentInstance;
    const testOptions: SelectOption[] = [
      { value: '1', label: 'CORPORACION LOGISTICA DEL CENTRO SAC', sublabel: '20100039207' },
      { value: '2', label: 'RANSA COMERCIAL SA', sublabel: '20508778920' },
      { value: '3', label: 'SAGA FALABELLA S.A.', sublabel: '20100128056' },
    ];
    fixture.componentRef.setInput('options', testOptions);
    fixture.detectChanges();

    component.open();
    expect(component['filteredOptions']().length).toBe(3);

    component['searchQuery'].set('ransa');
    expect(component['filteredOptions']().length).toBe(1);
    expect(component['filteredOptions']()[0].label).toBe('RANSA COMERCIAL SA');
  });

  it('should select an option and close popup', () => {
    const fixture = TestBed.createComponent(SearchableSelect);
    const component = fixture.componentInstance;
    const testOptions: SelectOption[] = [
      { value: '1', label: 'CORPORACION LOGISTICA DEL CENTRO SAC' },
    ];
    fixture.componentRef.setInput('options', testOptions);
    fixture.detectChanges();

    component.open();
    expect(component['isOpen']()).toBe(true);

    component.selectOption(testOptions[0]);
    expect(component.value()).toBe('1');
    expect(component['isOpen']()).toBe(false);
  });
});
