import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { StrengthService } from '../../services/strength.service';
import { SeoService } from '../../services/seo.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-hacking-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DecimalPipe, TranslatePipe],
  template: `
    <div class="page-header anim-page-enter">
      <h2 class="page-title">{{ 'page.hackingSim.title' | translate }}</h2>
      <p class="page-desc">{{ 'page.hackingSim.desc' | translate }}</p>
    </div>

    <div class="sim-input-section">
      <input
        type="text"
        [ngModel]="password()"
        (ngModelChange)="password.set($event)"
        class="sim-input"
        [placeholder]="'page.hackingSim.placeholder' | translate"
        autocomplete="off">
    </div>

    @if (password()) {
      <div class="sim-results animate-in">
        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="terminal-title">attack_simulation.sh</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-line">
              <span class="prompt">$</span>
              <span class="cmd">target_password="<span class="highlight">{{ maskedPassword() }}</span>"</span>
            </div>
            <div class="terminal-line">
              <span class="prompt">$</span>
              <span class="cmd">echo "Initiating attack vectors..."</span>
            </div>
            <div class="terminal-line output">
              <span>[INFO] Password length: {{ password().length }} characters</span>
            </div>
            <div class="terminal-line output">
              <span>[INFO] Entropy: {{ result().entropy | number:'1.0-0' }} bits</span>
            </div>
            <div class="terminal-line output">
              <span>[INFO] Running simulations...</span>
            </div>
          </div>
        </div>

        <div class="attacks-grid">
          <div class="attack-card">
            <div class="attack-icon dictionary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="attack-info">
              <h4>Dictionary Attack</h4>
              <p class="attack-desc">Common words & known passwords</p>
            </div>
            <div class="attack-time" [class]="getTimeClass(result().crackTimes.dictionarySeconds)">
              {{ result().crackTimes.dictionary }}
            </div>
          </div>

          <div class="attack-card">
            <div class="attack-icon brute">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="attack-info">
              <h4>Brute Force</h4>
              <p class="attack-desc">Single CPU, all combinations</p>
            </div>
            <div class="attack-time" [class]="getTimeClass(result().crackTimes.bruteForceSeconds)">
              {{ result().crackTimes.bruteForce }}
            </div>
          </div>

          <div class="attack-card">
            <div class="attack-icon gpu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="attack-info">
              <h4>GPU Cluster</h4>
              <p class="attack-desc">Distributed GPU computing</p>
            </div>
            <div class="attack-time" [class]="getTimeClass(result().crackTimes.gpuClusterSeconds)">
              {{ result().crackTimes.gpuCluster }}
            </div>
          </div>

          <div class="attack-card">
            <div class="attack-icon ai">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="attack-info">
              <h4>AI-Assisted</h4>
              <p class="attack-desc">Pattern recognition + ML</p>
            </div>
            <div class="attack-time" [class]="getTimeClass(result().crackTimes.aiAssistedSeconds)">
              {{ result().crackTimes.aiAssisted }}
            </div>
          </div>
        </div>

        <div class="verdict-card" [class]="verdictClass()">
          <div class="verdict-shield">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L3 7v6c0 5.25 3.83 10.16 9 11.25 5.17-1.09 9-6 9-11.25V7l-9-5z"/></svg>
          </div>
          <p class="verdict-text">{{ verdictText() }}</p>
        </div>

        <div class="comparison-section">
          <h4>{{ 'page.hackingSim.comparisonTitle' | translate }}</h4>
          <div class="comparison-grid">
            <div class="comparison-item weak">
              <span class="comp-label">{{ 'page.hackingSim.weak' | translate }}</span>
              <code>123456</code>
              <span class="comp-time">Instant</span>
            </div>
            <div class="comparison-item medium">
              <span class="comp-label">{{ 'page.hackingSim.medium' | translate }}</span>
              <code>Summer2024!</code>
              <span class="comp-time">~3 hours</span>
            </div>
            <div class="comparison-item strong">
              <span class="comp-label">{{ 'page.hackingSim.strong' | translate }}</span>
              <code>P!xel#Tiger$92</code>
              <span class="comp-time">~18 years</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .page-desc { color: var(--text-secondary); font-size: 0.95rem; }

    .sim-input-section { margin-bottom: 2rem; }

    .sim-input {
      width: 100%;
      padding: 1rem 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--form-control-border);
      border-radius: 12px;
      color: var(--text-primary);
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .sim-input:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
    }

    .terminal-card {
      background: var(--terminal-bg);
      border: 1px solid var(--terminal-border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .terminal-header {
      padding: 0.75rem 1rem;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid var(--terminal-border);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .terminal-dots { display: flex; gap: 0.375rem; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.red { background: #ff5f56; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #27c93f; }

    .terminal-title { font-size: 0.75rem; color: var(--text-muted); }

    .terminal-body { padding: 1rem 1.25rem; }

    .terminal-line {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      margin-bottom: 0.375rem;
      display: flex;
      gap: 0.5rem;
    }

    .prompt { color: var(--success); }
    .cmd { color: var(--text-secondary); }
    .highlight { color: var(--accent-primary); }
    .terminal-line.output { color: var(--text-muted); padding-left: 1rem; }

    .attacks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .attack-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      transition: border-color 0.2s;
    }

    .attack-card:hover { border-color: var(--border-color-strong); }

    .attack-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .attack-icon svg { width: 20px; height: 20px; }

    .attack-icon.dictionary { background: rgba(139,92,246,0.15); color: var(--accent-secondary); }
    .attack-icon.brute { background: rgba(239,68,68,0.15); color: var(--danger); }
    .attack-icon.gpu { background: rgba(245,158,11,0.15); color: var(--warning); }
    .attack-icon.ai { background: rgba(59,130,246,0.15); color: var(--info); }

    .attack-info { flex: 1; min-width: 0; }
    .attack-info h4 { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.125rem; }
    .attack-desc { font-size: 0.7rem; color: var(--text-muted); }

    .attack-time {
      font-size: 0.85rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .attack-time.danger { color: var(--danger); }
    .attack-time.warning { color: var(--warning); }
    .attack-time.safe { color: var(--success); }

    .verdict-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-radius: 12px;
      border: 1px solid;
      margin-bottom: 1.5rem;
    }

    .verdict-card.safe { background: rgba(16,185,129,0.05); border-color: rgba(16,185,129,0.2); }
    .verdict-card.warning { background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.2); }
    .verdict-card.danger { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.2); }

    .verdict-shield svg { width: 28px; height: 28px; }
    .verdict-card.safe .verdict-shield { color: var(--success); }
    .verdict-card.warning .verdict-shield { color: var(--warning); }
    .verdict-card.danger .verdict-shield { color: var(--danger); }

    .verdict-text { font-size: 0.9rem; font-weight: 500; color: var(--text-primary); }

    .comparison-section h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
    }

    .comparison-item {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      padding: 1rem;
      background: var(--bg-surface);
      border-radius: 10px;
      border: 1px solid var(--border-color);
    }

    .comp-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .comparison-item.weak .comp-label { color: var(--danger); }
    .comparison-item.medium .comp-label { color: var(--warning); }
    .comparison-item.strong .comp-label { color: var(--success); }

    .comparison-item code { font-size: 0.8rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; }
    .comp-time { font-size: 0.75rem; color: var(--text-muted); }

    .animate-in { animation: fadeUp 0.3s ease-out; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HackingSimComponent {
  private readonly strengthService = inject(StrengthService);
  private readonly seo = inject(SeoService);
  readonly password = signal('');

  constructor() {
    this.seo.setMetaTags({
      title: 'Hacking Simulation',
      description: 'See how long your password would survive different attack methods including dictionary, brute force, GPU cluster, and AI-assisted attacks.',
    });
  }

  result = computed(() => this.strengthService.analyze(this.password()));

  maskedPassword = computed(() => {
    const p = this.password();
    if (p.length <= 4) return '*'.repeat(p.length);
    return p.slice(0, 2) + '*'.repeat(p.length - 4) + p.slice(-2);
  });

  verdictClass = computed(() => {
    const score = this.result().score;
    if (score >= 70) return 'safe';
    if (score >= 40) return 'warning';
    return 'danger';
  });

  verdictText = computed(() => {
    const time = this.result().crackTimes.gpuCluster;
    const score = this.result().score;
    if (score >= 70) return `Your password would survive approximately ${time} against modern GPU clusters.`;
    if (score >= 40) return `Your password is vulnerable. A GPU cluster could crack it in ${time}.`;
    return `Critical: Your password is extremely weak. It would be cracked in ${time}.`;
  });

  getTimeClass(seconds: number): string {
    if (seconds > 31536000 * 100) return 'safe';
    if (seconds > 3600) return 'warning';
    return 'danger';
  }
}
