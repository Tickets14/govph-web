import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';
import { ClipboardCheck, Shield, FileText, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Login — Gov Requirements Tracker',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left branded panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-dark via-navy to-navy-light relative overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Gold glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gold/[0.04] rounded-full blur-3xl" />

        <div className="relative flex flex-col items-center justify-center w-full px-12">
          <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center mb-8 border border-gold/20">
            <ClipboardCheck className="w-7 h-7 text-gold" />
          </div>
          <h2 className="font-display font-bold text-3xl text-white text-center mb-3">
            Gov Requirements <span className="text-gold">Tracker</span>
          </h2>
          <p className="text-white/40 text-sm text-center max-w-xs mb-12">
            Manage Philippine government services, agencies, and requirements.
          </p>

          {/* Feature list */}
          <div className="space-y-4 w-full max-w-xs">
            {[
              { icon: Shield, label: 'Secure admin access' },
              { icon: FileText, label: 'Manage services & steps' },
              { icon: CheckCircle, label: 'Track requirements' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/50 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gold/60" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Logo — visible on mobile only */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center mb-4 shadow-lg shadow-navy/20">
              <ClipboardCheck className="w-5 h-5 text-gold" />
            </div>
            <h1 className="font-display font-bold text-lg text-navy">Gov Requirements Tracker</h1>
            <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 animate-fade-in-up animation-delay-100">
            <h2 className="font-semibold text-gray-900 text-base mb-6">Sign in to continue</h2>
            <LoginForm />
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">Gov Requirements Tracker · Admin Access Only</p>
        </div>
      </div>
    </div>
  );
}
