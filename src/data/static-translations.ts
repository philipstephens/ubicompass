/**
 * Static translations for offline/no-database mode
 * Supports English, French, and Spanish
 */

export interface TranslationSet {
  [key: string]: string;
}

export interface StaticTranslations {
  en: TranslationSet;
  fr: TranslationSet;
  es: TranslationSet;
}

export const staticTranslations: StaticTranslations = {
  en: {
    // Main titles
    title: "UBI Compass",
    subtitle: "Universal Basic Income Feasibility Calculator for Canada",
    poweredBy: "Powered by Statistics Canada data (2000-2022)",
    
    // Analysis parameters
    analysisParameters: "Analysis Parameters",
    analysisYear: "Analysis Year",
    
    // UBI amounts
    adultUbi: "Adult UBI (Annual)",
    childUbi: "Child UBI (Monthly)",
    youthUbi: "Youth UBI (Monthly)",
    seniorBonus: "Senior Bonus (Monthly)",
    
    // Age cutoffs
    childAgeCutoff: "Child Age Cutoff",
    adultAgeCutoff: "Adult Age Cutoff",
    youthAdultCutoff: "Youth/Adult Age Cutoff",
    seniorAgeCutoff: "Senior Age Cutoff",
    
    // Tax parameters
    taxParameters: "Tax Parameters",
    flatTaxPercentage: "Flat Tax Percentage",
    taxExemptionAmount: "Tax Exemption Amount",
    noTaxOnFirst: "No tax on first",
    ofIncome: "of income",
    
    // Population descriptions
    childrenUnder: "Children under",
    ages: "ages",
    receiveChildUbi: "receive child UBI",
    receiveYouthUbi: "receive youth UBI",
    receiveAdultUbi: "receive adult UBI",
    receiveSeniorBonus: "receive senior bonus",
    
    // Results
    ubiProgramFeasibility: "UBI Program Feasibility",
    grossProgramCost: "Gross Program Cost",
    taxRevenue: "Tax Revenue",
    netProgramCost: "Net Program Cost",
    ofGdp: "of GDP",
    ofGovBudget: "of Gov't Budget",
    
    // Feasibility levels
    feasible: "FEASIBLE",
    challenging: "CHALLENGING",
    difficult: "DIFFICULT",
    
    // Economic context
    economicContextTitle: "Economic Context",
    adultPopulation: "Adult Population",
    childPopulation: "Child Population",
    youthPopulation: "Youth Population",
    seniorPopulation: "Senior Population",
    canadianGdp: "Canadian GDP",
    totalGovSpending: "Total Gov't Spending",
    inflationRate: "Inflation Rate",
    
    // Data quality
    completeDataLabel: "Complete Data (All 6 Datasets)",
    excellentDataLabel: "Excellent Data (5/6 Datasets + Historical GDP)",
    goodDataLabel: "Good Data (4/6 Datasets + Historical GDP)",
    completeOption: "Complete",
    excellentOption: "Excellent",
    goodOption: "Good",
    
    // Time units
    years: "years",
    month: "month",
    year: "year",
    
    // Common words
    under: "under",
    and: "and"
  },
  
  fr: {
    // Main titles
    title: "Boussole RUB",
    subtitle: "Calculateur de faisabilité du revenu universel de base pour le Canada",
    poweredBy: "Alimenté par les données de Statistique Canada (2000-2022)",
    
    // Analysis parameters
    analysisParameters: "Paramètres d'analyse",
    analysisYear: "Année d'analyse",
    
    // UBI amounts
    adultUbi: "RUB adulte (annuel)",
    childUbi: "RUB enfant (mensuel)",
    youthUbi: "RUB jeunesse (mensuel)",
    seniorBonus: "Prime senior (mensuelle)",
    
    // Age cutoffs
    childAgeCutoff: "Âge limite enfant",
    adultAgeCutoff: "Âge limite adulte",
    youthAdultCutoff: "Âge limite jeunesse/adulte",
    seniorAgeCutoff: "Âge limite senior",
    
    // Tax parameters
    taxParameters: "Paramètres fiscaux",
    flatTaxPercentage: "Pourcentage d'impôt uniforme",
    taxExemptionAmount: "Montant d'exemption fiscale",
    noTaxOnFirst: "Aucun impôt sur les premiers",
    ofIncome: "de revenu",
    
    // Population descriptions
    childrenUnder: "Enfants de moins de",
    ages: "âges",
    receiveChildUbi: "reçoivent le RUB enfant",
    receiveYouthUbi: "reçoivent le RUB jeunesse",
    receiveAdultUbi: "reçoivent le RUB adulte",
    receiveSeniorBonus: "reçoivent la prime senior",
    
    // Results
    ubiProgramFeasibility: "Faisabilité du programme RUB",
    grossProgramCost: "Coût brut du programme",
    taxRevenue: "Revenus fiscaux",
    netProgramCost: "Coût net du programme",
    ofGdp: "du PIB",
    ofGovBudget: "du budget gov.",
    
    // Feasibility levels
    feasible: "FAISABLE",
    challenging: "DIFFICILE",
    difficult: "TRÈS DIFFICILE",
    
    // Economic context
    economicContextTitle: "Contexte économique",
    adultPopulation: "Population adulte",
    childPopulation: "Population enfantine",
    youthPopulation: "Population jeunesse",
    seniorPopulation: "Population senior",
    canadianGdp: "PIB canadien",
    totalGovSpending: "Dépenses gov. totales",
    inflationRate: "Taux d'inflation",
    
    // Data quality
    completeDataLabel: "Données complètes (6/6 ensembles)",
    excellentDataLabel: "Excellentes données (5/6 ensembles + PIB historique)",
    goodDataLabel: "Bonnes données (4/6 ensembles + PIB historique)",
    completeOption: "Complètes",
    excellentOption: "Excellentes",
    goodOption: "Bonnes",
    
    // Time units
    years: "ans",
    month: "mois",
    year: "année",
    
    // Common words
    under: "moins de",
    and: "et"
  },
  
  es: {
    // Main titles
    title: "Brújula RBU",
    subtitle: "Calculadora de viabilidad de renta básica universal para Canadá",
    poweredBy: "Impulsado por datos de Statistics Canada (2000-2022)",
    
    // Analysis parameters
    analysisParameters: "Parámetros de análisis",
    analysisYear: "Año de análisis",
    
    // UBI amounts
    adultUbi: "RBU adulto (anual)",
    childUbi: "RBU niño (mensual)",
    youthUbi: "RBU joven (mensual)",
    seniorBonus: "Bono senior (mensual)",
    
    // Age cutoffs
    childAgeCutoff: "Límite de edad niño",
    adultAgeCutoff: "Límite de edad adulto",
    youthAdultCutoff: "Límite de edad joven/adulto",
    seniorAgeCutoff: "Límite de edad senior",
    
    // Tax parameters
    taxParameters: "Parámetros fiscales",
    flatTaxPercentage: "Porcentaje de impuesto fijo",
    taxExemptionAmount: "Cantidad de exención fiscal",
    noTaxOnFirst: "Sin impuesto en los primeros",
    ofIncome: "de ingresos",
    
    // Population descriptions
    childrenUnder: "Niños menores de",
    ages: "edades",
    receiveChildUbi: "reciben RBU infantil",
    receiveYouthUbi: "reciben RBU juvenil",
    receiveAdultUbi: "reciben RBU adulto",
    receiveSeniorBonus: "reciben bono senior",
    
    // Results
    ubiProgramFeasibility: "Viabilidad del programa RBU",
    grossProgramCost: "Costo bruto del programa",
    taxRevenue: "Ingresos fiscales",
    netProgramCost: "Costo neto del programa",
    ofGdp: "del PIB",
    ofGovBudget: "del presupuesto gov.",
    
    // Feasibility levels
    feasible: "VIABLE",
    challenging: "DESAFIANTE",
    difficult: "DIFÍCIL",
    
    // Economic context
    economicContextTitle: "Contexto económico",
    adultPopulation: "Población adulta",
    childPopulation: "Población infantil",
    youthPopulation: "Población juvenil",
    seniorPopulation: "Población senior",
    canadianGdp: "PIB canadiense",
    totalGovSpending: "Gasto gov. total",
    inflationRate: "Tasa de inflación",
    
    // Data quality
    completeDataLabel: "Datos completos (6/6 conjuntos)",
    excellentDataLabel: "Excelentes datos (5/6 conjuntos + PIB histórico)",
    goodDataLabel: "Buenos datos (4/6 conjuntos + PIB histórico)",
    completeOption: "Completos",
    excellentOption: "Excelentes",
    goodOption: "Buenos",
    
    // Time units
    years: "años",
    month: "mes",
    year: "año",
    
    // Common words
    under: "menor de",
    and: "y"
  }
};

/**
 * Get translation for a key in a specific language
 */
export const getStaticTranslation = (key: string, language: string): string => {
  const lang = language as keyof StaticTranslations;
  if (staticTranslations[lang] && staticTranslations[lang][key]) {
    return staticTranslations[lang][key];
  }
  // Fallback to English
  return staticTranslations.en[key] || key;
};

/**
 * Get all supported static languages
 */
export const getSupportedStaticLanguages = (): { [code: string]: string } => {
  return {
    en: "🇺🇸 English",
    fr: "🇫🇷 Français",
    es: "🇪🇸 Español"
  };
};
