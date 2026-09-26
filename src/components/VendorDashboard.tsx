import React, { useState } from 'react';
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  Tag,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DigitalProduct, Coupon } from '../types';

export const VendorDashboard: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    getVendorAnalytics,
    addProduct,
    updateProduct,
    deleteProduct,
    addCoupon,
    toggleCouponStatus,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'coupons' | 'orders'>('analytics');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState<DigitalProduct['category']>('UI & Figma');
  const [newFormat, setNewFormat] = useState<DigitalProduct['format']>('.fig');
  const [newBasePrice, setNewBasePrice] = useState('49');
  const [newSalePrice, setNewSalePrice] = useState('');
  const [newFileSize, setNewFileSize] = useState('65 MB');
  const [newDescription, setNewDescription] = useState('');

  // Add Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState('20');
  const [newCouponMax, setNewCouponMax] = useState('100');

  const stats = getVendorAnalytics();

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const basePrice = parseFloat(newBasePrice) || 49;
    const salePrice = newSalePrice ? parseFloat(newSalePrice) : undefined;

    addProduct({
      title: newTitle.trim(),
      tagline: newTagline.trim() || 'High-caliber digital asset designed by Marc Vance',
      description: newDescription.trim() || 'Engineered with meticulous auto-layout tokens and scalable components.',
      category: newCategory,
      format: newFormat,
      basePrice,
      salePrice,
      fileSize: newFileSize.trim() || '50 MB',
      version: '1.0.0',
    });

    // Reset form
    setNewTitle('');
    setNewTagline('');
    setNewDescription('');
    setNewBasePrice('49');
    setNewSalePrice('');
    setIsAddModalOpen(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const val = parseFloat(newCouponVal) || 20;
    const max = parseInt(newCouponMax) || 100;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: val,
      minSpend: 0,
      maxUses: max,
      usedCount: 0,
      active: true,
    });

    setNewCouponCode('');
    setNewCouponVal('20');
    setIsCouponModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            Studio Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950">
            Creator Studio & Operations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Real-time telemetry, product catalog, promo codes, and customer transaction logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors shadow-sm min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            <span>New Asset</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto">
        {(['analytics', 'products', 'coupons', 'orders'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: Real-time Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Gross Revenue
                </span>
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500">
                100% Direct single-vendor revenue
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Total Orders
                </span>
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
                {stats.totalOrders.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500">
                Verified customer checkouts
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Average Order Value
                </span>
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
                ${stats.averageOrderValue}
              </div>
              <div className="text-[11px] text-zinc-500">
                Across all active license tiers
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Active Catalog
                </span>
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
                {products.length}
              </div>
              <div className="text-[11px] text-zinc-500">
                Maintained production packages
              </div>
            </div>
          </div>

          {/* Top Selling Products Breakdown */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-semibold text-zinc-950">
              Top Performing Digital Products
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 font-semibold uppercase">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Units Sold</th>
                    <th className="pb-3 text-right">Base Price</th>
                    <th className="pb-3 text-right">Total Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[...products]
                    .sort((a, b) => b.salesCount - a.salesCount)
                    .slice(0, 5)
                    .map((p) => {
                      const price = p.salePrice ?? p.basePrice;
                      return (
                        <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-3.5 font-medium text-zinc-950">{p.title}</td>
                          <td className="py-3.5 text-zinc-500">{p.category}</td>
                          <td className="py-3.5 text-right font-mono font-medium text-zinc-900">
                            {p.salesCount.toLocaleString()}
                          </td>
                          <td className="py-3.5 text-right font-mono text-zinc-700">${price}</td>
                          <td className="py-3.5 text-right font-mono font-bold text-zinc-950">
                            ${(p.salesCount * price).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Product Inventory Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              All Catalog Items ({products.length})
            </span>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Sales</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-zinc-950">{prod.title}</div>
                        <div className="text-[11px] text-zinc-500">{prod.category}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-zinc-600">{prod.format}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() =>
                            updateProduct(prod.id, {
                              status: prod.status === 'published' ? 'draft' : 'published',
                            })
                          }
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                            prod.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                        >
                          {prod.status === 'published' ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-zinc-900 font-medium">
                        ${prod.salePrice ?? prod.basePrice}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-zinc-600">
                        {prod.salesCount}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                          title="Delete item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Coupon & Discount Engine */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Active Promo Codes ({coupons.length})
            </span>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Promo Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-orange-600" />
                    <span className="font-mono font-bold text-sm text-zinc-950">
                      {c.code}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleCouponStatus(c.code)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      c.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                    }`}
                  >
                    {c.active ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="text-xl font-bold text-zinc-950">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                  <span>Used: {c.usedCount} {c.maxUses ? `/ ${c.maxUses}` : ''}</span>
                  <span>{c.minSpend ? `Min: $${c.minSpend}` : 'No minimum'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Order Ledger */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-zinc-500">
            Completed Orders Ledger ({orders.length})
          </span>

          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-semibold text-zinc-950">
                        {ord.orderNumber}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-zinc-900">{ord.customerName}</div>
                        <div className="text-[11px] text-zinc-500">{ord.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-600">{ord.date}</td>
                      <td className="px-4 py-3.5 text-zinc-600 capitalize">
                        {ord.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-zinc-950">
                        ${ord.total}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="text-base font-bold text-zinc-950">Publish New Digital Asset</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Apex 3D Icon Toolkit"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="1-sentence value hook"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="UI & Figma">UI & Figma</option>
                    <option value="Dev Kits">Dev Kits</option>
                    <option value="3D & Spatial">3D & Spatial</option>
                    <option value="Motion & Audio">Motion & Audio</option>
                    <option value="Templates">Templates</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                  >
                    <option value=".fig">.fig (Figma)</option>
                    <option value=".tsx">.tsx (React/Next)</option>
                    <option value=".blend">.blend (3D Blender)</option>
                    <option value=".lottie">.lottie (Animation)</option>
                    <option value=".mp3">.mp3 (Audio)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Sale Price ($)</label>
                  <input
                    type="number"
                    value={newSalePrice}
                    onChange={(e) => setNewSalePrice(e.target.value)}
                    placeholder="Optional discount"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 shadow-sm"
                >
                  Publish Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Coupon */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="text-base font-bold text-zinc-950">Create Promo Code</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH30"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs uppercase text-zinc-900 focus:border-orange-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Discount</label>
                  <input
                    type="number"
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 shadow-sm"
                >
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
