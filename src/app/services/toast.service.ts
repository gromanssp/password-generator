import { Injectable, signal } from '@angular/core';
import { generateId } from '../utils/id';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  dismissing = signal<Set<string>>(new Set());

  show(message: string, type: Toast['type'] = 'success'): void {
    const toast: Toast = { id: generateId(), message, type };
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => this.dismiss(toast.id), 3000);
  }

  dismiss(id: string): void {
    this.dismissing.update(s => { s.add(id); return new Set(s); });
    setTimeout(() => {
      this.toasts.update(t => t.filter(x => x.id !== id));
      this.dismissing.update(s => { s.delete(id); return new Set(s); });
    }, 250);
  }
}
