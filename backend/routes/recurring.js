const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const RecurringTask = require('../models/RecurringTask');
const Task = require('../models/Task');

// CREATE RECURRING TASK
router.post('/', auth, async (req, res) => {
  try {
    const { taskId, pattern } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const recurringTask = new RecurringTask({
      taskId,
      userId: req.user.id,
      pattern,
      nextDueDate: calculateNextDate(pattern)
    });

    await recurringTask.save();
    res.status(201).json({ message: 'Recurring task created', recurringTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET RECURRING TASKS
router.get('/', auth, async (req, res) => {
  try {
    const recurringTasks = await RecurringTask.find({
      userId: req.user.id
    }).populate('taskId');

    res.json(recurringTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE RECURRING PATTERN
router.put('/:recurringId', auth, async (req, res) => {
  try {
    const { pattern, isActive } = req.body;

    let recurring = await RecurringTask.findById(req.params.recurringId);

    if (!recurring) {
      return res.status(404).json({ message: 'Recurring task not found' });
    }

    if (!recurring.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (pattern) {
      recurring.pattern = pattern;
      recurring.nextDueDate = calculateNextDate(pattern);
    }

    if (typeof isActive !== 'undefined') {
      recurring.isActive = isActive;
    }

    await recurring.save();
    res.json({ message: 'Recurring task updated', recurring });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE RECURRING TASK
router.delete('/:recurringId', auth, async (req, res) => {
  try {
    const recurring = await RecurringTask.findById(req.params.recurringId);

    if (!recurring) {
      return res.status(404).json({ message: 'Recurring task not found' });
    }

    if (!recurring.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await RecurringTask.findByIdAndDelete(req.params.recurringId);
    res.json({ message: 'Recurring task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// HELPER FUNCTION - Calculate next due date based on pattern
function calculateNextDate(pattern) {
  const now = new Date();
  let nextDate = new Date(now);

  switch (pattern.type) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + (pattern.interval || 1));
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (pattern.interval || 1) * 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + (pattern.interval || 1));
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate;
}

module.exports = router;
