import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { TaxEntry } from '../models/income-data';
import { SvgChart } from './svg-chart';
import { TranslatableText } from './translatable-text';

interface UbiDecileCalculatorProps {
  taxEntries: TaxEntry[];
  ubiAmount: number;
  flatTaxPercentage: number;
  exemptionAmount: number;
}

export const UbiDecileCalculator = component$<UbiDecileCalculatorProps>(({
  taxEntries,
  ubiAmount,
  flatTaxPercentage,
  exemptionAmount
}) => {
  // State for view toggle
  const currentView = useSignal<'income' | 'cost'>('income');
  
  // Calculate income with UBI
  const calculateIncomeWithUBI = $((entry: TaxEntry) => {
    const income = entry.averagetaxableincome || 0;
    return income + ubiAmount;
  });
  
  // Calculate tax paid
  const calculateTaxPaid = $((income: number) => {
    const taxRate = flatTaxPercentage / 100;
    const taxableIncome = Math.max(0, income - exemptionAmount);
    return taxableIncome * taxRate;
  });
  
  // Update calculations when parameters change
  useTask$(({ track }) => {
    track(() => ubiAmount);
    track(() => flatTaxPercentage);
    track(() => exemptionAmount);
    
    console.log('UBI Decile Calculator parameters updated:');
    console.log('UBI Amount:', ubiAmount);
    console.log('Flat Tax Percentage:', flatTaxPercentage);
    console.log('Exemption Amount:', exemptionAmount);
  });
  
  return (
    <div class="ubi-decile-calculator">
      <div class="view-toggle flex justify-center mb-5">
        <button 
          class={`px-4 py-2 mx-2 rounded ${currentView.value === 'income' ? 'bg-purple-700 text-white' : 'bg-purple-200 text-purple-800'}`}
          onClick$={() => currentView.value = 'income'}
        >
          <TranslatableText text="Income Impact" />
        </button>
        <button 
          class={`px-4 py-2 mx-2 rounded ${currentView.value === 'cost' ? 'bg-purple-700 text-white' : 'bg-purple-200 text-purple-800'}`}
          onClick$={() => currentView.value = 'cost'}
        >
          <TranslatableText text="Cost Analysis" />
        </button>
      </div>
      
      <div class="card rounded-3xl overflow-hidden border border-indigo-200 bg-white shadow-md mb-10">
        <div class="card-header bg-purple-600 py-2.5 px-4 flex justify-between items-center">
          <h2 class="card-title font-bold text-lg m-0 text-white">
            <TranslatableText text="UBI Impact by Income Decile" />
          </h2>
        </div>
        <div class="card-content p-5">
          {currentView.value === 'income' ? (
            <div class="income-view">
              <h3 class="text-lg font-medium mb-4 text-center">
                <TranslatableText text="Income Comparison by Decile" />
              </h3>
              
              <div class="legend flex justify-center flex-wrap mb-4">
                <div class="legend-item flex items-center mx-4 mb-2">
                  <div class="legend-color w-5 h-5 mr-2 rounded bg-blue-500"></div>
                  <span><TranslatableText text="Average Taxable Income" /></span>
                </div>
                <div class="legend-item flex items-center mx-4 mb-2">
                  <div class="legend-color w-5 h-5 mr-2 rounded bg-green-500"></div>
                  <span><TranslatableText text="Income with UBI" /></span>
                </div>
                <div class="legend-item flex items-center mx-4 mb-2">
                  <div class="legend-color w-5 h-5 mr-2 rounded bg-purple-600"></div>
                  <span><TranslatableText text="Flat Tax Paid" /></span>
                </div>
                <div class="legend-item flex items-center mx-4 mb-2">
                  <div class="h-0.5 w-5 mr-2 border-t-2 border-dashed border-red-500"></div>
                  <span class="text-red-500"><TranslatableText text="Break-even Point" /></span>
                </div>
              </div>
              
              <SvgChart 
                taxEntries={taxEntries}
                calculateIncomeWithUBI={calculateIncomeWithUBI}
                calculateTaxPaid={calculateTaxPaid}
                ubiAmount={ubiAmount}
                flatTaxPercentage={flatTaxPercentage}
                exemptionAmount={exemptionAmount}
                view="income"
              />
              
              <div class="footer-note mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p>* <TranslatableText text="All values in the income chart are in thousands of dollars." /></p>
                <p class="mt-2">
                  <TranslatableText text="Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10)." />
                </p>
              </div>
            </div>
          ) : (
            <div class="cost-view">
              <h3 class="text-lg font-medium mb-4 text-center">
                <TranslatableText text="UBI Cost Analysis by Decile" />
              </h3>
              
              <div class="legend flex justify-center flex-wrap mb-4">
                <div class="legend-item flex items-center mx-4 mb-2">
                  <div class="legend-color w-5 h-5 mr-2 rounded bg-yellow-500"></div>
                  <span><TranslatableText text="UBI Payments" /></span>
                </div>
                <div class="legend-item flex items-center mx-4 mb-2">
                  <div class="legend-color w-5 h-5 mr-2 rounded bg-purple-600"></div>
                  <span><TranslatableText text="Tax Revenue" /></span>
                </div>
                <div class="legend-item flex items-center mx-4 mb-2">
                  <div class="legend-color w-5 h-5 mr-2 rounded bg-red-500"></div>
                  <span><TranslatableText text="Net Cost" /></span>
                </div>
              </div>
              
              <SvgChart 
                taxEntries={taxEntries}
                calculateIncomeWithUBI={calculateIncomeWithUBI}
                calculateTaxPaid={calculateTaxPaid}
                ubiAmount={ubiAmount}
                flatTaxPercentage={flatTaxPercentage}
                exemptionAmount={exemptionAmount}
                view="cost"
              />
              
              <div class="footer-note mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p>* <TranslatableText text="All values in the cost analysis are in billions of dollars." /></p>
                <p>* <TranslatableText text="Each decile represents approximately 1.5 million taxpayers (15 million total taxpayers divided into 10 equal groups)." /></p>
                <p class="mt-2">
                  <TranslatableText text="Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10)." />
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
