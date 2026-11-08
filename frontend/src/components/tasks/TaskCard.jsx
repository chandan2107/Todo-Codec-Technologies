import React from 'react';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { Calendar, Edit2, Trash2, Tag, Check, ArrowRight } from 'lucide-react';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange
}) {
  const isCompleted = task.status === 'Completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue =
    task.dueDate &&
    !isCompleted &&
    new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  const getNextStatus = (current) => {
    if (current === 'Pending') return 'In-Progress';
    if (current === 'In-Progress') return 'Completed';
    return 'Pending';
  };

  return (
    <div
      className={`group relative bg-white rounded-lg border transition-all p-4 flex flex-col justify-between shadow-subtle ${
        isCompleted
          ? 'border-zinc-200 bg-zinc-50/60'
          : isOverdue
          ? 'border-rose-200 hover:border-rose-300'
          : 'border-zinc-200 hover:border-zinc-300'
      }`}
    >
      <div>
        {/* Header: Status, Priority & Quick Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <TaskStatusBadge
              status={task.status}
              interactive
              onClick={() => onStatusChange(task._id, getNextStatus(task.status))}
            />
            <TaskPriorityBadge priority={task.priority} />
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4
          className={`font-medium text-sm leading-snug mb-1.5 ${
            isCompleted ? 'line-through text-zinc-400' : 'text-zinc-900'
          }`}
        >
          {task.title}
        </h4>

        {/* Description */}
        {task.description && (
          <p
            className={`text-xs text-zinc-500 line-clamp-2 mb-3 ${
              isCompleted ? 'text-zinc-400' : ''
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mb-3">
            {task.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-mono text-[10px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Date and Quick status trigger */}
      <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs">
        {task.dueDate ? (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono ${
              isOverdue
                ? 'text-rose-600 font-medium'
                : 'text-zinc-400'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
            {isOverdue && <span className="text-[10px]">(overdue)</span>}
          </span>
        ) : (
          <span className="text-zinc-300 font-mono text-[11px]">—</span>
        )}

        <div className="flex items-center gap-1 text-[11px]">
          {task.status !== 'Completed' ? (
            <button
              onClick={() => onStatusChange(task._id, 'Completed')}
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 px-1.5 py-0.5 rounded hover:bg-zinc-100 cursor-pointer font-medium"
            >
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Done</span>
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(task._id, 'Pending')}
              className="text-zinc-400 hover:text-zinc-700 px-1.5 py-0.5 rounded hover:bg-zinc-100 cursor-pointer text-[11px]"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
