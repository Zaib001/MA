const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  name: String,
  url: String,
  folderId: { type: Schema.Types.ObjectId, ref: 'Folder' },
  createdAt: { type: Date, default: Date.now },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = { Job, Folder, Document };
