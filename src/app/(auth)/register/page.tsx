'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { registerSchema, type RegisterInput } from '../../../lib/validations';
import api from '../../../lib/api';
import '../login/LoginPage.css'; // Reusing base auth styles

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push('/login?message=Account created successfully! Please sign in.');
    } catch (error: any) {
      setServerError(error.response?.data?.error || 'Registration failed. Please try again.');
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
            <h1 className="auth-title">Join <span className="accent">Us</span></h1>
            <p className="auth-subtitle">Create an account for faster bookings</p>
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
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <User className={`input-icon ${errors.name ? 'text-error' : ''}`} size={20} />
                <input 
                  type="text" 
                  id="name" 
                  placeholder="John Doe"
                  {...register('name')}
                  className={errors.name ? 'input-error' : ''}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name.message}</span>}
            </div>

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
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className={`input-icon ${errors.password ? 'text-error' : ''}`} size={20} />
                <input 
                  type="password" 
                  id="password" 
                  placeholder="At least 8 characters"
                  {...register('password')}
                  className={errors.password ? 'input-error' : ''}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className={`input-icon ${errors.confirmPassword ? 'text-error' : ''}`} size={20} />
                <input 
                  type="password" 
                  id="confirmPassword" 
                  placeholder="Repeat password"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link href="/login">Sign in</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
