import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteMenu, MenuItem, DEFAULT_MENUS, MenuLocation } from '../types/menu';

interface MenuContextType {
  menus: SiteMenu[];
  activeHeaderMenu: SiteMenu | undefined;
  selectedMenuId: string;
  setSelectedMenuId: (id: string) => void;
  createMenu: (name: string, location?: MenuLocation) => SiteMenu;
  deleteMenu: (menuId: string) => boolean;
  updateMenu: (menu: SiteMenu) => void;
  addItemsToMenu: (menuId: string, items: Array<Omit<MenuItem, 'id' | 'order'>>) => void;
  removeItemFromMenu: (menuId: string, itemId: string) => void;
  updateMenuItem: (menuId: string, itemId: string, updates: Partial<MenuItem>) => void;
  indentMenuItem: (menuId: string, itemId: string) => void;
  outdentMenuItem: (menuId: string, itemId: string) => void;
  moveMenuItem: (menuId: string, itemId: string, direction: 'up' | 'down') => void;
  saveMenuToServer: (token: string, menuToSave?: SiteMenu) => Promise<boolean>;
  resetMenusToServer: (token: string) => Promise<boolean>;
  refreshMenus: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
}

const MENU_STORAGE_KEY = 'omyra_site_menus';

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menus, setMenus] = useState<SiteMenu[]>(() => {
    try {
      const cached = localStorage.getItem(MENU_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read cached menus:', e);
    }
    return DEFAULT_MENUS;
  });

  const [selectedMenuId, setSelectedMenuId] = useState<string>(() => {
    return menus[0]?.id || DEFAULT_MENUS[0].id;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Active menu for primary header navigation
  const activeHeaderMenu = menus.find(m => m.location === 'header_primary') || menus[0];

  // Refresh from API
  const refreshMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/menus');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.menus) && data.menus.length > 0) {
          setMenus(data.menus);
          localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(data.menus));
        }
      }
    } catch (err) {
      console.warn('Notice loading menus from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMenus();
  }, [refreshMenus]);

  // Save current state to localStorage helper
  const persistLocally = (updatedMenus: SiteMenu[]) => {
    setMenus(updatedMenus);
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedMenus));
    } catch {
      // ignore
    }
  };

  // Create a new menu
  const createMenu = useCallback((name: string, location: MenuLocation = 'none'): SiteMenu => {
    const newId = `menu-${Date.now()}`;
    const newMenu: SiteMenu = {
      id: newId,
      name: name.trim() || 'Untitled Menu',
      location,
      items: [],
      updatedAt: new Date().toISOString()
    };

    setMenus(prev => {
      // If new menu assigned to a location, unset other menus with that location
      let next = prev.map(m => {
        if (location !== 'none' && m.location === location) {
          return { ...m, location: 'none' as MenuLocation };
        }
        return m;
      });
      next = [...next, newMenu];
      persistLocally(next);
      return next;
    });

    setSelectedMenuId(newId);
    return newMenu;
  }, []);

  // Delete a menu
  const deleteMenu = useCallback((menuId: string): boolean => {
    if (menus.length <= 1) {
      alert('Cannot delete the last remaining menu. The site requires at least one navigation menu.');
      return false;
    }

    const next = menus.filter(m => m.id !== menuId);
    persistLocally(next);
    setSelectedMenuId(next[0].id);
    return true;
  }, [menus]);

  // Update menu properties (name, location, autoAddPages, etc.)
  const updateMenu = useCallback((updated: SiteMenu) => {
    setMenus(prev => {
      const next = prev.map(m => {
        if (m.id === updated.id) {
          return { ...updated, updatedAt: new Date().toISOString() };
        }
        // If location changed and clashes, unset the old one
        if (updated.location !== 'none' && m.location === updated.location && m.id !== updated.id) {
          return { ...m, location: 'none' as MenuLocation };
        }
        return m;
      });
      persistLocally(next);
      return next;
    });
  }, []);

  // Add items to menu
  const addItemsToMenu = useCallback((menuId: string, itemsToAdd: Array<Omit<MenuItem, 'id' | 'order'>>) => {
    setMenus(prev => {
      const next = prev.map(menu => {
        if (menu.id !== menuId) return menu;
        
        const currentCount = menu.items.length;
        const newFormattedItems: MenuItem[] = itemsToAdd.map((it, idx) => ({
          ...it,
          id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          order: currentCount + idx
        }));

        return {
          ...menu,
          items: [...menu.items, ...newFormattedItems],
          updatedAt: new Date().toISOString()
        };
      });
      persistLocally(next);
      return next;
    });
  }, []);

  // Remove an item (and any children recursively)
  const removeItemFromMenu = useCallback((menuId: string, itemId: string) => {
    setMenus(prev => {
      const next = prev.map(menu => {
        if (menu.id !== menuId) return menu;

        // Recursive remove helper
        const filterItems = (list: MenuItem[]): MenuItem[] => {
          return list
            .filter(i => i.id !== itemId)
            .map(i => ({
              ...i,
              children: i.children ? filterItems(i.children) : undefined
            }));
        };

        const filtered = filterItems(menu.items).map((item, idx) => ({ ...item, order: idx }));
        return {
          ...menu,
          items: filtered,
          updatedAt: new Date().toISOString()
        };
      });
      persistLocally(next);
      return next;
    });
  }, []);

  // Update specific item attributes (label, url, target, badge)
  const updateMenuItem = useCallback((menuId: string, itemId: string, updates: Partial<MenuItem>) => {
    setMenus(prev => {
      const next = prev.map(menu => {
        if (menu.id !== menuId) return menu;

        const mapItems = (list: MenuItem[]): MenuItem[] => {
          return list.map(item => {
            if (item.id === itemId) {
              return { ...item, ...updates };
            }
            if (item.children && item.children.length > 0) {
              return { ...item, children: mapItems(item.children) };
            }
            return item;
          });
        };

        return {
          ...menu,
          items: mapItems(menu.items),
          updatedAt: new Date().toISOString()
        };
      });
      persistLocally(next);
      return next;
    });
  }, []);

  // Move item up/down in ordering
  const moveMenuItem = useCallback((menuId: string, itemId: string, direction: 'up' | 'down') => {
    setMenus(prev => {
      const next = prev.map(menu => {
        if (menu.id !== menuId) return menu;

        const items = [...menu.items];
        const idx = items.findIndex(i => i.id === itemId);
        if (idx === -1) return menu;

        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= items.length) return menu;

        // Swap
        const temp = items[idx];
        items[idx] = items[targetIdx];
        items[targetIdx] = temp;

        const reordered = items.map((it, i) => ({ ...it, order: i }));
        return {
          ...menu,
          items: reordered,
          updatedAt: new Date().toISOString()
        };
      });
      persistLocally(next);
      return next;
    });
  }, []);

  // Indent (make item a child of the preceding item)
  const indentMenuItem = useCallback((menuId: string, itemId: string) => {
    setMenus(prev => {
      const next = prev.map(menu => {
        if (menu.id !== menuId) return menu;

        const items = [...menu.items];
        const idx = items.findIndex(i => i.id === itemId);
        if (idx <= 0) return menu; // Cannot indent first item

        const parentItem = items[idx - 1];
        const currentItem = items[idx];

        // Attach as child of parentItem
        const updatedParent: MenuItem = {
          ...parentItem,
          children: [...(parentItem.children || []), { ...currentItem, parentId: parentItem.id }]
        };

        items.splice(idx - 1, 2, updatedParent);
        return {
          ...menu,
          items,
          updatedAt: new Date().toISOString()
        };
      });
      persistLocally(next);
      return next;
    });
  }, []);

  // Outdent (make child item a root item)
  const outdentMenuItem = useCallback((menuId: string, itemId: string) => {
    setMenus(prev => {
      const next = prev.map(menu => {
        if (menu.id !== menuId) return menu;

        let extractedItem: MenuItem | null = null;
        let parentIndex = -1;

        const newItems: MenuItem[] = [];

        menu.items.forEach((item, pIdx) => {
          if (item.children && item.children.some(c => c.id === itemId)) {
            extractedItem = item.children.find(c => c.id === itemId)!;
            const updatedChildren = item.children.filter(c => c.id !== itemId);
            newItems.push({
              ...item,
              children: updatedChildren.length > 0 ? updatedChildren : undefined
            });
            parentIndex = pIdx;
          } else {
            newItems.push(item);
          }
        });

        if (extractedItem) {
          const itemToPromote: MenuItem = extractedItem;
          const rootItem: MenuItem = {
            id: itemToPromote.id,
            title: itemToPromote.title,
            url: itemToPromote.url,
            type: itemToPromote.type,
            target: itemToPromote.target,
            badge: itemToPromote.badge,
            badgeColor: itemToPromote.badgeColor,
            icon: itemToPromote.icon,
            order: itemToPromote.order,
            parentId: null
          };
          if (parentIndex !== -1) {
            // Insert right after parent
            newItems.splice(parentIndex + 1, 0, rootItem);
          }
        }

        const reordered = newItems.map((it, i) => ({ ...it, order: i }));
        return {
          ...menu,
          items: reordered,
          updatedAt: new Date().toISOString()
        };
      });
      persistLocally(next);
      return next;
    });
  }, []);

  // Save to server
  const saveMenuToServer = useCallback(async (token: string, menuToSave?: SiteMenu): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = menuToSave ? { menu: menuToSave } : { menus };
      const res = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to persist menu settings');
      }

      const resData = await res.json();
      if (resData.menus && Array.isArray(resData.menus)) {
        persistLocally(resData.menus);
      }
      return true;
    } catch (err: any) {
      console.error('Save menu error:', err);
      setSaveError(err.message || 'Failed to save menu changes');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [menus]);

  // Reset to default
  const resetMenusToServer = useCallback(async (token: string): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/menus/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to reset menus on server');
      }

      persistLocally(DEFAULT_MENUS);
      setSelectedMenuId(DEFAULT_MENUS[0].id);
      return true;
    } catch (err: any) {
      console.error('Reset menu error:', err);
      setSaveError(err.message || 'Failed to reset menus');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menus,
        activeHeaderMenu,
        selectedMenuId,
        setSelectedMenuId,
        createMenu,
        deleteMenu,
        updateMenu,
        addItemsToMenu,
        removeItemFromMenu,
        updateMenuItem,
        indentMenuItem,
        outdentMenuItem,
        moveMenuItem,
        saveMenuToServer,
        resetMenusToServer,
        refreshMenus,
        isLoading,
        isSaving,
        saveError
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
