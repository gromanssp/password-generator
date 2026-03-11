import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToogleSignalService {
  isOpen = signal<boolean>(false);
  password = signal('');

  constructor() {
    console.log(`isOpen: ${this.isOpen()}`);
  }

  open(psw: string) { 
    console.log(`OPen`);

    this.password.update((u) => u = psw);
    this.isOpen.set(true); 
  }

  close() { 
    console.log(`Close`);
    this.isOpen.set(false); 
    this.password.update((p) => p = '');
  }
}
