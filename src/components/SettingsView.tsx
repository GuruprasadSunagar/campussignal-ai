import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  ShieldCheck,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Info,
} from 'lucide-react';
import { testGemmaConnection } from '../services/api';
import { ConnectionTestResult } from '../types';
import { toggleAmbientSpookyMusic } from '../utils/spookyAudio';

interface SettingsViewProps {
  onClearAllData: () => void;
  savedNoticesCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onClearAllData,
  savedNoticesCount,
}) => {
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await testGemmaConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        model: 'gemma-4-26b-a4b-it',
        latencyMs: 0,
        timestamp: new Date().toISOString(),
        error: err.message || 'Connection failed',
        verified: false,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    toggleAmbientSpookyMusic(next);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="bg-[#160d2f] border border-purple-700/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">System Settings &amp; AI Config</h2>
          <p className="text-xs sm:text-sm text-purple-300">
            Real Gemma 4 model connection parameters, local privacy, and sound controls
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Card 1: Central Model Configuration */}
        <div className="bg-[#140c2a] border border-purple-800/50 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-800/50">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-base text-white">Configured AI Model</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/40">
              <span className="text-purple-400 block mb-1">Model Identifier:</span>
              <span className="font-mono text-amber-300 font-bold text-sm">gemma-4-26b-a4b-it</span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/40">
              <span className="text-purple-400 block mb-1">SDK:</span>
              <span className="font-mono text-teal-300 font-bold text-sm">@google/genai (v2.4.0)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2 text-xs text-purple-300">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              API Key is strictly isolated in server-side memory (`process.env.GEMINI_API_KEY`). It is
              never bundled or sent to the client browser.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-5 py-2.5 bg-purple-800 hover:bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing Gemma 4...' : 'Run Live Handshake Test'}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-1 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {testResult.success
                    ? `Live Gemma 4 Handshake Succeeded (${testResult.latencyMs}ms)`
                    : 'Handshake Failed'}
                </span>
              </div>
              {testResult.response && (
                <p className="font-mono text-xs opacity-90">"{testResult.response.trim()}"</p>
              )}
              {testResult.error && <p className="font-mono text-xs">{testResult.error}</p>}
            </div>
          )}
        </div>

        {/* Card 2: Audio Preferences */}
        <div className="bg-[#140c2a] border border-purple-800/50 rounded-3xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal-400" />
              Spooky Audio Ambiance
            </h3>
            <p className="text-xs text-purple-300">
              Web Audio synthesized spooky background resonance (Off by default)
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soundActive
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-purple-950 text-purple-300 border border-purple-800'
            }`}
          >
            {soundActive ? 'Sound ON' : 'Sound OFF'}
          </button>
        </div>

        {/* Card 3: Storage & Reset */}
        <div className="bg-[#140c2a] border border-purple-800/50 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                Clear Local Storage
              </h3>
              <p className="text-xs text-purple-300 mt-0.5">
                Currently storing {savedNoticesCount} saved notices in this browser
              </p>
            </div>

            {confirmClear ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearAllData();
                    setConfirmClear(false);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-2 bg-purple-900 text-purple-200 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-xl text-xs font-bold cursor-pointer"
              >
                Clear All Data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
