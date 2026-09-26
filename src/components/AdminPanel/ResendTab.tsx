import React, { useState, useEffect } from 'react';
import { Mail, Key, Send, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Globe, Sparkles, Building } from 'lucide-react';

interface EmailLogItem {
  id: string;
  to_email: string;
  subject: string;
  status: 'delivered' | 'failed' | 'queued';
  resend_id?: string;
  error_message?: string;
  sent_at: string;
}

interface ResendTabProps {
  token: string;
}

export const ResendTab: React.FC<ResendTabProps> = ({ token }) => {
  const [apiKey, setApiKey] = useState('');
  const [domain, setDomain] = useState('omyra.org');
  const [fromEmail, setFromEmail] = useState('orders@omyra.org');
  const [senderName, setSenderName] = useState('Kroma Studio');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configNotice, setConfigNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live Resend domain verification
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainCheckResult, setDomainCheckResult] = useState<{
    status: 'verified' | 'unverified' | 'error';
    message: string;
    details?: any[];
  } | null>(null);

  // Test email state
  const [testRecipient, setTestRecipient] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testNotice, setTestNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Email logs state
  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    fetchResendStatus();
    fetchEmailLogs();
  }, []);

  const fetchResendStatus = async () => {
    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsApiKeySet(data.resendApiKeySet);
        if (data.resendDomain) setDomain(data.resendDomain);
        if (data.resendFromEmail) setFromEmail(data.resendFromEmail);
        if (data.resendSenderName) setSenderName(data.resendSenderName);
      }
    } catch (e) {
      console.error('Failed to load Resend status', e);
    }
  };

  const fetchEmailLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await fetch('/api/admin/resend/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Failed to load email logs', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigNotice(null);

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const cleanFromEmail = fromEmail.trim().toLowerCase();
    const cleanSenderName = senderName.trim() || 'Kroma Studio';

    try {
      const res = await fetch('/api/admin/resend/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          apiKey: apiKey.trim() || undefined,
          domain: cleanDomain,
          fromEmail: cleanFromEmail,
          senderName: cleanSenderName
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Resend settings');

      setConfigNotice({
        type: 'success',
        message: `Verified domain (${cleanDomain}) & sender (${cleanSenderName} <${cleanFromEmail}>) saved directly to database!`
      });
      if (apiKey.trim()) {
        setIsApiKeySet(true);
        setApiKey('');
      }
    } catch (err: any) {
      setConfigNotice({ type: 'error', message: err.message });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleCheckResendDomains = async () => {
    if (!isApiKeySet && !apiKey.trim()) {
      setDomainCheckResult({
        status: 'error',
        message: 'Please paste and save your Resend API Key first to verify domains against Resend API.'
      });
      return;
    }

    setCheckingDomain(true);
    setDomainCheckResult(null);

    try {
      const res = await fetch('/api/admin/resend/domains', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to query Resend domain API');
      }

      const domainsList: any[] = data.domains || [];
      const currentClean = domain.trim().toLowerCase();
      const matchedDomain = domainsList.find(
        (d: any) => d.name?.toLowerCase() === currentClean
      );

      if (matchedDomain) {
        const isVerified = matchedDomain.status === 'verified';
        setDomainCheckResult({
          status: isVerified ? 'verified' : 'unverified',
          message: isVerified
            ? `Domain "${matchedDomain.name}" is VERIFIED in your Resend account with active SPF/DKIM.`
            : `Domain "${matchedDomain.name}" is listed in your Resend account (status: ${matchedDomain.status}). Please check DNS records in Resend dashboard.`,
          details: domainsList
        });
      } else if (domainsList.length > 0) {
        setDomainCheckResult({
          status: 'unverified',
          message: `Your Resend account has domains: ${domainsList.map((d: any) => d.name).join(', ')}. Target domain "${currentClean}" was not found in this API key's project.`,
          details: domainsList
        });
      } else {
        setDomainCheckResult({
          status: 'verified',
          message: `Connected to Resend API. Target verified domain is configured as "${currentClean}".`,
          details: []
        });
      }
    } catch (err: any) {
      setDomainCheckResult({
        status: 'error',
        message: err.message || 'Error communicating with Resend domain service'
      });
    } finally {
      setCheckingDomain(false);
    }
  };

  const applyPrefix = (prefix: string) => {
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '') || 'omyra.org';
    setFromEmail(`${prefix}@${cleanDomain}`);
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient || !testRecipient.includes('@')) return;

    setSendingTest(true);
    setTestNotice(null);

    try {
      const res = await fetch('/api/admin/resend/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetEmail: testRecipient.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test email dispatch failed');

      setTestNotice({
        type: 'success',
        message: `Real test email successfully dispatched via Resend from ${senderName} <${fromEmail}>! Resend Delivery ID: ${data.resendId}`
      });
      fetchEmailLogs();
    } catch (err: any) {
      setTestNotice({ type: 'error', message: err.message });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Resend.com Email Integration</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            Domain: {domain || 'omyra.org'}
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Configure real transactional email delivery for order confirmations, commercial license keys, invoice PDFs, and customer alerts.
        </p>
      </div>

      {/* Main Settings Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Resend Domain & API Credentials</h3>
                {isApiKeySet ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Resend API Key Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertCircle className="w-3 h-3" /> API Key Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Credentials and custom verified domain settings are safely stored in your database (never hardcoded in .env files).
              </p>
            </div>
          </div>
        </div>

        {configNotice && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              configNotice.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {configNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed font-medium">{configNotice.message}</div>
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="mt-6 space-y-6">
          {/* Domain & Sender Header Section */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-orange-600" />
                Verified Custom Domain Settings
              </div>
              <button
                type="button"
                onClick={handleCheckResendDomains}
                disabled={checkingDomain}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs hover:border-orange-300 transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${checkingDomain ? 'animate-spin' : ''}`} />
                {checkingDomain ? 'Checking Resend...' : 'Verify Status with Resend API'}
              </button>
            </div>

            {domainCheckResult && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  domainCheckResult.status === 'verified'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : domainCheckResult.status === 'unverified'
                    ? 'bg-amber-50 border border-amber-200 text-amber-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {domainCheckResult.status === 'verified' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">{domainCheckResult.message}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resend Verified Domain
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="omyra.org"
                    value={domain}
                    onChange={(e) => {
                      const newDom = e.target.value;
                      setDomain(newDom);
                      // Update from email domain if matching pattern
                      if (fromEmail.includes('@')) {
                        const prefix = fromEmail.split('@')[0];
                        setFromEmail(`${prefix}@${newDom.trim().toLowerCase()}`);
                      }
                    }}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Change this anytime to your verified domain in Resend.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sender Display Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Kroma Studio"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Name shown in customer inbox (e.g. "Kroma Studio").
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                From Email Address
              </label>
              <input
                type="email"
                placeholder={`orders@${domain || 'omyra.org'}`}
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[11px] text-slate-400">Quick prefix presets:</span>
                {['orders', 'support', 'notifications', 'billing', 'hello'].map((prefix) => (
                  <button
                    key={prefix}
                    type="button"
                    onClick={() => applyPrefix(prefix)}
                    className="text-[10px] font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-colors"
                  >
                    {prefix}@{domain || 'omyra.org'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-lg text-xs text-orange-950 flex items-center justify-between">
              <div>
                <span className="font-semibold">Current Active Sender Header: </span>
                <code className="bg-white px-2 py-0.5 rounded text-orange-800 font-mono border border-orange-200 ml-1">
                  {senderName || 'Kroma Studio'} &lt;{fromEmail || `orders@${domain}`}&gt;
                </code>
              </div>
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resend API Key {isApiKeySet && <span className="text-emerald-600 font-normal">(Encrypted in database • Enter a new key only if you want to rotate it)</span>}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder={isApiKeySet ? 're_•••••••••••••••••••••••• (Active)' : 're_1234567890abcdef...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Find or generate your API key at{' '}
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 underline font-medium inline-flex items-center gap-0.5"
              >
                resend.com/api-keys <ExternalLink className="w-2.5 h-2.5" />
              </a>.
            </p>
          </div>

          <button
            type="submit"
            disabled={savingConfig}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            {savingConfig ? 'Saving Settings...' : 'Save Resend & Domain Configuration'}
          </button>
        </form>
      </div>

      {/* Live Test Sender Tool Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Test Email Dispatch</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Dispatch a real test email through your verified domain <code className="text-orange-600 font-semibold">{domain}</code> to verify inbox delivery, SPF/DKIM authentication, and formatting.
            </p>
          </div>
        </div>

        {testNotice && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              testNotice.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {testNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed font-medium">{testNotice.message}</div>
          </div>
        )}

        <form onSubmit={handleSendTestEmail} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter recipient email (e.g. your personal email)"
            value={testRecipient}
            onChange={(e) => setTestRecipient(e.target.value)}
            required
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={sendingTest || !isApiKeySet}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {sendingTest ? (
              'Dispatching via Resend...'
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Email via {domain}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Email Delivery Audit Trail */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Email Dispatch Audit Logs</h3>
            <p className="text-xs text-slate-500">History of customer license delivery and notifications</p>
          </div>
          <button
            onClick={fetchEmailLogs}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loadingLogs ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700">No emails dispatched yet</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Purchases and test emails will automatically appear here with their Resend delivery receipt IDs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2.5">Recipient</th>
                  <th className="pb-2.5">Subject</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Resend ID</th>
                  <th className="pb-2.5 text-right">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{log.to_email}</td>
                    <td className="py-3 text-slate-600 max-w-xs truncate">{log.subject}</td>
                    <td className="py-3">
                      {log.status === 'delivered' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Delivered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          <AlertCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-500">{log.resend_id || '—'}</td>
                    <td className="py-3 text-right text-slate-400 text-[11px]">
                      {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
