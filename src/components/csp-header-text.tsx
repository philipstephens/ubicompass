import { component$ } from "@builder.io/qwik";
import { clsx } from "clsx";

interface CspHeaderTextProps {
  title?: string;
  subTitle?: string;
  class?: string;
  headerFont?:
    | "font-sans"
    | "font-serif"
    | "font-mono"
    | "font-bold"
    | "font-semibold"
    | "font-medium"
    | "font-normal"
    | "font-light"
    | string;
  titleSize?:
    | "text-xs"
    | "text-sm"
    | "text-base"
    | "text-lg"
    | "text-xl"
    | "text-2xl"
    | "text-3xl"
    | "text-4xl"
    | "text-5xl"
    | string;
  subTitleSize?:
    | "text-xs"
    | "text-sm"
    | "text-base"
    | "text-lg"
    | "text-xl"
    | "text-2xl"
    | string;
}

export const CspHeaderText = component$((props: CspHeaderTextProps) => {
  const title = props.title || "Help Us End Poverty Forever!!";
  const subTitle = props.subTitle || "with a Universal Basic Income";
  const headerFont = props.headerFont || "font-sans";
  const titleSize = props.titleSize || "text-2xl";
  const subTitleSize = props.subTitleSize || "text-lg";

  return (
    <div
      class={clsx(
        "flex flex-col justify-center h-full w-full",
        headerFont,
        props.class
      )}
    >
      <h1 class={clsx(titleSize, "font-bold text-black")}>{title}</h1>
      <h2 class={clsx(subTitleSize, "text-black mt-2")}>{subTitle}</h2>
    </div>
  );
});
