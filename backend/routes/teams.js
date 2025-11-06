const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Team = require('../models/Team');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// CREATE TEAM
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, workspace } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = new Team({
      name,
      description,
      workspace: workspace || 'default',
      owner: req.user.id,
      members: [
        {
          userId: req.user.id,
          role: 'admin'
        }
      ]
    });

    await team.save();
    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER TEAMS
router.get('/user/teams', auth, async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [
        { owner: req.user.id },
        { 'members.userId': req.user.id }
      ]
    }).populate('owner', 'name email');

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET TEAM DETAILS
router.get('/:teamId', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('owner', 'name email')
      .populate('members.userId', 'name email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is member
    const isMember = team.owner.equals(req.user.id) || 
      team.members.some(m => m.userId._id.equals(req.user.id));

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE TEAM
router.put('/:teamId', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.owner.equals(req.user.id)) {
      return res.status(403).json({ message: 'Only owner can update team' });
    }

    const { name, description, settings } = req.body;
    if (name) team.name = name;
    if (description) team.description = description;
    if (settings) team.settings = { ...team.settings, ...settings };

    await team.save();
    res.json({ message: 'Team updated successfully', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// INVITE MEMBER TO TEAM
router.post('/:teamId/invite', auth, async (req, res) => {
  try {
    const { email, role } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.owner.equals(req.user.id)) {
      return res.status(403).json({ message: 'Only owner can invite members' });
    }

    const token = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    team.invites.push({
      email,
      role: role || 'member',
      token,
      expiresAt
    });

    await team.save();

    // Send invitation email (requires SMTP setup)
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ ... });

    res.json({ message: 'Invitation sent', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ACCEPT TEAM INVITE
router.post('/:teamId/accept-invite/:token', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const invite = team.invites.find(
      inv => inv.token === req.params.token && 
      inv.email === req.user.email &&
      inv.expiresAt > new Date()
    );

    if (!invite) {
      return res.status(400).json({ message: 'Invalid or expired invite' });
    }

    team.members.push({
      userId: req.user.id,
      role: invite.role
    });

    team.invites = team.invites.filter(inv => inv.token !== req.params.token);
    await team.save();

    res.json({ message: 'Successfully joined team', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REMOVE MEMBER FROM TEAM
router.delete('/:teamId/members/:memberId', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.owner.equals(req.user.id)) {
      return res.status(403).json({ message: 'Only owner can remove members' });
    }

    team.members = team.members.filter(m => !m.userId.equals(req.params.memberId));
    await team.save();

    res.json({ message: 'Member removed', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE MEMBER ROLE
router.put('/:teamId/members/:memberId/role', auth, async (req, res) => {
  try {
    const { role } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.owner.equals(req.user.id)) {
      return res.status(403).json({ message: 'Only owner can update roles' });
    }

    const member = team.members.find(m => m.userId.equals(req.params.memberId));
    if (member) {
      member.role = role;
    }

    await team.save();
    res.json({ message: 'Role updated', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE TEAM
router.delete('/:teamId', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.owner.equals(req.user.id)) {
      return res.status(403).json({ message: 'Only owner can delete team' });
    }

    await Team.findByIdAndDelete(req.params.teamId);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
