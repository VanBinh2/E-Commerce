import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ToastContainer } from './components/ui/Toast';
import { useUIStore } from './store/useStore';

// Public Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "checkout", element: <CheckoutPage /> }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "customers", element: <AdminCustomers /> },
      { path: "settings", element: <div className="p-10">Settings Module (Coming Soon)</div> },
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

export default function App() {
  const { addNotification } = useUIStore();

  // --- Real-time Simulation Engine ---
  useEffect(() => {
    // Simulate random incoming orders or user signups
    const interval = setInterval(() => {
      const randomEvent = Math.random();
      if (randomEvent > 0.85) {
        addNotification({
          title: "New Order Received",
          message: `Order #ORD-${Math.floor(Math.random() * 1000)} has been placed.`,
          type: "info"
        });
      }
    }, 45000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}