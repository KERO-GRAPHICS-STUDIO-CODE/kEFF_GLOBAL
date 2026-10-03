import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ShieldCheck, Zap, Loader2, Search as SearchIcon, TrendingUp, Sparkles, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, addDoc, serverTimestamp, where, deleteDoc, doc } from 'firebase/firestore';

interface Listing {
  id: string;
  title: string;
  price: number;
  condition: string;
  images: string[];
  sellerId: string;
  location?: string;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const fetchListings = async () => {
    const path = 'listings';
    try {
      // One-time cleanup for system mock data
      const systemQuery = query(collection(db, path), where('sellerId', '==', 'system'));
      const systemSnap = await getDocs(systemQuery);
      for (const docRef of systemSnap.docs) {
        await deleteDoc(doc(db, path, docRef.id));
      }

      const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(20));
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      setListings(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div
      className="flex flex-col gap-10 animate-in fade-in duration-700"
      onPointerMove={(event) => {
        const rect = heroRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPointer({ x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 });
      }}
    >
      <section ref={heroRef} className="hero-shell relative overflow-hidden rounded-[2.5rem] p-7 text-white shadow-2xl shadow-indigo-950/10 sm:p-11 group">
        <div className="relative z-10 max-w-xl space-y-7" style={{ transform: `perspective(900px) rotateX(${pointer.y * -2}deg) rotateY(${pointer.x * 3}deg)` }}>
          <div className="eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1.5">
             <Sparkles className="w-3 h-3 text-indigo-300" />
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-100">Premium Tech Hub</span>
          </div>
          <div className="space-y-1">
             <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-200">The considered tech marketplace</p>
             <h1 className="text-5xl font-black tracking-[-0.07em] leading-[0.88] sm:text-7xl">Premium devices<br/><span className="text-indigo-200">with presence.</span></h1>
             <p className="max-w-[280px] pt-2 text-sm font-medium leading-relaxed text-indigo-100 sm:text-base">
                The elite peer-to-peer marketplace for authenticated tech and gear.
             </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Link to="/sell" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl text-[10px] font-black shadow-xl active:scale-95 transition-all text-center uppercase tracking-widest">
              Sell Device
            </Link>
            <Link to="/browse" className="bg-indigo-500/30 backdrop-blur-xl text-white px-8 py-4 rounded-2xl text-[10px] font-black shadow-xl active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest border border-white/10">
              Browse
            </Link>
          </div>
        </div>
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-device" style={{ transform: `translate3d(${pointer.x * -24}px, ${pointer.y * -18}px, 0) rotate(${pointer.x * 8 - 12}deg)` }}>
          <Smartphone className="size-40 text-white/80" strokeWidth={1} />
        </div>
      </section>

      {/* Trust Badges - Bento Style */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-card rounded-[1.75rem] p-4 flex flex-col items-center gap-3 text-center group transition-transform hover:-translate-y-1 sm:p-5">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Secure<br/>Escrow</p>
        </div>
        <div className="glass-card rounded-[1.75rem] p-4 flex flex-col items-center gap-3 text-center group transition-transform hover:-translate-y-1 sm:p-5">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <Zap className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Verified<br/>Sellers</p>
        </div>
        <div className="glass-card rounded-[1.75rem] p-4 flex flex-col items-center gap-3 text-center group transition-transform hover:-translate-y-1 sm:p-5">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Nigeria<br/>Wide</p>
        </div>
      </div>

      {/* Featured Listings */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-bold text-slate-800">Recent Arrivals</h2>
          <Link to="/browse" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {listings.map((item) => (
              <motion.div 
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 10, scale: 0.98 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
              >
                <Link to={`/product/${item.id}`} className="group block space-y-3">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 relative border border-slate-200/50 shadow-sm transition-all group-hover:shadow-indigo-100 group-hover:shadow-lg">
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-2xl text-[9px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100 shadow-sm">
                      {item.condition}
                    </div>
                  </div>
                  <div className="px-2 space-y-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate leading-tight">{item.title}</h3>
                    <p className="text-indigo-600 font-black text-lg tracking-tight">₦{(item.price / 100).toLocaleString()}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.location}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
