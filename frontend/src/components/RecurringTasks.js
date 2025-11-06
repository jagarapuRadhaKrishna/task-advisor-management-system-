import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecurringTasks.css';

const RecurringTasks = () => {
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    taskId: '',
    pattern: {
      type: 'daily',
      interval: 1,
      daysOfWeek: [],
      endDate: ''
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecurringTasks();
  }, []);

  const fetchRecurringTasks = async () => {
    try {
      const response = await axios.get('/api/recurring', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRecurringTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch recurring tasks:', error);
    }
  };

  const handleCreateRecurring = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/recurring', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setFormData({
        taskId: '',
        pattern: {
          type: 'daily',
          interval: 1,
          daysOfWeek: [],
          endDate: ''
        }
      });
      setShowModal(false);
      fetchRecurringTasks();
    } catch (error) {
      console.error('Failed to create recurring task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecurring = async (recurringId) => {
    try {
      await axios.delete(`/api/recurring/${recurringId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRecurringTasks();
    } catch (error) {
      console.error('Failed to delete recurring task:', error);
    }
  };

  const toggleRecurringActive = async (recurringId, isActive) => {
    try {
      await axios.put(
        `/api/recurring/${recurringId}`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchRecurringTasks();
    } catch (error) {
      console.error('Failed to update recurring task:', error);
    }
  };

  return (
    <div className="recurring-tasks">
      <div className="recurring-header">
        <h2>Recurring Tasks</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Make Recurring
        </button>
      </div>

      <div className="recurring-list">
        {recurringTasks.map((recurring) => (
          <div key={recurring._id} className="recurring-item">
            <div className="recurring-info">
              <h3>{recurring.taskId?.title}</h3>
              <p>Pattern: <strong>{recurring.pattern.type}</strong></p>
              <p>Next Due: {new Date(recurring.nextDueDate).toLocaleDateString()}</p>
            </div>

            <div className="recurring-actions">
              <button
                className={`btn btn-sm ${recurring.isActive ? 'btn-warning' : 'btn-secondary'}`}
                onClick={() => toggleRecurringActive(recurring._id, recurring.isActive)}
              >
                {recurring.isActive ? 'Pause' : 'Resume'}
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteRecurring(recurring._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Make Task Recurring</h2>
            <form onSubmit={handleCreateRecurring}>
              <label>Recurrence Pattern:</label>
              <select
                value={formData.pattern.type}
                onChange={(e) => setFormData({
                  ...formData,
                  pattern: { ...formData.pattern, type: e.target.value }
                })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>

              <label>Interval:</label>
              <input
                type="number"
                min="1"
                value={formData.pattern.interval}
                onChange={(e) => setFormData({
                  ...formData,
                  pattern: { ...formData.pattern, interval: parseInt(e.target.value) }
                })}
              />

              <label>End Date (Optional):</label>
              <input
                type="date"
                value={formData.pattern.endDate}
                onChange={(e) => setFormData({
                  ...formData,
                  pattern: { ...formData.pattern, endDate: e.target.value }
                })}
              />

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  Create Recurring
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringTasks;
