import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, ChevronUp, ChevronDown } from 'lucide-react';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-9 rounded-md px-3",
      md: "h-11 rounded-md px-8",
      lg: "h-12 rounded-md px-10 text-lg",
      icon: "h-10 w-10",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          variant === 'link' ? "h-auto p-0" : sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

// --- Badge ---
export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline', className?: string }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800",
    outline: "bg-transparent border border-gray-200 text-gray-600"
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)}>
      {children}
    </span>
  );
};

// --- Card ---
export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm bg-white", className)} {...props}>
    {children}
  </div>
);

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const Modal = ({ isOpen, onClose, title, children, width = "max-w-lg" }: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`bg-white rounded-xl shadow-2xl w-full ${width} overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

// --- Table ---
interface TableProps {
  headers: { label: string; key?: string }[];
  children: React.ReactNode;
  onSort?: (key: string) => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
}

export const Table = ({ headers, children, onSort, sortConfig }: TableProps) => (
  <div className="w-full overflow-auto rounded-lg border border-gray-200">
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {headers.map((h, i) => (
            <th 
              key={i} 
              className={cn(
                "h-12 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider select-none",
                h.key && onSort ? "cursor-pointer hover:bg-gray-100 hover:text-primary transition-colors" : ""
              )}
              onClick={() => h.key && onSort && onSort(h.key)}
            >
              <div className="flex items-center gap-1">
                {h.label}
                {sortConfig?.key === h.key && (
                  sortConfig.direction === 'asc' 
                    ? <ChevronUp size={14} /> 
                    : <ChevronDown size={14} />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {children}
      </tbody>
    </table>
  </div>
);
