// Language Hash Tables for UBI Compass
// Human-curated translations for instant lookup

export interface TranslationTable {
  [key: string]: string;
}

export interface LanguageTranslations {
  [languageCode: string]: TranslationTable;
}

// Core UBI Compass translations
export const TRANSLATION_TABLES: LanguageTranslations = {
  // French translations
  fr: {
    // Header & Navigation
    "UBI Compass": "Boussole RUB",
    "Menu": "Menu",
    "About": "À propos",
    "Feedback": "Commentaires",
    "English": "Anglais",
    "Français": "Français",
    "Year": "Année",

    // Main sections
    "Age Distribution": "Répartition par âge",
    "UBI Amounts": "Montants RUB",
    "Government Spending Analysis": "Analyse des dépenses gouvernementales",
    "Results Dashboard": "Tableau de bord des résultats",
    "UBI Optimizer": "Optimiseur RUB",

    // Age groups
    "Children": "Enfants",
    "Youth": "Jeunes",
    "Adults": "Adultes", 
    "Seniors": "Aînés",

    // Government programs
    "GST/HST Credit": "Crédit de TPS/TVH",
    "Old Age Security": "Sécurité de la vieillesse",
    "Canada Child Benefit": "Allocation canadienne pour enfants",
    "Employment Insurance": "Assurance-emploi",

    // Data accuracy
    "High Accuracy": "Haute précision",
    "Good Accuracy": "Bonne précision", 
    "Moderate Accuracy": "Précision modérée",
    "Limited Accuracy": "Précision limitée",
    "Report Issue": "Signaler un problème",

    // Feedback
    "Thank you for your feedback about": "Merci pour vos commentaires sur",
    "data accuracy! Your input helps us improve our historical estimates.": "la précision des données! Votre contribution nous aide à améliorer nos estimations historiques.",
    "Feedback ID:": "ID de commentaire:",
    "Report data accuracy issue for": "Signaler un problème de précision des données pour",
    "Data accuracy feedback for": "Commentaires sur la précision des données pour",
    "Please describe any specific issues you've noticed:": "Veuillez décrire les problèmes spécifiques que vous avez remarqués:",

    // Common UI
    "Loading...": "Chargement...",
    "Error": "Erreur",
    "Success": "Succès",
    "Total UBI Cost": "Coût total du RUB",
    "Tax Revenue": "Revenus fiscaux",
    "Program Savings": "Économies de programmes",
    "Net Cost": "Coût net",
    "Feasible": "Faisable",
    "Challenging": "Difficile",
    "Unfeasible": "Irréalisable",
  },

  // Spanish translations
  es: {
    // Header & Navigation
    "UBI Compass": "Brújula RBU",
    "Menu": "Menú",
    "About": "Acerca de",
    "Feedback": "Comentarios",
    "English": "Inglés",
    "Français": "Francés",
    "Español": "Español",
    "Year": "Año",

    // Main sections
    "Age Distribution": "Distribución por edad",
    "UBI Amounts": "Cantidades RBU",
    "Government Spending Analysis": "Análisis del gasto gubernamental",
    "Results Dashboard": "Panel de resultados",
    "UBI Optimizer": "Optimizador RBU",

    // Age groups
    "Children": "Niños",
    "Youth": "Jóvenes",
    "Adults": "Adultos",
    "Seniors": "Adultos mayores",

    // Government programs
    "GST/HST Credit": "Crédito GST/HST",
    "Old Age Security": "Seguridad de Vejez",
    "Canada Child Benefit": "Beneficio Canadiense por Hijos",
    "Employment Insurance": "Seguro de Empleo",

    // Data accuracy
    "High Accuracy": "Alta precisión",
    "Good Accuracy": "Buena precisión",
    "Moderate Accuracy": "Precisión moderada", 
    "Limited Accuracy": "Precisión limitada",
    "Report Issue": "Reportar problema",

    // Feedback
    "Thank you for your feedback about": "Gracias por sus comentarios sobre",
    "data accuracy! Your input helps us improve our historical estimates.": "la precisión de los datos! Su aporte nos ayuda a mejorar nuestras estimaciones históricas.",
    "Feedback ID:": "ID de comentario:",

    // Common UI
    "Loading...": "Cargando...",
    "Error": "Error",
    "Success": "Éxito",
    "Total UBI Cost": "Costo total del RBU",
    "Tax Revenue": "Ingresos fiscales",
    "Program Savings": "Ahorros de programas",
    "Net Cost": "Costo neto",
    "Feasible": "Factible",
    "Challenging": "Desafiante",
    "Unfeasible": "No factible",
  },

  // German translations
  de: {
    // Header & Navigation
    "UBI Compass": "BGE Kompass",
    "Menu": "Menü",
    "About": "Über",
    "Feedback": "Rückmeldung",
    "English": "Englisch",
    "Français": "Französisch",
    "Deutsch": "Deutsch",
    "Year": "Jahr",

    // Main sections
    "Age Distribution": "Altersverteilung",
    "UBI Amounts": "BGE Beträge",
    "Government Spending Analysis": "Staatsausgaben-Analyse",
    "Results Dashboard": "Ergebnis-Dashboard",
    "UBI Optimizer": "BGE Optimierer",

    // Age groups
    "Children": "Kinder",
    "Youth": "Jugendliche",
    "Adults": "Erwachsene",
    "Seniors": "Senioren",

    // Government programs
    "GST/HST Credit": "GST/HST-Gutschrift",
    "Old Age Security": "Alterssicherheit",
    "Canada Child Benefit": "Kanadisches Kindergeld",
    "Employment Insurance": "Arbeitslosenversicherung",

    // Data accuracy
    "High Accuracy": "Hohe Genauigkeit",
    "Good Accuracy": "Gute Genauigkeit",
    "Moderate Accuracy": "Mäßige Genauigkeit",
    "Limited Accuracy": "Begrenzte Genauigkeit", 
    "Report Issue": "Problem melden",

    // Common UI
    "Loading...": "Laden...",
    "Error": "Fehler",
    "Success": "Erfolg",
    "Total UBI Cost": "Gesamte BGE-Kosten",
    "Tax Revenue": "Steuereinnahmen",
    "Program Savings": "Programmeinsparungen",
    "Net Cost": "Nettokosten",
    "Feasible": "Machbar",
    "Challenging": "Herausfordernd",
    "Unfeasible": "Nicht machbar",
  },

  // Italian translations
  it: {
    "UBI Compass": "Bussola RDU",
    "Menu": "Menu",
    "About": "Informazioni",
    "Feedback": "Feedback",
    "Year": "Anno",
    "Age Distribution": "Distribuzione per età",
    "UBI Amounts": "Importi RDU",
    "Children": "Bambini",
    "Youth": "Giovani",
    "Adults": "Adulti",
    "Seniors": "Anziani",
    "Loading...": "Caricamento...",
    "Error": "Errore",
    "Success": "Successo",
    "Feasible": "Fattibile",
    "Challenging": "Impegnativo",
    "Unfeasible": "Non fattibile",
  },

  // Portuguese translations
  pt: {
    "UBI Compass": "Bússola RBU",
    "Menu": "Menu",
    "About": "Sobre",
    "Feedback": "Feedback",
    "Year": "Ano",
    "Age Distribution": "Distribuição por idade",
    "UBI Amounts": "Valores RBU",
    "Children": "Crianças",
    "Youth": "Jovens",
    "Adults": "Adultos",
    "Seniors": "Idosos",
    "Loading...": "Carregando...",
    "Error": "Erro",
    "Success": "Sucesso",
    "Feasible": "Viável",
    "Challenging": "Desafiador",
    "Unfeasible": "Inviável",
  },
};

// Helper function to get translation from hash table
export function getHashTableTranslation(
  text: string, 
  targetLanguage: string
): string | null {
  const languageTable = TRANSLATION_TABLES[targetLanguage];
  if (!languageTable) {
    return null; // Language not supported in hash tables
  }
  
  return languageTable[text] || null; // Return translation or null if not found
}

// Get all supported languages in hash tables
export function getSupportedHashTableLanguages(): string[] {
  return Object.keys(TRANSLATION_TABLES);
}

// Check if a language is fully supported by hash tables
export function isLanguageFullySupported(languageCode: string): boolean {
  return languageCode in TRANSLATION_TABLES;
}
