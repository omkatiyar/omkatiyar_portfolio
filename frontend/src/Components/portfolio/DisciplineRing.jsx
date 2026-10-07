import React, { useEffect, useRef, useState } from 'react';
import useMediaQuery from './scene/useMediaQuery';

/**
 * The four disciplines as cards seated on a 3D ring. Drag (or swipe
 * horizontally) to spin it; it snaps to a card, auto-advances slowly until
 * you touch it, and has buttons + arrow keys. Cards facing away show a plain
 * back, so the far side reads through the gaps without mirrored text.
 * The ring is driven imperatively from one rAF loop — no React re-render
 * while it moves; React state only tracks which card is in front.
 * All copy comes from the skills/experience already in this portfolio.
 */

const DISCIPLINES = [
  {
    label: 'Backend',
    copy: 'APIs and services in Node.js, FastAPI and Go, backed by PostgreSQL, MongoDB and Redis.',
    tags: ['Node.js', 'FastAPI', 'Go']
  },
  {
    label: 'Distributed Systems',
    copy: 'Event-driven pipelines on RabbitMQ: durable queues, retries, dead-letter handling and idempotent consumers.',
    tags: ['RabbitMQ', 'Redis', 'Microservices']
  },
  {
    label: 'AI',
    copy: 'LLM integrations, ML model integration and RAG, with usage metering and token accounting.',
    tags: ['LLM APIs', 'RAG', 'ML models']
  },
  {
    label: 'Infrastructure',
    copy: 'Containers, CI/CD, observability and production reliability.',
    tags: ['Docker', 'Kubernetes', 'Jenkins']
  }
];

const N = DISCIPLINES.length;
const STEP = 360 / N;
const SPEED = 10; // degrees per second of continuous rotation (a full turn takes 36s)
const mod = (n, m) => ((n % m) + m) % m;

export default function DisciplineRing() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const cardW = isMobile ? 230 : 270;
  const cardH = isMobile ? 230 : 232;
  const radius = isMobile ? 230 : 340;

  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);

  // Mutable animation state — never triggers a render.
  const s = useRef({
    angle: 0,
    vel: 0, // current angular velocity, deg/s
    snapTo: null, // card index to glide to after a button / arrow-key press
    dragging: false,
    hover: false,
    startX: 0,
    startAngle: 0,
    lastX: 0,
    lastT: 0,
    lastActive: 0
  });

  // Buttons / arrow keys glide one card, then continuous rotation resumes.
  const go = (delta) => {
    const st = s.current;
    // step relative to the card the dots currently highlight (the nearest one)
    st.snapTo = (st.snapTo ?? Math.round(-st.angle / STEP)) + delta;
  };

  useEffect(() => {
    const st = s.current;
    let raf = 0;
    let last = performance.now();

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!st.dragging) {
        if (st.snapTo !== null) {
          // glide to the requested card, then hand back to continuous rotation
          const target = -st.snapTo * STEP;
          st.angle += (target - st.angle) * (reduced ? 1 : 1 - Math.pow(0.002, dt));
          st.vel = 0;
          if (Math.abs(target - st.angle) < 0.4) {
            st.angle = target;
            st.snapTo = null;
          }
        } else {
          // Continuous turn. It eases to a stop while hovered / keyboard-focused so the
          // text can be read, and any drag momentum decays into the base speed.
          const base = reduced || st.hover ? 0 : -SPEED;
          st.vel += (base - st.vel) * (1 - Math.exp(-dt * 2.2));
          st.angle += st.vel * dt;
        }
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(${-radius}px) rotateX(-8deg) rotateY(${st.angle}deg)`;
      }
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const facing = Math.cos(((i * STEP + st.angle) * Math.PI) / 180); // 1 = facing the viewer
        // Opacity goes on the faces, not the wrapper: opacity on a preserve-3d
        // element flattens it and un-hides the mirrored back of the front face.
        const o = String(0.3 + 0.7 * Math.max(0, facing));
        for (let c = 0; c < el.children.length; c++) el.children[c].style.opacity = o;
      });

      const idx = mod(Math.round(-st.angle / STEP), N);
      if (idx !== st.lastActive) {
        st.lastActive = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(frame);
    };

    // run only while the ring is on screen
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      },
      { rootMargin: '20% 0px' }
    );
    io.observe(rootRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [radius, reduced]);

  const onPointerDown = (e) => {
    if (e.target.closest('button')) return;
    const st = s.current;
    st.dragging = true;
    st.snapTo = null;
    st.startX = e.clientX;
    st.startAngle = st.angle;
    st.lastX = e.clientX;
    st.lastT = performance.now();
    st.vel = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const st = s.current;
    if (!st.dragging) return;
    const now = performance.now();
    const dtMs = Math.max(1, now - st.lastT);
    const instant = ((e.clientX - st.lastX) * 0.4 * 1000) / dtMs; // deg/s
    st.vel = st.vel * 0.6 + instant * 0.4; // smoothed, for a natural fling on release
    st.lastX = e.clientX;
    st.lastT = now;
    st.angle = st.startAngle + (e.clientX - st.startX) * 0.4;
  };
  const endDrag = (e) => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    // no snapping: it keeps turning from where it was released, carrying the fling
    st.vel = Math.max(-360, Math.min(360, performance.now() - st.lastT > 80 ? 0 : st.vel));
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div ref={rootRef} className="mt-14">
      <p className="text-center font-mono text-xs tracking-[0.3em] text-amber-400 uppercase">What I work on</p>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Engineering disciplines"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={(e) => {
          // a touch tap synthesizes mouse-enter; only a real mouse should pause the ring
          if (e.pointerType === 'mouse') s.current.hover = true;
        }}
        onPointerLeave={() => (s.current.hover = false)}
        onFocus={(e) => {
          if (e.target.matches(':focus-visible')) s.current.hover = true;
        }}
        onBlur={() => (s.current.hover = false)}
        className="relative mx-auto mt-6 flex cursor-grab items-center justify-center rounded-2xl outline-none select-none focus-visible:ring-2 focus-visible:ring-amber-400/60 active:cursor-grabbing"
        style={{ height: cardH + 90, perspective: 1300, touchAction: 'pan-y' }}
      >
        <div
          ref={ringRef}
          className="relative"
          style={{ width: cardW, height: cardH, transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {DISCIPLINES.map((d, i) => (
            <div
              key={d.label}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute inset-0"
              style={{
                transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* front: the real content */}
              <article
                aria-label={d.label}
                className="absolute inset-0 flex flex-col rounded-xl border border-white/10 p-5 text-left shadow-2xl"
                style={{
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(180deg, rgba(14,19,32,0.96), rgba(7,10,18,0.96))',
                  boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.14), 0 20px 40px rgba(0,0,0,0.45)'
                }}
              >
                <p className="font-mono text-[11px] tracking-[0.25em] text-slate-500">0{i + 1} / 0{N}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-100">{d.label}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{d.copy}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5">
                  {d.tags.map((t) => (
                    <li key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] text-amber-300/90">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
              {/* back: plain panel, so cards on the far side never show mirrored text */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/5 font-mono text-xs tracking-[0.3em] text-slate-700"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'rgba(7,10,18,0.9)' }}
              >
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous discipline"
          className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          ←
        </button>
        <div className="flex gap-2" aria-hidden="true">
          {DISCIPLINES.map((d, i) => (
            <span
              key={d.label}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${i === active ? 'bg-amber-400' : 'bg-slate-600'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next discipline"
          className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          →
        </button>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] tracking-[0.25em] text-slate-600 uppercase">Drag to spin · hover to pause</p>
    </div>
  );
}
