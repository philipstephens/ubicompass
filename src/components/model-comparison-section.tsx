import { component$ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * Component for displaying model comparison section
 */
export const ModelComparisonSection = component$(() => {
  return (
    <div>
      <div>
        <div class="mb-4">
          <p class="text-gray-600 mb-3">
            <TranslatableText text="Compare different tax models to see their impact on income and government revenue." />
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-6">
            {/* Model Selection */}
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3
                style={{
                  marginTop: "8px",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#374151",
                  marginBottom: "0.75rem",
                }}
              >
                <TranslatableText text="Select Tax Models to Compare:" />
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#fffbeb", // Very light yellow
                    borderRadius: "6px",
                    border: "1px solid #fef3c7",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "#4f46e5",
                    }}
                    checked={true}
                    disabled={true}
                  />
                  <span
                    style={{
                      marginLeft: "12px",
                      color: "#4b5563",
                      fontWeight: "500",
                    }}
                  >
                    <TranslatableText text="Flat Tax" />
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#fffbeb", // Very light yellow
                    borderRadius: "6px",
                    border: "1px solid #fef3c7",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "#4f46e5",
                    }}
                  />
                  <span
                    style={{
                      marginLeft: "12px",
                      color: "#4b5563",
                      fontWeight: "500",
                    }}
                  >
                    <TranslatableText text="Progressive Tax" />
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#fffbeb", // Very light yellow
                    borderRadius: "6px",
                    border: "1px solid #fef3c7",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "#4f46e5",
                    }}
                  />
                  <span
                    style={{
                      marginLeft: "12px",
                      color: "#4b5563",
                      fontWeight: "500",
                    }}
                  >
                    <TranslatableText text="Bell Curve (Gaussian)" />
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#fffbeb", // Very light yellow
                    borderRadius: "6px",
                    border: "1px solid #fef3c7",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "#4f46e5",
                    }}
                  />
                  <span
                    style={{
                      marginLeft: "12px",
                      color: "#4b5563",
                      fontWeight: "500",
                    }}
                  >
                    <TranslatableText text="Percentile-Matched" />
                  </span>
                </label>
              </div>
            </div>

            {/* UBI Toggle */}
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3
                style={{
                  marginTop: "8px",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#374151",
                  marginBottom: "0.75rem",
                }}
              >
                <TranslatableText text="UBI Options:" />
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#fffbeb", // Very light yellow
                    borderRadius: "6px",
                    border: "1px solid #fef3c7",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "#4f46e5",
                    }}
                    checked={true}
                    disabled={true}
                  />
                  <span
                    style={{
                      marginLeft: "12px",
                      color: "#4b5563",
                      fontWeight: "500",
                    }}
                  >
                    <TranslatableText text="With UBI" />
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#fffbeb", // Very light yellow
                    borderRadius: "6px",
                    border: "1px solid #fef3c7",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "#4f46e5",
                    }}
                  />
                  <span
                    style={{
                      marginLeft: "12px",
                      color: "#4b5563",
                      fontWeight: "500",
                    }}
                  >
                    <TranslatableText text="Without UBI" />
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-800 mb-4">
            <TranslatableText text="Note: Model comparison feature is under development. Currently showing Flat Tax with UBI only." />
          </div>

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
            <h3
              style={{
                marginTop: "8px",
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#374151",
                marginBottom: "0.75rem",
              }}
            >
              <TranslatableText text="About Tax Models:" />
            </h3>
            <div class="space-y-3 text-sm">
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    fontSize: "1.05rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <TranslatableText text="Flat Tax:" />
                </div>
                <div class="text-gray-600">
                  <TranslatableText text="Applies the same tax rate to all income (or income above exemption with UBI)." />
                </div>
                <div style={{ height: "1rem" }}></div>
              </div>

              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    fontSize: "1.05rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <TranslatableText text="Progressive Tax:" />
                </div>
                <div class="text-gray-600">
                  <TranslatableText text="Uses multiple tax brackets with increasing rates for higher incomes." />
                </div>
                <div style={{ height: "1rem" }}></div>
              </div>

              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    fontSize: "1.05rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <TranslatableText text="Bell Curve (Gaussian):" />
                </div>
                <div class="text-gray-600">
                  <TranslatableText text="Applies a bell-shaped distribution to tax rates, with highest rates near the 90th percentile." />
                </div>
                <div style={{ height: "1rem" }}></div>
              </div>

              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    fontSize: "1.05rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <TranslatableText text="Percentile-Matched:" />
                </div>
                <div class="text-gray-600">
                  <TranslatableText text="If your income is in the 75th percentile, your tax burden will be in the 75th percentile of all tax burdens." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
