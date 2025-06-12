import { component$, PropFunction } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * Component for displaying the actions section with a rounded box
 */
export const ActionsBox = component$(
  ({
    onRefresh$,
  }: {
    onRefresh$: PropFunction<() => void>;
  }) => {
    return (
      <div style={{ 
        borderRadius: "24px", 
        overflow: "hidden", 
        border: "1px solid #c8e6c9", 
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginTop: "40px",
        marginBottom: "40px"
      }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: "#4caf50", 
          padding: "10px 15px", 
          textAlign: "center" 
        }}>
          <h4 style={{ 
            fontWeight: "bold", 
            fontSize: "18px", 
            margin: 0, 
            color: "white" 
          }}>
            <TranslatableText text="Actions" />
          </h4>
        </div>
        
        {/* Content */}
        <div style={{ padding: "20px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }}>
            <div>
              <p style={{ 
                color: "#4b5563", 
                marginBottom: "8px" 
              }}>
                <TranslatableText text="Click the button to refresh all calculations with the current parameters." />
              </p>
              <p style={{ 
                fontSize: "14px", 
                color: "#9ca3af" 
              }}>
                <TranslatableText text="Last updated:" /> {new Date().toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick$={onRefresh$}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                padding: "8px 24px",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "500",
                transition: "background-color 0.2s"
              }}
              onMouseOver$={(event) => {
                (event.target as HTMLElement).style.backgroundColor = "#43a047";
              }}
              onMouseOut$={(event) => {
                (event.target as HTMLElement).style.backgroundColor = "#4caf50";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clip-rule="evenodd"
                />
              </svg>
              <TranslatableText text="Refresh Data" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
