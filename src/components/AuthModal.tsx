import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasonText?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  reasonText = 'Sign in to access your encrypted meter records, saved meters, and private token receipts.'
}) => {
  const { signInWithGoogle, signInWithMicrosoft } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState<'google' | 'microsoft' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    setIsLoggingIn('google');
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Google Account');
    } finally {
      setIsLoggingIn(null);
    }
  };

  const handleMicrosoft = async () => {
    setIsLoggingIn('microsoft');
    setErrorMsg(null);
    try {
      await signInWithMicrosoft();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Microsoft Account. Ensure Microsoft login provider is enabled in Firebase Console.');
    } finally {
      setIsLoggingIn(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-orange-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Navy Header */}
        <div className="bg-[#091122] text-white p-6 border-b border-orange-500/30 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-orange-500/20 mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white">Customer Data Protection</h3>
          <p className="text-xs text-orange-200/80 mt-1 max-w-xs mx-auto">
            {reasonText}
          </p>
        </div>

        {/* Auth Body */}
        <div className="p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoggingIn !== null}
            className="w-full py-3.5 px-4 bg-white hover:bg-orange-50/50 border-2 border-slate-200 hover:border-orange-400 text-slate-800 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {isLoggingIn === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google Account</span>
          </button>

          {/* Microsoft Sign In Button */}
          <button
            type="button"
            onClick={handleMicrosoft}
            disabled={isLoggingIn !== null}
            className="w-full py-3.5 px-4 bg-white hover:bg-orange-50/50 border-2 border-slate-200 hover:border-orange-400 text-slate-800 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {isLoggingIn === 'microsoft' ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
            )}
            <span>Continue with Microsoft Account</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Trust Privacy &amp; Encrypted Customer Isolation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
