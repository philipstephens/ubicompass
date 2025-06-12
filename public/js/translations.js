/**
 * Translations for the UBI Calculator
 */
const translations = {
    // English translations (default)
    en: {
        // Header and navigation
        "Help Us End Poverty Forever!!": "Help Us End Poverty Forever!!",
        "with a Universal Basic Income": "with a Universal Basic Income",
        "Home": "Home",
        "Standalone App": "Standalone App",
        "Simple Version": "Simple Version",
        
        // Calculator title and description
        "Standalone UBI Calculator": "Standalone UBI Calculator",
        "This standalone calculator allows you to explore the impact of Universal Basic Income (UBI) across different income groups. You can switch between quintile view (5 income groups) and decile view (10 income groups) using the buttons below.": 
            "This standalone calculator allows you to explore the impact of Universal Basic Income (UBI) across different income groups. You can switch between quintile view (5 income groups) and decile view (10 income groups) using the buttons below.",
        
        // View buttons
        "Quintile Calculator": "Quintile Calculator",
        "Decile Calculator with SVG Charts": "Decile Calculator with SVG Charts",
        "Back to Main App": "Back to Main App",
        
        // Calculator parameters
        "UBI Calculator Parameters": "UBI Calculator Parameters",
        "Tax Year": "Tax Year",
        "UBI Amount": "UBI Amount",
        "Flat Tax Percentage": "Flat Tax Percentage",
        "Exemption Amount": "Exemption Amount",
        
        // UBI amount options
        "$12k / Year ($1.0k / month)": "$12k / Year ($1.0k / month)",
        "$18k / Year ($1.5k / month)": "$18k / Year ($1.5k / month)",
        "$24k / Year ($2.0k / month)": "$24k / Year ($2.0k / month)",
        "$30k / Year ($2.5k / month)": "$30k / Year ($2.5k / month)",
        "$36k / Year ($3.0k / month)": "$36k / Year ($3.0k / month)",
        
        // Exemption amount options
        "$0k (No exemption)": "$0k (No exemption)",
        "$12k (No tax on first $12k)": "$12k (No tax on first $12k)",
        "$18k (No tax on first $18k)": "$18k (No tax on first $18k)",
        "$24k (No tax on first $24k)": "$24k (No tax on first $24k)",
        "$30k (No tax on first $30k)": "$30k (No tax on first $30k)",
        "$36k (No tax on first $36k)": "$36k (No tax on first $36k)",
        
        // Chart views
        "Income Impact": "Income Impact",
        "Cost Analysis": "Cost Analysis",
        
        // Chart titles
        "UBI Impact by Income Decile": "UBI Impact by Income Decile",
        "Income Comparison by Decile": "Income Comparison by Decile",
        "UBI Cost Analysis by Decile": "UBI Cost Analysis by Decile",
        
        // Chart legends
        "Average Taxable Income": "Average Taxable Income",
        "Income with UBI": "Income with UBI",
        "Flat Tax Paid": "Flat Tax Paid",
        "Break-even Point": "Break-even Point",
        "UBI Payments": "UBI Payments",
        "Tax Revenue": "Tax Revenue",
        "Net Cost": "Net Cost",
        
        // Footer notes
        "* All values in the income chart are in thousands of dollars.": "* All values in the income chart are in thousands of dollars.",
        "* All values in the cost analysis are in billions of dollars.": "* All values in the cost analysis are in billions of dollars.",
        "* Each decile represents approximately 1.5 million taxpayers (15 million total taxpayers divided into 10 equal groups).": "* Each decile represents approximately 1.5 million taxpayers (15 million total taxpayers divided into 10 equal groups).",
        "Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10).": 
            "Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10).",
        
        // Decile descriptions
        "Lowest 10%": "Lowest 10%",
        "10-20%": "10-20%",
        "20-30%": "20-30%",
        "30-40%": "30-40%",
        "40-50%": "40-50%",
        "50-60%": "50-60%",
        "60-70%": "60-70%",
        "70-80%": "70-80%",
        "80-90%": "80-90%",
        "Highest 10%": "Highest 10%",
        
        // Cost analysis totals
        "Total UBI Cost": "Total UBI Cost",
        "Total Tax Revenue": "Total Tax Revenue",
        "Net Cost": "Net Cost",
        
        // Axis labels
        "Income Decile": "Income Decile",
        "Income (thousands)": "Income (thousands)",
        "Amount (billions)": "Amount (billions)"
    },
    
    // French translations
    fr: {
        // Header and navigation
        "Help Us End Poverty Forever!!": "Aidez-nous à éliminer la pauvreté pour toujours!!",
        "with a Universal Basic Income": "avec un revenu de base universel",
        "Home": "Accueil",
        "Standalone App": "Application autonome",
        "Simple Version": "Version simple",
        
        // Calculator title and description
        "Standalone UBI Calculator": "Calculateur RBU autonome",
        "This standalone calculator allows you to explore the impact of Universal Basic Income (UBI) across different income groups. You can switch between quintile view (5 income groups) and decile view (10 income groups) using the buttons below.": 
            "Ce calculateur autonome vous permet d'explorer l'impact du revenu de base universel (RBU) sur différents groupes de revenus. Vous pouvez basculer entre la vue par quintile (5 groupes de revenus) et la vue par décile (10 groupes de revenus) à l'aide des boutons ci-dessous.",
        
        // View buttons
        "Quintile Calculator": "Calculateur par quintile",
        "Decile Calculator with SVG Charts": "Calculateur par décile avec graphiques SVG",
        "Back to Main App": "Retour à l'application principale",
        
        // Calculator parameters
        "UBI Calculator Parameters": "Paramètres du calculateur RBU",
        "Tax Year": "Année fiscale",
        "UBI Amount": "Montant du RBU",
        "Flat Tax Percentage": "Pourcentage d'impôt forfaitaire",
        "Exemption Amount": "Montant de l'exemption",
        
        // UBI amount options
        "$12k / Year ($1.0k / month)": "12k$ / an (1,0k$ / mois)",
        "$18k / Year ($1.5k / month)": "18k$ / an (1,5k$ / mois)",
        "$24k / Year ($2.0k / month)": "24k$ / an (2,0k$ / mois)",
        "$30k / Year ($2.5k / month)": "30k$ / an (2,5k$ / mois)",
        "$36k / Year ($3.0k / month)": "36k$ / an (3,0k$ / mois)",
        
        // Exemption amount options
        "$0k (No exemption)": "0k$ (Pas d'exemption)",
        "$12k (No tax on first $12k)": "12k$ (Pas d'impôt sur les premiers 12k$)",
        "$18k (No tax on first $18k)": "18k$ (Pas d'impôt sur les premiers 18k$)",
        "$24k (No tax on first $24k)": "24k$ (Pas d'impôt sur les premiers 24k$)",
        "$30k (No tax on first $30k)": "30k$ (Pas d'impôt sur les premiers 30k$)",
        "$36k (No tax on first $36k)": "36k$ (Pas d'impôt sur les premiers 36k$)",
        
        // Chart views
        "Income Impact": "Impact sur le revenu",
        "Cost Analysis": "Analyse des coûts",
        
        // Chart titles
        "UBI Impact by Income Decile": "Impact du RBU par décile de revenu",
        "Income Comparison by Decile": "Comparaison des revenus par décile",
        "UBI Cost Analysis by Decile": "Analyse des coûts du RBU par décile",
        
        // Chart legends
        "Average Taxable Income": "Revenu imposable moyen",
        "Income with UBI": "Revenu avec RBU",
        "Flat Tax Paid": "Impôt forfaitaire payé",
        "Break-even Point": "Point d'équilibre",
        "UBI Payments": "Paiements RBU",
        "Tax Revenue": "Recettes fiscales",
        "Net Cost": "Coût net",
        
        // Footer notes
        "* All values in the income chart are in thousands of dollars.": "* Toutes les valeurs dans le graphique des revenus sont en milliers de dollars.",
        "* All values in the cost analysis are in billions of dollars.": "* Toutes les valeurs dans l'analyse des coûts sont en milliards de dollars.",
        "* Each decile represents approximately 1.5 million taxpayers (15 million total taxpayers divided into 10 equal groups).": "* Chaque décile représente environ 1,5 million de contribuables (15 millions de contribuables au total divisés en 10 groupes égaux).",
        "Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10).": 
            "Chaque décile représente exactement 10% de la population des contribuables. Les déciles divisent la population en dix groupes égaux basés sur le niveau de revenu, du plus bas (D1) au plus élevé (D10).",
        
        // Decile descriptions
        "Lowest 10%": "10% les plus bas",
        "10-20%": "10-20%",
        "20-30%": "20-30%",
        "30-40%": "30-40%",
        "40-50%": "40-50%",
        "50-60%": "50-60%",
        "60-70%": "60-70%",
        "70-80%": "70-80%",
        "80-90%": "80-90%",
        "Highest 10%": "10% les plus élevés",
        
        // Cost analysis totals
        "Total UBI Cost": "Coût total du RBU",
        "Total Tax Revenue": "Recettes fiscales totales",
        "Net Cost": "Coût net",
        
        // Axis labels
        "Income Decile": "Décile de revenu",
        "Income (thousands)": "Revenu (milliers)",
        "Amount (billions)": "Montant (milliards)"
    },
    
    // Spanish translations
    es: {
        // Header and navigation
        "Help Us End Poverty Forever!!": "¡Ayúdanos a acabar con la pobreza para siempre!",
        "with a Universal Basic Income": "con una Renta Básica Universal",
        "Home": "Inicio",
        "Standalone App": "Aplicación independiente",
        "Simple Version": "Versión simple",
        
        // Calculator title and description
        "Standalone UBI Calculator": "Calculadora RBU independiente",
        "This standalone calculator allows you to explore the impact of Universal Basic Income (UBI) across different income groups. You can switch between quintile view (5 income groups) and decile view (10 income groups) using the buttons below.": 
            "Esta calculadora independiente le permite explorar el impacto de la Renta Básica Universal (RBU) en diferentes grupos de ingresos. Puede cambiar entre la vista por quintiles (5 grupos de ingresos) y la vista por deciles (10 grupos de ingresos) utilizando los botones a continuación.",
        
        // View buttons
        "Quintile Calculator": "Calculadora por quintiles",
        "Decile Calculator with SVG Charts": "Calculadora por deciles con gráficos SVG",
        "Back to Main App": "Volver a la aplicación principal",
        
        // Calculator parameters
        "UBI Calculator Parameters": "Parámetros de la calculadora RBU",
        "Tax Year": "Año fiscal",
        "UBI Amount": "Cantidad de RBU",
        "Flat Tax Percentage": "Porcentaje de impuesto fijo",
        "Exemption Amount": "Cantidad de exención",
        
        // UBI amount options
        "$12k / Year ($1.0k / month)": "$12k / año ($1.0k / mes)",
        "$18k / Year ($1.5k / month)": "$18k / año ($1.5k / mes)",
        "$24k / Year ($2.0k / month)": "$24k / año ($2.0k / mes)",
        "$30k / Year ($2.5k / month)": "$30k / año ($2.5k / mes)",
        "$36k / Year ($3.0k / month)": "$36k / año ($3.0k / mes)",
        
        // Exemption amount options
        "$0k (No exemption)": "$0k (Sin exención)",
        "$12k (No tax on first $12k)": "$12k (Sin impuestos en los primeros $12k)",
        "$18k (No tax on first $18k)": "$18k (Sin impuestos en los primeros $18k)",
        "$24k (No tax on first $24k)": "$24k (Sin impuestos en los primeros $24k)",
        "$30k (No tax on first $30k)": "$30k (Sin impuestos en los primeros $30k)",
        "$36k (No tax on first $36k)": "$36k (Sin impuestos en los primeros $36k)",
        
        // Chart views
        "Income Impact": "Impacto en los ingresos",
        "Cost Analysis": "Análisis de costos",
        
        // Chart titles
        "UBI Impact by Income Decile": "Impacto de la RBU por decil de ingresos",
        "Income Comparison by Decile": "Comparación de ingresos por decil",
        "UBI Cost Analysis by Decile": "Análisis de costos de la RBU por decil",
        
        // Chart legends
        "Average Taxable Income": "Ingreso imponible promedio",
        "Income with UBI": "Ingreso con RBU",
        "Flat Tax Paid": "Impuesto fijo pagado",
        "Break-even Point": "Punto de equilibrio",
        "UBI Payments": "Pagos de RBU",
        "Tax Revenue": "Ingresos fiscales",
        "Net Cost": "Costo neto",
        
        // Footer notes
        "* All values in the income chart are in thousands of dollars.": "* Todos los valores en el gráfico de ingresos están en miles de dólares.",
        "* All values in the cost analysis are in billions of dollars.": "* Todos los valores en el análisis de costos están en miles de millones de dólares.",
        "* Each decile represents approximately 1.5 million taxpayers (15 million total taxpayers divided into 10 equal groups).": "* Cada decil representa aproximadamente 1,5 millones de contribuyentes (15 millones de contribuyentes en total divididos en 10 grupos iguales).",
        "Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10).": 
            "Cada decil representa exactamente el 10% de la población de contribuyentes. Los deciles dividen la población en diez grupos iguales según el nivel de ingresos, desde el más bajo (D1) hasta el más alto (D10).",
        
        // Decile descriptions
        "Lowest 10%": "10% más bajo",
        "10-20%": "10-20%",
        "20-30%": "20-30%",
        "30-40%": "30-40%",
        "40-50%": "40-50%",
        "50-60%": "50-60%",
        "60-70%": "60-70%",
        "70-80%": "70-80%",
        "80-90%": "80-90%",
        "Highest 10%": "10% más alto",
        
        // Cost analysis totals
        "Total UBI Cost": "Costo total de la RBU",
        "Total Tax Revenue": "Ingresos fiscales totales",
        "Net Cost": "Costo neto",
        
        // Axis labels
        "Income Decile": "Decil de ingresos",
        "Income (thousands)": "Ingresos (miles)",
        "Amount (billions)": "Cantidad (miles de millones)"
    }
};

/**
 * Translate a string to the specified language
 * @param {string} text - The text to translate
 * @param {string} language - The language code (en, fr, es)
 * @returns {string} - The translated text
 */
function translate(text, language) {
    // Default to English if language not specified or not supported
    if (!language || !translations[language]) {
        language = 'en';
    }
    
    // Return the translation if it exists, otherwise return the original text
    return translations[language][text] || text;
}

/**
 * Apply translations to all elements with the data-translate attribute
 * @param {string} language - The language code (en, fr, es)
 */
function applyTranslations(language) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = translate(key, language);
        
        // Handle different element types
        if (element.tagName === 'INPUT' && element.type === 'submit') {
            element.value = translation;
        } else if (element.tagName === 'INPUT' && element.type === 'placeholder') {
            element.placeholder = translation;
        } else if (element.tagName === 'IMG') {
            element.alt = translation;
        } else {
            element.textContent = translation;
        }
    });
}

// Export the functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        translate,
        applyTranslations,
        translations
    };
}
