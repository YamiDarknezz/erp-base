import { TestBed } from '@angular/core/testing';
import { BranchContextService, DEFAULT_BRANCHES } from './branch-context.service';

describe('BranchContextService', () => {
  let service: BranchContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchContextService);
    service.resetToDefault();
  });

  it('should be created with default branches and active branch', () => {
    expect(service).toBeTruthy();
    expect(service.branches().length).toBe(DEFAULT_BRANCHES.length);
    expect(service.activeBranchName()).toBe(DEFAULT_BRANCHES[0].name);
  });

  it('should select branch by id or name', () => {
    service.selectBranch('callao');
    expect(service.activeBranchName()).toBe('ALMACÉN PRINCIPAL CALLAO');

    service.selectBranch('SUCURSAL NORTE CHICLAYO');
    expect(service.activeBranchName()).toBe('SUCURSAL NORTE CHICLAYO');
  });

  it('should allow setting branches dynamically', () => {
    service.setBranches([
      { id: 'arequipa', name: 'SEDE SUR AREQUIPA', code: '004', address: 'Av. Ejército 100' },
    ]);

    expect(service.branches().length).toBe(1);
    expect(service.activeBranchName()).toBe('SEDE SUR AREQUIPA');
  });
});
