const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRouter = require("./routes/userRouter.js");
const clinicRouter = require("./routes/clinicRouter.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ngoRouter = require("./routes/ngoRouter.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

require("dotenv").config();

const PORT = process.env.VITE_MAIN_SERVER_PORT || 8000;

//Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Match the origin with or without the trailing slash
      if (origin === process.env.VITE_FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//Logging for error handling
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  console.log("Request Headers:", req.headers);
  next();
});

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log("Response Headers:", res.getHeaders());
  });
  next();
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Db connection
connectDB();

//User login/signup endpoints
app.use("/user", userRouter);

// Clinic management endpoints
app.use("/api/clinic", clinicRouter);

// NGO management endpoints
app.use("/api/ngo", ngoRouter);

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  next();
});

//Server connection
app.listen(PORT, () => {
  console.log(`Credential server running on ${PORT}`);
});
