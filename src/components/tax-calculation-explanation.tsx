import { component$ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";
import { TaxModel } from "../models/tax-model.interface";

/**
 * Component for displaying tax calculation explanation
 */
export const TaxCalculationExplanation = component$(
  ({
    taxModel,
    modelId,
    exampleTaxAmount,
  }: {
    taxModel: TaxModel | null;
    modelId: number;
    exampleTaxAmount: number;
  }) => {
    return (
      <div>
        <div class="h-full">
          <div
            class="text-blue-800 mb-2"
            style={{ fontSize: "1.1rem", fontWeight: 800 }}
          >
            <strong>
              <TranslatableText text={`${taxModel?.name || "Tax"} Model`} />
            </strong>
          </div>

          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="mr-1.5">1.</span>
              <span>
                <TranslatableText text="First $24,000 of income is exempt from taxation" />
              </span>
            </li>
            <li class="flex items-start">
              <span class="mr-1.5">2.</span>
              <span>
                {modelId === 1 && (
                  <TranslatableText text="All income above exemption amount is taxed at flat rate" />
                )}
                {modelId === 2 && (
                  <TranslatableText text="Income above exemption is taxed using progressive brackets" />
                )}
                {modelId === 3 && (
                  <TranslatableText text="Income is taxed based on a bell curve distribution with highest rates near 90th percentile" />
                )}
                {modelId === 4 && (
                  <TranslatableText text="Income is taxed so that tax burden percentile matches income percentile" />
                )}
              </span>
            </li>
            <li class="flex items-start">
              <span class="mr-1.5">3.</span>
              <span>
                <TranslatableText text="UBI payments are added to income before taxation" />
              </span>
            </li>
          </ul>
          <div style={{ height: "1rem" }}></div>

          <div class="mt-4 bg-white p-3 rounded border border-blue-100 text-sm">
            <div
              class="text-blue-800 mb-1"
              style={{ fontSize: "1.1rem", fontWeight: 800 }}
            >
              <strong>
                <TranslatableText text="Example:" />
              </strong>
            </div>
            <div class="text-gray-700">
              <TranslatableText text="For income of $50,000 with UBI of $24,000/year:" />
              <div class="mt-2 pl-4 border-l-2 border-blue-200">
                <div>
                  <span class="font-medium">
                    <TranslatableText text="Total Income:" />
                  </span>{" "}
                  $74,000 ($50,000 + $24,000 UBI)
                </div>
                <div>
                  <span class="font-medium">
                    <TranslatableText text="Exemption:" />
                  </span>{" "}
                  $24,000
                </div>
                <div>
                  <span class="font-medium">
                    <TranslatableText text="Taxable Income:" />
                  </span>{" "}
                  $50,000 ($74,000 - $24,000)
                </div>
                <div>
                  <span class="font-medium">
                    <TranslatableText text="Tax:" />
                  </span>{" "}
                  ${exampleTaxAmount}k (30% of $50k)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
