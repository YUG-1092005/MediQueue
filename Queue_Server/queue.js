const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const queueRouter = require("./routes/queueRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Make io accessible via app
app.set("io", io);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://medi-queue.vercel.app",
        "http://localhost:5173"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  })
);


app.use(express.json());

// Middleware to log requests
app.use("/api/queue", queueRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date() });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-clinic", (clinicId) => {
    socket.join(clinicId);
    console.log(`User joined clinic ${clinicId}`);
  });

  // Handle leaving clinic room
  socket.on("leave-clinic", (clinicId) => {
    console.log(`User ${socket.id} leaving clinic room: ${clinicId}`);
    socket.leave(clinicId.toString());
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Connect to database and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

module.exports = { app, io };
