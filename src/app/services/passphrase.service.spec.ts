import { TestBed } from '@angular/core/testing';
import { PassphraseService, PassphraseConfig } from './passphrase.service';

describe('PassphraseService', () => {
  let service: PassphraseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassphraseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a passphrase with configurable word count', () => {
    const config: PassphraseConfig = {
      wordCount: 5, separator: '-', capitalize: false, includeNumber: false,
    };
    const passphrase = service.generate(config);
    expect(passphrase.split('-').length).toBe(5);
  });

  it('should use hyphen separator by default', () => {
    const config: PassphraseConfig = {
      wordCount: 4, separator: '-', capitalize: false, includeNumber: false,
    };
    const passphrase = service.generate(config);
    expect(passphrase).toMatch(/^[a-z]+-[a-z]+-[a-z]+-[a-z]+$/);
  });

  it('should support dot separator', () => {
    const config: PassphraseConfig = {
      wordCount: 3, separator: '.', capitalize: false, includeNumber: false,
    };
    const passphrase = service.generate(config);
    expect(passphrase).toMatch(/^[a-z]+\.[a-z]+\.[a-z]+$/);
  });

  it('should support underscore separator', () => {
    const config: PassphraseConfig = {
      wordCount: 3, separator: '_', capitalize: false, includeNumber: false,
    };
    const passphrase = service.generate(config);
    expect(passphrase).toMatch(/^[a-z]+_[a-z]+_[a-z]+$/);
  });

  it('should capitalize words when enabled', () => {
    const config: PassphraseConfig = {
      wordCount: 3, separator: '-', capitalize: true, includeNumber: false,
    };
    const passphrase = service.generate(config);
    const words = passphrase.split('-');
    for (const word of words) {
      expect(word[0]).toMatch(/[A-Z]/);
    }
  });

  it('should include number when enabled', () => {
    const config: PassphraseConfig = {
      wordCount: 3, separator: '-', capitalize: false, includeNumber: true,
    };
    const passphrase = service.generate(config);
    const parts = passphrase.split('-');
    expect(parts.length).toBe(4);
    expect(parts[3]).toMatch(/^\d{1,2}$/);
  });

  it('should use crypto.getRandomValues', () => {
    const cryptoSpy = vi.spyOn(crypto, 'getRandomValues');
    const config: PassphraseConfig = {
      wordCount: 4, separator: '-', capitalize: false, includeNumber: false,
    };
    service.generate(config);
    expect(cryptoSpy).toHaveBeenCalled();
    cryptoSpy.mockRestore();
  });

  it('should generate unique passphrases', () => {
    const config: PassphraseConfig = {
      wordCount: 4, separator: '-', capitalize: false, includeNumber: false,
    };
    const p1 = service.generate(config);
    const p2 = service.generate(config);
    expect(p1).not.toBe(p2);
  });

  it('should only contain words from the wordlist', () => {
    const config: PassphraseConfig = {
      wordCount: 3, separator: '-', capitalize: false, includeNumber: false,
    };
    const passphrase = service.generate(config);
    const words = passphrase.split('-');
    const wordlist = [
      'river', 'coffee', 'tiger', 'mountain', 'moon', 'forest', 'rocket', 'cloud',
      'ocean', 'dragon', 'crystal', 'shadow', 'phoenix', 'thunder', 'silver', 'copper',
      'garden', 'castle', 'bridge', 'falcon', 'lantern', 'marble', 'velvet', 'prism',
      'coral', 'ember', 'frost', 'galaxy', 'harbor', 'ivory', 'jasper', 'kindle',
      'lotus', 'meadow', 'nectar', 'orbit', 'puzzle', 'quartz', 'ripple', 'summit',
      'tundra', 'umbra', 'vortex', 'whisper', 'zenith', 'aurora', 'blaze', 'cipher',
      'delta', 'eclipse', 'flare', 'glacier', 'horizon', 'inferno', 'jungle', 'karma',
      'lava', 'mirage', 'nebula', 'oasis', 'polar', 'quantum', 'raven', 'stellar',
      'tempest', 'ultra', 'vapor', 'wildfire', 'xenon', 'yield', 'zephyr', 'apex',
      'bolt', 'comet', 'dusk', 'echo', 'flame', 'glyph', 'helix', 'iron',
      'jade', 'krypton', 'lynx', 'magnet', 'nova', 'onyx', 'pixel', 'quest',
    ];
    for (const word of words) {
      expect(wordlist).toContain(word);
    }
  });

  it('should estimate entropy correctly', () => {
    const config: PassphraseConfig = {
      wordCount: 4, separator: '-', capitalize: false, includeNumber: false,
    };
    const entropy = service.estimateEntropy(config);
    expect(entropy).toBeTypeOf('number');
    expect(entropy).toBeGreaterThan(0);
  });

  it('should include capitalization in entropy estimate', () => {
    const withoutCap: PassphraseConfig = {
      wordCount: 4, separator: '-', capitalize: false, includeNumber: false,
    };
    const withCap: PassphraseConfig = {
      wordCount: 4, separator: '-', capitalize: true, includeNumber: false,
    };
    const entropyWithout = service.estimateEntropy(withoutCap);
    const entropyWith = service.estimateEntropy(withCap);
    expect(entropyWith).toBeGreaterThan(entropyWithout);
  });

  it('should include number in entropy estimate', () => {
    const config: PassphraseConfig = {
      wordCount: 4, separator: '-', capitalize: false, includeNumber: true,
    };
    const entropy = service.estimateEntropy(config);
    const expected = 4 * Math.log2(80) + Math.log2(100);
    expect(entropy).toBeCloseTo(expected, 0);
  });
});
