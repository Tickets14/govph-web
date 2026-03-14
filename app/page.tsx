import Link from 'next/link';
import { ArrowRight, CheckCircle, List, Trophy, ChevronRight, Search } from 'lucide-react';
import { getFeaturedServices, getAgencies } from '@/lib/api';
import { ServiceCard } from '@/components/services/ServiceCard';
import { AgencyLogo } from '@/components/agencies/AgencyLogo';
import { HeroSearch } from './HeroSearch';

export default async function HomePage() {
  const [services, agencies] = await Promise.all([getFeaturedServices(), getAgencies()]);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#243561] opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#111B30] opacity-80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.04]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.06]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 border border-white/15 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs text-white/80 font-medium">Libre. Walang bayad. Always updated.</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-white leading-[1.1] animate-fade-in-up animation-delay-100">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">Alamin ang requirements.</span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl text-gold mt-1">Walang hassle.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-blue-200 max-w-xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Step-by-step na gabay sa lahat ng government transactions sa Pilipinas. Passport, NBI, driver&apos;s license
            — lahat nandito.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            <HeroSearch />
          </div>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up animation-delay-400">
            <span className="text-xs text-white/40">Popular:</span>
            {['Passport', 'NBI Clearance', "Driver's License", 'PSA Certificate'].map((tag) => (
              <Link
                key={tag}
                href={`/services?q=${encodeURIComponent(tag)}`}
                className="text-xs text-white/70 hover:text-gold hover:bg-white/10 border border-white/15 rounded-full px-3 py-1 transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="relative overflow-hidden" style={{ height: 32 }}>
          <svg viewBox="0 0 1440 32" className="absolute bottom-0 w-full" preserveAspectRatio="none" fill="white">
            <path d="M0,32 L0,16 Q360,0 720,16 Q1080,32 1440,16 L1440,32 Z" />
          </svg>
        </div>
      </section>

      {/* ── Featured Services ─────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-1">Pinaka-popular</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy">Mga Government Services</h2>
            </div>
            <Link
              href="/services"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy hover:text-navy/70 transition-colors"
            >
              Tingnan lahat <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy">
              Tingnan lahat ng serbisyo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-16 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">Paano gumagana</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy">3 Simpleng Hakbang</h2>
            <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto">Walang kalituhan. Sundan lang ang proseso.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* connector line */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-gradient-to-r from-navy/20 via-gold/40 to-navy/20 z-0" />

            {[
              {
                step: '01',
                icon: Search,
                title: 'Maghanap',
                description: 'I-type ang serbisyo na kailangan mo — passport, clearance, license, at marami pa.',
              },
              {
                step: '02',
                icon: List,
                title: 'Tingnan ang Checklist',
                description: 'Makita ang buong listahan ng requirements, fees, at steps nang malinaw at maayos.',
              },
              {
                step: '03',
                icon: Trophy,
                title: 'Tapusin!',
                description: 'I-check ang bawat hakbang habang inaasikaso mo ang iyong transaction.',
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div
                key={step}
                className="relative z-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <div className="text-xs font-bold text-gold/60 mb-1">{step}</div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agencies Row ──────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-1">Covered na agencies</p>
              <h2 className="font-display font-bold text-2xl text-navy">Mga Ahensya ng Gobyerno</h2>
            </div>
            <Link
              href="/agencies"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy hover:text-navy/70 transition-colors"
            >
              Tingnan lahat <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {agencies.map((agency) => (
              <AgencyLogo key={agency.id} agency={agency} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-16 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/20 mb-6">
            <CheckCircle className="w-8 h-8 text-gold" />
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">Handa ka na ba?</h2>
          <p className="text-blue-200 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            I-explore ang lahat ng government services at simulan ang iyong checklist ngayon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold/90 transition-all shadow-lg hover:-translate-y-0.5"
            >
              I-browse ang Services <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/agencies"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-medium px-6 py-3 rounded-xl border border-white/20 hover:bg-white/15 transition-all"
            >
              Tingnan ang Agencies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
