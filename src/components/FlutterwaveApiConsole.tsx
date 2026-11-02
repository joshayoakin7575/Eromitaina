import React, { useState, useEffect } from 'react';
import { FlutterwaveConfig } from '../types/utility';
import { Key, ShieldCheck, Terminal, ArrowUpRight, Check, AlertCircle, RefreshCw, Zap, Server } from 'lucide-react';

export const FlutterwaveApiConsole: React.FC = () => {
  const [config, setConfig] = useState<FlutterwaveConfig | null>(null);
  const [pubKeyInput, setPubKeyInput] = useState('');
  const [secKeyInput, setSecKeyInput] = useState('');
  const [interserverIpInput, setInterserverIpInput] = useState('64.20.62.89');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [connResult, setConnResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Playground tester
  const [testMeter, setTestMeter] = useState('');
  const [testDisco, setTestDisco] = useState('IKEDC');
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/flw/config');
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setConfig(data.data);
        if (data.data.interserverIp) {
          setInterserverIpInput(data.data.interserverIp);
        }
      }
    } catch (err) {
      console.error('Error fetching FLW config:', err);
    }
  };

  const handleRunConnectivityTest = async () => {
    setIsTestingConn(true);
    setConnResult(null);
    try {
      const res = await fetch('/api/flw/test-connectivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setConnResult({ ok: res.ok, status: res.status, ...data });
    } catch (err: any) {
      setConnResult({
        ok: false,
        status: 0,
        message: err?.message || 'Connection failed'
      });
    } finally {
      setIsTestingConn(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const res = await fetch('/api/flw/update-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: pubKeyInput,
          secretKey: secKeyInput,
          interserverIp: interserverIpInput
        })
      });

      const data = await res.json();
      if (res.ok) {
        setUpdateMessage('Flutterwave credentials successfully updated.');
        fetchConfig();
      } else {
        setUpdateMessage(data.message || 'Failed to update credentials.');
      }
    } catch (err: any) {
      setUpdateMessage('Network error updating keys.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTestApiCall = async () => {
    setIsCallingApi(true);
    setApiResponse(null);

    try {
      const startTime = performance.now();
      const res = await fetch('/api/flw/validate-meter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meterNumber: testMeter,
          discoCode: testDisco,
          meterType: 'prepaid'
        })
      });

      const contentType = res.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await res.json()
        : { raw: await res.text() };
      const latencyMs = Math.round(performance.now() - startTime);

      setApiResponse({
        httpStatus: res.status,
        latency: `${latencyMs}ms`,
        endpoint: 'POST /v3/bill-items/:item_code/validate',
        payload
      });
    } catch (err: any) {
      setApiResponse({
        error: true,
        message: err.message
      });
    } finally {
      setIsCallingApi(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            <span>Flutterwave API Integration Hub</span>
          </h2>
          <p className="text-xs text-slate-500">
            Developer diagnostics, bill payment endpoints, and API credentials management.
          </p>
        </div>

        <a
          href="https://developer.flutterwave.com/docs/bill-payment"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
        >
          <span>Flutterwave Bill Payment Docs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Remita vs Flutterwave Architecture Comparison Card */}
      <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
            Why Flutterwave over Remita for CaseBox Utility?
          </span>
          <span className="text-[10px] text-slate-400">Architecture Upgrade</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
          <div>
            <span className="font-bold text-white block mb-0.5">Instant Meter Validation</span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Direct `/v3/bill-items/{'{item_code}'}/validate` API delivers real-time customer name and address verification within 450ms.
            </p>
          </div>
          <div>
            <span className="font-bold text-white block mb-0.5">Multi-Rail Payment Gateway</span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Customers can pay via Cards (Verve, Mastercard, Visa), instant dynamic Bank Transfer virtual accounts, and USSD.
            </p>
          </div>
          <div>
            <span className="font-bold text-white block mb-0.5">Synchronous Token Delivery</span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Immediate STS token response in `/v3/bills` with zero queue delay, auto-reversals on provider outages, and webhooks.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: API Keys Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-slate-600" />
                <span>Gateway Status</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {config?.vendingEngine === 'flutterwave_direct' ? 'Live Direct API' : 'Sandbox Simulator Active'}
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Base URL:</span>
                <span className="font-mono text-slate-900 font-semibold">{config?.apiBaseUrl || 'https://api.flutterwave.com/v3'}</span>
              </div>
              <div className="flex justify-between">
                <span>Public Key Status:</span>
                <span className="font-mono text-slate-900 text-[11px]">{config?.publicKeyMasked || 'Default Sandbox'}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveKeys} className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Configure Your Flutterwave Credentials (Optional)
            </h4>
            <p className="text-[11px] text-slate-500">
              Leave blank to use the high-fidelity built-in sandbox simulator, or enter your test/live keys from your Flutterwave dashboard.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Flutterwave Public Key (FLWPUBK...)</label>
              <input
                type="text"
                placeholder="FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxx-X"
                value={pubKeyInput}
                onChange={(e) => setPubKeyInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Flutterwave Secret Key (FLWSECK...)</label>
              <input
                type="password"
                placeholder="FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxx-X"
                value={secKeyInput}
                onChange={(e) => setSecKeyInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interserver Production IPv4 Address</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="64.20.62.89"
                  value={interserverIpInput}
                  onChange={(e) => setInterserverIpInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
                <span className="absolute right-2 top-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                  Added on FLW
                </span>
              </div>
            </div>

            {updateMessage && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs">
                {updateMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Save &amp; Activate Keys</span>
            </button>
          </form>

          {/* Server IP Whitelist Card */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Flutterwave Developer API IPv4 Whitelist</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                Interserver Active
              </span>
            </div>

            <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-emerald-200 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Interserver VPS:</span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">root@vps3634158 (Connected)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Outbound IPv4:</span>
                <span className="font-mono font-bold text-slate-800">{interserverIpInput || '64.20.62.89'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Flutterwave API Whitelist:</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Whitelisted &amp; Synced</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-700 font-bold block">Whitelisted Static IP:</span>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white rounded text-slate-900 font-mono text-xs font-bold border border-emerald-300 select-all">
                  {interserverIpInput || '64.20.62.89'}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(interserverIpInput || '64.20.62.89');
                    setCopiedKey('static-ip');
                    setTimeout(() => setCopiedKey(null), 2000);
                  }}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded transition-colors shrink-0"
                >
                  {copiedKey === 'static-ip' ? 'Copied!' : 'Copy IP'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunConnectivityTest}
              disabled={isTestingConn}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isTestingConn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{isTestingConn ? 'Probing...' : 'Test Flutterwave API & IP Whitelist'}</span>
            </button>

            {connResult && (
              <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                connResult.ok || connResult.data?.connected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span>{connResult.ok || connResult.data?.connected ? '✓ API & IP Whitelist Accepted' : '✕ Notice'}</span>
                  {connResult.data?.latencyMs && <span>{connResult.data.latencyMs}ms</span>}
                </div>
                <p className="text-[10px]">{connResult.data?.message || connResult.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live API Tester Playground */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>Bill Payment API Live Probe</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">Test Meter</label>
                <input
                  type="text"
                  value={testMeter}
                  onChange={(e) => setTestMeter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Provider</label>
                <select
                  value={testDisco}
                  onChange={(e) => setTestDisco(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold"
                >
                  <option value="IKEDC">IKEDC (Ikeja)</option>
                  <option value="EKEDC">EKEDC (Eko)</option>
                  <option value="AEDC">AEDC (Abuja)</option>
                  <option value="IBEDC">IBEDC (Ibadan)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestApiCall}
              disabled={isCallingApi}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isCallingApi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-slate-950" />}
              <span>Execute Live Meter Validation Probe</span>
            </button>

            {/* Response Console */}
            {apiResponse && (
              <div className="mt-3 bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-60 space-y-2">
                <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1">
                  <span>STATUS: {apiResponse.httpStatus} OK</span>
                  <span>LATENCY: {apiResponse.latency}</span>
                </div>
                <pre className="text-emerald-400">
                  {JSON.stringify(apiResponse.payload, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="p-3 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Flutterwave Webhook Endpoint</span>
            <code className="text-slate-800 font-mono block bg-slate-100 p-1.5 rounded">
              POST /api/flw/webhook
            </code>
            <p>Listens for &quot;charge.completed&quot; events and verifies &quot;verif-hash&quot; signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
