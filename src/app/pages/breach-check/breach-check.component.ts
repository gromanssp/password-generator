import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreachService } from '../../services/breach.service';

@Component({
  selector: 'app-breach-check',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <h2 class="page-title">Data Breach Detection</h2>
      <p class="page-desc">Check if your email has been compromised in known data breaches</p>
    </div>

    <div class="check-section">
      <div class="email-input-wrapper">
        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <input
          type="email"
          [(ngModel)]="email"
          class="email-input"
          placeholder="Enter your email address..."
          (keydown.enter)="check()">
        <button class="check-btn" (click)="check()" [disabled]="breachService.isLoading() || !email">
          @if (breachService.isLoading()) {
            <span class="spinner"></span>
            Checking...
          } @else {
            Check Now
          }
        </button>
      </div>
      <p class="privacy-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Your email is checked securely. We don't store or transmit your data.
      </p>
    </div>

    @if (breachService.result(); as result) {
      <div class="results-section animate-in">
        @if (result.status === 'safe') {
          <div class="status-card safe">
            <div class="status-icon-wrapper safe">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="status-content">
              <h3>No Breaches Found</h3>
              <p>Great news! Your email <strong>{{ result.email }}</strong> was not found in any known data breaches.</p>
            </div>
          </div>
        } @else {
          <div class="status-card" [class]="result.status">
            <div class="status-icon-wrapper" [class]="result.status">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="status-content">
              <h3>{{ result.breachCount }} Breach{{ result.breachCount > 1 ? 'es' : '' }} Found</h3>
              <p>Your email <strong>{{ result.email }}</strong> appeared in {{ result.breachCount }} known data breach{{ result.breachCount > 1 ? 'es' : '' }}.</p>
            </div>
          </div>

          <div class="breaches-list">
            @for (breach of result.breaches; track breach.name) {
              <div class="breach-card">
                <div class="breach-header">
                  <div class="breach-name-row">
                    <h4>{{ breach.name }}</h4>
                    <span class="severity-badge" [class]="breach.severity">{{ breach.severity }}</span>
                  </div>
                  <span class="breach-date">{{ breach.breachDate }}</span>
                </div>
                <p class="breach-desc">{{ breach.description }}</p>
                <div class="exposed-data">
                  <span class="exposed-label">Exposed data:</span>
                  <div class="data-tags">
                    @for (dc of breach.dataClasses; track dc) {
                      <span class="data-tag">{{ dc }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="recommendations">
            <h4>Recommended Actions</h4>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Change your password immediately for affected services
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Enable two-factor authentication (MFA)
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round"/></svg>
                Monitor your accounts for suspicious activity
              </li>
            </ul>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .page-desc { color: var(--text-secondary); font-size: 0.95rem; }

    .email-input-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.5rem 0.5rem 1.25rem;
      background: var(--bg-surface);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      transition: border-color 0.2s;
    }

    .email-input-wrapper:focus-within {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
    }

    .input-icon { width: 20px; height: 20px; color: var(--text-muted); flex-shrink: 0; }

    .email-input {
      flex: 1;
      padding: 0.625rem 0;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
      font-family: var(--font-family);
    }

    .check-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: var(--accent-gradient);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      font-family: var(--font-family);
      transition: opacity 0.2s;
    }

    .check-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .privacy-note {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .privacy-note svg { width: 14px; height: 14px; }

    .results-section { margin-top: 2rem; }

    .status-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      border-radius: 14px;
      border: 1px solid;
      margin-bottom: 1.5rem;
    }

    .status-card.safe { background: rgba(16,185,129,0.05); border-color: rgba(16,185,129,0.2); }
    .status-card.warning { background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.2); }
    .status-card.danger { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.2); }

    .status-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .status-icon-wrapper svg { width: 24px; height: 24px; }
    .status-icon-wrapper.safe { background: rgba(16,185,129,0.15); color: var(--success); }
    .status-icon-wrapper.warning { background: rgba(245,158,11,0.15); color: var(--warning); }
    .status-icon-wrapper.danger { background: rgba(239,68,68,0.15); color: var(--danger); }

    .status-content h3 { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
    .status-content p { font-size: 0.85rem; color: var(--text-secondary); }
    .status-content strong { color: var(--text-primary); }

    .breaches-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .breach-card {
      padding: 1.25rem;
      background: var(--bg-surface);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
    }

    .breach-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .breach-name-row { display: flex; align-items: center; gap: 0.75rem; }
    .breach-name-row h4 { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }

    .severity-badge {
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .severity-badge.low { background: rgba(59,130,246,0.15); color: var(--info); }
    .severity-badge.medium { background: rgba(245,158,11,0.15); color: var(--warning); }
    .severity-badge.high { background: rgba(239,68,68,0.15); color: var(--danger); }
    .severity-badge.critical { background: rgba(239,68,68,0.25); color: var(--danger); }

    .breach-date { font-size: 0.75rem; color: var(--text-muted); }
    .breach-desc { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem; line-height: 1.5; }

    .exposed-data { display: flex; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap; }
    .exposed-label { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; padding-top: 0.25rem; }
    .data-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }

    .data-tag {
      padding: 0.2rem 0.5rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      font-size: 0.7rem;
      color: var(--text-secondary);
    }

    .recommendations {
      padding: 1.25rem;
      background: var(--bg-surface);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
    }

    .recommendations h4 { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1rem; }

    .recommendations ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }

    .recommendations li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .recommendations li svg { width: 18px; height: 18px; color: var(--accent-primary); flex-shrink: 0; }

    .animate-in { animation: fadeUp 0.3s ease-out; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BreachCheckComponent {
  protected readonly breachService = inject(BreachService);
  email = '';

  check(): void {
    if (this.email) {
      this.breachService.checkEmail(this.email);
    }
  }
}
