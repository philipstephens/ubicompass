import { component$, useSignal, $ } from "@builder.io/qwik";
import { CspHeader } from "~/components/csp-header";
import { MenuComponent } from "~/components/menu-component";
import { TranslationProvider } from "~/components/translation-provider";
import { IncomeRangeSimple } from "~/components/income-range-simple";
import type { DocumentHead } from "@builder.io/qwik-city";

/**
 * A page that demonstrates the income range component
 */
export default component$(() => {
  // Local state
  const exemptionAmount = useSignal(24);
  const taxRate = useSignal(30);
  
  // Handle exemption amount change
  const handleExemptionChange = $((amount: number) => {
    exemptionAmount.value = amount;
    console.log("Exemption amount changed to:", amount);
  });
  
  return (
    <div class="bg-gray-200 min-h-screen">
      {/* Header */}
      <div class="header-container">
        <CspHeader
          headerColor="rgba(186, 164, 61, 1)"
          height="h-64"
          title="Income Range Component Demo"
          subTitle="Testing the income range component"
          titleSize="text-3xl"
          subTitleSize="text-sm"
        />
      </div>

      {/* Menu - directly below header with no gap */}
      <div class="menu-container">
        <MenuComponent
          backgroundColor="rgb(255, 215, 0)"
          textColor="rgb(255, 0, 0)"
          height="h-4"
        />
      </div>

      {/* Small gap */}
      <div class="small-gap"></div>

      {/* Main content */}
      <div class="mx-4 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Income Range Component Demo</h2>
        <p class="mb-4">
          This page demonstrates the income range component in isolation.
          You can adjust the exemption amount and see how it updates the tax brackets.
        </p>
        
        <div class="flex flex-wrap gap-6 mt-8">
          {/* Controls */}
          <div class="w-full md:w-1/3 p-4 bg-gray-100 rounded-lg">
            <h3 class="text-xl font-bold mb-4">Controls</h3>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Exemption Amount:</label>
              <select 
                class="w-full p-2 border rounded"
                value={exemptionAmount.value}
                onChange$={(e) => handleExemptionChange(parseInt(e.target.value, 10))}
              >
                <option value={0}>$0k (No exemption)</option>
                <option value={12}>$12k</option>
                <option value={18}>$18k</option>
                <option value={24}>$24k</option>
                <option value={30}>$30k</option>
                <option value={36}>$36k</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Tax Rate:</label>
              <select 
                class="w-full p-2 border rounded"
                value={taxRate.value}
                onChange$={(e) => taxRate.value = parseInt(e.target.value, 10)}
              >
                <option value={20}>20%</option>
                <option value={25}>25%</option>
                <option value={30}>30%</option>
                <option value={35}>35%</option>
                <option value={40}>40%</option>
              </select>
            </div>
          </div>
          
          {/* Income Range Component */}
          <div class="w-full md:w-1/3">
            <IncomeRangeSimple 
              exemptionAmount={exemptionAmount.value} 
              taxRate={taxRate.value}
              onExemptionChange$={handleExemptionChange}
            />
          </div>
        </div>
        
        <div class="mt-8">
          <a 
            href="/" 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Main Page
          </a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Income Range Demo",
  meta: [
    {
      name: "description",
      content: "A demonstration of the income range component",
    },
  ],
};
