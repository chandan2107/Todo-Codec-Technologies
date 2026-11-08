import React from 'react';
import { SignalLow, SignalMedium, SignalHigh } from 'lucide-react';

export default function TaskPriorityBadge({ priority }) {
  const configs = {
    Low: {
      icon: SignalLow,
      label: 'Low',
      color: 'text-zinc-500'
    },
    Medium: {
      icon: SignalMedium,
      label: 'Med',
      color: 'text-amber-600'
    },
    High: {
      icon: SignalHigh,
      label: 'High',
      color: 'text-rose-600'
    }
  };

  const config = configs[priority] || configs.Medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium font-mono ${config.color}`}
      title={`Priority: ${priority}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
