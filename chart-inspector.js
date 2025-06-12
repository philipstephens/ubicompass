// Chart Inspector Script
// This script helps inspect the chart component and provide feedback

// Configuration
const config = {
  scrollDelay: 1000,      // Delay before scrolling (ms)
  inspectionDelay: 2000,  // Delay before inspection (ms)
  logElementDetails: true, // Log detailed element information
  captureMetrics: true,    // Capture performance metrics
};

// Main inspection function
async function inspectChart() {
  console.log("🔍 Chart Inspector starting...");
  console.log(`📊 Page URL: ${window.location.href}`);
  console.log(`🖥️ Viewport size: ${window.innerWidth}x${window.innerHeight}`);
  
  // Wait for initial page load
  await wait(config.scrollDelay);
  
  // Find the chart component
  const chartComponent = findChartComponent();
  
  if (!chartComponent) {
    console.error("❌ Chart component not found!");
    return;
  }
  
  // Scroll to the chart component
  scrollToElement(chartComponent);
  console.log(`✅ Scrolled to chart component`);
  
  // Wait for any animations to complete
  await wait(config.inspectionDelay);
  
  // Inspect the chart
  inspectChartComponent(chartComponent);
  
  // Check toggle functionality
  checkToggleButton();
  
  console.log("🏁 Chart inspection complete");
}

// Helper function to find the chart component
function findChartComponent() {
  // Try various selectors that might match the chart component
  const selectors = [
    // Container selectors
    '.ubi-impact-chart',
    '[data-component="chart"]',
    '.chart-container',
    // Header selectors
    'h4:contains("UBI Impact by Income Quintile")',
    'div:contains("UBI Impact by Income Quintile")',
    // Parent container selectors
    '.table-section',
    '.calculation-table-container',
  ];
  
  // Try each selector
  for (const selector of selectors) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`✅ Found chart component using selector: ${selector}`);
        return elements[0];
      }
    } catch (e) {
      // Some selectors might not be valid, ignore errors
    }
  }
  
  // Fallback: look for any element that might be the chart
  const possibleChartElements = [
    ...document.querySelectorAll('div[style*="height: 400px"]'),
    ...document.querySelectorAll('div[style*="height: 300px"]'),
    ...document.querySelectorAll('div.flex.h-full'),
    ...document.querySelectorAll('div.chart'),
    ...document.querySelectorAll('div.bar-chart'),
  ];
  
  if (possibleChartElements.length > 0) {
    console.log(`✅ Found possible chart component using fallback selectors`);
    return possibleChartElements[0];
  }
  
  // Last resort: look for purple headers
  const purpleHeaders = [...document.querySelectorAll('div[style*="backgroundColor: \\"#673ab7\\""]')];
  if (purpleHeaders.length > 0) {
    console.log(`✅ Found purple header, using parent container`);
    return purpleHeaders[0].closest('div[style*="borderRadius"]');
  }
  
  return null;
}

// Helper function to scroll to an element
function scrollToElement(element) {
  if (!element) return;
  
  // Get the element's position
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Calculate the target scroll position (slightly above the element)
  const targetPosition = rect.top + scrollTop - 100;
  
  // Scroll to the element
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  
  // Highlight the element temporarily
  const originalOutline = element.style.outline;
  element.style.outline = '3px solid red';
  setTimeout(() => {
    element.style.outline = originalOutline;
  }, 2000);
}

// Helper function to inspect the chart component
function inspectChartComponent(component) {
  if (!component) return;
  
  console.log(`\n📊 Chart Component Inspection:`);
  
  // Check if we're in chart or table view
  const isChartView = checkIfChartView(component);
  console.log(`📈 Current view: ${isChartView ? 'Chart View' : 'Table View'}`);
  
  // Get component dimensions
  const rect = component.getBoundingClientRect();
  console.log(`📏 Dimensions: ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
  
  // Check for chart bars
  const bars = findChartBars(component);
  console.log(`🧮 Chart bars found: ${bars.length}`);
  
  if (bars.length > 0) {
    console.log(`🔍 Bar details:`);
    bars.forEach((bar, index) => {
      const barRect = bar.getBoundingClientRect();
      const height = Math.round(barRect.height);
      const color = getComputedStyle(bar).backgroundColor;
      console.log(`   Bar ${index+1}: Height=${height}px, Color=${color}`);
    });
  }
  
  // Check for labels
  const labels = findChartLabels(component);
  console.log(`🏷️ Labels found: ${labels.length}`);
  
  if (config.logElementDetails) {
    logElementDetails(component);
  }
}

// Helper function to check if we're in chart view
function checkIfChartView(component) {
  if (!component) return false;
  
  // Check for chart-specific elements
  const hasChartBars = findChartBars(component).length > 0;
  const hasTable = component.querySelector('table') !== null;
  
  return hasChartBars && !hasTable;
}

// Helper function to find chart bars
function findChartBars(component) {
  if (!component) return [];
  
  // Look for elements that might be chart bars
  return [
    ...component.querySelectorAll('div[style*="height"][style*="%"]'),
    ...component.querySelectorAll('div.bg-blue-500'),
    ...component.querySelectorAll('div.bg-green-500'),
    ...component.querySelectorAll('div[class*="bar"]'),
  ];
}

// Helper function to find chart labels
function findChartLabels(component) {
  if (!component) return [];
  
  // Look for elements that might be chart labels
  return [
    ...component.querySelectorAll('div.text-xs'),
    ...component.querySelectorAll('div[style*="text-align: center"]'),
    ...component.querySelectorAll('div.font-bold'),
  ];
}

// Helper function to check toggle button
function checkToggleButton() {
  // Look for the toggle button
  const toggleButtons = [
    ...document.querySelectorAll('button svg[viewBox="0 0 20 20"]'),
    ...document.querySelectorAll('button:has(svg)'),
    ...document.querySelectorAll('span.chart-icon-container'),
  ];
  
  if (toggleButtons.length === 0) {
    console.log(`❌ Toggle button not found`);
    return;
  }
  
  const toggleButton = toggleButtons[0].closest('button') || toggleButtons[0];
  console.log(`✅ Found toggle button`);
  
  // Get button text
  const buttonText = toggleButton.innerText.trim();
  if (buttonText) {
    console.log(`📝 Button text: "${buttonText}"`);
  }
  
  // Check if the button is visible
  const buttonRect = toggleButton.getBoundingClientRect();
  const isVisible = buttonRect.width > 0 && buttonRect.height > 0;
  console.log(`👁️ Button visibility: ${isVisible ? 'Visible' : 'Hidden'}`);
}

// Helper function to log element details
function logElementDetails(element) {
  if (!element) return;
  
  console.log(`\n🔍 Element Details:`);
  console.log(`📝 Tag name: ${element.tagName.toLowerCase()}`);
  console.log(`📝 Class list: ${element.className}`);
  
  // Get computed style
  const style = window.getComputedStyle(element);
  console.log(`🎨 Background color: ${style.backgroundColor}`);
  console.log(`📏 Width: ${style.width}`);
  console.log(`📏 Height: ${style.height}`);
  console.log(`🔲 Border radius: ${style.borderRadius}`);
  console.log(`📊 Display: ${style.display}`);
  console.log(`📊 Position: ${style.position}`);
  console.log(`📊 Visibility: ${style.visibility}`);
  console.log(`📊 Opacity: ${style.opacity}`);
}

// Helper function to wait
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the inspection after the page has loaded
window.addEventListener('load', () => {
  // Wait a bit for any dynamic content to load
  setTimeout(inspectChart, 1000);
});

// Log that the script has been loaded
console.log("📊 Chart Inspector script loaded");
