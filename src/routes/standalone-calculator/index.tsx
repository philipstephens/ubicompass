import { component$ } from "@builder.io/qwik";
import { CspHeader } from "~/components/csp-header";
import { MenuComponent } from "~/components/menu-component";
import { CalculatorBridge } from "~/components/calculator-bridge";

/**
 * This component displays the integrated calculator
 */
export default component$(() => {
  return (
    <div class="bg-gray-200 min-h-screen">
      {/* Header */}
      <div class="header-container">
        <CspHeader
          headerColor="rgba(186, 164, 61, 1)"
          height="h-64"
          title="UBI Calculator - Integrated Version"
          subTitle="with SVG Charts"
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

      {/* Navigation Links */}
      <div class="bg-white shadow-md rounded-lg p-4 mb-4 mx-4">
        <h2 class="text-xl font-bold mb-2">Calculator Versions</h2>
        <div class="flex flex-wrap gap-4">
          <a
            href="/"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Quintile Calculator
          </a>
          <a
            href="/decile-svg"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Decile Calculator with SVG Charts
          </a>
          <a
            href="/standalone-calculator"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
          >
            Integrated Calculator
          </a>
          <a
            href="/simple"
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Simple Version
          </a>
        </div>
      </div>

      {/* Main content */}
      <div class="container mx-auto px-4 py-4">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 class="text-3xl font-bold mb-6">Integrated UBI Calculator</h1>
          <p class="mb-6">
            This integrated calculator combines the Qwik application with
            standalone SVG charts. Changes made in the calculator will be
            synchronized with the main application.
          </p>

          <CalculatorBridge />
        </div>
      </div>
    </div>
  );
});
