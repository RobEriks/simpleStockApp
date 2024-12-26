import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Tillåt alla domäner (för utveckling)
  },
});

// Exempeldata för aktier med datum
let stocks = [
  {
    symbol: "AAPL",
    prices: [150, 202, 194],
    color: "red",
    dates: ["2023-12-01", "2023-12-02", "2023-12-03"], // Datum för graferna
  },
  {
    symbol: "GOOGL",
    prices: [150, 180, 190],
    color: "blue",
    dates: ["2023-12-01", "2023-12-02", "2023-12-03"],
  },
];

// Middleware för att hantera CORS
app.use(cors());

// **Lägg till GET-route för att testa servern**
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Socket.IO-anslutning
io.on("connection", (socket) => {
  console.log("New client connected");

  // Skicka befintlig data till klienten
  socket.emit("stockData", stocks);

  // Lägg till en ny aktie
  socket.on("addStock", (stock) => {
    const existingStock = stocks.find((s) => s.symbol === stock.symbol);
    if (!existingStock) {
      // Lägg till ny aktie
      stocks.push({
        symbol: stock.symbol,
        prices: stock.prices,
        color: stock.color,
        dates: ["2023-12-01", "2023-12-02", "2023-12-03"], // Exempel på datum
      });
    }
    // Uppdatera alla klienter
    io.emit("stockData", stocks);
  });

  // Ta bort en aktie
  socket.on("removeStock", (symbol) => {
    stocks = stocks.filter((s) => s.symbol !== symbol);
    io.emit("stockData", stocks); // Uppdatera alla klienter
  });

  // Hantera bortkoppling av klienter
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Starta servern
server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
