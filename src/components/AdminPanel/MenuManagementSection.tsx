import React, { useState } from 'react';
import { 
  Menu as MenuIcon, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  CornerDownRight, 
  CornerUpLeft, 
  ExternalLink, 
  Check, 
  Save, 
  FolderPlus, 
  Link as LinkIcon, 
  FileText, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  MoveVertical, 
  Tag,
  Zap,
  RefreshCw,
  Eye,
  Globe
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { 
  SiteMenu, 
  MenuItem, 
  MenuLocation, 
  SYSTEM_PAGES, 
  SYSTEM_CATEGORIES 
} from '../../types/menu';
import { OmyraMallLogo } from '../OmyraMallLogo';

interface MenuManagementSectionProps {
  token: string;
}

export const MenuManagementSection: React.FC<MenuManagementSectionProps> = ({ token }) => {
  const {
    menus,
    selectedMenuId,
    setSelectedMenuId,
    createMenu,
    deleteMenu,
    updateMenu,
    addItemsToMenu,
    removeItemFromMenu,
    updateMenuItem,
    moveMenuItem,
    indentMenuItem,
    outdentMenuItem,
    saveMenuToServer,
    resetMenusToServer,
    isSaving,
    saveError
  } = useMenu();

  const currentMenu = menus.find(m => m.id === selectedMenuId) || menus[0];

  // Accordion toggle states on the left
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    quickPageConverter: true,
    pages: false,
    categories: false,
    custom: false
  });

  // Dedicated "Make Any Page into Menu" builder state
  const [pageToMenuSource, setPageToMenuSource] = useState<string>('page-deals');
  const [customPageTitle, setCustomPageTitle] = useState<string>('');
  const [customPageUrl, setCustomPageUrl] = useState<string>('');
  const [pageToMenuParentId, setPageToMenuParentId] = useState<string>('none');
  const [pageToMenuBadge, setPageToMenuBadge] = useState<string>('HOT');
  const [pageToMenuTarget, setPageToMenuTarget] = useState<'_self' | '_blank'>('_self');

  // Checkbox selections for Pages and Categories
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Custom link inputs
  const [customLinkUrl, setCustomLinkUrl] = useState<string>('');
  const [customLinkText, setCustomLinkText] = useState<string>('');
  const [customLinkBadge, setCustomLinkBadge] = useState<string>('');

  // Expandable state for each item's details editor
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Menu Creation modal / inline state
  const [isCreatingNewMenu, setIsCreatingNewMenu] = useState<boolean>(false);
  const [newMenuName, setNewMenuName] = useState<string>('');
  const [newMenuLocation, setNewMenuLocation] = useState<MenuLocation>('none');

  // Live preview interactive state
  const [previewOpenDropdownId, setPreviewOpenDropdownId] = useState<string | null>(null);

  // Success message state
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setOpenAccordions(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Handler: "Make Any Page into Menu" Converter
  const handleMakePageIntoMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMenu) return;

    let title = '';
    let url = '';
    let defaultBadge: string | undefined = undefined;

    if (pageToMenuSource === 'custom') {
      if (!customPageTitle.trim() || !customPageUrl.trim()) return;
      title = customPageTitle.trim();
      url = customPageUrl.trim();
    } else {
      const page = SYSTEM_PAGES.find(p => p.id === pageToMenuSource);
      if (!page) return;
      title = customPageTitle.trim() || page.title;
      url = customPageUrl.trim() || page.url;
      defaultBadge = page.badge;
    }

    const badgeToUse = pageToMenuBadge.trim() || defaultBadge;

    if (pageToMenuParentId && pageToMenuParentId !== 'none') {
      // Add as nested child under chosen parent item
      const parent = currentMenu.items.find(it => it.id === pageToMenuParentId);
      if (parent) {
        const childId = `item-${Date.now()}`;
        const newChild: MenuItem = {
          id: childId,
          title,
          url,
          type: 'page',
          target: pageToMenuTarget,
          badge: badgeToUse,
          parentId: parent.id,
          order: parent.children ? parent.children.length : 0
        };
        const updatedChildren = parent.children ? [...parent.children, newChild] : [newChild];
        updateMenuItem(currentMenu.id, parent.id, { children: updatedChildren });
        setSaveSuccessMsg(`Page "${title}" converted into a dropdown sub-menu under "${parent.title}"!`);
      }
    } else {
      // Add as top-level menu item
      addItemsToMenu(currentMenu.id, [{
        title,
        url,
        type: 'page',
        target: pageToMenuTarget,
        badge: badgeToUse
      }]);
      setSaveSuccessMsg(`Page "${title}" converted into a top-level menu item in "${currentMenu.name}"!`);
    }

    setCustomPageTitle('');
    setCustomPageUrl('');
    setPageToMenuBadge('');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Handler: Add selected pages in bulk to current menu
  const handleAddSelectedPages = () => {
    if (!currentMenu || selectedPages.length === 0) return;

    const itemsToAdd = selectedPages.map(pageId => {
      const page = SYSTEM_PAGES.find(p => p.id === pageId);
      return {
        title: page ? page.title : 'Page',
        url: page ? page.url : '/',
        type: 'page' as const,
        target: '_self' as const,
        badge: page?.badge
      };
    });

    addItemsToMenu(currentMenu.id, itemsToAdd);
    setSelectedPages([]);
    setSaveSuccessMsg(`Added ${itemsToAdd.length} page(s) to menu "${currentMenu.name}".`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Handler: Add selected categories to current menu
  const handleAddSelectedCategories = () => {
    if (!currentMenu || selectedCategories.length === 0) return;

    const itemsToAdd = selectedCategories.map(catId => {
      const cat = SYSTEM_CATEGORIES.find(c => c.id === catId);
      return {
        title: cat ? cat.title : 'Category',
        url: cat ? cat.url : '/?category=all',
        type: 'category' as const,
        target: '_self' as const
      };
    });

    addItemsToMenu(currentMenu.id, itemsToAdd);
    setSelectedCategories([]);
    setSaveSuccessMsg(`Added ${itemsToAdd.length} category collection(s) to menu "${currentMenu.name}".`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Handler: Add custom link to current menu
  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMenu || !customLinkUrl.trim() || !customLinkText.trim()) return;

    addItemsToMenu(currentMenu.id, [{
      title: customLinkText.trim(),
      url: customLinkUrl.trim(),
      type: 'custom' as const,
      target: '_self' as const,
      badge: customLinkBadge.trim() ? customLinkBadge.trim() : undefined
    }]);

    setCustomLinkUrl('');
    setCustomLinkText('');
    setCustomLinkBadge('');
    setSaveSuccessMsg(`Custom link "${customLinkText}" added to menu "${currentMenu.name}".`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Handler: Save menu changes to backend & database
  const handleSaveMenu = async () => {
    const ok = await saveMenuToServer(token, currentMenu);
    if (ok) {
      setSaveSuccessMsg(`Menu "${currentMenu.name}" saved and live across the marketplace!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  // Handler: Reset default navigation menus
  const handleResetDefaults = async () => {
    if (window.confirm('Restore factory default site navigation menus? Custom menus will be restored to clean presets.')) {
      const ok = await resetMenusToServer(token);
      if (ok) {
        setSaveSuccessMsg('All site navigation menus restored to factory presets.');
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      }
    }
  };

  // Handler: Create new menu submit
  const handleCreateMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName.trim()) return;
    createMenu(newMenuName.trim(), newMenuLocation);
    setIsCreatingNewMenu(false);
    setNewMenuName('');
    setNewMenuLocation('none');
    setSaveSuccessMsg(`New menu created! Add your pages and links below.`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Handler: Delete current menu
  const handleDeleteCurrentMenu = () => {
    if (!currentMenu) return;
    if (menus.length <= 1) {
      alert('You must keep at least one navigation menu for the marketplace storefront.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete the menu "${currentMenu.name}"?`)) {
      const deleted = deleteMenu(currentMenu.id);
      if (deleted) {
        setSaveSuccessMsg('Menu deleted successfully.');
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      }
    }
  };

  // List of top-level items in currentMenu suitable for nesting children
  const availableParents = currentMenu?.items.filter(it => !it.parentId) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP SELECTOR BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Menu Picker & Create New */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <MenuIcon className="w-3.5 h-3.5 text-orange-600" />
            <span>Select a menu to edit:</span>
          </label>
          <div className="relative">
            <select
              value={selectedMenuId}
              onChange={(e) => {
                setSelectedMenuId(e.target.value);
                setIsCreatingNewMenu(false);
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-900 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 focus:outline-none cursor-pointer pr-8"
            >
              {menus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.location === 'header_primary' ? '★ (Header Primary)' : m.location === 'footer_quick_links' ? '(Footer Links)' : m.location === 'footer_resources' ? '(Footer Legal)' : ''}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <button
            type="button"
            onClick={() => setIsCreatingNewMenu(!isCreatingNewMenu)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create a new menu</span>
          </button>
        </div>

        {/* Global Save & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={isSaving}
            className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5"
            title="Restore factory default starter navigation menus"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveMenu}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-white bg-[#FF5A00] hover:bg-[#e04f00] active:scale-[0.98] rounded-xl shadow-xs shadow-orange-500/20 transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Menu'}</span>
          </button>
        </div>
      </div>

      {/* CREATE NEW MENU INLINE CARD */}
      {isCreatingNewMenu && (
        <form onSubmit={handleCreateMenuSubmit} className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4 text-orange-600" />
              <span>Create New Navigation Menu</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatingNewMenu(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Menu Name</label>
              <input
                type="text"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                placeholder="e.g. Header Utility Bar, Mobile Sidebar Menu..."
                required
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Display Location</label>
              <select
                value={newMenuLocation}
                onChange={(e) => setNewMenuLocation(e.target.value as MenuLocation)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:border-orange-500 focus:outline-none"
              >
                <option value="none">None (Custom / Auxiliary)</option>
                <option value="header_primary">Header Primary Navigation</option>
                <option value="footer_quick_links">Footer Quick Links</option>
                <option value="footer_resources">Footer Resources & Legal</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingNewMenu(false)}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-orange-600 rounded-xl shadow-xs transition-all"
            >
              Create Menu
            </button>
          </div>
        </form>
      )}

      {/* FEEDBACK BANNERS */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-700 font-bold">×</button>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* 2. MAIN TWO-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT 4 COLS: ADD MENU ITEMS SUITE & PAGE-TO-MENU CONVERTER */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-orange-600" />
              <span>Add Menu Items</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Target: <strong className="text-slate-700 font-semibold">{currentMenu.name}</strong>
            </span>
          </div>

          {/* FEATURE 1: MAKE ANY PAGE INTO MENU CONVERTER (FEATURED PROMINENT CARD) */}
          <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50/40 rounded-2xl border-2 border-orange-300 p-4 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-orange-600 text-white rounded-lg shadow-2xs">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">
                    Make Any Page into Menu
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Transform any storefront page or custom route into a menu link
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleMakePageIntoMenu} className="space-y-2.5 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  1. Choose Page to Convert
                </label>
                <select
                  value={pageToMenuSource}
                  onChange={(e) => setPageToMenuSource(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:border-orange-500 focus:outline-none"
                >
                  <optgroup label="Storefront Pages">
                    {SYSTEM_PAGES.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.url}) {p.badge ? `[${p.badge}]` : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Custom Route">
                    <option value="custom">+ Custom URL / New Page Route...</option>
                  </optgroup>
                </select>
              </div>

              {/* If Custom Page Selected, Show custom inputs */}
              {pageToMenuSource === 'custom' ? (
                <div className="grid grid-cols-2 gap-2 bg-white/80 p-2 rounded-xl border border-orange-200">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Page Title</label>
                    <input
                      type="text"
                      value={customPageTitle}
                      onChange={(e) => setCustomPageTitle(e.target.value)}
                      placeholder="e.g. VIP Club"
                      required
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Page URL</label>
                    <input
                      type="text"
                      value={customPageUrl}
                      onChange={(e) => setCustomPageUrl(e.target.value)}
                      placeholder="/vip or #section"
                      required
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 bg-white/70 px-2.5 py-1.5 rounded-lg border border-orange-100 flex items-center justify-between">
                  <span className="truncate">URL: <strong>{SYSTEM_PAGES.find(p => p.id === pageToMenuSource)?.url}</strong></span>
                  <span className="text-orange-600 font-bold uppercase shrink-0 text-[9px]">Verified Route</span>
                </div>
              )}

              {/* Destination Nesting / Hierarchy */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    2. Position / Parent
                  </label>
                  <select
                    value={pageToMenuParentId}
                    onChange={(e) => setPageToMenuParentId(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="none">Top Level Item</option>
                    {availableParents.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        ↳ Dropdown Child of: {parent.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    3. Highlight Badge
                  </label>
                  <input
                    type="text"
                    value={pageToMenuBadge}
                    onChange={(e) => setPageToMenuBadge(e.target.value)}
                    placeholder="e.g. HOT, NEW, SALE"
                    className="w-full px-2 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageToMenuTarget === '_blank'}
                    onChange={(e) => setPageToMenuTarget(e.target.checked ? '_blank' : '_self')}
                    className="rounded text-orange-600 focus:ring-orange-500 w-3 h-3"
                  />
                  <span>New Window</span>
                </label>

                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-[#FF5A00] hover:bg-[#e04f00] active:scale-[0.98] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Make Page into Menu</span>
                </button>
              </div>
            </form>
          </div>

          {/* ACCORDION 1: PAGES (MULTI-SELECT) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('pages')}
              className="w-full px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-orange-600" />
                <span>All Storefront Pages (Bulk)</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openAccordions.pages ? 'rotate-180' : ''}`} />
            </button>

            {openAccordions.pages && (
              <div className="p-4 space-y-3">
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50/30">
                  {SYSTEM_PAGES.map((page) => (
                    <label key={page.id} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(page.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPages([...selectedPages, page.id]);
                          } else {
                            setSelectedPages(selectedPages.filter(id => id !== page.id));
                          }
                        }}
                        className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-3.5 h-3.5"
                      />
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>{page.title}</span>
                          {page.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                              {page.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{page.description}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPages.length === SYSTEM_PAGES.length) {
                        setSelectedPages([]);
                      } else {
                        setSelectedPages(SYSTEM_PAGES.map(p => p.id));
                      }
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                  >
                    {selectedPages.length === SYSTEM_PAGES.length ? 'Deselect All' : 'Select All'}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSelectedPages}
                    disabled={selectedPages.length === 0}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-orange-600 disabled:opacity-40 rounded-xl transition-all"
                  >
                    + Add to Menu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 2: PRODUCT CATEGORIES */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('categories')}
              className="w-full px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Product Categories & Collections</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openAccordions.categories ? 'rotate-180' : ''}`} />
            </button>

            {openAccordions.categories && (
              <div className="p-4 space-y-3">
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50/30">
                  {SYSTEM_CATEGORIES.map((cat) => (
                    <label key={cat.id} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                          }
                        }}
                        className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-3.5 h-3.5"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{cat.title}</div>
                        <div className="text-[10px] text-slate-400">{cat.description}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCategories.length === SYSTEM_CATEGORIES.length) {
                        setSelectedCategories([]);
                      } else {
                        setSelectedCategories(SYSTEM_CATEGORIES.map(c => c.id));
                      }
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                  >
                    {selectedCategories.length === SYSTEM_CATEGORIES.length ? 'Deselect All' : 'Select All'}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSelectedCategories}
                    disabled={selectedCategories.length === 0}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-orange-600 disabled:opacity-40 rounded-xl transition-all"
                  >
                    + Add to Menu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 3: CUSTOM LINKS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('custom')}
              className="w-full px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Custom Links & External URLs</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openAccordions.custom ? 'rotate-180' : ''}`} />
            </button>

            {openAccordions.custom && (
              <form onSubmit={handleAddCustomLink} className="p-4 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">URL / Target Path</label>
                  <input
                    type="text"
                    value={customLinkUrl}
                    onChange={(e) => setCustomLinkUrl(e.target.value)}
                    placeholder="https://... or /path or #section"
                    required
                    className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Link Text</label>
                  <input
                    type="text"
                    value={customLinkText}
                    onChange={(e) => setCustomLinkText(e.target.value)}
                    placeholder="e.g. Documentation, Discord Community"
                    required
                    className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Optional Highlight Badge</label>
                  <input
                    type="text"
                    value={customLinkBadge}
                    onChange={(e) => setCustomLinkBadge(e.target.value)}
                    placeholder="e.g. HOT, NEW, 50% OFF"
                    className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={!customLinkUrl.trim() || !customLinkText.trim()}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-orange-600 disabled:opacity-40 rounded-xl transition-all"
                  >
                    + Add to Menu
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* RIGHT 8 COLS: MENU STRUCTURE, HIERARCHY, LIVE PREVIEW & SETTINGS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            
            {/* Menu Header with Name Edit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex-1 max-w-md">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Menu Name
                </label>
                <input
                  type="text"
                  value={currentMenu.name}
                  onChange={(e) => updateMenu({ ...currentMenu, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm font-extrabold text-slate-900 border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleSaveMenu}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF5A00] hover:bg-[#e04f00] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Menu'}</span>
                </button>
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 text-slate-600 text-xs flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <strong>Menu Structure & Nesting:</strong> Reorder items with the <strong>Move Up/Down</strong> buttons. Click <strong>Indent (↳)</strong> to nest an item as a dropdown sub-menu of the item above it, or <strong>Outdent (↰)</strong> to promote it. Click any item's chevron to customize its navigation label or badge.
              </div>
            </div>

            {/* ITEM LIST */}
            <div className="space-y-2.5 min-h-[160px]">
              {currentMenu.items.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <MenuIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="font-semibold text-slate-700">This menu has no items yet.</div>
                  <div>Use "Make Any Page into Menu" or the accordions on the left to add items.</div>
                </div>
              ) : (
                currentMenu.items.map((item, index) => {
                  const isExpanded = Boolean(expandedItems[item.id]);

                  return (
                    <div key={item.id} className="space-y-2">
                      
                      {/* PARENT / ROOT ITEM */}
                      <div className="border border-slate-200 hover:border-slate-300 rounded-xl bg-white shadow-2xs overflow-hidden transition-all">
                        <div className="p-3 flex items-center justify-between gap-3 bg-slate-50/60">
                          
                          {/* Title & Badge */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="p-1 text-slate-400">
                              <MoveVertical className="w-3.5 h-3.5" />
                            </span>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono truncate">
                                {item.url}
                              </div>
                            </div>
                          </div>

                          {/* Controls: Move Up, Move Down, Indent, Edit */}
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-200/60 rounded-md hidden sm:inline capitalize">
                              {item.type}
                            </span>

                            {/* Move Up */}
                            <button
                              type="button"
                              onClick={() => moveMenuItem(currentMenu.id, item.id, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              onClick={() => moveMenuItem(currentMenu.id, item.id, 'down')}
                              disabled={index === currentMenu.items.length - 1}
                              title="Move Down"
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Indent (make child of previous item) */}
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => indentMenuItem(currentMenu.id, item.id)}
                                title="Make dropdown sub-item"
                                className="p-1 text-slate-400 hover:text-orange-600 rounded"
                              >
                                <CornerDownRight className="w-4 h-4" />
                              </button>
                            )}

                            {/* Expand / Collapse Details */}
                            <button
                              type="button"
                              onClick={() => toggleItemExpanded(item.id)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors ml-1"
                              title="Edit item attributes"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* EXPANDABLE ITEM DETAILS */}
                        {isExpanded && (
                          <div className="p-4 border-t border-slate-100 bg-white space-y-3 animate-in fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Navigation Label</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateMenuItem(currentMenu.id, item.id, { title: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Target URL</label>
                                <input
                                  type="text"
                                  value={item.url}
                                  onChange={(e) => updateMenuItem(currentMenu.id, item.id, { url: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Highlight Badge</label>
                                <input
                                  type="text"
                                  value={item.badge || ''}
                                  onChange={(e) => updateMenuItem(currentMenu.id, item.id, { badge: e.target.value })}
                                  placeholder="e.g. HOT, NEW, SALE"
                                  className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                />
                              </div>

                              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-4">
                                <input
                                  type="checkbox"
                                  checked={item.target === '_blank'}
                                  onChange={(e) => updateMenuItem(currentMenu.id, item.id, { target: e.target.checked ? '_blank' : '_self' })}
                                  className="rounded text-orange-600 focus:ring-orange-500 w-3.5 h-3.5"
                                />
                                <span>Open link in a new window/tab</span>
                              </label>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400">ID: {item.id}</span>
                              <button
                                type="button"
                                onClick={() => removeItemFromMenu(currentMenu.id, item.id)}
                                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove item</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* NESTED CHILDREN (SUB-ITEMS) */}
                      {item.children && item.children.length > 0 && (
                        <div className="pl-6 sm:pl-8 space-y-2 border-l-2 border-orange-300 ml-4">
                          {item.children.map((child) => (
                            <div key={child.id} className="border border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50/70 p-3 flex items-center justify-between gap-3 shadow-2xs">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-orange-600 font-bold px-1.5 py-0.2 bg-orange-100 rounded">
                                    Sub-item
                                  </span>
                                  <span className="text-xs font-bold text-slate-800 truncate">
                                    {child.title}
                                  </span>
                                  {child.badge && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                                      {child.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono truncate">{child.url}</div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {/* Outdent button */}
                                <button
                                  type="button"
                                  onClick={() => outdentMenuItem(currentMenu.id, child.id)}
                                  title="Outdent to top-level"
                                  className="p-1 text-slate-400 hover:text-blue-600 rounded"
                                >
                                  <CornerUpLeft className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeItemFromMenu(currentMenu.id, child.id)}
                                  title="Remove sub-item"
                                  className="p-1 text-slate-400 hover:text-red-600 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

            {/* LIVE STOREFRONT NAVIGATION PREVIEW */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-orange-600" />
                  <span>Live Storefront Navigation Preview</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Interactive Preview with Dropdowns
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl bg-slate-50 p-3 sm:p-4 shadow-inner space-y-2">
                {/* Simulated Header Navbar */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                    <OmyraMallLogo size="sm" />
                    <div className="text-[11px] text-slate-400 border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 flex-1 max-w-xs truncate hidden sm:block">
                      Search products, templates...
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-600">Login</span>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#FF5A00] text-white">Sign Up</span>
                    </div>
                  </div>

                  {/* Simulated Nav Links */}
                  <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-1">
                    {currentMenu.items.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No navigation items added yet</span>
                    ) : (
                      currentMenu.items.map((item) => {
                        const hasChildren = Boolean(item.children && item.children.length > 0);
                        const isDropdownOpen = previewOpenDropdownId === item.id;

                        if (hasChildren) {
                          return (
                            <div
                              key={item.id}
                              className="relative"
                              onMouseEnter={() => setPreviewOpenDropdownId(item.id)}
                              onMouseLeave={() => setPreviewOpenDropdownId(null)}
                            >
                              <button
                                type="button"
                                onClick={() => setPreviewOpenDropdownId(isDropdownOpen ? null : item.id)}
                                className="flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-orange-600 transition-colors whitespace-nowrap py-1 cursor-pointer"
                              >
                                <span>{item.title}</span>
                                {item.badge && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                                    {item.badge}
                                  </span>
                                )}
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                              </button>

                              {/* Dropdown Menu Preview */}
                              {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in slide-in-from-top-1">
                                  {item.children!.map((child) => (
                                    <div
                                      key={child.id}
                                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center justify-between"
                                    >
                                      <span>{child.title}</span>
                                      {child.badge && (
                                        <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                                          {child.badge}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-orange-600 transition-colors whitespace-nowrap py-1"
                          >
                            <span>{item.title}</span>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* MENU SETTINGS / LOCATION ASSIGNMENT */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Menu Settings & Display Locations
              </h4>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">Display location in storefront:</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Location 1: Header Primary */}
                  <label className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    currentMenu.location === 'header_primary'
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="menu_location"
                      checked={currentMenu.location === 'header_primary'}
                      onChange={() => updateMenu({ ...currentMenu, location: 'header_primary' })}
                      className="mt-0.5 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Header Primary Navigation</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Main top horizontal navigation bar underneath the marketplace search bar.
                      </div>
                    </div>
                  </label>

                  {/* Location 2: Footer Quick Links */}
                  <label className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    currentMenu.location === 'footer_quick_links'
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="menu_location"
                      checked={currentMenu.location === 'footer_quick_links'}
                      onChange={() => updateMenu({ ...currentMenu, location: 'footer_quick_links' })}
                      className="mt-0.5 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Footer Quick Links</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Quick explore column links inside the marketplace footer section.
                      </div>
                    </div>
                  </label>

                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDeleteCurrentMenu}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Menu</span>
              </button>

              <button
                type="button"
                onClick={handleSaveMenu}
                disabled={isSaving}
                className="px-5 py-2 text-xs font-bold text-white bg-[#FF5A00] hover:bg-[#e04f00] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving to Database...' : 'Save Menu'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
