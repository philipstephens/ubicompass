import {
  component$,
  useSignal,
  useTask$,
  $,
  useStylesScoped$,
  useVisibleTask$,
  useComputed$,
} from "@builder.io/qwik";
import { T, useTranslationState } from "../../contexts/translation-context";
import {
  validateUbiForUI,
  UbiAmounts,
  UbiLocks,
} from "../../services/ubi-constraints";

export interface UbiAmountsControlProps {
  // Initial UBI amounts (monthly)
  initialChildUbi?: number;
  initialYouthUbi?: number;
  initialAdultUbi?: number;
  initialSeniorUbi?: number;

  // Population data for pie charts
  childPopulation?: number;
  youthPopulation?: number;
  adultPopulation?: number;
  seniorPopulation?: number;

  // Tax parameters
  initialFlatTaxRate?: number; // percentage (0-100)
  initialTaxExemption?: number; // annual amount

  // Program savings from government spending analysis
  programSavings?: number; // annual amount in dollars
  totalCurrentSpending?: number; // total current social program spending

  // Callbacks
  onUbiAmountsChange$?: (amounts: {
    child: number;
    youth: number;
    adult: number;
    senior: number;
    totalAnnualCost: number;
  }) => void;
  onTaxParametersChange$?: (params: {
    flatTaxRate: number;
    taxExemption: number;
    totalTaxRevenue: number;
  }) => void;
  onUbiConstraintsChange$?: (constraints: {
    childLocked: boolean;
    youthLocked: boolean;
    adultLocked: boolean;
    seniorLocked: boolean;
  }) => void;
  onTaxConstraintsChange$?: (constraints: {
    flatTaxRateLocked: boolean;
    taxExemptionLocked: boolean;
  }) => void;

  // Display options
  showPieCharts?: boolean;
  showTaxControls?: boolean;
  showMonthlyAndAnnual?: boolean;
  disabled?: boolean;
  className?: string;
}

