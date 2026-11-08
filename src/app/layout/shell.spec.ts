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
});
