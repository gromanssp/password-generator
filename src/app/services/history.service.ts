import { Injectable, signal, computed, inject } from '@angular/core';
import { generateId } from '../utils/id';
import { EncryptionService } from './encryption.service';

export interface PasswordEntry {
  id: string;
  password: string;
  context: string;
  createdAt: string;
  strength: number;
  favorite: boolean;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly STORAGE_KEY = 'pwd_history';
  private readonly encryption = inject(EncryptionService);
  entries = signal<PasswordEntry[]>([]);

  favorites = computed(() => this.entries().filter(e => e.favorite));

  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.load();
  }

  async add(password: string, context: string, strength: number): Promise<void> {
    await this.initPromise;
    const entry: PasswordEntry = {
      id: generateId(),
      password,
      context,
      createdAt: new Date().toISOString(),
      strength,
      favorite: false,
    };
    const updated = [entry, ...this.entries()].slice(0, 50);
    this.entries.set(updated);
    await this.save(updated);
  }

  async toggleFavorite(id: string): Promise<void> {
    await this.initPromise;
    const updated = this.entries().map(e =>
      e.id === id ? { ...e, favorite: !e.favorite } : e
    );
    this.entries.set(updated);
    await this.save(updated);
  }

  async remove(id: string): Promise<void> {
    await this.initPromise;
    const updated = this.entries().filter(e => e.id !== id);
    this.entries.set(updated);
    await this.save(updated);
  }

  async clear(): Promise<void> {
    await this.initPromise;
    this.entries.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private async load(): Promise<void> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const decrypted = await this.encryption.decrypt(data);
        this.entries.set(decrypted ? JSON.parse(decrypted) : []);
      }
    } catch {
      this.entries.set([]);
    }
  }

  private async save(entries: PasswordEntry[]): Promise<void> {
    const encrypted = await this.encryption.encrypt(JSON.stringify(entries));
    localStorage.setItem(this.STORAGE_KEY, encrypted);
  }
}
