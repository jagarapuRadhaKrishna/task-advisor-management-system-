import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    browserNotifications: false,
    emailNotifications: false,
    dueDateReminders: true,
    taskUpdates: true,
    taskCompletions: true,
    overdueAlerts: true
  });

  // Request permission for browser notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setSettings(prev => ({
          ...prev,
          browserNotifications: permission === 'granted'
        }));
      });
    }
  }, []);

  // Check for overdue tasks periodically
  useEffect(() => {
    const checkOverdueTasks = () => {
      // This would typically get tasks from TaskContext
      // For now, we'll implement the basic structure
      if (settings.overdueAlerts) {
        // Check for overdue tasks and send notifications
      }
    };

    const interval = setInterval(checkOverdueTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [settings.overdueAlerts]);

  const showNotification = (type, title, message, options = {}) => {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      ...options
    };

    setNotifications(prev => [notification, ...prev]);

    // Show toast notification
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warn(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast(message);
    }

    // Show browser notification if enabled
    if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }

    return notification.id;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Notification helpers for specific task events
  const notifyTaskCreated = (task) => {
    if (settings.taskUpdates) {
      showNotification('success', 'Task Created', `New task "${task.title}" has been created`);
    }
  };

  const notifyTaskCompleted = (task) => {
    if (settings.taskCompletions) {
      showNotification('success', 'Task Completed', `Task "${task.title}" has been completed! 🎉`);
    }
  };

  const notifyTaskOverdue = (task) => {
    if (settings.overdueAlerts) {
      showNotification('warning', 'Task Overdue', `Task "${task.title}" is overdue!`, {
        priority: 'high'
      });
    }
  };

  const notifyDueDateApproaching = (task, timeLeft) => {
    if (settings.dueDateReminders) {
      showNotification('info', 'Due Date Reminder', `Task "${task.title}" is due ${timeLeft}`);
    }
  };

  const value = {
    notifications,
    settings,
    showNotification,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    updateSettings,
    notifyTaskCreated,
    notifyTaskCompleted,
    notifyTaskOverdue,
    notifyDueDateApproaching,
    unreadCount: notifications.filter(n => !n.read).length
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};