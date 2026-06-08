import { Injectable } from '@angular/core';

export interface StrengthResult {
  score: number;
  entropy: number;
  crackTimes: CrackTimes;
  weaknesses: string[];
  suggestions: string[];
  level: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  label: string;
}

export interface CrackTimes {
  dictionary: string;
  bruteForce: string;
  gpuCluster: string;
  aiAssisted: string;
  dictionarySeconds: number;
  bruteForceSeconds: number;
  gpuClusterSeconds: number;
  aiAssistedSeconds: number;
}

@Injectable({ providedIn: 'root' })
export class StrengthService {
  private commonPasswords = new Set([
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
    'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine',
    'letmein', 'football', 'shadow', 'superman', 'michael', 'password1'
  ]);

  analyze(password: string): StrengthResult {
    if (!password) {
      return { score: 0, entropy: 0, crackTimes: this.getEmptyCrackTimes(), weaknesses: [], suggestions: ['Enter a password to analyze'], level: 'very-weak', label: 'No password' };
    }

    const entropy = this.calculateEntropy(password);
    const weaknesses = this.findWeaknesses(password);
    const suggestions = this.getSuggestions(password, weaknesses);
    const score = this.calculateScore(password, entropy, weaknesses);
    const crackTimes = this.estimateCrackTimes(entropy, password);
    const { level, label } = this.getLevel(score);

    return { score, entropy, crackTimes, weaknesses, suggestions, level, label };
  }

  private calculateEntropy(password: string): number {
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;
    return poolSize > 0 ? password.length * Math.log2(poolSize) : 0;
  }

  private findWeaknesses(password: string): string[] {
    const weaknesses: string[] = [];
    if (this.commonPasswords.has(password.toLowerCase())) weaknesses.push('This is a commonly used password');
    if (/^[a-zA-Z]+$/.test(password)) weaknesses.push('Contains only letters');
    if (/^[0-9]+$/.test(password)) weaknesses.push('Contains only numbers');
    if (/(.)\1{2,}/.test(password)) weaknesses.push('Contains repeated characters');
    if (/^(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password)) weaknesses.push('Starts with a common sequence');
    if (password.length < 8) weaknesses.push('Too short (less than 8 characters)');
    if (/^[a-z]+$/i.test(password) && password.length < 12) weaknesses.push('No numbers or symbols');
    if (/19\d{2}|20[0-2]\d/.test(password)) weaknesses.push('Contains a year pattern');
    return weaknesses;
  }

  private getSuggestions(password: string, weaknesses: string[]): string[] {
    const suggestions: string[] = [];
    if (password.length < 12) suggestions.push('Use at least 12 characters');
    if (!/[A-Z]/.test(password)) suggestions.push('Add uppercase letters');
    if (!/[0-9]/.test(password)) suggestions.push('Add numbers');
    if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push('Add special characters');
    if (weaknesses.length === 0 && password.length >= 16) suggestions.push('Excellent entropy!');
    return suggestions;
  }

  private calculateScore(password: string, entropy: number, weaknesses: string[]): number {
    let score = Math.min(100, (entropy / 128) * 100);
    score -= weaknesses.length * 12;
    if (password.length >= 16) score += 10;
    if (password.length >= 24) score += 10;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private estimateCrackTimes(entropy: number, password: string): CrackTimes {
    const combinations = Math.pow(2, entropy);
    const dictionarySpeed = 1e6;
    const bruteForceSpeed = 1e9;
    const gpuClusterSpeed = 1e12;
    const aiSpeed = 1e13;

    let dictSeconds = combinations / dictionarySpeed / 2;
    if (this.commonPasswords.has(password.toLowerCase())) dictSeconds = 0.001;

    const bfSeconds = combinations / bruteForceSpeed / 2;
    const gpuSeconds = combinations / gpuClusterSpeed / 2;
    const aiSeconds = combinations / aiSpeed / 2;

    return {
      dictionary: this.formatTime(dictSeconds),
      bruteForce: this.formatTime(bfSeconds),
      gpuCluster: this.formatTime(gpuSeconds),
      aiAssisted: this.formatTime(aiSeconds),
      dictionarySeconds: dictSeconds,
      bruteForceSeconds: bfSeconds,
      gpuClusterSeconds: gpuSeconds,
      aiAssistedSeconds: aiSeconds
    };
  }

  private formatTime(seconds: number): string {
    if (seconds < 0.001) return 'Instant';
    if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 31536000 * 1e6) return `${Math.round(seconds / 31536000 / 1000)}K years`;
    if (seconds < 31536000 * 1e9) return `${Math.round(seconds / 31536000 / 1e6)}M years`;
    return `${Math.round(seconds / 31536000 / 1e9)}B+ years`;
  }

  private getLevel(score: number): { level: StrengthResult['level']; label: string } {
    if (score < 20) return { level: 'very-weak', label: 'Very Weak' };
    if (score < 40) return { level: 'weak', label: 'Weak' };
    if (score < 60) return { level: 'fair', label: 'Fair' };
    if (score < 80) return { level: 'strong', label: 'Strong' };
    return { level: 'very-strong', label: 'Very Strong' };
  }

  private getEmptyCrackTimes(): CrackTimes {
    return { dictionary: '-', bruteForce: '-', gpuCluster: '-', aiAssisted: '-', dictionarySeconds: 0, bruteForceSeconds: 0, gpuClusterSeconds: 0, aiAssistedSeconds: 0 };
  }
}
