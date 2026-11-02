import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  RefreshCw, 
  ShoppingBag, 
  ShieldCheck, 
  Bell, 
  Clock, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  CreditCard,
  Lock,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VendingTransaction, CustomerPreferences, RecurringAmount } from '../types/utility';
import { fetchUserTransactions, fetchUserPreferences, saveUserPreferences } from '../services/firebase';

interface CustomerDashboardProps {
  onBuyToken: () => void;
  onViewReceipt: (transaction: VendingTransaction) => void;
  onOpenAuth: () => void;
}

const ALLOWED_RECURRING_AMOUNTS: RecurringAmount[] = [2500, 5000, 7500, 10000, 12500, 15000];

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onBuyToken,
  onViewReceipt,
  onOpenAuth
}) => {
  const { user, signOut } = useAuth();

  const [transactions, setTransactions] = useState<VendingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Preference fields
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDayOfMonth, setReminderDayOfMonth] = useState<number>(2);
  const [reminderEmail, setReminderEmail] = useState('');
  
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringAmount, setRecurringAmount] = useState<RecurringAmount>(5000);
  const [recurringInterval, setRecurringInterval] = useState<'weekly' | 'monthly'>('weekly');
  const [flwPlanId, setFlwPlanId] = useState<string | number | undefined>(undefined);
  const [flwPlanStatus, setFlwPlanStatus] = useState<'active' | 'cancelled' | 'pending'>('pending');

  // Copy token state
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  // Test notification feedback
  const [sendingTestReminder, setSendingTestReminder] = useState(false);
  const [testReminderMessage, setTestReminderMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setReminderEmail(user.email || '');

    const loadData = async () => {
      setLoading(true);
      try {
        const [txList, prefs] = await Promise.all([
          fetchUserTransactions(user.uid),
          fetchUserPreferences(user.uid)
        ]);

        setTransactions(txList);

        if (prefs) {
          setReminderEnabled(prefs.reminderEnabled ?? true);
          setReminderDayOfMonth(prefs.reminderDayOfMonth || 2);
          if (prefs.reminderEmail) setReminderEmail(prefs.reminderEmail);
          setRecurringEnabled(prefs.recurringEnabled ?? false);
          if (prefs.recurringAmount && ALLOWED_RECURRING_AMOUNTS.includes(prefs.recurringAmount)) {
            setRecurringAmount(prefs.recurringAmount);
          }
          if (prefs.recurringInterval) setRecurringInterval(prefs.recurringInterval);
          if (prefs.flwPlanId) setFlwPlanId(prefs.flwPlanId);
          if (prefs.flwPlanStatus) setFlwPlanStatus(prefs.flwPlanStatus);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleCopyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token.replace(/-/g, ''));
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2500);
  };

  const handleSendTestReminder = async () => {
    if (!user) return;
    setSendingTestReminder(true);
    setTestReminderMessage(null);
    try {
      const res = await fetch('/api/flw/send-reminder-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: reminderEmail || user.email,
          dayOfMonth: reminderDayOfMonth
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setTestReminderMessage(`Test reminder dispatched to ${reminderEmail || user.email} for monthly Day ${reminderDayOfMonth}!`);
      } else {
        setTestReminderMessage(data.message || 'Failed to dispatch test reminder.');
      }
    } catch (err) {
      setTestReminderMessage('Network error dispatching test reminder.');
    } finally {
      setSendingTestReminder(false);
      setTimeout(() => setTestReminderMessage(null), 6000);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingPrefs(true);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);

    try {
      let activePlanId = flwPlanId;
      let activePlanStatus = flwPlanStatus;

      // If recurring payment is enabled, create/sync with Flutterwave Recurring Payment Plan API
      if (recurringEnabled) {
        const planRes = await fetch('/api/flw/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: recurringAmount,
            interval: recurringInterval,
            customerEmail: user.email,
            name: `CaseBox Utility Auto-Recharge (Day ${reminderDayOfMonth})`
          })
        });

        const planData = await planRes.json();
        if (planRes.ok && planData.status === 'success') {
          activePlanId = planData.data?.id || `FLW-PLAN-${Date.now().toString().slice(-6)}`;
          activePlanStatus = 'active';
          setFlwPlanId(activePlanId);
          setFlwPlanStatus('active');
        } else {
          throw new Error(planData.message || 'Failed to configure Flutterwave recurring plan');
        }
      } else if (flwPlanId) {
        // Cancel existing plan if customer toggled off
        try {
          await fetch(`/api/flw/plans/${flwPlanId}/cancel`, { method: 'POST' });
        } catch {
          // non-blocking
        }
        activePlanStatus = 'cancelled';
        setFlwPlanStatus('cancelled');
      }

      const prefsData: CustomerPreferences = {
        userId: user.uid,
        reminderEnabled,
        reminderDayOfMonth: Number(reminderDayOfMonth),
        reminderEmail: reminderEmail.trim() || user.email || '',
        recurringEnabled,
        recurringAmount,
        recurringInterval,
        flwPlanId: activePlanId ? String(activePlanId) : undefined,
        flwPlanStatus: activePlanStatus,
        mandateAuthorized: recurringEnabled,
        updatedAt: new Date().toISOString()
      };

      await saveUserPreferences(user.uid, prefsData);
      setSaveSuccessMessage('Preferences are saved to your account and remain available on another device.');
      setTimeout(() => setSaveSuccessMessage(null), 7000);
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      setSaveErrorMessage(err.message || 'Unable to update preferences. Please retry.');
      setTimeout(() => setSaveErrorMessage(null), 7000);
    } finally {
      setSavingPrefs(false);
    }
  };

  // If user is not signed in, show a dedicated customer privacy gate
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-[#091122] rounded-3xl p-8 sm:p-12 border border-orange-500/20 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Customer Dashboard Sign In
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Access your verified transaction history, configure automated monthly payment reminders, and set up capped recurring recharge mandates with zero-trust data protection.
          </p>

          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Sign In to Customer Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const latestPurchase = transactions.length > 0 ? transactions[0] : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Customer Header Greeting Banner */}
      <div className="bg-[#091122] border border-orange-500/20 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Customer'}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl border-2 border-orange-400 shadow-md object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'C'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                  Customer Dashboard
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Data Protected
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Welcome, {user.displayName || 'Customer'}
              </h1>
              <p className="text-sm font-mono text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBuyToken}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Buy Token</span>
            </button>
            <button
              onClick={signOut}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        {/* 2. Four-Metric Summary Cards (Matching CaseBox Utility) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          {/* Card 1: Purchases */}
          <div className="bg-[#0b1528]/80 border border-orange-500/15 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Purchases</span>
              <ShoppingBag className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {loading ? '...' : transactions.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Lifetime total tokens</p>
          </div>

          {/* Card 2: Latest purchase */}
          <div className="bg-[#0b1528]/80 border border-orange-500/15 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Latest purchase</span>
              <CreditCard className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-lg font-bold text-white truncate">
              {loading ? '...' : latestPurchase ? `₦${latestPurchase.amount.toLocaleString()}` : 'None yet'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {latestPurchase ? `${latestPurchase.discoCode} • ${new Date(latestPurchase.timestamp).toLocaleDateString()}` : 'No transactions recorded'}
            </p>
          </div>

          {/* Card 3: Reminders */}
          <div className="bg-[#0b1528]/80 border border-orange-500/15 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Reminders</span>
              <Bell className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {reminderEnabled ? `Day ${reminderDayOfMonth}` : 'Disabled'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {reminderEnabled ? 'Monthly email alert active' : 'Click to enable below'}
            </p>
          </div>

          {/* Card 4: Recurring payment */}
          <div className="bg-[#0b1528]/80 border border-orange-500/15 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Recurring payment</span>
              <RefreshCw className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-lg font-bold text-orange-400 truncate">
              {recurringEnabled ? `₦${recurringAmount.toLocaleString()} / ${recurringInterval}` : 'Requested'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {recurringEnabled ? 'Capped at ₦15,000 max' : 'Standby preference'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Purchase History Section */}
      <div className="bg-white rounded-2xl border border-orange-200/60 shadow-xl overflow-hidden text-slate-900">
        <div className="px-6 py-5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <span>Purchase history</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Completed purchases made while signed in will appear here.
            </p>
          </div>
          <button
            onClick={onBuyToken}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy token</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin text-orange-500 mx-auto mb-2" />
            Loading your verified transaction ledger...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No purchases yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              Completed purchases made while signed in will appear here with instant token display, receipts, and power usage units.
            </p>
            <button
              onClick={onBuyToken}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Vend First Token</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Date & Ref</th>
                  <th className="px-5 py-3">DISCO & Meter</th>
                  <th className="px-5 py-3">Amount & Units</th>
                  <th className="px-5 py-3">Electricity Token</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {new Date(tx.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">
                        {tx.reference}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{tx.discoCode}</div>
                      <div className="font-mono text-[11px] text-slate-600">{tx.meterNumber}</div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-orange-600">₦{tx.amount.toLocaleString()}</div>
                      <div className="text-[11px] text-slate-500">{tx.unitsKwh.toFixed(1)} kWh</div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {tx.token ? (
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 text-xs tracking-wider">
                            {tx.token}
                          </code>
                          <button
                            onClick={() => handleCopyToken(tx.token!, tx.id)}
                            className="p-1 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                            title="Copy Token to clipboard"
                          >
                            {copiedTokenId === tx.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Postpaid Settlement</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewReceipt(tx)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Recharge Preferences Section (Matching CaseBox Utility) */}
      <form onSubmit={handleSavePreferences} className="bg-white rounded-2xl border border-orange-200/60 shadow-xl overflow-hidden text-slate-900">
        <div className="px-6 py-5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200/80">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-600" />
            <span>Recharge preferences</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage how you want to prepare for the next recharge.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Notification Messages */}
          {saveSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          {saveErrorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{saveErrorMessage}</span>
            </div>
          )}

          {/* Subcard A: Payment reminders */}
          <div className="border border-slate-200 rounded-xl p-5 sm:p-6 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-orange-600" />
                  <span>Payment reminders</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save the monthly day when you want a reminder.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                <span className="text-xs font-bold text-slate-700">
                  {reminderEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {reminderEnabled && (
              <div className="space-y-4 pt-3 border-t border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Day input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Monthly Reminder Day (1 to 28)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="28"
                        value={reminderDayOfMonth}
                        onChange={(e) => {
                          const val = Math.min(28, Math.max(1, parseInt(e.target.value, 10) || 1));
                          setReminderDayOfMonth(val);
                        }}
                        className="w-24 px-3 py-2 text-center text-sm font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                      <span className="text-xs text-slate-600">
                        of every month (e.g. Day 2)
                      </span>
                    </div>
                  </div>

                  {/* Target Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-slate-500">
                    A reminder will be queued and sent on the morning of day {reminderDayOfMonth} before your token depletes.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendTestReminder}
                    disabled={sendingTestReminder}
                    className="px-3 py-1.5 rounded-lg border border-orange-300 hover:bg-orange-100 text-orange-800 text-[11px] font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {sendingTestReminder ? 'Testing...' : 'Send Test Alert'}
                  </button>
                </div>

                {testReminderMessage && (
                  <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    {testReminderMessage}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Subcard B: Recurring payment preference */}
          <div className="border border-slate-200 rounded-xl p-5 sm:p-6 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-orange-600" />
                  <span>Recurring payment preference</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record that you want automatic monthly or weekly recharge using Flutterwave recurring payment plans.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recurringEnabled}
                  onChange={(e) => setRecurringEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                <span className="text-xs font-bold text-slate-700">
                  {recurringEnabled ? 'Active' : 'Requested'}
                </span>
              </label>
            </div>

            {/* Mandatory Safety & Dispute Precaution Alert Banner */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5 mb-5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Safety & Dispute Precaution Policy</span>
                Recurring electricity recharge is strictly capped at a maximum of <strong>₦15,000</strong>. Choose from safe predetermined increments below to prevent inadvertent overbilling.
              </div>
            </div>

            {recurringEnabled && (
              <div className="space-y-5 pt-2 border-t border-slate-200/80">
                {/* Amount Selection Pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Select Recurring Amount (Capped at ₦15,000)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {ALLOWED_RECURRING_AMOUNTS.map((amt) => {
                      const isSelected = recurringAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setRecurringAmount(amt)}
                          className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-orange-400'
                          }`}
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frequency selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Recurrence Frequency
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRecurringInterval('weekly')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          recurringInterval === 'weekly'
                            ? 'bg-orange-100 text-orange-900 border-orange-500 font-extrabold'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Weekly
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecurringInterval('monthly')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          recurringInterval === 'monthly'
                            ? 'bg-orange-100 text-orange-900 border-orange-500 font-extrabold'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  {flwPlanId && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Active Plan Token
                      </label>
                      <div className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono text-slate-700 flex items-center justify-between">
                        <span>Plan #{flwPlanId}</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {flwPlanStatus}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mandate Notice */}
                <p className="text-[11px] text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                  This test preference cannot debit your bank account. A live recurring payment will require a separate mandate and customer authorization.
                </p>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Preferences are saved to your account and remain available on another device.
            </p>

            <button
              type="submit"
              disabled={savingPrefs}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingPrefs ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save preferences</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
