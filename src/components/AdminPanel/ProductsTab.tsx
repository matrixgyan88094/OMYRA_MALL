import React, { useState, useEffect, useRef } from 'react';
import { Package, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, DollarSign, Tag, ExternalLink, UploadCloud, Lock, Cloud } from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  price: number;
  formats: string[];
  tags: string[];
  features: string[];
  thumbnail: string;
  rating: number;
  reviews_count: number;
  sales_count: number;
  status: 'published' | 'draft';
  file_url?: string;
  created_at: string;
}

interface ProductsTabProps {
  token: string;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ token }) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('UI & Figma');
  const [price, setPrice] = useState('49');
  const [formats, setFormats] = useState('.fig, .json');
  const [tags, setTags] = useState('Figma, Design');
  const [fileUrl, setFileUrl] = useState('https://downloads.kroma.studio/releases/package.zip');
  const [thumbnail, setThumbnail] = useState('/src/assets/images/hero_white_orange_1790435384152.jpg');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // R2 Direct Upload states
  const [uploadingR2Thumb, setUploadingR2Thumb] = useState(false);
  const [uploadingR2Zip, setUploadingR2Zip] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const handleR2ThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingR2Thumb(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'admin_primary');
    formData.append('folderType', 'thumbnails');

    try {
      const res = await fetch('/api/admin/r2/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Thumbnail upload failed');
      if (data.publicUrl) {
        setThumbnail(data.publicUrl);
      } else {
        setThumbnail(`r2://${data.key}`);
      }
      setNotice({ type: 'success', message: `Thumbnail stored in Cloudflare R2: ${data.key}` });
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setUploadingR2Thumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = '';
    }
  };

  const handleR2ZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingR2Zip(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'admin_primary');
    formData.append('folderType', 'secure-products');

    try {
      const res = await fetch('/api/admin/r2/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Zip upload failed');
      setFileUrl(`r2://${data.key}`);
      setNotice({ type: 'success', message: `Protected package stored in Cloudflare R2: ${data.key}` });
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setUploadingR2Zip(false);
      if (zipInputRef.current) zipInputRef.current.value = '';
    }
  };

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
    setTitle('');
    setSubtitle('');
    setDescription('');
    setCategory('UI & Figma');
    setPrice('49');
    setFormats('.fig, .json');
    setTags('Design, UI Kit');
    setFileUrl('https://downloads.kroma.studio/releases/package.zip');
    setThumbnail('/src/assets/images/hero_white_orange_1790435384152.jpg');
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSubtitle(p.subtitle || '');
    setDescription(p.description || '');
    setCategory(p.category);
    setPrice(String(p.price));
    setFormats(Array.isArray(p.formats) ? p.formats.join(', ') : '');
    setTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
    setFileUrl(p.file_url || '');
    setThumbnail(p.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg');
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    const payload = {
      title,
      subtitle,
      description,
      category,
      price: parseFloat(price) || 0,
      formats: formats.split(',').map(s => s.trim()).filter(Boolean),
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      file_url: fileUrl,
      thumbnail,
      status
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      setNotice({
        type: 'success',
        message: editingProduct ? 'Product updated successfully!' : 'New product created and deployed to catalog!'
      });
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
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
      }
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Products & Digital Inventory</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and publish digital engineering assets, design systems, and code boilerplates.
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

      {/* Products Table Card */}
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
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Sales</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{p.title}</div>
                          <div className="text-[11px] text-slate-500 max-w-xs truncate">{p.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${p.price}
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
                        title="Edit product"
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingProduct ? 'Edit Digital Asset' : 'Add New Digital Asset'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 Fullstack SaaS Starter"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Value Tagline</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Ship production apps in days with TypeScript and Neon DB"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900"
                  >
                    <option value="UI & Figma">UI & Figma</option>
                    <option value="Dev Kits">Dev Kits</option>
                    <option value="3D & Spatial">3D & Spatial</option>
                    <option value="Motion & Audio">Motion & Audio</option>
                    <option value="Templates">Templates</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of features, stack, and licenses..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Formats (comma separated)</label>
                  <input
                    type="text"
                    value={formats}
                    onChange={(e) => setFormats(e.target.value)}
                    placeholder=".fig, .tsx, .blend"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="React, Next.js, Design"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Product Cover Thumbnail */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Product Thumbnail (Cover Art)</label>
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    disabled={uploadingR2Thumb}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadingR2Thumb ? 'Uploading...' : 'Upload to R2 (Thumbnails)'}</span>
                  </button>
                  <input
                    type="file"
                    ref={thumbInputRef}
                    onChange={handleR2ThumbUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://assets.omyra.org/admin_primary/public/thumbnails/cover.webp"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 font-mono text-[11px]"
                />
              </div>

              {/* Digital Package Download URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Digital Package Download (ZIP / Release)</label>
                  <button
                    type="button"
                    onClick={() => zipInputRef.current?.click()}
                    disabled={uploadingR2Zip}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{uploadingR2Zip ? 'Uploading to R2...' : 'Upload Protected ZIP to R2'}</span>
                  </button>
                  <input
                    type="file"
                    ref={zipInputRef}
                    onChange={handleR2ZipUpload}
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="r2://admin_primary/private/secure-products/starter_v2.zip or https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Files with <code className="text-slate-600 font-bold">r2://</code> prefix are stored in <code className="text-slate-600">private/secure-products/</code> with zero public direct access. Download requires short-lived SigV4 signed authorization.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'published'}
                      onChange={() => setStatus('published')}
                    />
                    <span>Published (Visible on storefront)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                    />
                    <span>Draft</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
