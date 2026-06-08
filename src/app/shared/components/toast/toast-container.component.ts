import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast"
          [class.toast-exit]="toastService.dismissing().has(toast.id)"
          [class]="'toast-' + toast.type"
          (click)="toastService.dismiss(toast.id)"
        >
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg> }
              @case ('error') { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg> }
              @case ('warning') { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m12-11L4 18" stroke-linecap="round" stroke-linejoin="round"/></svg> }
              @default { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg> }
            }
          </div>
          <span>{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      pointer-events: auto;
      animation: toastSlideIn 0.3s ease-out;
      transition: opacity 0.25s ease, transform 0.25s ease;
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color-strong);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }

    .toast.toast-exit {
      opacity: 0;
      transform: translateX(100%) scale(0.9);
    }

    .toast-icon svg { width: 16px; height: 16px; }

    .toast-success { background: rgba(16,185,129,0.15); color: var(--success); border-color: rgba(16,185,129,0.3); }
    .toast-error { background: rgba(239,68,68,0.15); color: var(--danger); border-color: rgba(239,68,68,0.3); }
    .toast-warning { background: rgba(245,158,11,0.15); color: var(--warning); border-color: rgba(245,158,11,0.3); }
    .toast-info { background: rgba(59,130,246,0.15); color: var(--info); border-color: rgba(59,130,246,0.3); }

    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateX(100%) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
  `]
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
