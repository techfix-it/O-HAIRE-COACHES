'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, ArrowRight, Bus, Calendar, CheckCircle, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('session_id')) {
      setIsSuccess(true);
      setOrderId(query.get('session_id')!);
      // Note: AuthContext handles cart clearing if needed, or we can call clearCart()
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + (Number(item.unitPrice || item.price) * (item.quantity || 1)), 0);

  if (isSuccess) {
    return (
      <div className="app-wrapper">
        <Header />
        <main className="cart-page flex items-center justify-center">
          <div className="success-card">
            <CheckCircle className="success-icon" />
            <h2 className="success-title">PAYMENT SUCCESSFUL</h2>
            <p className="success-text">Thank you for your booking. Your order <span className="order-id">{orderId}</span> has been confirmed.</p>
            <Link href="/" className="btn-primary">
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Header />
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">YOUR <span className="italic">CART</span></h1>
            <span className="cart-count">{cart.length} Items</span>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag className="cart-empty-icon" />
              <h2 className="cart-empty-title">Your cart is empty</h2>
              <p className="cart-empty-text">Looks like you haven't added any coach tickets yet.</p>
              <Link href="/concerts" className="browse-button">
                Browse Concerts <ArrowRight className="icon-w-4" />
              </Link>
            </div>
          ) : (
            <div className="cart-items-layout">
              <div className="cart-items">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div 
                      key={item.cartId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="cart-item"
                    >
                      <div className="cart-item-info">
                        <div className="cart-item-image-wrapper">
                          <img src={item.eventImage} alt={item.eventTitle} className="cart-item-image" />
                        </div>
                        <div className="cart-item-details">
                          <h3 className="cart-item-title">{item.eventTitle}</h3>
                          <div className="cart-item-meta">
                            <span className="cart-item-meta-item"><Bus className="icon-w-3" /> {item.pickupName}</span>
                            <span className="cart-item-meta-item"><Calendar className="icon-w-3" /> {item.eventDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.cartId, (item.quantity || 1) - 1)}
                            className="qty-btn"
                          >
                            <Minus className="icon-w-4" />
                          </button>
                          <span className="qty-value">{item.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                            className="qty-btn"
                          >
                            <Plus className="icon-w-4" />
                          </button>
                        </div>
                        <div className="cart-item-pricing">
                          <span className="unit-price">€{Number(item.unitPrice || item.price).toFixed(2)} ea</span>
                          <div className="cart-item-price">€{(Number(item.unitPrice || item.price) * (item.quantity || 1)).toFixed(2)}</div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="remove-button"
                        >
                          <Trash2 className="icon-w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="cart-summary-sidebar">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-total">€{total.toFixed(2)}</span>
                </div>
                
                <div className="checkout-placeholder">
                  <button className="btn-primary w-full">
                    Proceed to Checkout
                  </button>
                </div>

                <p className="cart-footer-text">
                  Prices include VAT. Secure checkout powered by Stripe.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
