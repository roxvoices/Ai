
import React, { useState } from 'react';
import { User, AppTab } from '../types';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogout: () => void;
}

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0f1d] border border-white/10 w-full max-w-2xl rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="text-slate-400 text-sm leading-relaxed space-y-4">
          {children}
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button onClick={onClose} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-colors">I Understand</button>
        </div>
      </div>
    </div>
  );
};

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center relative shadow-lg shadow-blue-500/20 group">
      <div className="absolute inset-0 bg-blue-400 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
      <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" strokeLinecap="round"/>
        <path d="M12 4v4M12 16v4M8 12h8" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    </div>
    <span className="text-xl font-extrabold tracking-tight text-white">{APP_NAME}</span>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, activeTab, setActiveTab, onLogout }) => {
  const [legalModal, setLegalModal] = useState<'tos' | 'privacy' | null>(null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-100 overflow-hidden">
      {/* Sidebar - Mobile Friendly Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0f1d] border-b md:border-b-0 md:border-r border-white/5 p-4 md:p-6 flex flex-col z-20">
        <div className="mb-6 md:mb-10 flex justify-between items-center md:block">
          <Logo />
          {user && (
            <div className="md:hidden flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {user && (
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
            <NavItem 
              active={activeTab === 'generate'} 
              onClick={() => setActiveTab('generate')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z" strokeWidth="2" strokeLinecap="round"/><path d="M15.54 8.46a5 5 0 010 7.07" strokeWidth="2" strokeLinecap="round"/></svg>}
              label="Voice Studio"
            />
            <NavItem 
              active={activeTab === 'architect'} 
              onClick={() => setActiveTab('architect')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="Create Voice"
            />
            <NavItem 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round"/></svg>}
              label="My Library"
            />
          </nav>
        )}

        <div className="hidden md:flex mt-auto border-t border-white/5 pt-6">
          {user ? (
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-slate-200">{user.name}</p>
                <button onClick={onLogout} className="text-[10px] text-slate-500 hover:text-blue-400 font-bold uppercase tracking-wider transition-colors">Sign out</button>
              </div>
            </div>
          ) : (
            <div className="py-2 px-4 rounded-xl bg-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
              Ready to Speak
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 relative h-full flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex-1 px-4 md:px-12 pt-8 pb-24 md:pb-32 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            {children}
          </div>
          
          {/* Legal Footer */}
          <footer className="w-full max-w-4xl mt-12 md:mt-24 pt-8 pb-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[10px] md:text-xs text-slate-600 font-medium tracking-wide">© 2025 Rox Voices. Premium AI Speech Technology.</p>
            <div className="flex gap-4 md:gap-8">
              <button onClick={() => setLegalModal('tos')} className="text-[10px] text-slate-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-widest outline-none">Terms of Service</button>
              <button onClick={() => setLegalModal('privacy')} className="text-[10px] text-slate-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-widest outline-none">Privacy Policy</button>
            </div>
          </footer>
        </div>
      </main>

      <Modal isOpen={legalModal === 'tos'} title="Terms of Service" onClose={() => setLegalModal(null)}>
        <p>By using Rox Voices, you agree to generate audio only for ethical and legal purposes. Impersonation of public figures without consent is strictly prohibited.</p>
        <p>Character limits are strictly enforced. Each user receives 500 characters per day, resetting at 00:00 Central Africa Time (CAT). Unused characters do not roll over.</p>
        <p>We reserve the right to suspend accounts engaged in abusive behavior or excessive automated requests.</p>
      </Modal>

      <Modal isOpen={legalModal === 'privacy'} title="Privacy & Support" onClose={() => setLegalModal(null)}>
        <p className="font-bold text-white mb-2">Support & Premium Services</p>
        <p>For technical support, account issues, or to upgrade to a premium plan without daily limits and with ultra-advanced features, please contact our team directly:</p>
        <ul className="list-disc ml-6 space-y-2 text-blue-300">
          <li>WhatsApp: <a href="https://wa.me/260765546444" className="hover:underline">+260765546444</a></li>
          <li>Email: <a href="mailto:markwell244@gmail.com" className="hover:underline">markwell244@gmail.com</a></li>
        </ul>
        <hr className="border-white/5 my-4" />
        <p>Your privacy is paramount. Rox Voices does not store your input text indefinitely; scripts are deleted after processing unless saved to your personal library.</p>
        <p>Generated audio files are stored securely and are only accessible to the account holder. We do not sell your vocal patterns or data to third parties.</p>
        <p>Cookies are used solely for maintaining your session and preferences.</p>
      </Modal>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-200 font-semibold text-xs md:text-sm whitespace-nowrap ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    {icon}
    {label}
  </button>
);
