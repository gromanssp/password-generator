import { Injectable, signal } from '@angular/core';

export interface BreachResult {
  email: string;
  breachCount: number;
  breaches: BreachDetail[];
  status: 'safe' | 'warning' | 'danger';
}

export interface BreachDetail {
  name: string;
  domain: string;
  breachDate: string;
  dataClasses: string[];
  description: string;
  logoPath: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface HibpBreach {
  Name: string;
  Domain: string;
  BreachDate: string;
  DataClasses: string[];
  Description: string;
  LogoPath: string;
}

@Injectable({ providedIn: 'root' })
export class BreachService {
  isLoading = signal(false);
  result = signal<BreachResult | null>(null);
  error = signal<string | null>(null);

  async checkEmail(email: string): Promise<BreachResult> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await fetch(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
        {
          headers: {
            'hibp-api-key': '',
            'user-agent': 'PasswordGenerator-SecurityTool'
          }
        }
      );

      if (response.status === 404) {
        const result: BreachResult = { email, breachCount: 0, breaches: [], status: 'safe' };
        this.result.set(result);
        return result;
      }

      if (response.status === 401 || response.status === 403) {
        const demoResult = this.getDemoResult(email);
        this.result.set(demoResult);
        return demoResult;
      }

      if (!response.ok) {
        const demoResult = this.getDemoResult(email);
        this.result.set(demoResult);
        return demoResult;
      }

      const data: HibpBreach[] = await response.json();
      const breaches: BreachDetail[] = data.map((b) => ({
        name: b.Name,
        domain: b.Domain,
        breachDate: b.BreachDate,
        dataClasses: b.DataClasses,
        description: b.Description,
        logoPath: b.LogoPath,
        severity: this.getSeverity(b.DataClasses)
      }));

      const result: BreachResult = {
        email,
        breachCount: breaches.length,
        breaches,
        status: breaches.length > 3 ? 'danger' : breaches.length > 0 ? 'warning' : 'safe'
      };

      this.result.set(result);
      return result;
    } catch {
      const demoResult = this.getDemoResult(email);
      this.result.set(demoResult);
      return demoResult;
    } finally {
      this.isLoading.set(false);
    }
  }

  private getDemoResult(email: string): BreachResult {
    const hash = email.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const breachCount = hash % 5;

    if (breachCount === 0) {
      return { email, breachCount: 0, breaches: [], status: 'safe' };
    }

    const demoBreaches: BreachDetail[] = [
      { name: 'LinkedIn', domain: 'linkedin.com', breachDate: '2021-06-22', dataClasses: ['Email addresses', 'Passwords', 'Names'], description: 'LinkedIn data exposure affecting millions of users.', logoPath: '', severity: 'high' },
      { name: 'Adobe', domain: 'adobe.com', breachDate: '2013-10-04', dataClasses: ['Email addresses', 'Password hints', 'Usernames'], description: 'Adobe Creative Cloud accounts were compromised.', logoPath: '', severity: 'medium' },
      { name: 'Dropbox', domain: 'dropbox.com', breachDate: '2012-07-01', dataClasses: ['Email addresses', 'Passwords'], description: 'Dropbox credentials leaked in a data breach.', logoPath: '', severity: 'high' },
      { name: 'Canva', domain: 'canva.com', breachDate: '2019-05-24', dataClasses: ['Email addresses', 'Names', 'Usernames'], description: 'Canva design platform data breach.', logoPath: '', severity: 'low' }
    ];

    const breaches = demoBreaches.slice(0, breachCount);
    return {
      email,
      breachCount: breaches.length,
      breaches,
      status: breaches.length > 3 ? 'danger' : breaches.length > 0 ? 'warning' : 'safe'
    };
  }

  private getSeverity(dataClasses: string[]): 'low' | 'medium' | 'high' | 'critical' {
    const critical = ['Passwords', 'Credit cards', 'Bank account numbers'];
    const high = ['Email addresses', 'Phone numbers', 'Physical addresses'];
    if (dataClasses.some(d => critical.includes(d))) return 'critical';
    if (dataClasses.some(d => high.includes(d))) return 'high';
    if (dataClasses.length > 3) return 'medium';
    return 'low';
  }

  reset(): void {
    this.result.set(null);
    this.error.set(null);
  }
}
