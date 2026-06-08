import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyComponent } from './privacy.component';
import { provideRouter } from '@angular/router';

describe('PrivacyComponent', () => {
  let fixture: ComponentFixture<PrivacyComponent>;
  let component: PrivacyComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should render the privacy policy title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')).toBeTruthy();
  });

  it('should render legal sections', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.legal-section').length).toBeGreaterThan(0);
  });
});
