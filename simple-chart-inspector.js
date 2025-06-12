// Simple Chart Inspector
// Copy this entire script and paste it into your browser console
// while viewing the UBI Calculator

(function() {
  console.clear();
  console.log('📊 UBI Chart Inspector Running...');
  
  // Find the chart component
  const purpleHeaders = [...document.querySelectorAll('div[style*="backgroundColor: \\"#673ab7\\""]')];
  let chartComponent = null;
  
  if (purpleHeaders.length > 0) {
    chartComponent = purpleHeaders[0].closest('div[style*="borderRadius"]');
    console.log('✅ Found chart component via purple header');
  } else {
    console.error('❌ Chart component not found!');
    return;
  }
  
  // Scroll to the component
  const rect = chartComponent.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetPosition = rect.top + scrollTop - 100;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  
  // Highlight the component
  const originalOutline = chartComponent.style.outline;
  chartComponent.style.outline = '3px solid red';
  setTimeout(() => {
    chartComponent.style.outline = originalOutline;
  }, 2000);
  
  // Check if we're in chart or table view
  const chartBars = [
    ...chartComponent.querySelectorAll('div[style*="height"][style*="%"]'),
    ...chartComponent.querySelectorAll('div.bg-blue-500'),
    ...chartComponent.querySelectorAll('div.bg-green-500')
  ];
  
  const hasTable = chartComponent.querySelector('table') !== null;
  const isChartView = chartBars.length > 0 && !hasTable;
  
  console.log(`📈 Current view: ${isChartView ? 'Chart View' : 'Table View'}`);
  console.log(`🧮 Chart bars found: ${chartBars.length}`);
  
  // Find the toggle button
  const toggleButtons = [
    ...document.querySelectorAll('button svg[viewBox="0 0 20 20"]'),
    ...document.querySelectorAll('button:has(svg)'),
    ...document.querySelectorAll('span.chart-icon-container')
  ];
  
  if (toggleButtons.length > 0) {
    const toggleButton = toggleButtons[0].closest('button') || toggleButtons[0];
    console.log('✅ Found toggle button');
    
    // Ask if user wants to click the toggle button
    if (confirm('Do you want to toggle between chart and table view?')) {
      toggleButton.click();
      console.log('✅ Clicked toggle button');
    }
  } else {
    console.log('❌ Toggle button not found');
  }
  
  console.log('🏁 Chart inspection complete');
})();
