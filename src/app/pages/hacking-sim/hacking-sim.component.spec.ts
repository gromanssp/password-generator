import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HackingSimComponent } from './hacking-sim.component';
import { StrengthService } from '../../services/strength.service';

describe('HackingSimComponent', () => {
  let fixture: ComponentFixture<HackingSimComponent>;
  let component: HackingSimComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HackingSimComponent],
    });
    fixture = TestBed.createComponent(HackingSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty password', () => {
    expect(component.password()).toBe('');
  });

  it('should analyze password when typed', () => {
    component.password.set('TestPass123!');
    fixture.detectChanges();
    expect(component.result().score).toBeGreaterThan(0);
  });

  it('should mask password', () => {
    component.password.set('myPassword123');
    expect(component.maskedPassword()).toBe('my*********23');
  });

  it('should mask short passwords completely', () => {
    component.password.set('abc');
    expect(component.maskedPassword()).toBe('***');
  });

  it('should return safe verdict for strong passwords', () => {
    component.password.set('P@$$w0rd!xYz9#LmNqR!x');
    fixture.detectChanges();
    expect(component.verdictClass()).toBe('safe');
  });

  it('should return danger verdict for weak passwords', () => {
    component.password.set('12345');
    fixture.detectChanges();
    expect(component.verdictClass()).toBe('danger');
  });

  it('should return correct time class', () => {
    expect(component.getTimeClass(999999999999999)).toBe('safe');
    expect(component.getTimeClass(3601)).toBe('warning');
    expect(component.getTimeClass(1)).toBe('danger');
  });

  it('should provide verdict text', () => {
    component.password.set('weak');
    fixture.detectChanges();
    expect(component.verdictText()).toContain('Critical');
  });
});
