import React, { useState } from 'react';
import { VendingTransaction } from '../types/utility';
import { Copy, Check, Printer, Share2, ArrowLeft, BookmarkPlus, Zap, CheckCircle2, QrCode } from 'lucide-react';

interface ReceiptViewProps {
  transaction: VendingTransaction;
  onBackToVend: () => void;
  onSaveMeter?: (tx: VendingTransaction) => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  transaction,
  onBackToVend,
  onSaveMeter
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [meterSaved, setMeterSaved] = useState(false);

  const copyToken = () => {
    if (transaction.token) {
      navigator.clipboard.writeText(transaction.token.replace(/-/g, ''));
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `⚡ CaseBox Utility Electricity Token:\nDISCO: ${transaction.discoName}\nMeter: ${transaction.meterNumber}\nToken: ${transaction.token}\nUnits: ${transaction.unitsKwh} kWh\nAmount: ₦${transaction.amount.toLocaleString()}\nRef: ${transaction.reference}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSave = () => {
    if (onSaveMeter) {
      onSaveMeter(transaction);
      setMeterSaved(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={onBackToVend}
          className="flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Vend Another Token</span>
        </button>

        <div className="flex items-center gap-2">
          {onSaveMeter && (
            <button
              onClick={handleSave}
              disabled={meterSaved}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-orange-500/30 bg-[#0c1833] hover:bg-[#12234a] text-orange-300 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{meterSaved ? 'Saved to My Meters' : 'Save Meter'}</span>
            </button>
          )}
          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-orange-500/30 bg-[#0c1833] hover:bg-[#12234a] text-orange-300 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-extrabold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/30"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* 20-Digit STS Token Hero Box - Orange and Navy mix */}
      {transaction.meterType === 'prepaid' && transaction.token && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 p-6 sm:p-8 rounded-2xl shadow-xl shadow-orange-500/20 border-2 border-orange-400 print:border print:border-slate-300">
          <div className="flex items-center justify-between mb-3 text-xs font-extrabold tracking-wider uppercase text-slate-950">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              Official STS Prepaid Recharge Token
            </span>
            <span className="font-mono bg-slate-950/15 px-2.5 py-1 rounded-md text-[11px] font-bold">
              20 Digits
            </span>
          </div>

          {/* Segmented Token Display on Deep Navy background */}
          <div className="bg-[#091122] text-orange-400 p-5 rounded-xl font-mono text-center tracking-wider text-xl sm:text-2xl lg:text-3xl font-extrabold select-all tabular-nums mb-4 shadow-inner border border-orange-500/30">
            {transaction.token}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={copyToken}
              className="w-full sm:w-auto px-6 py-3 bg-[#091122] hover:bg-[#0c1833] text-orange-400 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm border border-orange-500/30 active:scale-95"
            >
              {copiedToken ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Token Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-orange-400" />
                  <span>Copy 20-Digit Token</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-950">
              <div>
                <span className="text-[10px] text-slate-900 block uppercase font-bold">Units Credited</span>
                <span className="font-mono text-lg font-extrabold">{transaction.unitsKwh} kWh</span>
              </div>
              <div className="h-7 w-px bg-slate-950/20" />
              <div>
                <span className="text-[10px] text-slate-900 block uppercase font-bold">Status</span>
                <span className="font-mono uppercase text-xs text-slate-950 font-extrabold">VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Meter Loading Guide */}
          <div className="mt-4 pt-4 border-t border-slate-950/20 text-xs text-slate-950 flex items-start gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>How to load:</strong> Type the 20 digits above into your CIU/meter keypad, then press the <strong>Enter/Blue button</strong> (↵ or #). Your screen will display &quot;ACCEPT&quot; and your units will be credited immediately.
            </p>
          </div>
        </div>
      )}

      {/* Official Printable Invoice / Receipt - White and Orange Mix */}
      <div className="bg-white rounded-2xl border-2 border-orange-500/20 shadow-xl p-6 sm:p-8 space-y-6 print:shadow-none print:border-none print:p-0">
        {/* Receipt Header */}
        <div className="flex justify-between items-start pb-6 border-b border-orange-200">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow-xs">
                CBX
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">CaseBox Utility</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Official Electricity Vending &amp; Bill Payment Receipt</p>
            <p className="text-[11px] text-orange-600 font-semibold mt-0.5">Direct Feeder Settlement Network</p>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold uppercase inline-block mb-1">
              Payment Successful
            </span>
            <div className="text-[11px] font-mono text-slate-500 block">{transaction.receiptNumber}</div>
            <div className="text-[11px] text-slate-400">{new Date(transaction.timestamp).toLocaleString()}</div>
          </div>
        </div>

        {/* Customer & Supply Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-orange-600 uppercase font-bold block mb-1">Customer Name</span>
            <span className="font-extrabold text-slate-900 uppercase block text-sm">{transaction.customerName}</span>
            <span className="text-slate-600 block mt-1">{transaction.customerAddress}</span>
            <span className="text-slate-500 block font-mono mt-1">Phone: {transaction.phone}</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-orange-600 uppercase font-bold block mb-1">Provider &amp; Account</span>
            <span className="font-bold text-slate-900 block text-sm">{transaction.discoName}</span>
            <span className="font-mono text-slate-700 block mt-1">
              Meter No: <strong>{transaction.meterNumber}</strong> ({transaction.meterType.toUpperCase()})
            </span>
            <span className="text-slate-500 font-mono text-[11px] block mt-1">
              Ref: {transaction.reference}
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-orange-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-orange-50/80 border-b border-orange-200 text-slate-700 font-bold">
              <tr>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-right py-3 px-4">Amount (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-800">
              <tr>
                <td className="py-3 px-4 font-sans font-medium">
                  Electricity Energy Cost ({transaction.unitsKwh} kWh)
                </td>
                <td className="py-3 px-4 text-right">₦{transaction.energyAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium">Statutory Value Added Tax (VAT 7.5%)</td>
                <td className="py-3 px-4 text-right">₦{transaction.vatAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium">Convenience &amp; Gateway Processing Fee</td>
                <td className="py-3 px-4 text-right">₦{transaction.fee.toLocaleString()}</td>
              </tr>
              <tr className="bg-orange-50 font-bold text-slate-950 font-sans">
                <td className="py-3.5 px-4 font-extrabold text-sm">Total Amount Paid</td>
                <td className="py-3.5 px-4 text-right text-base font-mono font-extrabold text-orange-600">
                  ₦{transaction.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Receipt Verification Footer & QR */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-orange-200 rounded-xl bg-orange-50/50">
              <QrCode className="w-9 h-9 text-slate-900" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">CaseBox Verification Hash</span>
              <span className="font-mono text-[11px] text-slate-500 block">{transaction.reference}</span>
              <span className="text-[10px] text-slate-400">Scan to verify token validity with DISCO server</span>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <span>Powered by CaseBox Utility Vending Gateway</span>
            <span className="block mt-0.5 font-medium text-slate-600">National Support Desk: <strong className="font-mono text-slate-900">+2348108958265</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
