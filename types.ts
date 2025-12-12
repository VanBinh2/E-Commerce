
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPPORT = 'support',
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  additionalPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  richDescription?: string; // HTML content
  price: number;
  compareAtPrice?: number; // Giá gốc trước giảm
  costPrice?: number; // Giá vốn (Chỉ admin thấy)
  category: string;
  tags?: string[];
  images?: string[];
  thumbnail?: string;
  imageUrl?: string; // Added to support mock data
  stock: number; // Tổng tồn kho
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  AWAITING_PAYMENT = 'awaiting_payment',
  PROCESSING = 'processing',
  PACKING = 'packing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  sku?: string;
  quantity: number;
  price: number;
  total?: number;
  thumbnail?: string;
  imageUrl?: string; // Added to support cart logic
}

export interface Order {
  id: string;
  orderNumber?: string; // VD: ORD-2024-001
  userId: string;
  customerName: string;
  customerEmail?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  subtotal?: number;
  tax?: number;
  shippingCost?: number;
  discount?: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'stripe' | 'paypal' | 'cod' | 'credit_card';
  paymentStatus: PaymentStatus | string;
  paymentId?: string; // Transaction ID từ Stripe/Paypal
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AnalyticsKPI {
  revenue: { value: number; trend: number }; // trend theo %
  orders: { value: number; trend: number };
  customers: { value: number; trend: number };
  avgOrderValue: { value: number; trend: number };
}

export interface AnalyticsData {
  revenue: number[];
  orders: number[];
  visitors: number[];
  labels: string[];
  topProducts: { name: string; sales: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'system';
  isRead?: boolean;
  read?: boolean;
  link?: string;
  timestamp?: number;
  createdAt?: number;
}
