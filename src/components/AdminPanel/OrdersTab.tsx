import React, { useState, useEffect } from 'react';
import { ShoppingBag, Key, Mail, CheckCircle2, AlertCircle, RefreshCw, Send, Loader2, Copy, Check } from 'lucide-react';

interface OrderItem {
  id: string;
  order_number: string;
  customer_email: string;
  total: number;
  subtotal: number;
  discount: number;
  license_key: string;
  items: Array<{
    productId: string;
    productTitle: string;
    price: number;
    licenseType: string;
  }>;
  created_at: string;
  email_sent: boolean;
  resend_id?: string;
}

interface OrdersTabProps {
  token: string;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ token }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (orderId: string) => {
    setResendingId(orderId);
    setNotice(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/resend-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch email via Resend');

      setNotice({
        type: 'success',
        message: `Order license re-sent successfully via Resend (ID: ${data.resendId})`
      });
      fetchOrders();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setResendingId(null);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Orders & Commercial Licenses</h2>
          <p className="text-sm text-slate-500 mt-1">
            Track real customer transactions, issued license keys, and transactional email dispatch.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors self-start"
          title="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {notice && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
            notice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="leading-relaxed">{notice.message}</div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading verified order stream...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No orders recorded yet</div>
            <p className="text-xs text-slate-400 mt-1">Completed marketplace checkouts will appear here instantly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order / Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">License Key</th>
                  <th className="py-3 px-4">Email Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{o.order_number}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(o.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{o.customer_email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[11px] text-slate-700 font-medium">
                        {o.items?.map((it) => it.productTitle).join(', ') || 'Digital Asset'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${o.total}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 px-2 py-1 rounded border border-slate-200 w-fit">
                        <span>{o.license_key}</span>
                        <button
                          onClick={() => handleCopyKey(o.license_key)}
                          className="text-slate-400 hover:text-slate-700 ml-1"
                          title="Copy license key"
                        >
                          {copiedKey === o.license_key ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {o.email_sent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Dispatched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-2.5 h-2.5" /> Pending Resend
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleResendEmail(o.id)}
                        disabled={resendingId === o.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] rounded-lg shadow-sm transition-all"
                        title="Resend receipt and license key to customer via Resend"
                      >
                        {resendingId === o.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3 text-orange-600" />
                        )}
                        <span>Resend Email</span>
                      </button>
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
