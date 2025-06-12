// Simple script to check if the chart is displayed
console.log("Checking if chart is displayed...");

// Function to check if an element exists and is visible
function isElementVisible(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.log(`Element not found: ${selector}`);
    return false;
  }
  
  const style = window.getComputedStyle(element);
  const isVisible = style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0';
  
  console.log(`Element ${selector} exists and is ${isVisible ? 'visible' : 'hidden'}`);
  return isVisible;
}

// Check if we're on the right page
if (window.location.href.includes('localhost:5173')) {
  console.log("On the UBI Calculator page");
  
  // Check if the chart container exists
  setTimeout(() => {
    // Check if we're in chart view
    const chartView = isElementVisible('.basic-bar-chart') || 
                     isElementVisible('[class*="chart"]') ||
                     isElementVisible('[style*="height: 400px"]');
    
    // Check if we're in table view
    const tableView = isElementVisible('table') || 
                     isElementVisible('.quintile-data-table');
    
    console.log(`Chart view: ${chartView}`);
    console.log(`Table view: ${tableView}`);
    
    // Try to find the toggle button
    const toggleButton = document.querySelector('button[onclick*="toggle"]') || 
                        document.querySelector('button:has(svg)');
    
    if (toggleButton) {
      console.log("Found toggle button");
      console.log("Button text:", toggleButton.innerText);
    } else {
      console.log("Toggle button not found");
    }
    
    console.log("Check complete");
  }, 3000); // Wait 3 seconds for the page to fully load
} else {
  console.log("Not on the UBI Calculator page");
}
