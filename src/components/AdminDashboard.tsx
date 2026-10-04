import React from 'react';
import { Users, TrendingUp, DollarSign, Activity, AlertCircle, ShieldAlert } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
};

const AdminDashboard = () => {
  // Mock Data for Admin
  const stats = {
    totalUsers: 12450,
    grossVolume: 450000000,
    escrowFees: 12450000,
    shippingFees: 45000000,
    platformMarkups: 43575000,
    kycCosts: 3735000,
    paystackFeesEst: 6750000
  };

  const netProfit = (stats.platformMarkups + stats.escrowFees) - (stats.kycCosts + stats.paystackFeesEst);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            GOD MODE
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Super Admin Dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Net Profit Card - Highlighted */}
        <div className="col-span-2 glassmorphism bg-indigo-600 border-none p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="text-indigo-100 font-medium mb-1 uppercase tracking-wider text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Net Platform Profit
            </div>
            <div className="text-4xl font-black tracking-tight">{formatCurrency(netProfit)}</div>
            <div className="mt-4 flex gap-4 text-xs font-medium text-indigo-100">
               <div>Markups: <span className="text-white">{formatCurrency(stats.platformMarkups)}</span></div>
               <div>Escrow: <span className="text-white">{formatCurrency(stats.escrowFees)}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
             <Users className="w-5 h-5" />
           </div>
           <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</div>
           <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalUsers.toLocaleString()}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3">
             <DollarSign className="w-5 h-5" />
           </div>
           <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Gross Volume</div>
           <div className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(stats.grossVolume)}</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-400" />
          God-Mode Actions
        </h2>
        <div className="space-y-3">
          <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 p-4 rounded-xl flex items-center justify-between font-semibold transition-colors">
            <span className="flex items-center gap-3"><AlertCircle className="w-5 h-5" /> Resolve Active Dispute</span>
            <span className="text-xs bg-red-200 dark:bg-red-800 px-2 py-1 rounded-md text-red-700 dark:text-red-100">Absolute Auth</span>
          </button>

          <button className="w-full bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 p-4 rounded-xl flex items-center justify-between font-semibold transition-colors">
            <span className="flex items-center gap-3"><TrendingUp className="w-5 h-5" /> Force Mark Received & Payout</span>
            <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded-md text-amber-700 dark:text-amber-100">Absolute Auth</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
