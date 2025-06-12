import { component$, useContext } from "@builder.io/qwik";
import { UbiDataContext } from "../stores/ubi-data-store";
import { TranslatableText } from "./translatable-text";
import "./dropdown-icon.css";

/**
 * Component for selecting a year
 */
export const YearSelector = component$(() => {
  // Get the UBI data store
  const ubiStore = useContext(UbiDataContext);

  return (
    <div class="relative">
      <select
        id="year"
        class="block w-full pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
        onChange$={(event) => {
          const year = parseInt(event.target.value, 10);
          const selectedYear = ubiStore.yearData.find(
            (y) => y.taxyear === year
          );
          if (selectedYear) {
            ubiStore.selectedYear = selectedYear;
          }
        }}
      >
        {Array.from({ length: 24 }, (_, i) => 2000 + i).map((year) => (
          <option
            key={year}
            value={year}
            selected={ubiStore.selectedYear?.taxyear === year}
          >
            {year}
          </option>
        ))}
      </select>
      <div class="dropdown-icon-container text-gray-700">
        <svg
          class="dropdown-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
});
