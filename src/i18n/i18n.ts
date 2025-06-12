/**
 * Simple translation function for the UBI Calculator
 * This is a wrapper around the translation service
 */

import { translateText } from '../services/translation-service';

/**
 * Translate text to the specified language
 * @param text The text to translate
 * @param language The target language code (e.g., 'es', 'fr', 'de')
 * @returns The translated text
 */
export function t(text: string, language: string): string {
  // If the language is English or not specified, return the original text
  if (language === 'en' || !language) return text;

  // For now, we'll use a simple mock implementation
  // In a real app, you would use a more sophisticated translation system
  const translations: Record<string, Record<string, string>> = {
    // Decile Calculator with SVG Charts
    'Decile Calculator with SVG Charts': {
      'es': 'Calculadora de Deciles con Gráficos SVG',
      'fr': 'Calculateur de Déciles avec Graphiques SVG',
      'de': 'Dezil-Rechner mit SVG-Diagrammen',
    },
    'This calculator allows you to explore the impact of Universal Basic Income (UBI) across different income deciles using interactive SVG charts.': {
      'es': 'Esta calculadora le permite explorar el impacto de la Renta Básica Universal (RBU) en diferentes deciles de ingresos utilizando gráficos SVG interactivos.',
      'fr': 'Ce calculateur vous permet d\'explorer l\'impact du Revenu de Base Universel (RBU) sur différents déciles de revenus à l\'aide de graphiques SVG interactifs.',
      'de': 'Mit diesem Rechner können Sie die Auswirkungen des Universellen Grundeinkommens (UBI) auf verschiedene Einkommensdezile mithilfe interaktiver SVG-Diagramme untersuchen.',
    },
    'Interactive SVG charts showing the impact of Universal Basic Income across income deciles': {
      'es': 'Gráficos SVG interactivos que muestran el impacto de la Renta Básica Universal en los deciles de ingresos',
      'fr': 'Graphiques SVG interactifs montrant l\'impact du Revenu de Base Universel sur les déciles de revenus',
      'de': 'Interaktive SVG-Diagramme, die die Auswirkungen des Universellen Grundeinkommens auf Einkommensdezile zeigen',
    },
    'Decile Calculator': {
      'es': 'Calculadora de Deciles',
      'fr': 'Calculateur de Déciles',
      'de': 'Dezil-Rechner',
    },
    'Home': {
      'es': 'Inicio',
      'fr': 'Accueil',
      'de': 'Startseite',
    },
    'Simple Version': {
      'es': 'Versión Simple',
      'fr': 'Version Simple',
      'de': 'Einfache Version',
    },
    'Standalone App': {
      'es': 'Aplicación Independiente',
      'fr': 'Application Autonome',
      'de': 'Eigenständige App',
    },
  };

  // Return the translation if it exists, otherwise return the original text
  return translations[text]?.[language] || text;
}
