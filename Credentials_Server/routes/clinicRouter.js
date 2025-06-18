const express = require("express");
const clinicRouter = express.Router();
const multer = require("multer");
const {
  getAllClinics,
  editclinic,
  removeClinic,
  getClinicById,
} = require("../controllers/clinicController.js");

const upload = multer({ storage: multer.memoryStorage() });

// Get All Clinics
clinicRouter.get("/list", getAllClinics);

clinicRouter.get("/:clinicId", getClinicById);

clinicRouter.put("/:clinicId/edit", upload.single("clinicImage"), editclinic);

clinicRouter.delete("/:clinicId/remove", removeClinic);

module.exports = clinicRouter;
