import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let title: Title;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set title with site name suffix', () => {
    service.setMetaTags({ title: 'Test Page', description: 'Test description' });
    expect(title.getTitle()).toBe('Test Page | SecureGen — Password Security Platform');
  });

  it('should set meta description', () => {
    service.setMetaTags({ title: 'Test', description: 'Custom description' });
    expect(meta.getTag('name="description"')?.content).toBe('Custom description');
  });

  it('should use default description when not provided', () => {
    service.setMetaTags({ title: 'Test' });
    expect(meta.getTag('name="description"')?.content).toBeTruthy();
  });

  it('should set OG title and description', () => {
    service.setMetaTags({
      title: 'Test',
      description: 'Desc',
      ogTitle: 'OG Title',
      ogDescription: 'OG Description',
    });
    expect(meta.getTag('property="og:title"')?.content).toBe('OG Title');
    expect(meta.getTag('property="og:description"')?.content).toBe('OG Description');
  });

  it('should fallback OG to title when not provided', () => {
    service.setMetaTags({ title: 'Test Title', description: 'Desc' });
    expect(meta.getTag('property="og:title"')?.content).toBe('Test Title');
  });

  it('should set OG image', () => {
    service.setMetaTags({ title: 'Test', description: 'Desc', ogImage: 'https://example.com/image.png' });
    expect(meta.getTag('property="og:image"')?.content).toBe('https://example.com/image.png');
  });

  it('should set default OG image when not provided', () => {
    service.setMetaTags({ title: 'Test', description: 'Desc' });
    expect(meta.getTag('property="og:image"')?.content).toBeTruthy();
  });

  it('should set OG url', () => {
    service.setMetaTags({ title: 'Test', description: 'Desc', ogUrl: 'https://example.com/page' });
    expect(meta.getTag('property="og:url"')?.content).toBe('https://example.com/page');
  });

  it('should set OG type to website', () => {
    service.setMetaTags({ title: 'Test', description: 'Desc' });
    expect(meta.getTag('property="og:type"')?.content).toBe('website');
  });

  it('should set Twitter Card tags', () => {
    service.setMetaTags({ title: 'Test', description: 'Desc' });
    expect(meta.getTag('name="twitter:card"')?.content).toBe('summary_large_image');
    expect(meta.getTag('name="twitter:title"')?.content).toBe('Test');
    expect(meta.getTag('name="twitter:description"')?.content).toBe('Desc');
  });

  it('should set custom Twitter Card type', () => {
    service.setMetaTags({ title: 'Test', description: 'Desc', twitterCard: 'summary' });
    expect(meta.getTag('name="twitter:card"')?.content).toBe('summary');
  });

  it('should set robots meta tag', () => {
    service.setMetaTags({ title: 'Test', description: 'Desc', robots: 'noindex' });
    expect(meta.getTag('name="robots"')?.content).toBe('noindex');
  });

  it('should set default meta tags', () => {
    service.setDefaultMetaTags();
    expect(title.getTitle()).toBe('Password Security Platform | SecureGen — Password Security Platform');
  });
});
