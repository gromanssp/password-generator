import { TestBed } from '@angular/core/testing';
import { PasswordService, PasswordConfig } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have 7 predefined contexts', () => {
    expect(service.contexts.length).toBe(7);
    expect(service.contexts[0].id).toBe('banking');
    expect(service.contexts[6].id).toBe('custom');
  });

  it('should generate a password with default config', () => {
    const config: PasswordConfig = {
      length: 16, uppercase: true, lowercase: true,
      numbers: true, symbols: true,
      excludeAmbiguous: false, excludeSimilar: false,
    };
    const password = service.generate(config);
    expect(password.length).toBe(16);
    expect(service.generatedPassword()).toBe(password);
  });

  it('should generate password with correct length', () => {
    const config: PasswordConfig = {
      length: 32, uppercase: true, lowercase: true,
      numbers: true, symbols: false,
      excludeAmbiguous: false, excludeSimilar: false,
    };
    const password = service.generate(config);
    expect(password.length).toBe(32);
  });

  it('should exclude ambiguous characters', () => {
    const config: PasswordConfig = {
      length: 100, uppercase: true, lowercase: true,
      numbers: true, symbols: true,
      excludeAmbiguous: true, excludeSimilar: false,
    };
    const password = service.generate(config);
    const ambiguous = '{}[]()/\'"`~,;:.<>';
    for (const char of password) {
      expect(ambiguous).not.toContain(char);
    }
  });

  it('should exclude similar characters', () => {
    const config: PasswordConfig = {
      length: 100, uppercase: true, lowercase: true,
      numbers: true, symbols: false,
      excludeAmbiguous: false, excludeSimilar: true,
    };
    const password = service.generate(config);
    const similar = 'il1Lo0O';
    for (const char of password) {
      expect(similar).not.toContain(char);
    }
  });

  it('should use only lowercase and numbers when no char types selected', () => {
    const config: PasswordConfig = {
      length: 20, uppercase: false, lowercase: false,
      numbers: false, symbols: false,
      excludeAmbiguous: false, excludeSimilar: false,
    };
    const password = service.generate(config);
    expect(password.length).toBe(20);
    expect(password).toMatch(/^[a-z0-9]+$/);
  });

  it('should use crypto.getRandomValues', () => {
    const cryptoSpy = vi.spyOn(crypto, 'getRandomValues');
    const config: PasswordConfig = {
      length: 16, uppercase: true, lowercase: true,
      numbers: true, symbols: false,
      excludeAmbiguous: false, excludeSimilar: false,
    };
    service.generate(config);
    expect(cryptoSpy).toHaveBeenCalled();
    cryptoSpy.mockRestore();
  });

  it('should update generatedPassword signal', () => {
    const config: PasswordConfig = {
      length: 10, uppercase: true, lowercase: true,
      numbers: true, symbols: true,
      excludeAmbiguous: false, excludeSimilar: false,
    };
    const password = service.generate(config);
    expect(service.generatedPassword()).toBe(password);
  });

  it('should generate unique passwords each time', () => {
    const config: PasswordConfig = {
      length: 16, uppercase: true, lowercase: true,
      numbers: true, symbols: true,
      excludeAmbiguous: false, excludeSimilar: false,
    };
    const p1 = service.generate(config);
    const p2 = service.generate(config);
    expect(p1).not.toBe(p2);
  });

  it('should not contain whitespace characters', () => {
    const config: PasswordConfig = {
      length: 64, uppercase: true, lowercase: true,
      numbers: true, symbols: true,
      excludeAmbiguous: false, excludeSimilar: false,
    };
    const password = service.generate(config);
    expect(password).not.toMatch(/\s/);
  });
});
