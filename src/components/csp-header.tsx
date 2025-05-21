import { component$ } from "@builder.io/qwik";
import { ImgCspLogo } from "./img-csp-logo";
import { TranslatableText } from "./translatable-text";
import { clsx } from "clsx";
import "./csp-header.css";

interface CspHeaderProps {
  class?: string;
  headerColor?: string;
  title?: string;
  subTitle?: string;
  headerFont?: string;
  titleSize?: string;
  subTitleSize?: string;
  height?:
    | "h-32"
    | "h-40"
    | "h-48"
    | "h-56"
    | "h-64"
    | "h-72"
    | "h-80"
    | "h-96"
    | string;
}

export const CspHeader = component$((props: CspHeaderProps) => {
  const headerColor = props.headerColor || "rgba(186, 164, 61, 1)"; // Default to specified RGB color if no color provided
  const headerHeight = props.height || "h-48"; // Default to h-48 (192px) if no height provided

  // Determine logo height based on header height
  let logoHeightClass = "h-12"; // Default (quarter of h-48)

  // Map header height to logo height
  if (headerHeight === "h-32") {
    logoHeightClass = "h-8";
  } else if (headerHeight === "h-40") {
    logoHeightClass = "h-10";
  } else if (headerHeight === "h-48") {
    logoHeightClass = "h-12";
  } else if (headerHeight === "h-56") {
    logoHeightClass = "h-14";
  } else if (headerHeight === "h-64") {
    logoHeightClass = "h-16";
  } else if (headerHeight === "h-72") {
    logoHeightClass = "h-18";
  } else if (headerHeight === "h-80") {
    logoHeightClass = "h-20";
  } else if (headerHeight === "h-96") {
    logoHeightClass = "h-24";
  }

  return (
    <div class="csp-header-container">
      <header
        class={clsx(
          "csp-header w-full border-b border-gray-700 shadow-md",
          headerHeight
        )}
        style={{
          backgroundColor: headerColor,
        }}
      >
        {/* Left side - Logo */}
        <div class="csp-header-logo">
          <ImgCspLogo class={clsx("w-32 m-1", logoHeightClass)} />
        </div>

        {/* Right side - Text Header */}
        <div class="csp-header-text-container">
          <h1
            class={clsx(
              "csp-header-title",
              props.titleSize || "text-2xl",
              props.headerFont,
              "text-center w-full"
            )}
          >
            <TranslatableText
              text={props.title || "Help Us End Poverty Forever!!"}
            />
          </h1>
          <h2
            class={clsx(
              "csp-header-subtitle",
              props.subTitleSize || "text-sm" /* Smaller size for subtitle */,
              props.headerFont,
              "text-center w-full"
            )}
          >
            <TranslatableText
              text={props.subTitle || "with a Universal Basic Income"}
            />
          </h2>
        </div>
      </header>
    </div>
  );
});
