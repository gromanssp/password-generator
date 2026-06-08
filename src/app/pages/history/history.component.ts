import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoryService, PasswordEntry } from '../../services/history.service';
import { ToastService } from '../../services/toast.service';
import { SeoService } from '../../services/seo.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslatePipe],
  template: `
    <div class="page-header anim-page-enter">
      <h2 class="page-title">{{ 'page.history.title' | translate }}</h2>
      <p class="page-desc">{{ 'page.history.desc' | translate }}</p>
    </div>

    <div class="controls-bar">
      <div class="search-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" stroke-linecap="round"/></svg>
        <input type="text" [(ngModel)]="searchQuery" [placeholder]="'page.history.searchPlaceholder' | translate" class="search-input">
      </div>
      <div class="filter-tabs">
        <button class="filter-btn" [class.active]="filter() === 'all'" (click)="filter.set('all')">{{ 'page.history.all' | translate }}</button>
        <button class="filter-btn" [class.active]="filter() === 'favorites'" (click)="filter.set('favorites')">{{ 'page.history.favorites' | translate }}</button>
      </div>
      @if (historyService.entries().length > 0) {
        <button class="clear-btn" (click)="clearAll()">{{ 'page.history.clearAll' | translate }}</button>
      }
    </div>

    @if (filteredEntries().length === 0) {
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p>{{ 'page.history.emptyTitle' | translate }}</p>
        <span>{{ 'page.history.emptyDesc' | translate }}</span>
      </div>
    } @else {
      <div class="entries-list">
        @for (entry of filteredEntries(); track entry.id) {
          <div class="entry-card">
            <div class="entry-main">
              <div class="entry-password">
                <code>{{ visiblePasswords().has(entry.id) ? entry.password : maskPassword(entry.password) }}</code>
              </div>
              <div class="entry-meta">
                <span class="entry-context">{{ entry.context }}</span>
                <span class="entry-dot"></span>
                <span class="entry-date">{{ formatDate(entry.createdAt) }}</span>
                <span class="entry-dot"></span>
                <span class="entry-strength" [class]="getStrengthClass(entry.strength)">{{ entry.strength }}%</span>
              </div>
            </div>
            <div class="entry-actions">
              <button class="icon-btn" (click)="toggleVisibility(entry.id)" title="Toggle visibility">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="icon-btn" (click)="copyEntry(entry)" title="Copy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
              <button class="icon-btn" [class.favorited]="entry.favorite" (click)="historyService.toggleFavorite(entry.id)" title="Favorite">
                <svg viewBox="0 0 24 24" [attr.fill]="entry.favorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="icon-btn danger" (click)="historyService.remove(entry.id)" title="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .page-desc { color: var(--text-secondary); font-size: 0.95rem; }

    .controls-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color-strong);
      border-radius: 8px;
      flex: 1;
      min-width: 200px;
    }

    .search-wrapper svg { width: 16px; height: 16px; color: var(--text-muted); }

    .search-input {
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 0.85rem;
      outline: none;
      width: 100%;
      font-family: var(--font-family);
    }

    .filter-tabs { display: flex; gap: 0.25rem; }

    .filter-btn {
      padding: 0.375rem 0.75rem;
      background: transparent;
      border: 1px solid var(--border-color-strong);
      border-radius: 6px;
      color: var(--text-muted);
      font-size: 0.8rem;
      cursor: pointer;
      font-family: var(--font-family);
      transition: all 0.2s;
    }

    .filter-btn.active { background: rgba(99,102,241,0.15); border-color: var(--accent-primary); color: var(--accent-primary); }

    .clear-btn {
      padding: 0.375rem 0.75rem;
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: 6px;
      color: var(--danger);
      font-size: 0.8rem;
      cursor: pointer;
      font-family: var(--font-family);
      margin-left: auto;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state svg { width: 48px; height: 48px; color: var(--text-muted); opacity: 0.3; }
    .empty-state p { font-size: 1rem; color: var(--text-secondary); }
    .empty-state span { font-size: 0.85rem; color: var(--text-muted); }

    .entries-list { display: flex; flex-direction: column; gap: 0.5rem; }

    .entry-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      gap: 0.75rem;
      transition: border-color 0.2s;
      animation: fadeInUp 0.35s ease-out both;
    }

    .entry-card:nth-child(2) { animation-delay: 0.06s; }
    .entry-card:nth-child(3) { animation-delay: 0.12s; }
    .entry-card:nth-child(4) { animation-delay: 0.18s; }
    .entry-card:nth-child(5) { animation-delay: 0.24s; }
    .entry-card:nth-child(6) { animation-delay: 0.3s; }
    .entry-card:nth-child(7) { animation-delay: 0.36s; }
    .entry-card:nth-child(8) { animation-delay: 0.42s; }

    .entry-card:hover { border-color: var(--border-color-strong); }

    .entry-main { min-width: 0; width: 100%; }

    .entry-password {
      margin-bottom: 0.375rem;
    }

    .entry-password code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: var(--text-primary);
      word-break: break-all;
    }

    .entry-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .entry-context { font-size: 0.75rem; color: var(--accent-primary); font-weight: 500; }
    .entry-date { font-size: 0.75rem; color: var(--text-muted); }
    .entry-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted); }

    .entry-strength { font-size: 0.75rem; font-weight: 600; }
    .entry-strength.strong { color: var(--success); }
    .entry-strength.medium { color: var(--warning); }
    .entry-strength.weak { color: var(--danger); }

    .entry-actions {
      display: flex;
      gap: 0.25rem;
      flex-shrink: 0;
      width: 100%;
      justify-content: flex-end;
      border-top: 1px solid var(--border-color-subtle);
      padding-top: 0.75rem;
    }

    .icon-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      border-radius: 8px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-btn:hover { background: var(--hover-bg-strong); color: var(--text-primary); }
    .icon-btn.danger:hover { color: var(--danger); background: rgba(239,68,68,0.1); }
    .icon-btn.favorited { color: var(--warning); }
    .icon-btn svg { width: 20px; height: 20px; }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (min-width: 576px) {
      .entry-card {
        flex-direction: row;
        align-items: center;
        gap: 1rem;
      }
      .entry-main { width: auto; }
      .entry-actions {
        width: auto;
        justify-content: flex-start;
        border-top: none;
        padding-top: 0;
      }
      .icon-btn { width: 32px; height: 32px; }
      .icon-btn svg { width: 16px; height: 16px; }
    }
  `]
})
export class HistoryComponent {
  protected readonly historyService = inject(HistoryService);
  private readonly toastService = inject(ToastService);
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setMetaTags({
      title: 'Password History',
      description: 'View and manage your generated password history. All passwords are stored locally in your browser for maximum privacy and security.',
    });
  }

  searchQuery = '';
  filter = signal<'all' | 'favorites'>('all');
  visiblePasswords = signal(new Set<string>());

  filteredEntries = computed(() => {
    let entries = this.filter() === 'favorites'
      ? this.historyService.favorites()
      : this.historyService.entries();

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      entries = entries.filter(e => e.context.toLowerCase().includes(q) || e.password.toLowerCase().includes(q));
    }
    return entries;
  });

  maskPassword(password: string): string {
    if (password.length <= 4) return '•'.repeat(password.length);
    return password.slice(0, 2) + '•'.repeat(password.length - 4) + password.slice(-2);
  }

  toggleVisibility(id: string): void {
    this.visiblePasswords.update(set => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  copyEntry(entry: PasswordEntry): void {
    navigator.clipboard.writeText(entry.password).then(() => {
      this.toastService.show('Password copied!', 'success');
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  getStrengthClass(strength: number): string {
    if (strength >= 70) return 'strong';
    if (strength >= 40) return 'medium';
    return 'weak';
  }

  async clearAll(): Promise<void> {
    await this.historyService.clear();
    this.toastService.show('History cleared', 'info');
  }
}
