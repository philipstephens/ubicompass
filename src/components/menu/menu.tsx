import { component$ } from "@builder.io/qwik";
import { CspHeader } from "~/components/csp-header";
import { MenuComponent } from "~/components/menu-component";

/**
 * Menu component that combines the CspHeader and MenuComponent
 */
export const Menu = component$((props: { language: string }) => {
  return (
    <>
      <div class="header-container">
        <CspHeader
          headerColor="rgba(186, 164, 61, 1)"
          height="h-64"
          title="Help Us End Poverty Forever!!"
          subTitle="with a Universal Basic Income"
          titleSize="text-3xl"
          subTitleSize="text-sm"
          language={props.language}
        />
      </div>

      <div class="menu-container">
        <MenuComponent
          backgroundColor="rgb(255, 215, 0)"
          textColor="rgb(255, 0, 0)"
          height="h-4"
        />
      </div>
    </>
  );
});
