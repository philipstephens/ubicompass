import { component$, useSignal, $ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * A simplified version of the income range component that doesn't rely on the UBI store
 */
export const IncomeRangeSimple = component$(({
  exemptionAmount = 24,
  taxRate = 30,
  onExemptionChange$ = undefined,
}: {
  exemptionAmount?: number;
  taxRate?: number;
  onExemptionChange$?: (amount: number) => void;
}) => {
  // Local state
  const localExemptionAmount = useSignal(exemptionAmount);
  const localTaxRate = useSignal(taxRate);
  
  // Update local state when props change
  if (localExemptionAmount.value !== exemptionAmount) {
    localExemptionAmount.value = exemptionAmount;
  }
  
  if (localTaxRate.value !== taxRate) {
    localTaxRate.value = taxRate;
  }
  
  // Handle exemption amount change
  const handleExemptionChange = $((newAmount: number) => {
    localExemptionAmount.value = newAmount;
    if (onExemptionChange$) {
      onExemptionChange$(newAmount);
    }
  });
  
  return (
    <div
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid #ccc",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Blue header */}
      <div
        style={{
          backgroundColor: "blue",
          padding: "10px 15px",
          textAlign: "center",
        }}
      >
        <h4
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            margin: 0,
            color: "white",
          }}
        >
          <TranslatableText text="Income Range" />
        </h4>
      </div>

      {/* Simple content */}
      <div style={{ padding: "20px" }}>
        <p style={{ marginBottom: "16px" }}>
          <strong>
            <TranslatableText text="Current Tax Model:" />
          </strong>{" "}
          <TranslatableText text="Flat Tax" />
        </p>
        
        {/* Exemption amount control */}
        <div style={{ marginBottom: "16px" }}>
          <strong>
            <TranslatableText text="Exemption Amount:" />
          </strong>
          <select
            style={{
              marginLeft: "8px",
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            value={localExemptionAmount.value}
            onChange$={(e) => handleExemptionChange(parseInt(e.target.value, 10))}
          >
            <option value={0}>$0k (No exemption)</option>
            <option value={12}>$12k</option>
            <option value={18}>$18k</option>
            <option value={24}>$24k</option>
            <option value={30}>$30k</option>
            <option value={36}>$36k</option>
          </select>
        </div>
        
        <p style={{ marginBottom: "8px" }}>
          <strong>
            <TranslatableText text="Tax Brackets:" />
          </strong>
        </p>
        <div
          style={{
            backgroundColor: "#f0f8ff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {`$0k - $${localExemptionAmount.value}k`}
            </span>
            <span style={{ fontWeight: "bold" }}>
              <TranslatableText text="0%" />
            </span>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#f0f8ff",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {`$${localExemptionAmount.value}k+`}
            </span>
            <span style={{ fontWeight: "bold" }}>
              {`${localTaxRate.value}%`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
