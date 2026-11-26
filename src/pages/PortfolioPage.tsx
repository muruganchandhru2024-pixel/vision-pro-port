import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Globe } from 'lucide-react';
import { PortfolioNav } from '../components/portfolio/PortfolioNav';
import { TrafficIntersection3D } from '../components/three/TrafficIntersection3D';
import { MagneticButton } from '../components/portfolio/MagneticButton';
import { BeforeAfterComparison } from '../components/portfolio/BeforeAfterComparison';
import { InsideAISection } from '../components/portfolio/InsideAISection';
import { ArchitectureSection } from '../components/portfolio/ArchitectureSection';
import { ProductShowcaseSection } from '../components/portfolio/ProductShowcaseSection';
import { ASSETS, DEVELOPMENT_JOURNEY } from '../data/projectData';
import { DEFAULT_LAUNCH_APP_URL, SITE_CONFIG } from '../config/siteConfig';

const STORAGE_KEY = 'visionflow_launch_app_url';

export function PortfolioPage() {
  const [introDone, setIntroDone] = useState(false);
  const [launchAppUrl, setLaunchAppUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LAUNCH_APP_URL;
    } catch {
      return DEFAULT_LAUNCH_APP_URL;
    }
  });

  const handleLaunchUrlChange = (nextUrl: string) => {
    setLaunchAppUrl(nextUrl);
    try {
      localStorage.setItem(STORAGE_KEY, nextUrl);
    } catch {
      // Ignore storage quota errors
    }
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIntroDone(true);
      return;
    }
    const timer = window.setTimeout(() => setIntroDone(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const scrollToStory = () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resolvedLaunchUrl = launchAppUrl.trim() || DEFAULT_LAUNCH_APP_URL;

  return (
    <div className="min-h-screen bg-[#06070A] text-[#F4F3EF]">
      {/* Custom Minimal Loading Shutter */}
      <AnimatePresence>
        {!introDone && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#06070A] flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#F4F3EF]">
                VISIONFLOW
              </div>
              <div className="mt-3 w-40 h-px bg-white/15 mx-auto overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="h-full w-full bg-cyan-400"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Isolated 3-Zone Top Bar */}
      <PortfolioNav launchAppUrl={resolvedLaunchUrl} />

      <main>
        {/* HERO: Full-Viewport Cinematic 3D Intersection + Oversized Editorial Typography */}
        <section id="overview" className="relative min-h-screen w-full overflow-hidden flex items-center">
          <div className="absolute inset-0">
            <TrafficIntersection3D />
          </div>

          <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-10 pt-24 pb-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="max-w-3xl"
            >
              <p className="text-xs md:text-sm font-medium tracking-wide text-cyan-300 mb-6">
                Artificial Intelligence <span aria-hidden="true" className="text-white/30 mx-2">/</span>
                Computer Vision <span aria-hidden="true" className="text-white/30 mx-2">/</span>
                Full-Stack Engineering
              </p>

              <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[0.88] text-[clamp(4rem,11vw,8.75rem)] text-[#F4F3EF] select-none">
                VISION
                <br />
                FLOW<span className="text-cyan-400">.</span>
              </h1>

              <p className="mt-8 text-lg md:text-2xl text-[#D1D5DB] max-w-xl leading-relaxed font-normal text-balance">
                {SITE_CONFIG.tagline}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4 pointer-events-auto">
                <MagneticButton
                  onClick={scrollToStory}
                  className="inline-flex items-center gap-2.5 rounded-md bg-[#F4F3EF] px-6 py-3.5 text-sm font-semibold text-[#06070A] hover:bg-cyan-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>Explore the Project</span>
                  <ArrowDown className="w-4 h-4" />
                </MagneticButton>

                <a
                  href={resolvedLaunchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-[#06070A]/80 px-6 py-3.5 text-sm font-semibold text-[#F4F3EF] hover:border-cyan-400 hover:text-cyan-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>Launch Application</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 01: Project Story & Problem Statement */}
        <section id="story" className="py-24 md:py-36 border-t border-white/10 bg-[#06070A]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55 }}
                className="lg:col-span-5 lg:sticky lg:top-28"
              >
                <p className="text-xs font-mono tracking-wider text-cyan-400 mb-4">
                  01. PROJECT STORY &amp; PROBLEM STATEMENT
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#F4F3EF] leading-[1.08] text-balance">
                  Cities record millions of hours of street video. Almost none of it is understood in real time.
                </h2>
                <p className="mt-6 text-base text-[#9BA1AE] leading-relaxed">
                  Conventional traffic intersections still depend on buried inductive wire loops or rigid fixed-time signal cycles. A loop can detect metal passing over pavement, yet remains blind to whether an intersection holds a transit bus, a freight van, or pedestrians still crossing against the curb.
                </p>
              </motion.div>

              <div className="lg:col-span-7 space-y-12">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#0D1017]">
                  <img
                    src={ASSETS.highwayCorridor}
                    alt="Multi-level urban expressway interchange at dusk with commuter light trails"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070A]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[#F4F3EF] font-medium">
                      Urban Corridor Interchange · Fixed Municipal Camera Perspective
                    </span>
                    <span className="font-mono text-[#9BA1AE]">Unstructured Optical Stream</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#F4F3EF] mb-3">
                      Why VisionFlow Was Created
                    </h3>
                    <p className="text-sm text-[#9BA1AE] leading-relaxed">
                      Cutting pavement to install hardware sensors across every municipal approach is expensive and slow. VisionFlow was created to explore a software-first alternative: turning standard elevated traffic cameras into multi-class perception nodes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#F4F3EF] mb-3">
                      The Proposed Intelligent Solution
                    </h3>
                    <p className="text-sm text-[#9BA1AE] leading-relaxed">
                      By pairing YOLO object detection and OpenCV spatial tracking inside a Python FastAPI service with a Next.js visual workspace, VisionFlow turns raw intersection footage into structured counts, density heatmaps, and adaptive signal timing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: Before & After Interactive Comparison */}
        <BeforeAfterComparison />

        {/* SECTION 03: AI Methodology ("Inside the AI") */}
        <InsideAISection />

        {/* SECTION 04: System Architecture & Technology Stack */}
        <ArchitectureSection />

        {/* SECTION 05: Interactive Project Showcase with Configurable Launch URL */}
        <ProductShowcaseSection
          launchAppUrl={launchAppUrl}
          onChangeLaunchAppUrl={handleLaunchUrlChange}
        />

        {/* SECTION 06: Development Journey, Honest Constraints & Developer Information */}
        <section id="about" className="py-24 md:py-36 border-t border-white/10 bg-[#06070A]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-24">
            {/* Development Journey */}
            <div>
              <p className="text-xs font-mono tracking-wider text-cyan-400 mb-4">
                06. DEVELOPMENT JOURNEY
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#F4F3EF] max-w-3xl text-balance">
                Built step by step from computer vision prototype to full-stack platform.
              </h2>

              <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/10 pt-10">
                {DEVELOPMENT_JOURNEY.map((step) => (
                  <div key={step.phase} className="space-y-3">
                    <div className="font-mono text-xs text-cyan-400">{step.phase}</div>
                    <h3 className="font-display text-lg font-semibold text-[#F4F3EF]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#9BA1AE] leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Honest Scope, Challenges & Future Possibilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-12">
              <div className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#F4F3EF]">
                  Implemented Capabilities
                </h3>
                <ul className="space-y-2.5 text-sm text-[#9BA1AE] leading-relaxed">
                  <li>• Multi-class YOLO vehicle and pedestrian detection over traffic video frames.</li>
                  <li>• OpenCV polygon zone counting, directional tracking, and congestion heatmaps.</li>
                  <li>• FastAPI endpoints serving live telemetry and adaptive signal phase logic to Next.js.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#F4F3EF]">
                  Challenges &amp; Constraints
                </h3>
                <ul className="space-y-2.5 text-sm text-[#9BA1AE] leading-relaxed">
                  <li>• Tall transit buses or freight trailers can temporarily occlude adjacent passenger vehicles.</li>
                  <li>• Dusk headlight glare and rain reflections degrade confidence in uncalibrated scenes.</li>
                  <li>• Virtual lane polygons must be recalibrated if a physical camera mount shifts angle.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#F4F3EF]">
                  Future Possibilities
                </h3>
                <ul className="space-y-2.5 text-sm text-[#9BA1AE] leading-relaxed">
                  <li>• Edge TensorRT optimization for sustained multi-stream municipal hardware deployment.</li>
                  <li>• Cross-camera vehicle re-identification across consecutive corridor intersections.</li>
                  <li>• Hardware cabinet integration via standard NTCIP traffic controller protocols.</li>
                </ul>
              </div>
            </div>

            {/* Developer Information */}
            <div className="rounded-xl border border-white/10 bg-[#0D1017] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-xl overflow-hidden border border-white/15 bg-[#06070A]">
                  <img
                    src={ASSETS.engineerPortrait}
                    alt="Independent VisionFlow AI developer portrait"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div className="text-xs font-mono text-cyan-400">
                  DEVELOPER INFORMATION
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#F4F3EF]">
                  {SITE_CONFIG.developer.name}
                </h3>
                <p className="text-sm font-medium text-[#D1D5DB]">
                  {SITE_CONFIG.developer.role}
                </p>
                <p className="text-base text-[#9BA1AE] leading-relaxed max-w-2xl">
                  {SITE_CONFIG.developer.bio}
                </p>

                {(SITE_CONFIG.developer.githubUrl ||
                  SITE_CONFIG.developer.linkedinUrl ||
                  SITE_CONFIG.developer.personalPortfolioUrl ||
                  SITE_CONFIG.developer.email) && (
                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    {SITE_CONFIG.developer.githubUrl && (
                      <a
                        href={SITE_CONFIG.developer.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#06070A] px-4 py-2 text-xs font-medium text-[#F4F3EF] hover:border-cyan-400/50 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5 text-cyan-400" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {SITE_CONFIG.developer.linkedinUrl && (
                      <a
                        href={SITE_CONFIG.developer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#06070A] px-4 py-2 text-xs font-medium text-[#F4F3EF] hover:border-cyan-400/50 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {SITE_CONFIG.developer.personalPortfolioUrl && (
                      <a
                        href={SITE_CONFIG.developer.personalPortfolioUrl}
                        target={
                          /^https?:\/\//i.test(SITE_CONFIG.developer.personalPortfolioUrl)
                            ? '_blank'
                            : undefined
                        }
                        rel={
                          /^https?:\/\//i.test(SITE_CONFIG.developer.personalPortfolioUrl)
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#06070A] px-4 py-2 text-xs font-medium text-[#F4F3EF] hover:border-cyan-400/50 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Personal Portfolio</span>
                      </a>
                    )}
                    {SITE_CONFIG.developer.email && (
                      <a
                        href={`mailto:${SITE_CONFIG.developer.email}`}
                        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#06070A] px-4 py-2 text-xs font-medium text-[#F4F3EF] hover:border-cyan-400/50 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Contact</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="relative min-h-[82vh] border-t border-white/10 bg-[#06070A] bg-tech-grid flex items-center justify-center px-6 md:px-10 py-28">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-mono tracking-wider text-cyan-400 mb-6">
              VISIONFLOW AI · PROJECT PORTFOLIO
            </p>
            <h2 className="font-display font-extrabold tracking-[-0.03em] leading-[0.94] text-[clamp(2.75rem,7vw,6.25rem)] text-[#F4F3EF] text-balance">
              THE FUTURE IS IN SIGHT.
            </h2>
            <p className="mt-6 text-lg md:text-2xl text-[#9BA1AE] max-w-xl mx-auto">
              Experience intelligent traffic monitoring.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <a
                href={resolvedLaunchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#F4F3EF] px-7 py-3.5 text-sm font-semibold text-[#06070A] hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Launch VisionFlow AI</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {SITE_CONFIG.developer.githubUrl && (
                <a
                  href={SITE_CONFIG.developer.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-[#0D1017] px-6 py-3.5 text-sm font-semibold text-[#F4F3EF] hover:border-white/40 transition-colors whitespace-nowrap shrink-0"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source Code</span>
                </a>
              )}

              <a
                href="#overview"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 px-6 py-3.5 text-sm font-medium text-[#9BA1AE] hover:text-[#F4F3EF] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Back to Top</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#06070A] py-8 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9BA1AE]">
          <span>VisionFlow AI · Independent Computer Vision &amp; Urban Mobility Project</span>
          <div className="flex items-center gap-6">
            <a
              href={resolvedLaunchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4F3EF] transition-colors"
            >
              Launch Application
            </a>
            {SITE_CONFIG.developer.githubUrl && (
              <a
                href={SITE_CONFIG.developer.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F4F3EF] transition-colors"
              >
                Source Code
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
