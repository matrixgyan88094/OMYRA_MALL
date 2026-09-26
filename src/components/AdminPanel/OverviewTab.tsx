import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp, Sparkles, Fingerprint, Mail, Database, ArrowRight } from 'lucide-react';

interface OverviewTabProps {
  token: string;
  onNavigateTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ token, onNavigateTab }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    aov: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch('/api/products?all=true'),
        fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const products = prodRes.ok ? await prodRes.json() : [];
      const orders = ordRes.ok ? await ordRes.json() : [];

      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (parseFloat(o.total) || 0), 0);
      const totalOrders = orders.length;
      const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const activeProducts = products.filter((p: any) => p.status === 'published').length;

      setStats({
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        activeProducts,
        aov: Math.round(aov * 100) / 100
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (e) {
      console.error('Failed to load overview metrics', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-md shadow-orange-600/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Single-Vendor Command Center
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">Kroma Studio Executive Overview</h2>
          <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-xl">
            Live database telemetry, real digital downloads, and transactional customer communications.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-orange-50 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            + Add Digital Asset
          </button>
          <button
            onClick={() => onNavigateTab('security')}
            className="px-4 py-2.5 bg-orange-700/80 hover:bg-orange-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Fingerprint className="w-3.5 h-3.5" /> Passkeys
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Real database gross receipts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Orders Processed</span>
            <ShoppingBag className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.totalOrders}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified commercial checkouts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <Package className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.activeProducts}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Published storefront assets</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ${stats.aov.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Per transaction average value</div>
        </div>
      </div>

      {/* Quick Setup Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('security')}
          className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-sm cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-105 transition-transform">
            <Fingerprint className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            <span>Fingerprint Passkey</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Enroll Touch ID or biometric sensors for instant 1-click admin logins.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('resend')}
          className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-sm cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            <span>Resend Email Provider</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Configure your Resend API key directly in UI for real customer order receipts.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('settings')}
          className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-sm cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-105 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            <span>Neon DB & URL Alias</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Inspect Neon PostgreSQL diagnostics and customize your administrative gateway slug.
          </p>
        </div>
      </div>

      {/* Recent Orders Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Transactions</h3>
            <p className="text-xs text-slate-500">Live order confirmations and licenses issued</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700"
          >
            View All Orders →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No orders processed yet. Try placing a checkout in the marketplace!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{ord.order_number}</div>
                  <div className="text-[11px] text-slate-500">{ord.customer_email}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">${ord.total}</div>
                  <div className="font-mono text-[10px] text-orange-600">{ord.license_key}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
