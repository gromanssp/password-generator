import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastContainerComponent } from '../shared/components/toast/toast-container.component';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
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
          <button class="sidebar-close" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/generator" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Generator</span>
          </a>
          <a routerLink="/strength" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Strength</span>
          </a>
          <a routerLink="/hacking-sim" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Hack Sim</span>
          </a>
          <a routerLink="/breach-check" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Breach Check</span>
          </a>
          <a routerLink="/passphrase" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Passphrase</span>
          </a>
          <a routerLink="/history" routerLinkActive="active" class="nav-item" (click)="sidebarOpen.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>History</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="security-badge">
            <div class="badge-dot"></div>
            <span>All data stored locally</span>
          </div>
        </div>
      </aside>

      <div class="main-wrapper">
        <header class="topbar">
          <button class="menu-toggle" (click)="sidebarOpen.set(true)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="topbar-title">
            <h1 class="text-gradient">SecureGen</h1>
            <span class="topbar-subtitle">Password Security Platform</span>
          </div>
          <div class="topbar-actions">
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span>Secure</span>
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
      width: 240px;
      background: rgba(10, 11, 20, 0.95);
      border-right: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-close {
      display: none;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      width: 32px;
      height: 32px;
    }

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

    .logo-icon svg { width: 18px; height: 18px; }

    .logo-text {
      font-size: 1.1rem;
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
      padding: 0.625rem 0.75rem;
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .nav-item svg { width: 18px; height: 18px; flex-shrink: 0; }

    .nav-item:hover {
      background: rgba(255,255,255,0.05);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: rgba(99, 102, 241, 0.12);
      color: var(--accent-primary);
    }

    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .security-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--success);
      animation: pulse 2s infinite;
    }

    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .topbar {
      height: 56px;
      padding: 0 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
      background: rgba(10, 11, 20, 0.8);
      backdrop-filter: blur(12px);
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      align-items: center;
      justify-content: center;
    }

    .menu-toggle:hover { background: rgba(255,255,255,0.05); }
    .menu-toggle svg { width: 20px; height: 20px; }

    .topbar-title {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }

    .topbar-title h1 {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
    }

    .topbar-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .topbar-actions { margin-left: auto; }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 9999px;
      font-size: 0.75rem;
      color: var(--success);
      font-weight: 500;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--success);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        inset: 0;
        width: 280px;
        transform: translateX(-100%);
      }
      .sidebar.open { transform: translateX(0); }
      .sidebar-close { display: flex; }
      .menu-toggle { display: flex; }
      .topbar-subtitle { display: none; }
      .main-content { padding: 1rem; }
    }
  `]
})
export class LayoutComponent {
  sidebarOpen = signal(false);
}
