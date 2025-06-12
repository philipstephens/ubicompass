import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6">Simple CSS Bar Test</h1>
      
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Static CSS Bar</h2>
        <div class="w-full h-8 bg-gray-200 rounded">
          <div class="h-full bg-blue-500 rounded" style={{ width: "50%" }}></div>
        </div>
      </div>
      
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Inline Style Bar</h2>
        <div class="w-full h-8 bg-gray-200 rounded">
          <div 
            class="h-full bg-green-500 rounded" 
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>
      
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Dynamic Width Bar</h2>
        <div class="w-full h-8 bg-gray-200 rounded">
          <div 
            class="h-full bg-purple-500 rounded flex items-center justify-end px-2 text-white"
            style={{ width: `${30 * 2}px` }}
          >
            60px wide
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Percentage Width Bar</h2>
        <div class="w-full h-8 bg-gray-200 rounded">
          <div 
            class="h-full bg-red-500 rounded flex items-center justify-end px-2 text-white"
            style={{ width: `${(40 / 100) * 100}%` }}
          >
            40% wide
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Simple CSS Bar Test",
  meta: [
    {
      name: "description",
      content: "Testing simple CSS bars in Qwik",
    },
  ],
};
