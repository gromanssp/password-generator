import { Injectable } from '@angular/core';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const KEY_STORAGE = 'securegen-crypt-key';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private keyPromise: Promise<CryptoKey> | null = null;

  private async getKey(): Promise<CryptoKey> {
    if (this.keyPromise) return this.keyPromise;

    this.keyPromise = (async () => {
      const stored = sessionStorage.getItem(KEY_STORAGE);
      if (stored) {
        const raw = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
        return await crypto.subtle.importKey('raw', raw, ALGORITHM, false, ['encrypt', 'decrypt']);
      }
      const key = await crypto.subtle.generateKey({ name: ALGORITHM, length: KEY_LENGTH }, true, ['encrypt', 'decrypt']);
      const exported = await crypto.subtle.exportKey('raw', key);
      sessionStorage.setItem(KEY_STORAGE, btoa(String.fromCharCode(...new Uint8Array(exported))));
      return key;
    })();

    return this.keyPromise;
  }

  async encrypt(plaintext: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(ciphertext: string): Promise<string> {
    try {
      const key = await this.getKey();
      const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, data);
      return new TextDecoder().decode(decrypted);
    } catch {
      return '';
    }
  }

  isKeyAvailable(): boolean {
    return !!sessionStorage.getItem(KEY_STORAGE);
  }
}
