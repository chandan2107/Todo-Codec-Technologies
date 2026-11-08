import React from 'react';

export default function TaskStats({ stats, loading, activeStatus, onSelectStatus }) {
  if (loading || !stats) {
    return (
      <div className="h-10 bg-white border border-zinc-200 rounded-lg animate-pulse mb-4" />
    );
  }

  const items = [
    { id: 'All', label: 'All Tasks', count: stats.total },
    { id: 'Pending', label: 'Pending', count: stats.pending, dot: 'bg-amber-500' },
    { id: 'In-Progress', label: 'In Progress', count: stats.inProgress, dot: 'bg-blue-500' },
    { id: 'Completed', label: 'Completed', count: stats.completed, dot: 'bg-emerald-600' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-zinc-200 rounded-lg px-3.5 py-2.5 mb-4 shadow-subtle text-xs">
      {/* Status metrics bar */}
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
        {items.map((item) => {
          const isActive = activeStatus === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectStatus(item.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {item.dot && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-white' : item.dot
                  }`}
                />
              )}
              <span>{item.label}</span>
              <span
                className={`font-mono text-[11px] tabular-nums ml-0.5 ${
                  isActive ? 'text-zinc-300' : 'text-zinc-400'
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}

        {stats.overdue > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-rose-700 bg-rose-50 border border-rose-200 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{stats.overdue} overdue</span>
          </span>
        )}
      </div>

      {/* Completion Rate */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto text-zinc-500">
        <span className="text-[11px]">Completion</span>
        <div className="w-24 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-zinc-800 h-full rounded-full transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <span className="font-mono text-[11px] font-semibold text-zinc-800 tabular-nums">
          {stats.completionRate}%
        </span>
      </div>
    </div>
  );
}
