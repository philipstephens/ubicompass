import { component$, Slot, PropFunction, $ } from "@builder.io/qwik";
import { clsx } from "clsx";
import "./csp-card-component.css";

interface CspCardComponentProps {
  class?: string;
  backgroundColor?: string;
  title?: string | JSX.Element;
  content?: string;
  titleColor?: string;
  borderColor?: string;
  icon?: JSX.Element;
  headerBackgroundColor?: string;
  onIconClick$?: PropFunction<() => void>;
}

export const CspCardComponent = component$((props: CspCardComponentProps) => {
  // Default values - applying CONTRAST principle with complementary colors
  const backgroundColor = props.backgroundColor || "#f8f9fa";
  const borderColor = props.borderColor || "#e9ecef";
  const headerBackgroundColor = props.headerBackgroundColor || "#4a86e8";
  const titleColor = props.titleColor || "#ffffff";
  const title = props.title || "Card Title";

  return (
    <div
      class={clsx(
        // ALIGNMENT principle - consistent padding and margins
        "csp-card w-full rounded-lg shadow-md overflow-hidden m-0",
        props.class
      )}
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      {/* CONTRAST principle - header stands out from content */}
      <div
        class="card-header px-6 py-4 flex items-center"
        style={{
          backgroundColor: headerBackgroundColor,
        }}
      >
        {/* PROXIMITY principle - title and icon are grouped together */}
        <h3
          style={{
            color: titleColor,
            fontSize: "1.25rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            margin: 0,
            padding: 0,
          }}
        >
          <span>{title}</span>
          {/* Optional icon with explicit positioning */}
          {props.icon && props.onIconClick$ ? (
            <div
              onClick$={props.onIconClick$}
              style={{
                cursor: "pointer",
                marginLeft: "8px",
                display: "flex",
                alignItems: "center",
                padding: "4px",
                borderRadius: "4px",
                transition: "background-color 0.2s",
              }}
              onMouseOver$={(_, el) =>
                (el.style.backgroundColor = "rgba(255, 255, 255, 0.2)")
              }
              onMouseOut$={(_, el) =>
                (el.style.backgroundColor = "transparent")
              }
            >
              {props.icon}
            </div>
          ) : (
            props.icon
          )}
        </h3>
      </div>

      {/* REPETITION principle - consistent padding throughout */}
      <div class="card-content p-6">
        {/* If children are provided, render them, otherwise use the content prop */}
        <Slot>
          {props.content ||
            "This is the default content for the card. Please provide your own content through the content prop or children."}
        </Slot>
      </div>
    </div>
  );
});
