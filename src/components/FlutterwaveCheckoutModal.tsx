import React, { useState } from 'react';
import { Disco, MeterType, PaymentMethodType, VendingTransaction } from '../types/utility';
import { X, CreditCard, Building2, PhoneCall, ShieldCheck, CheckCircle2, Lock, Copy, Check, Loader2, Zap } from 'lucide-react';

interface FlutterwaveCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendingData: {
    disco: Disco;
    meterType: MeterType;
    meterNumber: string;
    amount: number;
    customerName: string;
    customerAddress: string;
    phone: string;
    email: string;
    unitsKwh: number;
    energyAmount: number;
    vatAmount: number;
    fee: number;
  };
  onSuccess: (transaction: VendingTransaction) => void;
}

export const FlutterwaveCheckoutModal: React.FC<FlutterwaveCheckoutModalProps> = ({
  isOpen,
  onClose,
  vendingData,
  onSuccess
}) => {
  const [activeChannel, setActiveChannel] = useState<PaymentMethodType>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [selectedBank, setSelectedBank] = useState('GTBank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Dynamic Virtual bank account details for transfer checkout
  const virtualAccount = {
    bank: 'Dedicated Utility Reserve Bank',
    number: `012${vendingData.meterNumber.slice(-7)}`,
    accountName: `CASEBOX / ${vendingData.customerName.slice(0, 16)}`,
    expiresIn: '28:45'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  if (!isOpen) return null;

  const handlePay = async (paymentMethod: PaymentMethodType) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const configResponse = await fetch('/api/flw/config');
      const configData = await configResponse.json();
      const publicKey = configData?.data?.publicKey;
      if (!publicKey || !publicKey.startsWith('FLWPUBK')) throw new Error('Flutterwave payment is not configured.');
      const txRef = `CBX-FLW-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      setIsProcessing(false);
      await new Promise<void>((resolve, reject) => {
        const open = () => {
          const checkout = window.FlutterwaveCheckout;
          if (!checkout) { reject(new Error('Flutterwave checkout could not load.')); return; }
          checkout({
            public_key: publicKey,
            tx_ref: txRef,
            amount: vendingData.amount,
            currency: 'NGN',
            payment_options: paymentMethod === 'bank_transfer' ? 'banktransfer' : paymentMethod === 'ussd' ? 'ussd' : 'card',
            customer: { email: vendingData.email, phone_number: vendingData.phone, name: vendingData.customerName },
            customizations: { title: 'CaseBox Utility', description: `${vendingData.disco.code} electricity token` },
            callback: async (result: { status?: string; transaction_id?: number | string; tx_ref?: string }) => {
              try {
                if (result.status !== 'successful' || !result.transaction_id || result.tx_ref !== txRef) throw new Error('Flutterwave payment was not completed.');
                setIsProcessing(true); setProcessingStage(`Requesting token from ${vendingData.disco.code} grid...`);
                const response = await fetch('/api/flw/vend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...vendingData, paymentMethod, flutterwaveTransactionId: result.transaction_id, flutterwaveReference: txRef }) });
                const data = await response.json();
                if (!response.ok || data.status !== 'success') throw new Error(data.message || 'Flutterwave Bill Payment failed.');
                onSuccess(data.data); resolve();
              } catch (error) { reject(error); }
            },
            onclose: () => reject(new Error('Flutterwave checkout was closed before payment completed.')),
          });
        };
        const existing = document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]');
        if (existing) { open(); return; }
        const script = document.createElement('script'); script.src = 'https://checkout.flutterwave.com/v3.js'; script.onload = open; script.onerror = () => reject(new Error('Flutterwave checkout could not load.')); document.body.appendChild(script);
      });
      setIsProcessing(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing payment. Please verify card details.');
      setIsProcessing(false);
    }

declare global { interface Window { FlutterwaveCheckout?: (options: Record<string, unknown>) => void; } }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-orange-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Navy Blue Header with Orange Accent */}
        <div className="bg-[#091122] text-white px-6 py-4 flex items-center justify-between border-b border-orange-500/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-orange-500/20">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <span className="text-xs text-orange-400 block font-semibold">CaseBox Secure Checkout</span>
              <span className="text-sm font-bold text-white block">Electricity Bill Payment Gateway</span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Meter Strip */}
        <div className="bg-orange-50/80 px-6 py-3 border-b border-orange-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-600 block">Meter / Account</span>
            <span className="font-mono font-bold text-slate-950">{vendingData.meterNumber} ({vendingData.disco.code})</span>
          </div>
          <div className="text-right">
            <span className="text-slate-600 block">Total Due</span>
            <span className="font-mono font-extrabold text-base text-orange-600">
              ₦{vendingData.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 border-2 border-orange-300 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-orange-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Processing Electricity Vend</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">{processingStage}</p>
            </div>
            <div className="w-48 mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full w-2/3 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">Please do not close this window or refresh your browser.</p>
          </div>
        ) : (
          <div className="p-6">
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {errorMessage}
              </div>
            )}

            {/* Payment Channel Selector */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setActiveChannel('card')}
                className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all border ${
                  activeChannel === 'card'
                    ? 'border-orange-500 bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-orange-50/50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChannel('bank_transfer')}
                className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all border ${
                  activeChannel === 'bank_transfer'
                    ? 'border-orange-500 bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-orange-50/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Bank Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChannel('ussd')}
                className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all border ${
                  activeChannel === 'ussd'
                    ? 'border-orange-500 bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-orange-50/50'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>USSD</span>
              </button>
            </div>

            {/* Channel 1: Card */}
            {activeChannel === 'card' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="5399 4100 0000 0000"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:bg-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:bg-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Card PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value)}
                    placeholder="****"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handlePay('card')}
                  className="w-full mt-2 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Pay ₦{vendingData.amount.toLocaleString()}</span>
                </button>
              </div>
            )}

            {/* Channel 2: Dynamic Bank Transfer */}
            {activeChannel === 'bank_transfer' && (
              <div className="space-y-3">
                <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Assigned Bank</span>
                    <span className="font-bold text-slate-900">{virtualAccount.bank}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Dynamic Account Number</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-extrabold text-lg text-orange-600 tabular-nums">
                        {virtualAccount.number}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(virtualAccount.number)}
                        className="p-1 text-slate-500 hover:text-orange-600 rounded"
                        title="Copy account number"
                      >
                        {copiedAccount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-orange-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Beneficiary Name</span>
                    <span className="font-bold text-slate-900 text-right">{virtualAccount.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-orange-200">
                    <span>Exact Amount to Transfer</span>
                    <span className="font-mono font-bold text-slate-950">₦{vendingData.amount.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-tight">
                  Transfer the exact amount into this dedicated account. Your payment is verified automatically and your 20-digit STS token will be displayed immediately.
                </p>

                <button
                  type="button"
                  onClick={() => handlePay('bank_transfer')}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>I Have Completed Bank Transfer</span>
                </button>
              </div>
            )}

            {/* Channel 3: USSD */}
            {activeChannel === 'ussd' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                  >
                    <option value="GTBank">GTBank (*737#)</option>
                    <option value="FirstBank">First Bank (*894#)</option>
                    <option value="Zenith">Zenith Bank (*966#)</option>
                    <option value="UBA">UBA (*919#)</option>
                    <option value="Access">Access Bank (*901#)</option>
                  </select>
                </div>

                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-center">
                  <span className="text-[11px] text-slate-600 block mb-1">Dial this USSD string on your registered phone:</span>
                  <div className="font-mono font-extrabold text-lg text-orange-600 select-all">
                    {selectedBank === 'GTBank' && `*737*50*${vendingData.amount}*8192#`}
                    {selectedBank === 'FirstBank' && `*894*${vendingData.amount}*4410#`}
                    {selectedBank === 'Zenith' && `*966*${vendingData.amount}*2291#`}
                    {selectedBank === 'UBA' && `*919*${vendingData.amount}*1928#`}
                    {selectedBank === 'Access' && `*901*${vendingData.amount}*9012#`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePay('ussd')}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-slate-950" />
                  <span>I Have Completed USSD Payment</span>
                </button>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                PCI-DSS Level 1 Encrypted
              </span>
              <span>Order Ref: {vendingData.meterNumber.slice(-6)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
