import React, { useState } from 'react';
import { PlusCircle, TrendingUp, Coins, Users, Layers, Upload, Plus, Trash2, Check, Sparkles, AlertCircle, ShoppingBag, DollarSign } from 'lucide-react';
import { Product } from '../types';

interface CreatorDashboardProps {
  products: Product[];
  onPublishProduct: (product: Omit<Product, 'id' | 'createdAt' | 'downloads' | 'reviews' | 'rating' | 'reviewCount'>) => void;
}

export default function CreatorDashboard({
  products,
  onPublishProduct
}: CreatorDashboardProps) {
  // Form states
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'templates' | 'ebooks' | 'design' | 'code' | 'audio'>('templates');
  const [price, setPrice] = useState('19.00');
  const [tags, setTags] = useState('');
  const [features, setFeatures] = useState('');
  const [filesIncluded, setFilesIncluded] = useState('');
  const [fileSize, setFileSize] = useState('15.4 MB');
  const [coverGradient, setCoverGradient] = useState('linear-gradient(135deg, #f59e0b 0%, #d97706 100%)');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Preset covers for creators to choose from
  const PRESET_GRADIENTS = [
    { name: 'Sunset Aura', value: 'linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)' },
    { name: 'Cosmic Violet', value: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' },
    { name: 'Cyberpunk Neon', value: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' },
    { name: 'Emerald Forest', value: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { name: 'Deep Ocean Blue', value: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' },
    { name: 'Gold Radiant', value: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  ];

  // Creator specific products (simulating that the active user is 'DesignAura Labs')
  const creatorProducts = products.filter(p => p.creator.name === 'DesignAura Labs' || p.creator.name === 'You (Creator)');

  // Compute stats based on listed products
  const totalListed = creatorProducts.length;
  const totalSalesCount = creatorProducts.reduce((acc, p) => acc + p.creator.salesCount, 0);
  const totalEarnings = creatorProducts.reduce((acc, p) => acc + (p.creator.salesCount * p.price), 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim() || !tagline.trim() || !description.trim()) {
      setErrorMsg('Please fill in required fields (Title, Tagline, Description).');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setErrorMsg('Please enter a valid price (>= 0).');
      return;
    }

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const featuresArray = features.split(',').map(f => f.trim()).filter(Boolean);
    const filesArray = filesIncluded.split(',').map(f => f.trim()).filter(Boolean);

    onPublishProduct({
      title,
      tagline,
      description,
      category,
      price: priceNum,
      tags: tagsArray.length > 0 ? tagsArray : ['Creator', category],
      features: featuresArray.length > 0 ? featuresArray : ['Premium quality', 'Instant delivery files', '24/7 Creator support assistance'],
      filesIncluded: filesArray.length > 0 ? filesArray : [`${title.replace(/\s+/g, '-').toLowerCase()}-package.zip`],
      fileSize: fileSize.trim() || '12.0 MB',
      coverImage: coverGradient,
      creator: {
        name: 'You (Creator)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80',
        badge: 'New Creator',
        salesCount: 0,
        rating: 5.0
      }
    });

    setSuccessMsg('Your digital product has been compiled and added to OMYRA MALL catalogs!');
    setTitle('');
    setTagline('');
    setDescription('');
    setTags('');
    setFeatures('');
    setFilesIncluded('');
    setPrice('19.00');
    setFileSize('15.4 MB');

    setTimeout(() => {
      setSuccessMsg('');
      setShowAddForm(false);
    }, 4000);
  };

  return (
    <div id="creator-dashboard-view" className="space-y-6">
      
      {/* Upper Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-[#D4FF5E] bg-[#D4FF5E]/10 border border-[#D4FF5E]/20 px-3 py-1.5 rounded-full uppercase tracking-widest">
            Creator Studio
          </span>
          <h1 className="mt-4 font-display text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">Sell on OMYRA MALL</h1>
          <p className="text-xs text-[#8E9299] font-medium mt-1">Manage digital listings, analyze revenue patterns, and draft new templates.</p>
        </div>

        <button
          id="toggle-add-product-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-xl bg-[#D4FF5E] px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#c3ec4e] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-black" />
          <span>{showAddForm ? 'Back to Analytics' : 'List New Product'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-center text-xs font-bold uppercase tracking-wider text-emerald-400">
          {successMsg}
        </div>
      )}

      {/* Conditionally render forms or analytics */}
      {showAddForm ? (
        <div id="publish-product-form" className="rounded-[32px] border border-white/10 bg-[#161618] p-6 md:p-8">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
            <PlusCircle className="h-5 w-5 text-[#D4FF5E]" />
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Configure New Digital Listing</h2>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {errorMsg && (
              <div className="rounded-xl bg-rose-500/10 p-3.5 border border-rose-500/20 text-xs font-bold uppercase tracking-wider text-rose-400">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Form Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimalist Neumorphic Dashboard UI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-750 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">One-line Tagline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 150+ components with auto layouts for modern startups."
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-750 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] focus:outline-none focus:border-[#D4FF5E]"
                    >
                      <option value="templates">UI Templates</option>
                      <option value="code">Source Code</option>
                      <option value="ebooks">E-Books</option>
                      <option value="design">3D / Designs</option>
                      <option value="audio">Audio / Sound FX</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Price ($ USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] focus:outline-none focus:border-[#D4FF5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe what value this digital asset provides, compatibility details, instructions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-755 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>
              </div>

              {/* Right Form Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">File Size estimation (e.g. 18.5 MB)</label>
                  <input
                    type="text"
                    placeholder="e.g. 24.1 MB"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-750 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Included Files (Comma separated list)</label>
                  <input
                    type="text"
                    placeholder="Figma-UI-Kit.fig, Style-Guide.pdf, Documentation.txt"
                    value={filesIncluded}
                    onChange={(e) => setFilesIncluded(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-750 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Key Product Features (Comma separated list)</label>
                  <input
                    type="text"
                    placeholder="120+ Components, Light & Dark Theme presets, Free Google Webfonts, Tailwind CSS files"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-750 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Product Tags (Comma separated list)</label>
                  <input
                    type="text"
                    placeholder="figma, saas, dashboard, analytics"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-750 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-2">Select Cover Presentation Graphic</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_GRADIENTS.map((grad, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCoverGradient(grad.value)}
                        className={`group relative h-10 w-full rounded-xl border transition-all ${
                          coverGradient === grad.value 
                            ? 'border-[#D4FF5E] shadow shadow-[#D4FF5E]/20' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        style={{ background: grad.value }}
                      >
                        <span className="sr-only">{grad.name}</span>
                        {coverGradient === grad.value && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[10px]">
                            <Check className="h-4 w-4 text-white" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="border-t border-white/5 pt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[#8E9299] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#D4FF5E] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black hover:bg-[#c3ec4e] transition-all cursor-pointer"
              >
                Compile & Publish Listing
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Creator Metrics Row with High-Fidelity Mini Sparklines */}
          <div id="analytics-metrics-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1 */}
            <div className="rounded-[24px] border border-white/10 bg-[#161618] p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#D4FF5E]/5 rounded-bl-full flex items-center justify-center pointer-events-none">
                <TrendingUp className="h-4.5 w-4.5 text-[#D4FF5E]" />
              </div>
              <div>
                <span className="text-[9px] text-[#8E9299] font-black uppercase tracking-widest block">Traffic Views</span>
                <h3 className="mt-2 font-display text-2xl font-black text-white">41,240</h3>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-0.5 mt-1">
                  +12.4% this month
                </span>
              </div>
              {/* Sparkline */}
              <div className="mt-4 h-6 w-full opacity-70">
                <svg className="h-full w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 L15,12 L30,17 L45,8 L60,11 L75,4 L90,9 L100,2" fill="none" stroke="#D4FF5E" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="rounded-[24px] border border-white/10 bg-[#161618] p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#D4FF5E]/5 rounded-bl-full flex items-center justify-center pointer-events-none">
                <ShoppingBag className="h-4.5 w-4.5 text-[#D4FF5E]" />
              </div>
              <div>
                <span className="text-[9px] text-[#8E9299] font-black uppercase tracking-widest block">Sales Count</span>
                <h3 className="mt-2 font-display text-2xl font-black text-white">{totalSalesCount}</h3>
                <span className="text-[10px] text-[#D4FF5E] font-bold uppercase tracking-wider flex items-center gap-0.5 mt-1">
                  Active delivery files
                </span>
              </div>
              {/* Sparkline */}
              <div className="mt-4 h-6 w-full opacity-70">
                <svg className="h-full w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,18 L15,16 L30,12 L45,14 L60,8 L75,9 L90,5 L100,1" fill="none" stroke="#D4FF5E" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="rounded-[24px] border border-white/10 bg-[#161618] p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#D4FF5E]/5 rounded-bl-full flex items-center justify-center pointer-events-none">
                <Coins className="h-4.5 w-4.5 text-[#D4FF5E]" />
              </div>
              <div>
                <span className="text-[9px] text-[#8E9299] font-black uppercase tracking-widest block">Gross Revenue</span>
                <h3 className="mt-2 font-display text-2xl font-black text-white">${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-0.5 mt-1">
                  100% creator payouts
                </span>
              </div>
              {/* Sparkline */}
              <div className="mt-4 h-6 w-full opacity-70">
                <svg className="h-full w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,16 L15,14 L30,15 L45,11 L60,9 L75,5 L90,4 L100,0" fill="none" stroke="#D4FF5E" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="rounded-[24px] border border-white/10 bg-[#161618] p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#D4FF5E]/5 rounded-bl-full flex items-center justify-center pointer-events-none">
                <Layers className="h-4.5 w-4.5 text-[#D4FF5E]" />
              </div>
              <div>
                <span className="text-[9px] text-[#8E9299] font-black uppercase tracking-widest block">Listed Catalog</span>
                <h3 className="mt-2 font-display text-2xl font-black text-white">{totalListed}</h3>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-0.5 mt-1">
                  Standard licenses
                </span>
              </div>
              {/* Sparkline */}
              <div className="mt-4 h-6 w-full opacity-70">
                <svg className="h-full w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,17 L15,17 L30,12 L45,12 L60,9 L75,9 L90,5 L100,5" fill="none" stroke="#D4FF5E" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

          </div>

          {/* Table/List of Active Listings */}
          <div className="rounded-[24px] border border-white/10 bg-[#161618] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 bg-[#0A0A0B]/20 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#F4F4F4]">My Live Listings ({totalListed})</h3>
              <span className="text-[9px] font-black text-[#D4FF5E] uppercase tracking-widest">OMYRA CATALOGUE</span>
            </div>

            {totalListed === 0 ? (
              <div className="p-12 text-center text-xs text-[#8E9299] font-bold uppercase tracking-widest">
                No active listings published yet. Click "List New Product" to configure your first developer asset!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0A0B]/40 text-[#8E9299] uppercase tracking-widest text-[9px] font-black border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Product Info</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Unit Price</th>
                      <th className="px-6 py-4">Unit Sales</th>
                      <th className="px-6 py-4 text-right">Earning Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-transparent">
                    {creatorProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="h-9 w-12 rounded-lg overflow-hidden shrink-0 border border-white/5" style={{ background: p.coverImage }} />
                          <div className="min-w-0">
                            <span className="font-bold text-white truncate block max-w-[180px] uppercase">{p.title}</span>
                            <span className="text-[10px] text-[#8E9299] font-mono">{p.fileSize} ZIP</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize text-[#8E9299] font-bold font-mono">{p.category}</td>
                        <td className="px-6 py-4 font-bold text-white font-mono">${p.price.toFixed(2)}</td>
                        <td className="px-6 py-4 font-bold text-[#8E9299] font-mono">{p.creator.salesCount}+ units</td>
                        <td className="px-6 py-4 text-right font-black text-[#D4FF5E] font-mono">${(p.creator.salesCount * p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
