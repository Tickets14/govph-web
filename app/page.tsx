import Link from 'next/link';
import { ArrowRight, CheckCircle, List, Trophy, Search } from 'lucide-react';
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
        {/* Minimal grid decoration */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.07] rounded-full px-4 py-1.5 mb-8 border border-white/[0.1] animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-xs text-white/60 font-medium tracking-wide">
              Libre. Walang bayad. Always updated.
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-white leading-[1.08] animate-fade-in-up animation-delay-100">
            <span className="block text-4xl sm:text-5xl lg:text-[58px]">Alamin ang requirements.</span>
            <span className="block text-4xl sm:text-5xl lg:text-[58px] text-gold mt-1">Walang hassle.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-white/40 max-w-lg mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Step-by-step na gabay sa lahat ng government transactions sa Pilipinas. Passport, NBI, driver&apos;s license
            — lahat nandito.
          </p>

          {/* Search bar */}
          <div className="mt-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            <HeroSearch />
          </div>

          {/* Quick links */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up animation-delay-400">
            <span className="text-[11px] text-white/25 uppercase tracking-wider">Popular</span>
            {['Passport', 'NBI Clearance', "Driver's License", 'PSA Certificate'].map((tag) => (
              <Link
                key={tag}
                href={`/services?q=${encodeURIComponent(tag)}`}
                className="text-xs text-white/50 hover:text-white border border-white/[0.1] hover:border-white/20 rounded-full px-3 py-1 transition-all duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </section>

      {/* ── Featured Services ─────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 animate-fade-in-up">
            <div>
              <p className="text-[11px] font-semibold text-gold uppercase tracking-widest mb-2">Pinaka-popular</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy">Mga Government Services</h2>
            </div>
            <Link
              href="/services"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-navy transition-colors duration-200"
            >
              Tingnan lahat <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, i) => (
              <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden animate-fade-in-up animation-delay-400">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy">
              Tingnan lahat ng serbisyo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-20 bg-[#f7f8fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-in-up">
            <p className="text-[11px] font-semibold text-gold uppercase tracking-widest mb-2">Paano gumagana</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy">3 Simpleng Hakbang</h2>
            <p className="mt-2 text-sm text-gray-400 max-w-xs mx-auto">Walang kalituhan. Sundan lang ang proseso.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative">
            {/* connector */}
            <div className="hidden sm:block absolute top-9 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-gray-200 via-gold/30 to-gray-200 z-0" />

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
            ].map(({ step, icon: Icon, title, description }, i) => (
              <div
                key={step}
                className="relative z-10 bg-white rounded-2xl p-6 border border-gray-100 text-center hover:border-gray-200 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-[52px] h-[52px] rounded-2xl bg-navy/[0.06] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-navy/70" />
                </div>
                <div className="text-[11px] font-bold text-gold/50 tracking-widest mb-1.5">{step}</div>
                <h3 className="font-display font-semibold text-gray-900 mb-2 text-[15px]">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agencies Row ──────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 animate-fade-in-up">
            <div>
              <p className="text-[11px] font-semibold text-gold uppercase tracking-widest mb-2">Covered na agencies</p>
              <h2 className="font-display font-bold text-2xl text-navy">Mga Ahensya ng Gobyerno</h2>
            </div>
            <Link
              href="/agencies"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-navy transition-colors duration-200"
            >
              Tingnan lahat <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {agencies.map((agency, i) => (
              <div key={agency.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                <AgencyLogo agency={agency} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 mb-6 border border-gold/20">
            <CheckCircle className="w-6 h-6 text-gold" />
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">Handa ka na ba?</h2>
          <p className="text-white/40 text-sm sm:text-base mb-10 max-w-sm mx-auto leading-relaxed">
            I-explore ang lahat ng government services at simulan ang iyong checklist ngayon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold/90 transition-all duration-200 hover:-translate-y-0.5 text-sm"
            >
              I-browse ang Services <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/agencies"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.07] text-white/70 font-medium px-6 py-3 rounded-xl border border-white/[0.1] hover:bg-white/10 hover:text-white transition-all duration-200 text-sm"
            >
              Tingnan ang Agencies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
