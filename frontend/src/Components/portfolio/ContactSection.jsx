import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Github, Linkedin, Twitter, Copy, Check, ArrowUpRight } from 'lucide-react';
import { contactStore } from './scene/experienceStore';

/**
 * Contact: one obvious action (email), phone and socials secondary. The glowing
 * core from the Projects ending sits above this block in the shared 3D canvas;
 * it follows the cursor and flares while the Email button is hovered.
 */

const PRIMARY_EMAIL = 'omkatiyar123hash@gmail.com';
const SECONDARY_EMAIL = 'okatiyar@ec.iitr.ac.in';
const PHONE_DISPLAY = '+91-9027834290';
const PHONE_HREF = 'tel:+919027834290';

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/omkatiyar' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/om-katiyar-277a301ba/' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/OmKatiyar23' }
];

export default function ContactSection() {
  const rootRef = useRef(null);
  const spotRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Soft pointer spotlight behind the card (mouse only, one rAF-throttled write per frame).
  useEffect(() => {
    const root = rootRef.current;
    const spot = spotRef.current;
    if (!root || !spot) return undefined;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      spot.style.background = `radial-gradient(420px circle at ${x}px ${y}px, rgba(251,191,36,0.10), transparent 70%)`;
    };
    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = root.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      spot.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      spot.style.opacity = '0';
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    return () => {
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
      contactStore.hot = 0;
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PRIMARY_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // clipboard blocked: the address is still visible and selectable
    }
  };

  const hot = (v) => () => {
    contactStore.hot = v;
  };

  return (
    <div ref={rootRef} // on desktop it overlaps the last screen of Projects so there is no empty scroll before it
    className="relative z-10 px-6 pb-24 pt-[44vh] md:-mt-[100vh] md:pt-[46vh]">
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-amber-400 uppercase">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100 md:text-5xl">
            Let&apos;s work together
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            Open to global remote work across time zones. Based in India (UTC+5:30).
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0b0f1a]/70 p-6 backdrop-blur-sm md:p-8">
          {/* primary action */}
          <div className="flex flex-col items-center gap-4 text-center">
            <a
              href={`mailto:${PRIMARY_EMAIL}`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && hot(1)()}
              onPointerLeave={hot(0)}
              onFocus={hot(1)}
              onBlur={hot(0)}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3.5 font-semibold text-slate-900 transition-transform duration-300 hover:scale-[1.03]"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              Email me
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={`mailto:${PRIMARY_EMAIL}`} className="text-lg text-slate-100 hover:underline">
                {PRIMARY_EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-300"
              >
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'Email address copied' : ''}
              </span>
            </div>
          </div>

          {/* secondary details */}
          <div className="mt-8 grid gap-4 border-t border-white/5 pt-6 sm:grid-cols-2">
            <a
              href={PHONE_HREF}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-amber-400/40"
            >
              <Phone className="h-5 w-5 flex-shrink-0 text-amber-400" aria-hidden="true" />
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Phone · India</span>
                <span className="block text-slate-100">{PHONE_DISPLAY}</span>
              </span>
            </a>
            <a
              href={`mailto:${SECONDARY_EMAIL}`}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-amber-400/40"
            >
              <Mail className="h-5 w-5 flex-shrink-0 text-amber-400" aria-hidden="true" />
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Alternate email</span>
                <span className="block text-slate-100">{SECONDARY_EMAIL}</span>
              </span>
            </a>
          </div>

          {/* socials */}
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
