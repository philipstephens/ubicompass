import {
  component$,
  useSignal,
  $,
  useStylesScoped$,
  useVisibleTask$,
  useTask$,
} from "@builder.io/qwik";

export interface TripleHandleSliderProps {
  min?: number;
  max?: number;
  initialValues?: [number, number, number];
  step?: number;
  disabled?: boolean;
  onValueChange$?: (values: [number, number, number]) => void;
  // Individual handle disable states
  handleDisabled?: {
    handle0?: boolean; // Child handle
    handle1?: boolean; // Youth handle
    handle2?: boolean; // Senior handle
  };
  labels?: [string, string, string];
  showValues?: boolean;
  className?: string;
  // Individual handle constraints (optional)
  handleConstraints?: {
    handle0?: { min?: number; max?: number };
    handle1?: { min?: number; max?: number };
    handle2?: { min?: number; max?: number };
  };
  // Enforce minimum gap between handle constraint zones
  enforceConstraintGaps?: boolean;
  // Minimum gap between constraint zones (default: 1)
  constraintGap?: number;
  // Enforce strict inequality (A < B < C) vs allow equality (A <= B <= C)
  strictInequality?: boolean;
}

export const TripleHandleSlider = component$<TripleHandleSliderProps>(
  (props) => {
    useStylesScoped$(`
      .triple-handle-slider {
        width: 100%;
        max-width: 600px;
        margin: 20px 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .slider-values {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        gap: 12px;
      }

      .value-display {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 12px;
        border: 2px solid #e2e8f0;
        min-width: 90px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
      }

      .value-display:hover {
        border-color: #cbd5e1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .value-label {
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
      }

      .value-number {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
      }

      /* Age group specific value display colors */
      .value-display.children .value-number { color: #3b82f6; }
      .value-display.youth .value-number { color: #10b981; }
      .value-display.seniors .value-number { color: #8b5cf6; }

      .slider-track {
        position: relative;
        height: 12px;
        background: #f1f5f9;
        border-radius: 6px;
        margin: 24px 0;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .track-segment {
        position: absolute;
        height: 100%;
        border-radius: 6px;
        transition: all 0.3s ease;
      }

      /* Age group colors matching the cards and legends */
      .track-children { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
      .track-youth { background: linear-gradient(90deg, #10b981, #34d399); }
      .track-adults { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
      .track-seniors { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

      .slider-handle {
        position: absolute;
        top: 50%;
        width: 40px;
        height: 40px;
        transform: translate(-50%, -50%);
        z-index: 9999; /* Increased z-index to ensure handles are on top */
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        background: white;
        border-radius: 50%;
        border: 3px solid;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        pointer-events: auto;
        z-index: 10;
      }

      /* Age group handle colors */
      .handle-0 { border-color: #3b82f6; }
      .handle-1 { border-color: #10b981; }
      .handle-2 { border-color: #8b5cf6; }

      .handle-inner {
        display: none; /* Hide the old inner handle */
      }

      .slider-handle:hover {
        transform: translate(-50%, -50%) scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }

      .slider-handle.dragging {
        transform: translate(-50%, -50%) scale(1.2);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        cursor: grabbing;
      }

      .slider-handle {
        cursor: grab;
      }

      .slider-handle:active {
        cursor: grabbing;
      }

      .slider-handle.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        background: #f8f9fa;
        border-color: #d1d5db;
      }

      .slider-handle.disabled:hover {
        transform: translate(-50%, -50%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .slider-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 12px;
        color: #6c757d;
        font-weight: 500;
      }

      .label-min, .label-max {
        padding: 4px 8px;
        background: #f8f9fa;
        border-radius: 4px;
        border: 1px solid #e9ecef;
      }
    `);

    const {
      min = 0,
      max = 100,
      initialValues = [20, 50, 80],
      step = 1,
      disabled = false,
      onValueChange$,
      labels = ["Min", "Mid", "Max"],
      showValues = true,
      className = "",
      handleConstraints = {},
      handleDisabled = {},
      enforceConstraintGaps = false,
      constraintGap = 1,
      strictInequality = false,
    } = props;

    // Validate and adjust handle constraints if enforceConstraintGaps is enabled
    const adjustedConstraints = enforceConstraintGaps
      ? (() => {
          const adjusted = { ...handleConstraints };

          // Always enforce handle1.min >= handle0.max + constraintGap, but respect original min if higher
          if (adjusted.handle0?.max !== undefined && adjusted.handle1) {
            const requiredMin = adjusted.handle0.max + constraintGap;
            const originalMin = handleConstraints.handle1?.min || 0;
            const finalMin = Math.max(requiredMin, originalMin);
            adjusted.handle1 = { ...adjusted.handle1, min: finalMin };
          }

          // Always enforce handle2.min >= handle1.max + constraintGap, but respect original min if higher
          if (adjusted.handle1?.max !== undefined && adjusted.handle2) {
            const requiredMin = adjusted.handle1.max + constraintGap;
            const originalMin = handleConstraints.handle2?.min || 0;
            const finalMin = Math.max(requiredMin, originalMin);
            adjusted.handle2 = { ...adjusted.handle2, min: finalMin };
          }

          return adjusted;
        })()
      : handleConstraints;

    // State management
    const values = useSignal<[number, number, number]>([...initialValues] as [
      number,
      number,
      number,
    ]);
    const sliderRef = useSignal<HTMLDivElement>();
    const isDragging = useSignal(false);
    const activeHandle = useSignal<number | null>(null);

    // Watch for changes to initialValues prop and update internal values
    useTask$(({ track }) => {
      track(() => initialValues);

      // Only update if not currently dragging to avoid conflicts
      if (!isDragging.value) {
        values.value = [...initialValues] as [number, number, number];
      }
    });

    // Value validation and normalization with individual handle constraints
    const normalizeAndValidateValues = $(
      (newValues: [number, number, number]) => {
        // Apply step rounding and global bounds
        let [val1, val2, val3] = newValues.map((val) =>
          Math.max(min, Math.min(max, Math.round(val / step) * step))
        ) as [number, number, number];

        // Apply individual handle constraints (using adjusted constraints if enforceConstraintGaps is enabled)
        const constraints0 = adjustedConstraints.handle0;
        const constraints1 = adjustedConstraints.handle1;
        const constraints2 = adjustedConstraints.handle2;

        // Apply individual min/max constraints for each handle
        if (constraints0?.min !== undefined)
          val1 = Math.max(val1, constraints0.min);
        if (constraints0?.max !== undefined)
          val1 = Math.min(val1, constraints0.max);

        if (constraints1?.min !== undefined)
          val2 = Math.max(val2, constraints1.min);
        if (constraints1?.max !== undefined)
          val2 = Math.min(val2, constraints1.max);

        if (constraints2?.min !== undefined)
          val3 = Math.max(val3, constraints2.min);
        if (constraints2?.max !== undefined)
          val3 = Math.min(val3, constraints2.max);

        // OVERLAP PREVENTION: Ensure proper ordering based on strictInequality setting
        // strictInequality=true:  val1 < val2 < val3 (no equal values allowed)
        // strictInequality=false: val1 <= val2 <= val3 (equal values allowed)

        const minGap = strictInequality ? step : 0;

        // Step 1: Ensure handle 1 maintains proper relationship with handle 0
        val2 = Math.max(val2, val1 + minGap);

        // Step 2: Ensure handle 2 maintains proper relationship with handle 1
        val3 = Math.max(val3, val2 + minGap);

        // Step 3: Apply constraint-based ordering (working backwards to prevent conflicts)
        // Handle 0 cannot exceed handle 1's minimum constraint
        if (constraints1?.min !== undefined)
          val1 = Math.min(val1, constraints1.min);

        // Handle 1 cannot exceed handle 2's minimum constraint
        if (constraints2?.min !== undefined)
          val2 = Math.min(val2, constraints2.min);

        // Step 4: Re-apply forward ordering after constraint adjustments
        val2 = Math.max(val2, val1 + minGap); // Ensure proper relationship
        val3 = Math.max(val3, val2 + minGap); // Ensure proper relationship

        // Step 5: Apply maximum constraint boundaries (working backwards)
        // Handle 2 cannot be less than handle 1's maximum constraint
        if (constraints1?.max !== undefined)
          val3 = Math.max(val3, constraints1.max);
        // Handle 1 cannot be less than handle 0's maximum constraint
        if (constraints0?.max !== undefined)
          val2 = Math.max(val2, constraints0.max);

        // Step 6: Final overlap prevention (enforce proper ordering)
        val2 = Math.max(val2, val1 + minGap); // Guarantee proper relationship
        val3 = Math.max(val3, val2 + minGap); // Guarantee proper relationship

        const validatedValues: [number, number, number] = [val1, val2, val3];
        values.value = validatedValues;

        // Notify parent of change
        if (onValueChange$) {
          onValueChange$(validatedValues);
        }

        return validatedValues;
      }
    );

    // Handle mouse down on handle (start drag)
    const handleMouseDown = $((handleIndex: number, event: MouseEvent) => {
      console.log("🖱️ Triple Handle Slider: Mouse down on handle", handleIndex);

      if (disabled) {
        console.log("🚫 Triple Handle Slider: Slider is disabled");
        return;
      }

      // Check if this specific handle is disabled
      const isHandleDisabled =
        (handleIndex === 0 && handleDisabled.handle0) ||
        (handleIndex === 1 && handleDisabled.handle1) ||
        (handleIndex === 2 && handleDisabled.handle2);

      if (isHandleDisabled) {
        console.log(
          "🚫 Triple Handle Slider: Handle",
          handleIndex,
          "is disabled"
        );
        return;
      }

      console.log(
        "✅ Triple Handle Slider: Starting drag for handle",
        handleIndex
      );
      event.preventDefault();
      event.stopPropagation();

      isDragging.value = true;
      activeHandle.value = handleIndex;
    });

    // Handle track click (move nearest handle)
    const handleTrackClick = $((event: MouseEvent) => {
      if (disabled || !sliderRef.value || isDragging.value) return;

      const rect = sliderRef.value.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      );
      const clickValue = min + percent * (max - min);

      // Find closest handle that is not disabled
      const distances = values.value.map((val, index) => {
        // Check if this handle is disabled
        const isHandleDisabled =
          (index === 0 && handleDisabled.handle0) ||
          (index === 1 && handleDisabled.handle1) ||
          (index === 2 && handleDisabled.handle2);

        // Return very large distance for disabled handles so they won't be selected
        return isHandleDisabled ? Infinity : Math.abs(val - clickValue);
      });

      const closestHandle = distances.indexOf(Math.min(...distances));

      // If all handles are disabled or no valid handle found, do nothing
      if (distances[closestHandle] === Infinity) {
        return;
      }

      // Update the closest handle
      const newValues = [...values.value] as [number, number, number];
      newValues[closestHandle] = clickValue;

      normalizeAndValidateValues(newValues);
    });

    // Set up global mouse event listeners for dragging
    useVisibleTask$(() => {
      const handleMouseMove = (event: MouseEvent) => {
        if (
          !isDragging.value ||
          activeHandle.value === null ||
          !sliderRef.value
        )
          return;

        const rect = sliderRef.value.getBoundingClientRect();
        const percent = Math.max(
          0,
          Math.min(1, (event.clientX - rect.left) / rect.width)
        );
        const newValue = min + percent * (max - min);

        const newValues = [...values.value] as [number, number, number];
        newValues[activeHandle.value] = newValue;

        normalizeAndValidateValues(newValues);
      };

      const handleMouseUp = () => {
        isDragging.value = false;
        activeHandle.value = null;
      };

      // Add event listeners to both document and window for better compatibility
      const addEventListeners = () => {
        document.addEventListener("mousemove", handleMouseMove, {
          passive: false,
        });
        document.addEventListener("mouseup", handleMouseUp, { passive: false });
        window.addEventListener("mousemove", handleMouseMove, {
          passive: false,
        });
        window.addEventListener("mouseup", handleMouseUp, { passive: false });
      };

      const removeEventListeners = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      // Ensure DOM is ready
      if (typeof document !== "undefined") {
        addEventListeners();
      }

      return removeEventListeners;
    });

    return (
      <div class={`triple-handle-slider ${className}`}>
        {showValues && (
          <div class="slider-values">
            {values.value.map((value, index) => {
              const ageGroupClasses = ["children", "youth", "seniors"];
              return (
                <div
                  key={index}
                  class={`value-display ${ageGroupClasses[index]}`}
                >
                  <span class="value-label">{labels[index]}:</span>
                  <span class="value-number">{value}</span>
                </div>
              );
            })}
          </div>
        )}

        <div
          ref={sliderRef}
          class="slider-track"
          onClick$={handleTrackClick}
          style="position: relative; pointer-events: auto;"
        >
          {/* Track segments with age group colors */}
          <div
            class="track-segment track-children"
            style={`width: ${((values.value[0] - min) / (max - min)) * 100}%`}
          />
          <div
            class="track-segment track-youth"
            style={`left: ${((values.value[0] - min) / (max - min)) * 100}%; width: ${((values.value[1] - values.value[0]) / (max - min)) * 100}%`}
          />
          <div
            class="track-segment track-adults"
            style={`left: ${((values.value[1] - min) / (max - min)) * 100}%; width: ${((values.value[2] - values.value[1]) / (max - min)) * 100}%`}
          />
          <div
            class="track-segment track-seniors"
            style={`left: ${((values.value[2] - min) / (max - min)) * 100}%; width: ${100 - ((values.value[2] - min) / (max - min)) * 100}%`}
          />

          {/* Handles */}
          {values.value.map((value, index) => {
            // Define emoji for each handle based on age groups
            const handleEmojis = ["👶", "🧑", "👴"]; // Child, Youth, Senior

            // Check if this handle is disabled
            const isHandleDisabled =
              (index === 0 && handleDisabled.handle0) ||
              (index === 1 && handleDisabled.handle1) ||
              (index === 2 && handleDisabled.handle2);

            return (
              <div
                key={index}
                class={`slider-handle handle-${index} ${
                  isDragging.value && activeHandle.value === index
                    ? "dragging"
                    : ""
                } ${isHandleDisabled ? "disabled" : ""}`}
                style={`left: ${((value - min) / (max - min)) * 100}%;`}
                onMouseDown$={(event) => handleMouseDown(index, event)}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-label={`${labels[index]} handle`}
              >
                {handleEmojis[index]}
                <div class="handle-inner" />
              </div>
            );
          })}
        </div>

        <div class="slider-labels">
          <span class="label-min">{min}</span>
          <span class="label-max">{max}</span>
        </div>
      </div>
    );
  }
);
