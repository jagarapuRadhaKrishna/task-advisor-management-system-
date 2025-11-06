const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a team name'],
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      role: {
        type: String,
        enum: ['admin', 'member', 'viewer'],
        default: 'member'
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  invites: [
    {
      email: String,
      role: {
        type: String,
        enum: ['admin', 'member', 'viewer'],
        default: 'member'
      },
      token: String,
      expiresAt: Date,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  workspace: {
    type: String,
    default: 'default',
    trim: true
  },
  settings: {
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'private'
    },
    allowPublicTasks: Boolean,
    notificationPreferences: {
      taskUpdates: Boolean,
      memberJoined: Boolean,
      commentNotifications: Boolean
    }
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

module.exports = mongoose.model('Team', TeamSchema);
