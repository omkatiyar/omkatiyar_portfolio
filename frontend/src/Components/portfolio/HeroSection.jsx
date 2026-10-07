import React from 'react';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import DisciplineRing from './DisciplineRing';

const METRICS = [
  { value: '10K+', label: 'Daily Leads' },
  { value: '30–40%', label: 'Throughput' },
  { value: '99.5%+', label: 'Delivery' },
];

export default function HeroSection({ onScrollToNext, onScrollToContact }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-12">
      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Eyebrow */}
        <p
          className="font-mono text-xs md:text-sm tracking-[0.35em] text-slate-400 uppercase mb-6 animate-fadeIn"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          Software Engineer — Backend / AI / Distributed Systems
        </p>

        {/* Main heading */}
        <h1
          className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 leading-[0.95] tracking-tight animate-fadeInUp"
          style={{
            fontSize: 'clamp(2.75rem, 8vw, 6.5rem)',
            animationDelay: '0.25s',
            opacity: 0,
          }}
        >
          OM KATIYAR
        </h1>
        <h2
          className="font-bold leading-[0.95] tracking-tight mt-1 animate-fadeInUp"
          style={{
            fontSize: 'clamp(1.5rem, 4.2vw, 3.25rem)',
            animationDelay: '0.45s',
            opacity: 0,
          }}
        >
          <span className="text-slate-100">I BUILD SYSTEMS</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            THAT SCALE.
          </span>
        </h2>

        {/* Supporting copy */}
        <p
          className="mt-8 text-lg md:text-xl text-slate-400 max-w-xl mx-auto animate-fadeIn"
          style={{ animationDelay: '0.65s', opacity: 0 }}
        >
          Software Engineer building scalable backend, AI and distributed systems.
        </p>

        {/* Status + metadata */}
        <div
          className="mt-8 flex flex-col items-center gap-3 animate-fadeIn"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] md:text-xs tracking-[0.2em] text-emerald-300/90 uppercase">
              Available for global remote work
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] tracking-widest text-slate-500 uppercase">
            <span>Loc / India</span>
            <span className="text-slate-700">·</span>
            <span>TZ / UTC+5:30</span>
            <span className="text-slate-700">·</span>
            <span>Status / Remote</span>
          </div>
        </div>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp"
          style={{ animationDelay: '0.95s', opacity: 0 }}
        >
          <button
            onClick={onScrollToNext}
            className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-semibold overflow-hidden transition-transform duration-300 hover:scale-[1.03]"
          >
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
              style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)' }}
            />
            <span className="relative">Explore My Work</span>
            <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={onScrollToContact}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-slate-600/60 text-slate-200 font-medium transition-all duration-300 hover:border-amber-400/60 hover:text-amber-300"
          >
            Get In Touch
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Engineering proof */}
        <div
          className="mt-16 pt-8 border-t border-white/5 flex items-center justify-center gap-8 md:gap-14 animate-fadeIn"
          style={{ animationDelay: '1.1s', opacity: 0 }}
        >
          {METRICS.map((m, i) => (
            <React.Fragment key={m.label}>
              {i > 0 && <span className="hidden sm:block w-px h-8 bg-white/10" />}
              <div className="text-center">
                <div className="font-mono text-2xl md:text-3xl font-semibold text-amber-300">{m.value}</div>
                <div className="mt-1 text-[10px] md:text-xs tracking-[0.2em] text-slate-500 uppercase">
                  {m.label}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Disciplines — a draggable 3D ring replaces the old three-column text */}
        <div className="animate-fadeIn" style={{ animationDelay: '1.25s', opacity: 0 }}>
          <DisciplineRing />
        </div>

        {/* Social links */}
        <div
          className="mt-14 flex justify-center gap-5 animate-fadeIn"
          style={{ animationDelay: '1.4s', opacity: 0 }}
        >
          {[
            { Icon: Github, href: 'https://github.com/omkatiyar', label: 'GitHub' },
            { Icon: Linkedin, href: 'https://www.linkedin.com/in/om-katiyar-277a301ba/', label: 'LinkedIn' },
            { Icon: Mail, href: 'mailto:omkatiyar123hash@gmail.com', label: 'Email' },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-white/10 text-slate-500 hover:text-amber-400 hover:border-amber-400/40 transition-all duration-300"
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
