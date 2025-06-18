const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/inventoryModel");
const Clinic = require("../models/clinicModel");

// Add a new inventory item
router.post("/add", async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to add item", error });
  }
});

// Get all inventory items by clinic ID
router.get("/:clinicId", async (req, res) => {
  try {
    const items = await InventoryItem.find({ clinicId: req.params.clinicId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items", error });
  }
});

// Update an inventory item by ID
router.put("/update/:itemId", async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to update item", error });
  }
});

// Delete an inventory item by ID
router.delete("/delete/:itemId", async (req, res) => {
  try {
    const deletedItem = await InventoryItem.findByIdAndDelete(
      req.params.itemId
    );
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error });
  }
});

//  Get clinic details by clinic ID
router.get("/clinic/:clinicId", async (req, res) => {
  const { clinicId } = req.params;

  try {
    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.status(200).json(clinic);
  } catch (error) {
    console.error("Error fetching clinic:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
