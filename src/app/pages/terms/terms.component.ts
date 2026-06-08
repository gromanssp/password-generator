import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-terms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="legal-page anim-page-enter">
      <div class="legal-header">
        <h1>{{ 'legal.terms.title' | translate }}</h1>
        <p class="legal-date">{{ 'legal.privacy.lastUpdated' | translate }}: June 8, 2026</p>
      </div>

      <section class="legal-section">
        <h2>{{ 'legal.terms.acceptanceTitle' | translate }}</h2>
        <p>{{ 'legal.terms.acceptanceText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.terms.serviceTitle' | translate }}</h2>
        <p>{{ 'legal.terms.serviceText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.terms.intellectualTitle' | translate }}</h2>
        <p>{{ 'legal.terms.intellectualText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.terms.disclaimerTitle' | translate }}</h2>
        <p>{{ 'legal.terms.disclaimerText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.terms.limitationTitle' | translate }}</h2>
        <p>{{ 'legal.terms.limitationText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.terms.changesTitle' | translate }}</h2>
        <p>{{ 'legal.terms.changesText' | translate }}</p>
      </section>

      <section class="legal-section">
        <h2>{{ 'legal.privacy.contactTitle' | translate }}</h2>
        <p>{{ 'legal.terms.contactText' | translate }}</p>
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
export class TermsComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setMetaTags({
      title: 'Terms of Service',
      description: 'SecureGen terms of service. By using our password security platform, you agree to these terms and conditions.',
    });
  }
}
