import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Briefcase, LayoutDashboard } from 'lucide-react';

const AdminSidebarMinimal: React.FC = () => {
  return (
    <div>
      <h2>Admin Panel</h2>
      <nav>
        <NavLink to="/admin/dashboard">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/businesses">
          <Briefcase size={18} />
          <span>Businesses</span>
        </NavLink>
        <NavLink to="/admin/contacts">
          <Users size={18} />
          <span>Contacts</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebarMinimal;
