import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">Security Dashboard</h2>
      <p class="page-desc">Your personal security overview</p>
    </div>

    <div class="dashboard-grid">
      <div class="widget health-widget">
        <div class="widget-header">
          <h4>Password Health</h4>
          <span class="widget-badge" [class]="healthClass()">{{ healthLabel() }}</span>
        </div>
        <div class="health-score">
          <div class="score-ring">
            <svg viewBox="0 0 36 36">
              <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path class="ring-fill" [class]="healthClass()" [attr.stroke-dasharray]="averageStrength() + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            </svg>
            <span class="ring-value">{{ averageStrength() }}</span>
          </div>
          <div class="health-stats">
            <div class="stat"><span class="stat-value">{{ totalPasswords() }}</span><span class="stat-label">Total Saved</span></div>
            <div class="stat"><span class="stat-value">{{ strongCount() }}</span><span class="stat-label">Strong</span></div>
            <div class="stat"><span class="stat-value">{{ weakCount() }}</span><span class="stat-label">Weak</span></div>
          </div>
        </div>
      </div>

      <div class="widget tips-widget">
        <div class="widget-header">
          <h4>Security Tips</h4>
        </div>
        <ul class="tips-list">
          <li>
            <div class="tip-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            Use unique passwords for every account
          </li>
          <li>
            <div class="tip-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            Enable two-factor authentication everywhere
          </li>
          <li>
            <div class="tip-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            Rotate passwords every 90 days
          </li>
          <li>
            <div class="tip-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></div>
            Monitor accounts for suspicious activity
          </li>
        </ul>
      </div>

      <div class="widget quick-actions">
        <div class="widget-header">
          <h4>Quick Actions</h4>
        </div>
        <div class="actions-grid">
          <a routerLink="/generator" class="action-card">
            <div class="action-icon gen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <span>Generate Password</span>
          </a>
          <a routerLink="/strength" class="action-card">
            <div class="action-icon str"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <span>Check Strength</span>
          </a>
          <a routerLink="/breach-check" class="action-card">
            <div class="action-icon breach"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <span>Breach Check</span>
          </a>
          <a routerLink="/passphrase" class="action-card">
            <div class="action-icon phrase"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <span>Passphrase</span>
          </a>
        </div>
      </div>

      <div class="widget mfa-widget">
        <div class="widget-header">
          <h4>MFA Status Guide</h4>
        </div>
        <div class="mfa-list">
          <div class="mfa-item"><span class="mfa-service">Email</span><span class="mfa-status enabled">Recommended</span></div>
          <div class="mfa-item"><span class="mfa-service">Banking</span><span class="mfa-status critical">Essential</span></div>
          <div class="mfa-item"><span class="mfa-service">Social Media</span><span class="mfa-status enabled">Recommended</span></div>
          <div class="mfa-item"><span class="mfa-service">Cloud Storage</span><span class="mfa-status enabled">Recommended</span></div>
          <div class="mfa-item"><span class="mfa-service">Work Tools</span><span class="mfa-status critical">Essential</span></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .page-desc { color: var(--text-secondary); font-size: 0.95rem; }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    .widget {
      padding: 1.5rem;
      background: var(--bg-surface);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
    }

    .widget-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .widget-header h4 { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }

    .widget-badge {
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.65rem;
      font-weight: 600;
    }

    .widget-badge.good { background: rgba(16,185,129,0.15); color: var(--success); }
    .widget-badge.fair { background: rgba(245,158,11,0.15); color: var(--warning); }
    .widget-badge.poor { background: rgba(239,68,68,0.15); color: var(--danger); }

    .health-score { display: flex; align-items: center; gap: 2rem; }

    .score-ring {
      position: relative;
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }

    .score-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
    .ring-bg { fill: none; stroke: rgba(255,255,255,0.08); stroke-width: 3; }

    .ring-fill {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      transition: stroke-dasharray 0.5s;
    }

    .ring-fill.good { stroke: var(--success); }
    .ring-fill.fair { stroke: var(--warning); }
    .ring-fill.poor { stroke: var(--danger); }

    .ring-value {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .health-stats { display: flex; flex-direction: column; gap: 0.5rem; }
    .stat { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
    .stat-label { font-size: 0.7rem; color: var(--text-muted); }

    .tips-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }

    .tips-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.825rem;
      color: var(--text-secondary);
    }

    .tip-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .tip-icon svg { width: 14px; height: 14px; }
    .tip-icon.green { background: rgba(16,185,129,0.15); color: var(--success); }
    .tip-icon.blue { background: rgba(59,130,246,0.15); color: var(--info); }
    .tip-icon.purple { background: rgba(139,92,246,0.15); color: var(--accent-secondary); }
    .tip-icon.orange { background: rgba(245,158,11,0.15); color: var(--warning); }

    .actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .action-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); transform: translateY(-1px); }
    .action-card span { font-size: 0.75rem; color: var(--text-secondary); text-align: center; }

    .action-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-icon svg { width: 18px; height: 18px; }
    .action-icon.gen { background: rgba(99,102,241,0.15); color: var(--accent-primary); }
    .action-icon.str { background: rgba(16,185,129,0.15); color: var(--success); }
    .action-icon.breach { background: rgba(239,68,68,0.15); color: var(--danger); }
    .action-icon.phrase { background: rgba(245,158,11,0.15); color: var(--warning); }

    .mfa-list { display: flex; flex-direction: column; gap: 0.5rem; }

    .mfa-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.625rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .mfa-service { font-size: 0.85rem; color: var(--text-secondary); }

    .mfa-status {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }

    .mfa-status.enabled { background: rgba(16,185,129,0.12); color: var(--success); }
    .mfa-status.critical { background: rgba(239,68,68,0.12); color: var(--danger); }

    @media (max-width: 768px) {
      .dashboard-grid { grid-template-columns: 1fr; }
      .health-score { flex-direction: column; align-items: flex-start; gap: 1rem; }
    }
  `]
})
export class DashboardComponent {
  private readonly historyService = inject(HistoryService);

  totalPasswords = computed(() => this.historyService.entries().length);
  strongCount = computed(() => this.historyService.entries().filter(e => e.strength >= 70).length);
  weakCount = computed(() => this.historyService.entries().filter(e => e.strength < 40).length);

  averageStrength = computed(() => {
    const entries = this.historyService.entries();
    if (entries.length === 0) return 0;
    return Math.round(entries.reduce((sum, e) => sum + e.strength, 0) / entries.length);
  });

  healthClass = computed(() => {
    const avg = this.averageStrength();
    if (avg >= 70) return 'good';
    if (avg >= 40) return 'fair';
    return 'poor';
  });

  healthLabel = computed(() => {
    const avg = this.averageStrength();
    if (avg >= 70) return 'Good';
    if (avg >= 40) return 'Fair';
    if (avg > 0) return 'Poor';
    return 'N/A';
  });
}
