import { component$, useComputed$ } from "@builder.io/qwik";
import type { TaxEntry, YearMetaData } from "./ubi-calculation-component";
import type { TaxationModelData } from "../models/taxation";
import { calculateTax } from "../utils/tax-calculations";
import { UbiCalculationSummary } from "./ubi-calculation-summary";
import "./ubi-calculation-table.css";

interface UbiCalculationTableProps {
  taxEntries: TaxEntry[];
  selectedYear: YearMetaData;
  taxationModelData: TaxationModelData | null;
}

export const UbiCalculationTable = component$<UbiCalculationTableProps>(
  ({ taxEntries, selectedYear, taxationModelData }) => {
    // Pre-compute values that are used multiple times
    const yearlyUbiInThousands = useComputed$(
      () => (selectedYear.ubiamount * 12) / 1000
    );

    const exemptionAmount = useComputed$(() =>
      taxationModelData?.parameters.exemption_amount
        ? taxationModelData.parameters.exemption_amount / 1000
        : 24
    );

    const totalTaxRevenueWithoutUbi = useComputed$(() =>
      taxEntries.reduce(
        (sum, entry) =>
          sum + entry.mediantax * selectedYear.taxpayersperquintile,
        0
      )
    );

    // Calculate income with UBI for each quintile
    const incomesWithUbi = useComputed$(() =>
      taxEntries.map((entry) => ({
        quintile: entry.quintile,
        income: entry.averagetaxableincome + yearlyUbiInThousands.value,
      }))
    );

    // Calculate taxable income for each quintile
    const taxableIncomes = useComputed$(() =>
      incomesWithUbi.value.map((item) => ({
        quintile: item.quintile,
        taxableIncome: Math.max(0, item.income - exemptionAmount.value),
      }))
    );

    // Calculate tax with UBI for each quintile
    const taxesWithUbi = useComputed$(() =>
      incomesWithUbi.value.map((item) => ({
        quintile: item.quintile,
        tax: calculateTax(
          item.income,
          taxationModelData,
          selectedYear.flattaxpercentage
        ),
      }))
    );

    // Calculate tax revenue with UBI for each quintile
    const taxRevenuesWithUbi = useComputed$(() =>
      taxesWithUbi.value.map((item) => ({
        quintile: item.quintile,
        revenue: item.tax * selectedYear.taxpayersperquintile,
      }))
    );

    // Calculate total tax revenue with UBI
    const totalTaxRevenueWithUbi = useComputed$(() =>
      taxRevenuesWithUbi.value.reduce((sum, item) => sum + item.revenue, 0)
    );

    return (
      <table class="calculation-table">
        <thead>
          <tr class="table-header">
            <th class="description-col">Description</th>
            <th>Q1</th>
            <th>Q2</th>
            <th>Q3</th>
            <th>Q4</th>
            <th>Q5</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Average Taxable Income */}
          <tr>
            <td class="description-col">Average Taxable Income: T</td>
            {taxEntries.map((entry) => (
              <td key={`income-${entry.quintile}`}>
                ${entry.averagetaxableincome.toLocaleString()}
              </td>
            ))}
            <td>-</td>
          </tr>

          {/* Median Tax */}
          <tr>
            <td class="description-col">Median Tax: M</td>
            {taxEntries.map((entry) => (
              <td key={`tax-${entry.quintile}`}>
                $
                {entry.mediantax.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
            ))}
            <td>-</td>
          </tr>

          {/* Tax Revenue */}
          <tr>
            <td class="description-col">Tax Revenue: M * N</td>
            {taxEntries.map((entry) => {
              const revenue =
                entry.mediantax * selectedYear.taxpayersperquintile;
              return (
                <td key={`revenue-${entry.quintile}`}>
                  $
                  {revenue.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </td>
              );
            })}
            <td>
              $
              {totalTaxRevenueWithoutUbi.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>

          {/* Income with UBI */}
          <tr>
            <td class="description-col">Income with UBI: U</td>
            {incomesWithUbi.value.map((item) => (
              <td key={`ubi-income-${item.quintile}`}>
                ${Math.round(item.income).toLocaleString()}
              </td>
            ))}
            <td>
              $
              {Math.round(
                taxEntries.reduce(
                  (sum, entry) => sum + entry.averagetaxableincome,
                  0
                ) /
                  5 +
                  yearlyUbiInThousands.value
              ).toLocaleString()}
            </td>
          </tr>

          {/* Exemption Amount */}
          <tr>
            <td class="description-col">Exemption Amount</td>
            {taxEntries.map((entry) => (
              <td key={`exemption-${entry.quintile}`}>
                ${Math.round(exemptionAmount.value)}
              </td>
            ))}
            <td>${Math.round(exemptionAmount.value)}</td>
          </tr>

          {/* Taxable Income (Income with UBI - Exemption) */}
          <tr>
            <td class="description-col">Taxable Income (U - Exemption)</td>
            {taxableIncomes.value.map((item) => (
              <td key={`taxable-income-${item.quintile}`}>
                ${Math.round(item.taxableIncome).toLocaleString()}
              </td>
            ))}
            <td>
              $
              {Math.round(
                Math.max(
                  0,
                  taxEntries.reduce(
                    (sum, entry) => sum + entry.averagetaxableincome,
                    0
                  ) /
                    5 +
                    yearlyUbiInThousands.value -
                    exemptionAmount.value
                )
              ).toLocaleString()}
            </td>
          </tr>

          {/* Tax Revenue with UBI */}
          <tr>
            <td class="description-col">
              Tax Revenue with UBI ({taxationModelData?.model.model_name}):
            </td>
            {taxRevenuesWithUbi.value.map((item) => (
              <td key={`ubi-revenue-${item.quintile}`}>
                $
                {item.revenue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
            ))}
            <td>
              $
              {totalTaxRevenueWithUbi.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>

          {/* UBI Calculation Summary */}
          <tr>
            <td colSpan={7}>
              <UbiCalculationSummary
                taxEntries={taxEntries}
                selectedYear={selectedYear}
                taxationModelData={taxationModelData}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
);
