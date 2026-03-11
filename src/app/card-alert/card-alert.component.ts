import { Component, inject, OnInit, signal } from '@angular/core';
import { ToogleSignalService } from '../toogle-signal.service';

@Component({
  selector: 'app-card-alert',
  imports: [],
  templateUrl: './card-alert.component.html',
  styleUrl: './card-alert.component.scss'
})
export class CardAlertComponent {
  password = signal('');
  
  toogleService = inject(ToogleSignalService);

  close() {
    this.toogleService.close();
  }
}
