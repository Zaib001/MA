const express = require("express");
const router = express.Router();
const { createBarber, getBarbers, getBarberById, deleteBarber } = require("../controllers/barberController");

router.post("/", createBarber);
router.get("/", getBarbers);
router.get('/:id', getBarberById);
router.delete('/:id', deleteBarber);  // Add this line for the delete route

module.exports = router;
