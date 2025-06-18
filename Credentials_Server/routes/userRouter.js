const express = require("express");
const {
  loginUser,
  registerUser,
  logoutUser,
  verifyUser,
} = require("../controllers/controller.js");
const upload = require("../uploads/multer");

const userRouter = express.Router();

userRouter.post(
  "/signup",
  upload.fields([
    { name: "clinicImage", maxCount: 1 },
    { name: "ngoImage", maxCount: 1 },
  ]),
  registerUser
);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

userRouter.get("/verify", verifyUser);

module.exports = userRouter;
