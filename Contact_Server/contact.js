const express = require('express');
const cors = require('cors');
const contactRouter = require('./routes/contact');
const app = express();

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
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());4

// Contact management endpoints
app.use('/api/contact', contactRouter);

app.listen(2000, () => console.log('Server running on port 2000'));
