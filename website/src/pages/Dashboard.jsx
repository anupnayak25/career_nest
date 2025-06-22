import React, { useState } from 'react'
import { BookOpen, Brain, Code, Cog, Home, Play, Calendar, Trophy, User, Bell, Search, Plus } from 'lucide-react';
import Quiz from './QuizPage';
import Hr from './HrPage';
import Programing from './ProgrammingPage';
import Technical from './TehnicalPage';
import { Link, Outlet } from 'react-router-dom';


function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', to: '/' },
    { id: 'quiz', icon: BookOpen, label: 'Quiz', to: '/dashboard/quiz' },
    { id: 'hr', icon: User, label: 'HR', to: '/dashboard/hr' },
    { id: 'programming', icon: Code, label: 'Programming', to: '/dashboard/programming' },
    { id: 'technical', icon: Cog, label: 'Technical', to: '/dashboard/technical' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 h-screen fixed top-0 left-0 bg-white shadow-xl z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CarrierNest
          </h1>
          <p className="text-sm text-gray-600 mt-1">Teacher Portal</p>
        </div>
        <nav className="mt-6 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                to={item.to}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content with margin to account for fixed sidebar */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab}
              </h2>
              <p className="text-sm text-gray-600">
                Welcome back, Professor! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Bell size={20} />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">T</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


export default Dashboard
