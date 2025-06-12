import { component$ } from "@builder.io/qwik";
import { clsx } from "clsx";

interface Props {
  class?: string;
  style?: Record<string, string>;
}

export const ImgCspLogo = component$((props: Props) => {
  return (
    <img
      src="/resources/cspLogo.svg"
      class={clsx("inline-block", props.class)}
      alt="CSP Logo"
      style={{
        objectFit: "contain",
        display: "block",
        maxWidth: "100%",
        maxHeight: "100%",
        margin: "4px 4px 0 4px",
        padding: 0,
        verticalAlign: "middle",
        ...props.style,
      }}
      width="100"
      height="50"
    />
  );
});
