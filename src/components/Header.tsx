import React from 'react';
import { Zap, ShieldCheck, Lock, User as UserIcon, LogOut, LogIn, Map, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TranslateDropdown } from './TranslateDropdown';

interface HeaderProps {
  activeTab: 'vend' | 'lookup' | 'saved' | 'tariff' | 'dashboard' | 'maps' | 'admin';
  setActiveTab: (tab: 'vend' | 'lookup' | 'saved' | 'tariff' | 'dashboard' | 'maps' | 'admin') => void;
  onQuickReorder: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickReorder,
  onOpenAuth
}) => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#091122]/95 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-black/20">
      {/* Top micro accent gradient strip */}
      <div className="h-1 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Wordmark Logo */}
          <button
            onClick={() => setActiveTab('vend')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 font-extrabold shadow-md shadow-orange-500/20 transition-transform group-hover:scale-105 border border-orange-400/30">
              <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">
                CaseBox<span className="text-orange-400">Utility</span>
              </span>
              <span className="text-[10px] text-orange-200/80 font-medium tracking-wider uppercase block">
                Electricity Vending Portal · Ẹrọ Mita Ina
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={() => setActiveTab('vend')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 font-semibold cursor-pointer ${
                activeTab === 'vend'
                  ? 'border-orange-500 text-orange-400 font-bold'
                  : 'border-transparent text-slate-300 hover:text-white hover:border-orange-400/50'
              }`}
            >
              Vend Electricity
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 font-semibold cursor-pointer ${
                activeTab === 'lookup'
                  ? 'border-orange-500 text-orange-400 font-bold'
                  : 'border-transparent text-slate-300 hover:text-white hover:border-orange-400/50'
              }`}
            >
              Retrieve Token
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 font-semibold cursor-pointer ${
                activeTab === 'saved'
                  ? 'border-orange-500 text-orange-400 font-bold'
                  : 'border-transparent text-slate-300 hover:text-white hover:border-orange-400/50'
              }`}
            >
              Saved Meters
            </button>
            <button
              onClick={() => setActiveTab('tariff')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 font-semibold cursor-pointer ${
                activeTab === 'tariff'
                  ? 'border-orange-500 text-orange-400 font-bold'
                  : 'border-transparent text-slate-300 hover:text-white hover:border-orange-400/50'
              }`}
            >
              Tariff Calculator
            </button>
            <button
              onClick={() => {
                if (user) {
                  setActiveTab('dashboard');
                } else {
                  onOpenAuth();
                }
              }}
              className={`whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-orange-500 text-orange-400 font-bold'
                  : 'border-transparent text-slate-300 hover:text-white hover:border-orange-400/50'
              }`}
            >
              <span>Dashboard</span>
              {user && (
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('maps')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 font-semibold flex items-center gap-1 cursor-pointer ${
                activeTab === 'maps'
                  ? 'border-orange-500 text-orange-400 font-bold'
                  : 'border-transparent text-slate-300 hover:text-white hover:border-orange-400/50'
              }`}
            >
              <span>Grid Maps</span>
            </button>
          </nav>

          {/* Zone 3: Translate Dropdown, Primary Action, Customer Auth State & Operator Lock */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* National Support Desk Direct Call */}
            <a
              href="tel:+2348108958265"
              title="Call National Support Desk"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-300 hover:text-white bg-orange-500/10 hover:bg-orange-500/20 rounded-lg border border-orange-500/25 transition-all font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>Support: +2348108958265</span>
            </a>

            {/* Header Translate Dropdown (No Google name mentioned) */}
            <TranslateDropdown />

            <button
              onClick={onQuickReorder}
              className="hidden sm:flex px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 rounded-lg transition-all whitespace-nowrap shrink-0 items-center gap-1.5 shadow-sm shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
              <span>Quick Re-Vend</span>
            </button>

            {/* Customer Authentication Button / Profile Lock */}
            {user ? (
              <div className="flex items-center gap-2 bg-[#0c1833] border border-orange-500/30 rounded-xl px-2.5 py-1.5">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity cursor-pointer"
                  title="Open Customer Dashboard"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Customer'}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full border border-orange-400"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="hidden lg:block text-left text-xs leading-none">
                    <span className="font-bold text-white block max-w-[100px] truncate">{user.displayName || 'Protected User'}</span>
                    <span className="text-[10px] text-orange-400 font-mono block max-w-[100px] truncate">{user.email}</span>
                  </div>
                </button>
                <button
                  onClick={signOut}
                  title="Sign out from customer account"
                  className="p-1 text-slate-400 hover:text-rose-400 rounded-lg transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 text-xs font-bold text-orange-300 bg-[#0c1833] hover:bg-[#12234a] border border-orange-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-orange-400" />
                <span>Customer Login</span>
              </button>
            )}

            {/* Discreet Operator Lock */}
            <button
              onClick={() => setActiveTab('admin')}
              title="Operator Console"
              className={`p-2 rounded-lg text-xs transition-colors border cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-sm'
                  : 'border-slate-800 text-slate-400 hover:text-orange-400 hover:border-orange-500/40 bg-slate-900/60'
              }`}
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-slate-800/80 gap-3 text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('vend')}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'vend' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Vend Power
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'lookup' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Retrieve Token
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'saved' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Saved Meters
          </button>
          <button
            onClick={() => setActiveTab('tariff')}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'tariff' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Tariff Guide
          </button>
          <button
            onClick={() => {
              if (user) {
                setActiveTab('dashboard');
              } else {
                onOpenAuth();
              }
            }}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'dashboard' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('maps')}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'maps' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Grid Maps
          </button>
          {!user && (
            <button
              onClick={onOpenAuth}
              className="whitespace-nowrap shrink-0 px-3 py-1 rounded-md text-orange-400 font-bold bg-[#0c1833] border border-orange-500/40"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
