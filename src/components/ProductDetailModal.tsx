import React, { useState } from 'react';
import {
  X,
  Star,
  Check,
  Download,
  Copy,
  Layers,
  Code2,
  Box,
  Volume2,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { DigitalProduct, LicenseTier } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: DigitalProduct;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, cart, setIsCartOpen } = useStore();
  const [selectedTier, setSelectedTier] = useState<LicenseTier>('personal');
  const [activeTab, setActiveTab] = useState<'preview' | 'includes' | 'specs' | 'reviews'>('preview');

  // Interactive UI Kit demo state
  const [demoActiveTheme, setDemoActiveTheme] = useState<'orange' | 'dark' | 'white'>('orange');
  const [demoSwitchState, setDemoSwitchState] = useState(true);
  const [demoSliderVal, setDemoSliderVal] = useState(75);

  // Code preview state
  const [selectedCodeFile, setSelectedCodeFile] = useState<'page' | 'auth' | 'billing'>('page');
  const [copiedCode, setCopiedCode] = useState(false);

  // 3D viewer state
  const [rotation, setRotation] = useState({ x: 20, y: 35 });
  const [isWireframe, setIsWireframe] = useState(false);

  // Audio player state with Web Audio API synthesis
  const [activeSoundName, setActiveSoundName] = useState<string | null>(null);

  const isItemInCart = cart.some(
    (item) => item.product.id === product.id && item.selectedTier === selectedTier
  );

  const currentLicense = product.licenses[selectedTier];

  // Synthesize realistic UI sound effects via Web Audio API
  const playSynthesizedSound = (type: 'tap' | 'confirm' | 'toggle' | 'ambient') => {
    setActiveSoundName(type);
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'tap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'confirm') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start(ctx.currentTime + 0.08);
        osc1.stop(ctx.currentTime + 0.08);
        osc2.stop(ctx.currentTime + 0.3);
      } else if (type === 'toggle') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'ambient') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {
      // Audio not supported in environment
    }
    setTimeout(() => setActiveSoundName(null), 400);
  };

  const copyCodeSnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-zinc-950/60 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl rounded-none sm:rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[92vh]">
        {/* Top Sticky Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-900">{product.title}</span>
            <span>·</span>
            <span>{product.format}</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Header & Product Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Product Images & Interactive Preview Stage */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Cover Showcase */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                <img
                  src={product.coverImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Interactive Demo Preview Stage */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                      Live Asset Preview
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">Interactive Playground</span>
                </div>

                {/* Live Demo Variant 1: UI Kit / Figma Tokens */}
                {product.demoType === 'ui-kit' && (
                  <div className="space-y-4">
                    <div className="text-xs text-zinc-600">
                      Test component variants, auto-layout tokens, and theme reactive state:
                    </div>

                    {/* Color Preset Switcher */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Theme:</span>
                      <button
                        onClick={() => setDemoActiveTheme('orange')}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                          demoActiveTheme === 'orange'
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        Vibrant Orange
                      </button>
                      <button
                        onClick={() => setDemoActiveTheme('dark')}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                          demoActiveTheme === 'dark'
                            ? 'bg-zinc-900 text-white shadow-sm'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        Deep Slate
                      </button>
                      <button
                        onClick={() => setDemoActiveTheme('white')}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                          demoActiveTheme === 'white'
                            ? 'bg-white border border-orange-500 text-orange-600 shadow-sm'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        Pure White
                      </button>
                    </div>

                    {/* Interactive Component Sandbox */}
                    <div
                      className={`p-5 rounded-xl border transition-all ${
                        demoActiveTheme === 'orange'
                          ? 'border-orange-200 bg-orange-50/50'
                          : demoActiveTheme === 'dark'
                          ? 'border-zinc-800 bg-zinc-900 text-white'
                          : 'border-zinc-200 bg-white text-zinc-900'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => playSynthesizedSound('tap')}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 ${
                            demoActiveTheme === 'orange'
                              ? 'bg-orange-600 text-white hover:bg-orange-700'
                              : demoActiveTheme === 'dark'
                              ? 'bg-white text-zinc-950 hover:bg-zinc-200'
                              : 'bg-zinc-900 text-white hover:bg-zinc-800'
                          }`}
                        >
                          Primary Action
                        </button>

                        <button
                          onClick={() => playSynthesizedSound('confirm')}
                          className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                            demoActiveTheme === 'dark'
                              ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                              : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          Secondary Outline
                        </button>

                        {/* Interactive Switch */}
                        <div
                          onClick={() => {
                            setDemoSwitchState(!demoSwitchState);
                            playSynthesizedSound('toggle');
                          }}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            demoSwitchState ? 'bg-orange-600' : 'bg-zinc-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              demoSwitchState ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Interactive Slider */}
                      <div className="mt-4 pt-3 border-t border-zinc-200/60">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={demoActiveTheme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}>
                            Border Radius Variable
                          </span>
                          <span className="font-mono">{demoSliderVal}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="24"
                          value={demoSliderVal}
                          onChange={(e) => setDemoSliderVal(Number(e.target.value))}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Demo Variant 2: Fullstack Code Inspector */}
                {product.demoType === 'code-preview' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {(['page', 'auth', 'billing'] as const).map((file) => (
                          <button
                            key={file}
                            onClick={() => setSelectedCodeFile(file)}
                            className={`px-3 py-1 text-xs rounded-md font-mono transition-colors ${
                              selectedCodeFile === file
                                ? 'bg-orange-600 text-white font-semibold'
                                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                            }`}
                          >
                            {file === 'page'
                              ? 'app/page.tsx'
                              : file === 'auth'
                              ? 'lib/auth.ts'
                              : 'api/checkout/route.ts'}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          copyCodeSnippet(
                            selectedCodeFile === 'page'
                              ? `// Production Server Component\nimport { createServerClient } from '@/lib/supabase';\n\nexport default async function DashboardPage() {\n  const user = await getUser();\n  return <DashboardLayout user={user} />;\n}`
                              : `// Enterprise Auth Provider\nexport async function verifySession(token: string) {\n  return jwt.verify(token, process.env.SECRET_KEY!);\n}`
                          )
                        }
                        className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
                      >
                        {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="rounded-lg bg-zinc-900 p-4 font-mono text-xs text-zinc-200 overflow-x-auto border border-zinc-800">
                      <pre className="leading-relaxed">
                        {selectedCodeFile === 'page' && (
                          <code>
                            {`// Next.js 15 Server Component
import { Suspense } from 'react';
import { CustomerAnalytics } from '@/components/analytics';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <CustomerAnalytics userId={user.id} />
      </Suspense>
    </main>
  );
}`}
                          </code>
                        )}
                        {selectedCodeFile === 'auth' && (
                          <code>
                            {`// Clean TypeScript Auth Helpers
import { cookies } from 'next/headers';
import { verifyJwtToken } from '@/lib/jwt';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyJwtToken(token);
}`}
                          </code>
                        )}
                        {selectedCodeFile === 'billing' && (
                          <code>
                            {`// Webhook Handler with Instant Verification
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const signature = req.headers.get('stripe-signature');
  // Full auto-fulfillment pipeline included
  return NextResponse.json({ received: true });
}`}
                          </code>
                        )}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Live Demo Variant 3: 3D Spatial Simulator */}
                {product.demoType === '3d-viewer' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-600">
                      <span>Interactive Spatial Orbit (Click & drag sliders):</span>
                      <button
                        onClick={() => setIsWireframe(!isWireframe)}
                        className="text-orange-600 font-semibold hover:underline"
                      >
                        {isWireframe ? 'View Solid Render' : 'View Wireframe Mesh'}
                      </button>
                    </div>

                    <div className="relative aspect-video w-full rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                      {/* CSS 3D Cube Render */}
                      <div
                        className="relative w-28 h-28 transform-style-3d transition-transform duration-100"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                        }}
                      >
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-xs font-mono font-bold transition-all ${
                            isWireframe
                              ? 'border-2 border-orange-500 bg-transparent text-orange-400'
                              : 'bg-orange-600 text-white border border-white/20'
                          }`}
                          style={{ transform: 'translateZ(56px)' }}
                        >
                          FRONT
                        </div>
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-xs font-mono font-bold transition-all ${
                            isWireframe
                              ? 'border-2 border-orange-500 bg-transparent text-orange-400'
                              : 'bg-zinc-800 text-zinc-300 border border-white/10'
                          }`}
                          style={{ transform: 'rotateY(180deg) translateZ(56px)' }}
                        >
                          BACK
                        </div>
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-xs font-mono font-bold transition-all ${
                            isWireframe
                              ? 'border-2 border-orange-500 bg-transparent text-orange-400'
                              : 'bg-orange-700 text-white border border-white/10'
                          }`}
                          style={{ transform: 'rotateY(-90deg) translateZ(56px)' }}
                        >
                          LEFT
                        </div>
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-xs font-mono font-bold transition-all ${
                            isWireframe
                              ? 'border-2 border-orange-500 bg-transparent text-orange-400'
                              : 'bg-zinc-700 text-zinc-200 border border-white/10'
                          }`}
                          style={{ transform: 'rotateY(90deg) translateZ(56px)' }}
                        >
                          RIGHT
                        </div>
                      </div>

                      <div className="absolute bottom-2 right-3 text-[10px] font-mono text-zinc-400">
                        Pitch: {rotation.x}° | Yaw: {rotation.y}°
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] text-zinc-500 block mb-1">Rotate Pitch (X)</span>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          value={rotation.x}
                          onChange={(e) => setRotation({ ...rotation, x: Number(e.target.value) })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-500 block mb-1">Rotate Orbit (Y)</span>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={rotation.y}
                          onChange={(e) => setRotation({ ...rotation, y: Number(e.target.value) })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Demo Variant 4: Tactile Audio Soundboard */}
                {product.demoType === 'audio-player' && (
                  <div className="space-y-3">
                    <div className="text-xs text-zinc-600">
                      Click below to trigger sample tactile feedback sounds:
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        onClick={() => playSynthesizedSound('tap')}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          activeSoundName === 'tap'
                            ? 'border-orange-500 bg-orange-100'
                            : 'border-zinc-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <Volume2 className="h-4 w-4 text-orange-600 mb-1" />
                        <div className="text-xs font-semibold text-zinc-900">Button Click</div>
                        <div className="text-[10px] text-zinc-500">Subtle tap</div>
                      </button>

                      <button
                        onClick={() => playSynthesizedSound('confirm')}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          activeSoundName === 'confirm'
                            ? 'border-orange-500 bg-orange-100'
                            : 'border-zinc-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <Volume2 className="h-4 w-4 text-orange-600 mb-1" />
                        <div className="text-xs font-semibold text-zinc-900">Success Bell</div>
                        <div className="text-[10px] text-zinc-500">Dual chime</div>
                      </button>

                      <button
                        onClick={() => playSynthesizedSound('toggle')}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          activeSoundName === 'toggle'
                            ? 'border-orange-500 bg-orange-100'
                            : 'border-zinc-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <Volume2 className="h-4 w-4 text-orange-600 mb-1" />
                        <div className="text-xs font-semibold text-zinc-900">Switch Haptic</div>
                        <div className="text-[10px] text-zinc-500">Low latency</div>
                      </button>

                      <button
                        onClick={() => playSynthesizedSound('ambient')}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          activeSoundName === 'ambient'
                            ? 'border-orange-500 bg-orange-100'
                            : 'border-zinc-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <Volume2 className="h-4 w-4 text-orange-600 mb-1" />
                        <div className="text-xs font-semibold text-zinc-900">Accent Chime</div>
                        <div className="text-[10px] text-zinc-500">Ambient swell</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Demo Variant 5: Interactive Motion Cards */}
                {product.demoType === 'interactive-cards' && (
                  <div className="space-y-3">
                    <div className="text-xs text-zinc-600">
                      Hover and interact with sample 60fps micro-animation tokens:
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-lg bg-white border border-zinc-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-orange-500">
                        <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-medium text-zinc-800 mt-2">Verified State</span>
                      </div>

                      <div className="p-4 rounded-lg bg-white border border-zinc-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-orange-500">
                        <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                          <RotateCcw className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-medium text-zinc-800 mt-2">Sync Loader</span>
                      </div>

                      <div className="p-4 rounded-lg bg-white border border-zinc-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-orange-500">
                        <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:translate-y-[-4px] transition-transform duration-300">
                          <Download className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-medium text-zinc-800 mt-2">Download Bounce</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Title & Ratings */}
                <div>
                  <div className="text-xs text-orange-600 font-semibold mb-1">
                    {product.category}
                  </div>

                  <h2 className="text-2xl font-bold text-zinc-950 leading-tight">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-zinc-900">
                        {product.rating}
                      </span>
                      <span>({product.reviewCount} customer reviews)</span>
                    </div>
                    <span>·</span>
                    <span>{product.salesCount.toLocaleString()} sales</span>
                  </div>
                </div>

                {/* License Tier Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Select License
                  </label>

                  <div className="space-y-2">
                    {(['personal', 'team', 'enterprise'] as LicenseTier[]).map((tierKey) => {
                      const tier = product.licenses[tierKey];
                      const isSelected = selectedTier === tierKey;

                      return (
                        <div
                          key={tierKey}
                          onClick={() => setSelectedTier(tierKey)}
                          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'border-orange-600 bg-orange-600'
                                    : 'border-zinc-300'
                                }`}
                              >
                                {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                              </div>
                              <span className="text-sm font-semibold text-zinc-900">{tier.label}</span>
                            </div>
                            <span className="text-base font-bold text-zinc-950 tabular-nums">
                              ${tier.price}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-zinc-500 pl-6">{tier.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Features Breakdown */}
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <span className="text-xs font-semibold text-zinc-900 block mb-2">
                    Included with {currentLicense.label}:
                  </span>
                  <ul className="space-y-1.5">
                    {currentLicense.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-600">
                        <Check className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-zinc-500">Price:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-zinc-950 tabular-nums">
                      ${currentLicense.price}
                    </span>
                    <span className="text-xs text-zinc-500">one-time</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, selectedTier);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold shadow-sm transition-all min-h-[44px] ${
                      isItemInCart
                        ? 'bg-zinc-100 text-orange-600 border border-orange-200'
                        : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-98'
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{isItemInCart ? 'In Bag (Add More)' : 'Add to Bag'}</span>
                  </button>

                  <button
                    onClick={() => {
                      addToCart(product, selectedTier);
                      setIsCartOpen(true);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 px-4 text-sm font-semibold text-white hover:bg-zinc-800 active:scale-98 transition-all min-h-[44px]"
                  >
                    <span>Instant Checkout</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Information Tabs */}
          <div className="pt-6 border-t border-zinc-200">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-orange-600 text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Key Highlights
              </button>
              <button
                onClick={() => setActiveTab('includes')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'includes'
                    ? 'bg-orange-600 text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Package Contents
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'specs'
                    ? 'bg-orange-600 text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Technical Specs
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-orange-600 text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Reviews ({product.reviewCount})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4">
              {activeTab === 'preview' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg border border-zinc-200 bg-white"
                    >
                      <Check className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                      <span className="text-xs text-zinc-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'includes' && (
                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <span className="text-xs font-semibold text-zinc-900 block mb-2">
                    Files delivered upon purchase:
                  </span>
                  <ul className="space-y-2">
                    {product.includes.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-700 font-mono">
                        <Download className="h-3.5 w-3.5 text-orange-600" />
                        <span>{file}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg border border-zinc-200 bg-white">
                    <span className="text-[11px] text-zinc-500 block">File Format</span>
                    <span className="text-sm font-semibold text-zinc-900 font-mono">{product.format}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 bg-white">
                    <span className="text-[11px] text-zinc-500 block">Uncompressed Size</span>
                    <span className="text-sm font-semibold text-zinc-900 font-mono">{product.fileSize}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 bg-white">
                    <span className="text-[11px] text-zinc-500 block">Current Version</span>
                    <span className="text-sm font-semibold text-zinc-900 font-mono">v{product.version}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 bg-white">
                    <span className="text-[11px] text-zinc-500 block">Last Updated</span>
                    <span className="text-sm font-semibold text-zinc-900">{product.lastUpdated}</span>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-zinc-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900">Sarah Chen</span>
                      <div className="flex items-center text-amber-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      "Cleanest Figma variables and token hierarchy I have ever encountered. Saved our team easily 60+ engineering hours."
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900">David M.</span>
                      <div className="flex items-center text-amber-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      "Extremely well documented code and components. Everything works out of the box."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
