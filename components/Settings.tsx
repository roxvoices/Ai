

import React from 'react';
import { User, AppTab } from '../types';
import { PLAN_CONFIGS } from '../constants';

interface SettingsProps {
  user: User;
  onLogout: () => void;
  onUpdateTheme: (theme: 'default' | 'black' | 'white' | 'blue') => void;
  setActiveTab: (tab: AppTab) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout, onUpdateTheme, setActiveTab }) => {
  const currentTheme = user.theme || 'default';
  const config = PLAN_CONFIGS[user.subscription];
  const limit = config.limit;
  
  const progress = Math.min(100, (user.charsUsed / limit) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">Account Settings</h1>
        <p className="text-sm md:text-lg font-medium text-slate-500">Manage your profile, theme, and subscription status.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Stats */}
        <div className="md:col-span-2 glass-panel rounded-[2rem] p-8 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{user.name}</h2>
              <p className="text-sm font-medium text-slate-500">{user.email}</p>
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase text-blue-500 tracking-widest">
                {user.subscription.toUpperCase()} Tier
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Quota */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Usage Overview</h4>
                  <p className="text-xl font-black text-white">{user.charsUsed.toLocaleString()} / {limit.toLocaleString()} <span className="text-xs opacity-60">/ {config.duration}</span></p>
                </div>
                <span className="text-[10px] font-bold opacity-60 uppercase text-slate-500">{Math.round(progress)}% Used</span>
              </div>
              <div className="h-2 w-full bg-slate-800/30 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${progress > 90 ? 'bg-red-500' : 'bg-blue-600'}`} style={{width: `${progress}%`}}></div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-medium text-slate-500">Your plan resets every {config.duration}. Current period ends shortly after {user.lastResetDate}.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
             <button 
              type="button"
              onClick={() => setActiveTab('premium')}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              Upgrade Plan
            </button>
            <button 
              type="button"
              onClick={onLogout}
              className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black rounded-2xl transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="glass-panel rounded-[2rem] p-8 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Appearance</h3>
          <div className="space-y-3">
            <ThemeButton 
              label="Rox Deep" 
              active={currentTheme === 'default'} 
              onClick={() => onUpdateTheme('default')} 
              previewColor="#020617" 
            />
            <ThemeButton 
              label="Pitch Black" 
              active={currentTheme === 'black'} 
              onClick={() => onUpdateTheme('black')} 
              previewColor="#000000" 
            />
            <ThemeButton 
              label="Pure White" 
              active={currentTheme === 'white'} 
              onClick={() => onUpdateTheme('white')} 
              previewColor="#ffffff" 
              borderColor="#e2e8f0"
            />
            <ThemeButton 
              label="Midnight Blue" 
              active={currentTheme === 'blue'} 
              onClick={() => onUpdateTheme('blue')} 
              previewColor="#0a1428" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const ThemeButton = ({ label, active, onClick, previewColor, borderColor }: any) => (
  <button 
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
      active ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-white/5'
    }`}
  >
    <div 
      className="w-8 h-8 rounded-lg shadow-inner" 
      style={{ backgroundColor: previewColor, border: borderColor ? `1px solid ${borderColor}` : 'none' }}
    ></div>
    <span className="text-xs font-bold" style={{color: active ? '#3b82f6' : 'inherit'}}>{label}</span>
    {active && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
  </button>
);