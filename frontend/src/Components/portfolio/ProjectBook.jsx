import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS } from './projectsData';
import { SPECS } from './scene/projectSpecs';
import { projectsStore } from './scene/experienceStore';

/**
 * "Project book": one page per project, front and back both carrying real
 * content from the project data.
 *   front: title, description, stack
 *   back : system diagram (same topology the 3D scenes animate) + engineering points
 *
 * variant="book" (desktop): CSS-3D book whose pages open on their own as you
 *   scroll through the overview and can also be flipped by click / keyboard.
 * variant="deck" (phones): too narrow for a two-page spread at a readable size,
 *   so one large card at a time that turns over (scroll- or tap-driven).
 * Everything is HTML/SVG text — copyable, accessible, no stock imagery.
 */

const POSTER_W = 400;
const POSTER_H = 580;
const N = PROJECTS.length;
const pad = (n) => String(n).padStart(2, '0');
const smooth = (x, a, b) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const posterStyle = {
  width: POSTER_W,
  height: POSTER_H,
  background: 'linear-gradient(180deg, #0e1320 0%, #070a12 100%)',
  boxShadow: 'inset 0 0 0 2px rgba(251,191,36,0.3)'
};

function SmallLabel({ children }) {
  return <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-amber-400">{children}</p>;
}

