import { Component, inject, output, signal } from '@angular/core';
import { ToogleSignalService } from '../toogle-signal.service';
import { CardAlertComponent } from "../card-alert/card-alert.component";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  length = signal(0);
  linkSymbols = signal(false);
  linkNumbers = signal(false);
  linkLetters = signal(false);

  toogleService = inject(ToogleSignalService);
  
  onClickSymbols(){
    this.linkSymbols.set(!this.linkSymbols());
    console.log('Simbols: ' + this.linkSymbols());
  }
  onClickNumbers(){
    this.linkNumbers.set(!this.linkNumbers());
    console.log('Numbers: ' + this.linkNumbers());
  }
  onClickLetters(){
    this.linkLetters.set(!this.linkLetters());
    console.log('Letters: ' + this.linkLetters());
  }
  onChangeLength( evento: any){
    const parsedValue = parseInt(evento.target.value);
    if(!isNaN(parsedValue)){
      this.length.update((u) => u = parsedValue);
      console.log('length: ' + this.length());
    }
  }

  onButtonClick() {
    const numbers = '1234567890';
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const symbols = '@!?#%&/()';
    let validChars = '';
    if(this.linkLetters()){
      validChars += letters;
    }
    if(this.linkNumbers()){
      validChars += numbers;
    }
    if(this.linkSymbols()){
      validChars += symbols;
    }

    const generatePassword = Array.from(
      {length: this.length()},
      () => validChars[Math.floor(Math.random() * validChars.length)]
    ).join('');
    
    console.log(`Password generated: ${generatePassword}`);
    this.toogleService.open(generatePassword);
  }
}
