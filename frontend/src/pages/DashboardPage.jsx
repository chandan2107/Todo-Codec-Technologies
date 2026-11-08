import React, { useState, useEffect } from 'react';
import Navbar from '../components/ui/Navbar';
import TaskStats from '../components/tasks/TaskStats';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskCard from '../components/tasks/TaskCard';
import TaskKanban from '../components/tasks/TaskKanban';
import TaskListTable from '../components/tasks/TaskListTable';
import TaskModal from '../components/tasks/TaskModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import { useTasks } from '../hooks/useTasks';
import { Plus, Inbox, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban' | 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState('Pending');

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    taskId: null
  });

  const {
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
    deleteTask
  } = useTasks();

  const handleOpenCreateModal = (status = 'Pending') => {
    setEditingTask(null);
    setDefaultModalStatus(status);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Keyboard shortcut: 'c' opens create task modal when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === 'c' || e.key === 'C') &&
        !isModalOpen &&
        !deleteDialog.isOpen
      ) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          handleOpenCreateModal('Pending');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, deleteDialog.isOpen]);

  const handleModalSubmit = async (taskData) => {
    if (editingTask) {
      return await updateTask(editingTask._id, taskData);
    } else {
      return await createTask(taskData);
    }
  };

  const handleDeletePrompt = (taskId) => {
    setDeleteDialog({
      isOpen: true,
      taskId
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.taskId) {
      await deleteTask(deleteDialog.taskId);
      setDeleteDialog({ isOpen: false, taskId: null });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 pb-12">
      {/* Top Navigation */}
      <Navbar onOpenNewTaskModal={() => handleOpenCreateModal('Pending')} />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {/* Metric Ribbon */}
        <TaskStats
          stats={stats}
          loading={statsLoading}
          activeStatus={filters.status}
          onSelectStatus={(status) => updateFilters({ status })}
        />

        {/* Filter & View Toolbar */}
        <TaskFilters
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Views */}
        {loading ? (
          <div className="min-h-[260px] flex flex-col items-center justify-center">
            <Loader2 className="w-5 h-5 text-zinc-400 animate-spin mb-2" />
            <span className="text-xs text-zinc-400 font-mono">Loading tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-zinc-200 p-8 text-center max-w-sm mx-auto shadow-subtle my-8">
            <div className="w-9 h-9 rounded-md bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1">
              No tasks found
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              {filters.search || filters.status !== 'All' || filters.priority !== 'All'
                ? 'No matching tasks. Try resetting your search or filters.'
                : 'Your workspace is clear. Press "C" to create a task.'}
            </p>
            <button
              onClick={() => handleOpenCreateModal('Pending')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        ) : viewMode === 'kanban' ? (
          <TaskKanban
            tasks={tasks}
            onEdit={handleOpenEditModal}
            onDelete={handleDeletePrompt}
            onStatusChange={updateTaskStatus}
            onOpenCreateModal={handleOpenCreateModal}
          />
        ) : viewMode === 'list' ? (
          <div>
            <TaskListTable
              tasks={tasks}
              onEdit={handleOpenEditModal}
              onDelete={handleDeletePrompt}
              onStatusChange={updateTaskStatus}
            />
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        ) : (
          /* Grid View */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeletePrompt}
                  onStatusChange={updateTaskStatus}
                />
              ))}
            </div>

            <Pagination
              pagination={pagination}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
        defaultStatus={defaultModalStatus}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, taskId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
