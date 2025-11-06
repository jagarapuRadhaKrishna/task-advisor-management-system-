import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

// Use environment variable for API URL, fallback to localhost
const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  loading: false,
  error: null,
  filter: 'all' // all, pending, in-progress, completed
};

const normalizeTask = (task) => {
  // ensure both id and _id exist for compatibility
  const id = task.id || task._id || Date.now().toString();
  return { ...task, id, _id: id };
};

const taskReducer = (state, action) => {
  let newTasks;
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TASKS':
      newTasks = (action.payload || []).map(normalizeTask);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { ...state, tasks: newTasks, loading: false, error: null };
    case 'ADD_TASK':
      newTasks = [normalizeTask(action.payload), ...state.tasks];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { ...state, tasks: newTasks };
    case 'UPDATE_TASK':
      newTasks = state.tasks.map(t => (t._id === (action.payload._id || action.payload.id) ? normalizeTask(action.payload) : t));
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { ...state, tasks: newTasks };
    case 'DELETE_TASK':
      newTasks = state.tasks.filter(t => t._id !== action.payload && t.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { ...state, tasks: newTasks };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from local storage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      dispatch({ type: 'SET_TASKS', payload: savedTasks });
    }
  }, [isAuthenticated, user]);

  const fetchTasks = async () => {
    // Tasks are already loaded from localStorage in the useEffect
    return { success: true };
  };

  const createTask = async (taskData) => {
    try {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: taskData.status || 'pending'
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
      toast.success('Task created successfully!');
      return { success: true, data: newTask };
    } catch (error) {
      toast.error('Failed to create task');
      return { success: false, message: 'Failed to create task' };
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updatedTask = { ...taskData, id: taskId };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      toast.success('Task updated successfully!');
      return { success: true, data: updatedTask };
    } catch (error) {
      toast.error('Failed to update task');
      return { success: false, message: 'Failed to update task' };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      dispatch({ type: 'DELETE_TASK', payload: taskId });
      toast.success('Task deleted successfully!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete task');
      return { success: false, message: 'Failed to delete task' };
    }
  };

  const toggleSubtask = async (taskId, subtaskId, completed) => {
    try {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      
      const updatedSubtasks = task.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed } : st
      );
      
      const updatedTask = { ...task, subtasks: updatedSubtasks };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return { success: true, data: updatedTask };
    } catch (error) {
      toast.error('Failed to update subtask');
      return { success: false, message: 'Failed to update subtask' };
    }
  };

  const addSubtask = async (taskId, title) => {
    try {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      
      const newSubtask = {
        id: Date.now().toString(),
        title,
        completed: false
      };
      
      const updatedTask = {
        ...task,
        subtasks: [...(task.subtasks || []), newSubtask]
      };
      
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return { success: true, data: updatedTask };
    } catch (error) {
      toast.error('Failed to add subtask');
      return { success: false, message: 'Failed to add subtask' };
    }
  };

  const addComment = async (taskId, text) => {
    try {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      
      const newComment = {
        id: Date.now().toString(),
        text,
        createdAt: new Date().toISOString(),
        user: user.name
      };
      
      const updatedTask = {
        ...task,
        comments: [...(task.comments || []), newComment]
      };
      
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return { success: true, data: updatedTask };
    } catch (error) {
      toast.error('Failed to add comment');
      return { success: false, message: 'Failed to add comment' };
    }
  };

  const reorderTasks = async (taskIds) => {
    try {
      const reorderedTasks = taskIds.map(id => 
        state.tasks.find(t => t.id === id)
      ).filter(Boolean);
      
      dispatch({ type: 'SET_TASKS', payload: reorderedTasks });
      return { success: true, data: reorderedTasks };
    } catch (error) {
      toast.error('Failed to reorder tasks');
      return { success: false, message: 'Failed to reorder tasks' };
    }
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Filter tasks based on current filter
  const filteredTasks = state.tasks.filter(task => {
    if (state.filter === 'all') return true;
    return task.status === state.filter;
  });

  const value = {
    tasks: filteredTasks,
    allTasks: state.tasks,
    loading: state.loading,
    error: state.error,
    filter: state.filter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    addComment,
    reorderTasks,
    setFilter,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};