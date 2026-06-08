import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="legal-page anim-page-enter">
      <div class="legal-header">
        <h1>{{ 'legal.privacy.title' | translate }}</h1>
        <p class="legal-date">{{ 'legal.privacy.lastUpdated' | translate }}: June 8, 2026</p>
      </div>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.introTitle' | translate }}</h2>
        <p>{{ 'legal.privacy.introText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.dataTitle' | translate }}</h2>
        <p>{{ 'legal.privacy.dataText' | translate }}</p>
        <ul>
          <li>{{ 'legal.privacy.dataItem1' | translate }}</li>
          <li>{{ 'legal.privacy.dataItem2' | translate }}</li>
          <li>{{ 'legal.privacy.dataItem3' | translate }}</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.cookiesTitle' | translate }}</h2>
        <p>{{ 'legal.privacy.cookiesText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.localStorageTitle' | translate }}</h2>
        <p>{{ 'legal.privacy.localStorageText' | translate }}</p>
        <ul>
          <li>{{ 'legal.privacy.localItem1' | translate }}</li>
          <li>{{ 'legal.privacy.localItem2' | translate }}</li>
          <li>{{ 'legal.privacy.localItem3' | translate }}</li>
          <li>{{ 'legal.privacy.localItem4' | translate }}</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.sessionTitle' | translate }}</h2>
        <p>{{ 'legal.privacy.sessionText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.thirdPartyTitle' | translate }}</h2>
        <p>{{ 'legal.privacy.thirdPartyText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.rightsTitle' | translate }}</h2>
        <p>{{ 'legal.privacy.rightsText' | translate }}</p>
        <ul>
          <li>{{ 'legal.privacy.rightItem1' | translate }}</li>
          <li>{{ 'legal.privacy.rightItem2' | translate }}</li>
          <li>{{ 'legal.privacy.rightItem3' | translate }}</li>
          <li>{{ 'legal.privacy.rightItem4' | translate }}</li>
          <li>{{ 'legal.privacy.rightItem5' | translate }}</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.contactTitle' | translate }}</h2>
        <p>{{ 'legal.privacy.contactText' | translate }}</p>
      </section>
    </div>
  `,
  styles: [`
    .legal-page {
      max-width: 720px;
      margin: 0 auto;
      padding-bottom: 2rem;
    }
    .legal-header { margin-bottom: 2.5rem; }
    .legal-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .legal-date { font-size: 0.8rem; color: var(--text-muted); }
    .legal-section { margin-bottom: 2rem; }
    .legal-section h2 { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.75rem; }
    .legal-section p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 0.75rem; }
    .legal-section ul { list-style: disc; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .legal-section li { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }
  `]
})
export class PrivacyComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setMetaTags({
      title: 'Privacy Policy',
      description: 'SecureGen privacy policy. We do not collect, store, or transmit any personal data. All password processing happens locally in your browser.',
    });
  }
}
