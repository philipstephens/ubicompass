import { component$, useSignal, $ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * A standalone income range component that doesn't rely on the UBI store
 * This component is designed to avoid circular reference issues
 */
export const IncomeRangeStandalone = component$(({
  exemptionAmount = 24,
  taxRate = 30,
  taxModel = "flat",
  onExemptionChange$ = undefined,
  onTaxRateChange$ = undefined,
  onTaxModelChange$ = undefined,
}: {
  exemptionAmount?: number;
  taxRate?: number;
  taxModel?: string;
  onExemptionChange$?: (amount: number) => void;
  onTaxRateChange$?: (rate: number) => void;
  onTaxModelChange$?: (model: string) => void;
}) => {
  // Local state
  const localExemptionAmount = useSignal(exemptionAmount);
  const localTaxRate = useSignal(taxRate);
  const localTaxModel = useSignal(taxModel);
  const showNotification = useSignal(false);
  const notificationMessage = useSignal("");
  
  // Update local state when props change
  if (localExemptionAmount.value !== exemptionAmount) {
    localExemptionAmount.value = exemptionAmount;
  }
  
  if (localTaxRate.value !== taxRate) {
    localTaxRate.value = taxRate;
  }
  
  if (localTaxModel.value !== taxModel) {
    localTaxModel.value = taxModel;
  }
  
  // Display a notification
  const displayNotification = $((message: string) => {
    notificationMessage.value = message;
    showNotification.value = true;
    
    setTimeout(() => {
      showNotification.value = false;
    }, 3000);
  });
  
  // Handle exemption amount change
  const handleExemptionChange = $((newAmount: number) => {
    localExemptionAmount.value = newAmount;
    if (onExemptionChange$) {
      onExemptionChange$(newAmount);
    }
    displayNotification(`Exemption amount updated to $${newAmount}k`);
  });
  
  // Handle tax rate change
  const handleTaxRateChange = $((newRate: number) => {
    localTaxRate.value = newRate;
    if (onTaxRateChange$) {
      onTaxRateChange$(newRate);
    }
    displayNotification(`Tax rate updated to ${newRate}%`);
  });
  
  // Handle tax model change
  const handleTaxModelChange = $((newModel: string) => {
    localTaxModel.value = newModel;
    if (onTaxModelChange$) {
      onTaxModelChange$(newModel);
    }
    const modelName = newModel.charAt(0).toUpperCase() + newModel.slice(1) + " Tax";
    displayNotification(`Tax model updated to ${modelName}`);
  });
  
  // Get the formatted tax model name
  const getTaxModelName = (model: string) => {
    return model.charAt(0).toUpperCase() + model.slice(1) + " Tax";
  };
  
  return (
    <div>
      {/* Income Range Component */}
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

        {/* Content */}
        <div style={{ padding: "20px" }}>
          <p style={{ marginBottom: "16px" }}>
            <strong>
              <TranslatableText text="Current Tax Model:" />
            </strong>{" "}
            <span>{getTaxModelName(localTaxModel.value)}</span>
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
      
      {/* Notification */}
      {showNotification.value && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "15px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {notificationMessage.value}
        </div>
      )}
    </div>
  );
});
