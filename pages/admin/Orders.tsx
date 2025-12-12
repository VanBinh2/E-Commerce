import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Truck, CheckCircle, XCircle, Clock, Filter, ArrowUpDown } from 'lucide-react';
import { Table, Badge, Card, Button, Modal } from '../../components/ui/Shared';
import { api } from '../../services/mockBackend';
import { Order, OrderStatus } from '../../types';
import { useUIStore } from '../../store/useStore';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { addNotification } = useUIStore();
  
  // Sorting & Filtering State
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await api.getOrders();
    setOrders(data);
    setIsLoading(false);
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(id, status);
      addNotification({ type: 'success', title: 'Updated', message: `Order status changed to ${status}` });
      loadOrders(); // Refresh to update local state fully if needed
      if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (e) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to update status' });
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedOrders = useMemo(() => {
    let result = [...orders];

    // Filter
    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Sort
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [orders, statusFilter, sortConfig]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return <Badge variant="success">Delivered</Badge>;
      case OrderStatus.SHIPPED: return <Badge variant="warning">Shipped</Badge>;
      case OrderStatus.PROCESSING: return <Badge variant="default">Processing</Badge>;
      case OrderStatus.CANCELLED: return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and shipments.</p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus:ring-primary focus:border-primary"
            >
                <option value="All">All Statuses</option>
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.PROCESSING}>Processing</option>
                <option value={OrderStatus.SHIPPED}>Shipped</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
            </select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table 
            headers={[
                { label: 'Order ID', key: 'id' },
                { label: 'Customer', key: 'customerName' },
                { label: 'Date', key: 'createdAt' },
                { label: 'Total', key: 'totalAmount' },
                { label: 'Payment', key: 'paymentMethod' },
                { label: 'Status', key: 'status' },
                { label: 'Actions' }
            ]}
            onSort={handleSort}
            sortConfig={sortConfig}
        >
          {isLoading ? (
            <tr><td colSpan={7} className="p-4 text-center">Loading orders...</td></tr>
          ) : processedOrders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 font-medium">{order.id}</td>
              <td className="px-4 py-4">{order.customerName}</td>
              <td className="px-4 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-4 font-medium">${order.totalAmount.toFixed(2)}</td>
              <td className="px-4 py-4 capitalize text-sm">{order.paymentMethod}</td>
              <td className="px-4 py-4">
                <select 
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className={`h-8 text-xs rounded border-0 bg-opacity-20 font-semibold px-2 cursor-pointer focus:ring-2 focus:ring-primary ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                        order.status === OrderStatus.SHIPPED ? 'bg-yellow-100 text-yellow-800' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}
                >
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.PROCESSING}>Processing</option>
                    <option value={OrderStatus.SHIPPED}>Shipped</option>
                    <option value={OrderStatus.DELIVERED}>Delivered</option>
                    <option value={OrderStatus.CANCELLED}>Cancelled</option>
                </select>
              </td>
              <td className="px-4 py-4">
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                  <Eye size={16} className="mr-2" /> View
                </Button>
              </td>
            </tr>
          ))}
          {processedOrders.length === 0 && !isLoading && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No orders found.</td></tr>
          )}
        </Table>
      </Card>

      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title={`Order Details: ${selectedOrder?.id}`}
        width="max-w-3xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-gray-500 mt-2">Order Date</p>
                <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-primary">${selectedOrder.totalAmount.toFixed(2)}</p>
                <p className="text-gray-500 mt-2">Payment Status</p>
                <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {selectedOrder.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b font-medium text-sm">Order Items</div>
              <div className="divide-y">
                {selectedOrder.items.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No items (Mock Data)</div>
                ) : (
                    selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded"></div>
                        <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    ))
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex justify-end">
               <Button onClick={() => setSelectedOrder(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
