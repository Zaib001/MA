const express = require("express");
const router = express.Router();
const { createBarber, getBarbers, getBarberById, deleteBarber,updateBarberStatus } = require("../controllers/barberController");

router.post("/", createBarber);
router.get("/", getBarbers);
router.get('/:id', getBarberById);
router.delete('/:id', deleteBarber);  // Add this line for the delete route
router.patch('/:id', updateBarberStatus);
module.exports = router;
