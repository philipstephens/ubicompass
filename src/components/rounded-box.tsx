import { component$, Slot } from "@builder.io/qwik";

/**
 * A reusable rounded box component with customizable title and colors
 */
export const RoundedBox = component$(
  ({
    title,
    titleBackgroundColor = "#4a86e8",
    titleTextColor = "white",
    backgroundColor = "white",
    borderColor = "#e5e7eb",
    className = "",
  }: {
    title: string | JSX.Element;
    titleBackgroundColor?: string;
    titleTextColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    className?: string;
  }) => {
    return (
      <div
        class={`rounded-3xl shadow-md overflow-hidden border ${className}`}
        style={{
          backgroundColor,
          borderColor,
          borderRadius: "24px", // Ensure border radius is applied
        }}
      >
        <div
          class="px-6 py-3 font-bold text-lg"
          style={{
            backgroundColor: titleBackgroundColor,
            color: titleTextColor,
          }}
        >
          {title}
        </div>
        <div class="p-6">
          <Slot />
        </div>
      </div>
    );
  }
);
