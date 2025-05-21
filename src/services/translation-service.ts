/**
 * Translation service for the UBI Calculator application
 * This service provides functions to translate text into different languages
 */

// Cache for storing translations to avoid redundant API calls
interface TranslationCache {
  [key: string]: {
    [language: string]: string;
  };
}

// In-memory cache for translations
const translationCache: TranslationCache = {};

/**
 * Translates text to the specified language
 * @param text The text to translate
 * @param language The target language code (e.g., 'es', 'fr', 'de')
 * @returns Promise with the translated text
 */
export async function translateText(text: string, language: string): Promise<string> {
  // If the text is empty, return it as is
  if (!text) return text;

  // If the target language is English or not specified, return the original text
  if (language === 'en' || !language) return text;

  // Check if we have this translation in cache
  if (translationCache[text]?.[language]) {
    return translationCache[text][language];
  }

  try {
    // In a real implementation, you would call a translation API here
    // For example, using Google Translate API or another service

    // For now, we'll use a mock implementation that adds language markers
    // This should be replaced with actual API calls in production
    const translatedText = await mockTranslate(text, language);

    // Cache the result
    if (!translationCache[text]) {
      translationCache[text] = {};
    }
    translationCache[text][language] = translatedText;

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Mock translation function for development
 * In production, this would be replaced with calls to a real translation API
 */
async function mockTranslate(text: string, language: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Comprehensive mock translations for demonstration
  const mockTranslations: { [key: string]: { [key: string]: string } } = {
    // Header and navigation
    'Help Us End Poverty Forever!!': {
      'es': '¡Ayúdanos a Acabar con la Pobreza para Siempre!',
      'fr': 'Aidez-Nous à Éliminer la Pauvreté pour Toujours !',
      'de': 'Helfen Sie Uns, die Armut für Immer zu Beenden!',
    },
    'with a Universal Basic Income': {
      'es': 'con una Renta Básica Universal',
      'fr': 'avec un Revenu de Base Universel',
      'de': 'mit einem Universellen Grundeinkommen',
    },
    'Home': {
      'es': 'Inicio',
      'fr': 'Accueil',
      'de': 'Startseite',
    },
    'About': {
      'es': 'Acerca de',
      'fr': 'À Propos',
      'de': 'Über Uns',
    },
    'Services': {
      'es': 'Servicios',
      'fr': 'Services',
      'de': 'Dienstleistungen',
    },
    'Contact': {
      'es': 'Contacto',
      'fr': 'Contact',
      'de': 'Kontakt',
    },

    // Calculator components
    'Canadian Universal Basic Income Calculator': {
      'es': 'Calculadora Canadiense de Renta Básica Universal',
      'fr': 'Calculateur Canadien de Revenu de Base Universel',
      'de': 'Kanadischer Rechner für Universelles Grundeinkommen',
    },
    'Explore the impact of Universal Basic Income on different income quintiles': {
      'es': 'Explore el impacto de la Renta Básica Universal en diferentes quintiles de ingresos',
      'fr': 'Explorez l\'impact du Revenu de Base Universel sur différents quintiles de revenus',
      'de': 'Erkunden Sie die Auswirkungen des Universellen Grundeinkommens auf verschiedene Einkommensquintile',
    },
    'Adjust the parameters below to see how different UBI configurations affect income distribution across Canada.': {
      'es': 'Ajuste los parámetros a continuación para ver cómo diferentes configuraciones de RBU afectan la distribución de ingresos en Canadá.',
      'fr': 'Ajustez les paramètres ci-dessous pour voir comment différentes configurations de RBU affectent la répartition des revenus au Canada.',
      'de': 'Passen Sie die Parameter unten an, um zu sehen, wie sich verschiedene UBI-Konfigurationen auf die Einkommensverteilung in Kanada auswirken.',
    },
    'Selected Year:': {
      'es': 'Año Seleccionado:',
      'fr': 'Année Sélectionnée:',
      'de': 'Ausgewähltes Jahr:',
    },
    'UBI Amount': {
      'es': 'Cantidad de RBU',
      'fr': 'Montant du RBU',
      'de': 'UBI-Betrag',
    },
    'per month': {
      'es': 'por mes',
      'fr': 'par mois',
      'de': 'pro Monat',
    },
    'per year': {
      'es': 'por año',
      'fr': 'par an',
      'de': 'pro Jahr',
    },
    'Flat Tax': {
      'es': 'Impuesto Fijo',
      'fr': 'Impôt Forfaitaire',
      'de': 'Pauschalsteuer',
    },
    'Tax Model': {
      'es': 'Modelo de Impuesto',
      'fr': 'Modèle Fiscal',
      'de': 'Steuermodell',
    },
    'Simple flat tax rate applied to all income above exemption': {
      'es': 'Tasa de impuesto plana simple aplicada a todos los ingresos por encima de la exención',
      'fr': 'Taux d\'imposition forfaitaire simple appliqué à tous les revenus supérieurs à l\'exonération',
      'de': 'Einfacher Pauschalsatz für alle Einkommen über dem Freibetrag',
    },
    'Flat Tax Percentage': {
      'es': 'Porcentaje de Impuesto Fijo',
      'fr': 'Pourcentage d\'Impôt Forfaitaire',
      'de': 'Pauschaler Steuersatz',
    },
    'UBI Impact by Income Quintile': {
      'es': 'Impacto de RBU por Quintil de Ingresos',
      'fr': 'Impact du RBU par Quintile de Revenu',
      'de': 'UBI-Auswirkungen nach Einkommensquintil',
    },
    'UBI Impact by Income Decile': {
      'es': 'Impacto de RBU por Decil de Ingresos',
      'fr': 'Impact du RBU par Décile de Revenu',
      'de': 'UBI-Auswirkungen nach Einkommensdezil',
    },
    'Show Table': {
      'es': 'Mostrar Tabla',
      'fr': 'Afficher le Tableau',
      'de': 'Tabelle Anzeigen',
    },
    'Show Chart': {
      'es': 'Mostrar Gráfico',
      'fr': 'Afficher le Graphique',
      'de': 'Diagramm Anzeigen',
    },
    'Quintile': {
      'es': 'Quintil',
      'fr': 'Quintile',
      'de': 'Quintil',
    },
    'Decile': {
      'es': 'Decil',
      'fr': 'Décile',
      'de': 'Dezil',
    },
    'Description': {
      'es': 'Descripción',
      'fr': 'Description',
      'de': 'Beschreibung',
    },
    'No data available to display': {
      'es': 'No hay datos disponibles para mostrar',
      'fr': 'Aucune donnée disponible à afficher',
      'de': 'Keine Daten zum Anzeigen verfügbar',
    },
    'Lowest 20%': {
      'es': 'El 20% más bajo',
      'fr': '20% les plus bas',
      'de': 'Niedrigste 20%',
    },
    'Lower-middle 20%': {
      'es': '20% medio-bajo',
      'fr': '20% moyen-bas',
      'de': 'Untere-Mitte 20%',
    },
    'Middle 20%': {
      'es': '20% medio',
      'fr': '20% moyen',
      'de': 'Mittlere 20%',
    },
    'Upper-middle 20%': {
      'es': '20% medio-alto',
      'fr': '20% moyen-haut',
      'de': 'Obere-Mitte 20%',
    },
    'Highest 20%': {
      'es': '20% más alto',
      'fr': '20% les plus hauts',
      'de': 'Höchste 20%',
    },
    'Each quintile represents exactly 20% of the taxpayer population. Quintiles divide the population into five equal groups based on income level, from lowest (Q1) to highest (Q5).': {
      'es': 'Cada quintil representa exactamente el 20% de la población contribuyente. Los quintiles dividen la población en cinco grupos iguales según el nivel de ingresos, desde el más bajo (Q1) hasta el más alto (Q5).',
      'fr': 'Chaque quintile représente exactement 20% de la population des contribuables. Les quintiles divisent la population en cinq groupes égaux selon le niveau de revenu, du plus bas (Q1) au plus élevé (Q5).',
      'de': 'Jedes Quintil repräsentiert genau 20% der Steuerzahlerpopulation. Quintile teilen die Bevölkerung in fünf gleiche Gruppen basierend auf dem Einkommensniveau, vom niedrigsten (Q1) bis zum höchsten (Q5).',
    },
    'Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10).': {
      'es': 'Cada decil representa exactamente el 10% de la población contribuyente. Los deciles dividen a la población en diez grupos iguales según el nivel de ingresos, desde el más bajo (D1) hasta el más alto (D10).',
      'fr': 'Chaque décile représente exactement 10% de la population des contribuables. Les déciles divisent la population en dix groupes égaux selon le niveau de revenu, du plus bas (D1) au plus haut (D10).',
      'de': 'Jedes Dezil repräsentiert genau 10% der Steuerzahlerpopulation. Dezile teilen die Bevölkerung in zehn gleiche Gruppen basierend auf dem Einkommensniveau, vom niedrigsten (D1) bis zum höchsten (D10).',
    },
    'Income Comparison by Quintile': {
      'es': 'Comparación de Ingresos por Quintil',
      'fr': 'Comparaison des Revenus par Quintile',
      'de': 'Einkommensvergleich nach Quintil',
    },
    'Income Comparison by Decile': {
      'es': 'Comparación de Ingresos por Decil',
      'fr': 'Comparaison des Revenus par Décile',
      'de': 'Einkommensvergleich nach Dezil',
    },
    'Flat Tax Model': {
      'es': 'Modelo de Impuesto Fijo',
      'fr': 'Modèle d\'Impôt Forfaitaire',
      'de': 'Pauschalsteuermodell',
    },
    'Total Income:': {
      'es': 'Ingreso Total:',
      'fr': 'Revenu Total:',
      'de': 'Gesamteinkommen:',
    },
    'Exemption:': {
      'es': 'Exención:',
      'fr': 'Exonération:',
      'de': 'Freibetrag:',
    },
    'Taxable Income:': {
      'es': 'Ingreso Imponible:',
      'fr': 'Revenu Imposable:',
      'de': 'Steuerpflichtiges Einkommen:',
    },
    'Tax:': {
      'es': 'Impuesto:',
      'fr': 'Impôt:',
      'de': 'Steuer:',
    },
    'Income with UBI': {
      'es': 'Ingreso con RBU',
      'fr': 'Revenu avec RBU',
      'de': 'Einkommen mit UBI',
    },
    '$12k / year ($1k / month)': {
      'es': '$12k / año ($1k / mes)',
      'fr': '$12k / an ($1k / mois)',
      'de': '$12k / Jahr ($1k / Monat)',
    },
    '$18k / year ($1.5k / month)': {
      'es': '$18k / año ($1.5k / mes)',
      'fr': '$18k / an ($1.5k / mois)',
      'de': '$18k / Jahr ($1.5k / Monat)',
    },
    '$24k / year ($2k / month)': {
      'es': '$24k / año ($2k / mes)',
      'fr': '$24k / an ($2k / mois)',
      'de': '$24k / Jahr ($2k / Monat)',
    },
    '$30k / year ($2.5k / month)': {
      'es': '$30k / año ($2.5k / mes)',
      'fr': '$30k / an ($2.5k / mois)',
      'de': '$30k / Jahr ($2.5k / Monat)',
    },
    '$36k / year ($3k / month)': {
      'es': '$36k / año ($3k / mes)',
      'fr': '$36k / an ($3k / mois)',
      'de': '$36k / Jahr ($3k / Monat)',
    },
    'No tax brackets available': {
      'es': 'No hay tramos impositivos disponibles',
      'fr': 'Aucune tranche d\'imposition disponible',
      'de': 'Keine Steuerklassen verfügbar',
    },
    'Flat tax rate applied to all income': {
      'es': 'Tasa de impuesto fija aplicada a todos los ingresos',
      'fr': 'Taux d\'imposition forfaitaire appliqué à tous les revenus',
      'de': 'Pauschaler Steuersatz auf alle Einkommen angewendet',
    },
    'Income Range': {
      'es': 'Rango de Ingresos',
      'fr': 'Plage de Revenus',
      'de': 'Einkommensbereich',
    },
    'Income Decile': {
      'es': 'Decil de Ingresos',
      'fr': 'Décile de Revenu',
      'de': 'Einkommensdezil',
    },
    'Lowest 10%': {
      'es': '10% más bajo',
      'fr': '10% les plus bas',
      'de': 'Niedrigste 10%',
    },
    '10-20%': {
      'es': '10-20%',
      'fr': '10-20%',
      'de': '10-20%',
    },
    '20-30%': {
      'es': '20-30%',
      'fr': '20-30%',
      'de': '20-30%',
    },
    '30-40%': {
      'es': '30-40%',
      'fr': '30-40%',
      'de': '30-40%',
    },
    '40-50%': {
      'es': '40-50%',
      'fr': '40-50%',
      'de': '40-50%',
    },
    '50-60%': {
      'es': '50-60%',
      'fr': '50-60%',
      'de': '50-60%',
    },
    '60-70%': {
      'es': '60-70%',
      'fr': '60-70%',
      'de': '60-70%',
    },
    '70-80%': {
      'es': '70-80%',
      'fr': '70-80%',
      'de': '70-80%',
    },
    '80-90%': {
      'es': '80-90%',
      'fr': '80-90%',
      'de': '80-90%',
    },
    'Highest 10%': {
      'es': '10% más alto',
      'fr': '10% les plus hauts',
      'de': 'Höchste 10%',
    },
    'Current Tax Model:': {
      'es': 'Modelo Fiscal Actual:',
      'fr': 'Modèle Fiscal Actuel:',
      'de': 'Aktuelles Steuermodell:',
    },
    'Tax Brackets:': {
      'es': 'Tramos Impositivos:',
      'fr': 'Tranches d\'Imposition:',
      'de': 'Steuerklassen:',
    },
    'How Taxes Are Calculated': {
      'es': 'Cómo Se Calculan los Impuestos',
      'fr': 'Comment les Impôts Sont Calculés',
      'de': 'Wie Steuern Berechnet Werden',
    },
    'UBI Impact Summary': {
      'es': 'Resumen del Impacto de la RBU',
      'fr': 'Résumé de l\'Impact du RBU',
      'de': 'Zusammenfassung der UBI-Auswirkungen',
    },
    'Total UBI Cost': {
      'es': 'Costo Total de la RBU',
      'fr': 'Coût Total du RBU',
      'de': 'Gesamtkosten des UBI',
    },
    'Annual UBI payments to all taxpayers:': {
      'es': 'Pagos anuales de RBU a todos los contribuyentes:',
      'fr': 'Paiements annuels de RBU à tous les contribuables:',
      'de': 'Jährliche UBI-Zahlungen an alle Steuerzahler:',
    },
    'Additional Tax Revenue': {
      'es': 'Ingresos Fiscales Adicionales',
      'fr': 'Recettes Fiscales Supplémentaires',
      'de': 'Zusätzliche Steuereinnahmen',
    },
    'Increased tax revenue with UBI:': {
      'es': 'Aumento de ingresos fiscales con RBU:',
      'fr': 'Augmentation des recettes fiscales avec RBU:',
      'de': 'Erhöhte Steuereinnahmen mit UBI:',
    },
    'Net Program Cost': {
      'es': 'Costo Neto del Programa',
      'fr': 'Coût Net du Programme',
      'de': 'Nettokosten des Programms',
    },
    'Total cost after additional tax revenue:': {
      'es': 'Costo total después de ingresos fiscales adicionales:',
      'fr': 'Coût total après recettes fiscales supplémentaires:',
      'de': 'Gesamtkosten nach zusätzlichen Steuereinnahmen:',
    },
    'Actions': {
      'es': 'Acciones',
      'fr': 'Actions',
      'de': 'Aktionen',
    },
    'Click the button to refresh all calculations with the current parameters.': {
      'es': 'Haga clic en el botón para actualizar todos los cálculos con los parámetros actuales.',
      'fr': 'Cliquez sur le bouton pour actualiser tous les calculs avec les paramètres actuels.',
      'de': 'Klicken Sie auf die Schaltfläche, um alle Berechnungen mit den aktuellen Parametern zu aktualisieren.',
    },
    'Last updated:': {
      'es': 'Última actualización:',
      'fr': 'Dernière mise à jour:',
      'de': 'Zuletzt aktualisiert:',
    },
    'TOTALS': {
      'es': 'TOTALES',
      'fr': 'TOTAUX',
      'de': 'SUMMEN',
    },
    'Flat Tax Rate': {
      'es': 'Tasa de Impuesto Fijo',
      'fr': 'Taux d\'Impôt Forfaitaire',
      'de': 'Pauschalsteuersatz',
    },
    'standard rate': {
      'es': 'tasa estándar',
      'fr': 'taux standard',
      'de': 'Standardsatz',
    },
    'Taxpayers': {
      'es': 'Contribuyentes',
      'fr': 'Contribuables',
      'de': 'Steuerzahler',
    },
    'per quintile': {
      'es': 'por quintil',
      'fr': 'par quintile',
      'de': 'pro Quintil',
    },
    'per quintile x 5 =': {
      'es': 'por quintil x 5 =',
      'fr': 'par quintile x 5 =',
      'de': 'pro Quintil x 5 =',
    },
    'taxpayers per quintile': {
      'es': 'contribuyentes por quintil',
      'fr': 'contribuables par quintile',
      'de': 'Steuerzahler pro Quintil',
    },
    'total taxpayers': {
      'es': 'contribuyentes totales',
      'fr': 'contribuables totaux',
      'de': 'Gesamtzahl der Steuerzahler',
    },
    'UBI Calculator Parameters': {
      'es': 'Parámetros de la Calculadora de RBU',
      'fr': 'Paramètres du Calculateur de RBU',
      'de': 'UBI-Rechnerparameter',
    },
    'Calculation Model:': {
      'es': 'Modelo de Cálculo:',
      'fr': 'Modèle de Calcul:',
      'de': 'Berechnungsmodell:',
    },
    'Progressive Tax': {
      'es': 'Impuesto Progresivo',
      'fr': 'Impôt Progressif',
      'de': 'Progressive Steuer',
    },
    'Bell Curve': {
      'es': 'Curva de Campana',
      'fr': 'Courbe en Cloche',
      'de': 'Glockenkurve',
    },
    'Bell Curve (Gaussian)': {
      'es': 'Curva de Campana (Gaussiana)',
      'fr': 'Courbe en Cloche (Gaussienne)',
      'de': 'Glockenkurve (Gaußsche)',
    },
    'Percentile-Matched': {
      'es': 'Coincidencia de Percentil',
      'fr': 'Correspondance de Percentile',
      'de': 'Perzentil-Abgleich',
    },
    'Tax Model Comparison': {
      'es': 'Comparación de Modelos Fiscales',
      'fr': 'Comparaison des Modèles Fiscaux',
      'de': 'Vergleich der Steuermodelle',
    },
    'Compare different tax models to see their impact on income and government revenue.': {
      'es': 'Compare diferentes modelos fiscales para ver su impacto en los ingresos y en la recaudación del gobierno.',
      'fr': 'Comparez différents modèles fiscaux pour voir leur impact sur les revenus et les recettes gouvernementales.',
      'de': 'Vergleichen Sie verschiedene Steuermodelle, um ihre Auswirkungen auf Einkommen und Staatseinnahmen zu sehen.',
    },
    'Select Tax Models to Compare:': {
      'es': 'Seleccione Modelos Fiscales para Comparar:',
      'fr': 'Sélectionnez les Modèles Fiscaux à Comparer:',
      'de': 'Wählen Sie zu vergleichende Steuermodelle:',
    },
    'UBI Options:': {
      'es': 'Opciones de RBU:',
      'fr': 'Options de RBU:',
      'de': 'UBI-Optionen:',
    },
    'With UBI': {
      'es': 'Con RBU',
      'fr': 'Avec RBU',
      'de': 'Mit UBI',
    },
    'Without UBI': {
      'es': 'Sin RBU',
      'fr': 'Sans RBU',
      'de': 'Ohne UBI',
    },
    'Note: Model comparison feature is under development. Currently showing Flat Tax with UBI only.': {
      'es': 'Nota: La función de comparación de modelos está en desarrollo. Actualmente solo se muestra el Impuesto Fijo con RBU.',
      'fr': 'Remarque: La fonction de comparaison de modèles est en cours de développement. Actuellement, seul l\'Impôt Forfaitaire avec RBU est affiché.',
      'de': 'Hinweis: Die Modellvergleichsfunktion befindet sich in der Entwicklung. Derzeit wird nur die Pauschalsteuer mit UBI angezeigt.',
    },
    'About Tax Models:': {
      'es': 'Acerca de los Modelos Fiscales:',
      'fr': 'À propos des Modèles Fiscaux:',
      'de': 'Über Steuermodelle:',
    },
    'Flat Tax:': {
      'es': 'Impuesto Fijo:',
      'fr': 'Impôt Forfaitaire:',
      'de': 'Pauschalsteuer:',
    },
    'Applies the same tax rate to all income (or income above exemption with UBI).': {
      'es': 'Aplica la misma tasa impositiva a todos los ingresos (o ingresos por encima de la exención con RBU).',
      'fr': 'Applique le même taux d\'imposition à tous les revenus (ou aux revenus supérieurs à l\'exonération avec RBU).',
      'de': 'Wendet den gleichen Steuersatz auf alle Einkommen an (oder auf Einkommen über dem Freibetrag mit UBI).',
    },
    'Progressive Tax:': {
      'es': 'Impuesto Progresivo:',
      'fr': 'Impôt Progressif:',
      'de': 'Progressive Steuer:',
    },
    'Uses multiple tax brackets with increasing rates for higher incomes.': {
      'es': 'Utiliza múltiples tramos impositivos con tasas crecientes para ingresos más altos.',
      'fr': 'Utilise plusieurs tranches d\'imposition avec des taux croissants pour les revenus plus élevés.',
      'de': 'Verwendet mehrere Steuerklassen mit steigenden Sätzen für höhere Einkommen.',
    },
    'Bell Curve (Gaussian):': {
      'es': 'Curva de Campana (Gaussiana):',
      'fr': 'Courbe en Cloche (Gaussienne):',
      'de': 'Glockenkurve (Gaußsche):',
    },
    'Applies a bell-shaped distribution to tax rates, with highest rates near the 90th percentile.': {
      'es': 'Aplica una distribución en forma de campana a las tasas impositivas, con las tasas más altas cerca del percentil 90.',
      'fr': 'Applique une distribution en forme de cloche aux taux d\'imposition, avec les taux les plus élevés près du 90e percentile.',
      'de': 'Wendet eine glockenförmige Verteilung auf die Steuersätze an, mit den höchsten Sätzen nahe dem 90. Perzentil.',
    },
    'Percentile-Matched:': {
      'es': 'Coincidencia de Percentil:',
      'fr': 'Correspondance de Percentile:',
      'de': 'Perzentil-Abgleich:',
    },
    'If your income is in the 75th percentile, your tax burden will be in the 75th percentile of all tax burdens.': {
      'es': 'Si su ingreso está en el percentil 75, su carga fiscal estará en el percentil 75 de todas las cargas fiscales.',
      'fr': 'Si votre revenu se situe dans le 75e percentile, votre charge fiscale se situera dans le 75e percentile de toutes les charges fiscales.',
      'de': 'Wenn Ihr Einkommen im 75. Perzentil liegt, wird Ihre Steuerlast im 75. Perzentil aller Steuerlasten liegen.',
    },
    'Choose a tax year to analyze': {
      'es': 'Elija un año fiscal para analizar',
      'fr': 'Choisissez une année fiscale à analyser',
      'de': 'Wählen Sie ein Steuerjahr zur Analyse',
    },
    'Payment to each Taxpayer:': {
      'es': 'Pago a cada Contribuyente:',
      'fr': 'Paiement à chaque Contribuable:',
      'de': 'Zahlung an jeden Steuerzahler:',
    },
    'Month': {
      'es': 'Mes',
      'fr': 'Mois',
      'de': 'Monat',
    },
    'Year': {
      'es': 'Año',
      'fr': 'Année',
      'de': 'Jahr',
    },
    'Income Tax Flat Rate:': {
      'es': 'Tasa Fija de Impuesto sobre la Renta:',
      'fr': 'Taux Forfaitaire d\'Impôt sur le Revenu:',
      'de': 'Einkommenssteuer-Pauschalsatz:',
    },
    'Exemption Amount:': {
      'es': 'Monto de Exención:',
      'fr': 'Montant d\'Exonération:',
      'de': 'Freibetrag:',
    },
    'Number of taxpayers:': {
      'es': 'Número de contribuyentes:',
      'fr': 'Nombre de contribuables:',
      'de': 'Anzahl der Steuerzahler:',
    },
    '= Number of taxpayers:': {
      'es': '= Número de contribuyentes:',
      'fr': '= Nombre de contribuables:',
      'de': '= Anzahl der Steuerzahler:',
    },
    'Monthly payment to each Canadian': {
      'es': 'Pago mensual a cada canadiense',
      'fr': 'Paiement mensuel à chaque Canadien',
      'de': 'Monatliche Zahlung an jeden Kanadier',
    },
    'Applied to all income levels': {
      'es': 'Aplicado a todos los niveles de ingresos',
      'fr': 'Appliqué à tous les niveaux de revenus',
      'de': 'Auf alle Einkommensstufen angewendet',
    },
    'Taxpayer Distribution': {
      'es': 'Distribución de Contribuyentes',
      'fr': 'Répartition des Contribuables',
      'de': 'Steuerzahlerverteilung',
    },
    'Uniform': {
      'es': 'Uniforme',
      'fr': 'Uniforme',
      'de': 'Einheitlich',
    },
    'Tax Entries by Quintile': {
      'es': 'Entradas Fiscales por Quintil',
      'fr': 'Entrées Fiscales par Quintile',
      'de': 'Steuereinträge nach Quintil',
    },
    'Quintile (20% of Population)': {
      'es': 'Quintil (20% de la Población)',
      'fr': 'Quintile (20% de la Population)',
      'de': 'Quintil (20% der Bevölkerung)',
    },
    'Quintile': {
      'es': 'Quintil',
      'fr': 'Quintile',
      'de': 'Quintil',
    },
    'About Income Quintiles:': {
      'es': 'Acerca de los Quintiles de Ingresos:',
      'fr': 'À propos des Quintiles de Revenu:',
      'de': 'Über Einkommensquintile:',
    },
    'Each quintile represents exactly 20% of the taxpayer population (6.14 million people per quintile). Quintiles divide the population into five equal groups based on income level, from lowest (Q1) to highest (Q5).': {
      'es': 'Cada quintil representa exactamente el 20% de la población contribuyente (6,14 millones de personas por quintil). Los quintiles dividen la población en cinco grupos iguales según el nivel de ingresos, desde el más bajo (Q1) hasta el más alto (Q5).',
      'fr': 'Chaque quintile représente exactement 20% de la population des contribuables (6,14 millions de personnes par quintile). Les quintiles divisent la population en cinq groupes égaux selon le niveau de revenu, du plus bas (Q1) au plus élevé (Q5).',
      'de': 'Jedes Quintil repräsentiert genau 20% der Steuerzahlerpopulation (6,14 Millionen Menschen pro Quintil). Quintile teilen die Bevölkerung in fünf gleiche Gruppen basierend auf dem Einkommensniveau, vom niedrigsten (Q1) bis zum höchsten (Q5).',
    },
    'Lowest 20% (0-20th percentile)': {
      'es': 'El 20% más bajo (percentil 0-20)',
      'fr': '20% les plus bas (percentile 0-20)',
      'de': 'Niedrigste 20% (0-20. Perzentil)',
    },
    'Lower-middle 20% (20-40th percentile)': {
      'es': '20% medio-bajo (percentil 20-40)',
      'fr': '20% moyen-inférieur (percentile 20-40)',
      'de': 'Untere-Mitte 20% (20-40. Perzentil)',
    },
    'Middle 20% (40-60th percentile)': {
      'es': '20% medio (percentil 40-60)',
      'fr': '20% moyen (percentile 40-60)',
      'de': 'Mittlere 20% (40-60. Perzentil)',
    },
    'Upper-middle 20% (60-80th percentile)': {
      'es': '20% medio-alto (percentil 60-80)',
      'fr': '20% moyen-supérieur (percentile 60-80)',
      'de': 'Obere-Mitte 20% (60-80. Perzentil)',
    },
    'Highest 20% (80-100th percentile)': {
      'es': 'El 20% más alto (percentil 80-100)',
      'fr': '20% les plus élevés (percentile 80-100)',
      'de': 'Höchste 20% (80-100. Perzentil)',
    },
    'Average Taxable Income': {
      'es': 'Ingreso Imponible Promedio',
      'fr': 'Revenu Imposable Moyen',
      'de': 'Durchschnittliches steuerpflichtiges Einkommen',
    },
    'Median Tax': {
      'es': 'Impuesto Mediano',
      'fr': 'Impôt Médian',
      'de': 'Mediansteuer',
    },
    'Tax Revenue': {
      'es': 'Ingresos Fiscales',
      'fr': 'Recettes Fiscales',
      'de': 'Steuereinnahmen',
    },
    'Average Income with UBI': {
      'es': 'Ingreso Promedio con RBU',
      'fr': 'Revenu Moyen avec RBU',
      'de': 'Durchschnittliches Einkommen mit UBI',
    },
    'Median Tax with UBI': {
      'es': 'Impuesto Mediano con RBU',
      'fr': 'Impôt Médian avec RBU',
      'de': 'Mediansteuer mit UBI',
    },
    'Tax Revenue with UBI': {
      'es': 'Ingresos Fiscales con RBU',
      'fr': 'Recettes Fiscales avec RBU',
      'de': 'Steuereinnahmen mit UBI',
    },
    'Cost of UBI': {
      'es': 'Costo de RBU',
      'fr': 'Coût du RBU',
      'de': 'Kosten des UBI',
    },
    'All values are in thousands of dollars.': {
      'es': 'Todos los valores están en miles de dólares.',
      'fr': 'Toutes les valeurs sont en milliers de dollars.',
      'de': 'Alle Werte sind in Tausend Dollar angegeben.',
    },
    'Cost of UBI calculation: (UBI payments to quintile) - (Additional tax revenue from quintile)': {
      'es': 'Cálculo del costo de RBU: (Pagos RBU al quintil) - (Ingresos fiscales adicionales del quintil)',
      'fr': 'Calcul du coût du RBU: (Paiements RBU au quintile) - (Recettes fiscales supplémentaires du quintile)',
      'de': 'Berechnung der UBI-Kosten: (UBI-Zahlungen an Quintil) - (Zusätzliche Steuereinnahmen aus Quintil)',
    },
    'Tax Brackets': {
      'es': 'Tramos Impositivos',
      'fr': 'Tranches d\'Imposition',
      'de': 'Steuerklassen',
    },
    'click to toggle': {
      'es': 'clic para alternar',
      'fr': 'cliquer pour basculer',
      'de': 'klicken zum Umschalten',
    },
    'Income Range': {
      'es': 'Rango de Ingresos',
      'fr': 'Tranche de Revenu',
      'de': 'Einkommensbereich',
    },
    'Tax Rate': {
      'es': 'Tasa Impositiva',
      'fr': 'Taux d\'Imposition',
      'de': 'Steuersatz',
    },
    'Notes': {
      'es': 'Notas',
      'fr': 'Notes',
      'de': 'Hinweise',
    },
    'Exemption amount': {
      'es': 'Monto de exención',
      'fr': 'Montant d\'exonération',
      'de': 'Freibetrag',
    },
    'Flat tax rate': {
      'es': 'Tasa de impuesto fijo',
      'fr': 'Taux d\'impôt forfaitaire',
      'de': 'Pauschaler Steuersatz',
    },
    'How taxes are calculated:': {
      'es': 'Cómo se calculan los impuestos:',
      'fr': 'Comment les impôts sont calculés:',
      'de': 'Wie Steuern berechnet werden:',
    },
    'First $24,000 of income is exempt from taxation': {
      'es': 'Los primeros $24,000 de ingresos están exentos de impuestos',
      'fr': 'Les premiers $24,000 de revenus sont exonérés d\'impôts',
      'de': 'Die ersten $24,000 des Einkommens sind steuerfrei',
    },
    'All income above exemption amount is taxed at flat rate': {
      'es': 'Todos los ingresos por encima del monto de exención se gravan a una tasa fija',
      'fr': 'Tous les revenus supérieurs au montant d\'exonération sont imposés à taux fixe',
      'de': 'Alle Einkommen über dem Freibetrag werden mit einem Pauschalsatz besteuert',
    },
    'UBI payments are not taxed directly': {
      'es': 'Los pagos de RBU no se gravan directamente',
      'fr': 'Les paiements RBU ne sont pas imposés directement',
      'de': 'UBI-Zahlungen werden nicht direkt besteuert',
    },
    'UBI payments are added to income before taxation': {
      'es': 'Los pagos de RBU se añaden a los ingresos antes de la tributación',
      'fr': 'Les paiements RBU sont ajoutés au revenu avant imposition',
      'de': 'UBI-Zahlungen werden vor der Besteuerung zum Einkommen hinzugerechnet',
    },
    'Income above exemption is taxed using progressive brackets': {
      'es': 'Los ingresos por encima de la exención se gravan utilizando tramos progresivos',
      'fr': 'Les revenus supérieurs à l\'exonération sont imposés selon des tranches progressives',
      'de': 'Einkommen über dem Freibetrag wird mit progressiven Steuersätzen besteuert',
    },
    'Income is taxed based on a bell curve distribution with highest rates near 90th percentile': {
      'es': 'Los ingresos se gravan según una distribución de curva de campana con las tasas más altas cerca del percentil 90',
      'fr': 'Les revenus sont imposés selon une distribution en courbe en cloche avec les taux les plus élevés près du 90e percentile',
      'de': 'Das Einkommen wird auf Basis einer Glockenkurvenverteilung besteuert, mit den höchsten Sätzen nahe dem 90. Perzentil',
    },
    'Income is taxed so that tax burden percentile matches income percentile': {
      'es': 'Los ingresos se gravan de manera que el percentil de carga fiscal coincida con el percentil de ingresos',
      'fr': 'Les revenus sont imposés de sorte que le percentile de charge fiscale corresponde au percentile de revenu',
      'de': 'Das Einkommen wird so besteuert, dass das Perzentil der Steuerlast dem Einkommensperzentil entspricht',
    },
    'For income of $50,000 with UBI of $24,000/year:': {
      'es': 'Para ingresos de $50,000 con RBU de $24,000/año:',
      'fr': 'Pour un revenu de $50,000 avec RBU de $24,000/an:',
      'de': 'Für ein Einkommen von $50,000 mit UBI von $24,000/Jahr:',
    },
    'Tax Bracket Structure': {
      'es': 'Estructura de Tramos Impositivos',
      'fr': 'Structure des Tranches d\'Imposition',
      'de': 'Steuerklassenstruktur',
    },
    'Example:': {
      'es': 'Ejemplo:',
      'fr': 'Exemple:',
      'de': 'Beispiel:',
    },
    'For income of $50,000 with a 30% flat tax rate:': {
      'es': 'Para ingresos de $50,000 con una tasa fija del 30%:',
      'fr': 'Pour un revenu de $50,000 avec un taux forfaitaire de 30%:',
      'de': 'Für ein Einkommen von $50,000 mit einem Pauschalsatz von 30%:',
    },
    'Refresh Data': {
      'es': 'Actualizar Datos',
      'fr': 'Actualiser les Données',
      'de': 'Daten Aktualisieren',
    },
    'Loading UBI data...': {
      'es': 'Cargando datos de RBU...',
      'fr': 'Chargement des données RBU...',
      'de': 'UBI-Daten werden geladen...',
    },
    'No data available. Please select a year or refresh the data.': {
      'es': 'No hay datos disponibles. Por favor, seleccione un año o actualice los datos.',
      'fr': 'Aucune donnée disponible. Veuillez sélectionner une année ou actualiser les données.',
      'de': 'Keine Daten verfügbar. Bitte wählen Sie ein Jahr aus oder aktualisieren Sie die Daten.',
    },
    'Error:': {
      'es': 'Error:',
      'fr': 'Erreur:',
      'de': 'Fehler:',
    },
  };

  // Check if we have a mock translation for this text and language
  if (mockTranslations[text]?.[language]) {
    return mockTranslations[text][language];
  }

  // For text without predefined translations, we'll just return the text
  // without adding language markers to keep the UI cleaner
  return text;
}

/**
 * Translation function for use in components
 * This is a simplified version that returns the original text
 * and initiates translation in the background
 */
export function t(text: string, language: string): string {
  // Start translation in the background
  translateText(text, language)
    .catch(error => console.error('Background translation error:', error));

  // For now, return the original text
  // In a real implementation, you would use a state management system
  // to update the UI when the translation is ready
  return text;
}

/**
 * Synchronous translation function for direct use in JSX attributes
 * This uses the mock translations directly without async behavior
 * @param text The text to translate
 * @param language The target language code
 * @returns The translated text or the original if no translation exists
 */
export function getTranslatedText(text: string, language: string): string {
  // If the language is English or not specified, return the original text
  if (language === 'en' || !language) return text;

  // Check if we have a mock translation for this text and language
  const mockTranslations: { [key: string]: { [key: string]: string } } = {
    // Header and navigation
    'Year:': {
      'es': 'Año:',
      'fr': 'Année:',
      'de': 'Jahr:',
    },
    'Tax Model:': {
      'es': 'Modelo de Impuesto:',
      'fr': 'Modèle Fiscal:',
      'de': 'Steuermodell:',
    },
    'UBI Amount:': {
      'es': 'Cantidad de RBU:',
      'fr': 'Montant du RBU:',
      'de': 'UBI-Betrag:',
    },
    'Flat Tax Percentage:': {
      'es': 'Porcentaje de Impuesto Fijo:',
      'fr': 'Pourcentage d\'Impôt Forfaitaire:',
      'de': 'Pauschaler Steuersatz:',
    },
    'Exemption Amount:': {
      'es': 'Monto de Exención:',
      'fr': 'Montant d\'Exonération:',
      'de': 'Freibetrag:',
    },
    'Flat Tax': {
      'es': 'Impuesto Fijo',
      'fr': 'Impôt Forfaitaire',
      'de': 'Pauschalsteuer',
    },
    'Progressive Tax': {
      'es': 'Impuesto Progresivo',
      'fr': 'Impôt Progressif',
      'de': 'Progressive Steuer',
    },
    'Bell Curve': {
      'es': 'Curva de Campana',
      'fr': 'Courbe en Cloche',
      'de': 'Glockenkurve',
    },
    'Percentile-Matched': {
      'es': 'Coincidencia de Percentil',
      'fr': 'Correspondance de Percentile',
      'de': 'Perzentil-Abgleich',
    },
    '(No exemption)': {
      'es': '(Sin exención)',
      'fr': '(Sans exonération)',
      'de': '(Keine Befreiung)',
    },
  };

  // Check if we have a translation for this text
  if (mockTranslations[text]?.[language]) {
    return mockTranslations[text][language];
  }

  // For dynamic text with parameters (like "No tax on first $24k")
  if (text.startsWith('(No tax on first $') && text.endsWith('k)')) {
    const amount = text.replace('(No tax on first $', '').replace('k)', '');
    const translations = {
      'es': `(Sin impuestos en los primeros $${amount}k)`,
      'fr': `(Pas d'impôt sur les premiers $${amount}k)`,
      'de': `(Keine Steuer auf die ersten $${amount}k)`,
    };
    return translations[language] || text;
  }

  // For UBI amount options
  if (text.includes('k / Year') && text.includes('k / month')) {
    const yearAmount = text.split('$')[1].split('k')[0];
    const monthAmount = text.split('$')[2].split('k')[0];
    const translations = {
      'es': `$${yearAmount}k / Año ($${monthAmount}k / mes)`,
      'fr': `$${yearAmount}k / An ($${monthAmount}k / mois)`,
      'de': `$${yearAmount}k / Jahr ($${monthAmount}k / Monat)`,
    };
    return translations[language] || text;
  }

  // Return the original text if no translation is found
  return text;
}

/**
 * Get available languages
 * @returns Array of available language codes and names
 */
export function getAvailableLanguages(): { code: string; name: string }[] {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];
}
