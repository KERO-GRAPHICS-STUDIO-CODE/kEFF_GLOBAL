import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './lib/AuthContext';
import Layout from './components/Layout';
import Preloader from './components/Preloader';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout';
import Chat from './components/Chat';
import AudioTnC from './components/AudioTnC';
import LiveCapture from './components/LiveCapture';

function AppContent() {
  const [showPreloader, setShowPreloader] = useState(true);

  if (showPreloader) {
    return <Preloader onComplete={() => setShowPreloader(false)} />;
  }

  // Demo product for checkout
  const demoProduct = {
    id: "1",
    name: "iPhone 13 Pro Max - Mint",
    basePrice: 453500, // Includes 3500 markup
    weightKg: 0.5
  };

  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <PageTransition>
                <div className="p-4 space-y-6">
                  <h1 className="text-2xl font-bold">RiVuG Demo Components</h1>
                  <div className="flex flex-col gap-4">
                     <Link to="/checkout" className="bg-indigo-100 text-indigo-700 p-4 rounded-xl font-bold">1. View Checkout Flow</Link>
                     <Link to="/chat" className="bg-blue-100 text-blue-700 p-4 rounded-xl font-bold">2. View Secure Chat</Link>
                     <Link to="/tnc" className="bg-amber-100 text-amber-700 p-4 rounded-xl font-bold">3. View Audio T&C</Link>
                     <Link to="/capture" className="bg-green-100 text-green-700 p-4 rounded-xl font-bold">4. View Live Capture (KYC)</Link>
                     <Link to="/admin" className="bg-red-100 text-red-700 p-4 rounded-xl font-bold">5. View Admin Dashboard</Link>
                  </div>
                </div>
              </PageTransition>
            } />
            <Route path="/checkout" element={
              <PageTransition>
                <Checkout product={demoProduct} onPay={(amt) => alert(`Paying ${amt}`)} />
              </PageTransition>
            } />
            <Route path="/chat" element={
              <PageTransition>
                <Chat />
              </PageTransition>
            } />
            <Route path="/tnc" element={
              <PageTransition>
                <div className="p-4 flex items-center justify-center min-h-[70vh]">
                  <AudioTnC
                    termsText="Welcome to RiVuG Escrow. By accepting these terms, you agree to our strict no-upload policy, our automated escrow fees, and dispute resolution guidelines. Your funds are secured until the transaction is successfully validated."
                    onAccept={() => alert("Terms Accepted. Server timestamp generated.")}
                  />
                </div>
              </PageTransition>
            } />
             <Route path="/capture" element={
              <PageTransition>
                <div className="p-4 flex items-center justify-center min-h-[70vh]">
                  <LiveCapture onCapture={(img) => alert("Image Captured successfully!")} />
                </div>
              </PageTransition>
            } />
            <Route path="/admin" element={
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            } />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
