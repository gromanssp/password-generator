import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrengthComponent } from './strength.component';
import { StrengthService } from '../../services/strength.service';

describe('StrengthComponent', () => {
  let fixture: ComponentFixture<StrengthComponent>;
  let component: StrengthComponent;
  let strengthService: StrengthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StrengthComponent],
    });
    fixture = TestBed.createComponent(StrengthComponent);
    component = fixture.componentInstance;
    strengthService = TestBed.inject(StrengthService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty password', () => {
    expect(component.password()).toBe('');
  });

  it('should start with password hidden', () => {
    expect(component.showPassword()).toBe(false);
  });

  it('should toggle password visibility', () => {
    component.showPassword.set(true);
    expect(component.showPassword()).toBe(true);
  });

  it('should update result when password changes', () => {
    component.password.set('Test123!');
    fixture.detectChanges();
    expect(component.result().score).toBeGreaterThan(0);
  });

  it('should return 0 score for empty password', () => {
    expect(component.result().score).toBe(0);
    expect(component.result().level).toBe('very-weak');
  });

  it('should detect uppercase letters', () => {
    component.password.set('Hello');
    expect(component.hasUpper()).toBe(true);
    expect(component.hasLower()).toBe(true);
  });

  it('should detect numbers', () => {
    component.password.set('abc123');
    expect(component.hasNumbers()).toBe(true);
  });

  it('should detect symbols', () => {
    component.password.set('hello!');
    expect(component.hasSymbols()).toBe(true);
  });

  it('should set weak result for simple password', () => {
    component.password.set('abc');
    fixture.detectChanges();
    expect(component.result().level).toBe('very-weak');
  });

  it('should update hasUpper computed when password changes', () => {
    expect(component.hasUpper()).toBe(false);
    component.password.set('Hello');
    expect(component.hasUpper()).toBe(true);
  });
});
