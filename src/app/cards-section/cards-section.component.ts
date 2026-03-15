import { Component, inject, signal } from '@angular/core';
import { ToogleSignalService } from '../toogle-signal.service';

@Component({
  selector: 'app-cards-section',
  templateUrl: './cards-section.component.html',
  styleUrl: './cards-section.component.css'
})
export class CardsSectionComponent {
  length = signal(0);
  linkSymbols = signal(false);
  linkNumbers = signal(false);
  linkLetters = signal(false);

  toogleService = inject(ToogleSignalService);
  
  onClickSymbols(){
    this.linkSymbols.set(!this.linkSymbols());
  }
  onClickNumbers(){
    this.linkNumbers.set(!this.linkNumbers());
  }
  onClickLetters(){
    this.linkLetters.set(!this.linkLetters());
  }
  onChangeLength( evento: any){
    const parsedValue = parseInt(evento.target.value);
    if(!isNaN(parsedValue)){
      this.length.set(parsedValue);
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
    
    this.toogleService.open(generatePassword);
  }
}
