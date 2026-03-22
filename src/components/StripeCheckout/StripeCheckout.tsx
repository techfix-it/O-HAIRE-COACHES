'use client';

import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

interface StripeCheckoutProps {
  cartItems: any[];
  amount: number;
  onError: (error: string) => void;
}

export const StripeCheckout = ({ cartItems, amount, onError }: StripeCheckoutProps) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the backend to create a Stripe Session
      console.log("Initiating checkout for:", cartItems, "Total:", amount);
      
      // Simulating a successful redirect or action
      alert("This would normally redirect to Stripe. Current amount: €" + amount);
      
      setLoading(false);
    } catch (err: any) {
      console.error("Checkout error:", err);
      onError(err.message || "Failed to initiate checkout");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || amount <= 0}
      className={`checkout-button ${loading ? 'loading' : ''}`}
    >
      <CreditCard className="icon-w-5" />
      {loading ? 'Processing...' : `Pay €${amount.toFixed(2)}`}
    </button>
  );
};
