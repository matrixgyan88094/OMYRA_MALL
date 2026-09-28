import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Tag,
  DollarSign,
  Layers,
  Box
} from 'lucide-react';
import { ProductStudioView, ProductStudioData } from './ProductStudioView';

interface ProductsTabProps {
  token: string;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ token }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'studio'>('list');
  const [editingProduct, setEditingProduct] = useState<ProductStudioData | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products?all=true');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || '',
      short_description: p.short_description || p.subtitle || '',
      description: p.description || '',
      category: p.category || 'Dev Kits',
      price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 49,
      sale_price: p.sale_price !== undefined && p.sale_price !== null ? parseFloat(p.sale_price) : undefined,
      sku: p.sku || '',
      version: p.version || '1.0.0',
      tools: Array.isArray(p.tools) ? p.tools : [],
      formats: Array.isArray(p.formats) ? p.formats : ['.zip'],
      tags: Array.isArray(p.tags) ? p.tags : [],
      features: Array.isArray(p.features) ? p.features : [],
      thumbnail: p.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg',
      gallery: Array.isArray(p.gallery) ? p.gallery : [p.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg'],
      file_url: p.file_url || '',
      file_size: p.file_size || '',
      security_scan: p.security_scan || null,
      status: p.status || 'published'
    });
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this digital product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setNotice({ type: 'success', message: 'Product successfully removed from catalog.' });
      }
    } catch (e) {
      console.error('Failed to delete product', e);
      setNotice({ type: 'error', message: 'Failed to delete product.' });
    }
  };

  const handleProductSaved = (saved: ProductStudioData) => {
    setNotice({
      type: 'success',
      message: editingProduct
        ? `Product "${saved.title}" updated successfully.`
        : `Product "${saved.title}" published to catalog.`
    });
    setViewMode('list');
    setEditingProduct(null);
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = async (p: any) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...p, status: newStatus })
      });
      if (res.ok) {
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, status: newStatus } : item));
        setNotice({ type: 'success', message: `Product status changed to ${newStatus}.` });
      }
    } catch (e) {
      console.error('Failed to toggle status', e);
    }
  };

  // If in studio view, render the in-page Studio View (NO POPUP / NO MODAL)
  if (viewMode === 'studio') {
    return (
      <ProductStudioView
        token={token}
        initialProduct={editingProduct}
        onBack={() => {
          setViewMode('list');
          setEditingProduct(null);
        }}
        onSaved={handleProductSaved}
      />
    );
  }

  // Otherwise, render catalog list table
  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-bold opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products & Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your digital goods catalog, Cloudflare R2 archive packages, and pricing tiers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-orange-600/20 transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Digital Asset</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Products</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block tabular-nums">{products.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Live</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block tabular-nums">
            {products.filter(p => p.status === 'published' || !p.status).length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Drafts / Staging</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block tabular-nums">
            {products.filter(p => p.status === 'draft').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Protected Files</span>
          <span className="text-2xl font-black text-orange-600 mt-1 block tabular-nums">
            {products.filter(p => p.file_url).length}
          </span>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Catalog Inventory</span>
          <span className="text-xs text-slate-400 font-mono">{products.length} Items</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs">No digital products registered yet.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-orange-700"
            >
              Add First Asset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {products.map((p) => {
                  const isPublished = p.status === 'published' || !p.status;
                  const thumb = p.thumbnail || p.cover_image || '/src/assets/images/hero_white_orange_1790435384152.jpg';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">{p.title}</span>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              {p.sku || p.id} • v{p.version || '1.0.0'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px]">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ${p.price}
                        {p.sale_price && (
                          <span className="text-[10px] text-emerald-600 block font-normal">
                            Sale: ${p.sale_price}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {p.file_url ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{p.file_size || 'Attached'}</span>
                          </span>
                        ) : (
                          <span className="text-amber-500">No ZIP</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50/50 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
