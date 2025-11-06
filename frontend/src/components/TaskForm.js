import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Plus, Trash2, Tag } from 'lucide-react';

const TaskForm = ({ task, onClose, onSuccess }) => {
  const { createTask, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  });
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [tags, setTags] = useState(task?.tags || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const taskData = {
      ...formData,
      dueDate: formData.dueDate || null,
      subtasks: subtasks,
      tags: tags
    };

    let result;
    if (task) {
      result = await updateTask(task._id, taskData);
    } else {
      result = await createTask(taskData);
    }

    setLoading(false);

    if (result.success) {
      onSuccess && onSuccess();
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { title: newSubtask.trim(), completed: false }]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="card" style={{ 
        width: '500px', 
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>
          <button 
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Subtasks Section */}
          <div className="form-group">
            <label className="form-label">Subtasks</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addSubtask)}
                placeholder="Add a subtask..."
                className="form-input"
                style={{ flex: 1 }}
                maxLength={150}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}
              >
                <Plus size={16} />
              </button>
            </div>
            {subtasks.length > 0 && (
              <div style={{
                maxHeight: '150px',
                overflowY: 'auto',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                padding: '8px'
              }}>
                {subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between gap-2 mb-2"
                    style={{
                      padding: '6px 8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px'
                    }}
                  >
                    <span style={{ flex: 1, fontSize: '14px' }}>
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTag)}
                placeholder="Add a tag..."
                className="form-input"
                style={{ flex: 1 }}
                maxLength={30}
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}
              >
                <Tag size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6c757d',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: '2px'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;