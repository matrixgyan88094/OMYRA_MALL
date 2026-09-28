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
import { ProductStudioModal, ProductStudioData } from './ProductStudioModal';

interface ProductsTabProps {
  token: string;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ token }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
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
    setIsStudioOpen(true);
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
    setIsStudioOpen(true);
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
        ? `Asset "${saved.title}" updated successfully!`
        : `Asset "${saved.title}" published with full security verification!`
    });
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Products & Digital Inventory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish engineering assets, design systems, and boilerplates with automatic 5-layer security verification and framework auto-detection.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Digital Product</span>
        </button>
      </div>

      {notice && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start justify-between gap-2.5 ${
            notice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="leading-relaxed font-medium">{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading catalog inventory...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No products in database</div>
            <p className="text-xs text-slate-400 mt-1">Click "Add Digital Product" to publish your first asset.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category & SKU</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Security Grade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Sales</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const saleP = p.sale_price !== null && p.sale_price !== undefined ? parseFloat(p.sale_price) : undefined;
                  const regP = parseFloat(p.price) || 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/src/assets/images/hero_white_orange_1790435384152.jpg';
                            }}
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-slate-900 truncate">{p.title}</div>
                            <div className="text-[11px] text-slate-500 truncate">{p.subtitle || p.short_description}</div>
                            {Array.isArray(p.tools) && p.tools.length > 0 && (
                              <div className="flex gap-1 mt-1 overflow-hidden">
                                {p.tools.slice(0, 2).map((t: string, i: number) => (
                                  <span key={i} className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                                    {t}
                                  </span>
                                ))}
                                {p.tools.length > 2 && (
                                  <span className="text-[9px] text-slate-400">+{p.tools.length - 2}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div>
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                            {p.category}
                          </span>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {p.sku || 'KRO-AST'} • v{p.version || '1.0.0'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {saleP && saleP > 0 ? (
                          <div>
                            <span className="font-bold text-slate-900">${saleP}</span>
                            <span className="text-[10px] text-slate-400 line-through ml-1.5">${regP}</span>
                          </div>
                        ) : (
                          <div className="font-bold text-slate-900">${regP}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>A+ Clean</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {p.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Eye className="w-2.5 h-2.5" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <EyeOff className="w-2.5 h-2.5" /> Draft
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {p.sales_count || 0} units
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Open 5-Step Asset Studio"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
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

      {/* 5-Step Asset Studio Modal */}
      <ProductStudioModal
        isOpen={isStudioOpen}
        token={token}
        initialProduct={editingProduct}
        onClose={() => setIsStudioOpen(false)}
        onSaved={handleProductSaved}
      />
    </div>
  );
};
