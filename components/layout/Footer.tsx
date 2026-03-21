import Link from 'next/link';
import { ClipboardCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4 text-gold" />
              </div>
              <span className="font-display font-bold text-[17px]">
                Gov Requirements <span className="text-gold">Tracker</span>
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              A community tool to help Filipinos navigate government services. Not affiliated with any government
              agency.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/agencies', label: 'Agencies' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Disclaimer</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Information may change. Always verify requirements directly with the relevant government agency before
              applying.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.07] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Gov Requirements Tracker. For the Filipino people.
          </p>
          <p className="text-xs text-white/30 flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-gold fill-gold" /> for everyday Filipinos
          </p>
        </div>
      </div>
    </footer>
  );
}
