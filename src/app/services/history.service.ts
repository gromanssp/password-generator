import { Injectable, signal, computed } from '@angular/core';

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
  entries = signal<PasswordEntry[]>(this.load());

  favorites = computed(() => this.entries().filter(e => e.favorite));

  add(password: string, context: string, strength: number): void {
    const entry: PasswordEntry = {
      id: crypto.randomUUID(),
      password,
      context,
      createdAt: new Date().toISOString(),
      strength,
      favorite: false
    };
    const updated = [entry, ...this.entries()].slice(0, 50);
    this.entries.set(updated);
    this.save(updated);
  }

  toggleFavorite(id: string): void {
    const updated = this.entries().map(e =>
      e.id === id ? { ...e, favorite: !e.favorite } : e
    );
    this.entries.set(updated);
    this.save(updated);
  }

  remove(id: string): void {
    const updated = this.entries().filter(e => e.id !== id);
    this.entries.set(updated);
    this.save(updated);
  }

  clear(): void {
    this.entries.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private load(): PasswordEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private save(entries: PasswordEntry[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
  }
}
