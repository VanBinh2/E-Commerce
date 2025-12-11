import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Code2,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Save,
  Lock,
  Unlock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  Trash2,
  Minus,
  Briefcase,
  User as UserIcon,
  ShieldCheck,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

import { api } from './services/mockBackend';
import { Product, Order, OrderStatus, User, OrderItem, Role } from './types';
import { ArchitectureView } from './components/ArchitectureView';

// --- Constants ---
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3176/3176363.png";
const HERO_BG_URL = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80";

// --- Helper Types & Functions ---

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

const SortIcon = ({ active, direction }: { active: boolean; direction?: SortDirection }) => {
  if (!active) return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
  return direction === 'asc' 
    ? <ArrowUp size={14} className="ml-1 text-black" /> 
    : <ArrowDown size={14} className="ml-1 text-black" />;
};

// --- Shared Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

const Logo = ({ className = "h-8" }: { className?: string }) => (
  <img src={LOGO_URL} alt="Eflyer Logo" className={className} />
);

const RoleBadge = ({ role, editable = false, onChange }: { role: Role, editable?: boolean, onChange?: (val: Role) => void }) => {
  const styles: Record<Role, string> = {
    [Role.ADMIN]: 'bg-gray-900 text-white border-gray-900',
    [Role.EMPLOYEE]: 'bg-blue-100 text-blue-800 border-blue-200',
    [Role.CUSTOMER]: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const style = styles[role] || styles[Role.CUSTOMER];

  if (editable && onChange) {
    return (
       <div className={`relative inline-block px-2.5 py-0.5 rounded-full border ${style}`}>
        <select 
          value={role}
          onChange={(e) => onChange(e.target.value as Role)}
          className={`appearance-none bg-transparent border-none text-xs font-medium focus:ring-0 cursor-pointer pr-4 uppercase w-full outline-none`}
          style={{ backgroundImage: 'none', color: 'inherit' }} 
        >
          {Object.values(Role).map(r => (
            <option key={r} value={r} className="text-gray-900 bg-white">{r}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} uppercase flex items-center gap-1 w-max`}>
      {role === Role.ADMIN && <ShieldCheck size={10} />}
      {role === Role.EMPLOYEE && <Briefcase size={10} />}
      {role === Role.CUSTOMER && <UserIcon size={10} />}
      {role}
    </span>
  );
};

const StatusBadge = ({ 
  status, 
  editable = false, 
  onChange 
}: { 
  status: string, 
  editable?: boolean, 
  onChange?: (val: string) => void 
}) => {
  const styles: any = {
    delivered: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    processing: 'bg-blue-50 text-blue-700 border-blue-100',
    shipped: 'bg-purple-50 text-purple-700 border-purple-100',
    cancelled: 'bg-white text-gray-400 border-gray-200 line-through',
    active: 'bg-green-50 text-green-700 border-green-100',
    inactive: 'bg-red-50 text-red-700 border-red-100',
  };
  
  const currentStyle = styles[status.toLowerCase()] || 'bg-gray-50 text-gray-800 border-gray-200';
  
  if (editable && onChange) {
    return (
      <div className={`relative inline-block px-2.5 py-0.5 rounded-full border ${currentStyle}`}>
        <select 
          value={status}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none bg-transparent border-none text-xs font-medium focus:ring-0 cursor-pointer pr-4 uppercase outline-none`}
          style={{ backgroundImage: 'none' }} 
        >
          {Object.values(OrderStatus).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle} uppercase`}>
      {status}
    </span>
  );
};

const Drawer = ({ isOpen, onClose, title, children, width = "max-w-lg" }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, width?: string }) => (
  <>
    {isOpen && (
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
    )}
    <div className={`fixed inset-y-0 right-0 z-50 w-full ${width} bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  </>
);

// --- Customer Storefront Components ---

const Storefront = ({ onAdminLogin, currentUser, onLogout }: { onAdminLogin: () => void, currentUser: User | null, onLogout: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!currentUser) {
      alert("Please login to checkout");
      return;
    }
    setIsCheckingOut(true);
    try {
      await api.createOrder({
        userId: currentUser.id,
        customerName: currentUser.name,
        totalAmount,
        items: cart,
        status: OrderStatus.PENDING
      });
      setIsCheckingOut(false);
      setCart([]);
      setIsCartOpen(false);
      loadProducts(); // Reload products to reflect new stock
      alert("Order placed successfully! Check your email for confirmation.");
    } catch (e: any) {
      alert("Checkout failed: " + e.message);
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Store Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="bg-gray-900 p-1 rounded">
               <Logo className="h-6 w-auto brightness-200" />
             </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">eFlyer</span>
          </div>
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <div className="flex items-center gap-4">
                 <span className="text-sm font-medium">Hi, {currentUser.name}</span>
                 {(currentUser.role === Role.ADMIN || currentUser.role === Role.EMPLOYEE) && (
                   <button onClick={onAdminLogin} className="text-xs bg-black text-white px-2 py-1 rounded">Dashboard</button>
                 )}
                 <button onClick={onLogout} className="text-sm text-gray-500 hover:text-black">Logout</button>
              </div>
            ) : (
               <button onClick={onAdminLogin} className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
                Sign In
              </button>
            )}
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-900 hover:bg-orange-50 rounded-full transition-colors"
            >
              <ShoppingBag size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-[#fcf0d3] rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center">
           {/* Text Side */}
           <div className="p-8 md:p-16 md:w-1/2 text-left z-10">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                Get Start <br/>
                <span className="text-orange-500">Your Favorite Shopping</span>
              </h1>
              <p className="text-lg text-gray-700 max-w-md mb-8">
                 Discover the best collection of men's, women's, and kids' clothing at the best prices.
              </p>
              <div className="flex flex-wrap gap-4">
                 <button className="bg-gray-900 text-white px-10 py-4 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1">
                   Buy Now
                 </button>
                 <button className="bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
                   See More
                 </button>
              </div>
           </div>
           
           {/* Image Side */}
           <div className="md:w-1/2 h-full min-h-[400px] relative w-full">
              <img 
                src={HERO_BG_URL} 
                alt="Fashion Model" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fcf0d3] to-transparent md:w-1/3"></div>
           </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto pb-24">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold text-gray-900">Latest <span className="text-orange-500">Products</span></h2>
           <div className="hidden sm:flex space-x-2">
              <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium">All</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200">Mens</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200">Womens</button>
           </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl p-4 hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
              <div className="aspect-[4/4] bg-gray-100 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center p-4">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-wider border border-black">Out of Stock</span>
                  </div>
                )}
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-gray-900 hover:text-orange-500 hover:scale-110 transition-all disabled:opacity-0 translate-y-12 group-hover:translate-y-0"
                >
                  <ShoppingBag size={20} fill="currentColor" className="opacity-20" />
                </button>
              </div>
              <div className="space-y-2 mt-auto">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                <div className="flex justify-between items-center">
                   <p className="text-orange-500 font-bold text-lg">${product.price.toFixed(2)}</p>
                   <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
             <button className="bg-gray-900 text-white px-10 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">View All Products</button>
        </div>
      </div>

      {/* Cart Drawer */}
      <Drawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        title={`Shopping Cart (${cartItemCount})`}
      >
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty.</p>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="mt-4 text-orange-500 font-bold hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6">
              {cart.map(item => (
                <div key={item.productId} className="flex py-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-gray-100 text-gray-600"><Minus size={14}/></button>
                      <span className="px-2 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-gray-100 text-gray-600"><Plus size={14}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.productId)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Total</p>
                <p>${totalAmount.toFixed(2)}</p>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex justify-center shadow-lg"
              >
                {isCheckingOut ? 'Processing...' : 'Checkout Now'}
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};


// --- Admin Components ---

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [orderData, userData] = await Promise.all([
      api.getOrders(),
      api.getUsers()
    ]);
    setOrders(orderData);
    setUsers(userData);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeOrders = orders.filter(o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.PENDING).length;
  const newCustomers = users.filter(u => {
    const joinDate = new Date(u.joinedAt);
    const now = new Date();
    // Rough "new this week" calc
    return (now.getTime() - joinDate.getTime()) < (7 * 24 * 60 * 60 * 1000);
  }).length;

  // Aggregate revenue by month
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth = new Array(12).fill(0);
    const ordersByMonth = new Array(12).fill(0);

    orders.forEach(order => {
      const d = new Date(order.createdAt);
      const monthIdx = d.getMonth();
      revenueByMonth[monthIdx] += order.totalAmount;
      ordersByMonth[monthIdx] += 1;
    });

    return months.map((name, idx) => ({
      name,
      revenue: revenueByMonth[idx],
      orders: ordersByMonth[idx]
    })).filter(item => item.revenue > 0 || item.orders > 0); // Only show active months
  }, [orders]);

  // Fallback data if empty
  const displayData = chartData.length > 0 ? chartData : [
      { name: 'Current', revenue: 0, orders: 0 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-3xl font-semibold text-gray-900 mt-2">${totalRevenue.toLocaleString()}</h3>
            </div>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">Live</span>
            <span className="text-gray-500 ml-2">from {orders.length} total orders</span>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Orders</p>
            <h3 className="text-3xl font-semibold text-gray-900 mt-2">{activeOrders}</h3>
          </div>
           <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-900 font-medium">{Math.round((activeOrders/orders.length || 0)*100)}%</span>
            <span className="text-gray-500 ml-2">of total volume</span>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <h3 className="text-3xl font-semibold text-gray-900 mt-2">{users.length}</h3>
          </div>
           <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-900 font-medium">{newCustomers}</span>
            <span className="text-gray-500 ml-2">new this week</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Revenue Overview (YTD)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px', boxShadow: 'none' }}
                  itemStyle={{ color: '#111' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-6">Orders by Month</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" hide />
                <Tooltip 
                  cursor={{fill: '#F9FAFB'}}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px' }}
                />
                <Bar dataKey="orders" fill="#000000" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<Product> | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const productData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      description: formData.get('description') as string,
      imageUrl: 'https://picsum.photos/300/300?random=' + Math.floor(Math.random()*1000)
    };

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productData);
    } else {
      await api.createProduct(productData);
    }
    
    setIsDrawerOpen(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleSort = (key: keyof Product) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [products, searchTerm, sortConfig]);

  const Header = ({ label, sortKey }: { label: string, sortKey?: keyof Product }) => (
    <th 
      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${sortKey ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
      onClick={() => sortKey && handleSort(sortKey)}
    >
      <div className="flex items-center">
        {label}
        {sortKey && <SortIcon active={sortConfig?.key === sortKey} direction={sortConfig?.direction} />}
      </div>
    </th>
  );

  return (
    <>
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 w-full sm:w-64 transition-all"
              />
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setIsDrawerOpen(true); }}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <Header label="Product" sortKey="name" />
                <Header label="Status" />
                <Header label="Inventory" sortKey="stock" />
                <Header label="Price" sortKey="price" />
                <Header label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {processedProducts.length > 0 ? processedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200 p-1">
                        <img className="h-full w-full object-contain" src={product.imageUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.stock > 0 ? 'text-green-800 bg-green-50' : 'text-red-800 bg-red-50'}`}>
                      {product.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => { setEditingProduct(product); setIsDrawerOpen(true); }}
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No products found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'New Product'}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input required name="name" defaultValue={editingProduct?.name} className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input required type="number" step="0.01" name="price" defaultValue={editingProduct?.price} className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input required type="number" name="stock" defaultValue={editingProduct?.stock} className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" defaultValue={editingProduct?.category} className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black focus:outline-none">
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessories">Accessories</option>
              <option value="Electronics">Electronics</option>
              <option value="Jewellery">Jewellery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required name="description" defaultValue={editingProduct?.description} rows={4} className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black focus:outline-none" />
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 flex items-center space-x-2 transition-colors">
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Drawer>
    </>
  );
};

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig<Order> | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await api.getOrders();
    setOrders(data);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await api.updateOrderStatus(id, newStatus as OrderStatus);
    loadOrders();
  };

  const handleSort = (key: keyof Order) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedOrders = useMemo(() => {
    let filtered = statusFilter === 'All' 
      ? orders 
      : orders.filter(o => o.status.toLowerCase() === statusFilter.toLowerCase());

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [orders, statusFilter, sortConfig]);

  const Header = ({ label, sortKey }: { label: string, sortKey?: keyof Order }) => (
    <th 
      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${sortKey ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
      onClick={() => sortKey && handleSort(sortKey)}
    >
      <div className="flex items-center">
        {label}
        {sortKey && <SortIcon active={sortConfig?.key === sortKey} direction={sortConfig?.direction} />}
      </div>
    </th>
  );

  return (
    <>
      <Card className="p-0 overflow-hidden">
         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Status:</span>
            <div className="relative">
               <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:border-gray-400 cursor-pointer"
              >
                <option>All</option>
                {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <Filter size={14} />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <Header label="Order ID" sortKey="id" />
                <Header label="Customer" sortKey="customerName" />
                <Header label="Date" sortKey="createdAt" />
                <Header label="Total" sortKey="totalAmount" />
                <Header label="Status" sortKey="status" />
                <Header label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {processedOrders.length > 0 ? processedOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div onClick={(e) => e.stopPropagation()}>
                       <StatusBadge 
                        status={order.status} 
                        editable 
                        onChange={(val) => handleStatusUpdate(order.id, val)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-gray-400 hover:text-black">
                       <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Customer</p>
                <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-gray-500 uppercase tracking-wider">Placed On</p>
                 <p className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Items Purchased</h4>
              <div className="space-y-3">
                {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No items data (Legacy Order)</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
               <span className="text-base font-bold text-gray-900">Total Amount</span>
               <span className="text-xl font-bold text-orange-600">${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>

            <div className="pt-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</label>
              <StatusBadge 
                status={selectedOrder.status}
                editable
                onChange={(val) => handleStatusUpdate(selectedOrder.id, val)}
              />
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

const CustomersManager = ({ currentUser }: { currentUser: User }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await api.getUsers();
    setUsers(data);
  };

  const handleStatusToggle = async (id: string) => {
    await api.toggleUserStatus(id);
    loadUsers();
  };

  const handleRoleChange = async (id: string, role: Role) => {
    await api.updateUserRole(id, role);
    loadUsers();
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Customers & Staff</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mr-3">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge 
                    role={u.role} 
                    editable={currentUser.role === Role.ADMIN} 
                    onChange={(r) => handleRoleChange(u.id, r)} 
                  />
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.isActive ? 'Active' : 'Locked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(u.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                   <button onClick={() => handleStatusToggle(u.id)} className="text-sm text-blue-600 hover:underline">
                     {u.isActive ? 'Lock Account' : 'Unlock'}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const AuthPage = ({ onLogin, onCancel }: { onLogin: (u: User) => void, onCancel: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { user } = await api.login(email, password);
        onLogin(user);
      } else {
        const { user } = await api.register(name, email, password);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 font-sans">
      <div className="w-full max-w-[400px] space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
           <div className="flex justify-center mb-4">
              <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center">
                 <Logo className="h-6 w-auto brightness-200" />
              </div>
           </div>
           <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
             {isLogin ? 'Welcome back' : 'Create an account'}
           </h1>
           <p className="text-sm text-gray-500">
             {isLogin ? 'Enter your credentials to access your account' : 'Enter your information to create an account'}
           </p>
        </div>

        {error && (
           <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md flex items-center gap-2">
             <AlertCircle size={16} className="flex-shrink-0" />
             <span>{error}</span>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
           {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-black focus:border-black sm:text-sm placeholder-gray-400 outline-none transition-all"
              />
            </div>
           )}
           <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input 
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-black focus:border-black sm:text-sm placeholder-gray-400 outline-none transition-all"
              />
           </div>
           <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-black focus:border-black sm:text-sm placeholder-gray-400 outline-none transition-all"
              />
           </div>
           
           <button 
             type="submit" 
             disabled={loading}
             className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')}
           </button>
        </form>
        
        <div className="text-center space-y-4 pt-2">
           <p className="text-sm text-gray-500">
             {isLogin ? "Don't have an account? " : "Already have an account? "}
             <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-black font-semibold hover:underline">
               {isLogin ? 'Sign up' : 'Log in'}
             </button>
           </p>
           <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
             ← Back to storefront
           </button>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = ({ user, onLogout, onExit }: { user: User, onLogout: () => void, onExit: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'architecture'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
        ${activeTab === id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Logo />
          <span className="ml-3 font-bold text-lg tracking-tight">Admin</span>
        </div>
        
        <div className="p-4 space-y-1">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="products" label="Products" icon={Package} />
          <NavItem id="orders" label="Orders" icon={ShoppingCart} />
          <NavItem id="customers" label="Customers" icon={Users} />
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</p>
          </div>
          <NavItem id="architecture" label="Architecture" icon={Code2} />
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center p-2 mb-3 rounded-lg bg-gray-50">
             <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
               {user.name.charAt(0)}
             </div>
             <div className="ml-3 overflow-hidden">
               <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
               <p className="text-xs text-gray-500 truncate">{user.role}</p>
             </div>
          </div>
          <button onClick={onExit} className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-500 hover:text-black">
             <LogOut size={16} />
             <span>Exit to Store</span>
          </button>
          <button onClick={onLogout} className="w-full mt-2 text-xs text-red-500 hover:text-red-700 text-center">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 flex items-center justify-between px-4 h-16">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-500">
            <Menu size={24} />
          </button>
          <Logo className="h-6" />
          <div className="w-8" />
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
           <div className="max-w-6xl mx-auto">
             {activeTab === 'dashboard' && <Dashboard />}
             {activeTab === 'products' && <ProductsManager />}
             {activeTab === 'orders' && <OrdersManager />}
             {activeTab === 'customers' && <CustomersManager currentUser={user} />}
             {activeTab === 'architecture' && <ArchitectureView />}
           </div>
        </main>

        {/* Overlay for mobile sidebar */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'STORE' | 'ADMIN' | 'AUTH'>('STORE');

  useEffect(() => {
    // Check local storage or api for existing session
    const u = api.getCurrentUser();
    if (u) {
        setUser(u);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    if (u.role === Role.ADMIN || u.role === Role.EMPLOYEE) {
      setView('ADMIN');
    } else {
      setView('STORE');
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setView('STORE');
  };

  if (view === 'AUTH') {
    return <AuthPage onLogin={handleLogin} onCancel={() => setView('STORE')} />;
  }

  if (view === 'ADMIN') {
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.EMPLOYEE)) {
        // Fallback if state mismatch
        setView('STORE');
        return null;
    }
    return <AdminLayout user={user} onLogout={handleLogout} onExit={() => setView('STORE')} />;
  }

  return (
    <Storefront 
      currentUser={user}
      onAdminLogin={() => {
        if (user) {
             if (user.role === Role.ADMIN || user.role === Role.EMPLOYEE) {
                 setView('ADMIN');
             } else {
                 alert("Access Restricted: Admin only");
             }
        } else {
            setView('AUTH');
        }
      }}
      onLogout={handleLogout}
    />
  );
}