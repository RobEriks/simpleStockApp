<template>
  <div id="app" class="p-8">
    <h1 class="text-3xl font-bold text-center mb-8">Stocks</h1>

    <!-- Stock list component (handles adding/removing stocks) -->
    <StockList
      :stocks="stocks"
      @addStock="addStock"
      @removeStock="removeStock"
    />
    <!-- Stock chart component (shows the graph) -->
    <StockChart :stocks="stocks" />
  </div>
</template>

<script>
import { ref } from "vue";
import StockChart from "./components/StockChart.vue";
import StockList from "./components/StockList.vue";
import io from "socket.io-client";

export default {
  components: { StockChart, StockList },
  setup() {
    const stocks = ref([]); // Holds all the stock data
    const socket = io("http://localhost:5000"); // Connect to the server

    // Get stock data from the server
    socket.on("stockData", (data) => {
      stocks.value = data;
    });

    const addStock = (symbol) => {
      socket.emit("addStock", {
        symbol,
        prices: [100, 105, 110], // Dummy prices :)
        color: "green",
      });
    };

    const removeStock = (symbol) => {
      socket.emit("removeStock", symbol); // Tell server to remove it
    };

    return {
      stocks,
      addStock,
      removeStock,
    };
  },
};
</script>
