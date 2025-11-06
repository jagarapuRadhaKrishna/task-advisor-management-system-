const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, sort = '-createdAt' } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query).sort(sort);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, subtasks, tags } = req.body;

    // Get the highest position for ordering
    const lastTask = await Task.findOne({ user: req.user._id }).sort({ position: -1 });
    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      subtasks: subtasks || [],
      tags: tags || [],
      position,
      user: req.user._id
    });

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('task-created', task);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, subtasks, tags, position } = req.body;

    let task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (subtasks !== undefined) updateData.subtasks = subtasks;
    if (tags !== undefined) updateData.tags = tags;
    if (position !== undefined) updateData.position = position;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('task-updated', task);

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('task-deleted', { id: req.params.id });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks/:id/subtasks
// @desc    Add a subtask to a task
// @access  Private
router.post('/:id/subtasks', auth, async (req, res) => {
  try {
    const { title } = req.body;

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.subtasks.push({ title });
    await task.save();

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('task-updated', task);

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Add subtask error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @desc    Update a subtask
// @access  Private
router.put('/:id/subtasks/:subtaskId', auth, async (req, res) => {
  try {
    const { title, completed } = req.body;

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    if (title !== undefined) subtask.title = title;
    if (completed !== undefined) subtask.completed = completed;

    await task.save();

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('task-updated', task);

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Update subtask error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @desc    Delete a subtask
// @access  Private
router.delete('/:id/subtasks/:subtaskId', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.subtasks.id(req.params.subtaskId).remove();
    await task.save();

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('task-updated', task);

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Delete subtask error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add a comment to a task
// @access  Private
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({ 
      text, 
      user: req.user._id,
      userName: req.user.name 
    });
    await task.save();

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('task-updated', task);

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only allow user to delete their own comments
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await task.save();

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('task-updated', task);

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/reorder
// @desc    Reorder tasks (for drag & drop)
// @access  Private
router.put('/reorder', auth, async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds)) {
      return res.status(400).json({ message: 'Task IDs array is required' });
    }

    // Update positions
    const updatePromises = taskIds.map((taskId, index) => 
      Task.findOneAndUpdate(
        { _id: taskId, user: req.user._id },
        { position: index },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Get updated tasks
    const tasks = await Task.find({ user: req.user._id }).sort({ position: 1 });

    // Emit real-time update
    req.io.to(req.user._id.toString()).emit('tasks-reordered', tasks);

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Reorder tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;