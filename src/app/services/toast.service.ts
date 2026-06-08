import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'success'): void {
    const toast: Toast = { id: crypto.randomUUID(), message, type };
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => this.dismiss(toast.id), 3000);
  }

  dismiss(id: string): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
