const Clinic = require("../models/clinicsModel");
const cloudinary = require("../uploads/cloudinary")
const fs = require("fs");
const path = require("path");

// Get all clinics
const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find();

    res.json({
      success: true,
      clinics,
    });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch clinics",
    });
  }
};


//Controller for deleting clinic
const removeClinic = async (req, res) => {
  const { clinicId } = req.params;
  if (!clinicId) {
    return res
      .status(400)
      .json({ success: false, message: "Clinic ID is required" });
  }

  try {
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res
        .status(404)
        .json({ success: false, message: "clinic not found" });
    }

    console.log("clinic", clinic);

    if (clinic.clinicImage) {
      const imagePath = path.join("uploads", clinic.clinicImage);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error while deleting image:", err);
        }
      });
    }

    await Clinic.findByIdAndDelete(clinicId);
    res.json({ success: true, message: "clinic deleted" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting clinic" });
  }
};

//Controller for editing clinic
const editclinic = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const updateFields = { ...req.body };

    if (!clinicId) {
      return res
        .status(400)
        .json({ success: false, message: "clinic ID is required" });
    }

    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return res.status(404).json({ success: false, message: "clinic not found" });
    }

    if (req.file) {
      console.log("Received file:", req.file);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            resolve(result);
          }
        );

        uploadStream.end(req.file.buffer);
      });

      updateFields.clinicImage= result.secure_url;
    } else {
      console.error("No file uploaded");
      return res
        .status(400)
        .json({ success: false, message: "File is required." });
    }

    const updatedclinic = await Clinic.findByIdAndUpdate(clinicId, updateFields, {
      new: true,
    });
    res.json({
      success: true,
      message: "clinic updated successfully",
      data: updatedclinic,
    });
  } catch (error) {
    console.error("Error while updating clinic:", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating clinic" });
  }
};

getClinicById = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ success: false, message: "Clinic not found" });
    }
    res.status(200).json({ success: true, clinic });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { getAllClinics,editclinic,getClinicById,removeClinic};
