import React, { useState } from 'react';
import { TARIFF_BANDS } from '../data/discos';
import { Calculator, Cpu } from 'lucide-react';

export const TariffCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [selectedBand, setSelectedBand] = useState<string>('A');

  // Appliance daily usage
  const [hasAc, setHasAc] = useState(true);
  const [acHours, setAcHours] = useState(6);
  const [hasFridge, setHasFridge] = useState(true);
  const [hasTv, setHasTv] = useState(true);
  const [tvHours, setTvHours] = useState(8);

  const fee = 100;
  const netAmount = Math.max(0, amount - fee);
  const energyAmount = netAmount / 1.075; // Deduct 7.5% VAT

  const currentBand = TARIFF_BANDS.find(b => b.band === selectedBand) || TARIFF_BANDS[0];
  const totalKwh = parseFloat((energyAmount / currentBand.averageRate).toFixed(2));

  // Daily kWh consumption estimate
  const acDailyKwh = hasAc ? 1.1 * acHours : 0;
  const fridgeDailyKwh = hasFridge ? 0.18 * 24 : 0; // Inverter fridge cycling
  const tvDailyKwh = hasTv ? 0.12 * tvHours : 0;
  const lightsDailyKwh = 0.08 * 10; // 80W of LED lights for 10 hours
  const totalDailyKwh = parseFloat((acDailyKwh + fridgeDailyKwh + tvDailyKwh + lightsDailyKwh).toFixed(2));

  const estimatedDays = totalDailyKwh > 0 ? parseFloat((totalKwh / totalDailyKwh).toFixed(1)) : 0;

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-500/20 shadow-xl p-6 sm:p-8 space-y-6">
      <div className="pb-6 border-b border-orange-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-orange-500" />
          <span>NERC Electricity Tariff &amp; Appliance Runtime Calculator</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Estimate token units (kWh) and approximate days of power across Nigerian Service-Based Tariff Bands.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Amount and Tariff Bands */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Recharge Amount (NGN ₦)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 font-extrabold text-base">₦</span>
              <input
                type="number"
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full pl-9 pr-4 py-3 text-lg font-bold font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 text-slate-900 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Feeder Tariff Band
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TARIFF_BANDS.map((b) => (
                <button
                  key={b.band}
                  type="button"
                  onClick={() => setSelectedBand(b.band)}
                  className={`p-3.5 text-left rounded-xl border-2 transition-all text-xs flex flex-col justify-between cursor-pointer ${
                    selectedBand === b.band
                      ? 'border-orange-500 bg-orange-50/80 text-slate-900 shadow-sm'
                      : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-slate-900 text-sm">{b.label}</span>
                    <span className="font-mono font-extrabold text-orange-600 text-xs tabular-nums">
                      ₦{b.averageRate}/kWh
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-600 font-semibold block mb-1">{b.hours}</span>
                  <span className="text-[10px] text-slate-500 leading-tight block">{b.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Unit Comparison Matrix across all bands */}
          <div className="border border-orange-200 rounded-xl overflow-hidden text-xs shadow-2xs">
            <div className="bg-orange-50/80 px-4 py-2.5 font-bold text-slate-800 border-b border-orange-200">
              Comparative kWh Breakdown for ₦{amount.toLocaleString()}
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {TARIFF_BANDS.map((tb) => {
                  const kwh = parseFloat((energyAmount / tb.averageRate).toFixed(1));
                  return (
                    <tr
                      key={tb.band}
                      className={tb.band === selectedBand ? 'bg-orange-100/60 font-bold' : 'hover:bg-slate-50/50'}
                    >
                      <td className="py-2.5 px-4 font-sans text-slate-800 font-medium">{tb.label}</td>
                      <td className="py-2.5 px-4 text-slate-600">₦{tb.averageRate.toFixed(2)} / kWh</td>
                      <td className="py-2.5 px-4 text-right font-extrabold text-orange-600">
                        {kwh} kWh
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Appliance Simulator */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-orange-50/40 p-5 rounded-2xl border border-orange-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-orange-200">
            <Cpu className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Appliance Consumption Simulator
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* AC */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={hasAc}
                    onChange={(e) => setHasAc(e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>1.5HP Inverter Air Conditioner</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">1.1 kW</span>
              </div>
              {hasAc && (
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                  <span>Daily Runtime:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={acHours}
                      onChange={(e) => setAcHours(Number(e.target.value))}
                      className="w-24 accent-orange-500"
                    />
                    <span className="font-mono font-bold text-orange-600">{acHours} hrs/day</span>
                  </div>
                </div>
              )}
            </div>

            {/* Refrigerator */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={hasFridge}
                  onChange={(e) => setHasFridge(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span>Refrigerator / Deep Freezer</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">~4.3 kWh/day</span>
            </div>

            {/* TV & Entertainment */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={hasTv}
                    onChange={(e) => setHasTv(e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>Smart TV, Decoder &amp; Soundbar</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">0.12 kW</span>
              </div>
              {hasTv && (
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                  <span>Daily Watch Time:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="18"
                      value={tvHours}
                      onChange={(e) => setTvHours(Number(e.target.value))}
                      className="w-24 accent-orange-500"
                    />
                    <span className="font-mono font-bold text-orange-600">{tvHours} hrs/day</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Outcome Card in Navy & Orange */}
          <div className="p-4 bg-[#091122] text-white rounded-xl space-y-3 border border-orange-500/30 shadow-md">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Total Units Credited:</span>
              <span className="font-mono text-base font-extrabold text-orange-400 tabular-nums">
                {totalKwh} kWh
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Estimated Daily Burn:</span>
              <span className="font-mono text-xs font-bold text-slate-200 tabular-nums">
                ~{totalDailyKwh} kWh / day
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-orange-200 font-semibold">Projected Token Duration:</span>
              <span className="font-mono text-xl font-extrabold text-emerald-400 tabular-nums">
                ~{estimatedDays} Days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
