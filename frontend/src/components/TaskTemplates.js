import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskTemplates.css';

const TaskTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    templateData: {
      title: '',
      description: '',
      priority: 'medium',
      tags: []
    },
    category: 'personal'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/templates', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setFormData({
        name: '',
        description: '',
        templateData: {
          title: '',
          description: '',
          priority: 'medium',
          tags: []
        },
        category: 'personal'
      });
      setShowCreateModal(false);
      fetchTemplates();
    } catch (error) {
      console.error('Failed to create template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = async () => {
    // Create new task from template
    try {
      await axios.post(
        '/api/tasks',
        {
          title: selectedTemplate.templateData.title,
          description: selectedTemplate.templateData.description,
          priority: selectedTemplate.templateData.priority,
          tags: selectedTemplate.templateData.tags
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setShowApplyModal(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to create task from template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await axios.delete(`/api/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  return (
    <div className="task-templates">
      <div className="templates-header">
        <h2>Task Templates</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + New Template
        </button>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template._id} className="template-card">
            <div className="template-header">
              <h3>{template.name}</h3>
              <span className={`category-badge ${template.category}`}>
                {template.category}
              </span>
            </div>
            <p className="template-description">{template.description}</p>

            <div className="template-preview">
              <strong>Preview:</strong>
              <p>{template.templateData.title}</p>
              <span className={`priority-badge ${template.templateData.priority}`}>
                {template.templateData.priority}
              </span>
            </div>

            <div className="template-actions">
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowApplyModal(true);
                }}
              >
                Use Template
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteTemplate(template._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Template</h2>
            <form onSubmit={handleCreateTemplate}>
              <input
                type="text"
                placeholder="Template Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Template Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Task Title"
                value={formData.templateData.title}
                onChange={(e) => setFormData({
                  ...formData,
                  templateData: { ...formData.templateData, title: e.target.value }
                })}
                required
              />
              <select
                value={formData.templateData.priority}
                onChange={(e) => setFormData({
                  ...formData,
                  templateData: { ...formData.templateData, priority: e.target.value }
                })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showApplyModal && selectedTemplate && (
        <div className="modal">
          <div className="modal-content">
            <h2>Apply Template</h2>
            <p>Create a new task from "{selectedTemplate.name}" template?</p>
            <div className="form-actions">
              <button
                onClick={handleApplyTemplate}
                className="btn btn-primary"
              >
                Create Task
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
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

export default TaskTemplates;
