import { component$ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";
import { TaxCalculationExplanation } from "./tax-calculation-explanation";

/**
 * Component for displaying the explanation section with rounded boxes
 */
export const ExplanationSection = component$(
  ({
    taxModel,
    modelId,
    exampleTaxAmount,
    ubiCost,
    additionalRevenue,
    netCost,
    taxpayersPerQuintile,
    ubiAmount,
  }: {
    taxModel: any;
    modelId: number;
    exampleTaxAmount: number;
    ubiCost: number;
    additionalRevenue: number;
    netCost: number;
    taxpayersPerQuintile: number;
    ubiAmount: number;
  }) => {
    return (
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "24px",
        marginTop: "40px",
        marginBottom: "40px"
      }}>
        {/* How Taxes Are Calculated Box */}
        <div style={{ 
          borderRadius: "24px", 
          overflow: "hidden", 
          border: "1px solid #c8e6ff", 
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          height: "100%"
        }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: "#2196f3", 
            padding: "10px 15px", 
            textAlign: "center" 
          }}>
            <h4 style={{ 
              fontWeight: "bold", 
              fontSize: "18px", 
              margin: 0, 
              color: "white" 
            }}>
              <TranslatableText text="How Taxes Are Calculated" />
            </h4>
          </div>
          
          {/* Content */}
          <div style={{ padding: "20px" }}>
            <TaxCalculationExplanation
              taxModel={taxModel}
              modelId={modelId}
              exampleTaxAmount={exampleTaxAmount}
            />
          </div>
        </div>
        
        {/* UBI Impact Summary Box */}
        <div style={{ 
          borderRadius: "24px", 
          overflow: "hidden", 
          border: "1px solid #b2ebf2", 
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          height: "100%"
        }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: "#00acc1", 
            padding: "10px 15px", 
            textAlign: "center" 
          }}>
            <h4 style={{ 
              fontWeight: "bold", 
              fontSize: "18px", 
              margin: 0, 
              color: "white" 
            }}>
              <TranslatableText text="UBI Impact Summary" />
            </h4>
          </div>
          
          {/* Content */}
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h5 style={{ 
                  fontWeight: "500", 
                  color: "#00838f", 
                  marginBottom: "8px" 
                }}>
                  <TranslatableText text="Total UBI Cost" />
                </h5>
                <div style={{ 
                  backgroundColor: "#e0f7fa", 
                  padding: "16px", 
                  borderRadius: "8px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}>
                  <span style={{ color: "#00838f" }}>
                    <TranslatableText text="Annual UBI payments to all taxpayers:" />
                  </span>
                  <span style={{ 
                    fontWeight: "bold", 
                    fontSize: "18px", 
                    color: "#00838f" 
                  }}>
                    ${ubiCost}B
                  </span>
                </div>
              </div>
              
              <div>
                <h5 style={{ 
                  fontWeight: "500", 
                  color: "#00838f", 
                  marginBottom: "8px" 
                }}>
                  <TranslatableText text="Additional Tax Revenue" />
                </h5>
                <div style={{ 
                  backgroundColor: "#e0f7fa", 
                  padding: "16px", 
                  borderRadius: "8px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}>
                  <span style={{ color: "#00838f" }}>
                    <TranslatableText text="Increased tax revenue with UBI:" />
                  </span>
                  <span style={{ 
                    fontWeight: "bold", 
                    fontSize: "18px", 
                    color: "#00838f" 
                  }}>
                    ${additionalRevenue}B
                  </span>
                </div>
              </div>
              
              <div>
                <h5 style={{ 
                  fontWeight: "500", 
                  color: "#00838f", 
                  marginBottom: "8px" 
                }}>
                  <TranslatableText text="Net Program Cost" />
                </h5>
                <div style={{ 
                  backgroundColor: "#e0f7fa", 
                  padding: "16px", 
                  borderRadius: "8px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}>
                  <span style={{ color: "#00838f" }}>
                    <TranslatableText text="Total cost after additional tax revenue:" />
                  </span>
                  <span style={{ 
                    fontWeight: "bold", 
                    fontSize: "18px", 
                    color: "#d32f2f" 
                  }}>
                    ${netCost}B
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
