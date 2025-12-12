import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Ban, UserCheck, X, ShoppingBag } from 'lucide-react';
import { Table, Badge, Card, Button } from '../../components/ui/Shared';
import { api } from '../../services/mockBackend';
import { User, Role, Order } from '../../types';
import { useUIStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useUIStore();
  
  // Selection & Sorting
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [userData, orderData] = await Promise.all([
        api.getUsers(),
        api.getOrders()
    ]);
    setUsers(userData);
    setOrders(orderData);
    setIsLoading(false);
  };

  const toggleStatus = async (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.toggleUserStatus(user.id);
      addNotification({ 
        type: 'success', 
        title: user.isActive ? 'User Locked' : 'User Activated',
        message: `User ${user.name} has been ${user.isActive ? 'locked' : 'activated'}.`
      });
      loadData();
    } catch (e) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to update user' });
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
       await api.updateUserRole(userId, newRole);
       addNotification({ type: 'success', title: 'Role Updated', message: `User role updated to ${newRole}` });
       loadData();
       if (selectedUser && selectedUser.id === userId) {
         setSelectedUser(prev => prev ? ({ ...prev, role: newRole }) : null);
       }
    } catch (e) {
       addNotification({ type: 'error', title: 'Error', message: 'Failed to update role' });
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedUsers = useMemo(() => {
    let result = [...users];
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [users, sortConfig]);

  const getUserOrders = (userId: string) => {
      // In a real app this would be a DB query, here we filter the loaded mocks
      return orders.filter(o => o.userId === userId);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table 
            headers={[
                { label: 'User', key: 'name' },
                { label: 'Role', key: 'role' },
                { label: 'Joined Date', key: 'createdAt' },
                { label: 'Status', key: 'isActive' },
                { label: 'Actions' }
            ]}
            onSort={handleSort}
            sortConfig={sortConfig}
        >
          {isLoading ? (
            <tr><td colSpan={5} className="p-4 text-center">Loading users...</td></tr>
          ) : processedUsers.map(user => (
            <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedUser(user)}
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <select
                    value={user.role}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    className={`h-8 text-xs rounded border-0 bg-opacity-20 font-semibold px-2 cursor-pointer focus:ring-2 focus:ring-primary ${
                        user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' :
                        user.role === Role.EMPLOYEE ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}
                >
                    <option value={Role.CUSTOMER}>Customer</option>
                    <option value={Role.EMPLOYEE}>Employee</option>
                    <option value={Role.ADMIN}>Admin</option>
                </select>
              </td>
              <td className="px-4 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-4">
                <Badge variant={user.isActive ? 'success' : 'destructive'}>
                  {user.isActive ? 'Active' : 'Locked'}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => toggleStatus(user, e)}
                    title={user.isActive ? "Lock Account" : "Activate Account"}
                  >
                    {user.isActive ? <Ban size={16} className="text-red-500" /> : <UserCheck size={16} className="text-green-500" />}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Customer Detail Drawer */}
      <AnimatePresence>
        {selectedUser && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedUser(null)}
                    className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b flex items-start justify-between bg-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                                <p className="text-gray-500">{selectedUser.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant={selectedUser.isActive ? 'success' : 'destructive'}>
                                        {selectedUser.isActive ? 'Active Account' : 'Locked Account'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mb-8">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <select 
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                    value={selectedUser.role}
                                    onChange={(e) => handleRoleChange(selectedUser.id, e.target.value as Role)}
                                >
                                    <option value={Role.CUSTOMER}>Customer</option>
                                    <option value={Role.EMPLOYEE}>Employee</option>
                                    <option value={Role.ADMIN}>Admin</option>
                                </select>
                            </div>

                            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <ShoppingBag size={20} /> Order History
                            </h3>
                            
                            <div className="space-y-4">
                                {getUserOrders(selectedUser.id).length === 0 ? (
                                    <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
                                        <p className="text-gray-500">No orders found for this user.</p>
                                    </div>
                                ) : (
                                    getUserOrders(selectedUser.id).map(order => (
                                        <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-gray-900">Order #{order.id}</p>
                                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <Badge variant={
                                                    order.status === 'delivered' ? 'success' : 
                                                    order.status === 'processing' ? 'default' : 'warning'
                                                }>{order.status}</Badge>
                                            </div>
                                            <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-3">
                                                <p className="text-sm text-gray-500">{order.items.length} items</p>
                                                <p className="font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}