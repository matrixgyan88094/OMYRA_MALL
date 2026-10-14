// Utility to safely resolve image paths across local dev, Vite bundle, and Vercel serverless deployments
import heroImg from '@/src/assets/images/hero_white_orange_1790435384152.jpg';
import figmaImg from '@/src/assets/images/product_figma_system_1790434781926.jpg';
import assets3dImg from '@/src/assets/images/product_3d_assets_1790434793362.jpg';
import boilerplateImg from '@/src/assets/images/product_dev_boilerplate_1790434806396.jpg';
import kromaMainImg from '@/src/assets/images/kroma_ui_main_cover_1791951283279.jpg';
import kromaOverviewImg from '@/src/assets/images/kroma_overview_showcase_1791951283313.jpg';
import botigaImg from '@/src/assets/images/botiga_wordpress_plugin_1791951284862.jpg';
import kineticAudioImg from '@/src/assets/images/kinetic_motion_audio_1791951284755.jpg';
import checkoutHeroImg from '@/src/assets/images/checkout_safe_secure_hero_1791963723232.jpg';

export { checkoutHeroImg };

export const STATIC_IMAGE_MAP: Record<string, string> = {
  'checkout_safe_secure_hero': checkoutHeroImg,
  'kroma_ui_main_cover': kromaMainImg,
  'kroma_ui': kromaMainImg,
  'kroma_overview': kromaOverviewImg,
  'product_figma_system': figmaImg,
  'figma': figmaImg,
  'product_3d_assets': assets3dImg,
  'spatial_3d': assets3dImg,
  'product_dev_boilerplate': boilerplateImg,
  'nextjs': boilerplateImg,
  'botiga_wordpress': botigaImg,
  'botiga': botigaImg,
  'kinetic_motion_audio': kineticAudioImg,
  'kinetic_audio': kineticAudioImg,
  'hero_white_orange': heroImg,
  'hero_marketplace': heroImg,
};

export function resolveProductImage(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl) return heroImg;

  // 1. If it's already an absolute http/https URL or data: base64, return as-is
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('data:')) {
    return pathOrUrl;
  }

  // 2. If it's a blob URL
  if (pathOrUrl.startsWith('blob:')) {
    return pathOrUrl;
  }

  // 3. Match against known asset bundles
  const lower = pathOrUrl.toLowerCase();

  if (lower.includes('kroma_ui_main_cover') || lower.includes('kroma_ui') || lower.includes('kroma-ui')) {
    return kromaMainImg;
  }
  if (lower.includes('kroma_overview')) {
    return kromaOverviewImg;
  }
  if (lower.includes('botiga')) {
    return botigaImg;
  }
  if (lower.includes('kinetic') || lower.includes('motion_audio')) {
    return kineticAudioImg;
  }
  if (lower.includes('figma') || lower.includes('design_system')) {
    return figmaImg;
  }
  if (lower.includes('3d_assets') || lower.includes('spatial')) {
    return assets3dImg;
  }
  if (lower.includes('boilerplate') || lower.includes('next15') || lower.includes('saas')) {
    return boilerplateImg;
  }

  // 4. If path begins with /src/assets/images/, map to /assets/images/ for public folder static serving in Vercel
  if (pathOrUrl.startsWith('/src/assets/images/')) {
    const filename = pathOrUrl.replace('/src/assets/images/', '');
    // Check if filename matches any keyword
    for (const [key, asset] of Object.entries(STATIC_IMAGE_MAP)) {
      if (filename.includes(key)) {
        return asset;
      }
    }
    return `/assets/images/${filename}`;
  }

  return pathOrUrl;
}
