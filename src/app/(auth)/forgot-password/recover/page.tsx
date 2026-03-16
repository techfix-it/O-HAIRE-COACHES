'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../../../lib/api';
import '../../login/LoginPage.css'; // Reusing base auth styles

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
    } catch (error: any) {
      setServerError(error.response?.data?.error || 'Failed to process request. Please try again.');
    } finally {
      setIsLoading(false);
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
          <div className="auth-header">
            <h1 className="auth-title">Recover <span className="accent">Password</span></h1>
            <p className="auth-subtitle">We'll send you a link to reset your password</p>
          </div>

          {isSent ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="auth-success-state"
              style={{ textAlign: 'center', padding: '20px 0' }}
            >
              <div style={{ color: '#0000FF', marginBottom: '20px' }}>
                <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
              </div>
              <h3 style={{ color: '#0f172a', marginBottom: '12px', fontSize: '1.25rem' }}>Check your email</h3>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>
                We've sent recovery instructions to <strong>{email}</strong>
              </p>
              <Link href="/login" className="auth-submit" style={{ textDecoration: 'none', display: 'flex' }}>
                <span>Back to Sign In</span>
              </Link>
            </motion.div>
          ) : (
            <>
              {serverError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="auth-error"
                >
                  <AlertCircle size={18} />
                  <span>{serverError}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="spinner" size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <ArrowLeft size={16} />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
