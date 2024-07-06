const path = require('path');
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/create', upload.single('picture'), async (req, res) => {
    try {
      // Destructure required fields from request body
      const { name, phone, email, location, role,pay } = req.body;
  
      // Check if a picture file was uploaded; if yes, use filename, otherwise ''
      const picture = req.file ? req.file.filename : '';
  
      // Example: if location is just a city name or descriptive text
      const coordinates = [0, 0]; // Default coordinates
      const employee = new Employee({ 
        name, 
        picture, 
        phone, 
        email, 
        location: { coordinates }, 
        role: role || 'staff', // Default to 'staff' if role is not provided
        pay: parseFloat(pay),
      });
  
      // Save the employee instance to the database
      await employee.save();
  
      // Send back the saved employee object as a response
      res.status(201).send(employee);
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).send({ error: 'Failed to create employee profile' });
    }
  });

router.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '..', 'uploads', filename);
    console.log(`Serving file: ${filepath}`); // Log the file path
    res.sendFile(filepath);
  });
  

module.exports = router;
