import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsComponent } from './terms.component';
import { provideRouter } from '@angular/router';

describe('TermsComponent', () => {
  let fixture: ComponentFixture<TermsComponent>;
  let component: TermsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should render the terms of service title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')).toBeTruthy();
  });

  it('should render legal sections', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.legal-section').length).toBeGreaterThan(0);
  });
});
