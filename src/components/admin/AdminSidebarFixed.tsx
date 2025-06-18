import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Briefcase, LayoutDashboard } from 'lucide-react';

const AdminSidebarFixed: React.FC = () => {
  return (
    <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 shadow-md border-r border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-solar-600 dark:text-solar-400">Admin Panel</h2>
        </div>
      
        <nav className="space-y-1 flex-grow">
          <NavLink 
            to="/admin/dashboard" 
            end
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin/businesses" 
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Briefcase size={18} />
            <span>Businesses</span>
          </NavLink>
          
          <NavLink 
            to="/admin/contacts" 
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Users size={18} />
            <span>Contacts</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebarFixed;
