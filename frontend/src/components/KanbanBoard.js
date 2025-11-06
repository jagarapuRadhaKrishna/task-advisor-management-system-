import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { Plus, MoreHorizontal, Calendar, User, MessageCircle, Paperclip } from 'lucide-react';

const KanbanBoard = ({ onCreateTask, onEditTask }) => {
  const { tasks, updateTask } = useTasks();
  const { isDarkMode, theme } = useTheme();
  
  const columns = [
    { id: 'pending', title: 'To Do', color: '#6c757d' },
    { id: 'in-progress', title: 'In Progress', color: '#007bff' },
    { id: 'completed', title: 'Completed', color: '#28a745' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (taskData.status !== newStatus) {
      await updateTask(taskData._id, { status: newStatus });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCompletionPercentage = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.status === 'completed' ? 100 : 0;
    }
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      height: 'calc(100vh - 200px)',
      backgroundColor: isDarkMode ? theme.background : '#f8f9fa',
      padding: '20px',
      borderRadius: '12px'
    }}>
      {columns.map(column => (
        <div
          key={column.id}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
          style={{
            backgroundColor: isDarkMode ? theme.surface : 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: isDarkMode 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Column Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: `2px solid ${column.color}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: column.color
              }} />
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: isDarkMode ? theme.text : '#2d3748'
              }}>
                {column.title}
              </h3>
              <span style={{
                backgroundColor: isDarkMode ? theme.border : '#e9ecef',
                color: isDarkMode ? theme.textMuted : '#6c757d',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            <button
              onClick={() => onCreateTask(column.id)}
              style={{
                background: 'none',
                border: 'none',
                color: column.color,
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={`Add task to ${column.title}`}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Tasks */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {getTasksByStatus(column.id).map(task => (
              <div
                key={task._id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onClick={() => onEditTask(task)}
                style={{
                  backgroundColor: isDarkMode ? '#404040' : 'white',
                  border: `1px solid ${isDarkMode ? '#555555' : '#e9ecef'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Priority Indicator */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getPriorityColor(task.priority)
                }} />

                {/* Task Title */}
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDarkMode ? theme.text : '#2d3748',
                  lineHeight: '1.3',
                  paddingRight: '16px'
                }}>
                  {task.title}
                </h4>

                {/* Task Description */}
                {task.description && (
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '12px',
                    color: isDarkMode ? theme.textMuted : '#6c757d',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {task.description}
                  </p>
                )}

                {/* Progress Bar */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: isDarkMode ? theme.textMuted : '#6c757d',
                        fontWeight: '500'
                      }}>
                        Progress
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: isDarkMode ? theme.textMuted : '#6c757d'
                      }}>
                        {getCompletionPercentage(task)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: isDarkMode ? '#555555' : '#e9ecef',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${getCompletionPercentage(task)}%`,
                        height: '100%',
                        backgroundColor: getCompletionPercentage(task) === 100 ? '#28a745' : column.color,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                )}

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '8px'
                  }}>
                    {task.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: isDarkMode ? '#555555' : '#f8f9fa',
                          color: isDarkMode ? theme.textMuted : '#6c757d',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '500'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                    {task.tags.length > 2 && (
                      <span style={{
                        color: isDarkMode ? theme.textMuted : '#6c757d',
                        fontSize: '10px'
                      }}>
                        +{task.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Task Meta Information */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {/* Due Date */}
                    {task.dueDate && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '10px',
                        color: new Date(task.dueDate) < new Date() && task.status !== 'completed'
                          ? '#dc3545'
                          : isDarkMode ? theme.textMuted : '#6c757d'
                      }}>
                        <Calendar size={10} />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    )}

                    {/* Comments Count */}
                    {task.comments && task.comments.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '10px',
                        color: isDarkMode ? theme.textMuted : '#6c757d'
                      }}>
                        <MessageCircle size={10} />
                        <span>{task.comments.length}</span>
                      </div>
                    )}

                    {/* Subtasks Count */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '10px',
                        color: isDarkMode ? theme.textMuted : '#6c757d'
                      }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          border: `1px solid ${isDarkMode ? theme.textMuted : '#6c757d'}`,
                          borderRadius: '2px'
                        }} />
                        <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                      </div>
                    )}
                  </div>

                  {/* More Options */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle more options
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? theme.textMuted : '#6c757d',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '2px'
                    }}
                  >
                    <MoreHorizontal size={12} />
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {getTasksByStatus(column.id).length === 0 && (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px dashed ${isDarkMode ? theme.border : '#e9ecef'}`,
                borderRadius: '8px',
                padding: '20px',
                color: isDarkMode ? theme.textMuted : '#6c757d',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                Drop tasks here or click + to add
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;