import { component$ } from "@builder.io/qwik";
import { LanguageSelector } from "./language-selector";

export const Header = component$(() => {
  return (
    <header class="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="text-xl font-bold">UBI Compass</h1>
      </div>
      <div class="flex items-center space-x-4">
        <LanguageSelector />
      </div>
    </header>
  );
});