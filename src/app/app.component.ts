import { Component, inject, signal } from '@angular/core';
import { CardsSectionComponent } from './cards-section/cards-section.component';
import { ModalComponent } from './modal/modal.component';
import { ToogleSignalService } from './toogle-signal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CardsSectionComponent, ModalComponent]
})
export class AppComponent {
  title = 'password-generator';
  toogleService = inject(ToogleSignalService);
  copied = signal(false);

  copyPassword(): void {
    const password = this.toogleService.password();

    const writeToClipboard = navigator.clipboard?.writeText(password) ?? Promise.reject();

    writeToClipboard
      .catch(() => {
        // Fallback for iframe / non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = password;
        textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      })
      .finally(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
  }
}
