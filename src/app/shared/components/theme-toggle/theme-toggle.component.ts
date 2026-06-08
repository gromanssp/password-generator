import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="theme-toggle" (click)="themeService.toggle()" [attr.aria-label]="'Switch to ' + (themeService.theme() === 'light' ? 'dark' : 'light') + ' mode'">
      @if (themeService.theme() === 'light') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="moon-icon">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      } @else {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="sun-icon">
          <circle cx="12" cy="12" r="5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke-linecap="round"/>
        </svg>
      }
    </button>
  `,
  styles: [`
    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }
    .theme-toggle:hover {
      background: var(--hover-bg);
      color: var(--text-primary);
    }
    .theme-toggle svg {
      width: 20px;
      height: 20px;
    }
    .sun-icon {
      animation: fadeInScale 0.3s ease-out;
    }
    .moon-icon {
      animation: fadeInScale 0.3s ease-out;
    }
  `]
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}
