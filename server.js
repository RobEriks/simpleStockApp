import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Set up the server and sockets
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all (for dev, not for prod!!)
  },
});

// Fake stock data just to test with
let stocks = [
  {
    symbol: "AAPL",
    prices: [150, 202, 194], // Random prices
    color: "red",
    dates: ["2023-12-01", "2023-12-02", "2023-12-03"],
  },
  {
    symbol: "GOOGL",
    prices: [150, 180, 190],
    color: "blue",
    dates: ["2023-12-01", "2023-12-02", "2023-12-03"],
  },
];

app.use(cors());

// Just to check if server is up
app.get("/", (req, res) => {
  res.send("Server is running!");
});


io.on("connection", (socket) => {
  console.log("New client connected");

  // Send stocks ra when someone connects
  socket.emit("stockData", stocks);


  socket.on("addStock", (stock) => {
    const existingStock = stocks.find((s) => s.symbol === stock.symbol); // Check if stock exists
    if (!existingStock) {

      stocks.push({
        symbol: stock.symbol,
        prices: stock.prices,
        color: stock.color,
        dates: ["2023-12-01", "2023-12-02", "2023-12-03"], // Dummy dates :)
      });
    }
    io.emit("stockData", stocks);
  });

  socket.on("removeStock", (symbol) => {
    stocks = stocks.filter((s) => s.symbol !== symbol);
    io.emit("stockData", stocks);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
