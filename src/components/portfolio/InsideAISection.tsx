import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PIPELINE_STAGES, ASSETS, COMPARISON_TARGETS } from '../../data/projectData';

export function InsideAISection() {
  const [activeStage, setActiveStage] = useState(0);
  const current = PIPELINE_STAGES[activeStage];

  return (
    <section id="innovation" className="py-24 md:py-36 border-t border-white/10 bg-[#06070A]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-mono tracking-wider text-cyan-400 mb-4">
            03. INSIDE THE AI
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#F4F3EF] text-balance">
            How raw video frames become urban mobility intelligence.
          </h2>
          <p className="mt-5 text-base md:text-lg text-[#9BA1AE] leading-relaxed">
            Every frame passes through five deterministic stages — transforming unstructured RGB pixels into calibrated ground-plane coordinates, tracked trajectories, and signal phase adjustments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: 5 Interactive Pipeline Stages */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-white/10 border-y border-white/10">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isActive = idx === activeStage;
              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`text-left py-5 px-4 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive ? 'bg-[#0D1017]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`font-mono text-xs tabular-nums ${
                          isActive ? 'text-cyan-400' : 'text-[#9BA1AE]'
                        }`}
                      >
                        {stage.step}
                      </span>
                      <h3
                        className={`font-display text-lg font-semibold ${
                          isActive ? 'text-[#F4F3EF]' : 'text-[#9BA1AE]'
                        }`}
                      >
                        {stage.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-1.5 pl-7 text-sm text-[#9BA1AE]">{stage.subtitle}</p>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pl-7 space-y-2"
                    >
                      <p className="text-sm text-[#D1D5DB] leading-relaxed">{stage.description}</p>
                      <p className="font-mono text-xs text-cyan-300/90">{stage.tensorNote}</p>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Sticky Visual Pipeline Stage Canvas */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="rounded-xl border border-white/10 bg-[#0D1017] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 text-xs">
                <span className="font-mono text-[#9BA1AE]">
                  Stage {current.step} · {current.title}
                </span>
                <span className="font-mono text-cyan-400 tabular-nums">
                  {activeStage + 1} / {PIPELINE_STAGES.length}
                </span>
              </div>

              <div className="relative aspect-video bg-[#06070A] overflow-hidden">
                <img
                  src={ASSETS.intersectionRaw}
                  alt="Computer vision processing stage visualization"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    activeStage === 0
                      ? 'opacity-70 saturate-75'
                      : activeStage === 1
                      ? 'opacity-55 contrast-125'
                      : 'opacity-45 grayscale-[30%]'
                  }`}
                />

                <AnimatePresence mode="wait">
                  <motion.svg
                    key={activeStage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    viewBox="0 0 1000 562.5"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* Stage 0: Homography Calibration Perspective Grid */}
                    {activeStage === 0 && (
                      <g stroke="#22d3ee" strokeOpacity="0.65" strokeWidth="1.2">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <line
                            key={`h-${i}`}
                            x1={120 + i * 25}
                            y1={120 + i * 65}
                            x2={920 - i * 10}
                            y2={150 + i * 62}
                          />
                        ))}
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <line
                            key={`v-${i}`}
                            x1={220 + i * 105}
                            y1={105}
                            x2={80 + i * 135}
                            y2={550}
                          />
                        ))}
                        <circle cx="515" cy="340" r="6" fill="#22d3ee" />
                        <text
                          x="530"
                          y="344"
                          fill="#22d3ee"
                          fontSize="13"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          HOMOGRAPHY ORIGIN (0, 0)
                        </text>
                      </g>
                    )}

                    {/* Stage 1: Multi-Class Detections */}
                    {activeStage === 1 &&
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
                            fill="#F4F3EF"
                            fontSize="11"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {t.label}
                          </text>
                        </g>
                      ))}

                    {/* Stage 2: Persistent Tracking Paths */}
                    {activeStage === 2 &&
                      COMPARISON_TARGETS.filter((t) => t.vector).map((t) => {
                        const cx = (t.x + t.w / 2) * 10;
                        const cy = (t.y + t.h / 2) * 5.625;
                        const tx = cx - (t.vector!.dx * 22);
                        const ty = cy - (t.vector!.dy * 22);
                        return (
                          <g key={t.id}>
                            <line
                              x1={tx}
                              y1={ty}
                              x2={cx}
                              y2={cy}
                              stroke="#a78bfa"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <circle cx={cx} cy={cy} r="5" fill="#22d3ee" />
                            <rect x={cx + 8} y={cy - 10} width="64" height="18" fill="#06070A" stroke="#a78bfa" />
                            <text
                              x={cx + 13}
                              y={cy + 3}
                              fill="#e9d5ff"
                              fontSize="10.5"
                              fontFamily="JetBrains Mono, monospace"
                            >
                              {t.id}
                            </text>
                          </g>
                        );
                      })}

                    {/* Stage 3: Zone & Crosswalk Counting */}
                    {activeStage === 3 && (
                      <g>
                        <polygon
                          points="220,305 780,360 765,425 205,355"
                          fill="rgba(52, 211, 153, 0.2)"
                          stroke="#34d399"
                          strokeWidth="2.5"
                        />
                        <text
                          x="230"
                          y="335"
                          fill="#a7f3d0"
                          fontSize="14"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight="600"
                        >
                          ZONE A · CROSSWALK OCCUPIED (3 PEDESTRIANS)
                        </text>

                        <polygon
                          points="210,390 785,435 760,555 180,555"
                          fill="rgba(34, 211, 238, 0.16)"
                          stroke="#22d3ee"
                          strokeWidth="2.5"
                        />
                        <text
                          x="220"
                          y="430"
                          fill="#a5f3fc"
                          fontSize="14"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight="600"
                        >
                          ZONE B · NB APPROACH QUEUE (4 VEHICLES)
                        </text>
                      </g>
                    )}

                    {/* Stage 4: Adaptive Signal Output */}
                    {activeStage === 4 && (
                      <g>
                        <rect x="65" y="340" width="380" height="140" rx="6" fill="rgba(6,7,10,0.88)" stroke="#22d3ee" strokeWidth="1.5" />
                        <text x="88" y="375" fill="#22d3ee" fontSize="13" fontFamily="JetBrains Mono, monospace">
                          ADAPTIVE PHASE RECOMMENDATION
                        </text>
                        <text x="88" y="405" fill="#F4F3EF" fontSize="15" fontFamily="DM Sans, sans-serif">
                          Hold East-West Red while South Crosswalk clears
                        </text>
                        <text x="88" y="432" fill="#9BA1AE" fontSize="13" fontFamily="JetBrains Mono, monospace">
                          NB Queue: 4 · Transit Priority: Bus TRK-041
                        </text>
                        <text x="88" y="458" fill="#34d399" fontSize="13" fontFamily="JetBrains Mono, monospace">
                          Next Phase: NB/SB Green (+8s adaptive extension)
                        </text>
                      </g>
                    )}
                  </motion.svg>
                </AnimatePresence>
              </div>

              <div className="px-5 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#9BA1AE]">
                <span>Select any pipeline step on the left to inspect intermediate computer vision state.</span>
                <div className="flex items-center gap-1.5">
                  {PIPELINE_STAGES.map((s, idx) => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setActiveStage(idx)}
                      aria-label={`Jump to stage ${s.step}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeStage ? 'w-6 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
