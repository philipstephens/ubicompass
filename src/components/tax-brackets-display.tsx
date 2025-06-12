import { component$, PropFunction, useSignal } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * Component for displaying tax brackets
 */
export const TaxBracketsDisplay = component$(
  ({
    brackets,
    isExpanded,
    onToggle$,
  }: {
    brackets: Array<{
      rate: number;
      minIncome: number;
      maxIncome?: number;
      description: string;
    }>;
    isExpanded: boolean;
    onToggle$: PropFunction<() => void>;
  }) => {
    return (
      <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
        <div
          class="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center cursor-pointer"
          onClick$={onToggle$}
        >
          <h4 class="font-bold text-blue-700 text-lg">
            <TranslatableText text="Tax Bracket Structure" />
          </h4>
          <button class="text-blue-500 hover:text-blue-700 focus:outline-none">
            {isExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {isExpanded && (
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                      <TranslatableText text="Income Range" />
                    </th>
                    <th class="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">
                      <TranslatableText text="Tax Rate" />
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  {Array.isArray(brackets) && brackets.length > 0 ? (
                    brackets.map((bracket, index) => (
                      <tr
                        key={index}
                        class="hover:bg-gray-50 transition duration-150"
                      >
                        <td class="py-4 px-4 text-left font-medium">
                          {bracket.maxIncome
                            ? `$${bracket.minIncome}k - $${bracket.maxIncome}k`
                            : `$${bracket.minIncome}k+`}
                          <div class="text-xs text-gray-500 mt-1">
                            <TranslatableText text={bracket.description} />
                          </div>
                        </td>
                        <td class="py-4 px-4 text-right">
                          <span class="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full">
                            {bracket.rate}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        class="py-4 px-4 text-center text-gray-500"
                      >
                        <TranslatableText text="No tax brackets available" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
);
