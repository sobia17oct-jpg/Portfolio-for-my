import { Lock, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { DEFAULT_ADMIN_PASSCODE } from '../data/defaultPortfolio';

interface AdminLoginModalProps {
  isOpen: boolean;
  activePasscode: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({
  isOpen,
  activePasscode,
  onClose,
  onSuccess,
}: AdminLoginModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setPasscode('');
    setError('');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter your passcode before unlocking.');
      return;
    }
    if (passcode.trim() === activePasscode) {
      onSuccess();
    } else {
      setError('Incorrect passcode. Please check your PIN and try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-slate-200 bg-[#FAFAFB] flex items-center justify-center text-blue-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="admin-login-title"
                className="font-display text-xl font-semibold text-slate-900"
              >
                Admin Login
              </h2>
              <p className="text-xs text-slate-500">
                Enter your passcode to manage Miss Sobia’s portfolio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin login"
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="px-3.5 py-2.5 rounded-lg border border-rose-200 bg-rose-50 text-xs font-medium text-rose-800"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-passcode"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Passcode / PIN
            </label>
            <input
              id="admin-passcode"
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (e.g. 1234)"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15"
            />
            <p className="mt-2 text-xs text-slate-500">
              Default passcode:{' '}
              <span className="font-mono-tabular font-semibold text-slate-800">
                {DEFAULT_ADMIN_PASSCODE}
              </span>{' '}
              (you can change it anytime inside Contact &amp; Settings).
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
