import React from 'react';
import { Circle, Clock3, CheckCircle2 } from 'lucide-react';

export default function TaskStatusBadge({ status, interactive = false, onClick }) {
  const configs = {
    Pending: {
      dot: 'bg-amber-500',
      label: 'Pending',
      text: 'text-zinc-600',
      border: 'border-zinc-200 bg-white'
    },
    'In-Progress': {
      dot: 'bg-blue-500',
      label: 'In Progress',
      text: 'text-zinc-700',
      border: 'border-zinc-200 bg-white'
    },
    Completed: {
      dot: 'bg-emerald-600',
      label: 'Completed',
      text: 'text-zinc-500',
      border: 'border-zinc-200 bg-zinc-50'
    }
  };

  const config = configs[status] || configs.Pending;

  return (
    <span
      onClick={interactive ? onClick : undefined}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${config.border} ${config.text} ${
        interactive ? 'cursor-pointer hover:border-zinc-300 select-none' : ''
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
