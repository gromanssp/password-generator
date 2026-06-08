import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export type Locale = 'en' | 'es' | 'it' | 'hi' | 'fr';

interface Translations {
  [key: string]: string | Translations;
}

const EN: Translations = {
  nav: {
    generator: 'Generator',
    strength: 'Strength',
    hackSim: 'Hack Sim',
    passphrase: 'Passphrase',
    history: 'History',
    dashboard: 'Dashboard',
    allDataStoredLocally: 'All data stored locally',
    secure: 'Secure',
    passwordSecurityPlatform: 'Password Security Platform',
    privacy: 'Privacy',
    terms: 'Terms',
  },
  page: {
    generator: {
      title: 'Password Generator',
      desc: 'Choose a context and generate secure passwords instantly',
      settings: 'Settings',
      chars: 'chars',
      passwordLength: 'Password Length:',
      uppercase: 'Uppercase (A-Z)',
      lowercase: 'Lowercase (a-z)',
      numbers: 'Numbers (0-9)',
      symbols: 'Symbols (!&#64;#$%)',
      excludeAmbiguous: 'Exclude Ambiguous',
      excludeSimilar: 'Exclude Similar',
      generatePassword: 'Generate Password',
      generatedPassword: 'Generated Password',
      copy: 'Copy',
      regenerate: 'Regenerate',
      save: 'Save',
      copiedToClipboard: 'Password copied to clipboard!',
      savedToHistory: 'Password saved to history',
      context: {
        banking: { name: 'Banking & Finance', desc: 'Maximum security for financial accounts' },
        social: { name: 'Social Media', desc: 'Balanced security and memorability' },
        work: { name: 'Work & Business', desc: 'Enterprise-grade passwords' },
        gaming: { name: 'Gaming', desc: 'Easy to type but secure' },
        wifi: { name: 'WiFi Networks', desc: 'Strong passwords for routers' },
        developer: { name: 'Developer / API Keys', desc: 'High entropy passwords' },
        custom: { name: 'Custom', desc: 'Configure your own settings' },
      },
    },
    strength: {
      title: 'Password Strength Analyzer',
      desc: 'Type or paste a password to get a detailed security analysis',
      placeholder: 'Enter a password to analyze...',
      entropy: 'Entropy:',
      bits: 'bits',
      complexityBreakdown: 'Complexity Breakdown',
      length: 'Length',
      char: 'chars',
      uppercase: 'Uppercase',
      lowercase: 'Lowercase',
      numbers: 'Numbers',
      symbols: 'Symbols',
      yes: 'Yes',
      no: 'No',
      weaknesses: 'Weaknesses Detected',
      suggestions: 'Suggestions',
    },
    passphrase: {
      title: 'Passphrase Generator',
      desc: 'Generate memorable yet secure passphrases using random word combinations',
      wordCount: 'Word Count:',
      separator: 'Separator',
      capitalizeWords: 'Capitalize Words',
      includeNumber: 'Include Number',
      generatePassphrase: 'Generate Passphrase',
      estimatedEntropy: 'Estimated Entropy',
      characters: 'characters',
      words: 'words',
      copy: 'Copy',
      regenerate: 'Regenerate',
      save: 'Save',
      emptyState: 'Configure settings and click generate',
      exampleFormats: 'Example Formats',
      hyphenSeparated: 'Hyphen separated',
      symbolSeparatedCaps: 'Symbol separated + caps',
      dotSeparatedNumber: 'Dot separated + number',
    },
    history: {
      title: 'Password History',
      desc: 'All passwords are stored locally in your browser only',
      searchPlaceholder: 'Search passwords...',
      all: 'All',
      favorites: 'Favorites',
      clearAll: 'Clear All',
      emptyTitle: 'No passwords saved yet',
      emptyDesc: 'Generated passwords will appear here when you save them',
    },
    dashboard: {
      title: 'Security Dashboard',
      desc: 'Your personal security overview',
      passwordHealth: 'Password Health',
      totalSaved: 'Total Saved',
      strong: 'Strong',
      weak: 'Weak',
      securityTips: 'Security Tips',
      tip1: 'Use unique passwords for every account',
      tip2: 'Enable two-factor authentication everywhere',
      tip3: 'Rotate passwords every 90 days',
      tip4: 'Monitor accounts for suspicious activity',
      quickActions: 'Quick Actions',
      generatePassword: 'Generate Password',
      checkStrength: 'Check Strength',
      passphrase: 'Passphrase',
      mfaStatusGuide: 'MFA Status Guide',
      mfaEmail: 'Email',
      mfaRecommended: 'Recommended',
      mfaBanking: 'Banking',
      mfaEssential: 'Essential',
      mfaSocialMedia: 'Social Media',
      mfaCloudStorage: 'Cloud Storage',
      mfaWorkTools: 'Work Tools',
      healthGood: 'Good',
      healthFair: 'Fair',
      healthPoor: 'Poor',
      healthNA: 'N/A',
    },
    hackingSim: {
      title: 'Hacking Simulation',
      desc: 'Experience how hackers crack passwords with real-world attack simulations',
      placeholder: 'Enter a password to simulate attacks...',
    },
  },
  legal: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated',
      introTitle: 'Our Commitment to Privacy',
      introText: 'At SecureGen, we take your privacy seriously. This policy explains what information we collect, how we use it, and what rights you have.',
      dataTitle: 'Data Collection',
      dataText: 'We do not collect, store, or transmit any personal data. Key points:',
      dataItem1: 'No account registration required',
      dataItem2: 'No email collection or tracking',
      dataItem3: 'No analytics or monitoring services',
      cookiesTitle: 'Cookies',
      cookiesText: 'This website does not use cookies for tracking, analytics, or any other purpose.',
      localStorageTitle: 'Local Storage',
      localStorageText: 'We use your browser\'s local storage only for your preferences and generated password history:',
      localItem1: 'Theme preference (light/dark)',
      localItem2: 'Language preference',
      localItem3: 'Password history (you can clear this anytime)',
      localItem4: 'All data stays on your device',
      sessionTitle: 'Session Storage',
      sessionText: 'Your encryption key is stored in sessionStorage and is automatically deleted when you close your browser tab. No key is ever transmitted.',
      thirdPartyTitle: 'Third-Party Services',
      thirdPartyText: 'This site loads fonts from Google Fonts (fonts.googleapis.com and fonts.gstatic.com). Your IP address is sent to Google as part of the font request. No other third-party services are used.',
      rightsTitle: 'Your Rights (GDPR)',
      rightsText: 'Under GDPR, you have the following rights:',
      rightItem1: 'Right to access: View your stored data',
      rightItem2: 'Right to rectification: Modify any stored data',
      rightItem3: 'Right to erasure: Clear your history anytime',
      rightItem4: 'Right to portability: Your data never leaves your device',
      rightItem5: 'Right to withdraw consent: Simply stop using the service',
      contactTitle: 'Contact',
      contactText: 'If you have questions about this policy, please open an issue on our GitHub repository.',
    },
    terms: {
      title: 'Terms of Service',
      acceptanceTitle: 'Acceptance of Terms',
      acceptanceText: 'By using SecureGen, you agree to these terms of service.',
      serviceTitle: 'Service Description',
      serviceText: 'SecureGen is a free, open-source password security platform. All processing happens locally in your browser.',
      intellectualTitle: 'Intellectual Property',
      intellectualText: 'The SecureGen source code is open-source and available under the MIT license.',
      disclaimerTitle: 'Disclaimer',
      disclaimerText: 'SecureGen is provided \'as is\' without warranty of any kind.',
      limitationTitle: 'Limitation of Liability',
      limitationText: 'SecureGen and its contributors shall not be liable for any damages arising from the use of this service.',
      changesTitle: 'Changes to Terms',
      changesText: 'We reserve the right to update these terms at any time.',
      contactText: 'For questions about these terms, please open an issue on our GitHub repository.',
    },
  },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly locale = signal<Locale>(this.getInitialLocale());
  readonly translations = signal<Translations>(EN);

  constructor() {
    if (this.isBrowser) {
      document.documentElement.setAttribute('lang', this.locale());
      this.loadFont(this.locale());
    }
    if (this.locale() !== 'en') {
      this.loadTranslations(this.locale());
    }
  }

  private getInitialLocale(): Locale {
    if (!this.isBrowser) return 'en';
    const stored = localStorage.getItem('securegen-locale') as Locale | null;
    if (stored && ['en', 'es', 'it', 'hi', 'fr'].includes(stored)) return stored;
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && ['es', 'it', 'hi', 'fr'].includes(browserLang)) return browserLang as Locale;
    return 'en';
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    if (this.isBrowser) {
      localStorage.setItem('securegen-locale', locale);
      document.documentElement.setAttribute('lang', locale);
      this.loadFont(locale);
    }
    if (locale === 'en') {
      this.translations.set(EN);
    } else {
      this.loadTranslations(locale);
    }
  }

  private loadFont(locale: Locale): void {
    if (locale !== 'hi') return;
    const id = 'hi-font';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  private loadTranslations(locale: Locale): void {
    this.http.get<Translations>(`i18n/${locale}.json`).subscribe({
      next: (t) => this.translations.set(t),
    });
  }

  translate(key: string): string {
    const parts = key.split('.');
    let current: Translations | string | undefined = this.translations();
    for (const part of parts) {
      if (typeof current !== 'object' || current === null) return key;
      current = current[part];
    }
    return typeof current === 'string' ? current : key;
  }
}
