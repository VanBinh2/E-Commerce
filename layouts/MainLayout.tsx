import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, LogOut, Bell, ChevronRight } from 'lucide-react';
import { useCartStore, useAuthStore, useUIStore } from '../store/useStore';
import { Button, Badge } from '../components/ui/Shared';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { notifications, markAsRead } = useUIStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} new</Badge>}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-blue-50/30' : ''}`}
                  onClick={() => markAsRead(n.id)}
                >
                  {!n.read && <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{new Date(n.timestamp || 0).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
            <button onClick={onClose} className="text-xs text-gray-500 hover:text-primary font-medium">Close</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const { toggleCart, count } = useCartStore();
  const { user, logout } = useAuthStore();
  const { notifications } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
            <div className="h-8 w-8 bg-gray-900 text-white rounded-lg flex items-center justify-center">E</div>
            <span>Eflyer</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-gray-900 transition-colors">Shop</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hidden sm:flex">
             <Search size={20} />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-900"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              <Bell size={20} />
              {unreadNotifs > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </Button>
            <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900" onClick={toggleCart}>
            <ShoppingBag size={20} />
            {count() > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gray-900 ring-2 ring-white" />
            )}
          </Button>

          {user ? (
            <div className="hidden md:flex items-center gap-2 ml-2">
               <span className="text-sm font-medium text-gray-700 mr-2">{user.name}</span>
               {user.role !== 'customer' && (
                 <Link to="/admin">
                   <Button size="sm" variant="outline" className="border-gray-200">Admin</Button>
                 </Link>
               )}
               <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                 <LogOut size={18} className="text-gray-500" />
               </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block ml-2">
              <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">Sign In</Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-gray-100 bg-white overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Link to="/" className="block py-2 font-medium text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="block py-2 font-medium text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Signed in as {user.name}</p>
                    {user.role !== 'customer' && (
                       <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                         <Button className="w-full" variant="outline">Admin Dashboard</Button>
                       </Link>
                    )}
                    <Button className="w-full" variant="destructive" onClick={handleLogout}>Sign Out</Button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CartDrawer = () => {
  const { isOpen, toggleCart, items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-gray-900 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-gray-900">Your Cart ({items.length})</h2>
              <Button variant="ghost" size="icon" onClick={toggleCart}><X size={20} /></Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Your cart is empty</p>
                  <Button variant="link" onClick={toggleCart} className="text-gray-900 font-semibold">Start Shopping</Button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="h-24 w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{item.productName}</h4>
                        <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-md h-8">
                          <button onClick={() => updateQuantity(item.productId, -1)} className="px-2 hover:bg-gray-50 text-gray-500 h-full">-</button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, 1)} className="px-2 hover:bg-gray-50 text-gray-500 h-full">+</button>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="text-xs font-medium text-red-500 hover:text-red-600 underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-4">
                  <span>Total</span>
                  <span>${total().toFixed(2)}</span>
                </div>
                <Button className="w-full bg-gray-900 hover:bg-black text-white" size="lg" onClick={handleCheckout}>
                  Checkout <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-100 py-12 bg-gray-50 text-sm text-gray-500">
        <div className="container mx-auto px-4 text-center">
          <p className="font-medium text-gray-900 mb-2">Eflyer Commerce</p>
          <p>© 2024 Enterprise Edition. Built with React & Tailwind.</p>
        </div>
      </footer>
    </div>
  );
};
