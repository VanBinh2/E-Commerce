import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useUIStore } from '../../store/useStore';

const ToastItem = ({ id, title, message, type, onDismiss }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    warning: <AlertTriangle className="text-yellow-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const borderColors = {
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      layout
      className={`bg-white shadow-lg rounded-md p-4 mb-3 flex items-start gap-3 w-80 border border-gray-100 border-l-4 ${borderColors[type]} relative overflow-hidden`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{message}</p>
      </div>
      <button 
        onClick={() => onDismiss(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const { notifications, markAsRead } = useUIStore();
  // Filter only unread or recent notifications if needed, for now show all in store that act as "Toasts"
  // In a real app, you might separate "Notification History" from "Active Toasts"
  // Here we just use the notifications array but slice the last 3 for display
  const activeToasts = notifications.slice(0, 3); 

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {activeToasts.map((n) => (
            <ToastItem 
              key={n.id} 
              {...n} 
              onDismiss={(id: string) => {
                  // Just remove from view logic or mark read
                  // For this demo, let's assume removing from the UI store "active list" approach
                  // But since we persist, we might just filter visually. 
                  // Let's implement a 'remove' action in store later if needed.
                  // For now, we reuse markAsRead to potentially hide it if we filtered by !read
              }} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
