import { component$ } from "@builder.io/qwik";

export const SimpleTest = component$(() => {
  console.log("SimpleTest component rendering");
  
  return (
    <div style="background-color: pink; padding: 20px; margin: 20px; border: 2px solid red;">
      <h2>Simple Test Component</h2>
      <p>This is a simple test component to see if it renders correctly.</p>
      <p>If you can see this, then the component system is working.</p>
    </div>
  );
});