export const UbiAmountsControl = component$<UbiAmountsControlProps>((props) => {
  useStylesScoped$(`
    .ubi-amounts-control {
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .ubi-amounts-header {
      margin-bottom: 2rem;
    }

    .ubi-amounts-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .ubi-amounts-description {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .ubi-amounts-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .ubi-sliders-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .ubi-charts-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .ubi-slider-container {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .ubi-slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .ubi-slider-label {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .ubi-slider-values {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .ubi-slider-monthly {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    .ubi-slider-annual {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .ubi-slider-track {
      position: relative;
      height: 12px;
      background: #f3f4f6;
      border-radius: 6px;
      margin: 1rem 0;
      cursor: pointer;
    }
    
        .ubi-slider-fill {
      position: absolute;
      height: 100%;
      border-radius: 6px;
      transition: width 0.2s ease;
    }

    .ubi-slider-handle {
      position: absolute;
      top: 50%;
      width: 32px;
      height: 32px;
      transform: translate(-50%, -50%);
      background: white;
      border: 3px solid;
      border-radius: 50%;
      cursor: grab;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      background: white;
    }

    .ubi-slider-handle:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }

    .ubi-slider-handle.dragging {
      cursor: grabbing;
      transform: translate(-50%, -50%) scale(1.2);
      z-index: 20;
    }

    .ubi-slider-range {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.5rem;
    }

    /* Age group colors */
    .child-color { 
      background: #3b82f6; 
      border-color: #3b82f6; 
    }
    .youth-color { 
      background: #10b981; 
      border-color: #10b981; 
    }
    .adult-color { 
      background: #f59e0b; 
      border-color: #f59e0b; 
    }
    .senior-color {
      background: #8b5cf6;
      border-color: #8b5cf6;
    }

    /* Lock icon styles */
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

    /* Locked slider styles */
    .ubi-slider-container.locked .ubi-slider-track {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .ubi-slider-container.locked .ubi-slider-handle {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .ubi-slider-container.locked .ubi-slider-fill {
      opacity: 0.6;
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

    .pie-legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .pie-legend-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      border-radius: 0.375rem;
      background: #f9fafb;
    }

    .pie-legend-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    .pie-legend-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .pie-legend-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
    }

    @media (max-width: 768px) {
      .ubi-amounts-content {
        grid-template-columns: 1fr;
      }
    }
  `);

  const {
    initialChildUbi = 200,
    initialYouthUbi = 400,
    initialAdultUbi = 1200,
    initialSeniorUbi = 1500,
    childPopulation = 5000000,
    youthPopulation = 3000000,
    adultPopulation = 15000000,
    seniorPopulation = 7000000,
    initialFlatTaxRate = 30,
    initialTaxExemption = 15000,
    programSavings = 0,
    totalCurrentSpending = 0,
    onUbiAmountsChange$,
    onTaxParametersChange$,
    onUbiConstraintsChange$,
    onTaxConstraintsChange$,
    showPieCharts = true,
    showTaxControls = true,
    showMonthlyAndAnnual = true,
    disabled = false,
    className = "",
  } = props;

  // Translation state
  const translationState = useTranslationState();

  // Helper function to translate text
  const t = (text: string): string => {
    return translationState.translations[text] || text;
  };

  // UBI amount signals
  const childUbi = useSignal(initialChildUbi);
  const youthUbi = useSignal(initialYouthUbi);
  const adultUbi = useSignal(initialAdultUbi);
  const seniorUbi = useSignal(initialSeniorUbi);

  // Lock constraint signals
  const childLocked = useSignal(false);
  const youthLocked = useSignal(false);
  const adultLocked = useSignal(false);
  const seniorLocked = useSignal(false);

  // Tax parameter signals
  const flatTaxRate = useSignal(initialFlatTaxRate);
  const taxExemption = useSignal(initialTaxExemption);

  // Tax parameter lock signals
  const flatTaxRateLocked = useSignal(false);
  const taxExemptionLocked = useSignal(false);

  // Force reactivity for tax rate display using computed value
  const flatTaxRateDisplay = useComputed$(() => flatTaxRate.value);

  // Watch for prop changes and update internal signals
  useTask$(({ track }) => {
    track(() => initialChildUbi);
    track(() => initialYouthUbi);
    track(() => initialAdultUbi);
    track(() => initialSeniorUbi);
    track(() => initialFlatTaxRate);
    track(() => initialTaxExemption);

    // Update signals when props change (e.g., from optimizer)
    childUbi.value = initialChildUbi;
    youthUbi.value = initialYouthUbi;
    adultUbi.value = initialAdultUbi;
    seniorUbi.value = initialSeniorUbi;
    flatTaxRate.value = initialFlatTaxRate;
    taxExemption.value = initialTaxExemption;
  });

  // Dragging state
  const isDragging = useSignal(false);
  const activeSlider = useSignal<string | null>(null);

  // Lock toggle functions
  const toggleLock = $((lockType: "child" | "youth" | "adult" | "senior") => {
    switch (lockType) {
      case "child":
        childLocked.value = !childLocked.value;
        break;
      case "youth":
        youthLocked.value = !youthLocked.value;
        break;
      case "adult":
        adultLocked.value = !adultLocked.value;
        break;
      case "senior":
        seniorLocked.value = !seniorLocked.value;
        break;
    }

    // Debug logging
    console.log("🔒 UBI LOCK TOGGLED:", {
      lockType,
      childLocked: childLocked.value,
      youthLocked: youthLocked.value,
      adultLocked: adultLocked.value,
      seniorLocked: seniorLocked.value,
    });

    // Trigger constraint callback if provided
    if (onUbiConstraintsChange$) {
      console.log("📞 CALLING onUbiConstraintsChange$ callback");
      onUbiConstraintsChange$({
        childLocked: childLocked.value,
        youthLocked: youthLocked.value,
        adultLocked: adultLocked.value,
        seniorLocked: seniorLocked.value,
      });
    } else {
      console.log("❌ NO onUbiConstraintsChange$ callback provided");
    }

    // CRITICAL: Sync current values to global state when locking
    // This ensures the genetic algorithm gets the correct locked values
    if (onUbiAmountsChange$) {
      console.log("🔄 SYNCING CURRENT VALUES TO GLOBAL STATE");
      console.log("  Current slider values:", {
        child: childUbi.value,
        youth: youthUbi.value,
        adult: adultUbi.value,
        senior: seniorUbi.value,
      });

      onUbiAmountsChange$({
        child: childUbi.value,
        youth: youthUbi.value,
        adult: adultUbi.value,
        senior: seniorUbi.value,
        totalAnnualCost:
          childUbi.value * 12 * childPopulation +
          youthUbi.value * 12 * youthPopulation +
          adultUbi.value * 12 * adultPopulation +
          seniorUbi.value * 12 * seniorPopulation,
      });
    }
  });

  // Tax parameter lock toggle functions
  const toggleTaxRateLock = $((lockType: "flatTaxRate" | "taxExemption") => {
    switch (lockType) {
      case "flatTaxRate":
        flatTaxRateLocked.value = !flatTaxRateLocked.value;
        break;
      case "taxExemption":
        taxExemptionLocked.value = !taxExemptionLocked.value;
        break;
    }

    // Debug logging
    console.log("🔒 TAX LOCK TOGGLED:", {
      lockType,
      flatTaxRateLocked: flatTaxRateLocked.value,
      taxExemptionLocked: taxExemptionLocked.value,
    });

    // Trigger tax constraint callback if provided
    if (onTaxConstraintsChange$) {
      console.log("📞 CALLING onTaxConstraintsChange$ callback");
      onTaxConstraintsChange$({
        flatTaxRateLocked: flatTaxRateLocked.value,
        taxExemptionLocked: taxExemptionLocked.value,
      });
    } else {
      console.log("❌ NO onTaxConstraintsChange$ callback provided");
    }

    // CRITICAL: Sync current tax values to global state when locking
    // This ensures the genetic algorithm gets the correct locked tax values
    if (onTaxParametersChange$) {
      console.log("🔄 SYNCING CURRENT TAX VALUES TO GLOBAL STATE");
      console.log("  Current tax values:", {
        flatTaxRate: flatTaxRate.value,
        taxExemption: taxExemption.value,
      });

      onTaxParametersChange$({
        flatTaxRate: flatTaxRate.value,
        taxExemption: taxExemption.value,
        totalTaxRevenue: totalTaxRevenue,
      });
    }
  });

  // Centralized constraint validation using the constraint engine
  const validateAndUpdateUbi = $((type: string, newValue: number) => {
    // Check if this UBI amount is locked
    const isLocked =
      (type === "child" && childLocked.value) ||
      (type === "youth" && youthLocked.value) ||
      (type === "adult" && adultLocked.value) ||
      (type === "senior" && seniorLocked.value);

    if (isLocked) return; // Don't update if locked

    // Create current values object
    const currentValues: UbiAmounts = {
      child: childUbi.value,
      youth: youthUbi.value,
      adult: adultUbi.value,
      senior: seniorUbi.value,
    };

    // Create locks object
    const locks: UbiLocks = {
      childLocked: childLocked.value,
      youthLocked: youthLocked.value,
      adultLocked: adultLocked.value,
      seniorLocked: seniorLocked.value,
    };

    // Apply the new value
    const testValues = { ...currentValues, [type]: newValue };

    // Validate using centralized constraint engine
    const result = validateUbiForUI(testValues, locks);

    // Apply the corrected values BUT respect locks - don't change locked values
    if (!locks.childLocked) {
      childUbi.value = result.correctedValues.child;
    }
    if (!locks.youthLocked) {
      youthUbi.value = result.correctedValues.youth;
    }
    if (!locks.adultLocked) {
      adultUbi.value = result.correctedValues.adult;
    }
    if (!locks.seniorLocked) {
      seniorUbi.value = result.correctedValues.senior;
    }

    console.log("🔧 CONSTRAINT VALIDATION RESULT:");
    console.log("  Original values:", testValues);
    console.log("  Corrected values:", result.correctedValues);
    console.log("  Locks:", locks);
    console.log("  Applied values:", {
      child: childUbi.value,
      youth: youthUbi.value,
      adult: adultUbi.value,
      senior: seniorUbi.value,
    });

    // Trigger callback
    if (onUbiAmountsChange$) {
      onUbiAmountsChange$({
        child: childUbi.value,
        youth: youthUbi.value,
        adult: adultUbi.value,
        senior: seniorUbi.value,
        totalAnnualCost: totalUbiCost,
      });
    }
  });

  // Mouse event handlers for dragging
  const handleMouseDown = $((sliderType: string, event: MouseEvent) => {
    if (disabled) return;

    // Check if this slider is locked
    const isLocked =
      (sliderType === "child" && childLocked.value) ||
      (sliderType === "youth" && youthLocked.value) ||
      (sliderType === "adult" && adultLocked.value) ||
      (sliderType === "senior" && seniorLocked.value);

    if (isLocked) return; // Prevent dragging if locked

    event.preventDefault();
    isDragging.value = true;
    activeSlider.value = sliderType;
  });

  // Calculate UBI costs and tax data
  const totalPopulation =
    childPopulation + youthPopulation + adultPopulation + seniorPopulation;

  // Annual UBI costs by group
  const childUbiCost = childUbi.value * childPopulation * 12;
  const youthUbiCost = youthUbi.value * youthPopulation * 12;
  const adultUbiCost = adultUbi.value * adultPopulation * 12;
  const seniorUbiCost = seniorUbi.value * seniorPopulation * 12;
  const totalUbiCost =
    childUbiCost + youthUbiCost + adultUbiCost + seniorUbiCost;

  // Calculate taxes needed (simplified flat tax model)
  // Assume average income levels for tax calculation
  const avgChildIncome = 0; // Children don't pay taxes
  const avgYouthIncome = 25000; // Youth average income
  const avgAdultIncome = 55000; // Adult average income
  const avgSeniorIncome = 35000; // Senior average income

  // Calculate taxable income after exemption
  const getTaxableIncome = (income: number) =>
    Math.max(0, income - taxExemption.value);
  const getTaxOwed = (income: number) =>
    getTaxableIncome(income) * (flatTaxRate.value / 100);

  // Total tax revenue
  const childTaxRevenue = youthPopulation * getTaxOwed(avgChildIncome); // Children don't pay
  const youthTaxRevenue = youthPopulation * getTaxOwed(avgYouthIncome);
  const adultTaxRevenue = adultPopulation * getTaxOwed(avgAdultIncome);
  const seniorTaxRevenue = seniorPopulation * getTaxOwed(avgSeniorIncome);
  const totalTaxRevenue =
    childTaxRevenue + youthTaxRevenue + adultTaxRevenue + seniorTaxRevenue;

  // Net UBI cost after taxes and program savings
  const netUbiCost = totalUbiCost - totalTaxRevenue - programSavings;

  // Before tax pie chart data with safety checks
  const beforeTaxData = [
    {
      label: `👶 ${t("Children")}`,
      value: childUbiCost || 0,
      percentage:
        totalUbiCost > 0 && !isNaN(childUbiCost) && !isNaN(totalUbiCost)
          ? Math.max(0, Math.min(100, (childUbiCost / totalUbiCost) * 100))
          : 0,
      color: "#3b82f6",
    },
    {
      label: `🧑 ${t("Youth")}`,
      value: youthUbiCost || 0,
      percentage:
        totalUbiCost > 0 && !isNaN(youthUbiCost) && !isNaN(totalUbiCost)
          ? Math.max(0, Math.min(100, (youthUbiCost / totalUbiCost) * 100))
          : 0,
      color: "#10b981",
    },
    {
      label: `👨 ${t("Adults")}`,
      value: adultUbiCost || 0,
      percentage:
        totalUbiCost > 0 && !isNaN(adultUbiCost) && !isNaN(totalUbiCost)
          ? Math.max(0, Math.min(100, (adultUbiCost / totalUbiCost) * 100))
          : 0,
      color: "#f59e0b",
    },
    {
      label: `👴 ${t("Seniors")}`,
      value: seniorUbiCost || 0,
      percentage:
        totalUbiCost > 0 && !isNaN(seniorUbiCost) && !isNaN(totalUbiCost)
          ? Math.max(0, Math.min(100, (seniorUbiCost / totalUbiCost) * 100))
          : 0,
      color: "#8b5cf6",
    },
  ];

  // After tax pie chart data (net cost)
  const afterTaxData = [
    {
      label: "Net UBI Cost",
      value: Math.max(0, netUbiCost),
      percentage: 100,
      color: "#ef4444",
    },
    {
      label: "Tax Revenue",
      value: totalTaxRevenue,
      percentage: 0, // This will be calculated differently for display
      color: "#22c55e",
    },
  ];

  // Set up global mouse event listeners for dragging
  useVisibleTask$(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.value || !activeSlider.value) return;

      const sliderElement = document.querySelector(
        `[data-slider="${activeSlider.value}"] .ubi-slider-track`
      );
      if (!sliderElement) return;

      const rect = sliderElement.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      );

      const rawValue = percent * 5000;

      // Use different step sizes based on slider type
      let stepSize = 100; // Default $100 step

      if (activeSlider.value === "child") {
        stepSize = 50; // $50 step for child UBI
      }
      // Round to nearest $100 step
      const newValue = Math.round(rawValue / stepSize) * 100;

      validateAndUpdateUbi(activeSlider.value, newValue);
    };

    const handleMouseUp = () => {
      isDragging.value = false;
      activeSlider.value = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <div class={`ubi-amounts-control ${className}`}>
      <div class="ubi-amounts-content">
        <div class="ubi-sliders-section">
          {/* Child UBI Slider */}
          <div
            class={`ubi-slider-container ${childLocked.value ? "locked" : ""}`}
            data-slider="child"
          >
            <div class="ubi-slider-header">
              <div class="ubi-slider-label">
                <span
                  class={`lock-icon ${childLocked.value ? "active" : "ghosted"}`}
                  onClick$={() => toggleLock("child")}
                  title={
                    childLocked.value ? "Unlock UBI amount" : "Lock UBI amount"
                  }
                >
                  {childLocked.value ? "🔒" : "🔓"}
                </span>
                👶 <T text="Child UBI" />
              </div>
              <div class="ubi-slider-values">
                <div class="ubi-slider-monthly">
                  ${childUbi.value.toLocaleString()}/mo
                </div>
                {showMonthlyAndAnnual && (
                  <div class="ubi-slider-annual">
                    ${(childUbi.value * 12).toLocaleString()}/yr
                  </div>
                )}
              </div>
            </div>
            <div
              class="ubi-slider-track"
              onMouseDown$={(e) => handleMouseDown("child", e)}
            >
              <div
                class="ubi-slider-fill child-color"
                style={`width: ${(childUbi.value / 5000) * 100}%`}
              />
              <div
                class={`ubi-slider-handle child-color ${isDragging.value && activeSlider.value === "child" ? "dragging" : ""}`}
                style={`left: ${(childUbi.value / 5000) * 100}%`}
              >
                👶
              </div>
            </div>
            <div class="ubi-slider-range">
              <span>$0</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Youth UBI Slider */}
          <div
            class={`ubi-slider-container ${youthLocked.value ? "locked" : ""}`}
            data-slider="youth"
          >
            <div class="ubi-slider-header">
              <div class="ubi-slider-label">
                <span
                  class={`lock-icon ${youthLocked.value ? "active" : "ghosted"}`}
                  onClick$={() => toggleLock("youth")}
                  title={
                    youthLocked.value ? "Unlock UBI amount" : "Lock UBI amount"
                  }
                >
                  {youthLocked.value ? "🔒" : "🔓"}
                </span>
                🧑 <T text="Youth UBI" />
              </div>
              <div class="ubi-slider-values">
                <div class="ubi-slider-monthly">
                  ${youthUbi.value.toLocaleString()}/mo
                </div>
                {showMonthlyAndAnnual && (
                  <div class="ubi-slider-annual">
                    ${(youthUbi.value * 12).toLocaleString()}/yr
                  </div>
                )}
              </div>
            </div>
            <div
              class="ubi-slider-track"
              onMouseDown$={(e) => handleMouseDown("youth", e)}
            >
              <div
                class="ubi-slider-fill youth-color"
                style={`width: ${(youthUbi.value / 5000) * 100}%`}
              />
              <div
                class={`ubi-slider-handle youth-color ${isDragging.value && activeSlider.value === "youth" ? "dragging" : ""}`}
                style={`left: ${(youthUbi.value / 5000) * 100}%`}
              >
                🧑
              </div>
            </div>
            <div class="ubi-slider-range">
              <span>$0</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Adult UBI Slider */}
          <div
            class={`ubi-slider-container ${adultLocked.value ? "locked" : ""}`}
            data-slider="adult"
          >
            <div class="ubi-slider-header">
              <div class="ubi-slider-label">
                <span
                  class={`lock-icon ${adultLocked.value ? "active" : "ghosted"}`}
                  onClick$={() => toggleLock("adult")}
                  title={
                    adultLocked.value ? "Unlock UBI amount" : "Lock UBI amount"
                  }
                >
                  {adultLocked.value ? "🔒" : "🔓"}
                </span>
                👨 <T text="Adult UBI" />
              </div>
              <div class="ubi-slider-values">
                <div class="ubi-slider-monthly">
                  ${adultUbi.value.toLocaleString()}/mo
                </div>
                {showMonthlyAndAnnual && (
                  <div class="ubi-slider-annual">
                    ${(adultUbi.value * 12).toLocaleString()}/yr
                  </div>
                )}
              </div>
            </div>
            <div
              class="ubi-slider-track"
              onMouseDown$={(e) => handleMouseDown("adult", e)}
            >
              <div
                class="ubi-slider-fill adult-color"
                style={`width: ${(adultUbi.value / 5000) * 100}%`}
              />
              <div
                class={`ubi-slider-handle adult-color ${isDragging.value && activeSlider.value === "adult" ? "dragging" : ""}`}
                style={`left: ${(adultUbi.value / 5000) * 100}%`}
              >
                👨
              </div>
            </div>
            <div class="ubi-slider-range">
              <span>$0</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Senior UBI Slider */}
          <div
            class={`ubi-slider-container ${seniorLocked.value ? "locked" : ""}`}
            data-slider="senior"
          >
            <div class="ubi-slider-header">
              <div class="ubi-slider-label">
                <span
                  class={`lock-icon ${seniorLocked.value ? "active" : "ghosted"}`}
                  onClick$={() => toggleLock("senior")}
                  title={
                    seniorLocked.value ? "Unlock UBI amount" : "Lock UBI amount"
                  }
                >
                  {seniorLocked.value ? "🔒" : "🔓"}
                </span>
                👴 <T text="Senior UBI" />
              </div>
              <div class="ubi-slider-values">
                <div class="ubi-slider-monthly">
                  ${seniorUbi.value.toLocaleString()}/mo
                </div>
                {showMonthlyAndAnnual && (
                  <div class="ubi-slider-annual">
                    ${(seniorUbi.value * 12).toLocaleString()}/yr
                  </div>
                )}
              </div>
            </div>
            <div
              class="ubi-slider-track"
              onMouseDown$={(e) => handleMouseDown("senior", e)}
            >
              <div
                class="ubi-slider-fill senior-color"
                style={`width: ${(seniorUbi.value / 5000) * 100}%`}
              />
              <div
                class={`ubi-slider-handle senior-color ${isDragging.value && activeSlider.value === "senior" ? "dragging" : ""}`}
                style={`left: ${(seniorUbi.value / 5000) * 100}%`}
              >
                👴
              </div>
            </div>
            <div class="ubi-slider-range">
              <span>$0</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Tax Controls */}
          {showTaxControls && (
            <div class="tax-controls-section">
              <h3 style="margin-bottom: 1rem; color: #1f2937; font-size: 1.125rem; font-weight: 600;">
                <T text="Tax Parameters" />
              </h3>

              {/* Flat Tax Rate Slider */}
              <div class="tax-control-item">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">
                  <span
                    class={`lock-icon ${flatTaxRateLocked.value ? "active" : "ghosted"}`}
                    onClick$={() => toggleTaxRateLock("flatTaxRate")}
                    title={
                      flatTaxRateLocked.value
                        ? "Unlock tax rate"
                        : "Lock tax rate"
                    }
                    style="margin-right: 0.5rem; cursor: pointer;"
                  >
                    {flatTaxRateLocked.value ? "🔒" : "🔓"}
                  </span>
                  <T text="Flat Tax Rate:" />{" "}
                  <span>{flatTaxRateDisplay.value}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={flatTaxRate.value}
                  disabled={flatTaxRateLocked.value}
                  onInput$={(e) => {
                    if (flatTaxRateLocked.value) return; // Prevent changes when locked
                    const newValue = parseInt(
                      (e.target as HTMLInputElement).value
                    );
                    flatTaxRate.value = newValue;
                    if (onTaxParametersChange$) {
                      onTaxParametersChange$({
                        flatTaxRate: flatTaxRate.value,
                        taxExemption: taxExemption.value,
                        totalTaxRevenue: totalTaxRevenue,
                      });
                    }
                  }}
                  style="width: 100%; margin-bottom: 1rem;"
                />
              </div>

              {/* Tax Exemption Slider */}
              <div class="tax-control-item">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">
                  <span
                    class={`lock-icon ${taxExemptionLocked.value ? "active" : "ghosted"}`}
                    onClick$={() => toggleTaxRateLock("taxExemption")}
                    title={
                      taxExemptionLocked.value
                        ? "Unlock tax exemption"
                        : "Lock tax exemption"
                    }
                    style="margin-right: 0.5rem; cursor: pointer;"
                  >
                    {taxExemptionLocked.value ? "🔒" : "🔓"}
                  </span>
                  <T text="Tax Exemption:" /> $
                  {(taxExemption.value / 12).toFixed(0).toLocaleString()}
                  <T text="/month" />
                  (${taxExemption.value.toLocaleString()}
                  <T text="/year" />)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={taxExemption.value}
                  disabled={taxExemptionLocked.value}
                  onInput$={(e) => {
                    if (taxExemptionLocked.value) return; // Prevent changes when locked
                    taxExemption.value = parseInt(
                      (e.target as HTMLInputElement).value
                    );
                    if (onTaxParametersChange$) {
                      onTaxParametersChange$({
                        flatTaxRate: flatTaxRate.value,
                        taxExemption: taxExemption.value,
                        totalTaxRevenue: totalTaxRevenue,
                      });
                    }
                  }}
                  style="width: 100%; margin-bottom: 1rem;"
                />
              </div>
            </div>
          )}
        </div>

        {showPieCharts && (
          <div class="ubi-charts-section">
            {/* Before Tax UBI Cost Distribution */}
            <div class="pie-chart-container">
              <h3 class="pie-chart-title">
                <T text="UBI Cost Before Tax" />
              </h3>
              <svg class="pie-chart" viewBox="0 0 200 200">
                {beforeTaxData
                  .map((segment, index) => {
                    // Safety checks to prevent 500 errors
                    if (
                      !segment ||
                      typeof segment.percentage !== "number" ||
                      isNaN(segment.percentage)
                    ) {
                      return null;
                    }

                    const startAngle = beforeTaxData
                      .slice(0, index)
                      .reduce((sum, s) => {
                        const percentage =
                          s &&
                          typeof s.percentage === "number" &&
                          !isNaN(s.percentage)
                            ? s.percentage
                            : 0;
                        return sum + (percentage / 100) * 360;
                      }, 0);

                    const endAngle =
                      startAngle + (segment.percentage / 100) * 360;
                    const largeArcFlag = segment.percentage > 50 ? 1 : 0;

                    // Safety checks for angle calculations
                    if (isNaN(startAngle) || isNaN(endAngle)) {
                      return null;
                    }

                    const x1 =
                      100 + 80 * Math.cos(((startAngle - 90) * Math.PI) / 180);
                    const y1 =
                      100 + 80 * Math.sin(((startAngle - 90) * Math.PI) / 180);
                    const x2 =
                      100 + 80 * Math.cos(((endAngle - 90) * Math.PI) / 180);
                    const y2 =
                      100 + 80 * Math.sin(((endAngle - 90) * Math.PI) / 180);

                    // Safety checks for coordinate calculations
                    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
                      return null;
                    }

                    return (
                      <path
                        key={index}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={segment.color}
                        stroke="white"
                        stroke-width="2"
                      />
                    );
                  })
                  .filter(Boolean)}
              </svg>
              <div class="pie-legend">
                {beforeTaxData.map((item, index) => (
                  <div key={index} class="pie-legend-item">
                    <div style="display: flex; align-items: center;">
                      <div
                        class="pie-legend-color"
                        style={`background-color: ${item.color}`}
                      ></div>
                      <span class="pie-legend-label">{item.label}</span>
                    </div>
                    <span class="pie-legend-value">
                      ${(item.value / 1000000000).toFixed(1)}B (
                      {item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Before/After Program Replacement Comparison */}
            <div class="pie-chart-container">
              <h3 class="pie-chart-title">
                <T text="Before/After Program Replacement" />
              </h3>
              <div style="padding: 1rem;">
                {/* Before Replacement */}
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: #fef2f2; border-radius: 0.5rem; border-left: 4px solid #ef4444;">
                  <h4 style="margin: 0 0 0.75rem 0; color: #dc2626; font-size: 1rem; font-weight: 600;">
                    <T text="Before Program Replacement" />
                  </h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                    <div>
                      <T text="UBI Cost:" />
                    </div>
                    <div style="text-align: right; font-weight: 600;">
                      ${(totalUbiCost / 1000000000).toFixed(1)}B
                    </div>
                    <div>
                      <T text="Tax Revenue:" />
                    </div>
                    <div style="text-align: right; font-weight: 600; color: #22c55e;">
                      ${(totalTaxRevenue / 1000000000).toFixed(1)}B
                    </div>
                    <div style="border-top: 1px solid #fca5a5; padding-top: 0.5rem; font-weight: 600;">
                      <T text="Net Cost:" />
                    </div>
                    <div style="border-top: 1px solid #fca5a5; padding-top: 0.5rem; text-align: right; font-weight: 600; color: #dc2626;">
                      $
                      {((totalUbiCost - totalTaxRevenue) / 1000000000).toFixed(
                        1
                      )}
                      B
                    </div>
                  </div>
                </div>

                {/* After Replacement */}
                <div style="margin-bottom: 1rem; padding: 1rem; background: #f0fdf4; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                  <h4 style="margin: 0 0 0.75rem 0; color: #16a34a; font-size: 1rem; font-weight: 600;">
                    <T text="After Program Replacement" />
                  </h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                    <div>
                      <T text="UBI Cost:" />
                    </div>
                    <div style="text-align: right; font-weight: 600;">
                      ${(totalUbiCost / 1000000000).toFixed(1)}B
                    </div>
                    <div>
                      <T text="Tax Revenue:" />
                    </div>
                    <div style="text-align: right; font-weight: 600; color: #22c55e;">
                      ${(totalTaxRevenue / 1000000000).toFixed(1)}B
                    </div>
                    {programSavings > 0 && (
                      <>
                        <div>
                          <T text="Program Savings:" />
                        </div>
                        <div style="text-align: right; font-weight: 600; color: #22c55e;">
                          ${(programSavings / 1000000000).toFixed(1)}B
                        </div>
                      </>
                    )}
                    <div style="border-top: 1px solid #86efac; padding-top: 0.5rem; font-weight: 600;">
                      <T text="Net Cost:" />
                    </div>
                    <div
                      style={`border-top: 1px solid #86efac; padding-top: 0.5rem; text-align: right; font-weight: 600; color: ${netUbiCost > 0 ? "#dc2626" : "#16a34a"};`}
                    >
                      ${(netUbiCost / 1000000000).toFixed(1)}B
                    </div>
                  </div>
                </div>

                {/* Savings Summary */}
                {programSavings > 0 && (
                  <div style="padding: 1rem; background: #fffbeb; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #d97706; font-size: 1rem; font-weight: 600;">
                      💰 <T text="Program Replacement Impact" />
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                      <div>
                        <T text="Total Savings:" />
                      </div>
                      <div style="text-align: right; font-weight: 600; color: #16a34a;">
                        ${(programSavings / 1000000000).toFixed(1)}B
                      </div>
                      <div>
                        <T text="Cost Reduction:" />
                      </div>
                      <div style="text-align: right; font-weight: 600; color: #16a34a;">
                        {totalUbiCost > 0
                          ? ((programSavings / totalUbiCost) * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                      <div>
                        <T text="Funding Status:" />
                      </div>
                      <div
                        style={`text-align: right; font-weight: 600; color: ${netUbiCost > 0 ? "#dc2626" : "#16a34a"};`}
                      >
                        {netUbiCost > 0
                          ? `${(((totalTaxRevenue + programSavings) / totalUbiCost) * 100).toFixed(1)}% ${t("Funded")}`
                          : t("Fully Self-Funded")}
                      </div>
                    </div>
                    <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #fde68a; font-size: 0.75rem; color: #92400e;">
                      {netUbiCost > 0
                        ? `${t("Additional funding needed")}: $${(netUbiCost / 1000000000).toFixed(1)}B`
                        : `${t("Surplus available")}: $${(Math.abs(netUbiCost) / 1000000000).toFixed(1)}B`}
                    </div>
                  </div>
                )}

                {/* No Program Savings Message */}
                {programSavings === 0 && (
                  <div style="padding: 1rem; background: #f3f4f6; border-radius: 0.5rem; text-align: center;">
                    <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">
                      💡 No program replacement savings configured
                    </div>
                    <div style="font-size: 0.75rem; color: #9ca3af;">
                      Adjust program replacement percentages in the Government
                      Spending section to see potential savings
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
