import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { testGemmaConnection } from '../services/api';
import { ConnectionTestResult } from '../types';

interface GemmaStatusBadgeProps {
  onStatusChange?: (result: ConnectionTestResult | null) => void;
}

export const GemmaStatusBadge: React.FC<GemmaStatusBadgeProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<ConnectionTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const res = await testGemmaConnection();
      setStatus(res);
      if (onStatusChange) onStatusChange(res);
    } catch (err: any) {
      const errorResult: ConnectionTestResult = {
        success: false,
        model: 'gemma-4-26b-a4b-it',
        latencyMs: 0,
        timestamp: new Date().toISOString(),
        error: err.message || 'Connection failed',
        verified: false,
      };
      setStatus(errorResult);
      if (onStatusChange) onStatusChange(errorResult);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowModal(true)}
          className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-700/50 hover:border-amber-400/60 transition-all text-xs font-medium cursor-pointer shadow-sm hover:shadow-purple-500/20"
          title="Click to view Gemma 4 connection diagnostics"
        >
          {/* Status Indicator Orb */}
          <span className="relative flex h-2.5 w-2.5">
            {loading ? (
              <span className="animate-spin h-2.5 w-2.5 border-2 border-amber-400 border-t-transparent rounded-full" />
            ) : status?.success ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            )}
          </span>

          <span className="text-purple-200 group-hover:text-amber-300 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemma 4</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/80 text-purple-300 font-mono">
              26b-a4b-it
            </span>
          </span>

          {status?.latencyMs ? (
            <span className="text-[10px] text-emerald-400/90 font-mono hidden sm:inline">
              {status.latencyMs}ms
            </span>
          ) : null}
        </button>

        {/* Quick Re-test Button */}
        <button
          onClick={runTest}
          disabled={loading}
          className="p-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-amber-300 transition-colors border border-purple-700/40 cursor-pointer disabled:opacity-50"
          title="Re-test Gemma 4 connection"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Connection Diagnostics Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#160d2b] border border-purple-600/50 rounded-2xl p-6 text-purple-100 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-purple-800/50">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">Gemma 4 Engine Status</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-purple-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/60 border border-purple-800/40">
                <span className="text-purple-300">Configured Model:</span>
                <span className="font-mono text-amber-300 font-semibold">gemma-4-26b-a4b-it</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/60 border border-purple-800/40">
                <span className="text-purple-300">API Connection:</span>
                <span className="flex items-center gap-1.5 font-medium">
                  {status?.success ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Live &amp; Verified
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Disconnected
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/60 border border-purple-800/40">
                <span className="text-purple-300">Round-trip Latency:</span>
                <span className="font-mono text-purple-200">
                  {status?.latencyMs ? `${status.latencyMs} ms` : 'Measuring...'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/60 border border-purple-800/40">
                <span className="text-purple-300">Security Architecture:</span>
                <span className="text-teal-300 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Server-side isolated
                </span>
              </div>

              {status?.response && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                  <span className="text-xs text-purple-400 block mb-1">Gemma 4 Live Handshake Greeting:</span>
                  <p className="text-xs text-purple-200 italic font-mono bg-[#0e071e] p-2 rounded-lg">
                    "{status.response.trim()}"
                  </p>
                </div>
              )}

              {status?.error && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-200 text-xs">
                  <p className="font-semibold mb-1">Connection Error:</p>
                  <p className="font-mono">{status.error}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-purple-800/50">
              <button
                onClick={runTest}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Testing...' : 'Test Connection Again'}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
