import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { cn } from '../components/ui/Shared';
import { Role } from '../types';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
      isActive 
        ? "bg-gray-900 text-white shadow-sm" 
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    )}>
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

// Define permissions map
const PERMISSIONS: Record<string, Role[]> = {
  dashboard: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.SUPPORT],
  products: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  orders: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT],
  customers: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT],
  settings: [Role.SUPER_ADMIN, Role.ADMIN],
};

const hasPermission = (userRole: Role, feature: string) => {
  return PERMISSIONS[feature]?.includes(userRole);
};

export const AdminLayout = () => {
  const { user, logout } = useAuthStore();

  if (!user || !Object.values(Role).includes(user.role) || user.role === Role.CUSTOMER) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <aside className="w-64 bg-white border-r border-gray-100 fixed inset-y-0 z-30 hidden md:flex flex-col shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="font-bold text-lg tracking-tight text-gray-900">Eflyer Admin</span>
        </div>
        <div className="flex-1 p-4 space-y-1">
          {hasPermission(user.role, 'dashboard') && (
            <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          )}
          {hasPermission(user.role, 'products') && (
            <SidebarItem to="/admin/products" icon={Package} label="Products" />
          )}
          {hasPermission(user.role, 'orders') && (
            <SidebarItem to="/admin/orders" icon={ShoppingCart} label="Orders" />
          )}
          {hasPermission(user.role, 'customers') && (
            <SidebarItem to="/admin/customers" icon={Users} label="Customers" />
          )}
          {hasPermission(user.role, 'settings') && (
            <SidebarItem to="/admin/settings" icon={Settings} label="Settings" />
          )}
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize flex items-center gap-1">
                {user.role === Role.SUPER_ADMIN ? <ShieldAlert size={10} className="text-orange-500"/> : null}
                {user.role}
              </p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
