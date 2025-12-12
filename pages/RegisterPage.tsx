import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Button, Input } from '../components/ui/Shared';
import { useAuthStore } from '../store/useStore';
import { api } from '../services/mockBackend';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const { user } = await api.register(data.name, data.email, data.password);
      login(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create an account</h1>
            <p className="text-sm text-gray-500 mt-2">Enter your details to get started</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-6 border border-red-100 flex items-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              label="Full Name"
              type="text" 
              placeholder="John Doe"
              autoComplete="name"
              disabled={isLoading}
              error={errors.name?.message as string}
              {...register('name', { required: 'Name is required' })}
            />
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
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={isLoading}
              error={errors.password?.message as string}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            />
            
            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}