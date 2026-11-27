import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  brandName: string;
  isAdminAuthenticated: boolean;
  onAdminAction: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({
  brandName,
  isAdminAuthenticated,
  onAdminAction,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFB]/92 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          {brandName || 'Miss Sobia'}
        </a>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1.5 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-blue-700 hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Subtle Primary Action (+ compact mobile menu button on small viewports) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onAdminAction}
            className="min-h-[40px] px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 py-3 shadow-sm">
          <nav aria-label="Mobile Navigation" className="flex flex-col divide-y divide-slate-100">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="min-h-[44px] flex items-center text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
