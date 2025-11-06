import React from 'react';
import { 
  Edit2, 
  Trash2, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  AlertTriangle,
  Calendar,
  Flag
} from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { title, description, status, priority, dueDate, createdAt } = task;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} style={{ color: '#48bb78' }} />;
      case 'in-progress':
        return <PlayCircle size={16} style={{ color: '#4299e1' }} />;
      default:
        return <Clock size={16} style={{ color: '#ed8936' }} />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: { backgroundColor: '#f0fff4', color: '#2f855a', border: '1px solid #9ae6b4' },
      'in-progress': { backgroundColor: '#ebf8ff', color: '#2b6cb0', border: '1px solid #90cdf4' },
      pending: { backgroundColor: '#fffaf0', color: '#c05621', border: '1px solid #fbb040' }
    };

    return (
      <span 
        style={{
          ...styles[status],
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '500',
          textTransform: 'capitalize'
        }}
      >
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#f56565';
      case 'medium':
        return '#ed8936';
      case 'low':
        return '#48bb78';
      default:
        return '#a0aec0';
    }
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== 'completed';
  const isDueSoon = dueDate && 
    new Date(dueDate) > new Date() && 
    new Date(dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000) && 
    status !== 'completed';

  return (
    <div 
      className="card" 
      style={{
        marginBottom: '16px',
        position: 'relative',
        borderLeft: `4px solid ${getPriorityColor(priority)}`,
        padding: '20px',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-2">
          {getStatusIcon(status)}
          <h3 
            style={{ 
              margin: 0, 
              color: '#1a202c', 
              fontSize: '1.1rem',
              fontWeight: '600',
              textDecoration: status === 'completed' ? 'line-through' : 'none',
              opacity: status === 'completed' ? 0.7 : 1
            }}
          >
            {title}
          </h3>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          {getStatusBadge(status)}
          <div className="d-flex gap-1">
            <button
              onClick={() => onEdit(task)}
              className="btn btn-icon"
              title="Edit task"
              style={{
                padding: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#4a5568',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="btn btn-icon"
              title="Delete task"
              style={{
                padding: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#e53e3e',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p 
          style={{ 
            margin: '0 0 16px 0', 
            color: '#4a5568', 
            fontSize: '14px',
            lineHeight: '1.5',
            opacity: status === 'completed' ? 0.7 : 1
          }}
        >
          {description}
        </p>
      )}

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center text-sm">
        <div className="d-flex align-items-center gap-4">
          {/* Priority */}
          <div className="d-flex align-items-center gap-1">
            <Flag size={12} style={{ color: getPriorityColor(priority) }} />
            <span 
              style={{ 
                color: getPriorityColor(priority), 
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
            >
              {priority}
            </span>
          </div>

          {/* Due Date */}
          {dueDate && (
            <div className="d-flex align-items-center gap-1">
              <Calendar size={12} style={{ color: isOverdue ? '#f56565' : isDueSoon ? '#ed8936' : '#718096' }} />
              <span 
                style={{ 
                  color: isOverdue ? '#f56565' : isDueSoon ? '#ed8936' : '#718096',
                  fontSize: '12px',
                  fontWeight: isOverdue || isDueSoon ? '500' : '400'
                }}
              >
                Due {new Date(dueDate).toLocaleDateString()}
              </span>
              {isOverdue && <AlertTriangle size={12} style={{ color: '#f56565' }} />}
            </div>
          )}
        </div>

        {/* Created Date */}
        <span style={{ color: '#a0aec0', fontSize: '11px' }}>
          Created {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Overdue Warning */}
      {isOverdue && (
        <div 
          style={{
            marginTop: '12px',
            padding: '8px 12px',
            backgroundColor: '#fed7d7',
            color: '#c53030',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <AlertTriangle size={14} />
          This task is overdue
        </div>
      )}

      {/* Due Soon Warning */}
      {isDueSoon && (
        <div 
          style={{
            marginTop: '12px',
            padding: '8px 12px',
            backgroundColor: '#fef5e7',
            color: '#c05621',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Clock size={14} />
          Due within 24 hours
        </div>
      )}
    </div>
  );
};

export default TaskCard;