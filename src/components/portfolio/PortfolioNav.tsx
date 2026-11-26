import { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '#overview' },
  { label: 'The Story', href: '#story' },
  { label: 'Innovation', href: '#innovation' },
  { label: 'Engineering', href: '#engineering' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'About', href: '#about' },
];

export function PortfolioNav({ launchAppUrl }: { launchAppUrl: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#06070A]/92 border-b border-white/10'
          : 'bg-gradient-to-b from-[#06070A]/85 to-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#overview"
          className="font-display text-lg font-bold tracking-tight text-[#F4F3EF] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm"
        >
          VISIONFLOW
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav aria-label="Portfolio sections" className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#9BA1AE] hover:text-[#F4F3EF] transition-colors whitespace-nowrap shrink-0 relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action pointing to configurable Launch Application URL */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={launchAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-[#F4F3EF] px-4 py-2 text-xs font-semibold text-[#06070A] hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>Launch Application</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/10 text-[#F4F3EF] hover:bg-white/5 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#06070A]/98 px-6 py-5 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-base font-medium text-[#9BA1AE] hover:text-[#F4F3EF] border-b border-white/5"
            >
              {item.label}
            </a>
          ))}
          <a
            href={launchAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#F4F3EF] px-4 py-3 text-sm font-semibold text-[#06070A]"
          >
            <span>Launch Application</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
}
