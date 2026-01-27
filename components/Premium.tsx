
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plan, User } from '../types';
import { PLAN_CONFIGS } from '../constants';
import { BACKEND_BASE_URL } from '../services/geminiTTS'; // Import backend URL

interface PremiumProps {
  user: User;
  onRefresh: (userId: string, email: string) => void; // Updated signature
}

export const Premium: React.FC<PremiumProps> = ({ user, onRefresh }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null); // For immediate preview

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission and page reload
    e.stopPropagation(); // Stop event propagation
    if (!selectedPlan || !file || !user) return;

    setLoading(true);
    setMessage(null);
    setUploadedPreviewUrl(null);

    try {
      // 1. Upload file to Supabase Storage in the 'screenshots' folder
      const fileName = `${user.id}-${Date.now()}-${file.name}`;
      const filePath = `screenshots/${fileName}`; // Path within the bucket
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment_screenshots')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Call backend to generate a signed URL and store payment request
      const backendResponse = await fetch(`${BACKEND_BASE_URL}/submit-payment-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          userEmail: user.email, 
          plan: selectedPlan, 
          filePath: uploadData.path // Send the storage path to the backend
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || `Backend error: ${backendResponse.statusText}`);
      }

      const backendResult = await backendResponse.json();
      const signedUrl = backendResult.signedUrl; // Backend returns the signed URL

      setMessage({ type: 'success', text: 'Payment proof submitted! Admin will approve it shortly.' });
      setUploadedPreviewUrl(signedUrl); // Store signed URL for preview
      setSelectedPlan(null);
      setFile(null);
      
      // Trigger a background refresh of user data to update the UI once admin approves.
      // This will no longer block the UI.
      onRefresh(user.id, user.email);

    } catch (err: any) {
      console.error("Payment submission error:", err);
      setMessage({ type: 'error', text: err.message || 'Failed to submit request.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">Upgrade Your Studio</h1>
        <p className="text-lg font-medium max-w-2xl mx-auto text-slate-400">Unlock professional character quotas for your specific needs.</p>
      </header>

      {message && (
        <div className={`p-6 rounded-[2rem] border text-center font-bold ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {message.text}
          {uploadedPreviewUrl && message.type === 'success' && (
            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-2">Your uploaded screenshot:</p>
              <img src={uploadedPreviewUrl} alt="Uploaded Proof Preview" className="max-w-xs mx-auto rounded-lg border border-green-500/20" />
            </div>
          )}
        </div>
      )}

      {!selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <PlanCard 
            title="FREE" 
            price={PLAN_CONFIGS.free.price} 
            features={['500 Characters', 'Daily Reset', 'Standard Voices', 'Cloud Sync']} 
            current={user.subscription === 'free'}
            disabled
          />
          <PlanCard 
            title="STARTER" 
            price={PLAN_CONFIGS.starter.price} 
            features={['50,000 Characters', 'Monthly Reset', 'Signature Voices', 'WAV Exports']} 
            current={user.subscription === 'starter'}
            onSelect={() => setSelectedPlan('starter')}
          />
          <PlanCard 
            title="VIP" 
            price={PLAN_CONFIGS.vip.price} 
            isPopular
            features={['200,000 Characters', 'Monthly Reset', 'Ultra-HD Audio', 'Priority Support']} 
            current={user.subscription === 'vip'}
            onSelect={() => setSelectedPlan('vip')}
          />
          <PlanCard 
            title="VVIP" 
            price={PLAN_CONFIGS.vvip.price} 
            features={['1,500,000 Characters', 'Yearly Reset', 'API Access', 'Pro Voice Lab']} 
            current={user.subscription === 'vvip'}
            onSelect={() => setSelectedPlan('vvip')}
          />
          <PlanCard 
            title="EXCLUSIVE" 
            price={PLAN_CONFIGS.exclusive.price} 
            features={['5,000,000 Characters', 'Yearly Reset', 'Commercial License', 'Priority Support']} 
            current={user.subscription === 'exclusive'}
            onSelect={() => setSelectedPlan('exclusive')}
          />
        </div>
      ) : (
        <div className="max-w-xl mx-auto glass-panel rounded-[3rem] p-12 space-y-8 border-blue-500/30 animate-in slide-in-from-bottom-8">
          <div className="text-center">
            <h3 className="text-2xl font-black text-white">Upgrade to {selectedPlan.toUpperCase()}</h3>
            <p className="text-slate-400 mt-2">Submit proof of payment to activate your plan.</p>
          </div>

          <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-xs font-black uppercase text-slate-500">Amount to Pay</span>
               <span className="text-xl font-black text-blue-500">{PLAN_CONFIGS[selectedPlan].price}</span>
             </div>
             <p className="text-[10px] text-slate-400">Contact <a href="https://wa.me/260765546444" className="text-blue-500 font-bold underline">+260765546444</a> for mobile money or banking instructions.</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Upload Payment Screenshot</label>
              <input 
                type="file" 
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-[#050914] border border-white/10 rounded-2xl p-5 text-white text-xs outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-600 file:text-white"
              />
            </div>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-5 rounded-2xl border border-white/10 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-white/5"
              >
                Back
              </button>
              <button 
                type="submit" // This button explicitly submits the form
                disabled={loading || !file}
                className="flex-[2] py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
              >
                {loading ? 'Processing...' : 'Submit Proof'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const PlanCard = ({ title, price, features, current, isPopular, onSelect, disabled }: any) => (
  <div className={`glass-panel rounded-[2rem] p-8 flex flex-col items-center text-center relative transition-transform hover:scale-[1.02] ${isPopular ? 'border-blue-500/40 shadow-2xl shadow-blue-600/10' : ''} ${current ? 'opacity-50 ring-2 ring-blue-500/20' : ''}`}>
    {isPopular && <div className="absolute -top-3 bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Best Value</div>}
    <h3 className="text-lg font-black mb-1 text-white">{title}</h3>
    <div className="text-3xl font-black mb-6 text-white">{price}</div>
    <ul className="space-y-3 text-[10px] font-medium mb-10 text-slate-500 flex-1">
      {features.map((f: string, i: number) => <li key={i}>{f}</li>)}
    </ul>
    <button 
      type="button"
      onClick={onSelect}
      disabled={current || disabled}
      className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${
        current 
          ? 'bg-slate-800 text-slate-500' 
          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20'
      }`}
    >
      {current ? 'Active' : 'Get Started'}
    </button>
  </div>
);