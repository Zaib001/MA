const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Assuming Message is a Mongoose model

router.post('/send', async (req, res) => {
  try {
    const { jobId, senderId, text } = req.body;

    if (!jobId || !senderId || !text) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newMessage = new Message({
      jobId,
      senderId,
      text,
      timestamp: new Date()
    });

    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
