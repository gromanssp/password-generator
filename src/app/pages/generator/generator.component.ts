import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordService, PasswordConfig, PasswordContext } from '../../services/password.service';
import { StrengthService } from '../../services/strength.service';
import { HistoryService } from '../../services/history.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <h2 class="page-title">Password Generator</h2>
      <p class="page-desc">Choose a context and generate secure passwords instantly</p>
    </div>

    <section class="context-grid">
      @for (ctx of passwordService.contexts; track ctx.id) {
        <button
          class="context-card"
          [class.selected]="selectedContext()?.id === ctx.id"
          (click)="selectContext(ctx)">
          <div class="context-icon" [class]="'icon-' + ctx.iconId">
            @switch (ctx.iconId) {
              @case ('banking') {
                <!-- Simple Icons: shield-check inspired (banking/finance) -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="10" width="18" height="11" rx="2"/>
                  <path d="M12 3L2 8h20L12 3z"/>
                  <path d="M7 14v3m5-3v3m5-3v3"/>
                </svg>
              }
              @case ('social') {
                <!-- share/network icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                </svg>
              }
              @case ('work') {
                <!-- briefcase icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                  <path d="M2 12h20"/>
                </svg>
              }
              @case ('gaming') {
                <!-- gamepad icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 11h4M8 9v4"/>
                  <line x1="15" y1="12" x2="15.01" y2="12"/>
                  <line x1="18" y1="10" x2="18.01" y2="10"/>
                  <path d="M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0017.32 5z"/>
                </svg>
              }
              @case ('wifi') {
                <!-- wifi icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12.55a11 11 0 0114.08 0"/>
                  <path d="M1.42 9a16 16 0 0121.16 0"/>
                  <path d="M8.53 16.11a6 6 0 016.95 0"/>
                  <circle cx="12" cy="20" r="1" fill="currentColor"/>
                </svg>
              }
              @case ('developer') {
                <!-- code/terminal icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                  <line x1="14" y1="4" x2="10" y2="20"/>
                </svg>
              }
              @case ('custom') {
                <!-- sliders/settings icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"/>
                  <line x1="4" y1="10" x2="4" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12" y2="3"/>
                  <line x1="20" y1="21" x2="20" y2="16"/>
                  <line x1="20" y1="12" x2="20" y2="3"/>
                  <line x1="1" y1="14" x2="7" y2="14"/>
                  <line x1="9" y1="8" x2="15" y2="8"/>
                  <line x1="17" y1="16" x2="23" y2="16"/>
                </svg>
              }
            }
          </div>
          <span class="context-name">{{ ctx.name }}</span>
          <span class="context-desc">{{ ctx.description }}</span>
        </button>
      }
    </section>

    @if (selectedContext()) {
      <section class="config-panel animate-in">
        <div class="config-header">
          <h3>{{ selectedContext()!.name }} Settings</h3>
          <span class="config-badge">{{ config().length }} chars</span>
        </div>

        <div class="config-body">
          <div class="slider-group">
            <label>Password Length: <strong>{{ config().length }}</strong></label>
            <input type="range" [min]="4" [max]="64" [ngModel]="config().length" (ngModelChange)="updateLength($event)" class="range-input">
            <div class="range-labels"><span>4</span><span>64</span></div>
          </div>

          <div class="toggles-grid">
            <label class="toggle-item">
              <input type="checkbox" [ngModel]="config().uppercase" (ngModelChange)="updateConfig('uppercase', $event)">
              <span class="toggle-switch"></span>
              <span>Uppercase (A-Z)</span>
            </label>
            <label class="toggle-item">
              <input type="checkbox" [ngModel]="config().lowercase" (ngModelChange)="updateConfig('lowercase', $event)">
              <span class="toggle-switch"></span>
              <span>Lowercase (a-z)</span>
            </label>
            <label class="toggle-item">
              <input type="checkbox" [ngModel]="config().numbers" (ngModelChange)="updateConfig('numbers', $event)">
              <span class="toggle-switch"></span>
              <span>Numbers (0-9)</span>
            </label>
            <label class="toggle-item">
              <input type="checkbox" [ngModel]="config().symbols" (ngModelChange)="updateConfig('symbols', $event)">
              <span class="toggle-switch"></span>
              <span>Symbols (!&#64;#$%)</span>
            </label>
            <label class="toggle-item">
              <input type="checkbox" [ngModel]="config().excludeAmbiguous" (ngModelChange)="updateConfig('excludeAmbiguous', $event)">
              <span class="toggle-switch"></span>
              <span>Exclude Ambiguous</span>
            </label>
            <label class="toggle-item">
              <input type="checkbox" [ngModel]="config().excludeSimilar" (ngModelChange)="updateConfig('excludeSimilar', $event)">
              <span class="toggle-switch"></span>
              <span>Exclude Similar</span>
            </label>
          </div>

          <button class="btn-generate" (click)="generate()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Generate Password
          </button>
        </div>
      </section>
    }

    @if (generatedPassword()) {
      <section class="result-card animate-in">
        <div class="result-header">
          <span class="result-label">Generated Password</span>
          <div class="strength-badge" [class]="strengthResult().level">{{ strengthResult().label }} — {{ strengthResult().score }}/100</div>
        </div>
        <div class="result-password">
          <code>{{ generatedPassword() }}</code>
        </div>
        <div class="strength-bar">
          <div class="strength-fill" [class]="strengthResult().level" [style.width.%]="strengthResult().score"></div>
        </div>
        <div class="result-actions">
          <button class="action-btn" (click)="copy()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copy
          </button>
          <button class="action-btn" (click)="generate()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Regenerate
          </button>
          <button class="action-btn" (click)="saveToHistory()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Save
          </button>
        </div>
      </section>
    }
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .page-desc { color: var(--text-secondary); font-size: 0.95rem; }

    .context-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .context-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem 1rem;
      background: var(--bg-surface);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .context-card:hover {
      border-color: rgba(99,102,241,0.3);
      background: rgba(99,102,241,0.05);
      transform: translateY(-2px);
    }

    .context-card.selected {
      border-color: var(--accent-primary);
      background: rgba(99,102,241,0.1);
      box-shadow: 0 0 20px rgba(99,102,241,0.15);
    }

    .context-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .context-icon svg { width: 22px; height: 22px; }

    .icon-banking { background: rgba(16, 185, 129, 0.12); color: var(--success); }
    .icon-social { background: rgba(99, 102, 241, 0.12); color: var(--accent-primary); }
    .icon-work { background: rgba(139, 92, 246, 0.12); color: var(--accent-secondary); }
    .icon-gaming { background: rgba(245, 158, 11, 0.12); color: var(--warning); }
    .icon-wifi { background: rgba(59, 130, 246, 0.12); color: var(--info); }
    .icon-developer { background: rgba(16, 185, 129, 0.12); color: var(--success); }
    .icon-custom { background: rgba(148, 163, 184, 0.12); color: var(--text-secondary); }

    .context-card.selected .context-icon {
      background: rgba(99, 102, 241, 0.2);
      color: var(--accent-primary);
    }

    .context-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
    .context-desc { font-size: 0.7rem; color: var(--text-muted); line-height: 1.3; }

    .config-panel {
      background: var(--bg-surface);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .config-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .config-header h3 { font-size: 1rem; font-weight: 600; color: var(--text-primary); }

    .config-badge {
      padding: 0.25rem 0.75rem;
      background: rgba(99,102,241,0.15);
      border-radius: 9999px;
      font-size: 0.75rem;
      color: var(--accent-primary);
      font-weight: 600;
    }

    .config-body { padding: 1.5rem; }

    .slider-group { margin-bottom: 1.5rem; }

    .slider-group label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
    }

    .slider-group strong { color: var(--accent-primary); }

    .range-input {
      width: 100%;
      height: 6px;
      appearance: none;
      background: rgba(255,255,255,0.1);
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
      cursor: pointer;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .toggles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

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
      background: rgba(255,255,255,0.1);
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
      padding: 0.875rem;
      background: var(--accent-gradient);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-family);
    }

    .btn-generate:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    }

    .btn-generate svg { width: 20px; height: 20px; }

    .result-card {
      background: var(--bg-surface);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .result-label { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }

    .strength-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .strength-badge.very-weak { background: rgba(239,68,68,0.15); color: var(--danger); }
    .strength-badge.weak { background: rgba(245,158,11,0.15); color: var(--warning); }
    .strength-badge.fair { background: rgba(245,158,11,0.15); color: var(--warning); }
    .strength-badge.strong { background: rgba(16,185,129,0.15); color: var(--success); }
    .strength-badge.very-strong { background: rgba(99,102,241,0.15); color: var(--accent-primary); }

    .result-password {
      padding: 1rem;
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      margin-bottom: 0.75rem;
      overflow-x: auto;
    }

    .result-password code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 1.1rem;
      color: var(--success);
      word-break: break-all;
      letter-spacing: 0.5px;
    }

    .strength-bar {
      height: 4px;
      background: rgba(255,255,255,0.08);
      border-radius: 2px;
      margin-bottom: 1.25rem;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    .strength-fill.very-weak { background: var(--danger); }
    .strength-fill.weak { background: var(--warning); }
    .strength-fill.fair { background: var(--warning); }
    .strength-fill.strong { background: var(--success); }
    .strength-fill.very-strong { background: var(--accent-primary); }

    .result-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font-family);
    }

    .action-btn:hover {
      background: rgba(255,255,255,0.1);
      color: var(--text-primary);
      border-color: rgba(255,255,255,0.2);
    }

    .action-btn svg { width: 14px; height: 14px; }

    .animate-in { animation: fadeUp 0.3s ease-out; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .context-grid { grid-template-columns: repeat(2, 1fr); }
      .toggles-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class GeneratorComponent {
  protected readonly passwordService = inject(PasswordService);
  private readonly strengthService = inject(StrengthService);
  private readonly historyService = inject(HistoryService);
  private readonly toastService = inject(ToastService);

  readonly selectedContext = signal<PasswordContext | null>(null);
  readonly config = signal<PasswordConfig>({
    length: 16, uppercase: true, lowercase: true, numbers: true,
    symbols: true, excludeAmbiguous: false, excludeSimilar: false
  });
  readonly generatedPassword = signal('');
  protected readonly strengthResult = computed(() => this.strengthService.analyze(this.generatedPassword()));

  selectContext(ctx: PasswordContext): void {
    this.selectedContext.set(ctx);
    this.config.set({ ...ctx.config });
  }

  updateLength(value: number): void {
    this.config.update(c => ({ ...c, length: value }));
  }

  updateConfig(key: keyof PasswordConfig, value: boolean): void {
    this.config.update(c => ({ ...c, [key]: value }));
  }

  generate(): void {
    const password = this.passwordService.generate(this.config());
    this.generatedPassword.set(password);
  }

  copy(): void {
    navigator.clipboard.writeText(this.generatedPassword()).then(() => {
      this.toastService.show('Password copied to clipboard!', 'success');
    });
  }

  saveToHistory(): void {
    const ctx = this.selectedContext();
    this.historyService.add(
      this.generatedPassword(),
      ctx?.name ?? 'Custom',
      this.strengthResult().score
    );
    this.toastService.show('Password saved to history', 'success');
  }
}
