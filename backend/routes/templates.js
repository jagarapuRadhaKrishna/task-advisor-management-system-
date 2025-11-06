const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TaskTemplate = require('../models/TaskTemplate');

// CREATE TEMPLATE
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, templateData, category, teamId } = req.body;

    const template = new TaskTemplate({
      name,
      description,
      templateData,
      category: category || 'personal',
      userId: req.user.id,
      teamId
    });

    await template.save();
    res.status(201).json({ message: 'Template created', template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER TEMPLATES
router.get('/', auth, async (req, res) => {
  try {
    const templates = await TaskTemplate.find({
      $or: [
        { userId: req.user.id },
        { isShared: true }
      ]
    }).sort({ createdAt: -1 });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET TEMPLATE BY ID
router.get('/:templateId', auth, async (req, res) => {
  try {
    const template = await TaskTemplate.findById(req.params.templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE TEMPLATE
router.put('/:templateId', auth, async (req, res) => {
  try {
    let template = await TaskTemplate.findById(req.params.templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (!template.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, templateData, isShared } = req.body;
    if (name) template.name = name;
    if (description) template.description = description;
    if (templateData) template.templateData = templateData;
    if (typeof isShared !== 'undefined') template.isShared = isShared;

    await template.save();
    res.json({ message: 'Template updated', template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE TEMPLATE
router.delete('/:templateId', auth, async (req, res) => {
  try {
    const template = await TaskTemplate.findById(req.params.templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (!template.userId.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await TaskTemplate.findByIdAndDelete(req.params.templateId);
    res.json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
