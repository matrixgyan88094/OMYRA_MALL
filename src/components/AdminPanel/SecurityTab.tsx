import React, { useState, useEffect } from 'react';
import { Fingerprint, KeyRound, Mail, ShieldAlert, CheckCircle2, Trash2, Smartphone, Laptop, AlertCircle, Loader2, Plus, Sparkles } from 'lucide-react';

interface PasskeyItem {
  id: string;
  credential_id: string;
  name: string;
  created_at: string;
}

interface SecurityTabProps {
  token: string;
  adminEmail: string;
  onEmailUpdated: (newEmail: string) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ token, adminEmail, onEmailUpdated }) => {
  // Passkey enrollment state
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);
  const [loadingPasskeys, setLoadingPasskeys] = useState(true);
  const [enrollingPasskey, setEnrollingPasskey] = useState(false);
  const [passkeyDeviceName, setPasskeyDeviceName] = useState('');
  const [passkeyNotice, setPasskeyNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Credentials change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState(adminEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingCredentials, setUpdatingCredentials] = useState(false);
  const [credentialsNotice, setCredentialsNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchPasskeys();
  }, []);

  const fetchPasskeys = async () => {
    try {
      const res = await fetch('/api/admin/passkeys', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPasskeys(data);
      }
    } catch (e) {
      console.error('Failed to load passkeys', e);
    } finally {
      setLoadingPasskeys(false);
    }
  };

  // Register Fingerprint / Touch ID Passkey
  const handleRegisterPasskey = async () => {
    if (!window.PublicKeyCredential) {
      setPasskeyNotice({ type: 'error', message: 'WebAuthn biometric credentials not supported in this browser environment.' });
      return;
    }

    setEnrollingPasskey(true);
    setPasskeyNotice(null);

    try {
      // 1. Get challenge from server
      const optRes = await fetch('/api/auth/webauthn/register-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const optData = await optRes.json();
      if (!optRes.ok) {
        throw new Error(optData.error || 'Failed to start passkey registration challenge');
      }

      // Convert challenge base64url to Uint8Array
      const challengeBuffer = Uint8Array.from(atob(optData.publicKey.challenge.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
      const userIdBuffer = Uint8Array.from(atob(optData.publicKey.user.id.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

      // 2. Call navigator.credentials.create() to trigger device fingerprint sensor
      const credential = await navigator.credentials.create({
        publicKey: {
          ...optData.publicKey,
          challenge: challengeBuffer,
          user: {
            ...optData.publicKey.user,
            id: userIdBuffer
          }
        }
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Biometric registration was cancelled.');
      }

      // Encode credential ID
      const rawId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // 3. Send back to server to store in Neon DB / persistent store
      const verifyRes = await fetch('/api/auth/webauthn/register-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          challengeId: optData.challengeId,
          credentialId: rawId,
          deviceName: passkeyDeviceName.trim() || 'MacBook Touch ID / Device Fingerprint Sensor'
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Failed to verify passkey registration');
      }

      setPasskeyNotice({
        type: 'success',
        message: 'Fingerprint Passkey registered! You can now log into the admin panel with 1-click biometric authentication.'
      });
      setPasskeyDeviceName('');
      await fetchPasskeys();
    } catch (err: any) {
      console.error('Biometric passkey enrollment error:', err);
      setPasskeyNotice({
        type: 'error',
        message: err.message || 'Passkey enrollment was cancelled or failed.'
      });
    } finally {
      setEnrollingPasskey(false);
    }
  };

  const handleDeletePasskey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this fingerprint passkey?')) return;
    try {
      const res = await fetch(`/api/admin/passkeys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPasskeys(prev => prev.filter(p => p.id !== id));
        setPasskeyNotice({ type: 'success', message: 'Passkey revoked successfully.' });
      }
    } catch (e) {
      setPasskeyNotice({ type: 'error', message: 'Failed to delete passkey.' });
    }
  };

  // Update Admin Email & Password
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsNotice(null);

    if (newPassword && newPassword !== confirmPassword) {
      setCredentialsNotice({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setUpdatingCredentials(true);

    try {
      const res = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newEmail: newEmail !== adminEmail ? newEmail : undefined,
          newPassword: newPassword ? newPassword : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update credentials.');
      }

      setCredentialsNotice({ type: 'success', message: 'Admin security credentials updated successfully!' });
      if (newEmail !== adminEmail) {
        onEmailUpdated(newEmail);
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setCredentialsNotice({ type: 'error', message: err.message });
    } finally {
      setUpdatingCredentials(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Security & Passkey Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage hardware biometric passkeys (Touch ID, Windows Hello, Android fingerprint) and master credentials.
        </p>
      </div>

      {/* 1. Fingerprint Passkey Enrollment Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Fingerprint className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Fingerprint & Biometric Passkeys</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3" /> FIDO2 WebAuthn Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Log into the admin panel with a single touch using your device's built-in fingerprint reader. No password typing required.
              </p>
            </div>
          </div>

          <button
            onClick={handleRegisterPasskey}
            disabled={enrollingPasskey}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            {enrollingPasskey ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Touch Fingerprint Sensor...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Register Fingerprint Passkey</span>
              </>
            )}
          </button>
        </div>

        {passkeyNotice && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              passkeyNotice.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {passkeyNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">{passkeyNotice.message}</div>
          </div>
        )}

        {/* Registered Devices List */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Enrolled Biometric Devices ({passkeys.length})
          </h4>

          {loadingPasskeys ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading registered passkeys...</div>
          ) : passkeys.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
              <Fingerprint className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-700">No fingerprint passkey registered yet</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Click "Register Fingerprint Passkey" above to activate 1-click biometric login on this device.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {passkeys.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-orange-600">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Enrolled: {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePasskey(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Revoke passkey"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Admin Credentials Manager */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Change Admin Email & Password</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Update the master login email address or replace the initial password. Requires your current password to authorize changes.
            </p>
          </div>
        </div>

        {credentialsNotice && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              credentialsNotice.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {credentialsNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">{credentialsNotice.message}</div>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Login Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Current Password (Authorization) *
            </label>
            <input
              type="password"
              placeholder="Enter current password (default: admin)"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full sm:w-80 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={updatingCredentials}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            {updatingCredentials ? 'Verifying & Saving...' : 'Save Security Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
};
