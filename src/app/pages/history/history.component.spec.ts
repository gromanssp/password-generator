import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { HistoryService } from '../../services/history.service';
import { ToastService } from '../../services/toast.service';
import { EncryptionService } from '../../services/encryption.service';

class MockEncryptionService {
  async encrypt(plaintext: string): Promise<string> {
    return btoa(unescape(encodeURIComponent(plaintext)));
  }
  async decrypt(ciphertext: string): Promise<string> {
    try {
      return decodeURIComponent(escape(atob(ciphertext)));
    } catch {
      return '';
    }
  }
  isKeyAvailable(): boolean { return true; }
}

describe('HistoryComponent', () => {
  let fixture: ComponentFixture<HistoryComponent>;
  let component: HistoryComponent;
  let historyService: HistoryService;
  let toastService: ToastService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [{ provide: EncryptionService, useClass: MockEncryptionService }],
    });
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    historyService = TestBed.inject(HistoryService);
    toastService = TestBed.inject(ToastService);

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
    });

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty search query', () => {
    expect(component.searchQuery).toBe('');
  });

  it('should default to all filter', () => {
    expect(component.filter()).toBe('all');
  });

  it('should have empty list initially', () => {
    expect(component.filteredEntries().length).toBe(0);
  });

  it('should switch filter to favorites', () => {
    component.filter.set('favorites');
    expect(component.filter()).toBe('favorites');
  });

  it('should filter entries by search query', async () => {
    await historyService.add('SecretPass!', 'Banking', 90);
    await historyService.add('SimplePass', 'Email', 50);

    component.searchQuery = 'Banking';
    fixture.detectChanges();

    expect(component.filteredEntries().length).toBe(1);
    expect(component.filteredEntries()[0].context).toBe('Banking');
  });

  it('should filter by password content', async () => {
    await historyService.add('MySecret99', 'Test', 80);
    component.searchQuery = 'Secret';
    fixture.detectChanges();
    expect(component.filteredEntries().length).toBe(1);
  });

  it('should mask password', () => {
    expect(component.maskPassword('abcdefgh')).toBe('ab••••gh');
  });

  it('should mask very short passwords completely', () => {
    expect(component.maskPassword('abc')).toBe('•••');
  });

  it('should toggle password visibility', async () => {
    await historyService.add('visiblePass', 'Test', 70);
    const id = historyService.entries()[0].id;

    expect(component.visiblePasswords().has(id)).toBe(false);
    component.toggleVisibility(id);
    expect(component.visiblePasswords().has(id)).toBe(true);
    component.toggleVisibility(id);
    expect(component.visiblePasswords().has(id)).toBe(false);
  });

  it('should copy entry to clipboard', async () => {
    const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText');
    const toastSpy = vi.spyOn(toastService, 'show');

    await historyService.add('CopyPass!', 'Test', 80);
    const entry = historyService.entries()[0];
    await component.copyEntry(entry);

    expect(clipboardSpy).toHaveBeenCalledWith('CopyPass!');
    expect(toastSpy).toHaveBeenCalledWith('Password copied!', 'success');
  });

  it('should format date', () => {
    const formatted = component.formatDate('2026-01-15T10:30:00');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
  });

  it('should return correct strength class', () => {
    expect(component.getStrengthClass(85)).toBe('strong');
    expect(component.getStrengthClass(50)).toBe('medium');
    expect(component.getStrengthClass(20)).toBe('weak');
  });

  it('should clear all entries', async () => {
    await historyService.add('pass1', 'A', 50);
    await historyService.add('pass2', 'B', 60);
    expect(historyService.entries().length).toBe(2);

    const toastSpy = vi.spyOn(toastService, 'show');
    await component.clearAll();

    expect(historyService.entries().length).toBe(0);
    expect(toastSpy).toHaveBeenCalledWith('History cleared', 'info');
  });

  it('should show favorites only when filter is favorites', async () => {
    await historyService.add('pass1', 'A', 50);
    await historyService.add('pass2', 'B', 60);
    await historyService.toggleFavorite(historyService.entries()[0].id);

    component.filter.set('favorites');
    fixture.detectChanges();

    expect(component.filteredEntries().length).toBe(1);
  });
});
