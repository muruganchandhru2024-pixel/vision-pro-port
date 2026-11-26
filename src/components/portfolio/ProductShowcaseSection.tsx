import { useState } from 'react';
import { ArrowUpRight, Settings2, RotateCcw } from 'lucide-react';
import { ASSETS, COMPARISON_TARGETS } from '../../data/projectData';
import { DEFAULT_LAUNCH_APP_URL, buildAppRouteUrl } from '../../config/siteConfig';

interface ShowcaseScreen {
  id: string;
  route: string;
  title: string;
  caption: string;
  summary: string;
}

const SHOWCASE_SCREENS: ShowcaseScreen[] = [
  {
    id: 'dashboard',
    route: '/dashboard',
    title: 'Operations Dashboard',
    caption: 'Central command overview of intersection traffic volume, active camera feeds, and vehicle class distribution.',
    summary: 'Built in Next.js to aggregate real-time telemetry emitted by the FastAPI service layer.',
  },
  {
    id: 'detection',
    route: '/detection',
    title: 'YOLO Detection Lab',
    caption: 'Frame and video inference workspace displaying YOLO bounding boxes, class confidence, and tracking IDs.',
    summary: 'Connects directly to the Python OpenCV + YOLO detection pipeline for live visual inspection.',
  },
  {
    id: 'monitoring',
    route: '/monitoring',
    title: 'Live Intersection Monitoring',
    caption: 'Multi-camera quadrant view tracking approach queues and crosswalk occupancy across corridors.',
    summary: 'Displays simultaneous RTSP or uploaded camera streams with virtual lane polygon overlays.',
  },
  {
    id: 'heatmap',
    route: '/heatmap',
    title: 'Spatial Traffic Heatmap',
    caption: 'Visualizes cumulative vehicle dwell density and congestion pockets over intersection geometry.',
    summary: 'Translates persistent OpenCV tracking centroids into spatial dwell intensity layers.',
  },
  {
    id: 'smart-signal',
    route: '/smart-signal',
    title: 'Smart Signal Controller',
    caption: 'Adaptive traffic light phase logic responding dynamically to queue pressure across approaches.',
    summary: 'Balances North–South and East–West green intervals based on detected approach demand.',
  },
  {
    id: 'reports',
    route: '/reports',
    title: 'Traffic Audit Reports',
    caption: 'Structured session logs, directional turn counts, and exportable mobility audit summaries.',
    summary: 'Provides historical breakdown tables and downloadable CSV/JSON outputs from the local app.',
  },
];

interface ProductShowcaseSectionProps {
  launchAppUrl: string;
  onChangeLaunchAppUrl: (url: string) => void;
}

