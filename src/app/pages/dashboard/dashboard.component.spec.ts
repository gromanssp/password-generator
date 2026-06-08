import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HistoryService } from '../../services/history.service';
import { EncryptionService } from '../../services/encryption.service';

class MockEncryptionService {
  async encrypt(plaintext: string): Promise<string> {
    return btoa(unescape(encodeURIComponent(plaintext)));
  }
  async decrypt(ciphertext: string): Promise<string> {
    try {
      return decodeURIComponent(escape(atob(ciphertext)));
    } catch {
      return '';
    }
  }
  isKeyAvailable(): boolean { return true; }
}

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let historyService: HistoryService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: EncryptionService, useClass: MockEncryptionService },
      ],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    historyService = TestBed.inject(HistoryService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show 0 when no entries', () => {
    expect(component.totalPasswords()).toBe(0);
    expect(component.averageStrength()).toBe(0);
  });

  it('should display N/A health label with no entries', () => {
    expect(component.healthLabel()).toBe('page.dashboard.healthNA');
  });

  it('should calculate total passwords', async () => {
    await historyService.add('pass1', 'A', 50);
    await historyService.add('pass2', 'B', 70);
    expect(component.totalPasswords()).toBe(2);
  });

  it('should count strong passwords (>=70)', async () => {
    await historyService.add('pass1', 'A', 50);
    await historyService.add('pass2', 'B', 85);
    await historyService.add('pass3', 'C', 90);
    expect(component.strongCount()).toBe(2);
  });

  it('should count weak passwords (<40)', async () => {
    await historyService.add('pass1', 'A', 20);
    await historyService.add('pass2', 'B', 85);
    await historyService.add('pass3', 'C', 30);
    expect(component.weakCount()).toBe(2);
  });

  it('should calculate average strength', async () => {
    await historyService.add('pass1', 'A', 50);
    await historyService.add('pass2', 'B', 70);
    expect(component.averageStrength()).toBe(60);
  });

  it('should return good health class for avg >= 70', async () => {
    await historyService.add('pass1', 'A', 80);
    await historyService.add('pass2', 'B', 90);
    expect(component.healthClass()).toBe('good');
    expect(component.healthLabel()).toBe('page.dashboard.healthGood');
  });

  it('should return fair health class for avg >= 40 and < 70', async () => {
    await historyService.add('pass1', 'A', 50);
    await historyService.add('pass2', 'B', 60);
    expect(component.healthClass()).toBe('fair');
    expect(component.healthLabel()).toBe('page.dashboard.healthFair');
  });

  it('should return poor health class for avg < 40', async () => {
    await historyService.add('pass1', 'A', 20);
    expect(component.healthClass()).toBe('poor');
    expect(component.healthLabel()).toBe('page.dashboard.healthPoor');
  });
});
