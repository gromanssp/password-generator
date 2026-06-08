import { Injectable, signal, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    if (this.isBrowser) {
      this.apply(this.theme());
    }
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) return 'dark';
    const stored = localStorage.getItem('securegen-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  toggle(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.set(next);
  }

  set(theme: Theme): void {
    this.theme.set(theme);
    if (this.isBrowser) {
      localStorage.setItem('securegen-theme', theme);
      this.apply(theme);
    }
  }

  private apply(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
