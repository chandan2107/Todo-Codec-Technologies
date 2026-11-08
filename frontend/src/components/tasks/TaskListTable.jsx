import React from 'react';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { Calendar, Edit2, Trash2, Check, Circle } from 'lucide-react';

export default function TaskListTable({
  tasks,
  onEdit,
  onDelete,
  onStatusChange
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-zinc-200 shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-8"></th>
              <th className="py-2.5 px-3">Title</th>
              <th className="py-2.5 px-3 w-32">Status</th>
              <th className="py-2.5 px-3 w-24">Priority</th>
              <th className="py-2.5 px-3 w-28">Due</th>
              <th className="py-2.5 px-3 w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
            {tasks.map((task) => {
              const isCompleted = task.status === 'Completed';
              return (
                <tr
                  key={task._id}
                  className="hover:bg-zinc-50/80 transition-colors group"
                >
                  {/* Done checkbox */}
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() =>
                        onStatusChange(
                          task._id,
                          isCompleted ? 'Pending' : 'Completed'
                        )
                      }
                      className="text-zinc-300 hover:text-zinc-600 cursor-pointer"
                      title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    >
                      {isCompleted ? (
                        <div className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded border border-zinc-300 hover:border-zinc-400" />
                      )}
                    </button>
                  </td>

                  {/* Title & tags */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium text-zinc-900 ${
                          isCompleted ? 'line-through text-zinc-400' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.tags && task.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 font-mono text-[10px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-zinc-400 truncate max-w-lg mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                      className="text-xs bg-transparent border-0 font-medium text-zinc-700 focus:ring-0 cursor-pointer p-0"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In-Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  {/* Priority */}
                  <td className="py-2.5 px-3">
                    <TaskPriorityBadge priority={task.priority} />
                  </td>

                  {/* Due Date */}
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500">
                    {formatDate(task.dueDate)}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(task._id)}
                        className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
