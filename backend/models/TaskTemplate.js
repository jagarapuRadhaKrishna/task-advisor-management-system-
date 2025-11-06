const mongoose = require('mongoose');

const TaskTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a template name'],
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  templateData: {
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: String,
    tags: [String],
    subtasks: [
      {
        title: String,
        completed: Boolean
      }
    ],
    checklist: [
      {
        item: String,
        completed: Boolean
      }
    ]
  },
  isShared: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['personal', 'team', 'recurring', 'workflow'],
    default: 'personal'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TaskTemplate', TaskTemplateSchema);
