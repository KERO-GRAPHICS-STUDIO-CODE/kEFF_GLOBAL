import React from 'react';
import { AuthProvider } from './lib/AuthContext';
import { RiVuGMarketplace } from './components/rivug-marketplace';

export default function App() {
  return (
    <AuthProvider>
      <RiVuGMarketplace />
    </AuthProvider>
  );
}
