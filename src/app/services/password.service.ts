import { Injectable, signal } from '@angular/core';

export interface PasswordContext {
  id: string;
  name: string;
  iconId: string;
  description: string;
  config: PasswordConfig;
}

export interface PasswordConfig {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  excludeSimilar: boolean;
}

@Injectable({ providedIn: 'root' })
export class PasswordService {
  readonly generatedPassword = signal('');

  readonly contexts: readonly PasswordContext[] = [
    {
      id: 'banking',
      name: 'Banking & Finance',
      iconId: 'banking',
      description: 'Maximum security for financial accounts',
      config: { length: 24, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: true, excludeSimilar: true }
    },
    {
      id: 'social',
      name: 'Social Media',
      iconId: 'social',
      description: 'Balanced security and memorability',
      config: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: false, excludeAmbiguous: false, excludeSimilar: true }
    },
    {
      id: 'work',
      name: 'Work & Business',
      iconId: 'work',
      description: 'Enterprise-grade passwords',
      config: { length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: true, excludeSimilar: false }
    },
    {
      id: 'gaming',
      name: 'Gaming',
      iconId: 'gaming',
      description: 'Easy to type but secure',
      config: { length: 14, uppercase: true, lowercase: true, numbers: true, symbols: false, excludeAmbiguous: false, excludeSimilar: true }
    },
    {
      id: 'wifi',
      name: 'WiFi Networks',
      iconId: 'wifi',
      description: 'Strong passwords for routers',
      config: { length: 20, uppercase: true, lowercase: true, numbers: true, symbols: false, excludeAmbiguous: true, excludeSimilar: true }
    },
    {
      id: 'developer',
      name: 'Developer / API Keys',
      iconId: 'developer',
      description: 'High entropy passwords',
      config: { length: 32, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: false, excludeSimilar: false }
    },
    {
      id: 'custom',
      name: 'Custom',
      iconId: 'custom',
      description: 'Configure your own settings',
      config: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: false, excludeSimilar: false }
    }
  ];

  generate(config: PasswordConfig): string {
    let chars = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const ambiguous = '{}[]()/\\\'"`~,;:.<>';
    const similar = 'il1Lo0O';

    if (config.uppercase) chars += upper;
    if (config.lowercase) chars += lower;
    if (config.numbers) chars += nums;
    if (config.symbols) chars += syms;

    if (config.excludeAmbiguous) {
      chars = chars.split('').filter(c => !ambiguous.includes(c)).join('');
    }
    if (config.excludeSimilar) {
      chars = chars.split('').filter(c => !similar.includes(c)).join('');
    }

    if (!chars) chars = lower + nums;

    const array = new Uint32Array(config.length);
    crypto.getRandomValues(array);
    const password = Array.from(array, v => chars[v % chars.length]).join('');

    this.generatedPassword.set(password);
    return password;
  }
}
