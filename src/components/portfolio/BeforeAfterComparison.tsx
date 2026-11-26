import React, { useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { ASSETS, COMPARISON_TARGETS } from '../../data/projectData';

export function BeforeAfterComparison() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [splitPercent, setSplitPercent] = useState(52);
  const [dragging, setDragging] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showZones, setShowZones] = useState(true);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPercent(Math.max(4, Math.min(96, pct)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitPercent((v) => Math.max(4, v - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitPercent((v) => Math.min(96, v + 4));
    }
  };

  const getColor = (label: string) => {
    switch (label) {
      case 'bus':
        return '#a78bfa';
      case 'truck':
        return '#f59e0b';
      case 'pedestrian':
        return '#34d399';
      case 'signal':
        return '#fb7185';
      default:
        return '#22d3ee';
    }
  };

  return (
    <section className="py-24 md:py-36 border-t border-white/10 bg-[#06070A]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-mono tracking-wider text-cyan-400 mb-4">
              02. THE WORLD BEFORE VISIONFLOW
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#F4F3EF] text-balance">
              From passive pixels to structured urban perception.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBoxes((v) => !v)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showBoxes
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'
                  : 'border-white/10 bg-[#0D1017] text-[#9BA1AE] hover:text-[#F4F3EF]'
              }`}
            >
              Bounding Boxes
            </button>
            <button
              type="button"
              onClick={() => setShowVectors((v) => !v)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showVectors
                  ? 'border-violet-400/40 bg-violet-400/10 text-violet-200'
                  : 'border-white/10 bg-[#0D1017] text-[#9BA1AE] hover:text-[#F4F3EF]'
              }`}
            >
              Trajectory Vectors
            </button>
            <button
              type="button"
              onClick={() => setShowZones((v) => !v)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showZones
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                  : 'border-white/10 bg-[#0D1017] text-[#9BA1AE] hover:text-[#F4F3EF]'
              }`}
            >
              Crosswalk &amp; Lane Zones
            </button>
          </div>
        </div>

        {/* Interactive Split Frame */}
        <div
          ref={containerRef}
          role="slider"
          tabIndex={0}
          aria-label="Compare raw traffic camera feed with VisionFlow AI detection annotations"
          aria-valuemin={4}
          aria-valuemax={96}
          aria-valuenow={Math.round(splitPercent)}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/15 bg-[#0D1017] select-none touch-none cursor-ew-resize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          {/* Base Layer (Before: Raw CCTV Feed) */}
          <img
            src={ASSETS.intersectionRaw}
            alt="Unannotated municipal four-way traffic camera footage"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Top-left Label: Before */}
          <div className="pointer-events-none absolute top-4 left-4 z-10 bg-[#06070A]/85 border border-white/15 px-3 py-1.5 rounded text-xs font-mono text-[#F4F3EF]">
            Raw Municipal Camera · Unprocessed Feed
          </div>

          {/* Right Clipped Layer (After: VisionFlow AI Annotated Feed) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ clipPath: `inset(0 0 0 ${splitPercent}%)` }}
          >
            <img
              src={ASSETS.intersectionRaw}
              alt="VisionFlow AI computer vision annotated traffic frame"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.88] contrast-[1.08]"
            />

            {/* Precision SVG Overlay aligned 1:1 to image coordinates */}
            <svg
              viewBox="0 0 1000 562.5"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              {showZones && (
                <g>
                  {/* South Crosswalk Pedestrian Zone */}
                  <polygon
                    points="220,305 780,360 765,425 205,355"
                    fill="rgba(52, 211, 153, 0.12)"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  {/* Northbound Queue Counting Zone */}
                  <polygon
                    points="210,390 785,435 760,555 180,555"
                    fill="rgba(34, 211, 238, 0.09)"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                </g>
              )}

              {COMPARISON_TARGETS.map((t) => {
                const color = getColor(t.label);
                const x = t.x * 10;
                const y = t.y * 5.625;
                const w = t.w * 10;
                const h = t.h * 5.625;
                const cx = x + w / 2;
                const cy = y + h / 2;

                return (
                  <g key={t.id}>
                    {showBoxes && (
                      <>
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          fill={`${color}18`}
                          stroke={color}
                          strokeWidth="1.8"
                        />
                        <rect x={x} y={Math.max(0, y - 18)} width={104} height={18} fill={color} />
                        <text
                          x={x + 5}
                          y={Math.max(12, y - 5)}
                          fill="#06070A"
                          fontSize="10.5"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight="600"
                        >
                          {t.id} {t.label.toUpperCase()}
                        </text>
                      </>
                    )}

                    {showVectors && t.vector && (
                      <g>
                        <line
                          x1={cx}
                          y1={cy}
                          x2={cx + t.vector.dx * 11}
                          y2={cy + t.vector.dy * 11}
                          stroke="#c4b5fd"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <circle
                          cx={cx + t.vector.dx * 11}
                          cy={cy + t.vector.dy * 11}
                          r="3.2"
                          fill="#c4b5fd"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Top-right Label: After */}
            <div className="absolute top-4 right-4 z-10 bg-[#06070A]/85 border border-cyan-400/40 px-3 py-1.5 rounded text-xs font-mono text-cyan-300">
              VisionFlow Inference · 14 Tracked Objects
            </div>
          </div>

          {/* Vertical Divider Handle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.65)]"
            style={{ left: `${splitPercent}%` }}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#06070A] border border-cyan-300 flex items-center justify-center text-cyan-300 shadow-lg">
              <MoveHorizontal className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#9BA1AE]">
          <p>
            Drag slider or use Left/Right arrow keys to inspect detection boxes, tracking IDs, and pedestrian crosswalk zones.
          </p>
          <p className="font-mono tabular-nums text-[#F4F3EF]">
            Visible Classes: Car · SUV · Transit Bus · Freight Van · Pedestrian · Signal
          </p>
        </div>
      </div>
    </section>
  );
}
