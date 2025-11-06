const mongoose = require('mongoose');

const UserSecuritySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false
    },
    method: {
      type: String,
      enum: ['totp', 'email', 'sms'],
      default: 'totp'
    },
    secret: String,
    backupCodes: [String],
    verifiedAt: Date
  },
  oauthProviders: [
    {
      provider: {
        type: String,
        enum: ['google', 'github', 'microsoft'],
        required: true
      },
      providerId: String,
      email: String,
      displayName: String,
      avatar: String,
      connectedAt: Date,
      isDefault: Boolean
    }
  ],
  sessionTokens: [
    {
      token: String,
      userAgent: String,
      ipAddress: String,
      createdAt: Date,
      expiresAt: Date,
      lastUsedAt: Date
    }
  ],
  loginHistory: [
    {
      timestamp: Date,
      ipAddress: String,
      userAgent: String,
      success: Boolean,
      method: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserSecurity', UserSecuritySchema);
