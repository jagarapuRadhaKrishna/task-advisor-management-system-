import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, CheckCircle } from 'lucide-react';

const CalendarView = ({ onCreateTask, onEditTask }) => {
  const { tasks } = useTasks();
  const { isDarkMode, theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks
    
    let current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in-progress': return '#007bff';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div style={{
      backgroundColor: isDarkMode ? theme.background : '#f8f9fa',
      borderRadius: '12px',
      padding: '20px',
      height: 'calc(100vh - 200px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Calendar Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '600',
            color: isDarkMode ? theme.text : '#2d3748'
          }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <button
              onClick={() => navigateMonth(-1)}
              style={{
                background: 'none',
                border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
                color: isDarkMode ? theme.text : '#495057',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="btn btn-sm"
              style={{
                padding: '8px 12px',
                fontSize: '12px'
              }}
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              style={{
                background: 'none',
                border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
                color: isDarkMode ? theme.text : '#495057',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* View Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => onCreateTask()}
            className="btn btn-primary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={14} />
            Add Task
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        backgroundColor: isDarkMode ? theme.surface : 'white',
        borderRadius: '8px',
        border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Day Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
          borderBottom: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`
        }}>
          {dayNames.map(day => (
            <div
              key={day}
              style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: isDarkMode ? theme.textMuted : '#6c757d',
                borderRight: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          flex: 1
        }}>
          {calendarDays.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isOtherMonth = !isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                onClick={() => onCreateTask(date)}
                style={{
                  border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor: isTodayDate 
                    ? (isDarkMode ? '#2d5aa0' : '#e3f2fd')
                    : isOtherMonth 
                      ? (isDarkMode ? '#2d2d2d' : '#f8f9fa')
                      : (isDarkMode ? theme.surface : 'white'),
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '120px'
                }}
                onMouseEnter={(e) => {
                  if (!isTodayDate) {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#404040' : '#f1f3f4';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isTodayDate 
                    ? (isDarkMode ? '#2d5aa0' : '#e3f2fd')
                    : isOtherMonth 
                      ? (isDarkMode ? '#2d2d2d' : '#f8f9fa')
                      : (isDarkMode ? theme.surface : 'white');
                }}
              >
                {/* Date Number */}
                <div style={{
                  fontSize: '14px',
                  fontWeight: isTodayDate ? '600' : '500',
                  color: isOtherMonth 
                    ? (isDarkMode ? '#666' : '#999')
                    : isTodayDate 
                      ? 'white'
                      : (isDarkMode ? theme.text : '#2d3748'),
                  marginBottom: '4px'
                }}>
                  {date.getDate()}
                </div>

                {/* Tasks */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  {dayTasks.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      style={{
                        backgroundColor: getTaskStatusColor(task.status),
                        color: 'white',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                      title={task.title}
                    >
                      {task.status === 'completed' && <CheckCircle size={8} />}
                      {task.status === 'in-progress' && <Clock size={8} />}
                      <span>{task.title}</span>
                    </div>
                  ))}
                  
                  {/* Show more indicator */}
                  {dayTasks.length > 3 && (
                    <div style={{
                      fontSize: '9px',
                      color: isDarkMode ? theme.textMuted : '#6c757d',
                      fontWeight: '500'
                    }}>
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: isDarkMode ? theme.textMuted : '#6c757d'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#ffc107',
            borderRadius: '2px'
          }} />
          <span>Pending</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: isDarkMode ? theme.textMuted : '#6c757d'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#007bff',
            borderRadius: '2px'
          }} />
          <span>In Progress</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: isDarkMode ? theme.textMuted : '#6c757d'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#28a745',
            borderRadius: '2px'
          }} />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;