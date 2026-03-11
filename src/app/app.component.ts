import { Component } from '@angular/core';
import { CardComponent } from './card/card.component';
import { CardAlertComponent } from './card-alert/card-alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CardComponent, CardAlertComponent]
})
export class AppComponent {
  title = 'password-generator';
}
