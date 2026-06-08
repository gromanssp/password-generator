import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { StrengthService } from '../../services/strength.service';
import { SeoService } from '../../services/seo.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-strength',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DecimalPipe, TranslatePipe],
  template: `
    <div class="page-header anim-page-enter">
      <h2 class="page-title">{{ 'page.strength.title' | translate }}</h2>
      <p class="page-desc">{{ 'page.strength.desc' | translate }}</p>
    </div>

    <div class="analyzer-container">
      <div class="input-section">
        <div class="password-input-wrapper">
          <input
            [type]="showPassword() ? 'text' : 'password'"
            [ngModel]="password()"
            (ngModelChange)="password.set($event)"
            class="password-input"
            [placeholder]="'page.strength.placeholder' | translate"
            autocomplete="off">
          <button class="visibility-toggle" (click)="showPassword.set(!showPassword())">
            @if (showPassword()) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke-linecap="round" stroke-linejoin="round"/></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round"/><circle cx="12" cy="12" r="3" stroke-linecap="round"/></svg>
            }
          </button>
        </div>
      </div>

      @if (password()) {
        <div class="results-grid animate-in">
          <div class="score-card">
            <div class="score-circle" [class]="result().level">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path class="circle-fill" [attr.stroke-dasharray]="result().score + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <div class="score-value">{{ result().score }}</div>
            </div>
            <div class="score-label" [class]="result().level">{{ result().label }}</div>
            <div class="entropy-info">{{ 'page.strength.entropy' | translate }} {{ result().entropy | number:'1.0-0' }} bits</div>
          </div>

          <div class="details-card">
            <h4>{{ 'page.strength.complexityBreakdown' | translate }}</h4>
            <div class="complexity-items">
              <div class="complexity-item">
                <span class="ci-label">{{ 'page.strength.length' | translate }}</span>
                <span class="ci-value" [class.good]="password().length >= 12">{{ password().length }} {{ 'page.strength.chars' | translate }}</span>
              </div>
              <div class="complexity-item">
                <span class="ci-label">{{ 'page.strength.uppercase' | translate }}</span>
                <span class="ci-value" [class.good]="hasUpper()">{{ (hasUpper() ? 'page.strength.yes' : 'page.strength.no') | translate }}</span>
              </div>
              <div class="complexity-item">
                <span class="ci-label">{{ 'page.strength.lowercase' | translate }}</span>
                <span class="ci-value" [class.good]="hasLower()">{{ (hasLower() ? 'page.strength.yes' : 'page.strength.no') | translate }}</span>
              </div>
              <div class="complexity-item">
                <span class="ci-label">{{ 'page.strength.numbers' | translate }}</span>
                <span class="ci-value" [class.good]="hasNumbers()">{{ (hasNumbers() ? 'page.strength.yes' : 'page.strength.no') | translate }}</span>
              </div>
              <div class="complexity-item">
                <span class="ci-label">{{ 'page.strength.symbols' | translate }}</span>
                <span class="ci-value" [class.good]="hasSymbols()">{{ (hasSymbols() ? 'page.strength.yes' : 'page.strength.no') | translate }}</span>
              </div>
            </div>
          </div>

          @if (result().weaknesses.length > 0) {
            <div class="feedback-card weaknesses">
              <h4>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01M12 2l10 18H2L12 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ 'page.strength.weaknesses' | translate }}
              </h4>
              <ul>
                @for (w of result().weaknesses; track w) {
                  <li>{{ w }}</li>
                }
              </ul>
            </div>
          }

          @if (result().suggestions.length > 0) {
            <div class="feedback-card suggestions">
              <h4>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ 'page.strength.suggestions' | translate }}
              </h4>
              <ul>
                @for (s of result().suggestions; track s) {
                  <li>{{ s }}</li>
                }
              </ul>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .page-desc { color: var(--text-secondary); font-size: 0.95rem; }

    .password-input-wrapper {
      position: relative;
      margin-bottom: 2rem;
    }

    .password-input {
      width: 100%;
      padding: 1rem 3.5rem 1rem 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--form-control-border);
      border-radius: 12px;
      color: var(--text-primary);
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .password-input:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
    }

    .visibility-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.5rem;
    }

    .visibility-toggle svg { width: 20px; height: 20px; }
    .visibility-toggle:hover { color: var(--text-primary); }

    .results-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .score-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 16px;
    }

    .score-circle {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .circular-chart {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .circle-bg {
      fill: none;
      stroke: var(--ring-bg);
      stroke-width: 2.5;
    }

    .circle-fill {
      fill: none;
      stroke-width: 2.5;
      stroke-linecap: round;
      transition: stroke-dasharray 0.5s ease;
    }

    .score-circle.very-weak .circle-fill { stroke: var(--danger); }
    .score-circle.weak .circle-fill { stroke: var(--warning); }
    .score-circle.fair .circle-fill { stroke: var(--warning); }
    .score-circle.strong .circle-fill { stroke: var(--success); }
    .score-circle.very-strong .circle-fill { stroke: var(--accent-primary); }

    .score-value { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); }

    .score-label {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .score-label.very-weak { color: var(--danger); }
    .score-label.weak { color: var(--warning); }
    .score-label.fair { color: var(--warning); }
    .score-label.strong { color: var(--success); }
    .score-label.very-strong { color: var(--accent-primary); }

    .entropy-info { font-size: 0.75rem; color: var(--text-muted); }

    .details-card {
      padding: 1.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 16px;
    }

    .details-card h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .complexity-items {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .complexity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-color-subtle);
    }

    .ci-label { font-size: 0.85rem; color: var(--text-secondary); }
    .ci-value { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
    .ci-value.good { color: var(--success); }

    .feedback-card {
      grid-column: 1 / -1;
      padding: 1.25rem;
      border-radius: 12px;
      border: 1px solid;
    }

    .feedback-card h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .feedback-card h4 svg { width: 16px; height: 16px; }

    .feedback-card ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .feedback-card li {
      font-size: 0.825rem;
      padding-left: 1rem;
      position: relative;
    }

    .feedback-card li::before {
      content: '•';
      position: absolute;
      left: 0;
    }

    .weaknesses {
      background: rgba(239,68,68,0.05);
      border-color: rgba(239,68,68,0.2);
    }
    .weaknesses h4 { color: var(--danger); }
    .weaknesses li { color: rgba(239,68,68,0.8); }

    .suggestions {
      background: rgba(59,130,246,0.05);
      border-color: rgba(59,130,246,0.2);
    }
    .suggestions h4 { color: var(--info); }
    .suggestions li { color: rgba(59,130,246,0.8); }

    .animate-in { animation: fadeUp 0.3s ease-out; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (min-width: 576px) {
      .results-grid { grid-template-columns: auto 1fr; }
    }
  `]
})
export class StrengthComponent {
  private readonly strengthService = inject(StrengthService);
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setMetaTags({
      title: 'Password Strength Analyzer',
      description: 'Analyze your password strength in real-time. Check entropy, character diversity, and get actionable suggestions to improve your password security.',
    });
  }

  readonly password = signal('');
  readonly showPassword = signal(false);

  protected readonly result = computed(() => this.strengthService.analyze(this.password()));
  protected readonly hasUpper = computed(() => /[A-Z]/.test(this.password()));
  protected readonly hasLower = computed(() => /[a-z]/.test(this.password()));
  protected readonly hasNumbers = computed(() => /[0-9]/.test(this.password()));
  protected readonly hasSymbols = computed(() => /[^a-zA-Z0-9]/.test(this.password()));
}
