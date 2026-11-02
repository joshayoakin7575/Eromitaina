import React, { useState, useEffect } from 'react';
import { SavedMeter, MeterType } from '../types/utility';
import { NIGERIAN_DISCOS } from '../data/discos';
import { Plus, Trash2, Zap, Home, Briefcase, ArrowRight, ShieldCheck, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserSavedMeters, saveUserMeter, deleteUserMeter } from '../services/firebase';

interface SavedMetersProps {
  onQuickVend: (meter: { meterNumber: string; discoCode: string; meterType: MeterType }) => void;
  onOpenAuth: () => void;
}

export const SavedMeters: React.FC<SavedMetersProps> = ({ onQuickVend, onOpenAuth }) => {
  const { user } = useAuth();
  const [meters, setMeters] = useState<SavedMeter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newMeterNumber, setNewMeterNumber] = useState('');
  const [newDisco, setNewDisco] = useState(NIGERIAN_DISCOS[0].code);
  const [newType, setNewType] = useState<MeterType>('prepaid');

  // Load meters: from private Firestore if authenticated, else from local storage
  useEffect(() => {
    async function loadMeters() {
      if (user) {
        setIsLoading(true);
        const cloudMeters = await fetchUserSavedMeters(user.uid);
        setMeters(cloudMeters);
        setIsLoading(false);
      } else {
        try {
          const stored = localStorage.getItem('casebox_saved_meters');
          setMeters(stored ? JSON.parse(stored) : []);
        } catch {
          setMeters([]);
        }
      }
    }
    loadMeters();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeterNumber.trim() || !newLabel.trim()) return;

    const disco = NIGERIAN_DISCOS.find(d => d.code === newDisco);
    const newMeter: SavedMeter = {
      id: `sm_${Date.now()}`,
      label: newLabel,
      meterNumber: newMeterNumber.trim(),
      discoCode: newDisco,
      meterType: newType,
      customerName: user?.displayName || 'SAVED CUSTOMER',
      address: `${disco?.name || 'Local'} Supply Area`
    };

    if (user) {
      await saveUserMeter(user.uid, newMeter);
    } else {
      const updated = [newMeter, ...meters];
      localStorage.setItem('casebox_saved_meters', JSON.stringify(updated));
    }

    setMeters([newMeter, ...meters]);
    setShowAddModal(false);
    setNewLabel('');
    setNewMeterNumber('');
  };

  const handleDelete = async (id: string) => {
    if (user) {
      await deleteUserMeter(user.uid, id);
    } else {
      const updated = meters.filter(m => m.id !== id);
      localStorage.setItem('casebox_saved_meters', JSON.stringify(updated));
    }
    setMeters(meters.filter(m => m.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-500/20 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Privacy Notice Banner if not logged in */}
      {!user && (
        <div className="p-4 bg-orange-50/90 border border-orange-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-slate-800">
            <Lock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Customer Data Privacy &amp; Protection</span>
              <span className="text-slate-600">
                You are currently in guest mode. Sign in with Google or Microsoft to encrypt your meter details and access them across all your devices securely.
              </span>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Protect Data</span>
          </button>
        </div>
      )}

      {user && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Customer Data Protected: Meters encrypted and bound to {user.email}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-orange-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Saved Electricity Meters</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Save favorite meters for fast, 1-click token top-ups without re-typing 11-digit numbers.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Save New Meter</span>
        </button>
      </div>

      {meters.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <Home className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Saved Meters Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can save your home or office meter numbers to re-vend power instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meters.map((meter) => (
            <div
              key={meter.id}
              className="p-5 border-2 border-orange-200/80 rounded-2xl hover:border-orange-400 transition-all bg-gradient-to-br from-white to-orange-50/30 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-300 text-orange-600 flex items-center justify-center font-bold text-sm shadow-2xs">
                      {meter.label.toLowerCase().includes('office') ? (
                        <Briefcase className="w-5 h-5" />
                      ) : (
                        <Home className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">{meter.label}</h4>
                      <span className="text-xs text-orange-600 font-bold">
                        {meter.discoCode} · {meter.meterType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(meter.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete saved meter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-3 p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 shadow-2xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] font-medium">Meter Number</span>
                    <span className="font-mono font-bold text-slate-950 tabular-nums text-sm">{meter.meterNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] font-medium">Customer</span>
                    <span className="font-bold text-slate-800 truncate">{meter.customerName}</span>
                  </div>
                  {meter.lastVendedAmount && (
                    <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-100">
                      <span className="text-slate-500">Last Vended</span>
                      <span className="font-mono font-semibold text-orange-600">₦{meter.lastVendedAmount.toLocaleString()} ({meter.lastVendedDate})</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onQuickVend({
                  meterNumber: meter.meterNumber,
                  discoCode: meter.discoCode,
                  meterType: meter.meterType
                })}
                className="w-full mt-3 py-2.5 px-4 bg-[#0c1833] hover:bg-[#12234a] text-orange-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-orange-500/30 shadow-xs cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span>Re-Vend This Meter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-orange-500/40 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Meter</h3>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Friendly Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary Residence, Commercial Premises"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Provider (DISCO)</label>
                <select
                  value={newDisco}
                  onChange={(e) => setNewDisco(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-semibold"
                >
                  {NIGERIAN_DISCOS.map((d) => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meter Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('prepaid')}
                    className={`flex-1 py-2 rounded-lg border font-bold ${newType === 'prepaid' ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-xs' : 'border-slate-300 text-slate-700'}`}
                  >
                    Prepaid
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('postpaid')}
                    className={`flex-1 py-2 rounded-lg border font-bold ${newType === 'postpaid' ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-xs' : 'border-slate-300 text-slate-700'}`}
                  >
                    Postpaid
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meter Number (10 - 13 Digits)</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 10 to 13-digit meter number"
                  value={newMeterNumber}
                  onChange={(e) => setNewMeterNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold rounded-xl shadow-md shadow-orange-500/20"
                >
                  Save Meter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
