const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Attachment = require('../models/Attachment');
const Task = require('../models/Task');

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'video/mp4',
    'audio/mpeg'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// UPLOAD ATTACHMENT
router.post('/:taskId', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const fileType = determineFileType(req.file.mimetype);

    const attachment = new Attachment({
      taskId: req.params.taskId,
      userId: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileType,
      filePath: req.file.path,
      url: `/api/attachments/download/${req.file.filename}`
    });

    await attachment.save();
    res.status(201).json({ message: 'File uploaded', attachment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET TASK ATTACHMENTS
router.get('/task/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const attachments = await Attachment.find({
      taskId: req.params.taskId
    }).sort({ uploadedAt: -1 });

    res.json(attachments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DOWNLOAD ATTACHMENT
router.get('/download/:filename', auth, async (req, res) => {
  try {
    const attachment = await Attachment.findOne({ filename: req.params.filename });

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    if (!attachment.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.download(attachment.filePath, attachment.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE ATTACHMENT
router.delete('/:attachmentId', auth, async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.attachmentId);

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    if (!attachment.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete file from disk
    if (fs.existsSync(attachment.filePath)) {
      fs.unlinkSync(attachment.filePath);
    }

    await Attachment.findByIdAndDelete(req.params.attachmentId);
    res.json({ message: 'Attachment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// HELPER FUNCTION - Determine file type
function determineFileType(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('sheet')) {
    return 'document';
  }
  return 'other';
}

module.exports = router;
