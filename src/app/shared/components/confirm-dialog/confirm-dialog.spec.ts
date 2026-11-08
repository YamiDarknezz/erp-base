import { TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog';
import { ConfirmDialogService } from '../../../core/dialog/confirm-dialog.service';

describe('ConfirmDialog', () => {
  let confirmService: ConfirmDialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [ConfirmDialogService],
    }).compileComponents();

    confirmService = TestBed.inject(ConfirmDialogService);
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render dialog when confirmService is open', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    confirmService.confirm({ title: 'Test Title', message: 'Test Message' });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Test Title');
    expect(el.textContent).toContain('Test Message');
  });
});
