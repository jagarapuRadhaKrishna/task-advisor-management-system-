const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');
const UserSecurity = require('../models/UserSecurity');
const jwt = require('jsonwebtoken');

// ENABLE 2FA - GENERATE SECRET
router.post('/2fa/setup', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Task Manager (${user.email})`,
      issuer: 'Task Manager',
      length: 32
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Generate backup codes
    const backupCodes = generateBackupCodes(10);

    res.json({
      secret: secret.base32,
      qrCode,
      backupCodes,
      message: 'Scan the QR code with your authenticator app'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VERIFY 2FA TOKEN AND ENABLE
router.post('/2fa/verify-setup', auth, async (req, res) => {
  try {
    const { token, secret, backupCodes } = req.body;

    // Verify token
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Save to UserSecurity
    let security = await UserSecurity.findOne({ userId: req.user.id });

    if (!security) {
      security = new UserSecurity({ userId: req.user.id });
    }

    security.twoFactorAuth = {
      enabled: true,
      method: 'totp',
      secret,
      backupCodes,
      verifiedAt: new Date()
    };

    await security.save();

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DISABLE 2FA
router.post('/2fa/disable', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    // Verify password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    let security = await UserSecurity.findOne({ userId: req.user.id });

    if (security) {
      security.twoFactorAuth.enabled = false;
      await security.save();
    }

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VERIFY 2FA TOKEN ON LOGIN
router.post('/2fa/verify-login', async (req, res) => {
  try {
    const { token, userId } = req.body;

    const security = await UserSecurity.findOne({ userId });

    if (!security || !security.twoFactorAuth.enabled) {
      return res.status(400).json({ message: '2FA not enabled' });
    }

    // Check backup codes first
    const backupCodeIndex = security.twoFactorAuth.backupCodes.indexOf(token);

    let verified = false;

    if (backupCodeIndex !== -1) {
      // Remove used backup code
      security.twoFactorAuth.backupCodes.splice(backupCodeIndex, 1);
      verified = true;
    } else {
      // Verify TOTP token
      verified = speakeasy.totp.verify({
        secret: security.twoFactorAuth.secret,
        encoding: 'base32',
        token,
        window: 2
      });
    }

    if (!verified) {
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    await security.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({ token: jwtToken, message: '2FA verification successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SECURITY SETTINGS
router.get('/settings', auth, async (req, res) => {
  try {
    let security = await UserSecurity.findOne({ userId: req.user.id });

    if (!security) {
      security = new UserSecurity({ userId: req.user.id });
    }

    res.json({
      twoFactorEnabled: security.twoFactorAuth.enabled,
      oauthConnected: security.oauthProviders.length > 0,
      sessions: security.sessionTokens.filter(s => s.expiresAt > new Date()),
      loginHistory: security.loginHistory.slice(-10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GENERATE BACKUP CODES
function generateBackupCodes(count) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(
      Math.random().toString(36).substring(2, 10) +
      Math.random().toString(36).substring(2, 10)
    );
  }
  return codes;
}

module.exports = router;
