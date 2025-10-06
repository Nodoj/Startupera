"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import type { UserWithRole } from '@/lib/utils/rbac';
import { signOut } from '@/lib/actions/auth';

interface ProfileDropdownProps {
  user: UserWithRole;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getInitials = () => {
    if (user.full_name) {
      return user.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors p-1 pr-3"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-semibold text-sm">
          {getInitials()}
        </div>
        <span className="hidden md:block text-sm font-medium text-dark dark:text-white">
          {user.full_name || user.email.split('@')[0]}
        </span>
        <svg
          className={`h-4 w-4 text-dark dark:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-dark shadow-lg border border-stroke dark:border-stroke-dark overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-stroke dark:border-stroke-dark">
            <p className="text-sm font-semibold text-dark dark:text-white truncate">
              {user.full_name || 'User'}
            </p>
            <p className="text-xs text-body-color dark:text-body-color-dark truncate">
              {user.email}
            </p>
            {user.role && (
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : user.role === 'editor'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {user.role === 'admin' && <Shield className="h-3 w-3" />}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>

            <div className="my-1 border-t border-stroke dark:border-stroke-dark"></div>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
