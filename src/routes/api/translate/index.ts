/**
 * Google Translate API Integration
 * Server-side translation to avoid CORS issues and provide caching
 */
// @ts-nocheck

import type { RequestHandler } from '@builder.io/qwik-city';

// In-memory cache for translations (in production, use Redis or database)
const translationCache = new Map<string, string>();

export const onPost: RequestHandler = async ({ json, request, env }) => {
  try {
    console.log('📥 Translation API called');
    const requestBody = await request.json();
    console.log('📋 Request body:', requestBody);

    const { text, targetLanguage, sourceLanguage = 'en' } = requestBody;

    // Validate input
    if (!text || !targetLanguage) {
      return json(400, {
        success: false,
        error: 'Missing required parameters: text and targetLanguage'
      });
    }

    // Return original text if target language is English
    if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
      return json(200, {
        success: true,
        translatedText: text,
        cached: false,
        sourceLanguage,
        targetLanguage
      });
    }

    // Check cache first
    const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
    if (translationCache.has(cacheKey)) {
      return json(200, {
        success: true,
        translatedText: translationCache.get(cacheKey),
        cached: true,
        sourceLanguage,
        targetLanguage
      });
    }

    // Get Google Translate API key from environment
    const apiKey = env.get('GOOGLE_TRANSLATE_API_KEY') || process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      console.warn('Google Translate API key not found, using mock translations for demo');

      // Mock translations for demonstration (replace with real API when key is added)
      const mockTranslations: Record<string, Record<string, string>> = {
        fr: {
          // Main interface
          'UBI Compass': 'Boussole RUB',
          'Comprehensive UBI Policy Analysis with Real Canadian Data': 'Analyse Complète des Politiques de RUB avec des Données Canadiennes Réelles',
          'Powered by Statistics Canada • 2000-2023 Economic Data': 'Alimenté par Statistique Canada • Données Économiques 2000-2023',

          // Analysis Parameters
          'Analysis Parameters': 'Paramètres d\'Analyse',
          'Analysis Year': 'Année d\'Analyse',
          'Adult UBI (Annual)': 'RUB Adulte (Annuel)',
          'Child UBI (Monthly)': 'RUB Enfant (Mensuel)',
          'Child Age Cutoff': 'Âge Limite Enfant',

          // Tax Parameters
          'Tax Parameters': 'Paramètres Fiscaux',
          'Flat Tax Percentage': 'Pourcentage d\'Impôt Uniforme',
          'Tax Exemption Amount': 'Montant d\'Exemption Fiscale',

          // Results
          'UBI Program Feasibility': 'Faisabilité du Programme RUB',
          'Gross Program Cost': 'Coût Brut du Programme',
          'Tax Revenue': 'Revenus Fiscaux',
          'Net Program Cost': 'Coût Net du Programme',
          'Feasibility Assessment': 'Évaluation de Faisabilité',

          // Economic Context
          'Economic Context': 'Contexte Économique',
          'Canadian GDP': 'PIB Canadien',
          'Federal Budget': 'Budget Fédéral',
          'Provincial Budgets': 'Budgets Provinciaux',
          'Adult Population': 'Population Adulte',
          'Child Population': 'Population Enfantine',
          'Inflation Rate': 'Taux d\'Inflation',
          'years': 'ans',
          '= Estimated data • No symbol = Real Statistics Canada data': '= Données estimées • Aucun symbole = Vraies données de Statistique Canada',

          // Additional missing translations
          'No tax on first': 'Aucun impôt sur les premiers',
          'of income': 'de revenu',
          'Children under': 'Les enfants de moins de',
          'receive child UBI': 'reçoivent le RUB enfant',

          // Form labels that might have different text
          'Child Age Cutoff:': 'Âge Limite Enfant:',
          'Child Age Cutoff': 'Âge Limite Enfant',
          'Children under 18 receive child UBI': 'Les enfants de moins de 18 reçoivent le RUB enfant',
          'Flat Tax Percentage:': 'Pourcentage d\'Impôt Uniforme:',
          'Flat Tax Percentage': 'Pourcentage d\'Impôt Uniforme',
          'Tax Exemption Amount:': 'Montant d\'Exemption Fiscale:',
          'Tax Exemption Amount': 'Montant d\'Exemption Fiscale',
          'No tax on first $24k of income': 'Aucun impôt sur les premiers $24k de revenu',

          // Dynamic text patterns (these might be constructed with variables)
          'No tax on first': 'Aucun impôt sur les premiers',
          'of income': 'de revenu',
          '% of GDP': '% du PIB',
          '% of Government Budget': '% du Budget Gouvernemental',

          // Feasibility levels
          'FEASIBLE': 'FAISABLE',
          'CHALLENGING': 'DIFFICILE',
          'DIFFICULT': 'TRÈS DIFFICILE',

          // Data quality
          'Complete': 'Complètes',
          'Excellent': 'Excellentes',
          'Good': 'Bonnes',
          'Partial': 'Partielles',
          'Complete Statistics Canada data': 'Données complètes de Statistique Canada',
          'Excellent Statistics Canada data': 'Excellentes données de Statistique Canada',
          'Good Statistics Canada data': 'Bonnes données de Statistique Canada',
          'Complete data (6/6 datasets)': 'Données complètes (6/6 ensembles de données)',
          'Excellent data (5/6 datasets + historical GDP)': 'Excellentes données (5/6 ensembles + PIB historique)',
          'Good data (4/6 datasets + historical GDP)': 'Bonnes données (4/6 ensembles + PIB historique)',
          'month': 'mois',
          'year': 'année',
          'Complete data coverage (6/6 datasets)': 'Couverture complète des données (6/6 ensembles de données)',
          'Excellent coverage (5/6 datasets + historical GDP)': 'Excellente couverture (5/6 ensembles + PIB historique)',
          'Good coverage (4/6 datasets + historical GDP)': 'Bonne couverture (4/6 ensembles + PIB historique)',

          // Dropdown labels
          'Complete Data (All 6 Datasets)': 'Données Complètes (6/6 Ensembles de Données)',
          'Excellent Data (5/6 Datasets + Historical GDP)': 'Excellentes Données (5/6 Ensembles + PIB Historique)',
          'Good Data (4/6 Datasets + Historical GDP)': 'Bonnes Données (4/6 Ensembles + PIB Historique)',

          // Additional text
          'under': 'de moins de',
          '$22/month (rural)': '$22/mois (zone rurale)',

          // Methodology section
          'Feasibility Assessment Methodology': 'Méthodologie d\'Évaluation de Faisabilité',
          'GDP Percentage Thresholds': 'Seuils de Pourcentage du PIB',
          'Based on international economic research and existing social program scales.': 'Basé sur la recherche économique internationale et l\'échelle des programmes sociaux existants.',
          'Economic Context': 'Contexte Économique',
          'Canadian GDP 2022': 'PIB Canadien 2022',
          'Total Gov\'t Spending': 'Dépenses Gouvernementales Totales',
          'Current Social Programs': 'Programmes Sociaux Actuels',
          'UBI would be the largest social program in Canadian history.': 'Le RUB serait le plus grand programme social de l\'histoire canadienne.',
          'International Benchmarks': 'Références Internationales',
          'Finland UBI Trial': 'Essai RUB Finlandais',
          'Kenya GiveDirectly': 'Kenya GiveDirectly',
          'kenyaGiveDirectly': 'Kenya GiveDirectly',
          'Alaska Dividend': 'Dividende de l\'Alaska',
          'Most UBI pilots are much smaller than full implementation.': 'La plupart des projets pilotes RUB sont beaucoup plus petits qu\'une mise en œuvre complète.',

          // Important Considerations section
          'Important Considerations': 'Considérations Importantes',
          'This analysis considers NET cost (gross UBI cost minus tax revenue generated), but does not account for:': 'Cette analyse considère le coût NET (coût brut du RUB moins les revenus fiscaux générés), mais ne tient pas compte de :',
          'Savings from replacing existing programs (welfare, unemployment insurance)': 'Économies en remplaçant les programmes existants (aide sociale, assurance-chômage)',
          'Economic multiplier effects and increased consumer spending': 'Effets multiplicateurs économiques et augmentation des dépenses de consommation',
          'Reduced administrative costs compared to means-tested programs': 'Coûts administratifs réduits par rapport aux programmes sous condition de ressources',
          'Potential productivity gains and entrepreneurship increases': 'Gains de productivité potentiels et augmentation de l\'entrepreneuriat',
          'Health and education benefits that reduce long-term costs': 'Avantages en santé et éducation qui réduisent les coûts à long terme',

          // Data Sources section
          'Data Sources:': 'Sources de Données :',
          'Analysis covers 2008-2022 with comprehensive economic indicators.': 'L\'analyse couvre 2008-2022 avec des indicateurs économiques complets.'
        },

          // Support section
          'Support Development': 'Soutenir le Développement',
          'Keeping UBI Compass Free & Global': 'Garder UBI Compass Gratuit et Mondial',
          'Your support helps cover translation costs and keeps this tool accessible worldwide.': 'Votre soutien aide à couvrir les coûts de traduction et maintient cet outil accessible dans le monde entier.',
          'Buy Me a Coffee': 'Offrez-moi un Café',
          'UBI Compass is free for everyone. If it\'s valuable to you, consider supporting development.': 'UBI Compass est gratuit pour tous. Si cela vous est utile, considérez soutenir le développement.',
        es: {
          // Main interface
          'UBI Compass': 'Brújula RUB',
          'Comprehensive UBI Policy Analysis with Real Canadian Data': 'Análisis Integral de Políticas RUB con Datos Canadienses Reales',
          'Powered by Statistics Canada • 2000-2023 Economic Data': 'Impulsado por Statistics Canada • Datos Económicos 2000-2023',

          // Analysis Parameters
          'Analysis Parameters': 'Parámetros de Análisis',
          'Analysis Year': 'Año de Análisis',
          'Adult UBI (Annual)': 'RUB Adulto (Anual)',
          'Child UBI (Monthly)': 'RUB Infantil (Mensual)',
          'Child Age Cutoff': 'Límite de Edad Infantil',

          // Tax Parameters
          'Tax Parameters': 'Parámetros Fiscales',
          'Flat Tax Percentage': 'Porcentaje de Impuesto Uniforme',
          'Tax Exemption Amount': 'Monto de Exención Fiscal',

          // Results
          'UBI Program Feasibility': 'Viabilidad del Programa RUB',
          'Gross Program Cost': 'Costo Bruto del Programa',
          'Tax Revenue': 'Ingresos Fiscales',
          'Net Program Cost': 'Costo Neto del Programa',
          'Feasibility Assessment': 'Evaluación de Viabilidad',

          // Economic Context
          'Economic Context': 'Contexto Económico',
          'Canadian GDP': 'PIB Canadiense',
          'Federal Budget': 'Presupuesto Federal',
          'Provincial Budgets': 'Presupuestos Provinciales',
          'Adult Population': 'Población Adulta',
          'Child Population': 'Población Infantil',
          'Inflation Rate': 'Tasa de Inflación',
          'years': 'años',
          '= Estimated data • No symbol = Real Statistics Canada data': '= Datos estimados • Sin símbolo = Datos reales de Statistics Canada',

          // Additional text
          'under': 'menores de',
          '$22/month (rural)': '$22/mes (zona rural)',

          // Dropdown labels
          'Complete Data (All 6 Datasets)': 'Datos Completos (6/6 Conjuntos de Datos)',
          'Excellent Data (5/6 Datasets + Historical GDP)': 'Excelentes Datos (5/6 Conjuntos + PIB Histórico)',
          'Good Data (4/6 Datasets + Historical GDP)': 'Buenos Datos (4/6 Conjuntos + PIB Histórico)',

          // Form labels
          'No tax on first': 'Sin impuesto en los primeros',
          'of income': 'de ingresos',
          'Children under': 'Niños menores de',
          'receive child UBI': 'reciben RUB infantil',
          '% of GDP': '% del PIB',
          '% of Government Budget': '% del Presupuesto Gubernamental',

          // Feasibility levels
          'FEASIBLE': 'VIABLE',
          'CHALLENGING': 'DESAFIANTE',
          'DIFFICULT': 'DIFÍCIL',

          // Data quality
          'Complete': 'Completos',
          'Excellent': 'Excelentes',
          'Good': 'Buenos',
          'Complete data coverage (6/6 datasets)': 'Cobertura completa de datos (6/6 conjuntos de datos)',
          'Excellent coverage (5/6 datasets + historical GDP)': 'Excelente cobertura (5/6 conjuntos + PIB histórico)',
          'Good coverage (4/6 datasets + historical GDP)': 'Buena cobertura (4/6 conjuntos + PIB histórico)',

          // Data Sources
          'Data Sources:': 'Fuentes de Datos:',
          'Analysis covers 2008-2022 with comprehensive economic indicators.': 'El análisis cubre 2008-2022 con indicadores económicos integrales.',

          // Support section
          'Support Development': 'Apoyar el Desarrollo',
          'Keeping UBI Compass Free & Global': 'Mantener UBI Compass Gratuito y Global',
          'Your support helps cover translation costs and keeps this tool accessible worldwide.': 'Su apoyo ayuda a cubrir los costos de traducción y mantiene esta herramienta accesible en todo el mundo.',
          'Buy Me a Coffee': 'Cómprame un Café',
          'UBI Compass is free for everyone. If it\'s valuable to you, consider supporting development.': 'UBI Compass es gratuito para todos. Si le resulta valioso, considere apoyar el desarrollo.'
        },
        pt: {
          'UBI Compass': 'Bússola RBU',
          'Comprehensive UBI Policy Analysis with Real Canadian Data': 'Análise Abrangente de Políticas de RBU com Dados Canadenses Reais',
          'Analysis Parameters': 'Parâmetros de Análise',
          'Economic Context': 'Contexto Econômico'
        }
      };

      const mockTranslated = mockTranslations[targetLanguage]?.[text] || text;

      console.log(`🔍 Mock translation lookup:`);
      console.log(`  Text: "${text}"`);
      console.log(`  Target: ${targetLanguage}`);
      console.log(`  Found: "${mockTranslated}"`);
      console.log(`  Available keys:`, Object.keys(mockTranslations[targetLanguage] || {}));

      // Cache the mock translation
      translationCache.set(cacheKey, mockTranslated);

      return json(200, {
        success: true,
        translatedText: mockTranslated,
        cached: false,
        sourceLanguage,
        targetLanguage,
        warning: 'Using mock translations - add GOOGLE_TRANSLATE_API_KEY for real translations'
      });
    }

    // Call Google Translate API
    const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    console.log(`🔄 Calling Google Translate API for: "${text}" (${sourceLanguage} → ${targetLanguage})`);

    const response = await fetch(translateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text'
      })
    });

    console.log(`📡 Google Translate API response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Google Translate API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });

      return json(200, {
        success: true,
        translatedText: text, // Fallback to original text
        cached: false,
        sourceLanguage,
        targetLanguage,
        warning: `Translation API error: ${response.status} ${response.statusText}`,
        debug: { status: response.status, error: errorData }
      });
    }

    const data = await response.json();
    console.log(`✅ Google Translate API response:`, data);

    const translatedText = data.data.translations[0].translatedText;
    console.log(`🎯 Final translation: "${text}" → "${translatedText}"`);

    // Cache the translation
    translationCache.set(cacheKey, translatedText);

    return json(200, {
      success: true,
      translatedText,
      cached: false,
      sourceLanguage,
      targetLanguage
    });

  } catch (error) {
    console.error('Translation API error:', error);
    
    return json(500, {
      success: false,
      error: 'Translation service error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET endpoint for health check
export const onGet: RequestHandler = async ({ json }) => {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  
  return json(200, {
    success: true,
    status: 'Translation API ready',
    configured: !!apiKey,
    cacheSize: translationCache.size,
    supportedLanguages: [
      'en', 'fr', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'ja', 'ko', 
      'ar', 'hi', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr', 'uk',
      'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt'
    ]
  });
};
