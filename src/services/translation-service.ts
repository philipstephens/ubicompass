/**
 * Translation service that handles both static and dynamic translations
 * Static mode: Uses pre-translated text for English, French, Spanish
 * Dynamic mode: Uses Google Translate API for any language
 */

import { getStaticTranslation, getSupportedStaticLanguages } from '../data/static-translations';

export interface TranslationCache {
  [key: string]: string;
}

export interface TranslationProgress {
  current: number;
  total: number;
}

export class TranslationService {
  private cache: TranslationCache = {};
  private isStaticMode: boolean;
  private currentLanguage: string = 'en';
  private progressCallback?: (progress: TranslationProgress) => void;

  constructor(isStaticMode: boolean = false) {
    this.isStaticMode = isStaticMode;
    this.loadCacheFromStorage();
  }

  /**
   * Set translation mode (static vs dynamic)
   */
  setStaticMode(isStatic: boolean): void {
    this.isStaticMode = isStatic;
  }

  /**
   * Set progress callback for dynamic translations
   */
  setProgressCallback(callback: (progress: TranslationProgress) => void): void {
    this.progressCallback = callback;
  }

  /**
   * Get supported languages based on mode
   */
  getSupportedLanguages(): { [code: string]: string } {
    if (this.isStaticMode) {
      return getSupportedStaticLanguages();
    }
    
    // Dynamic mode supports many more languages
    return {
      en: "🇺🇸 English",
      fr: "🇫🇷 Français",
      es: "🇪🇸 Español",
      de: "🇩🇪 Deutsch",
      it: "🇮🇹 Italiano",
      pt: "🇵🇹 Português",
      ru: "🇷🇺 Русский",
      ja: "🇯🇵 日本語",
      ko: "🇰🇷 한국어",
      zh: "🇨🇳 中文",
      ar: "🇸🇦 العربية",
      hi: "🇮🇳 हिन्दी",
      nl: "🇳🇱 Nederlands",
      sv: "🇸🇪 Svenska",
      no: "🇳🇴 Norsk",
      da: "🇩🇰 Dansk",
      fi: "🇫🇮 Suomi",
      pl: "🇵🇱 Polski",
      tr: "🇹🇷 Türkçe",
      el: "🇬🇷 Ελληνικά"
    };
  }

  /**
   * Set current language
   */
  setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Translate a single text key
   */
  async translate(key: string): Promise<string> {
    // Always return English for English language
    if (this.currentLanguage === 'en') {
      return getStaticTranslation(key, 'en');
    }

    // Static mode: use pre-translated text
    if (this.isStaticMode) {
      return getStaticTranslation(key, this.currentLanguage);
    }

    // Dynamic mode: check cache first
    const cacheKey = `${key}_${this.currentLanguage}`;
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    // Get English text to translate
    const englishText = getStaticTranslation(key, 'en');
    
    try {
      const translatedText = await this.translateWithAPI(englishText, this.currentLanguage);
      this.cache[cacheKey] = translatedText;
      this.saveCacheToStorage();
      return translatedText;
    } catch (error) {
      console.warn(`Translation failed for "${key}":`, error);
      return englishText; // Fallback to English
    }
  }

  /**
   * Translate multiple keys at once
   */
  async translateBatch(keys: string[]): Promise<{ [key: string]: string }> {
    const results: { [key: string]: string } = {};
    
    if (this.currentLanguage === 'en' || this.isStaticMode) {
      // Fast path for English or static mode
      for (const key of keys) {
        results[key] = await this.translate(key);
      }
      return results;
    }

    // Dynamic mode: translate with progress tracking
    let completed = 0;
    const total = keys.length;

    for (const key of keys) {
      results[key] = await this.translate(key);
      completed++;
      
      if (this.progressCallback) {
        this.progressCallback({ current: completed, total });
      }
    }

    return results;
  }

  /**
   * Call Google Translate API
   */
  private async translateWithAPI(text: string, targetLanguage: string): Promise<string> {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage: 'en',
      }),
    });

    const result = await response.json();

    if (result.success) {
      return result.translatedText;
    } else {
      throw new Error(result.error || 'Translation failed');
    }
  }

  /**
   * Load translation cache from localStorage
   */
  private loadCacheFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('ubi-compass-translations');
        if (cached) {
          this.cache = JSON.parse(cached);
        }
      } catch (error) {
        console.warn('Failed to load translation cache:', error);
      }
    }
  }

  /**
   * Save translation cache to localStorage
   */
  private saveCacheToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ubi-compass-translations', JSON.stringify(this.cache));
      } catch (error) {
        console.warn('Failed to save translation cache:', error);
      }
    }
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache = {};
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ubi-compass-translations');
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; languages: string[] } {
    const languages = new Set<string>();
    Object.keys(this.cache).forEach(key => {
      const parts = key.split('_');
      if (parts.length > 1) {
        languages.add(parts[parts.length - 1]);
      }
    });

    return {
      size: Object.keys(this.cache).length,
      languages: Array.from(languages)
    };
  }

  /**
   * Check if translation is available in cache
   */
  isTranslationCached(key: string, language: string): boolean {
    const cacheKey = `${key}_${language}`;
    return !!this.cache[cacheKey];
  }

  /**
   * Preload translations for a language
   */
  async preloadLanguage(language: string, keys: string[]): Promise<void> {
    if (language === 'en' || this.isStaticMode) {
      return; // No need to preload
    }

    const uncachedKeys = keys.filter(key => !this.isTranslationCached(key, language));
    
    if (uncachedKeys.length === 0) {
      return; // All translations already cached
    }

    const previousLanguage = this.currentLanguage;
    this.setLanguage(language);
    
    try {
      await this.translateBatch(uncachedKeys);
    } finally {
      this.setLanguage(previousLanguage);
    }
  }
}

// Legacy functions for backward compatibility
export async function translateText(text: string, language: string): Promise<string> {
  const service = new TranslationService(false);
  service.setLanguage(language);
  return await service.translate(text);
}
