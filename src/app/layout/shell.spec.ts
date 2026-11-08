import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Shell } from './shell';

describe('Shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the shell component', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should start with sidebar closed', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    expect(component['sidebarOpen']()).toBe(false);
  });

  it('should toggle sidebar when toggleSidebar is called', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    component.toggleSidebar();
    expect(component['sidebarOpen']()).toBe(true);
    component.closeSidebar();
    expect(component['sidebarOpen']()).toBe(false);
  });

  it('should open and close permissions modal', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    expect(component['permissionsOpen']()).toBe(false);
    component.openPermissions();
    expect(component['permissionsOpen']()).toBe(true);
    component.savePermissions();
    expect(component['permissionsOpen']()).toBe(false);
  });

  it('should open and close profile modal', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    expect(component['profileOpen']()).toBe(false);
    component.openProfile();
    expect(component['profileOpen']()).toBe(true);
    component.saveProfile();
    expect(component['profileOpen']()).toBe(false);
  });

  it('should open and close account modal', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    expect(component['accountOpen']()).toBe(false);
    component.openAccount();
    expect(component['accountOpen']()).toBe(true);
    component.closeAccount();
    expect(component['accountOpen']()).toBe(false);
  });

  it('should switch active branch', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    expect(component['selectedBranch']()).toBe('SEDE CENTRAL LIMA');
    component.selectBranch('ALMACÉN PRINCIPAL CALLAO');
    expect(component['selectedBranch']()).toBe('ALMACÉN PRINCIPAL CALLAO');
  });

  it('should toggle and filter spotlight items', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    expect(component['spotlightOpen']()).toBe(false);
    component.toggleSpotlight();
    expect(component['spotlightOpen']()).toBe(true);

    component['spotlightQuery'].set('facturacion');
    expect(component['filteredSpotlightItems']().some(i => i.title.includes('Facturación'))).toBe(true);

    component.closeSpotlight();
    expect(component['spotlightOpen']()).toBe(false);
  });

  it('should dismiss and clear notifications', () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;
    const initialCount = component['notifications']().length;
    expect(initialCount).toBeGreaterThan(0);

    const firstId = component['notifications']()[0].id;
    component.dismissNotification(firstId);
    expect(component['notifications']().length).toBe(initialCount - 1);

    component.clearAllNotifications();
    expect(component['notifications']().length).toBe(0);
  });
});
