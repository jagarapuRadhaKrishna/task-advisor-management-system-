import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, X, Check, Trash2, Settings, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationPanel = () => {
  const {
    notifications,
    settings,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    updateSettings,
    unreadCount
  } = useNotifications();

  const [showPanel, setShowPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} style={{ color: '#28a745' }} />;
      case 'error':
        return <AlertCircle size={16} style={{ color: '#dc3545' }} />;
      case 'warning':
        return <AlertTriangle size={16} style={{ color: '#ffc107' }} />;
      case 'info':
        return <Info size={16} style={{ color: '#17a2b8' }} />;
      default:
        return <Bell size={16} style={{ color: '#6c757d' }} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="btn btn-sm"
          style={{
            background: 'none',
            border: '1px solid #e2e8f0',
            color: '#666666',
            padding: '8px',
            borderRadius: '6px',
            position: 'relative'
          }}
          title="Notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showPanel && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '400px',
            maxWidth: '90vw',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            marginTop: '8px'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h6 style={{ margin: 0, fontWeight: '600' }}>
                Notifications ({unreadCount} unread)
              </h6>
              <div className="d-flex gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6c757d',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Settings"
                >
                  <Settings size={16} />
                </button>
                <button
                  onClick={() => setShowPanel(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6c757d',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div style={{
                padding: '8px 16px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={clearAllNotifications}
                  className="btn btn-sm"
                  style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <Bell size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f8f9fa',
                      backgroundColor: notification.read ? 'white' : '#f8f9fa',
                      position: 'relative'
                    }}
                  >
                    <div className="d-flex gap-3">
                      <div style={{ marginTop: '2px' }}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 style={{ 
                            margin: 0, 
                            fontSize: '14px', 
                            fontWeight: notification.read ? '500' : '600'
                          }}>
                            {notification.title}
                          </h6>
                          <span style={{
                            fontSize: '11px',
                            color: '#6c757d'
                          }}>
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#495057',
                          lineHeight: '1.4'
                        }}>
                          {notification.message}
                        </p>
                      </div>
                      <div className="d-flex gap-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#6c757d',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notification.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6c757d',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div className="card" style={{ 
            width: '400px', 
            maxWidth: '90vw',
            margin: 0
          }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ margin: 0 }}>Notification Settings</h5>
              <button 
                onClick={() => setShowSettings(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="d-flex justify-content-between align-items-center">
                <label style={{ fontSize: '14px', fontWeight: '500' }}>
                  Browser Notifications
                </label>
                <input
                  type="checkbox"
                  checked={settings.browserNotifications}
                  onChange={(e) => handleSettingChange('browserNotifications', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <label style={{ fontSize: '14px', fontWeight: '500' }}>
                  Due Date Reminders
                </label>
                <input
                  type="checkbox"
                  checked={settings.dueDateReminders}
                  onChange={(e) => handleSettingChange('dueDateReminders', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <label style={{ fontSize: '14px', fontWeight: '500' }}>
                  Task Updates
                </label>
                <input
                  type="checkbox"
                  checked={settings.taskUpdates}
                  onChange={(e) => handleSettingChange('taskUpdates', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <label style={{ fontSize: '14px', fontWeight: '500' }}>
                  Task Completions
                </label>
                <input
                  type="checkbox"
                  checked={settings.taskCompletions}
                  onChange={(e) => handleSettingChange('taskCompletions', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <label style={{ fontSize: '14px', fontWeight: '500' }}>
                  Overdue Alerts
                </label>
                <input
                  type="checkbox"
                  checked={settings.overdueAlerts}
                  onChange={(e) => handleSettingChange('overdueAlerts', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button 
                onClick={() => setShowSettings(false)}
                className="btn btn-primary"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPanel;