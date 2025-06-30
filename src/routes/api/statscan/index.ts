/**
 * Statistics Canada API Endpoint
 * Provides access to population, GDP, and economic data
 */
import type { RequestHandler } from '@builder.io/qwik-city';
import { getPopulationData, getEconomicData, getAvailableYears } from '../../../services/statistics-service';

export const onGet: RequestHandler = async ({ json, url }) => {
  try {
    const searchParams = url.searchParams;
    const action = searchParams.get('action') || 'years';
    
    switch (action) {
      case 'years': {
        const years = await getAvailableYears();
        json(200, { success: true, data: years });
        break;
      }
      
      case 'population': {
        const year = parseInt(searchParams.get('year') || '2022');
        const childAgeCutoff = parseInt(searchParams.get('childAge') || '7');
        const youthAgeCutoff = parseInt(searchParams.get('youthAge') || '24');
        const seniorAgeCutoff = parseInt(searchParams.get('seniorAge') || '65');
        
        const population = await getPopulationData(
          year, 
          childAgeCutoff, 
          youthAgeCutoff, 
          seniorAgeCutoff
        );
        
        json(200, { success: true, data: population });
        break;
      }
      
      case 'economic': {
        const year = parseInt(searchParams.get('year') || '2022');
        const economic = await getEconomicData(year);
        
        json(200, { success: true, data: economic });
        break;
      }
      
      case 'combined': {
        const year = parseInt(searchParams.get('year') || '2022');
        const childAgeCutoff = parseInt(searchParams.get('childAge') || '7');
        const youthAgeCutoff = parseInt(searchParams.get('youthAge') || '24');
        const seniorAgeCutoff = parseInt(searchParams.get('seniorAge') || '65');
        
        // Get both population and economic data in parallel
        const [population, economic] = await Promise.all([
          getPopulationData(year, childAgeCutoff, youthAgeCutoff, seniorAgeCutoff),
          getEconomicData(year)
        ]);
        
        json(200, { 
          success: true, 
          data: {
            year,
            population,
            economic
          }
        });
        break;
      }
      
      default:
        json(400, { success: false, error: 'Invalid action parameter' });
    }
  } catch (error) {
    console.error('API error:', error);
    json(500, { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

