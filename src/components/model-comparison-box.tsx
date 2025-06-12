import { component$ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";
import { ModelComparisonSection } from "./model-comparison-section";

/**
 * Component for displaying the model comparison section with a rounded box
 */
export const ModelComparisonBox = component$(() => {
  return (
    <div style={{ 
      borderRadius: "24px", 
      overflow: "hidden", 
      border: "1px solid #d1c4e9", 
      backgroundColor: "white",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      marginTop: "40px",
      marginBottom: "40px"
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: "#673ab7", 
        padding: "10px 15px", 
        textAlign: "center" 
      }}>
        <h4 style={{ 
          fontWeight: "bold", 
          fontSize: "18px", 
          margin: 0, 
          color: "white" 
        }}>
          <TranslatableText text="Tax Model Comparison" />
        </h4>
      </div>
      
      {/* Content */}
      <div style={{ padding: "20px" }}>
        <ModelComparisonSection />
      </div>
    </div>
  );
});