export function ProductShowcaseSection({
  launchAppUrl,
  onChangeLaunchAppUrl,
}: ProductShowcaseSectionProps) {
  const [activeScreenId, setActiveScreenId] = useState<string>('detection');
  const [showConfig, setShowConfig] = useState(false);

  const activeScreen =
    SHOWCASE_SCREENS.find((s) => s.id === activeScreenId) ?? SHOWCASE_SCREENS[0];
  const fullTargetUrl = buildAppRouteUrl(launchAppUrl, activeScreen.route);

  return (
    <section id="showcase" className="py-24 md:py-36 border-t border-white/10 bg-[#06070A]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-mono tracking-wider text-cyan-400 mb-4">
              05. INTERACTIVE PROJECT SHOWCASE
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#F4F3EF] text-balance">
              Inside the working VisionFlow AI application.
            </h2>
            <p className="mt-4 text-base text-[#9BA1AE] leading-relaxed">
              Explore the six specialized modules built inside the Next.js and FastAPI platform, or launch directly into your local instance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowConfig((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#0D1017] px-4 py-2.5 text-xs font-medium text-[#9BA1AE] hover:text-[#F4F3EF] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Configure App URL</span>
            </button>

            <a
              href={fullTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#F4F3EF] px-5 py-2.5 text-sm font-semibold text-[#06070A] hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open {activeScreen.title}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Optional Local URL Configuration Drawer */}
        {showConfig && (
          <div className="mb-8 p-5 rounded-xl border border-cyan-400/30 bg-[#0D1017] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-400">
                LAUNCH APPLICATION TARGET URL
              </div>
              <p className="text-xs text-[#9BA1AE]">
                Point all Launch Application buttons to your running Next.js instance (default: {DEFAULT_LAUNCH_APP_URL}).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="url"
                value={launchAppUrl}
                onChange={(e) => onChangeLaunchAppUrl(e.target.value)}
                aria-label="Launch Application Base URL"
                placeholder="http://localhost:3001"
                className="w-64 sm:w-72 rounded-md border border-white/15 bg-[#06070A] px-3 py-2 font-mono text-xs text-[#F4F3EF] focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => onChangeLaunchAppUrl(DEFAULT_LAUNCH_APP_URL)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-2 text-xs text-[#9BA1AE] hover:text-[#F4F3EF] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Module Switcher */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SHOWCASE_SCREENS.map((screen) => {
            const active = screen.id === activeScreenId;
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => setActiveScreenId(screen.id)}
                className={`px-4 py-2 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#F4F3EF] text-[#06070A] border-[#F4F3EF]'
                    : 'bg-[#0D1017] text-[#9BA1AE] border-white/10 hover:text-[#F4F3EF]'
                }`}
              >
                {screen.title}
              </button>
            );
          })}
        </div>

        {/* Luxury Obsidian Browser Frame Preview */}
        <div className="rounded-xl border border-white/15 bg-[#0D1017] overflow-hidden shadow-2xl">
          <div className="h-11 px-4 border-b border-white/10 bg-[#090B10] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            </div>
            <div className="px-4 py-1 rounded bg-[#06070A] border border-white/10 text-xs font-mono text-[#9BA1AE] truncate max-w-md">
              {fullTargetUrl}
            </div>
            <a
              href={fullTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 whitespace-nowrap shrink-0"
            >
              Launch Route →
            </a>
          </div>

          <div className="p-6 md:p-10 bg-[#06070A] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="font-mono text-xs text-cyan-400">
                Application Module · {activeScreen.route}
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-[#F4F3EF]">
                {activeScreen.title}
              </h3>
              <p className="text-base text-[#D1D5DB] leading-relaxed">
                {activeScreen.caption}
              </p>
              <p className="text-sm text-[#9BA1AE] leading-relaxed border-t border-white/10 pt-4">
                {activeScreen.summary}
              </p>
              <div className="pt-2">
                <a
                  href={fullTargetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-[#0D1017] px-5 py-2.5 text-xs font-semibold text-[#F4F3EF] hover:border-cyan-400 hover:text-cyan-200 transition-colors"
                >
                  <span>Launch {activeScreen.route} in Local App</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Visual Stage Preview tailored to each module */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-[#0D1017]">
                <img
                  src={
                    activeScreen.id === 'monitoring' || activeScreen.id === 'dashboard'
                      ? ASSETS.highwayCorridor
                      : ASSETS.intersectionRaw
                  }
                  alt={`${activeScreen.title} visual showcase`}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    activeScreen.id === 'heatmap'
                      ? 'brightness-75 contrast-125'
                      : activeScreen.id === 'reports'
                      ? 'opacity-35 grayscale'
                      : 'opacity-85'
                  }`}
                />

                {/* Contextual SVG Showcase Layer */}
                <svg
                  viewBox="0 0 1000 562.5"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 w-full h-full"
                >
                  {activeScreen.id === 'detection' &&
                    COMPARISON_TARGETS.map((t) => (
                      <g key={t.id}>
                        <rect
                          x={t.x * 10}
                          y={t.y * 5.625}
                          width={t.w * 10}
                          height={t.h * 5.625}
                          fill="rgba(34,211,238,0.12)"
                          stroke="#22d3ee"
                          strokeWidth="2"
                        />
                        <text
                          x={t.x * 10 + 4}
                          y={Math.max(16, t.y * 5.625 - 6)}
                          fill="#22d3ee"
                          fontSize="11"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {t.id} {t.label}
                        </text>
                      </g>
                    ))}

                  {activeScreen.id === 'heatmap' && (
                    <g>
                      <defs>
                        <radialGradient id="showcase-heat-1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="460" cy="435" r="145" fill="url(#showcase-heat-1)" />
                      <circle cx="520" cy="175" r="95" fill="url(#showcase-heat-1)" />
                      <circle cx="775" cy="295" r="85" fill="url(#showcase-heat-1)" />
                    </g>
                  )}

                  {activeScreen.id === 'monitoring' && (
                    <g stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                      <line x1="500" y1="0" x2="500" y2="562.5" />
                      <line x1="0" y1="281.25" x2="1000" y2="281.25" />
                      <text x="24" y="34" fill="#22d3ee" fontSize="13" fontFamily="JetBrains Mono, monospace">CAM-01 · NORTH</text>
                      <text x="524" y="34" fill="#22d3ee" fontSize="13" fontFamily="JetBrains Mono, monospace">CAM-02 · EAST</text>
                      <text x="24" y="315" fill="#22d3ee" fontSize="13" fontFamily="JetBrains Mono, monospace">CAM-03 · RAMP</text>
                      <text x="524" y="315" fill="#22d3ee" fontSize="13" fontFamily="JetBrains Mono, monospace">CAM-04 · TRANSIT</text>
                    </g>
                  )}

                  {activeScreen.id === 'smart-signal' && (
                    <g>
                      <rect x="40" y="40" width="320" height="110" rx="8" fill="rgba(6,7,10,0.88)" stroke="#34d399" strokeWidth="1.5" />
                      <text x="62" y="76" fill="#34d399" fontSize="13" fontFamily="JetBrains Mono, monospace">PHASE A · NORTH–SOUTH GREEN</text>
                      <text x="62" y="106" fill="#F4F3EF" fontSize="15" fontFamily="DM Sans, sans-serif">Adaptive Extension Active</text>
                      <text x="62" y="130" fill="#9BA1AE" fontSize="12" fontFamily="JetBrains Mono, monospace">Crosswalk Protection Verified</text>
                    </g>
                  )}
                </svg>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#06070A] to-transparent flex items-center justify-between text-xs">
                  <span className="font-mono text-[#F4F3EF]">{activeScreen.route}</span>
                  <span className="text-[#9BA1AE]">External Next.js + FastAPI Workspace</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
