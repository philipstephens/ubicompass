// @ts-nocheck
import {
  component$,
  useSignal,
  $,
  useStylesScoped$,
  useTask$,
  useVisibleTask$,
  useStore,
} from "@builder.io/qwik";
import { TripleHandleSlider } from "../triple-handle-slider/triple-handle-slider";
import { getPopulationData } from "../../services/statistics-service";
import { T, useTranslationState } from "../../contexts/translation-context";

export interface AgeDistributionControlProps {
  // Age cutoffs
  initialChildAgeCutoff?: number;
  initialYouthAgeCutoff?: number;
  initialSeniorAgeCutoff?: number;

  // Year for population data
  year?: number;

  // Callbacks
  onAgeChange$?: (values: [number, number, number]) => void;
  onPopulationDataChange$?: (populationData: {
    childPopulation: number;
    youthPopulation: number;
    adultPopulation: number;
    seniorPopulation: number;
    totalPopulation: number;
  }) => void;
  onConstraintsChange$?: (constraints: {
    childLocked: boolean;
    youthLocked: boolean;
    adultLocked: boolean;
    seniorLocked: boolean;
  }) => void;

  // Display options
  showPopulationChart?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AgeDistributionControl = component$<AgeDistributionControlProps>(
  (props) => {
    useStylesScoped$(`
    .age-distribution-control {
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .age-distribution-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .age-slider-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .age-chart-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .ubi-age-groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .ubi-age-group {
      background: white;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .ubi-age-group-children {
      border-left: 4px solid #3b82f6;
    }

    .ubi-age-group-youth {
      border-left: 4px solid #10b981;
    }

    .ubi-age-group-adults {
      border-left: 4px solid #f59e0b;
    }

    .ubi-age-group-seniors {
      border-left: 4px solid #8b5cf6;
    }

    .ubi-age-group-label {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .ubi-age-group-range {
      font-size: 0.875rem;
      color: #4b5563;
      margin-bottom: 0.25rem;
    }

    .ubi-age-group-constraint {
      font-size: 0.75rem;
      color: #9ca3af;
      font-style: italic;
    }

    .pie-chart-container {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .pie-chart-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
      text-align: center;
    }

    .pie-chart {
      width: 200px;
      height: 200px;
      margin: 0 auto 1rem;
    }

    /* Smooth transitions to prevent flickering */
    .pie-chart path {
      transition: all 0.3s ease;
    }

    .pie-legend-value {
      transition: all 0.2s ease;
    }

    .pie-legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .pie-legend-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }

    .pie-legend-color {
      width: 1rem;
      height: 1rem;
      border-radius: 0.125rem;
      margin-right: 0.5rem;
    }

    .pie-legend-label {
      font-size: 0.875rem;
      color: #374151;
    }

    .pie-legend-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
    }

    .lock-icon {
      cursor: pointer;
      font-size: 0.875rem;
      margin-right: 0.5rem;
      transition: all 0.2s ease;
      user-select: none;
    }

    .lock-icon.ghosted {
      opacity: 0.3;
      color: #9ca3af;
    }

    .lock-icon.active {
      opacity: 1;
      color: #dc2626;
    }

    .lock-icon:hover {
      opacity: 0.7;
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .age-distribution-content {
        grid-template-columns: 1fr;
      }
    }
  `);

    const {
      initialChildAgeCutoff = 12,
      initialYouthAgeCutoff = 21,
      initialSeniorAgeCutoff = 55,
      year = 2022,
      onAgeChange$,
      onPopulationDataChange$,
      onConstraintsChange$,
      showPopulationChart = true,
      disabled = false,
      className = "",
    } = props;

    // Translation state
    const translationState = useTranslationState();

    // Helper function to translate text
    const t = (text: string): string => {
      return translationState.translations[text] || text;
    };

    // Age cutoff signals
    const childAgeCutoff = useSignal(initialChildAgeCutoff);
    const youthAgeCutoff = useSignal(initialYouthAgeCutoff);
    const seniorAgeCutoff = useSignal(initialSeniorAgeCutoff);

    // Function to calculate population distribution from age array
    const calculatePopulationFromAgeArray = $(
      (
        populationByAge: number[],
        childMax: number,
        youthMax: number,
        seniorMin: number
      ) => {
        if (!populationByAge || populationByAge.length === 0) {
          return {
            childPopulation: 0,
            youthPopulation: 0,
            adultPopulation: 0,
            seniorPopulation: 0,
            totalPopulation: 0,
          };
        }

        let childPop = 0;
        let youthPop = 0;
        let adultPop = 0;
        let seniorPop = 0;

        // Sum population by age ranges (ages 1-100, array is 0-indexed)
        for (let age = 1; age <= 100; age++) {
          const population = populationByAge[age - 1] || 0;

          if (age <= childMax) {
            childPop += population;
          } else if (age <= youthMax) {
            youthPop += population;
          } else if (age >= seniorMin) {
            seniorPop += population;
          } else {
            adultPop += population;
          }
        }

        const totalPop = childPop + youthPop + adultPop + seniorPop;

        return {
          childPopulation: childPop,
          youthPopulation: youthPop,
          adultPopulation: adultPop,
          seniorPopulation: seniorPop,
          totalPopulation: totalPop,
        };
      }
    );

    // Lock constraint signals
    const childLocked = useSignal(false);
    const youthLocked = useSignal(false);
    const adultLocked = useSignal(false);
    const seniorLocked = useSignal(false);

    // Removed computed values - using direct approach for debugging

    // Watch for prop changes and update internal signals
    useTask$(({ track }) => {
      track(() => initialChildAgeCutoff);
      track(() => initialYouthAgeCutoff);
      track(() => initialSeniorAgeCutoff);

      console.log(
        "🔄 Props useTask$ triggered - checking if props actually changed"
      );
      console.log("📊 Current signals:", {
        childAgeCutoff: childAgeCutoff.value,
        youthAgeCutoff: youthAgeCutoff.value,
        seniorAgeCutoff: seniorAgeCutoff.value,
      });
      console.log("📊 New props:", {
        initialChildAgeCutoff,
        initialYouthAgeCutoff,
        initialSeniorAgeCutoff,
      });

      // Only update if props actually changed to avoid overriding slider changes
      if (
        childAgeCutoff.value !== initialChildAgeCutoff ||
        youthAgeCutoff.value !== initialYouthAgeCutoff ||
        seniorAgeCutoff.value !== initialSeniorAgeCutoff
      ) {
        console.log("📊 Props actually changed, updating signals");
        childAgeCutoff.value = initialChildAgeCutoff;
        youthAgeCutoff.value = initialYouthAgeCutoff;
        seniorAgeCutoff.value = initialSeniorAgeCutoff;
      } else {
        console.log("📊 Props unchanged, skipping update");
      }
    });

    // Population data store
    const populationStore = useStore({
      childPopulation: 0,
      youthPopulation: 0,
      adultPopulation: 0,
      seniorPopulation: 0,
      totalPopulation: 0,
      isLoading: true,
      error: null as string | null,
      // Store population by age array (ages 1-100)
      populationByAge: [] as number[],
      currentYear: -1, // Track which year's data we have loaded
    });

    // Load population by age array only when year changes
    useVisibleTask$(async ({ track }) => {
      track(() => year);

      // Only reload if year has changed
      if (populationStore.currentYear === year) {
        return;
      }

      try {
        populationStore.isLoading = true;
        populationStore.error = null;

        console.log(`📊 Loading population by age array for year ${year}`);

        // For now, use fallback population by age data
        // In the future, this could call a server function that returns the age array
        const fallbackPopulationByAge = [
          // Ages 1-10
          355000, 365000, 377000, 390000, 402000, 407000, 410000, 417000, 419000, 421000,
          // Ages 11-20
          429000, 431000, 429000, 416000, 405000, 398000, 392000, 387000, 383000, 380000,
          // Ages 21-30
          378000, 376000, 375000, 374000, 373000, 372000, 371000, 370000, 369000, 368000,
          // Ages 31-40
          367000, 366000, 365000, 364000, 363000, 362000, 361000, 360000, 359000, 358000,
          // Ages 41-50
          357000, 356000, 355000, 354000, 353000, 352000, 351000, 350000, 349000, 348000,
          // Ages 51-60
          347000, 346000, 345000, 344000, 343000, 342000, 341000, 340000, 339000, 338000,
          // Ages 61-70
          337000, 336000, 335000, 334000, 333000, 332000, 331000, 330000, 329000, 328000,
          // Ages 71-80
          327000, 326000, 325000, 324000, 323000, 322000, 321000, 320000, 319000, 318000,
          // Ages 81-90
          317000, 316000, 315000, 314000, 313000, 312000, 311000, 310000, 309000, 308000,
          // Ages 91-100
          307000, 306000, 305000, 304000, 303000, 302000, 301000, 300000, 299000, 298000
        ];

        populationStore.populationByAge = fallbackPopulationByAge;
        populationStore.currentYear = year;
        populationStore.isLoading = false;

        console.log(`✅ Loaded population array with ${fallbackPopulationByAge.length} age groups`);

      } catch (error) {

        // Initial calculation with current age cutoffs
        const initialDistribution = await calculatePopulationFromAgeArray(
          fallbackPopulationByAge,
          childAgeCutoff.value,
          youthAgeCutoff.value,
          seniorAgeCutoff.value
        );

        populationStore.childPopulation = initialDistribution.childPopulation;
        populationStore.youthPopulation = initialDistribution.youthPopulation;
        populationStore.adultPopulation = initialDistribution.adultPopulation;
        populationStore.seniorPopulation = initialDistribution.seniorPopulation;
        populationStore.totalPopulation = initialDistribution.totalPopulation;
      } catch (error) {
        console.error("Error loading population data:", error);
        populationStore.error = "Failed to load population data";
        populationStore.isLoading = false;

        // Use 2022 real population data as fallback (ages 1-99)
        const populationByAge = [
          355000,
          365000,
          377000,
          390000,
          402000,
          407000,
          410000,
          417000,
          419000,
          421000, // 1-10
          429000,
          431000,
          429000,
          416000,
          407000,
          402000,
          403000,
          396000,
          405000,
          424000, // 11-20
          438000,
          435000,
          447000,
          458000,
          475000,
          479000,
          479000,
          490000,
          499000,
          515000, // 21-30
          516000,
          501000,
          491000,
          496000,
          505000,
          507000,
          502000,
          501000,
          497000,
          498000, // 31-40
          490000,
          477000,
          468000,
          467000,
          465000,
          467000,
          454000,
          455000,
          464000,
          484000, // 41-50
          476000,
          471000,
          466000,
          471000,
          498000,
          532000,
          542000,
          545000,
          530000,
          537000, // 51-60
          525000,
          511000,
          506000,
          492000,
          476000,
          468000,
          445000,
          421000,
          402000,
          391000, // 61-70
          378000,
          366000,
          361000,
          352000,
          288000,
          268000,
          255000,
          237000,
          213000,
          201000, // 71-80
          181000,
          167000,
          153000,
          138000,
          129000,
          115000,
          103000,
          95000,
          84000,
          74000, // 81-90
          61000,
          50000,
          41000,
          33000,
          25000,
          16000,
          12000,
          9000,
          6000, // 91-99+
        ];

        // Calculate population segments based on age cutoffs
        let childPop = 0;
        let youthPop = 0;
        let adultPop = 0;
        let seniorPop = 0;

        populationByAge.forEach((population, index) => {
          const age = index + 1; // ages 1-99

          if (age <= childAgeCutoff.value) {
            childPop += population;
          } else if (age <= youthAgeCutoff.value) {
            youthPop += population;
          } else if (age < seniorAgeCutoff.value) {
            adultPop += population;
          } else {
            seniorPop += population;
          }
        });

        populationStore.childPopulation = childPop;
        populationStore.youthPopulation = youthPop;
        populationStore.adultPopulation = adultPop;
        populationStore.seniorPopulation = seniorPop;
        populationStore.totalPopulation = populationByAge.reduce(
          (sum, pop) => sum + pop,
          0
        );
      }
    });

    // Recalculate population distribution when age cutoffs change (no server calls!)
    useTask$(async ({ track }) => {
      track(() => childAgeCutoff.value);
      track(() => youthAgeCutoff.value);
      track(() => seniorAgeCutoff.value);

      // Only recalculate if we have population data loaded
      if (populationStore.populationByAge.length > 0 && !populationStore.isLoading) {
        console.log(`🔄 Recalculating population distribution from cached age array`);

        const distribution = await calculatePopulationFromAgeArray(
          populationStore.populationByAge,
          childAgeCutoff.value,
          youthAgeCutoff.value,
          seniorAgeCutoff.value
        );

        populationStore.childPopulation = distribution.childPopulation;
        populationStore.youthPopulation = distribution.youthPopulation;
        populationStore.adultPopulation = distribution.adultPopulation;
        populationStore.seniorPopulation = distribution.seniorPopulation;
        populationStore.totalPopulation = distribution.totalPopulation;

        // Trigger callback with updated population data
        if (onPopulationDataChange$) {
          onPopulationDataChange$({
            childPopulation: distribution.childPopulation,
            youthPopulation: distribution.youthPopulation,
            adultPopulation: distribution.adultPopulation,
            seniorPopulation: distribution.seniorPopulation,
            totalPopulation: distribution.totalPopulation,
          });
        }
      }
    });

    // Handle age cutoff changes from triple slider
    const handleAgeChange = $((values: [number, number, number]) => {
      childAgeCutoff.value = values[0];
      youthAgeCutoff.value = values[1];
      seniorAgeCutoff.value = values[2];

      // Debounce population data updates to reduce flickering
      if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
      }

      debounceTimer.value = setTimeout(() => {
        debouncedChildAge.value = values[0];
        debouncedYouthAge.value = values[1];
        debouncedSeniorAge.value = values[2];
      }, 150) as any; // 150ms debounce

      // Trigger callback immediately for other components
      if (onAgeChange$) {
        onAgeChange$(values);
      }
    });

    // Lock toggle functions
    const toggleChildLock = $(() => {
      childLocked.value = !childLocked.value;
      if (onConstraintsChange$) {
        onConstraintsChange$({
          childLocked: childLocked.value,
          youthLocked: youthLocked.value,
          adultLocked: adultLocked.value,
          seniorLocked: seniorLocked.value,
        });
      }

      // CRITICAL: Sync current age values to global state when locking
      // This ensures the genetic algorithm gets the correct locked age cutoffs
      if (onAgeChange$) {
        console.log("🔄 AGE: SYNCING CURRENT VALUES TO GLOBAL STATE");
        console.log("  Current age cutoffs:", {
          child: childAgeCutoff.value,
          youth: youthAgeCutoff.value,
          senior: seniorAgeCutoff.value,
        });

        onAgeChange$([
          childAgeCutoff.value,
          youthAgeCutoff.value,
          seniorAgeCutoff.value,
        ]);
      }
    });

    const toggleYouthLock = $(() => {
      youthLocked.value = !youthLocked.value;
      if (onConstraintsChange$) {
        onConstraintsChange$({
          childLocked: childLocked.value,
          youthLocked: youthLocked.value,
          adultLocked: adultLocked.value,
          seniorLocked: seniorLocked.value,
        });
      }

      // Sync current age values to global state
      if (onAgeChange$) {
        onAgeChange$([
          childAgeCutoff.value,
          youthAgeCutoff.value,
          seniorAgeCutoff.value,
        ]);
      }
    });

    const toggleAdultLock = $(() => {
      adultLocked.value = !adultLocked.value;
      if (onConstraintsChange$) {
        onConstraintsChange$({
          childLocked: childLocked.value,
          youthLocked: youthLocked.value,
          adultLocked: adultLocked.value,
          seniorLocked: seniorLocked.value,
        });
      }

      // Sync current age values to global state
      if (onAgeChange$) {
        onAgeChange$([
          childAgeCutoff.value,
          youthAgeCutoff.value,
          seniorAgeCutoff.value,
        ]);
      }
    });

    const toggleSeniorLock = $(() => {
      seniorLocked.value = !seniorLocked.value;
      if (onConstraintsChange$) {
        onConstraintsChange$({
          childLocked: childLocked.value,
          youthLocked: youthLocked.value,
          adultLocked: adultLocked.value,
          seniorLocked: seniorLocked.value,
        });
      }

      // Sync current age values to global state
      if (onAgeChange$) {
        onAgeChange$([
          childAgeCutoff.value,
          youthAgeCutoff.value,
          seniorAgeCutoff.value,
        ]);
      }
    });

    // Calculate population pie chart data
    const populationData = [
      {
        label: `👶 ${t("Children")}`,
        value: populationStore.childPopulation,
        percentage:
          populationStore.totalPopulation > 0
            ? (populationStore.childPopulation /
                populationStore.totalPopulation) *
              100
            : 0,
        color: "#3b82f6",
      },
      {
        label: `🧑 ${t("Youth")}`,
        value: populationStore.youthPopulation,
        percentage:
          populationStore.totalPopulation > 0
            ? (populationStore.youthPopulation /
                populationStore.totalPopulation) *
              100
            : 0,
        color: "#10b981",
      },
      {
        label: `👨 ${t("Adults")}`,
        value: populationStore.adultPopulation,
        percentage:
          populationStore.totalPopulation > 0
            ? (populationStore.adultPopulation /
                populationStore.totalPopulation) *
              100
            : 0,
        color: "#f59e0b",
      },
      {
        label: `👴 ${t("Seniors")}`,
        value: populationStore.seniorPopulation,
        percentage:
          populationStore.totalPopulation > 0
            ? (populationStore.seniorPopulation /
                populationStore.totalPopulation) *
              100
            : 0,
        color: "#8b5cf6",
      },
    ];

    return (
      <div class={`age-distribution-control ${className}`.trim()}>
        <div class="age-distribution-content">
          <div class="age-slider-section">
            {/* Triple Handle Slider for age distribution */}
            <div style="margin: 1rem 0 2rem 0;">
              <TripleHandleSlider
                min={0}
                max={100}
                step={1}
                initialValues={[
                  childAgeCutoff.value,
                  youthAgeCutoff.value,
                  seniorAgeCutoff.value,
                ]}
                labels={[t("Child Max"), t("Youth Max"), t("Senior Min")]}
                onValueChange$={handleAgeChange}
                showValues={true}
                handleConstraints={{
                  handle0: { min: 0, max: 12 }, // Children: 0-12
                  handle1: { min: 13, max: 21 }, // Youth: 13-21
                  handle2: { min: 55, max: 100 }, // Seniors: 55-100
                }}
                handleDisabled={{
                  handle0: childLocked.value, // Child lock disables child handle
                  handle1: youthLocked.value || adultLocked.value, // Youth or Adult lock disables youth handle
                  handle2: seniorLocked.value || adultLocked.value, // Senior or Adult lock disables senior handle
                }}
                enforceConstraintGaps={true}
                constraintGap={1}
                strictInequality={true}
                disabled={disabled}
              />
            </div>

            {/* Age group display */}
            <div class="ubi-age-groups">
              <div class="ubi-age-group ubi-age-group-children">
                <div class="ubi-age-group-label">
                  <span
                    class={`lock-icon ${childLocked.value ? "active" : "ghosted"}`}
                    onClick$={toggleChildLock}
                    title={
                      childLocked.value ? "Unlock age group" : "Lock age group"
                    }
                  >
                    {childLocked.value ? "🔒" : "🔓"}
                  </span>
                  👶 <T text="Children" />
                </div>
                <div class="ubi-age-group-range">
                  0-{childAgeCutoff.value} years
                </div>
                <div class="ubi-age-group-constraint">
                  <T text="Constraint" />: 0-12
                </div>
              </div>
              <div class="ubi-age-group ubi-age-group-youth">
                <div class="ubi-age-group-label">
                  <span
                    class={`lock-icon ${youthLocked.value ? "active" : "ghosted"}`}
                    onClick$={toggleYouthLock}
                    title={
                      youthLocked.value ? "Unlock age group" : "Lock age group"
                    }
                  >
                    {youthLocked.value ? "🔒" : "🔓"}
                  </span>
                  🧑 <T text="Youth" />
                </div>
                <div class="ubi-age-group-range">
                  {childAgeCutoff.value + 1}-{youthAgeCutoff.value} years
                </div>
                <div class="ubi-age-group-constraint">
                  <T text="Constraint" />: 13-21
                </div>
              </div>
              <div class="ubi-age-group ubi-age-group-adults">
                <div class="ubi-age-group-label">
                  <span
                    class={`lock-icon ${adultLocked.value ? "active" : "ghosted"}`}
                    onClick$={toggleAdultLock}
                    title={
                      adultLocked.value ? "Unlock age group" : "Lock age group"
                    }
                  >
                    {adultLocked.value ? "🔒" : "🔓"}
                  </span>
                  👨 <T text="Adults" />
                </div>
                <div class="ubi-age-group-range">
                  {youthAgeCutoff.value + 1}-{seniorAgeCutoff.value - 1} years
                </div>
                <div class="ubi-age-group-constraint">
                  <T text="Constraint" />: 22-54
                </div>
              </div>
              <div class="ubi-age-group ubi-age-group-seniors">
                <div class="ubi-age-group-label">
                  <span
                    class={`lock-icon ${seniorLocked.value ? "active" : "ghosted"}`}
                    onClick$={toggleSeniorLock}
                    title={
                      seniorLocked.value ? "Unlock age group" : "Lock age group"
                    }
                  >
                    {seniorLocked.value ? "🔒" : "🔓"}
                  </span>
                  👴 <T text="Seniors" />
                </div>
                <div class="ubi-age-group-range">
                  {seniorAgeCutoff.value}+ years
                </div>
                <div class="ubi-age-group-constraint">
                  <T text="Constraint" />: 55+
                </div>
              </div>
            </div>
          </div>

          {showPopulationChart && (
            <div class="age-chart-section">
              {/* Population Distribution Pie Chart */}
              <div class="pie-chart-container">
                <h3 class="pie-chart-title">
                  <T text="Population Chart" />
                </h3>

                {populationStore.isLoading && (
                  <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <T text="Loading population data..." />
                  </div>
                )}

                {populationStore.error && (
                  <div style="text-align: center; padding: 2rem; color: #dc2626; background: #fef2f2; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <T text="Failed to load population data" />
                    <br />
                    <small>
                      <T text="Using fallback data" />
                    </small>
                  </div>
                )}

                {!populationStore.isLoading && (
                  <>
                    <svg class="pie-chart" viewBox="0 0 200 200">
                      {populationData.map((segment, index) => {
                        const startAngle = populationData
                          .slice(0, index)
                          .reduce(
                            (sum, s) => sum + (s.percentage / 100) * 360,
                            0
                          );
                        const endAngle =
                          startAngle + (segment.percentage / 100) * 360;
                        const largeArcFlag = segment.percentage > 50 ? 1 : 0;

                        const x1 =
                          100 +
                          80 * Math.cos(((startAngle - 90) * Math.PI) / 180);
                        const y1 =
                          100 +
                          80 * Math.sin(((startAngle - 90) * Math.PI) / 180);
                        const x2 =
                          100 +
                          80 * Math.cos(((endAngle - 90) * Math.PI) / 180);
                        const y2 =
                          100 +
                          80 * Math.sin(((endAngle - 90) * Math.PI) / 180);

                        return (
                          <path
                            key={index}
                            d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={segment.color}
                            stroke="white"
                            stroke-width="2"
                          />
                        );
                      })}
                    </svg>
                    <div class="pie-legend">
                      {populationData.map((item, index) => (
                        <div key={index} class="pie-legend-item">
                          <div style="display: flex; align-items: center;">
                            <div
                              class="pie-legend-color"
                              style={`background-color: ${item.color}`}
                            ></div>
                            <span class="pie-legend-label">{item.label}</span>
                          </div>
                          <span class="pie-legend-value">
                            {(item.value / 1000000).toFixed(1)}M (
                            {item.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
