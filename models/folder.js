const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  documents: [
    {
      name: String,
      url: String
    }
  ]
});

module.exports = mongoose.model('Folder', folderSchema);
