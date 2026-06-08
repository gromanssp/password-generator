import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  robots?: string;
  canonicalUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly siteName = 'SecureGen — Password Security Platform';
  private readonly defaultDescription = 'Premium password security platform. Generate, analyze, and protect your passwords with advanced cybersecurity tools.';
  private readonly defaultOgImage = 'https://securegen.app/assets/og-image.png';
  private readonly baseUrl = 'https://securegen.app';

  setMetaTags(data: SeoData): void {
    const fullTitle = `${data.title} | ${this.siteName}`;
    const desc = data.description || this.defaultDescription;

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: data.ogTitle || data.title });
    this.meta.updateTag({ property: 'og:description', content: data.ogDescription || desc });
    this.meta.updateTag({ property: 'og:image', content: data.ogImage || this.defaultOgImage });
    this.meta.updateTag({ property: 'og:url', content: data.ogUrl || this.baseUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ name: 'twitter:card', content: data.twitterCard || 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.ogTitle || data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.ogDescription || desc });
    this.meta.updateTag({ name: 'twitter:image', content: data.ogImage || this.defaultOgImage });

    if (data.robots) {
      this.meta.updateTag({ name: 'robots', content: data.robots });
    }

    if (data.canonicalUrl && isPlatformBrowser(this.platformId)) {
      const existing = document.querySelector('link[rel="canonical"]');
      if (existing) {
        existing.setAttribute('href', data.canonicalUrl);
      }
    }
  }

  setDefaultMetaTags(): void {
    this.setMetaTags({
      title: 'Password Security Platform',
      description: this.defaultDescription,
      ogImage: this.defaultOgImage,
      ogUrl: this.baseUrl,
    });
  }
}
