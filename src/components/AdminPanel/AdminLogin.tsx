import React, { useState, useEffect } from 'react';
import { Fingerprint, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (token: string, email: string, alias: string) => void;
  onGoHome: () => void;
  currentAlias: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onGoHome, currentAlias }) => {
  const [email, setEmail] = useState('developer995500@gmail.com');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPasskeys, setHasPasskeys] = useState(false);
  const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports WebAuthn
    if (window.PublicKeyCredential && typeof window.PublicKeyCredential === 'function') {
      setIsWebAuthnSupported(true);
    }
  }, []);

  // Standard Email & Password Authentication
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || `Server returned error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onSuccess(data.token, data.email, data.alias);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Biometric Fingerprint / Passkey Authentication (WebAuthn)
  const handleFingerprintLogin = async () => {
    if (!isWebAuthnSupported) {
      setError('Biometric authentication is not supported on this browser/device.');
      return;
    }

    setError(null);
    setBiometricLoading(true);

    try {
      // Step 1: Request login challenge from server
      const optRes = await fetch('/api/auth/webauthn/login-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const optText = await optRes.text();
      let optData: any = {};
      try {
        optData = JSON.parse(optText);
      } catch {
        throw new Error(optText || `Server returned error (${optRes.status})`);
      }

      if (!optRes.ok) {
        throw new Error(optData.error || 'No fingerprint passkey registered yet. Please log in with password to set up your passkey in Security.');
      }

      // Convert challenge base64url to Uint8Array
      const challengeBuffer = Uint8Array.from(atob(optData.publicKey.challenge.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
      
      const allowCredentials = (optData.publicKey.allowCredentials || []).map((cred: any) => ({
        id: Uint8Array.from(atob(cred.id.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
        type: cred.type,
        transports: cred.transports
      }));

      // Step 2: Trigger native device biometric prompt (Touch ID / Windows Hello / Fingerprint sensor)
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challengeBuffer,
          rpId: optData.publicKey.rpId,
          allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
          userVerification: 'required',
          timeout: 60000
        }
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Biometric prompt was cancelled.');
      }

      // Encode credential ID back
      const rawId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Step 3: Verify with server
      const verifyRes = await fetch('/api/auth/webauthn/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: optData.challengeId,
          credentialId: rawId
        })
      });

      const verifyText = await verifyRes.text();
      let verifyData: any = {};
      try {
        verifyData = JSON.parse(verifyText);
      } catch {
        throw new Error(verifyText || `Server returned error (${verifyRes.status})`);
      }

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Fingerprint verification failed');
      }

      onSuccess(verifyData.token, verifyData.email, verifyData.alias);
    } catch (err: any) {
      console.error('Biometric authentication error:', err);
      setError(err.message || 'Fingerprint verification was declined or timed out.');
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand identity header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-600 text-white font-black text-2xl shadow-lg shadow-orange-600/30 mb-4">
            K
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Authentication
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access protected gateway: <span className="font-mono text-orange-600 font-semibold">/{currentAlias}</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/60 p-7 sm:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Biometric 1-Click Fingerprint Passkey Section */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleFingerprintLogin}
              disabled={biometricLoading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.99] text-white p-4 rounded-xl font-semibold shadow-md shadow-orange-600/25 transition-all flex items-center justify-center gap-3 border border-orange-400/30"
            >
              {biometricLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Scan Fingerprint on Device...</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                    <Fingerprint className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      Sign in with Fingerprint Passkey
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    </div>
                    <div className="text-[11px] text-orange-100 font-normal">
                      Instant biometric Touch ID / FIDO2 authentication
                    </div>
                  </div>
                </>
              )}
            </button>
            <div className="text-[11px] text-center text-slate-400 mt-2">
              Note: Enroll your device in the Security tab after initial login to enable instant 1-click biometric sign-in.
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or continue with password
              </span>
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="developer995500@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Admin Password
                </label>
                <span className="text-[11px] text-slate-400">Default: admin</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick info credentials badge */}
          <div className="mt-6 p-3 bg-orange-50/70 border border-orange-200/80 rounded-xl text-[12px] text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Initial Admin Credentials Loaded</span>
            </div>
            <span className="font-mono text-xs font-bold text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200">
              dev:admin
            </span>
          </div>
        </div>

        {/* Back to Marketplace */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onGoHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Return to Kroma Marketplace Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
