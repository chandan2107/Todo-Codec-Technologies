import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import {
  Search,
  X,
  LayoutGrid,
  Columns3,
  List,
  ArrowUpDown,
  Filter
} from 'lucide-react';

export default function TaskFilters({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange
}) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 250);
  const searchInputRef = useRef(null);

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const handleClear = () => {
    setSearchInput('');
    onFilterChange({ search: '' });
  };

  const hasActiveFilters =
    filters.priority !== 'All' ||
    filters.search !== '' ||
    filters.sortBy !== 'createdAt';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4 text-xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Filter tasks... (press '/' to focus)"
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-colors placeholder:text-zinc-400"
        />
        {searchInput ? (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.2 bg-zinc-100 text-[10px] font-mono rounded text-zinc-400 border border-zinc-200">
            /
          </kbd>
        )}
      </div>

      {/* Controls: Priority, Sorting, View Toggle */}
      <div className="flex items-center gap-2 justify-between sm:justify-end">
        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="py-1 px-2 text-xs bg-white border border-zinc-200 rounded-md text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800 cursor-pointer"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {/* Sort selector */}
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="py-1 px-2 text-xs bg-white border border-zinc-200 rounded-md text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800 cursor-pointer"
        >
          <option value="createdAt">Date Created</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>

        {/* Order toggle */}
        <button
          onClick={() =>
            onFilterChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })
          }
          className="p-1.5 rounded-md bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
          title={`Order: ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchInput('');
              onResetFilters();
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900 px-1.5 py-1 underline font-medium cursor-pointer"
          >
            Reset
          </button>
        )}

        <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block" />

        {/* View Switcher */}
        <div className="flex items-center bg-zinc-100 p-0.5 rounded-md border border-zinc-200">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-zinc-900 shadow-subtle'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('kanban')}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white text-zinc-900 shadow-subtle'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
            title="Kanban Board"
          >
            <Columns3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-zinc-900 shadow-subtle'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
