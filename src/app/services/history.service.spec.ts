import { TestBed } from '@angular/core/testing';
import { HistoryService, PasswordEntry } from './history.service';
import { EncryptionService } from './encryption.service';

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

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: EncryptionService, useClass: MockEncryptionService }],
    });
    service = TestBed.inject(HistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty entries', () => {
    expect(service.entries().length).toBe(0);
  });

  it('should add a password entry', async () => {
    await service.add('TestPass123!', 'Banking', 85);
    expect(service.entries().length).toBe(1);
    expect(service.entries()[0].password).toBe('TestPass123!');
    expect(service.entries()[0].context).toBe('Banking');
    expect(service.entries()[0].strength).toBe(85);
    expect(service.entries()[0].favorite).toBe(false);
  });

  it('should generate unique IDs for entries', async () => {
    await service.add('pass1', 'A', 50);
    await service.add('pass2', 'B', 60);
    expect(service.entries()[0].id).not.toBe(service.entries()[1].id);
  });

  it('should limit to 50 entries', async () => {
    for (let i = 0; i < 60; i++) {
      await service.add(`pass${i}`, 'Test', i);
    }
    expect(service.entries().length).toBe(50);
    expect(service.entries()[0].password).toBe('pass59');
  });

  it('should toggle favorite', async () => {
    await service.add('TestPass', 'Test', 50);
    const id = service.entries()[0].id;
    expect(service.entries()[0].favorite).toBe(false);

    await service.toggleFavorite(id);
    expect(service.entries()[0].favorite).toBe(true);

    await service.toggleFavorite(id);
    expect(service.entries()[0].favorite).toBe(false);
  });

  it('should compute favorites correctly', async () => {
    await service.add('pass1', 'A', 50);
    await service.add('pass2', 'B', 60);
    await service.add('pass3', 'C', 70);
    await service.toggleFavorite(service.entries()[0].id);
    await service.toggleFavorite(service.entries()[2].id);

    expect(service.favorites().length).toBe(2);
    expect(service.favorites().some(e => e.password === 'pass1')).toBe(true);
    expect(service.favorites().some(e => e.password === 'pass3')).toBe(true);
  });

  it('should remove an entry', async () => {
    await service.add('pass1', 'A', 50);
    await service.add('pass2', 'B', 60);
    const id = service.entries()[0].id;
    await service.remove(id);
    expect(service.entries().length).toBe(1);
    expect(service.entries()[0].password).toBe('pass1');
  });

  it('should clear all entries', async () => {
    await service.add('pass1', 'A', 50);
    await service.add('pass2', 'B', 60);
    await service.clear();
    expect(service.entries().length).toBe(0);
  });

  it('should persist to localStorage', async () => {
    await service.add('persistedPass', 'Test', 75);
    const raw = localStorage.getItem('pwd_history');
    expect(raw).toBeTruthy();
    const decrypted = decodeURIComponent(escape(atob(raw!)));
    const parsed = JSON.parse(decrypted);
    expect(parsed.length).toBe(1);
    expect(parsed[0].password).toBe('persistedPass');
  });

  it('should load from localStorage on init', async () => {
    const entry: PasswordEntry = {
      id: 'test-id',
      password: 'preloaded',
      context: 'Test', createdAt: new Date().toISOString(),
      strength: 90, favorite: true,
    };
    const encrypted = btoa(unescape(encodeURIComponent(JSON.stringify([entry]))));
    localStorage.setItem('pwd_history', encrypted);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: EncryptionService, useClass: MockEncryptionService }],
    });
    const newService = TestBed.inject(HistoryService);
    await newService['initPromise'];
    expect(newService.entries().length).toBe(1);
    expect(newService.entries()[0].password).toBe('preloaded');
    expect(newService.entries()[0].favorite).toBe(true);
  });

  it('should handle corrupted localStorage gracefully', async () => {
    localStorage.setItem('pwd_history', '{invalid json');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: EncryptionService, useClass: MockEncryptionService }],
    });
    const newService = TestBed.inject(HistoryService);
    await newService['initPromise'];
    expect(newService.entries().length).toBe(0);
  });

  it('should use generateId for IDs', async () => {
    await service.add('test', 'Test', 50);
    expect(service.entries()[0].id).toBeTruthy();
    expect(service.entries()[0].id).toMatch(/^[0-9a-f-]+$/);
  });
});
