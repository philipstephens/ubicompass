import { component$, useSignal, $ } from "@builder.io/qwik";
import { CspHeader } from "~/components/csp-header";
import { MenuComponent } from "~/components/menu-component";
import { IncomeRangeStandalone } from "~/components/income-range-standalone";
import type { DocumentHead } from "@builder.io/qwik-city";

/**
 * A page that demonstrates the standalone income range component
 */
export default component$(() => {
  // Local state
  const exemptionAmount = useSignal(24);
  const taxRate = useSignal(30);
  const taxModel = useSignal("flat");
  
  // Handle exemption amount change
  const handleExemptionChange = $((amount: number) => {
    exemptionAmount.value = amount;
    console.log("Exemption amount changed to:", amount);
  });
  
  // Handle tax rate change
  const handleTaxRateChange = $((rate: number) => {
    taxRate.value = rate;
    console.log("Tax rate changed to:", rate);
  });
  
  // Handle tax model change
  const handleTaxModelChange = $((model: string) => {
    taxModel.value = model;
    console.log("Tax model changed to:", model);
  });
  
  return (
    <div class="bg-gray-200 min-h-screen">
      {/* Header */}
      <div class="header-container">
        <CspHeader
          headerColor="rgba(186, 164, 61, 1)"
          height="h-64"
          title="Standalone Income Range Component"
          subTitle="A simplified implementation that avoids circular references"
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
        <h2 class="text-2xl font-bold mb-4">Standalone Income Range Component</h2>
        <p class="mb-4">
          This page demonstrates a standalone implementation of the income range component
          that avoids circular reference issues by not relying on the UBI store.
        </p>
        
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 class="text-blue-800 font-medium text-lg mb-2">Implementation Details</h3>
          <p class="text-blue-600 text-sm mb-2">
            This component:
          </p>
          <ul class="text-blue-600 text-sm list-disc pl-5">
            <li class="mb-1">Uses local state with useSignal() instead of the UBI store</li>
            <li class="mb-1">Implements event handlers with $() to update the state</li>
            <li class="mb-1">Provides callback props for parent components to react to changes</li>
            <li class="mb-1">Uses inline styles instead of complex CSS classes</li>
          </ul>
        </div>
        
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
                onChange$={(e) => handleTaxRateChange(parseInt(e.target.value, 10))}
              >
                <option value={20}>20%</option>
                <option value={25}>25%</option>
                <option value={30}>30%</option>
                <option value={35}>35%</option>
                <option value={40}>40%</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Tax Model:</label>
              <select 
                class="w-full p-2 border rounded"
                value={taxModel.value}
                onChange$={(e) => handleTaxModelChange(e.target.value)}
              >
                <option value="flat">Flat Tax</option>
                <option value="progressive">Progressive Tax</option>
                <option value="bell">Bell Curve</option>
              </select>
            </div>
          </div>
          
          {/* Income Range Component */}
          <div class="w-full md:w-1/3">
            <IncomeRangeStandalone 
              exemptionAmount={exemptionAmount.value} 
              taxRate={taxRate.value}
              taxModel={taxModel.value}
              onExemptionChange$={handleExemptionChange}
              onTaxRateChange$={handleTaxRateChange}
              onTaxModelChange$={handleTaxModelChange}
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
  title: "Standalone Income Range Component",
  meta: [
    {
      name: "description",
      content: "A demonstration of the standalone income range component",
    },
  ],
};
