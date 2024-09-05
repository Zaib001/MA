const express = require("express");
const router = express.Router();
const { createService, getServices, getServiceById, deleteService } = require("../controllers/serviceController");

router.post("/", createService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.delete("/:id", deleteService); // Add this line

module.exports = router;
