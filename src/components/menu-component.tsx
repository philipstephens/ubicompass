import { component$ } from "@builder.io/qwik";
import { clsx } from "clsx";
import { LanguageSelector } from "./language-selector";
import { TranslatableText } from "./translatable-text";
import "./menu-component.css";

interface MenuComponentProps {
  class?: string;
  backgroundColor?: string;
  textColor?: string;
  height?:
    | "h-1"
    | "h-2"
    | "h-3"
    | "h-4"
    | "h-5"
    | "h-6"
    | "h-8"
    | "h-10"
    | "h-12"
    | string;
}

export const MenuComponent = component$((props: MenuComponentProps) => {
  const backgroundColor = props.backgroundColor || "rgb(255, 215, 0)"; // Default to gold color
  const textColor = props.textColor || "rgb(255, 0, 0)"; // Default to red color
  const menuHeight = props.height || "h-4"; // Default to h-4 (twice the original height)

  return (
    <div
      class={clsx(
        "menu-component",
        menuHeight,
        "shadow-lg relative z-10",
        props.class
      )}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <nav class="menu-nav">
        <a href="#" class="menu-link" style={{ color: textColor }}>
          <TranslatableText text="Home" />
        </a>
        <a href="#" class="menu-link" style={{ color: textColor }}>
          <TranslatableText text="About" />
        </a>
        <a href="#" class="menu-link" style={{ color: textColor }}>
          <TranslatableText text="Services" />
        </a>
        <a href="#" class="menu-link" style={{ color: textColor }}>
          <TranslatableText text="Contact" />
        </a>

        {/* Language Selector */}
        <div class="menu-language-selector">
          <LanguageSelector />
        </div>
      </nav>
    </div>
  );
});
