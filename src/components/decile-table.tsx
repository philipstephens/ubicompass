import { component$, PropFunction } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";
import type { TaxEntry } from "../models/income-data";

/**
 * Component to display income data in a table format by decile
 */
export const DecileTable = component$(
  ({
    taxEntries,
    calculateIncomeWithUBI,
  }: {
    taxEntries: TaxEntry[];
    calculateIncomeWithUBI: PropFunction<(entry: TaxEntry) => number>;
  }) => {
    console.log("DecileTable rendering with entries:", taxEntries);

    // Check if entries have decile property
    const hasDecileProperty =
      taxEntries.length > 0 && "decile" in taxEntries[0];
    console.log("Entries have decile property:", hasDecileProperty);

    // Log the first entry for debugging
    if (taxEntries.length > 0) {
      console.log("First entry:", taxEntries[0]);
    }

    // Check if we have valid data
    if (!taxEntries || taxEntries.length === 0) {
      return (
        <div class="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 text-center">
          <div class="text-yellow-800 mb-2 font-medium">
            <TranslatableText text="No data available to display" />
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3 class="text-lg font-medium mb-4">
          <TranslatableText text="Income Comparison by Decile" />
        </h3>

        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-2 px-4 border-b border-gray-200 text-left">
                  <TranslatableText text="Decile" />
                </th>
                <th class="py-2 px-4 border-b border-gray-200 text-left">
                  <TranslatableText text="Income Range" />
                </th>
                <th class="py-2 px-4 border-b border-gray-200 text-right">
                  <TranslatableText text="Average Taxable Income" />
                </th>
                <th class="py-2 px-4 border-b border-gray-200 text-right">
                  <TranslatableText text="Income with UBI" />
                </th>
              </tr>
            </thead>
            <tbody>
              {taxEntries.map((entry) => {
                const avgIncome = entry.averagetaxableincome || 0;
                const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;

                // Check if entry has decile property
                const decile = "decile" in entry ? (entry as any).decile : 0;

                // Format income range
                const lowerBound =
                  "lowerBound" in entry ? (entry as any).lowerBound : 0;
                const upperBound =
                  "upperBound" in entry ? (entry as any).upperBound : 0;
                const incomeRange = `$${lowerBound}k - $${upperBound}k`;

                // Get description based on decile
                let descriptionKey = "";
                switch (decile) {
                  case 1:
                    descriptionKey = "Lowest 10%";
                    break;
                  case 2:
                    descriptionKey = "10-20%";
                    break;
                  case 3:
                    descriptionKey = "20-30%";
                    break;
                  case 4:
                    descriptionKey = "30-40%";
                    break;
                  case 5:
                    descriptionKey = "40-50%";
                    break;
                  case 6:
                    descriptionKey = "50-60%";
                    break;
                  case 7:
                    descriptionKey = "60-70%";
                    break;
                  case 8:
                    descriptionKey = "70-80%";
                    break;
                  case 9:
                    descriptionKey = "80-90%";
                    break;
                  case 10:
                    descriptionKey = "Highest 10%";
                    break;
                  default:
                    descriptionKey = "";
                    break;
                }

                return (
                  <tr key={decile || entry.entryid} class="hover:bg-gray-50">
                    <td class="py-2 px-4 border-b border-gray-200">
                      <span class="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full text-sm">
                        D{decile}
                      </span>
                    </td>
                    <td class="py-2 px-4 border-b border-gray-200">
                      <TranslatableText text={descriptionKey} />
                      <span class="text-gray-500 text-sm ml-2">
                        ({incomeRange})
                      </span>
                    </td>
                    <td class="py-2 px-4 border-b border-gray-200 text-right">
                      <div class="flex items-center justify-end">
                        <div class="w-24 text-right font-medium mr-2">
                          ${avgIncome}k
                        </div>
                        <div
                          class="h-6 bg-blue-500 rounded"
                          style={{ width: `${Math.min(avgIncome, 150)}px` }}
                        ></div>
                      </div>
                    </td>
                    <td class="py-2 px-4 border-b border-gray-200 text-right">
                      <div class="flex items-center justify-end">
                        <div class="w-24 text-right font-medium mr-2">
                          ${incomeWithUBI}k
                        </div>
                        <div
                          class="h-6 bg-green-500 rounded"
                          style={{ width: `${Math.min(incomeWithUBI, 150)}px` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div class="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p>
            <TranslatableText text="* All values are in thousands of dollars." />
          </p>
          <p class="mt-2">
            <TranslatableText text="Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10)." />
          </p>
        </div>
      </div>
    );
  }
);
