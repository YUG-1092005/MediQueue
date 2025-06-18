const express = require("express");
const queueRouter = express.Router();
const { joinQueue, getTodayQueue, updateStatus,getClinicById } = require("../controller/queueController");

// Join Queue
queueRouter.post("/join", joinQueue);

// Get Today's Queue for a Clinic
queueRouter.get("/today/:clinicId", getTodayQueue);

// Get Clinic Details by ID
queueRouter.get("/clinic/:clinicId", getClinicById);

// Update Queue Entry Status
queueRouter.patch("/:entryId/status", updateStatus);

module.exports = queueRouter;



