<template>
    <div class="stock-list">
      <input
        v-model="newStock"
        placeholder="Add stock symbol"
        class="p-2 border rounded"
      />
      <button @click="addStock" class="p-2 bg-green-500 text-white ml-2">
        Add Stock
      </button>
  
      <ul class="mt-4">
        <li
          v-for="stock in stocks"
          :key="stock.symbol"
          class="flex justify-between"
        >
          <!-- Show stock symbol -->
          {{ stock.symbol }}
          <button @click="removeStock(stock.symbol)" class="text-red-500">
            Remove
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    props: {
      stocks: Array, // Gets stocks data from App.vue
    },
    emits: ["addStock", "removeStock"], // Sends events to add/remove stocks
    setup(_, { emit }) {
      const newStock = ref(""); // Keeps track of the input value
  

      const addStock = () => {
        if (newStock.value) {
          emit("addStock", newStock.value.toUpperCase());
          newStock.value = "";
        }
      };
  
      const removeStock = (symbol) => {
        emit("removeStock", symbol); // Sends symbol to remove
      };
  
      return {
        newStock,
        addStock,
        removeStock,
      };
    },
  };
  </script>
  
  <style scoped>
  .stock-list {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  