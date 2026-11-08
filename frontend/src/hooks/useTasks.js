import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/taskApi';
import { useToast } from '../context/ToastContext';

export function useTasks(initialFilters = {}) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalTasks: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    status: 'All',
    priority: 'All',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    ...initialFilters
  });

  const { showToast } = useToast();

  // Fetch tasks based on active filters and pagination
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        priority: filters.priority,
        search: filters.search,
        sortBy: filters.sortBy,
        order: filters.order
      };

      const res = await taskApi.getTasks(params);
      setTasks(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  // Fetch task statistics
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await taskApi.getTaskStats();
      setStats(res.data);
    } catch (err) {
      console.warn('Failed to fetch stats:', err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Trigger tasks fetch when filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Initial stats fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await taskApi.createTask(taskData);
      showToast('Task created successfully!', 'success');
      fetchTasks();
      fetchStats();
      return { success: true, data: res.data };
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
      return { success: false, message: err.message, errors: err.errors };
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const res = await taskApi.updateTask(id, taskData);
      showToast('Task updated successfully!', 'success');
      // Optimistically update tasks list
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...res.data } : t))
      );
      fetchStats();
      return { success: true, data: res.data };
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
      return { success: false, message: err.message, errors: err.errors };
    }
  };

  // Quick Status Update
  const updateTaskStatus = async (id, status) => {
    // Save current status for rollback
    const prevTask = tasks.find((t) => t._id === id);
    const prevStatus = prevTask ? prevTask.status : null;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t))
    );

    try {
      const res = await taskApi.updateTaskStatus(id, status);
      fetchStats();
      return { success: true, data: res.data };
    } catch (err) {
      // Rollback on failure
      if (prevStatus) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: prevStatus } : t))
        );
      }
      showToast(err.message || 'Failed to update status', 'error');
      return { success: false, message: err.message };
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await taskApi.deleteTask(id);
      showToast('Task deleted successfully', 'success');
      setTasks((prev) => prev.filter((t) => t._id !== id));
      fetchStats();
      // If last item on page and not page 1, go to previous page
      if (tasks.length === 1 && pagination.currentPage > 1) {
        setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchTasks();
      }
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
      return { success: false, message: err.message };
    }
  };

  // Filter setters
  const setPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to page 1 on filter changes
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 9,
      status: 'All',
      priority: 'All',
      search: '',
      sortBy: 'createdAt',
      order: 'desc'
    });
  };

  return {
    tasks,
    stats,
    loading,
    statsLoading,
    pagination,
    filters,
    setPage,
    updateFilters,
    resetFilters,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks: fetchTasks,
    refreshStats: fetchStats
  };
}

