import { component$, useSignal, $ } from "@builder.io/qwik";
import { IncomeRangeMinimal } from "~/components/income-range-minimal";
import type { DocumentHead } from "@builder.io/qwik-city";

/**
 * A minimal page that demonstrates the income range component
 * This page is designed to avoid circular reference issues
 */
export default component$(() => {
  // Local state
  const exemptionAmount = useSignal(24);
  const taxRate = useSignal(30);
  
  // Handle exemption amount change
  const handleExemptionChange = $((amount: number) => {
    exemptionAmount.value = amount;
    console.log("Exemption amount changed to:", amount);
  });
  
  return (
    <div style={{ 
      backgroundColor: "#f5f5f5", 
      minHeight: "100vh",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <h1 style={{ 
          fontSize: "24px", 
          fontWeight: "bold",
          marginBottom: "16px"
        }}>
          Minimal Income Range Demo
        </h1>
        
        <p style={{ marginBottom: "16px" }}>
          This is a minimal implementation of the income range component
          that avoids circular reference issues.
        </p>
        
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          marginTop: "32px"
        }}>
          {/* Controls */}
          <div style={{
            width: "300px",
            padding: "16px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px"
            }}>
              Controls
            </h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px"
              }}>
                Exemption Amount:
              </label>
              <select 
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }}
                value={exemptionAmount.value}
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
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px"
              }}>
                Tax Rate:
              </label>
              <select 
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }}
                value={taxRate.value}
                onChange$={(e) => taxRate.value = parseInt(e.target.value, 10)}
              >
                <option value={20}>20%</option>
                <option value={25}>25%</option>
                <option value={30}>30%</option>
                <option value={35}>35%</option>
                <option value={40}>40%</option>
              </select>
            </div>
          </div>
          
          {/* Income Range Component */}
          <div style={{ width: "300px" }}>
            <IncomeRangeMinimal 
              exemptionAmount={exemptionAmount.value} 
              taxRate={taxRate.value}
              onExemptionChange$={handleExemptionChange}
            />
          </div>
        </div>
        
        <div style={{ marginTop: "32px" }}>
          <a 
            href="/simple" 
            style={{
              backgroundColor: "#4a86e8",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Back to Simple Page
          </a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Minimal Income Range Demo",
  meta: [
    {
      name: "description",
      content: "A minimal implementation of the income range component",
    },
  ],
};
