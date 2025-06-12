import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import "./styles.css";

export default component$(() => {
  return (
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-4">Test Rounded Box</h1>

      {/* Simple Rounded Box with Purple Header */}
      <div class="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md max-w-md">
        {/* Purple header */}
        <div class="bg-purple-500 text-white px-4 py-2 text-center">
          <h4 class="font-bold text-lg">UBI Calculator Parameters</h4>
        </div>

        {/* Simple content */}
        <div class="p-5">
          <p>This is a test of a rounded box with a purple header.</p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Test Rounded Box",
};
