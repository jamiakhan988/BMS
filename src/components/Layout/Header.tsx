import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useBusiness } from '../../hooks/useBusiness';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { business } = useBusiness();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {business && (
          <p className="text-sm text-gray-600">{business.name}</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {user?.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}