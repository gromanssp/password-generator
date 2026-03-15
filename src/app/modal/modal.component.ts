import { Component, inject, Input } from '@angular/core';
import { ToogleSignalService } from '../toogle-signal.service';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  toogleService = inject(ToogleSignalService);

  close() {
    this.toogleService.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  copyCode(element: HTMLElement) {
  const text = element.innerText;

  navigator.clipboard.writeText(text).then(() => {
    console.log('Código copiado');
  }).catch(err => {
    console.error('Error al copiar', err);
  });
}
}
