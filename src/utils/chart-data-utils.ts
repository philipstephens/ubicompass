/**
 * Utility functions for preparing chart data
 */

/**
 * Prepares data for the UBI Impact chart
 */
export function prepareChartData(
  taxEntries: any[],
  calculateTaxRevenue: (entry: any) => number,
  calculateTaxRevenueWithUBI: (entry: any) => number,
  calculateUBICost: (entry: any) => number,
  calculateIncomeWithUBI: (entry: any) => number
) {
  // Prepare labels (quintile names)
  const labels = taxEntries.map((entry) => `Q${entry.quintile}`);

  // Prepare datasets
  const averageIncomeData = taxEntries.map((entry) => entry.averagetaxableincome);
  const incomeWithUBIData = taxEntries.map((entry) => calculateIncomeWithUBI(entry));
  const taxRevenueData = taxEntries.map((entry) => calculateTaxRevenue(entry));
  const taxRevenueWithUBIData = taxEntries.map((entry) => calculateTaxRevenueWithUBI(entry));
  const ubiCostData = taxEntries.map((entry) => calculateUBICost(entry));

  return {
    labels,
    datasets: [
      {
        label: 'Average Taxable Income',
        data: averageIncomeData,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        order: 1
      },
      {
        label: 'Income with UBI',
        data: incomeWithUBIData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        order: 2
      },
      {
        label: 'Tax Revenue',
        data: taxRevenueData,
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        order: 3
      },
      {
        label: 'Tax Revenue with UBI',
        data: taxRevenueWithUBIData,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        order: 4
      },
      {
        label: 'Cost of UBI',
        data: ubiCostData,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        order: 5
      }
    ]
  };
}

/**
 * Prepares options for the UBI Impact chart
 */
export function getChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (thousands of dollars)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Income Quintile'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top' as const,
        onClick: function(e: any, legendItem: any, legend: any) {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;

          // Get the meta for this dataset
          const meta = ci.getDatasetMeta(index);

          // Toggle visibility
          meta.hidden = !meta.hidden;

          // Update the chart
          ci.update();
        },
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 15,
          generateLabels: function(chart: any) {
            const datasets = chart.data.datasets;
            const labels = chart.legend.options.labels;

            return chart._getSortedDatasetMetas().map((meta: any) => {
              const style = meta.controller.getStyle(meta.hidden ? 0 : undefined);

              return {
                text: datasets[meta.index].label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: meta.hidden,
                index: meta.index,
                datasetIndex: meta.index
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.raw}k`;
          }
        }
      },
      // Custom plugin to handle dataset visibility
      customLegend: {
        id: 'customLegend',
        afterInit: function(chart: any) {
          // Make sure all datasets are initially visible
          chart.data.datasets.forEach((dataset: any, index: number) => {
            const meta = chart.getDatasetMeta(index);
            meta.hidden = false;
          });
          chart.update();
        }
      }
    }
  };
}
