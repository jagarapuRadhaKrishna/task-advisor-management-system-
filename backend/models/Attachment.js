const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: String,
  fileSize: Number,
  mimeType: String,
  fileType: {
    type: String,
    enum: ['document', 'image', 'video', 'audio', 'other'],
    default: 'other'
  },
  filePath: {
    type: String,
    required: true
  },
  url: String,
  cloudStorageId: String, // for cloud storage integration
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    width: Number,
    height: Number,
    duration: Number,
    checksum: String
  }
});

module.exports = mongoose.model('Attachment', AttachmentSchema);
