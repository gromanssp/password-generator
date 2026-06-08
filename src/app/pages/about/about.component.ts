import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="about-page anim-page-enter">
      <div class="hero">
        <div class="hero-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L3 7v6c0 5.25 3.83 10.16 9 11.25 5.17-1.09 9-6 9-11.25V7l-9-5z"/>
            <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="hero-title">{{ 'page.about.hero.title' | translate }}</h1>
        <p class="hero-desc">{{ 'page.about.hero.desc' | translate }}</p>
      </div>

      <section class="features-section">
        <h2 class="section-title">{{ 'page.about.featuresTitle' | translate }}</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon icon-gen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.feature.generator.title' | translate }}</h3>
            <p>{{ 'page.about.feature.generator.desc' | translate }}</p>
            <span class="feature-tags">{{ 'page.about.feature.generator.items' | translate }}</span>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-str"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.feature.strength.title' | translate }}</h3>
            <p>{{ 'page.about.feature.strength.desc' | translate }}</p>
            <span class="feature-tags">{{ 'page.about.feature.strength.items' | translate }}</span>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-phrase"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.feature.passphrase.title' | translate }}</h3>
            <p>{{ 'page.about.feature.passphrase.desc' | translate }}</p>
            <span class="feature-tags">{{ 'page.about.feature.passphrase.items' | translate }}</span>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-hack"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.feature.hackingSim.title' | translate }}</h3>
            <p>{{ 'page.about.feature.hackingSim.desc' | translate }}</p>
            <span class="feature-tags">{{ 'page.about.feature.hackingSim.items' | translate }}</span>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-history"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.feature.history.title' | translate }}</h3>
            <p>{{ 'page.about.feature.history.desc' | translate }}</p>
            <span class="feature-tags">{{ 'page.about.feature.history.items' | translate }}</span>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-dash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.feature.dashboard.title' | translate }}</h3>
            <p>{{ 'page.about.feature.dashboard.desc' | translate }}</p>
            <span class="feature-tags">{{ 'page.about.feature.dashboard.items' | translate }}</span>
          </div>
        </div>
      </section>

      <section class="tech-section">
        <h2 class="section-title">{{ 'page.about.techTitle' | translate }}</h2>
        <div class="tech-grid">
          <div class="tech-card">
            <div class="tech-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.tech.encryption.title' | translate }}</h3>
            <p>{{ 'page.about.tech.encryption.desc' | translate }}</p>
          </div>
          <div class="tech-card">
            <div class="tech-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.tech.i18n.title' | translate }}</h3>
            <p>{{ 'page.about.tech.i18n.desc' | translate }}</p>
          </div>
          <div class="tech-card">
            <div class="tech-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke-linecap="round"/></svg></div>
            <h3>{{ 'page.about.tech.theme.title' | translate }}</h3>
            <p>{{ 'page.about.tech.theme.desc' | translate }}</p>
          </div>
          <div class="tech-card">
            <div class="tech-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>{{ 'page.about.tech.privacy.title' | translate }}</h3>
            <p>{{ 'page.about.tech.privacy.desc' | translate }}</p>
          </div>
        </div>
      </section>

      <div class="about-footer">
        <a routerLink="/privacy" class="about-link">{{ 'nav.privacy' | translate }}</a>
        <span class="about-sep">&middot;</span>
        <a routerLink="/terms" class="about-link">{{ 'nav.terms' | translate }}</a>
      </div>
    </div>
  `,
  styles: [`
    .about-page { max-width: 800px; margin: 0 auto; padding-bottom: 2rem; }

    .hero { text-align: center; margin-bottom: 3rem; }
    .hero-icon {
      width: 56px; height: 56px; margin: 0 auto 1rem;
      background: var(--accent-gradient);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      color: white;
    }
    .hero-icon svg { width: 28px; height: 28px; }
    .hero-title { font-size: 1.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .hero-desc { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; max-width: 500px; margin: 0 auto; }

    .section-title {
      font-size: 1.25rem; font-weight: 700; color: var(--text-primary);
      margin-bottom: 1.25rem;
    }

    .features-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 2.5rem; }
    .feature-card {
      display: flex; flex-direction: column; gap: 0.375rem;
      padding: 1.25rem; background: var(--bg-surface);
      border: 1px solid var(--border-color); border-radius: 12px;
    }
    .feature-icon {
      width: 36px; height: 36px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem;
    }
    .feature-icon svg { width: 18px; height: 18px; }
    .icon-gen { background: rgba(99,102,241,0.15); color: var(--accent-primary); }
    .icon-str { background: rgba(16,185,129,0.15); color: var(--success); }
    .icon-phrase { background: rgba(245,158,11,0.15); color: var(--warning); }
    .icon-hack { background: rgba(139,92,246,0.15); color: var(--accent-secondary); }
    .icon-history { background: rgba(59,130,246,0.15); color: var(--info); }
    .icon-dash { background: rgba(16,185,129,0.15); color: var(--success); }
    .feature-card h3 { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
    .feature-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
    .feature-tags { font-size: 0.75rem; color: var(--text-muted); }

    .tech-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 2rem; }
    .tech-card {
      padding: 1.25rem; background: var(--bg-surface);
      border: 1px solid var(--border-color); border-radius: 12px;
    }
    .tech-icon {
      width: 32px; height: 32px; border-radius: 6px;
      background: rgba(99,102,241,0.12); color: var(--accent-primary);
      display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;
    }
    .tech-icon svg { width: 16px; height: 16px; }
    .tech-card h3 { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
    .tech-card p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }

    .about-footer { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
    .about-link { font-size: 0.8rem; color: var(--text-muted); text-decoration: none; }
    .about-link:hover { color: var(--text-secondary); }
    .about-sep { font-size: 0.7rem; color: var(--text-muted); opacity: 0.5; }

    @media (min-width: 576px) {
      .features-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class AboutComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setMetaTags({
      title: 'About',
      description: 'Learn about SecureGen password security platform. Features include password generator, strength analyzer, passphrase generator, and more.',
    });
  }
}
