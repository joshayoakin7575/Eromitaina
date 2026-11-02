import React, { useState } from 'react';
import { Disco, MeterType, MeterValidationResult } from '../types/utility';
import { NIGERIAN_DISCOS } from '../data/discos';
import { CheckCircle2, AlertCircle, RefreshCw, ChevronDown, Zap, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface VendingFormProps {
  onInitiatePayment: (params: {
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
  }) => void;
  prefillMeter?: { meterNumber: string; discoCode: string; meterType: MeterType } | null;
}

export const VendingForm: React.FC<VendingFormProps> = ({ onInitiatePayment, prefillMeter }) => {
  const { user } = useAuth();
  const [selectedDisco, setSelectedDisco] = useState<Disco>(NIGERIAN_DISCOS[0]);
  const [meterType, setMeterType] = useState<MeterType>('prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState<number>(3000);
  const [phone, setPhone] = useState('08034567890');
  const [email, setEmail] = useState(user?.email || 'customer@casebox.ng');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<MeterValidationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showDiscoDropdown, setShowDiscoDropdown] = useState(false);
  const [discoSearch, setDiscoSearch] = useState('');
  const [manualEntryMode, setManualEntryMode] = useState(false);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [justConfirmed, setJustConfirmed] = useState(false);

  const handleConfirmManualDetails = (e?: React.FormEvent | string) => {
    if (e && typeof e !== 'string' && 'preventDefault' in e) {
      e.preventDefault();
    }
    const clean = meterNumber.replace(/\s+/g, '');
    if (!clean || clean.length < 9) {
      setValidationError('Please enter a valid meter number (10 to 13 digits)');
      return;
    }
    const enteredName = (typeof e === 'string' ? e : manualCustomerName.trim()) || 'REGISTERED ACCOUNT HOLDER';
    const result: MeterValidationResult = {
      isValid: true,
      meterNumber: clean,
      customerName: enteredName.toUpperCase(),
      address: manualAddress.trim() || `${selectedDisco.shortName} Distribution Network`,
      discoCode: selectedDisco.code,
      discoName: selectedDisco.name,
      meterType,
      arrears: 0,
      tariffBand: 'Band A (20hrs+)',
      tariffRate: selectedDisco.tariffPerKwh || 209.50,
      accountNumber: `ACC-${clean.slice(-6)}`
    };
    setValidationResult(result);
    setValidationError(null);
    setManualEntryMode(false);
    setJustConfirmed(true);

    setTimeout(() => {
      const section = document.getElementById('recharge-amount-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  };

  // Handle prefill from Saved Meters
  React.useEffect(() => {
    if (prefillMeter) {
      const match = NIGERIAN_DISCOS.find(d => d.code === prefillMeter.discoCode);
      if (match) setSelectedDisco(match);
      setMeterType(prefillMeter.meterType);
      setMeterNumber(prefillMeter.meterNumber);
      validateMeterNumber(prefillMeter.meterNumber, match?.code || selectedDisco.code, prefillMeter.meterType);
    }
  }, [prefillMeter]);

  // Compute transparent breakdown
  const fee = 100;
  const netAfterFee = Math.max(0, amount - fee);
  const energyAmount = parseFloat((netAfterFee / 1.075).toFixed(2));
  const vatAmount = parseFloat((netAfterFee - energyAmount).toFixed(2));
  const tariffRate = validationResult?.tariffRate || selectedDisco.tariffPerKwh || 209.50;
  const estimatedUnits = amount > fee ? parseFloat((energyAmount / tariffRate).toFixed(2)) : 0;

  const validateMeterNumber = async (mNum: string, dCode: string, mType: MeterType) => {
    const clean = mNum.replace(/\s+/g, '');
    if (!clean || clean.length < 9) {
      setValidationError('Please enter a valid meter number (10 to 13 digits)');
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const res = await fetch('/api/flw/validate-meter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meterNumber: clean,
          discoCode: dCode,
          meterType: mType
        })
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const rawText = await res.text();
        console.warn('Non-JSON response from meter validation:', rawText);
      }

      if (res.ok && data?.status === 'success' && data?.data) {
        setValidationResult(data.data);
        setManualEntryMode(false);
      } else if (data?.status === 'unmapped_on_registry' || data?.canProceedWithCustomerDetails) {
        setValidationResult(null);
        setManualEntryMode(true);
        setManualCustomerName('');
        setManualAddress('');
        setValidationError(
          data?.message ||
          `Meter ${clean} format verified. Automated registry lookup is unmapped. Please confirm customer details below to proceed.`
        );
      } else {
        setValidationError(
          data?.message ||
          `Meter verification failed. Meter ${clean} was not recognized on ${selectedDisco.name} (${selectedDisco.shortName}). Please verify that the meter number and provider match.`
        );
        setValidationResult(null);
      }
    } catch (err: any) {
      setValidationError(
        err?.message && !err.message.includes('Unexpected token')
          ? err.message
          : 'Network error communicating with the meter verification server. Please try again.'
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationResult) {
      setValidationError('Please validate the meter number before proceeding to payment.');
      return;
    }

    if (amount < selectedDisco.minAmount) {
      setValidationError(`Minimum vending amount for ${selectedDisco.shortName} is ₦${selectedDisco.minAmount.toLocaleString()}`);
      return;
    }

    onInitiatePayment({
      disco: selectedDisco,
      meterType,
      meterNumber: meterNumber.replace(/\s+/g, ''),
      amount,
      customerName: validationResult.customerName,
      customerAddress: validationResult.address,
      phone,
      email,
      unitsKwh: estimatedUnits,
      energyAmount,
      vatAmount,
      fee
    });
  };

  const filteredDiscos = NIGERIAN_DISCOS.filter(
    d => d.name.toLowerCase().includes(discoSearch.toLowerCase()) ||
         d.code.toLowerCase().includes(discoSearch.toLowerCase()) ||
         d.stateCoverage.some(s => s.toLowerCase().includes(discoSearch.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-500/20 shadow-xl overflow-hidden relative">
      {/* Vending Header - White background with vibrant Orange highlight */}
      <div className="px-6 py-5 bg-gradient-to-r from-orange-50 via-white to-amber-50/40 border-b border-orange-200/80 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Electricity Vending Form</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your provider, verify your meter details, and generate your 20-digit STS token.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-lg shadow-sm shadow-orange-500/20 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 fill-slate-950" />
          <span>Instant Token Generation</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Step 1: DISCO Selection & Meter Type */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* DISCO Selector */}
          <div className="md:col-span-8 relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Electricity Provider (DISCO)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDiscoDropdown(!showDiscoDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-orange-50/40 border border-slate-300 hover:border-orange-400 rounded-xl text-left text-sm font-medium text-slate-900 transition-all focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-xs"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="w-8 h-8 rounded-lg bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {selectedDisco.code.slice(0, 3)}
                  </span>
                  <div className="truncate">
                    <span className="font-bold block truncate text-slate-900">{selectedDisco.name}</span>
                    <span className="text-[11px] text-slate-500 truncate block">{selectedDisco.stateCoverage.join(', ')}</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-orange-500 shrink-0 ml-2" />
              </button>

              {showDiscoDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border-2 border-orange-400 rounded-xl shadow-2xl z-30 max-h-72 overflow-y-auto p-2">
                  <div className="sticky top-0 bg-white pb-2 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="Search DISCO or State..."
                      value={discoSearch}
                      onChange={(e) => setDiscoSearch(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="space-y-1 pt-1">
                    {filteredDiscos.map((disco) => (
                      <button
                        key={disco.id}
                        type="button"
                        onClick={() => {
                          setSelectedDisco(disco);
                          setShowDiscoDropdown(false);
                          setValidationResult(null);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          selectedDisco.id === disco.id
                            ? 'bg-orange-500 text-white font-bold'
                            : 'hover:bg-orange-50 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{disco.name}</div>
                          <div className={`text-[11px] truncate ${selectedDisco.id === disco.id ? 'text-orange-100' : 'text-slate-500'}`}>
                            {disco.stateCoverage.join(', ')}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${selectedDisco.id === disco.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          {disco.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meter Type Segmented Control */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Meter Type
            </label>
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setMeterType('prepaid');
                  setValidationResult(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  meterType === 'prepaid'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prepaid (Token)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMeterType('postpaid');
                  setValidationResult(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  meterType === 'postpaid'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Postpaid (Bill)
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Meter Number & Verification */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {meterType === 'prepaid' ? 'Prepaid Meter Number' : 'Postpaid Account / Meter Number'}
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              10 – 13 Digits
            </span>
          </div>

          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter 10 to 13-digit meter number"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(e.target.value);
                  setValidationResult(null);
                  setValidationError(null);
                }}
                className="w-full px-4 py-3 text-base bg-slate-50 border border-slate-300 rounded-xl font-mono tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-slate-900 placeholder:text-slate-400 shadow-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => validateMeterNumber(meterNumber, selectedDisco.code, meterType)}
              disabled={isValidating || !meterNumber.trim()}
              className="px-5 py-3 bg-[#0c1833] hover:bg-[#12234a] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-sm border border-orange-500/20"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-orange-400" />
                  <span>Verify Meter</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Customer Confirmation Card when meter is unmapped on automated registry */}
          {manualEntryMode && !validationResult && (
            <div className="mt-3 p-5 bg-gradient-to-b from-orange-50/80 to-amber-50/40 border-2 border-orange-400/90 rounded-2xl space-y-4 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between border-b border-orange-200/80 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-slate-900">Direct Customer Confirmation</span>
                    <span className="text-[11px] font-mono text-orange-800 font-semibold">{selectedDisco.shortName} • Meter {meterNumber || '—'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setManualEntryMode(false);
                    setValidationError(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded hover:bg-orange-100/60 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="p-3 bg-white/90 border border-orange-200 rounded-xl text-xs text-slate-700 space-y-1.5 leading-relaxed">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Customer Confirmation:</span>
                    <span>
                      The live {selectedDisco.name} switch did not return an automated record for meter <strong className="font-mono text-slate-900">{meterNumber || '—'}</strong> (common when a meter is newly provisioned, unmapped on the automated lookup registry, or during network switch sync).
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 pl-6">
                  In compliance with NERC utility guidelines, you can confirm the customer's name and supply address below to proceed immediately with payment and receive your 20-digit STS token.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Customer Full Name / Account Holder <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Registered Account Holder"
                    value={manualCustomerName}
                    onChange={(e) => setManualCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-xs"
                    autoFocus
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    Enter the registered account holder or premises resident name.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Supply Address / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Service Address / Property Location"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-xs"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    Property or service address where this meter is installed.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-orange-200/60">
                <button
                  type="button"
                  onClick={() => handleConfirmManualDetails('REGISTERED ACCOUNT HOLDER')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-orange-300 bg-white text-slate-700 hover:text-slate-950 text-xs font-medium transition-colors cursor-pointer"
                >
                  Confirm as Registered Account Holder
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmManualDetails()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Confirm Customer &amp; Proceed to Recharge</span>
                </button>
              </div>
            </div>
          )}

          {/* Validation Error when manual entry mode is not active */}
          {validationError && !manualEntryMode && (
            <div className="mt-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-relaxed font-medium">{validationError}</span>
              </div>
              <div className="pt-2 border-t border-rose-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-[11px] text-rose-700">
                  DISCO online registry lookup failed or unmapped?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setManualEntryMode(true);
                    setManualAddress('');
                  }}
                  className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  Enter Customer Name &amp; Service Address →
                </button>
              </div>
            </div>
          )}

          {/* Meter Verification Badge Card */}
          {validationResult && (
            <div className="mt-3 p-4 bg-orange-50/70 border-2 border-orange-300/80 rounded-xl shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-orange-200 text-xs">
                <div className="flex items-center gap-1.5 text-orange-950 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>Meter Verified with {validationResult.discoName}</span>
                </div>
                <span className="font-mono text-[11px] text-orange-900 bg-orange-200/80 px-2 py-0.5 rounded font-bold">
                  {validationResult.tariffBand}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Customer Name</span>
                  <span className="font-extrabold text-slate-900 uppercase">{validationResult.customerName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Supply Address</span>
                  <span className="text-slate-700 truncate block font-medium">{validationResult.address}</span>
                </div>
              </div>
              {validationResult.arrears > 0 && (
                <div className="mt-2 text-xs text-amber-900 bg-amber-100 p-2 rounded-lg border border-amber-300">
                  Customer has outstanding arrears of ₦{validationResult.arrears.toLocaleString()}.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Amount Selection & Calculator */}
        <div id="recharge-amount-section" className="scroll-mt-6">
          {justConfirmed && (
            <div className="mb-4 p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center justify-between text-xs text-emerald-950 shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold block">Customer Confirmed: {validationResult?.customerName}</span>
                  <span className="text-emerald-800 text-[11px]">
                    Meter {meterNumber} is verified and ready. Select your recharge amount below and click Proceed to Payment!
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setJustConfirmed(false)}
                className="text-emerald-700 hover:text-emerald-950 text-xs font-bold px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Recharge Amount (NGN ₦)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-3">
            {[1500, 3000, 4500, 6000, 7500, 15000, 30000, 45000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                className={`py-2.5 px-1 text-xs font-bold rounded-xl font-mono tabular-nums transition-all border text-center ${
                  amount === amt
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 border-orange-400 shadow-md shadow-orange-500/20'
                    : 'bg-white hover:bg-orange-50/60 text-slate-800 border-slate-200 hover:border-orange-300'
                }`}
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 font-extrabold text-base">₦</span>
            <input
              type="number"
              min={selectedDisco.minAmount}
              max={selectedDisco.maxAmount}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full pl-9 pr-4 py-3 text-lg font-bold font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-slate-900 shadow-xs"
            />
          </div>

          {/* Transparent Cost & Unit Calculator Breakdown */}
          <div className="p-5 bg-gradient-to-br from-slate-50 to-orange-50/30 border border-orange-200 rounded-2xl space-y-2.5 text-xs shadow-xs">
            <div className="flex justify-between text-slate-600">
              <span>Energy Amount (Base)</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">₦{energyAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>VAT (7.5% Statutory)</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">₦{vatAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Convenience &amp; Processing Fee</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">₦{fee.toLocaleString()}</span>
            </div>
            <div className="pt-2.5 border-t border-orange-200/80 flex justify-between items-center text-sm font-bold text-slate-950">
              <span>Total Payable</span>
              <span className="font-mono tabular-nums text-lg text-orange-600 font-extrabold">₦{amount.toLocaleString()}</span>
            </div>

            {meterType === 'prepaid' && (
              <div className="mt-3 pt-3 border-t border-orange-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 -mx-5 -mb-5 p-3.5 rounded-b-2xl text-slate-950 shadow-xs">
                <span className="font-bold text-xs flex items-center gap-1.5 text-slate-950">
                  <Zap className="w-4 h-4 fill-slate-950" />
                  Estimated Units Credited:
                </span>
                <span className="font-mono font-extrabold text-base tabular-nums">
                  {estimatedUnits} kWh
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number (For SMS Token Delivery)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08034567890"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-slate-900 font-mono shadow-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address (For Official Receipt)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-slate-900 shadow-xs"
            />
          </div>
        </div>

        {/* Action Button - Orange CTA */}
        <div>
          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-base rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Proceed to Secure Payment (₦{amount.toLocaleString()})</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mt-3 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit bank grade encryption · Real-time DISCO network settlement</span>
          </div>
        </div>
      </form>
    </div>
  );
};
