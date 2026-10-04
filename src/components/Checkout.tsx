import React, { useState, useMemo } from 'react';
import { Shield, Truck, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import PaystackPop from '@paystack/inline-js';

interface Product {
  id: string;
  name: string;
  basePrice: number; // Includes the 3500 platform markup already handled upstream
  weightKg: number;
}

interface CheckoutProps {
  product: Product;
  onPay: (totalAmount: number) => void;
  buyerEmail?: string;
  buyerId?: string;
  sellerId?: string;
  orderId?: string;
}

const NIGERIAN_STATES = [
  'Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Enugu', 'Kaduna' // Simplified list for demo
];

const Checkout: React.FC<CheckoutProps> = ({
  product,
  onPay,
  buyerEmail = "buyer@example.com",
  buyerId = "buyer_123",
  sellerId = "seller_456",
  orderId = "order_789"
}) => {
  const [selectedState, setSelectedState] = useState(NIGERIAN_STATES[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const ESCROW_FEE = 1000;

  // Dynamic Shipping Fee Calculation based on weight and location
  const shippingFee = useMemo(() => {
    let base = 5000;
    // Simple logic: heavier items cost more. Outside Lagos costs more.
    if (selectedState !== 'Lagos') base += 3000;

    const weightFee = product.weightKg * 500;

    let total = base + weightFee;
    if (total > 200000) total = 200000;
    return total;
  }, [product.weightKg, selectedState]);

  const totalAmount = product.basePrice + ESCROW_FEE + shippingFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const handlePayment = () => {
    setIsProcessing(true);

    // In a real app, this key would be from env vars
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_demo';

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: paystackKey,
      email: buyerEmail,
      amount: totalAmount * 100, // Paystack expects amount in kobo
      channels: ['bank_transfer'], // Force virtual account generation
      metadata: {
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: orderId
          },
          {
            display_name: "Buyer ID",
            variable_name: "buyer_id",
            value: buyerId
          },
          {
            display_name: "Seller ID",
            variable_name: "seller_id",
            value: sellerId
          }
        ]
      },
      onSuccess: (transaction: any) => {
        setIsProcessing(false);
        // Call the parent handler
        onPay(totalAmount);
        console.log("Payment successful", transaction);
      },
      onCancel: () => {
        setIsProcessing(false);
        console.log("Payment cancelled");
      }
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24">
      <div className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 px-4 py-4 flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Secure Checkout</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Product Info */}
        <div className="glassmorphism rounded-2xl p-4 flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{product.name}</h3>
            <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">Weight: {product.weightKg}kg</div>
            <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-2">{formatCurrency(product.basePrice)}</div>
          </div>
        </div>

        {/* Shipping details */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-white font-semibold">
            <Truck className="w-5 h-5 text-indigo-500" />
            Shipping Details
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Destination State</label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 appearance-none text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
             </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
           <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Payment Summary</h4>
           <div className="space-y-3 text-sm">
             <div className="flex justify-between text-slate-600 dark:text-slate-300">
               <span>Subtotal</span>
               <span className="font-medium">{formatCurrency(product.basePrice)}</span>
             </div>
             <div className="flex justify-between text-slate-600 dark:text-slate-300">
               <span>Shipping Fee</span>
               <span className="font-medium">{formatCurrency(shippingFee)}</span>
             </div>
             <div className="flex justify-between text-slate-600 dark:text-slate-300 items-center">
               <span className="flex items-center gap-1">
                 Escrow Fee
                 <Shield className="w-3 h-3 text-green-500" />
               </span>
               <span className="font-medium">{formatCurrency(ESCROW_FEE)}</span>
             </div>
             <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end">
               <span className="font-semibold text-slate-800 dark:text-white">Total</span>
               <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(totalAmount)}</span>
             </div>
           </div>
        </div>

        <div className="text-xs text-center text-slate-500 dark:text-slate-400 px-4">
          By tapping Pay Now, you agree to RiVuG's Escrow Terms. Your funds are held securely until you receive the item.
        </div>
      </div>

      {/* Sticky Bottom Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-6 h-6" />
            {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalAmount)}`}
            {!isProcessing && <ChevronRight className="w-5 h-5 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
