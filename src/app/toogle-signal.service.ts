import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToogleSignalService {
  isOpen = signal<boolean>(false);
  password = signal('');

  open(psw: string) {
    this.password.set(psw);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.password.set('');
  }
}
