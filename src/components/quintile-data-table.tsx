import { component$, PropFunction } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * Component for displaying quintile data table
 */
export const QuintileDataTable = component$(
  ({
    taxEntries,
    calculateTaxRevenue,
    calculateTaxRevenueWithUBI,
    calculateMedianTaxWithUBI,
    calculateUBICost,
    calculateIncomeWithUBI,
    flatTaxPercentage = 30, // Default to 30% if not provided
    ubiAmount = 24, // Default to $24k if not provided
    exemptionAmount = 24, // Default to $24k if not provided
  }: {
    taxEntries: any[];
    calculateTaxRevenue: PropFunction<(entry: any) => number>;
    calculateTaxRevenueWithUBI: PropFunction<(entry: any) => number>;
    calculateMedianTaxWithUBI: PropFunction<(entry: any) => number>;
    calculateUBICost: PropFunction<(entry: any) => number>;
    calculateIncomeWithUBI: PropFunction<(entry: any) => number>;
    flatTaxPercentage?: number; // Add flat tax percentage
    ubiAmount?: number; // Add UBI amount
    exemptionAmount?: number; // Add exemption amount
  }) => {
    return (
      <div>
        <div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="py-3 px-4 text-left font-medium">
                    <TranslatableText text="Quintile (20% of Population)" />
                  </th>
                  <th class="py-3 px-4 text-right font-medium">
                    <TranslatableText text="Average Taxable Income" />
                  </th>
                  <th class="py-3 px-4 text-right font-medium">
                    <TranslatableText text="Median Tax" />
                  </th>
                  <th class="py-3 px-4 text-right font-medium">
                    <TranslatableText text="Tax Revenue" />
                  </th>
                  <th class="py-3 px-4 text-right font-medium">
                    <TranslatableText text="Income with UBI" />
                  </th>
                  <th class="py-3 px-4 text-right font-medium">
                    <TranslatableText text="Tax Revenue with UBI" />
                  </th>
                  <th class="py-3 px-4 text-right font-medium">
                    <TranslatableText text="Cost of UBI" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {taxEntries.map((entry) => (
                  <tr key={entry.quintile} class="hover:bg-gray-50">
                    <td class="py-4 px-4 text-left">
                      <div>
                        <span class="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm">
                          Q{entry.quintile}
                        </span>
                        <div class="mt-1 text-xs text-gray-500">
                          {entry.quintile === 1 && (
                            <TranslatableText text="Lowest 20% (0-20th percentile)" />
                          )}
                          {entry.quintile === 2 && (
                            <TranslatableText text="Lower-middle 20% (20-40th percentile)" />
                          )}
                          {entry.quintile === 3 && (
                            <TranslatableText text="Middle 20% (40-60th percentile)" />
                          )}
                          {entry.quintile === 4 && (
                            <TranslatableText text="Upper-middle 20% (60-80th percentile)" />
                          )}
                          {entry.quintile === 5 && (
                            <TranslatableText text="Highest 20% (80-100th percentile)" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-right">
                      ${entry.averagetaxableincome}k
                    </td>
                    <td class="py-4 px-4 text-right">${entry.mediantax}k</td>
                    <td class="py-4 px-4 text-right">
                      ${calculateTaxRevenue(entry)}k
                    </td>
                    <td class="py-4 px-4 text-right">
                      <span class="text-green-600 font-medium">
                        ${calculateIncomeWithUBI(entry)}k
                      </span>
                    </td>
                    <td class="py-4 px-4 text-right">
                      ${calculateTaxRevenueWithUBI(entry)}k
                    </td>
                    <td class="py-4 px-4 text-right">
                      <span class="text-red-600 font-medium">
                        $
                        {(() => {
                          // Calculate UBI cost directly
                          const taxpayers = 6140; // taxpayers per quintile in thousands
                          const income = entry.averagetaxableincome;
                          const taxRate = flatTaxPercentage / 100;
                          // Use the exemption amount passed from the parent component

                          // UBI payment to this quintile
                          const ubiPayment = ubiAmount * taxpayers;

                          // Tax revenue without UBI
                          const revenueWithoutUBI =
                            income * taxRate * taxpayers;

                          // Tax revenue with UBI
                          const taxableIncomeWithUBI = Math.max(
                            0,
                            income + ubiAmount - exemptionAmount
                          );
                          const revenueWithUBI =
                            taxableIncomeWithUBI * taxRate * taxpayers;

                          // Additional tax revenue due to UBI
                          const additionalRevenue =
                            revenueWithUBI - revenueWithoutUBI;

                          // Net cost = UBI payments - additional tax revenue
                          const cost = ubiPayment - additionalRevenue;

                          // Return the result rounded to one decimal place
                          return Math.round(cost * 10) / 10;
                        })()}
                        k
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr class="bg-gray-100 font-medium border-t-2 border-gray-300">
                  <td class="py-4 px-4 text-left">
                    <div class="font-bold text-gray-800">
                      <TranslatableText text="TOTALS" />
                    </div>
                  </td>
                  <td class="py-4 px-4 text-right">
                    {/* No total for Average Taxable Income */}
                  </td>
                  <td class="py-4 px-4 text-right">
                    {/* No total for Median Tax */}
                  </td>
                  <td class="py-4 px-4 text-right font-bold">
                    {/* Calculate total Tax Revenue */}$
                    {(() => {
                      // Get taxpayers per quintile (approximately 6.14 million)
                      const taxpayersPerQuintile = 6140; // In thousands

                      // Calculate total tax revenue across all quintiles
                      const totalRevenue = taxEntries.reduce((sum, entry) => {
                        const taxRate = flatTaxPercentage / 100; // Convert percentage to decimal
                        // Multiply by taxpayers per quintile to get the total for this quintile
                        return (
                          sum +
                          entry.averagetaxableincome *
                            taxRate *
                            taxpayersPerQuintile
                        );
                      }, 0);

                      // Format as billions with one decimal place
                      return (totalRevenue / 1000).toFixed(1);
                    })()}
                    B
                  </td>
                  <td class="py-4 px-4 text-right">
                    {/* No total for Income with UBI */}
                  </td>
                  <td class="py-4 px-4 text-right font-bold">
                    {/* Calculate total Tax Revenue with UBI */}$
                    {(() => {
                      // Get taxpayers per quintile (approximately 6.14 million)
                      const taxpayersPerQuintile = 6140; // In thousands

                      // Calculate total tax revenue with UBI across all quintiles
                      const totalRevenue = taxEntries.reduce((sum, entry) => {
                        const taxRate = flatTaxPercentage / 100; // Convert percentage to decimal

                        // Calculate taxable income with UBI, accounting for exemption
                        const taxableIncomeWithUBI = Math.max(
                          0,
                          entry.averagetaxableincome +
                            ubiAmount -
                            exemptionAmount
                        );

                        // Multiply by taxpayers per quintile to get the total for this quintile
                        return (
                          sum +
                          taxableIncomeWithUBI * taxRate * taxpayersPerQuintile
                        );
                      }, 0);

                      // Format as billions with one decimal place
                      return (totalRevenue / 1000).toFixed(1);
                    })()}
                    B
                  </td>
                  <td class="py-4 px-4 text-right font-bold text-red-600">
                    {/* Calculate total Cost of UBI */}$
                    {(() => {
                      // Get taxpayers per quintile (approximately 6.14 million)
                      const taxpayersPerQuintile = 6140; // In thousands

                      // Calculate total UBI cost across all quintiles
                      const totalCost = taxEntries.reduce((sum, entry) => {
                        const taxRate = flatTaxPercentage / 100; // Convert percentage to decimal
                        // Use the UBI amount passed from the parent component
                        // This ensures it matches the current selection in the UI

                        // UBI payment to each person in this quintile
                        const ubiPayment = ubiAmount * taxpayersPerQuintile;

                        // Calculate tax revenue without UBI
                        const revenueWithoutUBI =
                          entry.averagetaxableincome *
                          taxRate *
                          taxpayersPerQuintile;

                        // Calculate tax revenue with UBI
                        const taxableIncomeWithUBI = Math.max(
                          0,
                          entry.averagetaxableincome +
                            ubiAmount -
                            exemptionAmount
                        );
                        const revenueWithUBI =
                          taxableIncomeWithUBI * taxRate * taxpayersPerQuintile;

                        // Additional tax revenue from this quintile due to UBI
                        const additionalTax =
                          revenueWithUBI - revenueWithoutUBI;

                        // Net cost = UBI payments - additional tax revenue
                        return sum + (ubiPayment - additionalTax);
                      }, 0);

                      // Format as billions with one decimal place
                      return (totalCost / 1000).toFixed(1);
                    })()}
                    B
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-gray-50 px-6 py-3 text-sm text-gray-500 italic border-t border-gray-200 mt-4">
            <div class="mb-2">
              *{" "}
              <TranslatableText text="All values are in thousands of dollars." />
            </div>
            <div class="mb-2">
              **{" "}
              <TranslatableText text="Cost of UBI calculation: (UBI payments to quintile) - (Additional tax revenue from quintile)" />
            </div>
            <div class="mt-3 p-2 bg-blue-50 rounded-md text-blue-800 text-xs non-italic">
              <div class="font-medium mb-1">
                <TranslatableText text="About Income Quintiles:" />
              </div>
              <div>
                <TranslatableText text="Each quintile represents exactly 20% of the taxpayer population (6.14 million people per quintile). Quintiles divide the population into five equal groups based on income level, from lowest (Q1) to highest (Q5)." />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
