import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with English locale by default', () => {
    expect(service.locale()).toBe('en');
  });

  it('should have English translations loaded by default', () => {
    expect(service.translate('nav.generator')).toBe('Generator');
    expect(service.translate('page.generator.title')).toBe('Password Generator');
  });

  it('should return the key if translation not found', () => {
    expect(service.translate('nonexistent.key')).toBe('nonexistent.key');
  });

  it('should set locale and load translations via HTTP for non-English', () => {
    service.setLocale('es');
    const req = httpMock.expectOne('i18n/es.json');
    expect(req.request.url).toBe('i18n/es.json');
    req.flush({ nav: { generator: 'Generador' } });
    expect(service.locale()).toBe('es');
    expect(service.translate('nav.generator')).toBe('Generador');
  });

  it('should persist locale to localStorage', () => {
    service.setLocale('fr');
    const req = httpMock.expectOne('i18n/fr.json');
    req.flush({});
    expect(localStorage.getItem('securegen-locale')).toBe('fr');
  });
});
