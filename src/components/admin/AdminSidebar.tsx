import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Briefcase, LayoutDashboard, MessageSquare } from 'lucide-react';

const AdminSidebar: React.FC = () => {

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md border-r border-gray-200 dark:border-gray-700 hidden lg:block p-4">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-solar-600 dark:text-solar-400">Admin Panel</h2>
        </div>
      
        <nav className="space-y-1 flex-grow">
          <NavLink 
            to="/admin/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-gray-100 text-solar-600 dark:bg-gray-700 dark:text-solar-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin/businesses" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-gray-100 text-solar-600 dark:bg-gray-700 dark:text-solar-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <Briefcase size={18} />
            <span>Businesses</span>
          </NavLink>
          
          <NavLink
            to="/admin/inquiries"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-gray-100 text-solar-600 dark:bg-gray-700 dark:text-solar-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <MessageSquare size={18} />
            <span>Inquiries</span>
          </NavLink>

        </nav>
        
        {/* Sign Out button removed */}
      </div>
    </aside>
  );
};

export default AdminSidebar;