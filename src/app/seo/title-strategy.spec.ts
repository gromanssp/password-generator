import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy } from '@angular/router';
import { TemplatePageTitleStrategy } from './title-strategy';

describe('TemplatePageTitleStrategy', () => {
  let strategy: TemplatePageTitleStrategy;
  let title: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
      ],
    });
    strategy = TestBed.inject(TitleStrategy) as TemplatePageTitleStrategy;
    title = TestBed.inject(Title);
  });

  it('should be created', () => {
    expect(strategy).toBeTruthy();
  });

  it('should format title with site name suffix', () => {
    expect(strategy.formatTitle('Test Page')).toBe('Test Page | SecureGen — Password Security Platform');
  });

  it('should return base title when route title is empty', () => {
    expect(strategy.formatTitle('')).toBe('SecureGen — Password Security Platform');
  });

  it('should return base title when route title is null', () => {
    expect(strategy.formatTitle(null)).toBe('SecureGen — Password Security Platform');
  });

  it('should return base title when route title is undefined', () => {
    expect(strategy.formatTitle(undefined)).toBe('SecureGen — Password Security Platform');
  });
});
