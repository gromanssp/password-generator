import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

function createService(): ThemeService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  return TestBed.inject(ThemeService);
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should be created', () => {
    mockMatchMedia(false);
    const service = createService();
    expect(service).toBeTruthy();
  });

  it('should start with dark theme when no preference stored and system prefers dark', () => {
    mockMatchMedia(false);
    const service = createService();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should start with light theme when system prefers light', () => {
    mockMatchMedia(true);
    const service = createService();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should restore saved theme from localStorage', () => {
    localStorage.setItem('securegen-theme', 'light');
    mockMatchMedia(false);
    const service = createService();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should toggle between light and dark', () => {
    mockMatchMedia(false);
    const service = createService();
    expect(service.theme()).toBe('dark');
    service.toggle();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('securegen-theme')).toBe('light');
    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('securegen-theme')).toBe('dark');
  });

  it('should set a specific theme', () => {
    mockMatchMedia(false);
    const service = createService();
    service.set('light');
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    service.set('dark');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should persist theme choice to localStorage', () => {
    mockMatchMedia(false);
    const service = createService();
    service.set('light');
    expect(localStorage.getItem('securegen-theme')).toBe('light');
    service.set('dark');
    expect(localStorage.getItem('securegen-theme')).toBe('dark');
  });
});
