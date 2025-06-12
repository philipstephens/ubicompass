import { component$, useSignal, useTask$, useVisibleTask$, $, QRL } from '@builder.io/qwik';
import { TaxEntry } from '../models/income-data';

interface SvgChartProps {
  taxEntries: TaxEntry[];
  calculateIncomeWithUBI: QRL<(entry: TaxEntry) => number>;
  calculateTaxPaid: QRL<(income: number) => number>;
  ubiAmount: number;
  flatTaxPercentage: number;
  exemptionAmount: number;
  view: 'income' | 'cost';
}

export const SvgChart = component$<SvgChartProps>(({
  taxEntries,
  calculateIncomeWithUBI,
  calculateTaxPaid,
  ubiAmount,
  flatTaxPercentage,
  exemptionAmount,
  view
}) => {
  const chartRef = useSignal<HTMLElement | null>(null);
  const updateTrigger = useSignal(0);

  // Function to create SVG elements
  const createSvgElement = $((type: string, attributes: Record<string, string> = {}) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    return element;
  });

  // Function to get decile description
  const getDecileDescription = $((decile: number) => {
    switch (decile) {
      case 1: return "Lowest 10%";
      case 2: return "10-20%";
      case 3: return "20-30%";
      case 4: return "30-40%";
      case 5: return "40-50%";
      case 6: return "50-60%";
      case 7: return "60-70%";
      case 8: return "70-80%";
      case 9: return "80-90%";
      case 10: return "Highest 10%";
      default: return `Decile ${decile}`;
    }
  });

  // Calculate break-even income
  const calculateBreakEvenIncome = $(() => {
    const ubi = ubiAmount;
    const taxRate = flatTaxPercentage / 100;
    const exemptAmount = exemptionAmount;

    // For flat tax with exemption:
    // Break-even occurs when: income = (UBI / taxRate) + exemptAmount - UBI
    return (ubi / taxRate) + exemptAmount - ubi;
  });

  // Calculate UBI cost and revenue
  const calculateUbiCostAndRevenue = $(async () => {
    const ubi = ubiAmount;
    const taxpayersPerDecile = 1.5; // In millions (15 million taxpayers / 10 deciles)

    // Calculate for each decile
    const decileResults = await Promise.all(taxEntries.map(async (entry) => {
      const income = entry.averagetaxableincome || 0;
      const taxPaid = await calculateTaxPaid(income);
      const ubiPayment = ubi;

      return {
        decile: 'decile' in entry ? (entry as any).decile : 0,
        income: income,
        ubiPayment: ubiPayment,
        taxRevenue: taxPaid,
        netCost: ubiPayment - taxPaid,
        taxpayers: taxpayersPerDecile
      };
    }));

    // Calculate totals
    const totalUbiCost = decileResults.reduce((sum, entry) => sum + entry.ubiPayment * entry.taxpayers, 0);
    const totalTaxRevenue = decileResults.reduce((sum, entry) => sum + entry.taxRevenue * entry.taxpayers, 0);
    const totalNetCost = totalUbiCost - totalTaxRevenue;

    return {
      decileResults: decileResults,
      totalUbiCost: totalUbiCost,
      totalTaxRevenue: totalTaxRevenue,
      totalNetCost: totalNetCost
    };
  });

  // Update the chart when parameters change
  useTask$(({ track }) => {
    track(() => taxEntries);
    track(() => ubiAmount);
    track(() => flatTaxPercentage);
    track(() => exemptionAmount);
    track(() => view);

    // Trigger a chart update
    updateTrigger.value = Date.now();
  });

  // Render the chart when it becomes visible
  useVisibleTask$(async ({ track }) => {
    track(() => updateTrigger.value);

    if (!chartRef.value) return;

    // Clear the chart
    chartRef.value.innerHTML = '';

    if (view === 'income') {
      await renderIncomeChart();
    } else {
      await renderCostChart();
    }
  });

  // Render the income chart
  const renderIncomeChart = $(async () => {
    if (!chartRef.value || !taxEntries.length) return;

    const svg = chartRef.value;

    // Chart dimensions and margins
    const margin = { top: 40, right: 120, bottom: 80, left: 80 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create chart group with margin
    const g = createSvgElement('g', {
      transform: `translate(${margin.left}, ${margin.top})`
    });
    svg.appendChild(g);

    // Calculate maximum income for scaling
    const maxIncome = Math.max(
      ...await Promise.all(taxEntries.map(async (entry) => {
        const avgIncome = entry.averagetaxableincome || 0;
        const incomeWithUBI = await calculateIncomeWithUBI(entry);
        return Math.max(avgIncome, incomeWithUBI);
      }))
    );

    // Round up to nearest 50k for y-axis scale
    const yMax = Math.ceil(maxIncome / 50) * 50;

    // Calculate break-even income
    const breakEvenIncome = await calculateBreakEvenIncome();

    // Calculate scales
    const barWidth = 30;
    const barSpacing = width / taxEntries.length;
    const yScale = height / yMax;

    // Draw axes
    const xAxis = createSvgElement('line', {
      x1: '0',
      y1: `${height}`,
      x2: `${width}`,
      y2: `${height}`,
      class: 'axis-line'
    });
    g.appendChild(xAxis);

    const yAxis = createSvgElement('line', {
      x1: '0',
      y1: '0',
      x2: '0',
      y2: `${height}`,
      class: 'axis-line'
    });
    g.appendChild(yAxis);

    // Draw grid lines and y-axis labels
    for (let i = 0; i <= 5; i++) {
      const y = height - (i * height / 5);
      const value = (i * yMax / 5);

      // Grid line
      const gridLine = createSvgElement('line', {
        x1: '0',
        y1: `${y}`,
        x2: `${width}`,
        y2: `${y}`,
        class: 'grid-line'
      });
      g.appendChild(gridLine);

      // Y-axis label
      const yLabel = createSvgElement('text', {
        x: '-10',
        y: `${y + 5}`,
        class: 'y-axis-label'
      });
      yLabel.textContent = `$${value}k`;
      g.appendChild(yLabel);
    }

    // Draw break-even line if it's within the chart range
    if (breakEvenIncome > 0 && breakEvenIncome <= yMax) {
      const breakEvenY = height - (breakEvenIncome * yScale);

      const breakEvenLine = createSvgElement('line', {
        x1: '0',
        y1: `${breakEvenY}`,
        x2: `${width}`,
        y2: `${breakEvenY}`,
        class: 'break-even-line'
      });
      g.appendChild(breakEvenLine);

      // Break-even label
      const breakEvenLabel = createSvgElement('text', {
        x: `${width + 10}`,
        y: `${breakEvenY + 5}`,
        class: 'break-even-label'
      });
      breakEvenLabel.textContent = `Break-even: $${Math.round(breakEvenIncome)}k`;
      g.appendChild(breakEvenLabel);
    }

    // Calculate tax points for the line
    const taxPoints = await Promise.all(taxEntries.map(async (entry, index) => {
      const income = entry.averagetaxableincome || 0;
      const taxPaid = await calculateTaxPaid(income);
      const x = index * barSpacing + barSpacing / 2;
      const y = height - (taxPaid * yScale);
      return { x, y, value: taxPaid };
    }));

    // Draw tax line
    let taxLinePath = `M ${taxPoints[0].x} ${taxPoints[0].y}`;
    for (let i = 1; i < taxPoints.length; i++) {
      taxLinePath += ` L ${taxPoints[i].x} ${taxPoints[i].y}`;
    }

    const taxLine = createSvgElement('path', {
      d: taxLinePath,
      class: 'tax-line'
    });
    g.appendChild(taxLine);

    // Draw tax points and labels
    for (let i = 0; i < taxPoints.length; i++) {
      const point = taxPoints[i];

      // Draw point
      const taxPoint = createSvgElement('circle', {
        cx: `${point.x}`,
        cy: `${point.y}`,
        class: 'tax-point'
      });
      g.appendChild(taxPoint);

      // Add label to every other point to avoid crowding
      if (i % 2 === 0) {
        const taxLabel = createSvgElement('text', {
          x: `${point.x}`,
          y: `${point.y - 10}`,
          class: 'value-label tax-label'
        });
        taxLabel.textContent = `$${Math.round(point.value)}k`;
        g.appendChild(taxLabel);
      }
    }

    // Draw bars and x-axis labels for each decile
    for (let i = 0; i < taxEntries.length; i++) {
      const entry = taxEntries[i];
      const x = i * barSpacing + barSpacing / 2;

      // Calculate heights
      const avgIncome = entry.averagetaxableincome || 0;
      const incomeWithUBI = await calculateIncomeWithUBI(entry);
      const avgHeight = avgIncome * yScale;
      const ubiHeight = incomeWithUBI * yScale;

      // Draw average income bar
      const avgBar = createSvgElement('rect', {
        x: `${x - barWidth - 2}`,
        y: `${height - avgHeight}`,
        width: `${barWidth}`,
        height: `${avgHeight}`,
        class: 'income-bar'
      });
      g.appendChild(avgBar);

      // Draw UBI income bar
      const ubiBar = createSvgElement('rect', {
        x: `${x + 2}`,
        y: `${height - ubiHeight}`,
        width: `${barWidth}`,
        height: `${ubiHeight}`,
        class: 'ubi-bar'
      });
      g.appendChild(ubiBar);

      // Add value labels
      const avgLabel = createSvgElement('text', {
        x: `${x - barWidth / 2 - 2}`,
        y: `${height - avgHeight - 10}`,
        class: 'value-label'
      });
      avgLabel.textContent = `$${Math.round(avgIncome)}k`;
      g.appendChild(avgLabel);

      const ubiLabel = createSvgElement('text', {
        x: `${x + barWidth / 2 + 2}`,
        y: `${height - ubiHeight - 10}`,
        class: 'value-label'
      });
      ubiLabel.textContent = `$${Math.round(incomeWithUBI)}k`;
      g.appendChild(ubiLabel);

      // Add x-axis label
      const decile = 'decile' in entry ? (entry as any).decile : i + 1;
      const decileLabel = createSvgElement('text', {
        x: `${x}`,
        y: `${height + 25}`,
        class: 'axis-label'
      });
      decileLabel.textContent = `D${decile}`;
      g.appendChild(decileLabel);

      const descLabel = createSvgElement('text', {
        x: `${x}`,
        y: `${height + 45}`,
        class: 'axis-label',
        'font-size': '10px'
      });
      descLabel.textContent = await getDecileDescription(decile);
      g.appendChild(descLabel);
    }

    // Add axis titles
    const xAxisTitle = createSvgElement('text', {
      x: `${width / 2}`,
      y: `${height + 70}`,
      class: 'axis-label',
      'font-weight': 'bold'
    });
    xAxisTitle.textContent = 'Income Decile';
    g.appendChild(xAxisTitle);

    const yAxisTitle = createSvgElement('text', {
      x: `${-height / 2}`,
      y: '-60',
      class: 'axis-label',
      'font-weight': 'bold',
      transform: 'rotate(-90)'
    });
    yAxisTitle.textContent = 'Income (thousands)';
    g.appendChild(yAxisTitle);
  });

  // Render the cost chart
  const renderCostChart = $(async () => {
    if (!chartRef.value || !taxEntries.length) return;

    const svg = chartRef.value;

    // Get cost and revenue data
    const costData = await calculateUbiCostAndRevenue();

    // Chart dimensions and margins
    const margin = { top: 40, right: 120, bottom: 80, left: 80 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create chart group with margin
    const g = createSvgElement('g', {
      transform: `translate(${margin.left}, ${margin.top})`
    });
    svg.appendChild(g);

    // Calculate maximum value for scaling
    const maxValue = Math.max(
      ...costData.decileResults.map(entry =>
        Math.max(entry.ubiPayment, entry.taxRevenue, Math.abs(entry.netCost)) * entry.taxpayers
      )
    );

    // Round up to nearest 10 billion for y-axis scale
    const yMax = Math.ceil(maxValue / 10) * 10;

    // Calculate scales
    const barWidth = 25;
    const barSpacing = width / costData.decileResults.length;
    const yScale = height / yMax;

    // Draw axes
    const xAxis = createSvgElement('line', {
      x1: '0',
      y1: `${height}`,
      x2: `${width}`,
      y2: `${height}`,
      class: 'axis-line'
    });
    g.appendChild(xAxis);

    const yAxis = createSvgElement('line', {
      x1: '0',
      y1: '0',
      x2: '0',
      y2: `${height}`,
      class: 'axis-line'
    });
    g.appendChild(yAxis);

    // Draw grid lines and y-axis labels
    for (let i = 0; i <= 5; i++) {
      const y = height - (i * height / 5);
      const value = (i * yMax / 5);

      // Grid line
      const gridLine = createSvgElement('line', {
        x1: '0',
        y1: `${y}`,
        x2: `${width}`,
        y2: `${y}`,
        class: 'grid-line'
      });
      g.appendChild(gridLine);

      // Y-axis label
      const yLabel = createSvgElement('text', {
        x: '-10',
        y: `${y + 5}`,
        class: 'y-axis-label'
      });
      yLabel.textContent = `$${value}B`;
      g.appendChild(yLabel);
    }

    // Draw zero line if it's within the chart range
    const zeroY = height;
    const zeroLine = createSvgElement('line', {
      x1: '0',
      y1: `${zeroY}`,
      x2: `${width}`,
      y2: `${zeroY}`,
      class: 'axis-line'
    });
    g.appendChild(zeroLine);

    // Draw bars and x-axis labels for each decile
    for (let i = 0; i < costData.decileResults.length; i++) {
      const entry = costData.decileResults[i];
      const x = i * barSpacing + barSpacing / 2;

      // Calculate heights (multiply by taxpayers to get total values)
      const ubiPayment = entry.ubiPayment * entry.taxpayers;
      const taxRevenue = entry.taxRevenue * entry.taxpayers;
      const netCost = entry.netCost * entry.taxpayers;

      const ubiHeight = ubiPayment * yScale;
      const taxHeight = taxRevenue * yScale;
      const netHeight = Math.abs(netCost) * yScale;

      // Draw UBI payment bar
      const ubiBar = createSvgElement('rect', {
        x: `${x - barWidth * 1.5}`,
        y: `${height - ubiHeight}`,
        width: `${barWidth}`,
        height: `${ubiHeight}`,
        fill: '#f59e0b'
      });
      g.appendChild(ubiBar);

      // Draw tax revenue bar
      const taxBar = createSvgElement('rect', {
        x: `${x - barWidth * 0.5}`,
        y: `${height - taxHeight}`,
        width: `${barWidth}`,
        height: `${taxHeight}`,
        fill: '#9333ea'
      });
      g.appendChild(taxBar);

      // Draw net cost bar
      const netBar = createSvgElement('rect', {
        x: `${x + barWidth * 0.5}`,
        y: `${height - netHeight}`,
        width: `${barWidth}`,
        height: `${netHeight}`,
        fill: '#ef4444'
      });
      g.appendChild(netBar);

      // Add value labels
      const ubiLabel = createSvgElement('text', {
        x: `${x - barWidth}`,
        y: `${height - ubiHeight - 10}`,
        class: 'value-label',
        fill: '#f59e0b'
      });
      ubiLabel.textContent = `$${Math.round(ubiPayment)}B`;
      g.appendChild(ubiLabel);

      const taxLabel = createSvgElement('text', {
        x: `${x}`,
        y: `${height - taxHeight - 10}`,
        class: 'value-label',
        fill: '#9333ea'
      });
      taxLabel.textContent = `$${Math.round(taxRevenue)}B`;
      g.appendChild(taxLabel);

      const netLabel = createSvgElement('text', {
        x: `${x + barWidth}`,
        y: `${height - netHeight - 10}`,
        class: 'value-label',
        fill: '#ef4444'
      });
      netLabel.textContent = `$${Math.round(netCost)}B`;
      g.appendChild(netLabel);

      // Add x-axis label
      const decileLabel = createSvgElement('text', {
        x: `${x}`,
        y: `${height + 25}`,
        class: 'axis-label'
      });
      decileLabel.textContent = `D${entry.decile}`;
      g.appendChild(decileLabel);
    }

    // Add total values at the bottom
    const totalY = height + 60;

    const totalUbiLabel = createSvgElement('text', {
      x: `${width / 2 - 200}`,
      y: `${totalY}`,
      class: 'axis-label',
      'font-weight': 'bold',
      fill: '#f59e0b'
    });
    totalUbiLabel.textContent = `Total UBI Cost: $${Math.round(costData.totalUbiCost)}B`;
    g.appendChild(totalUbiLabel);

    const totalTaxLabel = createSvgElement('text', {
      x: `${width / 2}`,
      y: `${totalY}`,
      class: 'axis-label',
      'font-weight': 'bold',
      fill: '#9333ea'
    });
    totalTaxLabel.textContent = `Total Tax Revenue: $${Math.round(costData.totalTaxRevenue)}B`;
    g.appendChild(totalTaxLabel);

    const totalNetLabel = createSvgElement('text', {
      x: `${width / 2 + 200}`,
      y: `${totalY}`,
      class: 'axis-label',
      'font-weight': 'bold',
      fill: '#ef4444'
    });
    totalNetLabel.textContent = `Net Cost: $${Math.round(costData.totalNetCost)}B`;
    g.appendChild(totalNetLabel);

    // Add axis titles
    const xAxisTitle = createSvgElement('text', {
      x: `${width / 2}`,
      y: `${height + 90}`,
      class: 'axis-label',
      'font-weight': 'bold'
    });
    xAxisTitle.textContent = 'Income Decile';
    g.appendChild(xAxisTitle);

    const yAxisTitle = createSvgElement('text', {
      x: `${-height / 2}`,
      y: '-60',
      class: 'axis-label',
      'font-weight': 'bold',
      transform: 'rotate(-90)'
    });
    yAxisTitle.textContent = 'Amount (billions)';
    g.appendChild(yAxisTitle);
  });

  return (
    <div class="svg-chart-container">
      <svg
        ref={chartRef}
        class="svg-chart"
        viewBox="0 0 1000 500"
        style={{
          width: '100%',
          height: '500px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Chart will be rendered here by JavaScript */}
      </svg>

      <style>{`
        .axis-line {
          stroke: #333;
          stroke-width: 2;
        }
        .grid-line {
          stroke: #ddd;
          stroke-width: 1;
          stroke-dasharray: 5,5;
        }
        .income-bar {
          fill: #3b82f6;
        }
        .ubi-bar {
          fill: #10b981;
        }
        .tax-line {
          stroke: #9333ea;
          stroke-width: 2;
          fill: none;
        }
        .tax-point {
          fill: #9333ea;
          r: 4;
        }
        .break-even-line {
          stroke: #e74c3c;
          stroke-width: 2;
          stroke-dasharray: 5,5;
        }
        .axis-label {
          font-size: 12px;
          text-anchor: middle;
        }
        .y-axis-label {
          text-anchor: end;
        }
        .value-label {
          font-size: 10px;
          font-weight: bold;
          text-anchor: middle;
        }
        .tax-label {
          fill: #9333ea;
          font-weight: bold;
        }
        .break-even-label {
          fill: #e74c3c;
          font-weight: bold;
        }
      `}</style>
    </div>
  );