import { component$, useSignal, $ } from "@builder.io/qwik";
import { T } from "~/contexts/translation-context";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange$: (year: number) => void;
  className?: string;
}

export const YearSelector = component$<YearSelectorProps>((props) => {
  const isOpen = useSignal(false);

  // Generate year options (2000 to current year - 2)
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 2; // As per requirements
  const years = Array.from(
    { length: maxYear - 2000 + 1 },
    (_, i) => 2000 + i
  ).reverse();

  const toggleDropdown = $(() => {
    isOpen.value = !isOpen.value;
  });

  const selectYear = $((year: number) => {
    props.onYearChange$(year);
    isOpen.value = false;
  });

  return (
    <div class={`year-selector ${props.className || ""}`}>
      <style>{`
        .year-selector {
          position: relative;
          display: inline-block;
        }
        
        .year-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background-color: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 9999px;
          color: white;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
          min-width: 100px;
          justify-content: space-between;
        }
        
        .year-button:hover {
          background-color: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.4);
        }
        
        .year-button.open {
          background-color: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.4);
        }
        
        .year-text {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .year-arrow {
          transition: transform 0.2s;
          font-size: 0.75rem;
        }
        
        .year-arrow.open {
          transform: rotate(180deg);
        }
        
        .year-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          z-index: 50;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .year-option {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: left;
          color: #374151;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }
        
        .year-option:hover {
          background-color: #f3f4f6;
        }
        
        .year-option.selected {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          position: relative;
        }

        .year-option.selected::after {
          content: '✓';
          position: absolute;
          right: 1rem;
          color: #ffffff;
          font-weight: bold;
        }
        
        .year-option:first-child {
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .year-option:last-child {
          border-radius: 0 0 0.5rem 0.5rem;
        }
        
        /* Scrollbar styling */
        .year-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        
        .year-dropdown::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .year-dropdown::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .year-dropdown::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <button
        class={`year-button ${isOpen.value ? "open" : ""}`}
        onClick$={toggleDropdown}
      >
        <span class="year-text">📅 {props.selectedYear}</span>
        <span class={`year-arrow ${isOpen.value ? "open" : ""}`}>▼</span>
      </button>

      {isOpen.value && (
        <div class="year-dropdown">
          {years.map((year) => {
            const isSelected = year === props.selectedYear;
            return (
              <button
                key={year}
                class={`year-option ${isSelected ? "selected" : ""}`}
                onClick$={() => selectYear(year)}
                title={
                  isSelected
                    ? `Currently selected: ${year}`
                    : `Select year ${year}`
                }
              >
                {year}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});
