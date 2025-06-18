const express = require("express");
const ngoRouter = express.Router();
const { getAllNgos } = require("../controllers/ngoController.js");

// Get All NGOs
ngoRouter.get("/listings", getAllNgos);

module.exports = ngoRouter;