function TitlePoster({ project, index }) {
  return (
    <div className="flex h-full w-full flex-col p-8 text-left" style={posterStyle}>
      <p className="font-mono text-[14px] uppercase text-slate-400">
        {pad(index + 1)} / SYSTEM{project.period ? ` · ${project.period}` : ''}
      </p>
      <p className="mt-6 text-[38px] font-bold uppercase leading-[1.05] text-slate-100">{project.title}</p>
      <span className="mt-4 h-[3px] w-12 bg-amber-400" />
      <div className="mt-6">
        <SmallLabel>System</SmallLabel>
        <p className="mt-2 text-[15px] leading-[1.55] text-slate-300">{project.description}</p>
      </div>
      <div className="mt-auto">
        <SmallLabel>Stack</SmallLabel>
        <ul className="mt-2 flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <li key={t} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[13px] text-slate-200">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NodeGlyph({ n }) {
  const [x, y] = n.p;
  const r = Math.max(0.08, n.size * 0.7);
  if (n.kind === 'box' || n.kind === 'cell') {
    return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill={n.color} />;
  }
  if (n.kind === 'stack') {
    return <rect x={x - r * 1.2} y={y - r * 0.7} width={r * 2.4} height={r * 1.4} fill={n.color} />;
  }
  if (n.kind === 'ring') {
    return <circle cx={x} cy={y} r={r * 1.2} fill="none" stroke={n.color} strokeWidth={0.06} />;
  }
  return <polygon points={`${x},${y + r * 1.2} ${x + r},${y} ${x},${y - r * 1.2} ${x - r},${y}`} fill={n.color} />;
}

function DiagramPoster({ project, spec, index }) {
  const curves = useMemo(
    () =>
      (spec.curves || []).map((c) => {
        const pts = [];
        for (let i = 0; i < c.n; i++) {
          const x = c.x0 + ((c.x1 - c.x0) * i) / (c.n - 1);
          pts.push(`${x.toFixed(3)},${c.fn(x, 0.35).toFixed(3)}`);
        }
        return { ...c, d: pts.join(' ') };
      }),
    [spec]
  );

  return (
    <div className="flex h-full w-full flex-col p-8 text-left" style={posterStyle}>
      <p className="font-mono text-[14px] uppercase text-slate-400">
        {pad(index + 1)} / {project.short}
      </p>
      {/* world y points up, SVG y points down: flip once on the group */}
      <svg
        viewBox="-2.8 -1.8 5.6 3.6"
        className="mt-4 h-[170px] w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Diagram of ${project.title}`}
      >
        <g transform="scale(1,-1)">
          {spec.links.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={spec.nodes[a].p[0]}
              y1={spec.nodes[a].p[1]}
              x2={spec.nodes[b].p[0]}
              y2={spec.nodes[b].p[1]}
              stroke="rgba(231,233,238,0.4)"
              strokeWidth={0.03}
            />
          ))}
          {curves.map((c, i) => (
            <polyline key={i} points={c.d} fill="none" stroke={c.color} strokeOpacity={c.opacity ?? 0.7} strokeWidth={0.04} />
          ))}
          {spec.nodes.map((n, i) => (
            <NodeGlyph key={i} n={n} />
          ))}
        </g>
      </svg>
      <div className="mt-4">
        <SmallLabel>Engineering</SmallLabel>
        <ul className="mt-2 space-y-2">
          {project.features.map((f) => (
            <li key={f} className="flex gap-2.5 text-[13.5px] leading-[1.45] text-slate-300">
              <span aria-hidden="true" className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-amber-400/80" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Scales the fixed-size poster to the page size. */
function Scaled({ k, children }) {
  return (
    <span className="block origin-top-left" style={{ width: POSTER_W, height: POSTER_H, transform: `scale(${k})` }}>
      {children}
    </span>
  );
}

/** Polls the overview-phase progress only while the book is on screen; setState only on change. */
function useOverviewStep(rootRef, steps, from, to) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const s = Math.min(steps, Math.round(smooth(projectsStore.head, from, to) * steps));
      if (s !== last) {
        last = s;
        setStep(s);
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) raf = requestAnimationFrame(tick);
      },
      { rootMargin: '50% 0px 50% 0px' }
    );
    io.observe(rootRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [rootRef, steps, from, to]);
  return step;
}

function Book({ pageWidth }) {
  const pageHeight = Math.round((pageWidth * POSTER_H) / POSTER_W);
  const k = pageWidth / POSTER_W;
  const rootRef = useRef(null);
  const scrollOpen = useOverviewStep(rootRef, N, 0.2, 0.75);
  const [manual, setManual] = useState({});

  // returning to the start of the overview resets any manual flips
  useEffect(() => {
    if (scrollOpen === 0) setManual({});
  }, [scrollOpen]);

  const isOpen = (i) => (i in manual ? manual[i] : scrollOpen > i);
  const anyOpen = PROJECTS.some((_, i) => isOpen(i));
  const toggle = (i) => setManual((m) => ({ ...m, [i]: !isOpen(i) }));

  return (
    <div ref={rootRef} className="pointer-events-auto flex flex-col items-center">
      <div
        className="relative"
        style={{
          width: pageWidth,
          height: pageHeight,
          perspective: 1400,
          transformStyle: 'preserve-3d',
          transform: `translateX(${anyOpen ? pageWidth / 2 : 0}px)`,
          transition: 'transform 0.5s ease'
        }}
      >
        {/* closing card under the last page */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500"
          style={{ background: '#070a12', boxShadow: 'inset 0 0 0 2px rgba(251,191,36,0.3)' }}
          aria-hidden="true"
        >
          Scroll for the detail
        </div>

        {PROJECTS.map((project, i) => {
          const open = isOpen(i);
          return (
            <div
              key={project.title}
              role="button"
              tabIndex={0}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              aria-pressed={open}
              aria-label={`${open ? 'Close' : 'Open'} page ${i + 1}: ${project.title}`}
              className="absolute left-0 top-0 block cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400 motion-reduce:!transition-none"
              style={{
                width: pageWidth,
                height: pageHeight,
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${open ? -180 : 0}deg)`,
                transition: 'transform 0.6s ease-in-out',
                transitionDelay: open ? `${i * 0.12}s` : `${(N - 1 - i) * 0.08}s`,
                zIndex: open ? 20 + i : 10 - i,
                boxShadow: '2px 2px 14px rgba(0,0,0,0.45)'
              }}
            >
              <span className="absolute inset-0 block overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                <Scaled k={k}>
                  <TitlePoster project={project} index={i} />
                </Scaled>
              </span>
              <span
                className="absolute inset-0 block overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}
              >
                <Scaled k={k}>
                  <DiagramPoster project={project} spec={SPECS[i]} index={i} />
                </Scaled>
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-6 font-mono text-[11px] tracking-[0.25em] text-slate-500 uppercase">Click a page to flip it</p>
    </div>
  );
}

function Deck({ pageWidth }) {
  const pageHeight = Math.round((pageWidth * POSTER_H) / POSTER_W);
  const k = pageWidth / POSTER_W;
  const rootRef = useRef(null);
  const step = useOverviewStep(rootRef, N * 2 - 1, 0.15, 0.85); // 0..2N-1: front, back, front, back…
  const cur = Math.min(N - 1, Math.floor(step / 2));
  const [tap, setTap] = useState(false);

  // a tap only overrides the side for the current step
  useEffect(() => setTap(false), [step]);
  const flipped = (step % 2 === 1) !== tap;

  return (
    <div ref={rootRef} className="pointer-events-auto flex flex-col items-center">
      <div className="relative" style={{ width: pageWidth, height: pageHeight, perspective: 1200 }}>
        {PROJECTS.map((project, i) => {
          const isCur = i === cur;
          return (
            <div
              key={project.title}
              role="button"
              tabIndex={isCur ? 0 : -1}
              aria-hidden={isCur ? undefined : 'true'}
              onClick={isCur ? () => setTap((t) => !t) : undefined}
              onKeyDown={(e) => {
                if (isCur && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  setTap((t) => !t);
                }
              }}
              aria-pressed={isCur ? flipped : undefined}
              aria-label={`Turn over: ${project.title}`}
              className="absolute left-0 top-0 block text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400 motion-reduce:!transition-none"
              style={{
                width: pageWidth,
                height: pageHeight,
                transformStyle: 'preserve-3d',
                transform: `rotateY(${isCur && flipped ? 180 : 0}deg)`,
                transition: 'transform 0.6s ease-in-out, opacity 0.4s ease',
                opacity: isCur ? 1 : 0,
                pointerEvents: isCur ? 'auto' : 'none',
                visibility: isCur ? 'visible' : 'hidden',
                boxShadow: '2px 2px 14px rgba(0,0,0,0.45)'
              }}
            >
              <span className="absolute inset-0 block overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                <Scaled k={k}>
                  <TitlePoster project={project} index={i} />
                </Scaled>
              </span>
              <span
                className="absolute inset-0 block overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <Scaled k={k}>
                  <DiagramPoster project={project} spec={SPECS[i]} index={i} />
                </Scaled>
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-5 font-mono text-[11px] tracking-[0.25em] text-slate-500 uppercase">Tap the card to turn it</p>
    </div>
  );
}

export default function ProjectBook({ pageWidth = 340, variant = 'book' }) {
  return variant === 'deck' ? <Deck pageWidth={pageWidth} /> : <Book pageWidth={pageWidth} />;
}
