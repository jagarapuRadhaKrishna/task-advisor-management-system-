import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import KanbanBoard from '../components/KanbanBoard';
import CalendarView from '../components/CalendarView';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { 
  Plus, 
  Filter, 
  Search, 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  Target,
  BarChart3,
  Download,
  List,
  Columns,
  Calendar,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    tasks, 
    allTasks, 
    loading, 
    filter, 
    fetchTasks, 
    deleteTask, 
    updateTask,
    toggleSubtask,
    addComment,
    setFilter 
  } = useTasks();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('list'); // list, kanban, calendar, analytics

  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTask = (initialStatus = 'pending') => {
    setEditingTask(null);
    setShowTaskForm(true);
    // Store initial status for form
    setEditingTask({ status: initialStatus });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleToggleSubtask = async (taskId, subtaskId, completed) => {
    await toggleSubtask(taskId, subtaskId, completed);
  };

  const handleAddComment = async (taskId, text) => {
    await addComment(taskId, text);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const getViewIcon = (view) => {
    switch (view) {
      case 'list': return List;
      case 'kanban': return Columns;
      case 'calendar': return Calendar;
      case 'analytics': return TrendingUp;
      default: return List;
    }
  };

  const viewButtons = [
    { id: 'list', label: 'List View', icon: List },
    { id: 'kanban', label: 'Kanban', icon: Columns },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const exportTasks = () => {
    const dataStr = JSON.stringify(filteredTasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'tasks.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filter tasks by search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get task statistics
  const stats = {
    total: allTasks.length,
    pending: allTasks.filter(t => t.status === 'pending').length,
    inProgress: allTasks.filter(t => t.status === 'in-progress').length,
    completed: allTasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      {/* Clean Welcome Section with View Switcher */}
      <div className="card mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 style={{ margin: 0, marginBottom: '8px', color: '#1a202c' }}>Welcome back, {user?.name}!</h1>
            <p style={{ margin: 0, color: '#718096' }}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          {/* View Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f8f9fa',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            {viewButtons.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: currentView === id ? '#007bff' : 'transparent',
                  color: currentView === id ? 'white' : '#6c757d',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={label}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* View-based Content */}
      {currentView === 'list' && (
        <>
          {/* Clean Statistics - Only for List View */}
          <div className="grid grid-cols-4 mb-4">
            <div 
              className="card" 
              style={{ cursor: 'pointer', textAlign: 'center', padding: '16px' }}
              onClick={() => setFilter('all')}
            >
              <Target size={24} style={{ color: '#4299e1', margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0, color: '#1a202c', fontSize: '1.5rem' }}>{stats.total}</h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '12px' }}>Total Tasks</p>
            </div>

            <div 
              className="card" 
              style={{ cursor: 'pointer', textAlign: 'center', padding: '16px' }}
              onClick={() => setFilter('pending')}
            >
              <Clock size={24} style={{ color: '#ed8936', margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0, color: '#1a202c', fontSize: '1.5rem' }}>{stats.pending}</h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '12px' }}>Pending</p>
            </div>

            <div 
              className="card" 
              style={{ cursor: 'pointer', textAlign: 'center', padding: '16px' }}
              onClick={() => setFilter('in-progress')}
            >
              <PlayCircle size={24} style={{ color: '#4299e1', margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0, color: '#1a202c', fontSize: '1.5rem' }}>{stats.inProgress}</h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '12px' }}>In Progress</p>
            </div>

            <div 
              className="card" 
              style={{ cursor: 'pointer', textAlign: 'center', padding: '16px' }}
              onClick={() => setFilter('completed')}
            >
              <CheckCircle size={24} style={{ color: '#48bb78', margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0, color: '#1a202c', fontSize: '1.5rem' }}>{stats.completed}</h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '12px' }}>Completed</p>
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="card mb-4">
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <button
                  onClick={handleCreateTask}
                  className="btn btn-primary"
                >
                  <Plus size={16} style={{ marginRight: '6px' }} />
                  Add New Task
                </button>

                <div style={{ position: 'relative', minWidth: '250px' }}>
                  <Search 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#a0aec0'
                    }} 
                  />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-3" style={{
                justifyContent: window.innerWidth < 768 ? 'center' : 'flex-end'
              }}>
                <Filter size={20} color="#666" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="form-select"
                  style={{ 
                    width: 'auto',
                    minWidth: '150px',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px'
                  }}
                >
                  <option value="all">📋 All Tasks</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">🚀 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
                
                <button
                  onClick={exportTasks}
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          {loading ? (
            <div className="loading">
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="card text-center">
              <p style={{ color: '#666', margin: 0 }}>
                {searchTerm 
                  ? `No tasks found matching "${searchTerm}"` 
                  : filter === 'all' 
                    ? 'No tasks yet. Create your first task!'
                    : `No ${filter.replace('-', ' ')} tasks`
                }
              </p>
            </div>
          ) : (
            <div>
              {filteredTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleSubtask={handleToggleSubtask}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          )}
        </>
      )}

      {currentView === 'kanban' && (
        <KanbanBoard
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
        />
      )}

      {currentView === 'calendar' && (
        <CalendarView
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
        />
      )}

      {currentView === 'analytics' && (
        <AnalyticsDashboard />
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
          onSuccess={() => fetchTasks()}
        />
      )}
    </div>
  );
};

export default Dashboard;