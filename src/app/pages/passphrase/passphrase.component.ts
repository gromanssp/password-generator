import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PassphraseService, PassphraseConfig } from '../../services/passphrase.service';
import { StrengthService } from '../../services/strength.service';
import { HistoryService } from '../../services/history.service';
import { ToastService } from '../../services/toast.service';
import { SeoService } from '../../services/seo.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-passphrase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslatePipe],
  template: `
    <div class="page-header anim-page-enter">
      <h2 class="page-title">{{ 'page.passphrase.title' | translate }}</h2>
      <p class="page-desc">{{ 'page.passphrase.desc' | translate }}</p>
    </div>

    <div class="generator-layout">
      <div class="config-section">
        <div class="config-card">
          <div class="config-group">
            <label>{{ 'page.passphrase.wordCount' | translate }} <strong>{{ config().wordCount }}</strong></label>
            <input type="range" [min]="3" [max]="8" [ngModel]="config().wordCount" (ngModelChange)="updateConfig('wordCount', $event)" class="range-input">
            <div class="range-labels"><span>3</span><span>8</span></div>
          </div>

          <div class="config-group">
            <label>{{ 'page.passphrase.separator' | translate }}</label>
            <div class="separator-options">
              @for (sep of separators; track sep.value) {
                <button
                  class="sep-btn"
                  [class.active]="config().separator === sep.value"
                  (click)="updateConfig('separator', sep.value)">
                  {{ sep.label }}
                </button>
              }
            </div>
          </div>

          <div class="toggles">
            <label class="toggle-item">
              <input type="checkbox" [ngModel]="config().capitalize" (ngModelChange)="updateConfig('capitalize', $event)">
              <span class="toggle-switch"></span>
              <span>{{ 'page.passphrase.capitalizeWords' | translate }}</span>
            </label>
            <label class="toggle-item">
              <input type="checkbox" [ngModel]="config().includeNumber" (ngModelChange)="updateConfig('includeNumber', $event)">
              <span class="toggle-switch"></span>
              <span>{{ 'page.passphrase.includeNumber' | translate }}</span>
            </label>
          </div>

          <button class="btn-generate" (click)="generate()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ 'page.passphrase.generatePassphrase' | translate }}
          </button>
        </div>

        <div class="entropy-card">
          <div class="entropy-value">~{{ estimatedEntropy() }} bits</div>
          <div class="entropy-label">{{ 'page.passphrase.estimatedEntropy' | translate }}</div>
        </div>
      </div>

      <div class="result-section">
        @if (passphrase()) {
          <div class="passphrase-card animate-in">
            <div class="passphrase-display">
              <code>{{ passphrase() }}</code>
            </div>
            <div class="passphrase-meta">
              <span class="meta-item">{{ passphrase().length }} {{ 'page.passphrase.characters' | translate }}</span>
              <span class="meta-dot"></span>
              <span class="meta-item">{{ config().wordCount }} {{ 'page.passphrase.words' | translate }}</span>
              <span class="meta-dot"></span>
              <span class="meta-item strength" [class]="strengthResult().level">{{ strengthResult().label }}</span>
            </div>
            <div class="passphrase-actions">
              <button class="action-btn" (click)="copy()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                {{ 'page.passphrase.copy' | translate }}
              </button>
              <button class="action-btn" (click)="generate()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ 'page.passphrase.regenerate' | translate }}
              </button>
              <button class="action-btn" (click)="save()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ 'page.passphrase.save' | translate }}
              </button>
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p>{{ 'page.passphrase.emptyState' | translate }}</p>
          </div>
        }

        <div class="examples-card">
          <h4>{{ 'page.passphrase.exampleFormats' | translate }}</h4>
          <div class="examples-list">
            <div class="example-item"><code>river-coffee-tiger-mountain</code><span>{{ 'page.passphrase.hyphenSeparated' | translate }}</span></div>
            <div class="example-item"><code>Moon$Forest#Rocket!Cloud</code><span>{{ 'page.passphrase.symbolSeparatedCaps' | translate }}</span></div>
            <div class="example-item"><code>coral.ember.frost.galaxy.42</code><span>{{ 'page.passphrase.dotSeparatedNumber' | translate }}</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .page-desc { color: var(--text-secondary); font-size: 0.95rem; }

    .generator-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .config-card {
      padding: 1.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      margin-bottom: 1rem;
    }

    .config-group {
      margin-bottom: 1.5rem;
    }

    .config-group label {
      display: block;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
    }

    .config-group strong { color: var(--accent-primary); }

    .range-input {
      width: 100%;
      height: 6px;
      appearance: none;
      background: var(--border-color-strong);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
    }

    .range-input::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--accent-primary);
      box-shadow: 0 2px 8px rgba(99,102,241,0.4);
    }

    .range-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-top: 0.25rem; }

    .separator-options { display: flex; gap: 0.375rem; flex-wrap: wrap; }

    .sep-btn {
      padding: 0.375rem 0.75rem;
      background: var(--hover-bg);
      border: 1px solid var(--border-color-strong);
      border-radius: 6px;
      color: var(--text-secondary);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font-family);
    }

    .sep-btn:hover { border-color: rgba(255,255,255,0.2); }
    .sep-btn.active { background: rgba(99,102,241,0.15); border-color: var(--accent-primary); color: var(--accent-primary); }

    .toggles { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }

    .toggle-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .toggle-item input { display: none; }

    .toggle-switch {
      width: 36px;
      height: 20px;
      background: var(--border-color-strong);
      border-radius: 10px;
      position: relative;
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      transition: transform 0.2s;
    }

    .toggle-item input:checked + .toggle-switch { background: var(--accent-primary); }
    .toggle-item input:checked + .toggle-switch::after { transform: translateX(16px); }

    .btn-generate {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem;
      background: var(--accent-gradient);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--font-family);
      transition: all 0.2s;
    }

    .btn-generate:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.3); }
    .btn-generate svg { width: 18px; height: 18px; }

    .entropy-card {
      padding: 1rem 1.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      text-align: center;
    }

    .entropy-value { font-size: 1.5rem; font-weight: 700; color: var(--accent-primary); }
    .entropy-label { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }

    .passphrase-card {
      padding: 1.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      margin-bottom: 1.5rem;
    }

    .passphrase-display {
      padding: 1.25rem;
      background: rgba(0,0,0,0.3);
      border-radius: 10px;
      margin-bottom: 1rem;
      text-align: center;
    }

    .passphrase-display code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.2rem;
      color: var(--success);
      word-break: break-all;
    }

    .passphrase-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .meta-item { font-size: 0.75rem; color: var(--text-muted); }
    .meta-item.strength.very-strong { color: var(--accent-primary); }
    .meta-item.strength.strong { color: var(--success); }
    .meta-item.strength.fair { color: var(--warning); }
    .meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted); }

    .passphrase-actions { display: flex; gap: 0.5rem; justify-content: center; }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--hover-bg);
      border: 1px solid var(--border-color-strong);
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font-family);
    }

    .action-btn:hover { background: var(--hover-bg-strong); color: var(--text-primary); }
    .action-btn svg { width: 14px; height: 14px; }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 3rem;
      color: var(--text-muted);
      text-align: center;
    }

    .empty-state svg { width: 48px; height: 48px; opacity: 0.3; }
    .empty-state p { font-size: 0.9rem; }

    .examples-card {
      padding: 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
    }

    .examples-card h4 { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.75rem; }

    .examples-list { display: flex; flex-direction: column; gap: 0.5rem; }

    .example-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background: rgba(0,0,0,0.2);
      border-radius: 6px;
    }

    .example-item code { font-size: 0.8rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; }
    .example-item span { font-size: 0.7rem; color: var(--text-muted); }

    .animate-in { animation: fadeUp 0.3s ease-out; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (min-width: 768px) {
      .generator-layout { grid-template-columns: 320px 1fr; }
    }
  `]
})
export class PassphraseComponent {
  protected readonly passphraseService = inject(PassphraseService);
  private readonly strengthService = inject(StrengthService);
  private readonly historyService = inject(HistoryService);
  private readonly toastService = inject(ToastService);
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setMetaTags({
      title: 'Passphrase Generator',
      description: 'Generate memorable yet secure passphrases using random word combinations. Create strong, easy-to-remember passwords with our advanced passphrase generator.',
    });
  }

  readonly config = signal<PassphraseConfig>({ wordCount: 4, separator: '-', capitalize: false, includeNumber: false });
  readonly passphrase = signal('');

  protected readonly separators: readonly { label: string; value: string }[] = [
    { label: '-', value: '-' },
    { label: '.', value: '.' },
    { label: '_', value: '_' },
    { label: '#', value: '#' },
    { label: '$', value: '$' },
    { label: ' ', value: ' ' }
  ];

  protected readonly strengthResult = computed(() => this.strengthService.analyze(this.passphrase()));
  protected readonly estimatedEntropy = computed(() => this.passphraseService.estimateEntropy(this.config()));

  updateConfig(key: keyof PassphraseConfig, value: string | number | boolean): void {
    this.config.update(c => ({ ...c, [key]: value }));
  }

  generate(): void {
    this.passphrase.set(this.passphraseService.generate(this.config()));
  }

  copy(): void {
    navigator.clipboard.writeText(this.passphrase()).then(() => {
      this.toastService.show('Passphrase copied!', 'success');
    });
  }

  async save(): Promise<void> {
    await this.historyService.add(this.passphrase(), 'Passphrase', this.strengthResult().score);
    this.toastService.show('Passphrase saved to history', 'success');
  }
}
