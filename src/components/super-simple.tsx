import { component$ } from "@builder.io/qwik";

export const SuperSimple = component$(() => {
  console.log("SuperSimple component rendering");
  
  return (
    <div style="border: 10px solid purple; margin: 20px; padding: 20px; background-color: #f0f0ff;">
      <h1 style="color: purple; text-align: center; font-size: 24px; margin-bottom: 20px;">
        SUPER SIMPLE COMPONENT
      </h1>
      <p style="font-size: 18px; margin-bottom: 10px;">
        This is an extremely simple component with no dependencies.
      </p>
      <p style="font-size: 18px; margin-bottom: 10px;">
        If you can see this, then the component system is working correctly.
      </p>
      <div style="background-color: #e0e0ff; padding: 10px; border-radius: 5px;">
        <p style="font-weight: bold;">Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
});
