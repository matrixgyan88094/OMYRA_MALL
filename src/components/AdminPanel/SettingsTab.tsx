import React, { useState, useEffect } from 'react';
import { Database, Link2, CheckCircle2, AlertCircle, RefreshCw, Server, ArrowRight, Copy, Check } from 'lucide-react';

interface SettingsTabProps {
  token: string;
  currentAlias: string;
  onAliasUpdated: (newAlias: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ token, currentAlias, onAliasUpdated }) => {
  const [aliasInput, setAliasInput] = useState(currentAlias);
  const [savingAlias, setSavingAlias] = useState(false);
  const [aliasNotice, setAliasNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Database status state
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loadingDbStatus, setLoadingDbStatus] = useState(true);

  useEffect(() => {
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      setLoadingDbStatus(true);
      const res = await fetch('/api/database/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.error('Failed to load DB status', e);
    } finally {
      setLoadingDbStatus(false);
    }
  };

  const handleUpdateAlias = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasInput || aliasInput.trim().length < 3) {
      setAliasNotice({ type: 'error', message: 'Alias must be at least 3 characters.' });
      return;
    }

    setSavingAlias(true);
    setAliasNotice(null);

    try {
      const res = await fetch('/api/admin/update-alias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newAlias: aliasInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update access URL alias');

      setAliasNotice({
        type: 'success',
        message: `Admin access URL updated to /${data.alias}. You can bookmark the new URL!`
      });
      onAliasUpdated(data.alias);
    } catch (err: any) {
      setAliasNotice({ type: 'error', message: err.message });
    } finally {
      setSavingAlias(false);
    }
  };

  const handleCopyAdminUrl = () => {
    const fullUrl = `${window.location.origin}/${currentAlias}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System & Routing Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure admin access URL security, path aliases, and inspect Neon PostgreSQL database health.
        </p>
      </div>

      {/* 1. Admin Access URL Alias Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Admin Gateway Access Path Alias</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Obfuscate and protect your administrative portal. When changed, accessing old or default paths immediately displays the animated 404 page.
            </p>
          </div>
        </div>

        {aliasNotice && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              aliasNotice.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {aliasNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">{aliasNotice.message}</div>
          </div>
        )}

        {/* Current Active URL display */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Current Admin URL</div>
            <code className="text-xs font-mono font-bold text-orange-600 mt-0.5 block">
              {window.location.origin}/{currentAlias}
            </code>
          </div>
          <button
            onClick={handleCopyAdminUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied URL!' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Change Alias Form */}
        <form onSubmit={handleUpdateAlias} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Admin Gateway Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 select-none bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                /
              </span>
              <input
                type="text"
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                required
                placeholder="md1620"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Alphanumeric characters only. Must be at least 3 letters.
            </span>
          </div>

          <button
            type="submit"
            disabled={savingAlias || aliasInput === currentAlias}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            {savingAlias ? 'Updating Gateway Slug...' : 'Update Admin URL Alias'}
          </button>
        </form>
      </div>

      {/* 2. Neon PostgreSQL Database Diagnostics */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Neon PostgreSQL Database Architecture</h3>
                {dbStatus?.neonConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Live & Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Server className="w-3 h-3" /> Persistent Storage Ready
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Connect your serverless PostgreSQL database from Neon Console to persist all catalog assets, customer orders, and credentials.
              </p>
            </div>
          </div>

          <button
            onClick={fetchDbStatus}
            disabled={loadingDbStatus}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh database diagnostics"
          >
            <RefreshCw className={`w-4 h-4 ${loadingDbStatus ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Storage Layer</div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              {dbStatus?.storageType || 'Detecting...'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {dbStatus?.neonConnected ? 'High-availability Neon Cloud Postgres' : 'Local JSON persistence layer'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Connection String Status</div>
            <div className="text-xs font-mono text-slate-800 mt-1 truncate">
              {dbStatus?.hasEnvVar ? (dbStatus.maskedUrl || 'DATABASE_URL active') : 'Pending DATABASE_URL environment setup'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Target: <code className="font-mono text-orange-600">DATABASE_URL</code>
            </div>
          </div>
        </div>

        {/* Database instruction guide */}
        <div className="mt-6 p-4 rounded-xl bg-orange-50/60 border border-orange-200/80 text-xs text-slate-700">
          <div className="font-bold text-orange-950 mb-1">To connect your live Neon PostgreSQL database:</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
            <li>Create a serverless database at <a href="https://neon.tech" target="_blank" rel="noreferrer" className="text-orange-600 underline font-semibold">neon.tech</a>.</li>
            <li>Copy your connection string: <code className="bg-white px-1.5 py-0.5 rounded border border-orange-200 font-mono text-slate-800">postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require</code>.</li>
            <li>Set the variable <strong className="text-slate-900">DATABASE_URL</strong> in your hosting environment or Secrets tab.</li>
            <li>The server automatically runs schema migrations and synchronizes tables seamlessly!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
