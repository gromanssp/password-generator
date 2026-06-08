import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService, Locale } from '../../../services/translation.service';

const FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
  it: '🇮🇹',
  hi: '🇮🇳',
  fr: '🇫🇷',
};

const LABELS: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  it: 'IT',
  hi: 'हि',
  fr: 'FR',
};

@Component({
  selector: 'app-language-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lang-selector" (click)="toggle()" (keydown.enter)="toggle()" tabindex="0" role="button" [attr.aria-label]="'Switch language'">
      <span class="lang-current">{{ LABELS[translationService.locale()] }}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron">
        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      @if (open()) {
        <div class="lang-dropdown">
          @for (locale of locales; track locale) {
            <button
              class="lang-option"
              [class.active]="locale === translationService.locale()"
              (click)="select(locale); $event.stopPropagation()">
              <span class="lang-flag">{{ FLAGS[locale] }}</span>
              <span class="lang-label">{{ LABELS[locale] }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .lang-selector {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.5rem;
      min-height: 44px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 0.75rem;
      font-weight: 600;
      transition: all var(--transition-fast);
      user-select: none;
      letter-spacing: 0.5px;
    }
    .lang-selector:hover {
      background: var(--hover-bg);
      color: var(--text-primary);
    }
    .lang-selector:focus-visible {
      outline: 2px solid var(--accent-primary);
      outline-offset: 2px;
    }
    .lang-current { min-width: 22px; text-align: center; }
    .chevron { width: 12px; height: 12px; transition: transform 0.2s; }
    .lang-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--sidebar-bg);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 0.375rem;
      box-shadow: var(--glass-shadow);
      backdrop-filter: var(--glass-blur);
      z-index: 300;
      min-width: 100px;
      animation: fadeIn 0.15s ease-out;
    }
    .lang-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 6px;
      background: none;
      color: var(--text-secondary);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s;
      font-family: var(--font-family);
      text-align: left;
    }
    .lang-option:hover { background: var(--hover-bg); color: var(--text-primary); }
    .lang-option.active { background: var(--nav-item-active); color: var(--accent-primary); }
    .lang-flag { font-size: 1rem; }
    .lang-label { font-weight: 500; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
  `],
})
export class LanguageSelectorComponent {
  protected readonly translationService = inject(TranslationService);
  protected readonly FLAGS = FLAGS;
  protected readonly LABELS = LABELS;
  protected readonly locales: Locale[] = ['en', 'es', 'it', 'hi', 'fr'];
  protected open = signal(false);

  toggle(): void {
    this.open.update(v => !v);
  }

  select(locale: Locale): void {
    this.translationService.setLocale(locale);
    this.open.set(false);
  }
}
