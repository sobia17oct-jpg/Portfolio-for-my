import { FooterData } from '../types/portfolio';

interface FooterProps {
  footer: FooterData;
  isAdminAuthenticated: boolean;
  onAdminAction: () => void;
}

export function Footer({
  footer,
  isAdminAuthenticated,
  onAdminAction,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display text-sm font-semibold text-slate-900">
            © {year} {footer.copyrightName}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-1">{footer.tagline}</p>
        </div>

        <nav
          aria-label="Footer Quick Links"
          className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600"
        >
          <a href="#top" className="hover:text-slate-900 transition-colors">
            Home
          </a>
          <a href="#about" className="hover:text-slate-900 transition-colors">
            About
          </a>
          <a href="#skills" className="hover:text-slate-900 transition-colors">
            Skills
          </a>
          <a href="#projects" className="hover:text-slate-900 transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">
            Contact
          </a>
          <button
            type="button"
            onClick={onAdminAction}
            className="text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            {isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}
          </button>
        </nav>
      </div>
    </footer>
  );
}
