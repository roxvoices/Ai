import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PaymentRequest, Plan } from '../types';
import { BACKEND_BASE_URL } from '../services/geminiTTS'; // Import backend URL
import { PLAN_CONFIGS } from '../constants'; // Import plan configs for dropdown

// Define a type for the user data fetched from the admin-users endpoint
interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  subscription: Plan;
  charsUsed: number;
  role: 'user' | 'admin';
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payment_requests' | 'manage_users'>('payment_requests');
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingUserPlanId, setUpdatingUserPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
    fetchUsers(); // Fetch users on component mount
  }, []);

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/admin-payment-requests`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PaymentRequest[] = await response.json();
      setRequests(data);
    } catch (error: any) {
      console.error("Failed to fetch admin payment requests:", error);
      alert("Failed to load payment requests: " + error.message);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/admin-users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: AdminUser[] = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error("Failed to fetch all users for admin:", error);
      alert("Failed to load users: " + error.message);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAction = async (id: string, userId: string, plan: Plan, status: 'approved' | 'rejected') => {
    try {
      // 1. Update the request status in Supabase
      const { error: reqError } = await supabase
        .from('payment_requests')
        .update({ status })
        .eq('id', id);

      if (reqError) throw reqError;

      // 2. If approved, update user's subscription in the Node.js backend
      if (status === 'approved') {
        const backendUpdateResponse = await fetch(`${BACKEND_BASE_URL}/admin-update-user-plan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, plan }),
        });

        if (!backendUpdateResponse.ok) {
          const errorData = await backendUpdateResponse.json();
          throw new Error(`Backend plan update failed: ${errorData.error || 'Unknown error'}`);
        }
        
        // Also update the Supabase 'profiles' table for role, if desired.
        // For plan/usage, server.js is the source of truth now.
        // Let's explicitly update the role as well, ensuring consistency.
        const { error: roleError } = await supabase.from('profiles').update({ role: 'user' }).eq('id', userId); 
        if (roleError) console.error("Error updating user role in Supabase:", roleError);
        
        // Refresh users list after plan update
        fetchUsers();
      }

      fetchRequests(); // Refresh requests after action
    } catch (err: any) {
      alert("Error processing action: " + err.message);
    }
  };

  const handleUpdateUserPlan = async (userId: string, newPlan: Plan) => {
    setUpdatingUserPlanId(userId);
    try {
      const backendUpdateResponse = await fetch(`${BACKEND_BASE_URL}/admin-update-user-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      });

      if (!backendUpdateResponse.ok) {
        const errorData = await backendUpdateResponse.json();
        throw new Error(`Backend plan update failed: ${errorData.error || 'Unknown error'}`);
      }
      
      // Update local state to reflect the new plan and reset daily usage (handled by backend)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, subscription: newPlan, charsUsed: 0 } : user
        )
      );
      alert(`User ${userId}'s plan updated to ${newPlan.toUpperCase()} successfully.`);

    } catch (err: any) {
      console.error("Error updating user plan:", err);
      alert("Error updating user plan: " + err.message);
    } finally {
      setUpdatingUserPlanId(null);
    }
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Admin Console</h1>
          <p className="text-slate-500 text-sm md:text-lg font-medium mt-1">Manage payment approvals and user subscriptions.</p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <button type="button" onClick={fetchRequests} className="px-4 py-2 bg-white/5 text-white text-[10px] font-black uppercase rounded-lg hover:bg-white/10">Refresh Requests</button>
          <button type="button" onClick={fetchUsers} className="px-4 py-2 bg-white/5 text-white text-[10px] font-black uppercase rounded-lg hover:bg-white/10">Refresh Users</button>
        </div>
      </header>

      {/* Tabs for navigation */}
      <div className="flex border-b border-white/10 mb-8">
        <button
          className={`py-3 px-6 text-sm font-black uppercase tracking-widest transition-colors ${
            activeTab === 'payment_requests' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-white'
          }`}
          onClick={() => setActiveTab('payment_requests')}
        >
          Payment Requests
        </button>
        <button
          className={`py-3 px-6 text-sm font-black uppercase tracking-widest transition-colors ${
            activeTab === 'manage_users' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-white'
          }`}
          onClick={() => setActiveTab('manage_users')}
        >
          Manage Users
        </button>
      </div>

      {activeTab === 'payment_requests' && (
        <div className="space-y-12">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Approval Queue</h2>
          {loadingRequests ? (
            <div className="py-20 flex justify-center"><div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-lg font-medium">No pending payment requests.</div>
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
                    {req.screenshot_url ? (
                      <img src={req.screenshot_url} alt="Proof" className="w-full h-full object-contain cursor-zoom-in" onClick={() => window.open(req.screenshot_url!)} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No screenshot available</div>
                    )}
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex gap-4">
                      <button type="button" onClick={() => handleAction(req.id, req.user_id, req.plan, 'approved')} className="flex-1 py-4 bg-green-600 text-white font-black rounded-xl text-xs uppercase tracking-widest">Approve</button>
                      <button type="button" onClick={() => handleAction(req.id, req.user_id, req.plan, 'rejected')} className="flex-1 py-4 bg-red-600/10 text-red-500 font-black rounded-xl text-xs uppercase tracking-widest">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'manage_users' && (
        <div className="space-y-12">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Studio User List</h2>
          {loadingUsers ? (
            <div className="py-20 flex justify-center"><div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-lg font-medium">No users found.</div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-white/5">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-black/20">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      User ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Chars Used
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="bg-[#0f172a] hover:bg-[#1e293b] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-400">
                        <span className="truncate w-24 block" title={user.id}>{user.id.substring(0, 8)}...</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                          user.subscription === 'free' ? 'bg-slate-700/20 text-slate-400' :
                          user.subscription === 'starter' ? 'bg-blue-500/20 text-blue-400' :
                          user.subscription === 'vip' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {user.subscription}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.charsUsed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="bg-black/40 border border-white/5 rounded-lg py-2 px-3 text-white text-xs font-medium focus:ring-1 focus:ring-blue-500"
                          value={user.subscription}
                          onChange={(e) => handleUpdateUserPlan(user.id, e.target.value as Plan)}
                          disabled={updatingUserPlanId === user.id}
                        >
                          {Object.keys(PLAN_CONFIGS).map((planKey) => (
                            <option key={planKey} value={planKey as Plan}>
                              {planKey.toUpperCase()}
                            </option>
                          ))}
                        </select>
                        {updatingUserPlanId === user.id && (
                          <span className="ml-2 inline-block animate-spin text-blue-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};