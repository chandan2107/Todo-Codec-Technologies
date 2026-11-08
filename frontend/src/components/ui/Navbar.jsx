import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from './ProfileModal';
import {
  CheckSquare2,
  Plus,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Settings
} from 'lucide-react';

export default function Navbar({ onOpenNewTaskModal }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between">
          {/* Brand & Workspace breadcrumb */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-zinc-900 font-semibold text-sm tracking-tight">
              <div className="w-6 h-6 rounded bg-zinc-900 text-white flex items-center justify-center">
                <CheckSquare2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span>TaskFlow</span>
            </Link>
            <span className="text-zinc-300 font-mono text-xs">/</span>
            <span className="text-xs text-zinc-500 font-medium">Workspace</span>
          </div>

          {/* Right Actions */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              {/* New Task Button */}
              {onOpenNewTaskModal && (
                <button
                  onClick={onOpenNewTaskModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-subtle transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Task</span>
                  <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 bg-zinc-700 text-[10px] font-mono rounded text-zinc-300">
                    C
                  </kbd>
                </button>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-md hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors text-xs text-zinc-700 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-zinc-200 text-zinc-700 font-mono font-medium text-[11px] flex items-center justify-center uppercase">
                    {user?.name ? user.name.slice(0, 2) : 'U'}
                  </div>
                  <span className="hidden md:inline font-medium text-zinc-800">{user?.name}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-modal border border-zinc-200 py-1 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                        <p className="font-semibold text-zinc-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-zinc-500 font-mono truncate">{user?.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-zinc-400" />
                        Account Settings
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-t border-zinc-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900">
                Sign In
              </Link>
              <Link to="/register" className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Account Settings Modal */}
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
}
