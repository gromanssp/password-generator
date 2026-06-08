import { Injectable } from '@angular/core';

export interface PassphraseConfig {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  includeNumber: boolean;
}

@Injectable({ providedIn: 'root' })
export class PassphraseService {
  private words = [
    'river', 'coffee', 'tiger', 'mountain', 'moon', 'forest', 'rocket', 'cloud',
    'ocean', 'dragon', 'crystal', 'shadow', 'phoenix', 'thunder', 'silver', 'copper',
    'garden', 'castle', 'bridge', 'falcon', 'lantern', 'marble', 'velvet', 'prism',
    'coral', 'ember', 'frost', 'galaxy', 'harbor', 'ivory', 'jasper', 'kindle',
    'lotus', 'meadow', 'nectar', 'orbit', 'puzzle', 'quartz', 'ripple', 'summit',
    'tundra', 'umbra', 'vortex', 'whisper', 'zenith', 'aurora', 'blaze', 'cipher',
    'delta', 'eclipse', 'flare', 'glacier', 'horizon', 'inferno', 'jungle', 'karma',
    'lava', 'mirage', 'nebula', 'oasis', 'polar', 'quantum', 'raven', 'stellar',
    'tempest', 'ultra', 'vapor', 'wildfire', 'xenon', 'yield', 'zephyr', 'apex',
    'bolt', 'comet', 'dusk', 'echo', 'flame', 'glyph', 'helix', 'iron',
    'jade', 'krypton', 'lynx', 'magnet', 'nova', 'onyx', 'pixel', 'quest'
  ];

  generate(config: PassphraseConfig): string {
    const selected: string[] = [];
    const array = new Uint32Array(config.wordCount);
    crypto.getRandomValues(array);

    for (let i = 0; i < config.wordCount; i++) {
      let word = this.words[array[i] % this.words.length];
      if (config.capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      selected.push(word);
    }

    let passphrase = selected.join(config.separator);

    if (config.includeNumber) {
      const numArray = new Uint32Array(1);
      crypto.getRandomValues(numArray);
      passphrase += config.separator + (numArray[0] % 100);
    }

    return passphrase;
  }

  estimateEntropy(config: PassphraseConfig): number {
    const wordEntropy = config.wordCount * Math.log2(this.words.length);
    const capitalEntropy = config.capitalize ? config.wordCount : 0;
    const numberEntropy = config.includeNumber ? Math.log2(100) : 0;
    return Math.round(wordEntropy + capitalEntropy + numberEntropy);
  }
}
