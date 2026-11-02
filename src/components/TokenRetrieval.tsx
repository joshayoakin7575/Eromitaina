import React, { useState, useEffect } from 'react';
import { VendingTransaction } from '../types/utility';
import { Search, Copy, Check, Eye, RefreshCw, Calendar, Hash } from 'lucide-react';

interface TokenRetrievalProps {
  onSelectTransaction: (tx: VendingTransaction) => void;
}

export const TokenRetrieval: React.FC<TokenRetrievalProps> = ({ onSelectTransaction }) => {
  const [query, setQuery] = useState('');
  const [transactions, setTransactions] = useState<VendingTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTransactions = async (searchTerm = '') => {
    setIsLoading(true);
    try {
      let url = '/api/flw/transactions';
      if (searchTerm.trim()) {
        const clean = searchTerm.trim();
        url += clean.startsWith('CBX') || clean.startsWith('FLW')
          ? `?ref=${encodeURIComponent(clean)}`
          : `?meter=${encodeURIComponent(clean)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setTransactions(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions(query);
  };

  const copyToken = (id: string, token?: string) => {
    if (!token) return;
    navigator.clipboard.writeText(token.replace(/-/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-500/20 shadow-xl overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-orange-50 via-white to-amber-50/40 border-b border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Retrieve Electricity Token</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search previous purchases by Meter Number or CaseBox Transaction Reference.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative w-64 sm:w-72">
            <Search className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Meter No. or CBX Ref..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 font-mono shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
          <span>Searching transaction ledger...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <Hash className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Transactions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any vending transactions matching &quot;{query}&quot;. Try searching with your 11-digit meter number.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-orange-50/70 border-b border-orange-200 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">DISCO &amp; Customer</th>
                <th className="py-3 px-4">Meter No.</th>
                <th className="py-3 px-4">Amount / Units</th>
                <th className="py-3 px-4">20-Digit Token</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-orange-50/40 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                    <div className="flex items-center gap-1.5 font-sans font-medium">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 font-sans block">{tx.customerName}</span>
                    <span className="text-[11px] text-orange-700 font-sans font-semibold">{tx.discoCode} · {tx.meterType}</span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-800">
                    {tx.meterNumber}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900 block">₦{tx.amount.toLocaleString()}</span>
                    <span className="text-[11px] text-emerald-700 font-bold">{tx.unitsKwh} kWh</span>
                  </td>

                  <td className="py-3 px-4">
                    {tx.token ? (
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-950 bg-orange-100 border border-orange-300 px-2 py-0.5 rounded-md text-[11px]">
                          {tx.token}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToken(tx.id, tx.token)}
                          className="p-1 text-slate-400 hover:text-orange-600 rounded transition-colors"
                          title="Copy token"
                        >
                          {copiedId === tx.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-sans">Bill Settled</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectTransaction(tx)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-950 transition-colors inline-flex items-center gap-1 font-sans"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
