import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty toasts', () => {
    expect(service.toasts().length).toBe(0);
  });

  it('should add a toast', () => {
    service.show('Test message', 'success');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Test message');
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should default to success type', () => {
    service.show('Default type');
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should support different toast types', () => {
    service.show('Error!', 'error');
    service.show('Warning!', 'warning');
    service.show('Info!', 'info');
    expect(service.toasts().length).toBe(3);
    expect(service.toasts().map(t => t.type)).toEqual(['error', 'warning', 'info']);
  });

  it('should dismiss a toast', () => {
    service.show('Toast 1', 'info');
    service.show('Toast 2', 'success');
    const id = service.toasts()[0].id;
    service.dismiss(id);
    vi.advanceTimersByTime(250);
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Toast 2');
  });

  it('should auto-dismiss after 3 seconds', () => {
    service.show('Auto dismiss', 'info');
    expect(service.toasts().length).toBe(1);

    vi.advanceTimersByTime(3250);
    expect(service.toasts().length).toBe(0);
  });

  it('should not auto-dismiss before 3 seconds', () => {
    service.show('Still visible', 'info');
    vi.advanceTimersByTime(2999);
    expect(service.toasts().length).toBe(1);
  });

  it('should generate unique IDs for each toast', () => {
    service.show('One', 'success');
    service.show('Two', 'error');
    expect(service.toasts()[0].id).not.toBe(service.toasts()[1].id);
  });
});
