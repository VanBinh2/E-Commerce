import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Button, Input } from '../components/ui/Shared';
import { useAuthStore } from '../store/useStore';
import { api } from '../services/mockBackend';
import { Role } from '../types';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const { user } = await api.login(data.email, data.password);
      login(user);
      
      // Redirect based on role
      const adminRoles = [Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER, Role.EMPLOYEE];
      if (adminRoles.includes(user.role)) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      const msg = typeof err === 'string' ? err : err.message || 'Login failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-sm border border-gray-100 bg-white rounded-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-2">Enter your credentials to access your account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-6 border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              label="Email"
              type="email" 
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isLoading}
              error={errors.email?.message as string}
              {...register('email', { required: 'Email is required' })}
            />
            <Input 
              label="Password"
              type="password" 
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              error={errors.password?.message as string}
              {...register('password', { required: 'Password is required' })}
            />
            
            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-center text-gray-400">
            <p>Demo Admin: admin@eflyer.com / admin</p>
            <p>Demo User: john@example.com / password</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}