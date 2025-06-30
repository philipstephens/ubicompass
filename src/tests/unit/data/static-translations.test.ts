/**
 * Unit tests for static translations data
 * Tests pre-translated text for English, French, and Spanish
 */

import { describe, it, expect } from 'vitest';
import {
  staticTranslations,
  getStaticTranslation,
  getSupportedStaticLanguages,
  type StaticTranslations
} from '../../../data/static-translations';

describe('Static Translations', () => {
  describe('staticTranslations data structure', () => {
    it('should have all required languages', () => {
      expect(staticTranslations.en).toBeDefined();
      expect(staticTranslations.fr).toBeDefined();
      expect(staticTranslations.es).toBeDefined();
    });

    it('should have consistent keys across all languages', () => {
      const englishKeys = Object.keys(staticTranslations.en);
      const frenchKeys = Object.keys(staticTranslations.fr);
      const spanishKeys = Object.keys(staticTranslations.es);

      expect(frenchKeys).toEqual(englishKeys);
      expect(spanishKeys).toEqual(englishKeys);
    });

    it('should have non-empty translations for all keys', () => {
      Object.entries(staticTranslations).forEach(([language, translations]) => {
        Object.entries(translations).forEach(([key, value]) => {
          expect(value).toBeTruthy();
          expect(typeof value).toBe('string');
          expect(value.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should have meaningful translation differences', () => {
      const englishKeys = Object.keys(staticTranslations.en);
      
      englishKeys.forEach(key => {
        const english = staticTranslations.en[key];
        const french = staticTranslations.fr[key];
        const spanish = staticTranslations.es[key];

        // Translations should be different from English (except for some technical terms)
        if (!['UBI', 'GDP', 'COVID', 'Y2K'].some(term => english.includes(term))) {
          expect(french).not.toBe(english);
          expect(spanish).not.toBe(english);
        }
      });
    });
  });

  describe('getStaticTranslation', () => {
    it('should return correct translation for valid key and language', () => {
      expect(getStaticTranslation('title', 'en')).toBe('UBI Compass');
      expect(getStaticTranslation('title', 'fr')).toBe('Boussole RUB');
      expect(getStaticTranslation('title', 'es')).toBe('Brújula RBU');
    });

    it('should fallback to English for unsupported language', () => {
      const englishTitle = getStaticTranslation('title', 'en');
      expect(getStaticTranslation('title', 'de')).toBe(englishTitle);
      expect(getStaticTranslation('title', 'zh')).toBe(englishTitle);
      expect(getStaticTranslation('title', 'invalid')).toBe(englishTitle);
    });

    it('should fallback to key for missing translation', () => {
      expect(getStaticTranslation('nonexistentKey', 'en')).toBe('nonexistentKey');
      expect(getStaticTranslation('nonexistentKey', 'fr')).toBe('nonexistentKey');
    });

    it('should handle empty or null inputs gracefully', () => {
      expect(getStaticTranslation('', 'en')).toBe('');
      expect(getStaticTranslation('title', '')).toBe('UBI Compass');
    });
  });

  describe('getSupportedStaticLanguages', () => {
    it('should return correct language list', () => {
      const languages = getSupportedStaticLanguages();
      
      expect(languages.en).toBe('🇺🇸 English');
      expect(languages.fr).toBe('🇫🇷 Français');
      expect(languages.es).toBe('🇪🇸 Español');
    });

    it('should have exactly 3 supported languages', () => {
      const languages = getSupportedStaticLanguages();
      expect(Object.keys(languages)).toHaveLength(3);
    });

    it('should include flag emojis', () => {
      const languages = getSupportedStaticLanguages();
      
      Object.values(languages).forEach(languageName => {
        expect(languageName).toMatch(/^🇺🇸|🇫🇷|🇪🇸/);
      });
    });
  });

  describe('Translation quality', () => {
    describe('French translations', () => {
      it('should use proper French terminology for UBI', () => {
        expect(getStaticTranslation('title', 'fr')).toContain('RUB'); // Revenu Universel de Base
        expect(getStaticTranslation('adultUbi', 'fr')).toContain('RUB');
      });

      it('should use proper French currency formatting', () => {
        const monthlyText = getStaticTranslation('month', 'fr');
        expect(monthlyText).toBe('mois');
      });

      it('should use proper French grammar', () => {
        // Check for proper articles and gender agreement
        expect(getStaticTranslation('analysisParameters', 'fr')).toBe('Paramètres d\'analyse');
        expect(getStaticTranslation('economicContextTitle', 'fr')).toBe('Contexte économique');
      });
    });

    describe('Spanish translations', () => {
      it('should use proper Spanish terminology for UBI', () => {
        expect(getStaticTranslation('title', 'es')).toContain('RBU'); // Renta Básica Universal
        expect(getStaticTranslation('adultUbi', 'es')).toContain('RBU');
      });

      it('should use proper Spanish currency formatting', () => {
        const monthlyText = getStaticTranslation('month', 'es');
        expect(monthlyText).toBe('mes');
      });

      it('should use proper Spanish grammar', () => {
        // Check for proper articles and gender agreement
        expect(getStaticTranslation('analysisParameters', 'es')).toBe('Parámetros de análisis');
        expect(getStaticTranslation('economicContextTitle', 'es')).toBe('Contexto económico');
      });
    });

    describe('English translations', () => {
      it('should use proper English terminology', () => {
        expect(getStaticTranslation('title', 'en')).toBe('UBI Compass');
        expect(getStaticTranslation('subtitle', 'en')).toContain('Universal Basic Income');
      });

      it('should use clear, professional language', () => {
        const subtitle = getStaticTranslation('subtitle', 'en');
        expect(subtitle).toContain('Feasibility Calculator');
        expect(subtitle).toContain('Canada');
      });
    });
  });

  describe('Key coverage', () => {
    const requiredKeys = [
      'title',
      'subtitle',
      'poweredBy',
      'analysisParameters',
      'analysisYear',
      'adultUbi',
      'childUbi',
      'youthUbi',
      'seniorBonus',
      'taxParameters',
      'flatTaxPercentage',
      'taxExemptionAmount',
      'ubiProgramFeasibility',
      'grossProgramCost',
      'taxRevenue',
      'netProgramCost',
      'feasible',
      'challenging',
      'difficult',
      'economicContextTitle',
      'canadianGdp',
      'totalGovSpending',
      'inflationRate'
    ];

    it('should have all required translation keys', () => {
      requiredKeys.forEach(key => {
        expect(staticTranslations.en[key]).toBeDefined();
        expect(staticTranslations.fr[key]).toBeDefined();
        expect(staticTranslations.es[key]).toBeDefined();
      });
    });

    it('should have age-related translations', () => {
      const ageKeys = ['childAgeCutoff', 'adultAgeCutoff', 'seniorAgeCutoff', 'years'];
      
      ageKeys.forEach(key => {
        expect(staticTranslations.en[key]).toBeDefined();
        expect(staticTranslations.fr[key]).toBeDefined();
        expect(staticTranslations.es[key]).toBeDefined();
      });
    });

    it('should have population-related translations', () => {
      const populationKeys = [
        'adultPopulation',
        'childPopulation', 
        'youthPopulation',
        'seniorPopulation'
      ];
      
      populationKeys.forEach(key => {
        expect(staticTranslations.en[key]).toBeDefined();
        expect(staticTranslations.fr[key]).toBeDefined();
        expect(staticTranslations.es[key]).toBeDefined();
      });
    });

    it('should have time unit translations', () => {
      const timeKeys = ['month', 'year', 'years'];
      
      timeKeys.forEach(key => {
        expect(staticTranslations.en[key]).toBeDefined();
        expect(staticTranslations.fr[key]).toBeDefined();
        expect(staticTranslations.es[key]).toBeDefined();
      });
    });
  });

  describe('Consistency checks', () => {
    it('should use consistent terminology across related keys', () => {
      // UBI terminology should be consistent
      const ubiKeys = ['adultUbi', 'childUbi', 'youthUbi'];
      
      ubiKeys.forEach(key => {
        expect(getStaticTranslation(key, 'fr')).toContain('RUB');
        expect(getStaticTranslation(key, 'es')).toContain('RBU');
      });
    });

    it('should use consistent currency references', () => {
      // All languages should handle currency consistently
      const currencyKeys = ['grossProgramCost', 'taxRevenue', 'netProgramCost'];
      
      currencyKeys.forEach(key => {
        const english = getStaticTranslation(key, 'en');
        const french = getStaticTranslation(key, 'fr');
        const spanish = getStaticTranslation(key, 'es');
        
        // Should not contain currency symbols (handled by formatting functions)
        expect(english).not.toMatch(/\$|€|£/);
        expect(french).not.toMatch(/\$|€|£/);
        expect(spanish).not.toMatch(/\$|€|£/);
      });
    });

    it('should use consistent percentage references', () => {
      const percentageKeys = ['ofGdp', 'ofGovBudget', 'flatTaxPercentage'];
      
      percentageKeys.forEach(key => {
        const english = getStaticTranslation(key, 'en');
        const french = getStaticTranslation(key, 'fr');
        const spanish = getStaticTranslation(key, 'es');
        
        // Should not contain percentage symbols (handled by formatting functions)
        expect(english).not.toMatch(/%/);
        expect(french).not.toMatch(/%/);
        expect(spanish).not.toMatch(/%/);
      });
    });
  });
});
