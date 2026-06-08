import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastContainerComponent } from '../shared/components/toast/toast-container.component';
import { ThemeToggleComponent } from '../shared/components/theme-toggle/theme-toggle.component';
import { LanguageSelectorComponent } from '../shared/components/language-selector/language-selector.component';
import { TranslatePipe } from '../shared/pipes/translate.pipe';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent, ThemeToggleComponent, LanguageSelectorComponent, TranslatePipe],
  template: `
    <div class="app-shell">
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L3 7v6c0 5.25 3.83 10.16 9 11.25 5.17-1.09 9-6 9-11.25V7l-9-5z"/>
                <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="logo-text">SecureGen</span>
          </div>
          <button class="sidebar-close" (click)="sidebarOpen.set(false)" aria-label="Close sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/generator" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ 'nav.generator' | translate }}</span>
          </a>
          <a routerLink="/strength" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ 'nav.strength' | translate }}</span>
          </a>
          <a routerLink="/hacking-sim" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ 'nav.hackSim' | translate }}</span>
          </a>
          <a routerLink="/passphrase" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ 'nav.passphrase' | translate }}</span>
          </a>
          <a routerLink="/history" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ 'nav.history' | translate }}</span>
          </a>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ 'nav.dashboard' | translate }}</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="legal-links">
            <a routerLink="/privacy" class="legal-link" (click)="sidebarOpen.set(false)">{{ 'nav.privacy' | translate }}</a>
            <span class="legal-sep">&middot;</span>
            <a routerLink="/terms" class="legal-link" (click)="sidebarOpen.set(false)">{{ 'nav.terms' | translate }}</a>
          </div>
        </div>
      </aside>

      @if (sidebarOpen()) {
        <div class="sidebar-overlay" (click)="sidebarOpen.set(false)"></div>
      }

      <div class="main-wrapper">
        <header class="topbar">
          <button class="menu-toggle" (click)="sidebarOpen.set(true)" aria-label="Open sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="topbar-title">
            <h1 class="text-gradient">SecureGen</h1>
            <span class="topbar-subtitle">{{ 'nav.passwordSecurityPlatform' | translate }}</span>
          </div>
          <div class="topbar-actions">
            <app-language-selector />
            <app-theme-toggle />
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span>{{ 'nav.secure' | translate }}</span>
            </div>
          </div>
        </header>
        <main class="main-content">
          <router-outlet />
        </main>
      </div>

      <app-toast-container />
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      position: fixed;
      inset: 0;
      width: 280px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      z-index: 200;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar.open { transform: translateX(0); }

    .sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 150;
      animation: fadeIn 0.2s ease-out;
    }

    .sidebar-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-close {
      display: flex;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      margin: -6px;
    }

    .sidebar-close:hover { background: var(--hover-bg); }
    .sidebar-close svg { width: 20px; height: 20px; }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: var(--accent-gradient);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .logo-icon svg { width: 20px; height: 20px; }

    .logo-text {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0.75rem;
      min-height: 44px;
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .nav-item svg { width: 20px; height: 20px; flex-shrink: 0; }

    .nav-item:hover {
      background: var(--nav-item-hover);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: rgba(99, 102, 241, 0.12);
      color: var(--accent-primary);
    }

    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--border-color);
    }

    .legal-links {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      margin-top: 0.625rem;
    }

    .legal-link {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .legal-link:hover { color: var(--text-secondary); }
    .legal-sep { font-size: 0.65rem; color: var(--text-muted); opacity: 0.5; }

    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .topbar {
      position: relative;
      z-index: 1;
      height: 56px;
      padding: 0 1rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
      background: var(--topbar-bg);
      backdrop-filter: blur(12px);
    }

    .menu-toggle {
      display: flex;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .menu-toggle:hover { background: var(--hover-bg); }
    .menu-toggle svg { width: 22px; height: 22px; }

    .topbar-title {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      min-width: 0;
    }

    .topbar-title h1 {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0;
      white-space: nowrap;
    }

    .topbar-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      display: none;
    }

    .topbar-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 9999px;
      font-size: 0.8rem;
      color: var(--success);
      font-weight: 500;
      white-space: nowrap;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--success);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @media (min-width: 576px) {
      .topbar { padding: 0 1.5rem; }
      .main-content { padding: 1.5rem; }
      .topbar-subtitle { display: inline; }
    }

    @media (min-width: 768px) {
      .sidebar {
        position: static;
        width: 240px;
        transform: none;
        background: var(--sidebar-bg);
      }

      .sidebar-overlay { display: none !important; }
      .sidebar-close { display: none; }
      .menu-toggle { display: none; }
      .main-content { padding: 2rem; }
    }
  `]
})
export class LayoutComponent {
  protected readonly sidebarOpen = signal(false);
}
