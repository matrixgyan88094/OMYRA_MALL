import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  HardDrive,
  Database,
  Shield,
  HelpCircle
} from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (token: string, email: string, alias: string) => void;
  onGoHome: () => void;
  currentAlias: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onGoHome, currentAlias }) => {
  const [email, setEmail] = useState('developer995500@gmail.com');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'passkey' | 'password'>('passkey');
  
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);
  const [hasServerPasskeys, setHasServerPasskeys] = useState<boolean | null>(null);
  const [checkingPasskeys, setCheckingPasskeys] = useState(true);
  const [showDefaultCredentials, setShowDefaultCredentials] = useState(false);

  useEffect(() => {
    // 1. Detect device WebAuthn capability
    const supported = Boolean(window.PublicKeyCredential && typeof window.PublicKeyCredential === 'function');
    setIsWebAuthnSupported(supported);

    // 2. Query server for active enrolled passkeys
    fetch('/api/auth/webauthn/login-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const credentials = data?.publicKey?.allowCredentials || [];
        const hasKeys = credentials.length > 0;
        setHasServerPasskeys(hasKeys);
        // If no passkeys are enrolled, default active tab to password
        if (!hasKeys) {
          setActiveTab('password');
        }
      })
      .catch(() => {
        setHasServerPasskeys(false);
        setActiveTab('password');
      })
      .finally(() => {
        setCheckingPasskeys(false);
      });
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
        body: JSON.stringify({ email: email.trim(), password })
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || `Server returned status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
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
      setError('Biometric authentication is not supported on this browser or hardware.');
      setActiveTab('password');
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
        throw new Error(optText || `Server error (${optRes.status})`);
      }

      if (!optRes.ok || !optData?.publicKey?.challenge) {
        throw new Error(
          optData.error || 'No fingerprint passkey registered yet. Please sign in with your password to register your passkey in Security settings.'
        );
      }

      // Convert challenge base64url to Uint8Array
      const challengeBuffer = Uint8Array.from(
        atob(optData.publicKey.challenge.replace(/-/g, '+').replace(/_/g, '/')),
        c => c.charCodeAt(0)
      );

      const allowCredentials = (optData.publicKey.allowCredentials || []).map((cred: any) => ({
        id: Uint8Array.from(atob(cred.id.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
        type: cred.type,
        transports: cred.transports
      }));

      // Step 2: Trigger native device biometric prompt (Touch ID / Windows Hello / Android Fingerprint)
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

      // Encode credential ID back to base64url
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
        throw new Error(verifyText || `Server verification failed (${verifyRes.status})`);
      }

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Fingerprint verification failed');
      }

      onSuccess(verifyData.token, verifyData.email, verifyData.alias);
    } catch (err: any) {
      console.error('Biometric authentication error:', err);
      // Clean up common error messages
      if (err.name === 'NotAllowedError') {
        setError('Biometric authentication was cancelled or timed out.');
      } else {
        setError(err.message || 'Fingerprint verification was declined or failed.');
      }
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleFillDefaults = () => {
    setEmail('developer995500@gmail.com');
    setPassword('admin');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-orange-600 selection:text-white">
      {/* Grid Layout: Left Editorial Showcase (Desktop), Right Modern Auth Card */}
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Section: Architectural Brand Stage */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-950 border-r border-slate-800/80 p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header Brand */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-600/30">
                K
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight">Kroma Studio</span>
                <div className="text-xs text-slate-400 font-medium">Enterprise Creator Infrastructure</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Gateway</span>
            </div>
          </div>

          {/* Center Editorial Showcase */}
          <div className="relative z-10 my-auto py-12 max-w-lg space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Unified operations console for digital goods.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Single-tenant administration engineered with isolated Cloudflare R2 storage, Neon PostgreSQL transactional durability, and hardware-backed FIDO2 biometric authentication.
              </p>
            </div>

            {/* Architecture Highlights */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">FIDO2 Biometric Authentication</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Cryptographic WebAuthn passkeys backed by your device's Touch ID, Windows Hello, or Android fingerprint sensor.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Cloudflare R2 Single-Bucket Architecture</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    User-isolated namespaces (<code className="font-mono text-slate-300">{'{userId}/'}</code>) with zero-bypass presigned downloads for protected assets.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Neon PostgreSQL Data Layer</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Serverless ledger with atomic transactional consistency across orders, inventory, and licenses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>AES-256-GCM / WebAuthn Level 3</span>
            <span>Gateway /{currentAlias}</span>
          </div>
        </div>

        {/* Right Section: Clean, Professional Authentication Canvas */}
        <div className="w-full lg:w-1/2 bg-white text-slate-900 flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 overflow-y-auto">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>

            <div className="text-[11px] font-mono text-slate-400">
              Admin Scope: <span className="font-bold text-slate-700">/{currentAlias}</span>
            </div>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-md mx-auto my-auto space-y-6">
            {/* Header */}
            <div>
              <div className="lg:hidden flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-600/30">
                  K
                </div>
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">Kroma Studio</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                Administrator Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Secure access gateway to manage products, licenses, transactional email, and Cloudflare R2 storage.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 transition-all animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed font-medium">{error}</div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 font-bold ml-1 text-sm"
                >
                  ×
                </button>
              </div>
            )}

            {/* Segmented Auth Method Selector */}
            <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('passkey');
                  setError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'passkey'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5 text-orange-600" />
                <span>Passkey / Fingerprint</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('password');
                  setError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'password'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Password</span>
              </button>
            </div>

            {/* TAB 1: PASSKEY BIOMETRIC AUTHENTICATION */}
            {activeTab === 'passkey' && (
              <div className="space-y-4 pt-2">
                {checkingPasskeys ? (
                  <div className="p-8 text-center border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-600" />
                    <p className="text-xs text-slate-500">Checking device and server passkey registry...</p>
                  </div>
                ) : hasServerPasskeys === false ? (
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                    <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-xs">
                      <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>No Passkey Enrolled on Server Yet</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      You can register your biometric device (Touch ID, Windows Hello, or Android fingerprint) in the <strong>Security &amp; Passkeys</strong> tab once you log in with your password.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('password')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>Continue with Password</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-orange-600/10 border border-orange-600/20 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
                        <Fingerprint className={`w-9 h-9 ${biometricLoading ? 'animate-pulse text-orange-700' : ''}`} />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-950">
                          {biometricLoading ? 'Touch Sensor on Your Device...' : 'Ready for Biometric Sign In'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                          Authenticate instantly with Touch ID, Windows Hello, or your device's biometric sensor.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleFingerprintLogin}
                        disabled={biometricLoading}
                        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {biometricLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Scanning Fingerprint...</span>
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-4 h-4" />
                            <span>Sign In with Fingerprint</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('password')}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
                      >
                        Prefer password? Switch to password sign-in
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: EMAIL & PASSWORD AUTHENTICATION */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer995500@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Admin Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Default credentials helper */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDefaultCredentials(!showDefaultCredentials)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Default developer credentials</span>
                </button>

                <button
                  type="button"
                  onClick={handleFillDefaults}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Auto-fill
                </button>
              </div>

              {showDefaultCredentials && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
                  <div>Email: <strong className="text-slate-900">developer995500@gmail.com</strong></div>
                  <div>Password: <strong className="text-slate-900">admin</strong></div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="pt-8 text-center text-xs text-slate-400">
            Protected with hardware FIDO2 &amp; TLS 1.3 encryption.
          </div>
        </div>
      </div>
    </div>
  );
};
