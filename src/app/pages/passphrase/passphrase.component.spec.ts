import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassphraseComponent } from './passphrase.component';
import { PassphraseService } from '../../services/passphrase.service';
import { ToastService } from '../../services/toast.service';
import { HistoryService } from '../../services/history.service';
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

describe('PassphraseComponent', () => {
  let fixture: ComponentFixture<PassphraseComponent>;
  let component: PassphraseComponent;
  let passphraseService: PassphraseService;
  let toastService: ToastService;
  let historyService: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PassphraseComponent],
      providers: [{ provide: EncryptionService, useClass: MockEncryptionService }],
    });
    fixture = TestBed.createComponent(PassphraseComponent);
    component = fixture.componentInstance;
    passphraseService = TestBed.inject(PassphraseService);
    toastService = TestBed.inject(ToastService);
    historyService = TestBed.inject(HistoryService);

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
    });

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have default config with 4 words', () => {
    expect(component.config().wordCount).toBe(4);
    expect(component.config().separator).toBe('-');
    expect(component.config().capitalize).toBe(false);
    expect(component.config().includeNumber).toBe(false);
  });

  it('should have 6 separator options', () => {
    expect(component.separators.length).toBe(6);
  });

  it('should update config', () => {
    component.updateConfig('wordCount', 6);
    expect(component.config().wordCount).toBe(6);

    component.updateConfig('capitalize', true);
    expect(component.config().capitalize).toBe(true);

    component.updateConfig('separator', '.');
    expect(component.config().separator).toBe('.');
  });

  it('should generate a passphrase', () => {
    expect(component.passphrase()).toBe('');
    component.generate();
    expect(component.passphrase()).toBeTruthy();
    expect(component.passphrase().length).toBeGreaterThan(0);
  });

  it('should compute strength after generation', () => {
    component.generate();
    expect(component.strengthResult().score).toBeGreaterThan(0);
  });

  it('should estimate entropy', () => {
    expect(component.estimatedEntropy()).toBeGreaterThan(0);
  });

  it('should update entropy when config changes', () => {
    const before = component.estimatedEntropy();
    component.updateConfig('wordCount', 6);
    expect(component.estimatedEntropy()).toBeGreaterThan(before);
  });

  it('should copy passphrase to clipboard', async () => {
    const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText');
    const toastSpy = vi.spyOn(toastService, 'show');

    component.generate();
    const phrase = component.passphrase();
    await component.copy();

    expect(clipboardSpy).toHaveBeenCalledWith(phrase);
    expect(toastSpy).toHaveBeenCalledWith('Passphrase copied!', 'success');
  });

  it('should save passphrase to history', async () => {
    const historySpy = vi.spyOn(historyService, 'add');
    const toastSpy = vi.spyOn(toastService, 'show');

    component.generate();
    await component.save();

    expect(historySpy).toHaveBeenCalledWith(
      component.passphrase(),
      'Passphrase',
      component.strengthResult().score,
    );
    expect(toastSpy).toHaveBeenCalledWith('Passphrase saved to history', 'success');
  });
});
