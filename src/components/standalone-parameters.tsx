import { component$, useSignal } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * Standalone UBI parameters component that doesn't rely on any context
 */
export const StandaloneParameters = component$(() => {
  // Local state for the parameters
  const selectedYear = useSignal(2022);
  const ubiAmount = useSignal(2000);
  const flatTaxPercentage = useSignal(30);
  const exemptionAmount = useSignal(24);
  const selectedModelId = useSignal(1);

  return (
    <div
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid #d0d6f7",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
      }}
    >
      {/* Purple header */}
      <div
        style={{
          backgroundColor: "#673ab7",
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
          UBI Calculator Parameters
        </h4>
      </div>

      {/* Parameters content */}
      <div style={{ padding: "20px" }}>
        {/* Year selector */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Year:</label>
          <div style={{ position: "relative", width: "100px" }}>
            <select
              style={{
                width: "100%",
                padding: "8px 24px 8px 12px",
                appearance: "none",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
              }}
              value={selectedYear.value}
              onChange$={(e) => {
                selectedYear.value = parseInt(e.target.value);
              }}
            >
              {Array.from({ length: 24 }, (_, i) => 2000 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: "16px", height: "16px" }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tax Model selector */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Tax Model:</label>
          <div style={{ position: "relative", width: "150px" }}>
            <select
              style={{
                width: "100%",
                padding: "8px 24px 8px 12px",
                appearance: "none",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
              }}
              value={selectedModelId.value}
              onChange$={(e) => {
                selectedModelId.value = parseInt(e.target.value);
              }}
            >
              <option value={1}>Flat Tax</option>
              <option value={2}>Progressive Tax</option>
              <option value={3}>Bell Curve</option>
              <option value={4}>Percentile-Matched</option>
            </select>
            <div
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: "16px", height: "16px" }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* UBI Amount selector */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: "bold" }}>UBI Amount:</label>
          <div style={{ position: "relative", width: "150px" }}>
            <select
              style={{
                width: "100%",
                padding: "8px 24px 8px 12px",
                appearance: "none",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
              }}
              value={ubiAmount.value}
              onChange$={(e) => {
                ubiAmount.value = parseInt(e.target.value);
              }}
            >
              {[500, 1000, 1500, 2000, 2500, 3000].map((amount) => (
                <option key={amount} value={amount}>
                  ${amount}
                </option>
              ))}
            </select>
            <div
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: "16px", height: "16px" }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Flat Tax Percentage */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Flat Tax:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="range"
              min="1"
              max="99"
              value={flatTaxPercentage.value}
              onChange$={(e) => {
                flatTaxPercentage.value = parseInt(e.target.value);
              }}
              style={{ width: "100px", marginRight: "8px" }}
            />
            <span style={{ minWidth: "40px", textAlign: "right" }}>
              {flatTaxPercentage.value}%
            </span>
          </div>
        </div>

        {/* Exemption Amount */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Exemption:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={exemptionAmount.value}
              onChange$={(e) => {
                exemptionAmount.value = parseInt(e.target.value);
              }}
              style={{ width: "100px", marginRight: "8px" }}
            />
            <span style={{ minWidth: "40px", textAlign: "right" }}>
              ${exemptionAmount.value}k
            </span>
          </div>
        </div>

        {/* Summary */}
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            backgroundColor: "#f0f4ff",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
            Summary:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>
              Year: {selectedYear.value}
            </li>
            <li>
              Monthly UBI: ${ubiAmount.value}
            </li>
            <li>
              Yearly UBI: $
              {(ubiAmount.value * 12).toLocaleString()}
            </li>
            <li>
              Flat Tax Rate: {flatTaxPercentage.value}%
            </li>
            <li>
              Tax Exemption: ${exemptionAmount.value}k
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
});
