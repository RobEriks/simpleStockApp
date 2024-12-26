<template>
    <div class="chart-container">
      <canvas id="stockChart" style="height: 400px;"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted } from "vue";
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables);
  
  export default {
    props: {
      stocks: Array, // Stocks data comes from App.vue
    },
    setup(props) {
      const chart = ref(null); // Keep track of the chart so we can reset it later
  
      const renderChart = () => {
        const ctx = document.getElementById("stockChart").getContext("2d"); // Get chart area
  
        if (chart.value) {
          chart.value.destroy(); // "Removes" old chart if it’s still there
        }
  

        chart.value = new Chart(ctx, {
          type: "line",
          data: {
            labels: props.stocks[0]?.dates || [], // Dates for X-axis
            datasets: props.stocks.map((stock) => ({
              label: stock.symbol,
              data: stock.prices,
              borderColor: stock.color,
              fill: false, // No fill, looks cleaner
            })),
          },
          options: {
            responsive: true, // Makes it resize properly
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Price (USD)",
                },
              },
            },
          },
        });
      };
  
      // Watch stocks for changes, redraw chart when data updates
      watch(
        () => props.stocks,
        () => {
          renderChart();
        },
        { deep: true } // Check inside arrays too
      );
  
      // Draw chart when page loads
      onMounted(() => {
        renderChart();
      });
  
      return {
        chart,
      };
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    max-width: 800px;
    margin: 0 auto; 
  }
  </style>
  