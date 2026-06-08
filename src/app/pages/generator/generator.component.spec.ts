import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneratorComponent } from './generator.component';
import { PasswordService } from '../../services/password.service';
import { StrengthService } from '../../services/strength.service';
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

describe('GeneratorComponent', () => {
  let fixture: ComponentFixture<GeneratorComponent>;
  let component: GeneratorComponent;
  let passwordService: PasswordService;
  let historyService: HistoryService;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GeneratorComponent],
      providers: [{ provide: EncryptionService, useClass: MockEncryptionService }],
    });
    fixture = TestBed.createComponent(GeneratorComponent);
    component = fixture.componentInstance;
    passwordService = TestBed.inject(PasswordService);
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

  it('should start with no selected context', () => {
    expect(component.selectedContext()).toBeNull();
  });

  it('should have default config with 16 length', () => {
    expect(component.config().length).toBe(16);
    expect(component.config().uppercase).toBe(true);
    expect(component.config().lowercase).toBe(true);
    expect(component.config().numbers).toBe(true);
    expect(component.config().symbols).toBe(true);
  });

  it('should select a context and update config', () => {
    const banking = passwordService.contexts[0];
    component.selectContext(banking);
    expect(component.selectedContext()?.id).toBe('banking');
    expect(component.config().length).toBe(24);
  });

  it('should update length', () => {
    component.updateLength(32);
    expect(component.config().length).toBe(32);
  });

  it('should update config booleans', () => {
    component.updateConfig('uppercase', false);
    expect(component.config().uppercase).toBe(false);
  });

  it('should generate a password', () => {
    component.generate();
    expect(component.generatedPassword().length).toBe(16);
  });

  it('should update strengthResult after generation', () => {
    expect(component.strengthResult().score).toBe(0);
    component.generate();
    expect(component.strengthResult().score).toBeGreaterThan(0);
  });

  it('should copy password to clipboard', async () => {
    const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText');
    const toastSpy = vi.spyOn(toastService, 'show');

    component.generate();
    const pwd = component.generatedPassword();
    await component.copy();

    expect(clipboardSpy).toHaveBeenCalledWith(pwd);
    expect(toastSpy).toHaveBeenCalledWith('Password copied to clipboard!', 'success');
  });

  it('should save password to history', async () => {
    const historySpy = vi.spyOn(historyService, 'add');
    const toastSpy = vi.spyOn(toastService, 'show');

    component.selectContext(passwordService.contexts[0]);
    component.generate();
    await component.saveToHistory();

    expect(historySpy).toHaveBeenCalledWith(
      component.generatedPassword(),
      'Banking & Finance',
      component.strengthResult().score,
    );
    expect(toastSpy).toHaveBeenCalledWith('Password saved to history', 'success');
  });

  it('should save with Custom context when none selected', async () => {
    const historySpy = vi.spyOn(historyService, 'add');
    component.generate();
    await component.saveToHistory();
    expect(historySpy).toHaveBeenCalledWith(
      expect.any(String),
      'Custom',
      expect.any(Number),
    );
  });
});
