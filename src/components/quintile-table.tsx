import { component$, PropFunction } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * A simple table component to display quintile data
 */
export const QuintileTable = component$(
  ({
    taxEntries,
    calculateIncomeWithUBI,
  }: {
    taxEntries: any[];
    calculateIncomeWithUBI: PropFunction<(entry: any) => number>;
  }) => {
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
          <TranslatableText text="Income Comparison by Quintile" />
        </h3>

        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-2 px-4 border-b border-gray-200 text-left">
                  <TranslatableText text="Quintile" />
                </th>
                <th class="py-2 px-4 border-b border-gray-200 text-left">
                  <TranslatableText text="Description" />
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

                let descriptionKey = "";
                switch (entry.quintile) {
                  case 1:
                    descriptionKey = "Lowest 20%";
                    break;
                  case 2:
                    descriptionKey = "Lower-middle 20%";
                    break;
                  case 3:
                    descriptionKey = "Middle 20%";
                    break;
                  case 4:
                    descriptionKey = "Upper-middle 20%";
                    break;
                  case 5:
                    descriptionKey = "Highest 20%";
                    break;
                  default:
                    descriptionKey = "";
                }

                return (
                  <tr key={entry.quintile} class="hover:bg-gray-50">
                    <td class="py-2 px-4 border-b border-gray-200">
                      <span class="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full text-sm">
                        Q{entry.quintile}
                      </span>
                    </td>
                    <td class="py-2 px-4 border-b border-gray-200">
                      <TranslatableText text={descriptionKey} />
                    </td>
                    <td class="py-2 px-4 border-b border-gray-200">
                      <div class="flex items-center">
                        <div class="w-24 text-right font-medium mr-2">
                          ${avgIncome}k
                        </div>
                        <div
                          class="h-6 bg-blue-500 rounded"
                          style={{ width: `${avgIncome * 2}px` }}
                        ></div>
                      </div>
                    </td>
                    <td class="py-2 px-4 border-b border-gray-200">
                      <div class="flex items-center">
                        <div class="w-24 text-right font-medium mr-2">
                          ${incomeWithUBI}k
                        </div>
                        <div
                          class="h-6 bg-green-500 rounded"
                          style={{ width: `${incomeWithUBI * 2}px` }}
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
            *{" "}
            <TranslatableText text="All values are in thousands of dollars." />
          </p>
          <p class="mt-2">
            <TranslatableText text="Each quintile represents exactly 20% of the taxpayer population. Quintiles divide the population into five equal groups based on income level, from lowest (Q1) to highest (Q5)." />
          </p>
        </div>
      </div>
    );
  }
);
