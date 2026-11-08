import React from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

export default function TaskKanban({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateModal
}) {
  const columns = [
    {
      id: 'Pending',
      title: 'Pending',
      dot: 'bg-amber-500',
      tasks: tasks.filter((t) => t.status === 'Pending')
    },
    {
      id: 'In-Progress',
      title: 'In Progress',
      dot: 'bg-blue-500',
      tasks: tasks.filter((t) => t.status === 'In-Progress')
    },
    {
      id: 'Completed',
      title: 'Completed',
      dot: 'bg-emerald-600',
      tasks: tasks.filter((t) => t.status === 'Completed')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col bg-zinc-100/70 border border-zinc-200 rounded-lg p-3 min-h-[520px]"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${column.dot}`} />
              <h3 className="font-semibold text-xs text-zinc-800 uppercase tracking-wider">
                {column.title}
              </h3>
              <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                {column.tasks.length}
              </span>
            </div>

            <button
              onClick={() => onOpenCreateModal(column.id)}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors cursor-pointer"
              title={`Add ${column.title} task`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Column */}
          <div className="flex-1 space-y-2.5 overflow-y-auto">
            {column.tasks.length === 0 ? (
              <div className="h-28 flex items-center justify-center border border-dashed border-zinc-300 rounded-md text-center">
                <span className="text-xs text-zinc-400">No tasks</span>
              </div>
            ) : (
              column.tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
