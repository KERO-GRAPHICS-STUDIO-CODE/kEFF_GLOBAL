import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, TrendingUp, Package } from 'lucide-react';

interface RankedListing {
  id: string;
  title: string;
  base_price: number;
  sales_volume: number;
  product_rating: number;
  seller_reputation: number;
  organic_score: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

const Marketplace = () => {
  const [listings, setListings] = useState<RankedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      // In production, this calls the rpc 'get_ranked_listings'
      // For demo fallback (if RPC fails/not created on free tier), we just simulate data
      try {
        const { data, error } = await supabase.rpc('get_ranked_listings');

        if (error || !data || data.length === 0) {
            console.warn('Falling back to simulated data. Supabase RPC might not be deployed yet.', error);
            simulateData();
        } else {
            setListings(data);
            setLoading(false);
        }
      } catch (err) {
          simulateData();
      }
    };

    const simulateData = () => {
        setListings([
            { id: '1', title: 'MacBook Pro M3 Max', base_price: 3500000, sales_volume: 45, product_rating: 4.9, seller_reputation: 4.8, organic_score: 96.5 },
            { id: '2', title: 'iPhone 15 Pro Titanium', base_price: 1200000, sales_volume: 120, product_rating: 4.7, seller_reputation: 4.6, organic_score: 92.1 },
            { id: '3', title: 'Sony WH-1000XM5', base_price: 350000, sales_volume: 85, product_rating: 4.8, seller_reputation: 4.5, organic_score: 89.4 },
        ]);
        setLoading(false);
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12 text-indigo-600 font-bold animate-pulse">Loading Merit-Ranked Listings...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
            Top Ranked
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">100% Merit-Based. No Paid Boosts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item, index) => (
          <div key={item.id} className="glassmorphism rounded-3xl overflow-hidden shadow-sleek border border-white/40 dark:border-slate-700/40 hover:scale-[1.02] transition-transform duration-300">
            {/* Rank Badge */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1">
              <span className="text-slate-400">#</span>
              <span className={index === 0 ? "text-amber-500 text-sm" : index === 1 ? "text-slate-400 text-sm" : index === 2 ? "text-amber-700 text-sm" : "text-slate-800 dark:text-white"}>
                {index + 1}
              </span>
            </div>

            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
               <Package className="w-16 h-16 text-slate-300 dark:text-slate-600" />
               <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-1">
                 Organic Score: {item.organic_score.toFixed(1)}
               </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight line-clamp-1">{item.title}</h3>
              <div className="font-black text-xl text-indigo-600 dark:text-indigo-400 mt-2">{formatCurrency(item.base_price)}</div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                 <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {item.product_rating} Item</div>
                   <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> {item.seller_reputation} Seller</div>
                 </div>
                 <div className="text-right flex flex-col gap-1 items-end">
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md">{item.sales_volume} Sold</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
