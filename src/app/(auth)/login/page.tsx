'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../../contexts/AuthContext';
import { loginSchema, type LoginInput } from '../../../lib/validations';
import api from '../../../lib/api';
import './LoginPage.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.user);
      router.push('/account');
    } catch (error: any) {
      setServerError(error.response?.data?.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-blob blob-1"></div>
        <div className="auth-blob blob-2"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-container"
      >
        <div className="auth-card">
          <Link href="/" className="back-home-btn">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <div className="auth-header">
            <h1 className="auth-title">Welcome <span className="accent">Back</span></h1>
            <p className="auth-subtitle">Sign in to manage your concert bookings</p>
          </div>

          {(serverError || Object.keys(errors).length > 0) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="auth-error"
            >
              <AlertCircle size={18} />
              <span>{serverError || 'Please check the form for errors'}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className={`input-icon ${errors.email ? 'text-error' : ''}`} size={20} />
                <input 
                  type="email" 
                  id="email" 
                  placeholder="name@example.com"
                  {...register('email')}
                  className={errors.email ? 'input-error' : ''}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password/recover" className="forgot-link">Forgot?</Link>
              </div>
              <div className="input-wrapper">
                <Lock className={`input-icon ${errors.password ? 'text-error' : ''}`} size={20} />
                <input 
                  type="password" 
                  id="password" 
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'input-error' : ''}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link href="/register">Create one</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
