import React, { useState } from 'react';
import { Edit, Trash2, Calendar, AlertCircle, CheckCircle, Clock, PlayCircle, Flag, List, MessageCircle, MoreVertical } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggleSubtask, onAddComment }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in-progress': return '#007bff';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'in-progress': return <PlayCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date() && task.status !== 'completed';
  };

  const getCompletionPercentage = () => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.status === 'completed' ? 100 : 0;
    }
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div 
      className="card" 
      style={{ 
        marginBottom: '20px',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
          : '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: `3px solid ${isOverdue(task.dueDate) ? '#dc3545' : 'transparent'}`,
        borderRadius: '12px',
        padding: '25px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            margin: 0, 
            color: '#2d3748',
            fontSize: '1.25rem',
            fontWeight: '600',
            lineHeight: '1.4'
          }}>
            {task.title}
          </h4>
          
          {/* Completion Progress Bar */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#6c757d',
                  fontWeight: '500'
                }}>
                  Progress: {completionPercentage}%
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#6c757d'
                }}>
                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} tasks
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e9ecef',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  backgroundColor: completionPercentage === 100 ? '#28a745' : '#007bff',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {isOverdue(task.dueDate) && (
            <div className="d-flex align-items-center gap-1 mt-2" style={{
              color: '#dc3545',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <AlertCircle size={16} />
              <span>OVERDUE</span>
            </div>
          )}
        </div>
        <div className="d-flex gap-2">
          {task.subtasks && task.subtasks.length > 0 && (
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="btn btn-sm"
              style={{
                background: showSubtasks ? '#495057' : '#6c757d',
                border: 'none',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              title="Toggle Subtasks"
            >
              <List size={16} />
            </button>
          )}
          {task.comments && task.comments.length > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="btn btn-sm"
              style={{
                background: showComments ? '#495057' : '#6c757d',
                border: 'none',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title="Toggle Comments"
            >
              <MessageCircle size={16} />
              {task.comments.length > 0 && (
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
                  {task.comments.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="btn btn-sm"
            style={{
              background: '#495057',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="btn btn-sm"
            style={{
              background: '#dc3545',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          margin: '15px 0',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ 
            color: '#495057', 
            margin: 0,
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            {task.description}
          </p>
        </div>
      )}

      <div className="d-flex align-items-center gap-3 mb-3">
        <div
          style={{
            backgroundColor: getStatusColor(task.status),
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {getStatusIcon(task.status)}
          {task.status.replace('-', ' ')}
        </div>
        
        <div
          style={{
            backgroundColor: getPriorityColor(task.priority),
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          <Flag size={12} />
          {task.priority} PRIORITY
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="d-flex gap-1 flex-wrap">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Subtasks Section */}
      {showSubtasks && task.subtasks && task.subtasks.length > 0 && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          margin: '15px 0',
          border: '1px solid #e9ecef'
        }}>
          <h6 style={{ margin: '0 0 10px 0', color: '#495057', fontWeight: '600' }}>
            Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
          </h6>
          {task.subtasks.map((subtask, index) => (
            <div
              key={subtask._id || index}
              className="d-flex align-items-center gap-2 mb-2"
              style={{
                padding: '8px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}
            >
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => onToggleSubtask && onToggleSubtask(task._id, subtask._id, !subtask.completed)}
                style={{
                  transform: 'scale(1.2)',
                  accentColor: '#007bff'
                }}
              />
              <span style={{
                flex: 1,
                textDecoration: subtask.completed ? 'line-through' : 'none',
                color: subtask.completed ? '#6c757d' : '#495057',
                fontSize: '14px'
              }}>
                {subtask.title}
              </span>
              {subtask.completedAt && (
                <span style={{
                  fontSize: '11px',
                  color: '#6c757d',
                  backgroundColor: '#e9ecef',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  ✓ {formatDate(subtask.completedAt)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comments Section */}
      {showComments && task.comments && task.comments.length > 0 && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          margin: '15px 0',
          border: '1px solid #e9ecef'
        }}>
          <h6 style={{ margin: '0 0 10px 0', color: '#495057', fontWeight: '600' }}>
            Comments ({task.comments.length})
          </h6>
          {task.comments.map((comment, index) => (
            <div
              key={comment._id || index}
              style={{
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                marginBottom: index < task.comments.length - 1 ? '8px' : '0'
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#007bff'
                }}>
                  {comment.userName}
                </span>
                <span style={{
                  fontSize: '11px',
                  color: '#6c757d'
                }}>
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#495057',
                lineHeight: '1.4'
              }}>
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between" style={{
        paddingTop: '15px',
        borderTop: '1px solid #e9ecef',
        marginTop: '15px'
      }}>
        <div style={{ 
          fontSize: '13px', 
          color: '#6c757d',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <Calendar size={14} />
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
        
        {task.dueDate && (
          <div className="d-flex align-items-center gap-2" style={{
            fontSize: '13px',
            color: isOverdue(task.dueDate) ? '#dc3545' : '#495057',
            fontWeight: isOverdue(task.dueDate) ? '600' : '400',
            padding: '5px 10px',
            backgroundColor: isOverdue(task.dueDate) ? '#fff5f5' : '#f8f9fa',
            borderRadius: '6px',
            border: `1px solid ${isOverdue(task.dueDate) ? '#fed7d7' : '#e9ecef'}`
          }}>
            {isOverdue(task.dueDate) && <AlertCircle size={14} />}
            <Calendar size={14} />
            <span>Due: {formatDate(task.dueDate)}</span>
            {isOverdue(task.dueDate) && (
              <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>⚠️</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;