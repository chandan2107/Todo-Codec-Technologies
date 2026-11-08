import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages, totalTasks, limit } = pagination;

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalTasks);

  return (
    <div className="flex items-center justify-between py-3 px-1 border-t border-zinc-200 mt-4 text-xs">
      <div className="text-zinc-500 font-mono text-[11px]">
        {startItem}–{endItem} of {totalTasks}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[11px] text-zinc-600 px-2">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
