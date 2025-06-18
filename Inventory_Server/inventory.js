const express = require("express");
const connectDB = require("./config/db");
const inventoryRoutes = require("./routes/inventory.routes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(cors({ origin: process.env.VITE_FRONTEND_URL || "*" }));
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Mount inventory routes
app.use("/api/inventory", inventoryRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
