import Link from "next/link";
import { Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-gold" />
              </div>
              <span className="font-display font-bold text-lg">
                GovPH <span className="text-gold">Tracker</span>
              </span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed max-w-xs">
              A community tool to help Filipinos navigate government services. Not affiliated with any government agency.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-300 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/agencies", label: "Agencies" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-300 mb-3">Disclaimer</h3>
            <p className="text-sm text-blue-200 leading-relaxed">
              Information may change. Always verify requirements directly with the relevant government agency before applying.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-blue-300">
            © {new Date().getFullYear()} GovPH Tracker. For the Filipino people.
          </p>
          <p className="text-xs text-blue-300 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-gold fill-gold" /> for everyday Filipinos
          </p>
        </div>
      </div>
    </footer>
  );
}
