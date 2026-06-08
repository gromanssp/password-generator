import { TestBed } from '@angular/core/testing';
import { StrengthService } from './strength.service';

describe('StrengthService', () => {
  let service: StrengthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrengthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 0 score for empty password', () => {
    const result = service.analyze('');
    expect(result.score).toBe(0);
    expect(result.entropy).toBe(0);
    expect(result.level).toBe('very-weak');
  });

  it('should detect very weak password', () => {
    const result = service.analyze('123456');
    expect(result.score).toBeLessThan(20);
    expect(result.level).toBe('very-weak');
  });

  it('should detect common password', () => {
    const result = service.analyze('password');
    expect(result.weaknesses).toContain('This is a commonly used password');
  });

  it('should detect short password weakness', () => {
    const result = service.analyze('Ab1');
    expect(result.weaknesses).toContain('Too short (less than 8 characters)');
  });

  it('should detect only letters weakness', () => {
    const result = service.analyze('abcdefgh');
    expect(result.weaknesses).toContain('Contains only letters');
  });

  it('should detect only numbers weakness', () => {
    const result = service.analyze('12345678');
    expect(result.weaknesses).toContain('Contains only numbers');
  });

  it('should detect repeated characters', () => {
    const result = service.analyze('aaabbb12');
    expect(result.weaknesses).toContain('Contains repeated characters');
  });

  it('should detect year pattern', () => {
    const result = service.analyze('Password2024!');
    expect(result.weaknesses).toContain('Contains a year pattern');
  });

  it('should return strong for a very strong password', () => {
    const result = service.analyze('P@$$w0rd!xYz9#LmNqR');
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(['strong', 'very-strong']).toContain(result.level);
  });

  it('should suggest adding uppercase when missing', () => {
    const result = service.analyze('lowercaseonly123');
    expect(result.suggestions).toContain('Add uppercase letters');
  });

  it('should suggest adding numbers when missing', () => {
    const result = service.analyze('OnlyLettersNoNumbers');
    expect(result.suggestions).toContain('Add numbers');
  });

  it('should suggest adding special characters when missing', () => {
    const result = service.analyze('OnlyLettersAnd123');
    expect(result.suggestions).toContain('Add special characters');
  });

  it('should give excellent entropy suggestion for 16+ char passwords with no weaknesses', () => {
    const result = service.analyze('Xk9mP2rT5vN8QwZy');
    expect(result.suggestions).toContain('Excellent entropy!');
  });

  it('should calculate entropy correctly for lowercase only', () => {
    const result = service.analyze('abcdefgh');
    expect(result.entropy).toBeCloseTo(8 * Math.log2(26), 0);
  });

  it('should calculate entropy correctly for mixed case', () => {
    const result = service.analyze('AbcdEfgh');
    expect(result.entropy).toBeCloseTo(8 * Math.log2(52), 0);
  });

  it('should format crack times correctly', () => {
    const result = service.analyze('P@$$w0rd!xYz');
    expect(result.crackTimes.dictionary).toBeTruthy();
    expect(result.crackTimes.bruteForce).toBeTruthy();
    expect(result.crackTimes.gpuCluster).toBeTruthy();
    expect(result.crackTimes.aiAssisted).toBeTruthy();
  });

  it('should mark common password with fast dictionary crack time', () => {
    const result = service.analyze('monkey');
    // 0.001 seconds → formatted as "1 ms" or "Instant" if < 0.001
    expect(['1 ms', 'Instant']).toContain(result.crackTimes.dictionary);
  });
});
