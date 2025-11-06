const mongoose = require('mongoose');

const RecurringTaskSchema = new mongoose.Schema({
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
  pattern: {
    type: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly', 'custom'],
      required: true
    },
    interval: {
      type: Number,
      default: 1
    },
    daysOfWeek: [Number], // 0-6 for daily recurrence
    dayOfMonth: Number, // for monthly recurrence
    endDate: Date,
    maxOccurrences: Number
  },
  nextDueDate: Date,
  lastGeneratedDate: Date,
  generatedInstances: [
    {
      taskId: mongoose.Schema.Types.ObjectId,
      generatedAt: Date
    }
  ],
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('RecurringTask', RecurringTaskSchema);
