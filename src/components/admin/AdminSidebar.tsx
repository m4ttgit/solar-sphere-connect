
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminSidebar: React.FC = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md border-r border-gray-200 dark:border-gray-700 hidden lg:block p-4">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-solar-600 dark:text-solar-400">Admin Panel</h2>
        </div>
      
        <nav className="space-y-1 flex-grow">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-solar-100 text-solar-800 dark:bg-solar-900 dark:text-solar-300' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin/posts" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-solar-100 text-solar-800 dark:bg-solar-900 dark:text-solar-300' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <FileText size={18} />
            <span>Blog Posts</span>
          </NavLink>
          
          <NavLink 
            to="/admin/posts/new" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-solar-100 text-solar-800 dark:bg-solar-900 dark:text-solar-300' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <PlusCircle size={18} />
            <span>Create Post</span>
          </NavLink>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/30"
            onClick={handleSignOut}
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
