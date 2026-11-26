import { useState } from 'react';
import { ARCHITECTURE_NODES, ASSETS, TECH_STACK } from '../../data/projectData';

export function ArchitectureSection() {
  const [selectedId, setSelectedId] = useState<string>(ARCHITECTURE_NODES[1].id);
  const selected = ARCHITECTURE_NODES.find((n) => n.id === selectedId) ?? ARCHITECTURE_NODES[0];

  return (
    <section id="engineering" className="py-24 md:py-36 border-t border-white/10 bg-[#06070A] bg-tech-grid">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-24">
        {/* Interactive System Architecture */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div className="max-w-2xl">
              <p className="text-xs font-mono tracking-wider text-cyan-400 mb-4">
                04. SYSTEM ARCHITECTURE
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#F4F3EF] text-balance">
                Engineering under the hood.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#9BA1AE] leading-relaxed">
              Click any node in the architecture pipeline to inspect how OpenCV ingestion, YOLO inference, spatial tracking, FastAPI endpoints, and the Next.js client work together.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0D1017]/95 p-6 md:p-8">
            <div className="relative">
              {/* Animated SVG data-flow trace */}
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 40"
                preserveAspectRatio="none"
                className="hidden lg:block w-full h-8 mb-2"
              >
                <line x1="90" y1="20" x2="910" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                <line
                  x1="90"
                  y1="20"
                  x2="910"
                  y2="20"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  strokeDasharray="10 18"
                >
                  <animate attributeName="stroke-dashoffset" from="56" to="0" dur="1.8s" repeatCount="indefinite" />
                </line>
                {[100, 300, 500, 700, 900].map((cx, idx) => (
                  <circle
                    key={cx}
                    cx={cx}
                    cy="20"
                    r="5"
                    fill={ARCHITECTURE_NODES[idx].id === selectedId ? '#22d3ee' : '#1e293b'}
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>

              {/* Five Clickable Architecture Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {ARCHITECTURE_NODES.map((node) => {
                  const active = node.id === selectedId;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedId(node.id)}
                      className={`text-left p-4 rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        active
                          ? 'border-cyan-400/60 bg-cyan-400/[0.08]'
                          : 'border-white/10 bg-[#06070A]/70 hover:border-white/25'
                      }`}
                    >
                      <div className="text-[11px] font-mono text-cyan-400 mb-1.5">{node.layer}</div>
                      <div className="font-display text-base font-semibold text-[#F4F3EF]">
                        {node.title}
                      </div>
                      <div className="mt-1.5 text-xs text-[#9BA1AE]">{node.tech}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Node Detail Inspector + Edge Hardware Visual */}
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs font-mono text-cyan-400 mb-2">
                    {selected.layer} · {selected.tech}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#F4F3EF]">
                    {selected.title}
                  </h3>
                  <p className="mt-3 text-base text-[#D1D5DB] leading-relaxed">
                    {selected.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F4F3EF] mb-2">
                      Engineering Decision
                    </h4>
                    <p className="text-sm text-[#9BA1AE] leading-relaxed">{selected.tradeoff}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F4F3EF] mb-2">
                      Technical Constraint
                    </h4>
                    <p className="text-sm text-[#9BA1AE] leading-relaxed">{selected.challenge}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative h-full min-h-[240px] rounded-lg overflow-hidden border border-white/10 bg-[#06070A]">
                  <img
                    src={ASSETS.edgeHardware}
                    alt="Matte black edge AI camera hardware unit on dark basalt surface"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070A]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-mono text-cyan-300">Camera &amp; Compute Target</p>
                    <p className="text-sm font-medium text-[#F4F3EF] mt-0.5">
                      Built for fixed municipal intersection streams and local GPU inference.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Technology Stack Grid */}
        <div>
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-mono tracking-wider text-cyan-400 mb-3">
              TECHNOLOGY STACK
            </p>
            <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-[#F4F3EF]">
              Tools powering the full-stack vision platform.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECH_STACK.map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-lg border border-white/10 bg-[#0D1017] flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="text-[11px] font-mono text-cyan-400">{item.category}</div>
                  <div className="font-display text-xl font-bold text-[#F4F3EF] mt-1">
                    {item.name}
                  </div>
                </div>
                <p className="text-xs text-[#9BA1AE] leading-relaxed">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
