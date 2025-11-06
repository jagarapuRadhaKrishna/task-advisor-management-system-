import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './TwoFactorAuth.css';

const TwoFactorAuth = () => {
  const [securitySettings, setSecuritySettings] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const response = await axios.get('/api/security/settings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSecuritySettings(response.data);
    } catch (error) {
      console.error('Failed to fetch security settings:', error);
    }
  };

  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/security/2fa/setup', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSetupData(response.data);
    } catch (error) {
      console.error('Failed to setup 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    setLoading(true);
    try {
      await axios.post(
        '/api/security/2fa/verify-setup',
        {
          token: verificationCode,
          secret: setupData.secret,
          backupCodes: setupData.backupCodes
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setShowSetupModal(false);
      setSetupData(null);
      setVerificationCode('');
      fetchSecuritySettings();
    } catch (error) {
      console.error('Failed to verify 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    const password = prompt('Enter your password to disable 2FA:');
    if (!password) return;

    setLoading(true);
    try {
      await axios.post(
        '/api/security/2fa/disable',
        { password },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchSecuritySettings();
    } catch (error) {
      console.error('Failed to disable 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!securitySettings) return <div>Loading...</div>;

  return (
    <div className="two-factor-auth">
      <div className="security-card">
        <h3>Two-Factor Authentication</h3>
        {securitySettings.twoFactorEnabled ? (
          <div className="enabled-state">
            <p className="status enabled">✓ Enabled</p>
            <button
              className="btn btn-danger"
              onClick={handleDisable2FA}
              disabled={loading}
            >
              Disable 2FA
            </button>
          </div>
        ) : (
          <div className="disabled-state">
            <p className="status disabled">✗ Disabled</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleSetup2FA();
                setShowSetupModal(true);
              }}
              disabled={loading}
            >
              Enable 2FA
            </button>
          </div>
        )}
      </div>

      <div className="security-card">
        <h3>Active Sessions</h3>
        <p>{securitySettings.sessions.length} active session(s)</p>
      </div>

      <div className="security-card">
        <h3>Login History</h3>
        <ul>
          {securitySettings.loginHistory.map((log, index) => (
            <li key={index}>
              {new Date(log.timestamp).toLocaleDateString()} - {log.ipAddress}
            </li>
          ))}
        </ul>
      </div>

      {showSetupModal && setupData && (
        <div className="modal">
          <div className="modal-content">
            <h2>Set Up Two-Factor Authentication</h2>

            <div className="setup-steps">
              <div className="step">
                <h4>Step 1: Scan QR Code</h4>
                <p>Scan this with your authenticator app:</p>
                <img src={setupData.qrCode} alt="QR Code" />
              </div>

              <div className="step">
                <h4>Step 2: Enter Verification Code</h4>
                <input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength="6"
                />
              </div>

              <div className="step">
                <h4>Step 3: Save Backup Codes</h4>
                <div className="backup-codes">
                  {setupData.backupCodes.map((code, index) => (
                    <code key={index}>{code}</code>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                onClick={handleVerify2FA}
                disabled={loading || verificationCode.length !== 6}
                className="btn btn-primary"
              >
                Verify and Enable
              </button>
              <button
                onClick={() => {
                  setShowSetupModal(false);
                  setSetupData(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;
