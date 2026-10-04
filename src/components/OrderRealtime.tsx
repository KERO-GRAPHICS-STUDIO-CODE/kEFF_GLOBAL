import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, Clock } from 'lucide-react';

interface OrderRealtimeProps {
  orderId: string;
}

const OrderRealtime: React.FC<OrderRealtimeProps> = ({ orderId }) => {
  const [status, setStatus] = useState<string>('Pending Payment');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial status
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (data) {
        setStatus(data.status);
      }
    };

    // We swallow errors here since this is demo code and tables might not exist
    fetchOrder().catch(() => {});

    // Set up Realtime subscriptions
    const orderSubscription = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order update received!', payload);
          setStatus(payload.new.status);
        }
      )
      .subscribe();

    // Listen to notifications table for this user (mocking user_id = buyer_123 for demo)
    const notificationSubscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.buyer_123`
        },
        (payload) => {
          console.log('Notification received!', payload);
          setNotification(payload.new.message);
          setTimeout(() => setNotification(null), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
      supabase.removeChannel(notificationSubscription);
    };
  }, [orderId]);

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="glassmorphism p-6 rounded-2xl shadow-sleek">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Order Status</h3>

        <div className="flex items-center gap-3">
          {status === 'Payment Secured' ? (
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="font-bold text-slate-800 dark:text-white">{status}</div>
            <div className="text-xs text-slate-500">Live updates via Supabase Realtime</div>
          </div>
        </div>

        {notification && (
          <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-3 rounded-xl text-sm font-medium animate-pulse border border-indigo-200 dark:border-indigo-800">
            🔔 {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderRealtime;
