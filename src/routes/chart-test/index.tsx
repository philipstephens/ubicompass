import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

// Mock data for testing
const mockData = [
  { quintile: 1, averageTaxableIncome: 20, incomeWithUBI: 44 },
  { quintile: 2, averageTaxableIncome: 40, incomeWithUBI: 64 },
  { quintile: 3, averageTaxableIncome: 60, incomeWithUBI: 84 },
  { quintile: 4, averageTaxableIncome: 100, incomeWithUBI: 124 },
  { quintile: 5, averageTaxableIncome: 200, incomeWithUBI: 224 },
];

export default component$(() => {
  // Get the maximum value for scaling
  let maxValue = 0;
  mockData.forEach((entry) => {
    maxValue = Math.max(maxValue, entry.averageTaxableIncome, entry.incomeWithUBI);
  });

  // Add 10% padding to the top
  maxValue = Math.ceil(maxValue * 1.1);

  return (
    <div class="p-8 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Simple Bar Chart Test</h1>
      
      <div class="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Income Comparison by Quintile</h2>
        
        {/* Legend */}
        <div class="flex items-center gap-4 mb-6">
          <div class="flex items-center">
            <div class="w-4 h-4 mr-2 bg-blue-500"></div>
            <span class="text-sm">Average Taxable Income</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 mr-2 bg-green-500"></div>
            <span class="text-sm">Income with UBI</span>
          </div>
        </div>
        
        {/* Chart container */}
        <div class="relative mb-8">
          {/* Y-axis labels */}
          <div class="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-right pr-2">
            <div>${maxValue}k</div>
            <div>${Math.round(maxValue * 0.75)}k</div>
            <div>${Math.round(maxValue * 0.5)}k</div>
            <div>${Math.round(maxValue * 0.25)}k</div>
            <div>$0k</div>
          </div>
          
          {/* Chart area */}
          <div class="ml-12 h-64 border-l border-b border-gray-300 relative">
            {/* Horizontal grid lines */}
            <div class="absolute left-0 right-0 top-0 border-t border-gray-200"></div>
            <div class="absolute left-0 right-0 top-1/4 border-t border-gray-200"></div>
            <div class="absolute left-0 right-0 top-2/4 border-t border-gray-200"></div>
            <div class="absolute left-0 right-0 top-3/4 border-t border-gray-200"></div>
            
            {/* Bars */}
            <div class="absolute inset-0 flex">
              {mockData.map((entry) => {
                // Calculate heights as percentages
                const avgIncomeHeight = maxValue > 0 ? (entry.averageTaxableIncome / maxValue) * 100 : 0;
                const incomeWithUBIHeight = maxValue > 0 ? (entry.incomeWithUBI / maxValue) * 100 : 0;

                return (
                  <div key={entry.quintile} class="flex-1 flex justify-center">
                    <div class="w-4/5 flex justify-center relative">
                      {/* Average Income Bar */}
                      <div class="absolute bottom-0 w-8 mx-1">
                        <div 
                          class="bg-blue-500 border border-blue-600 rounded-t-md w-full"
                          style={{ height: `${avgIncomeHeight}%` }}
                        ></div>
                        <div class="text-center text-xs font-bold mt-1 text-blue-700">
                          ${entry.averageTaxableIncome}k
                        </div>
                      </div>
                      
                      {/* Income with UBI Bar */}
                      <div class="absolute bottom-0 w-8 mx-1 left-10">
                        <div 
                          class="bg-green-500 border border-green-600 rounded-t-md w-full"
                          style={{ height: `${incomeWithUBIHeight}%` }}
                        ></div>
                        <div class="text-center text-xs font-bold mt-1 text-green-700">
                          ${entry.incomeWithUBI}k
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* X-axis labels */}
          <div class="ml-12 flex text-sm text-gray-600 mt-6">
            {mockData.map((entry) => {
              let description = "";
              switch(entry.quintile) {
                case 1: description = "Lowest 20%"; break;
                case 2: description = "Lower-middle 20%"; break;
                case 3: description = "Middle 20%"; break;
                case 4: description = "Upper-middle 20%"; break;
                case 5: description = "Highest 20%"; break;
                default: description = "";
              }
              
              return (
                <div key={entry.quintile} class="flex-1 text-center">
                  <div class="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full text-sm inline-block">
                    Q{entry.quintile}
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    {description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div class="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p>* All values are in thousands of dollars.</p>
          <p class="mt-2">
            Each quintile represents exactly 20% of the taxpayer population. Quintiles divide the population into five equal groups based on income level, from lowest (Q1) to highest (Q5).
          </p>
        </div>
      </div>
      
      {/* Alternative visualization using horizontal bars */}
      <div class="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Alternative: Horizontal Bar Chart</h2>
        
        <div class="space-y-8">
          {mockData.map((entry) => {
            // Calculate widths as percentages of the maximum value
            const avgIncomeWidth = maxValue > 0 ? (entry.averageTaxableIncome / maxValue) * 100 : 0;
            const incomeWithUBIWidth = maxValue > 0 ? (entry.incomeWithUBI / maxValue) * 100 : 0;

            // Determine quintile description
            let description = "";
            switch(entry.quintile) {
              case 1: description = "Lowest 20%"; break;
              case 2: description = "Lower-middle 20%"; break;
              case 3: description = "Middle 20%"; break;
              case 4: description = "Upper-middle 20%"; break;
              case 5: description = "Highest 20%"; break;
              default: description = "";
            }

            return (
              <div key={entry.quintile} class="border-b border-gray-200 pb-6">
                <div class="flex items-center mb-2">
                  <div class="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm mr-2">
                    Q{entry.quintile}
                  </div>
                  <div class="text-sm text-gray-600">{description}</div>
                </div>
                
                <div class="space-y-4">
                  {/* Average Income Bar */}
                  <div>
                    <div class="flex items-center mb-1">
                      <div class="w-32 text-sm">Average Income:</div>
                      <div class="flex-1 bg-gray-100 h-6 rounded overflow-hidden">
                        <div 
                          class="h-full bg-blue-500 rounded-r flex items-center justify-end px-2 text-white text-xs font-medium"
                          style={{ width: `${avgIncomeWidth}%` }}
                        >
                          ${entry.averageTaxableIncome}k
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Income with UBI Bar */}
                  <div>
                    <div class="flex items-center mb-1">
                      <div class="w-32 text-sm">Income with UBI:</div>
                      <div class="flex-1 bg-gray-100 h-6 rounded overflow-hidden">
                        <div 
                          class="h-full bg-green-500 rounded-r flex items-center justify-end px-2 text-white text-xs font-medium"
                          style={{ width: `${incomeWithUBIWidth}%` }}
                        >
                          ${entry.incomeWithUBI}k
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Chart Test",
  meta: [
    {
      name: "description",
      content: "Testing chart rendering in Qwik",
    },
  ],
};
