
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PaymentRequest, Plan } from '../types';
import { PLAN_CONFIGS } from '../constants';

export const AdminPanel: React.FC = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setRequests(data || []);
    setLoading(false);
  };

  const handleAction = async (id: string, userId: string, plan: Plan, status: 'approved' | 'rejected') => {
    try {
      // 1. Update the request status
      const { error: reqError } = await supabase
        .from('payment_requests')
        .update({ status })
        .eq('id', id);

      if (reqError) throw reqError;

      // 2. If approved, update user profile using RPC or direct update if permitted
      if (status === 'approved') {
        const duration = PLAN_CONFIGS[plan].duration;
        
        // This logic resets characters and updates plan
        const { error: profError } = await supabase
          .from('profiles')
          .update({ 
            plan: plan,
            chars_used: 0, 
            chars_reset_at: new Date().toISOString().split('T')[0] // Set new reset anchor
          })
          .eq('id', userId);

        if (profError) throw profError;
      }

      fetchRequests();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Payment Approval Queue</h1>
          <p className="text-slate-500">Verify manual payments and upgrade users.</p>
        </div>
        <button onClick={fetchRequests} className="px-4 py-2 bg-white/5 text-white text-[10px] font-black uppercase rounded-lg">Refresh</button>
      </header>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {requests.map((req) => (
            <div key={req.id} className="glass-panel rounded-[2rem] p-8 border-white/10 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase">User Email</div>
                  <div className="text-sm font-bold text-white">{req.user_email}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                  {req.status}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase">Requested Plan</div>
                <div className="text-lg font-black text-blue-500 uppercase">{req.plan}</div>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                <img src={req.screenshot_url} alt="Proof" className="w-full h-full object-contain cursor-zoom-in" onClick={() => window.open(req.screenshot_url)} />
              </div>

              {req.status === 'pending' && (
                <div className="flex gap-4">
                  <button onClick={() => handleAction(req.id, req.user_id, req.plan, 'approved')} className="flex-1 py-4 bg-green-600 text-white font-black rounded-xl text-xs uppercase tracking-widest">Approve</button>
                  <button onClick={() => handleAction(req.id, req.user_id, req.plan, 'rejected')} className="flex-1 py-4 bg-red-600/10 text-red-500 font-black rounded-xl text-xs uppercase tracking-widest">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
