import { component$ } from "@builder.io/qwik";
import { CspCardComponent } from "./csp-card-component";

/**
 * Simple test component to verify that the UI is working
 */
export const TestComponent = component$(() => {
  return (
    <CspCardComponent
      title="Test Component"
      backgroundColor="#ffffff"
      headerBackgroundColor="#4a86e8"
      borderColor="#d0e0fc"
    >
      <div class="p-4">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 class="text-blue-800 font-medium text-lg mb-2">
            This is a test component
          </h3>
          <p class="text-blue-600 text-sm">
            If you can see this, the basic UI is working.
          </p>
        </div>
      </div>
    </CspCardComponent>
  );
});
