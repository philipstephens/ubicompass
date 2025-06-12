import { component$, QRL } from "@builder.io/qwik";
import type { YearMetaData } from "./ubi-calculation-component";
import "./ubi-year-selector.css";

interface UbiYearSelectorProps {
  yearData: YearMetaData[];
  selectedYearId: string;
  onYearChange$: QRL<(event: Event) => void>;
  onRefresh$: QRL<() => void>;
  selectedYear: YearMetaData | null;
}

export const UbiYearSelector = component$<UbiYearSelectorProps>(
  ({ yearData, selectedYearId, onYearChange$, onRefresh$, selectedYear }) => {
    return (
      <div class="ubi-year-selector">
        <div class="form-row">
          <label for="year-select">Year = </label>
          <select
            id="year-select"
            value={selectedYearId}
            onChange$={onYearChange$}
          >
            {yearData.map((year) => {
              const optionText = `${year.taxyear} | $${year.ubiamount.toLocaleString()} | ${year.flattaxpercentage}%`;
              return (
                <option key={year.ubiid.toString()} value={year.ubiid.toString()}>
                  {optionText}
                </option>
              );
            })}
            <option value="new">New Entry</option>
          </select>

          <button
            type="button"
            class="refresh-button"
            onClick$={onRefresh$}
            title="Refresh data"
          >
            ↻
          </button>

          {selectedYear && (
            <div class="taxpayers-info">
              N = {(selectedYear.taxpayersperquintile * 1000).toLocaleString()}{" "}
              ({(selectedYear.taxpayersperquintile * 5 * 1000).toLocaleString()}{" "}
              Total)
            </div>
          )}
        </div>
      </div>
    );
  }
);
