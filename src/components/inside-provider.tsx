import { component$ } from "@builder.io/qwik";

export const InsideProvider = component$(() => {
  console.log("InsideProvider component rendering");
  
  return (
    <div style="border: 10px dashed green; margin: 20px; padding: 20px; background-color: #f0fff0;">
      <h1 style="color: green; text-align: center; font-size: 24px; margin-bottom: 20px;">
        INSIDE PROVIDER COMPONENT
      </h1>
      <p style="font-size: 18px; margin-bottom: 10px;">
        This is an extremely simple component designed to be used inside the UbiDataProvider.
      </p>
      <p style="font-size: 18px; margin-bottom: 10px;">
        If you can see this, then components inside the UbiDataProvider are rendering correctly.
      </p>
      <div style="background-color: #e0ffe0; padding: 10px; border-radius: 5px;">
        <p style="font-weight: bold;">Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
});
