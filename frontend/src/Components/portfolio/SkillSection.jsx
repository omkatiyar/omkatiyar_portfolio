import React, { useEffect, useRef } from 'react';
import useMediaQuery from './scene/useMediaQuery';
import { useJourneyController, skillsStore } from './scene/experienceStore';

/**
 * Technical Skills as a scroll-driven "assembly": 20 featured tiles scatter,
 * line up, form a circle, then morph into an arc that slowly shuffles as you
 * scroll. Native scrolling only (sticky track, no wheel hijacking); the whole
 * animation is a pure function of scroll position, so it reverses cleanly.
 * Positions are written straight to the DOM from one rAF loop — scrolling
 * never re-renders React. Every skill, featured or not, is also listed as
 * plain HTML below the track.
 */

const skillCategories = [
  {
    title: 'Backend',
    skills: ['Node.js', 'Express', 'FastAPI', 'Django', 'Gin', 'RabbitMQ', 'REST APIs', 'Microservices']
  },
  {
    title: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'C++', 'Java', 'Go']
  },
  {
    title: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Redis']
  },
  {
    title: 'AI & Data',
    skills: ['LLM APIs (OpenAI)', 'ML Model Integration', 'RAG', 'Usage Metering and Token Accounting']
  },
  {
    title: 'Infra/DevOps',
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'AWS S3', 'Nginx', 'Linux', 'Git', 'Grafana', 'NewRelic']
  },
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'Canvas2Code']
  }
];

// The 20 tiles: [category, skill, optional short label for the tile face].
const FEATURED = [
  ['Backend', 'Node.js'],
  ['Backend', 'Express'],
  ['Backend', 'FastAPI'],
  ['Backend', 'RabbitMQ'],
  ['Backend', 'Microservices'],
  ['Languages', 'TypeScript'],
  ['Languages', 'Python'],
  ['Languages', 'C++'],
  ['Languages', 'Go'],
  ['Databases', 'PostgreSQL'],
  ['Databases', 'MongoDB'],
  ['Databases', 'Redis'],
  ['AI & Data', 'LLM APIs (OpenAI)', 'LLM APIs'],
  ['AI & Data', 'RAG'],
  ['Infra/DevOps', 'Docker'],
  ['Infra/DevOps', 'Kubernetes'],
  ['Infra/DevOps', 'Jenkins'],
  ['Infra/DevOps', 'CI/CD'],
  ['Frontend', 'React'],
  ['Frontend', 'Next.js']
].map(([category, name, label]) => {
  const siblings = skillCategories.find((c) => c.title === category).skills.filter((s) => s !== name);
  return { category, name, label: label || name, siblings: siblings.slice(0, 3) };
});

const TOTAL = FEATURED.length;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (x, a, b) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Deterministic scatter so the layout is stable between renders.
const SCATTER = FEATURED.map((_, i) => {
  const r1 = Math.sin(i * 12.9898) * 43758.5453;
  const r2 = Math.sin(i * 78.233) * 12345.6789;
  const r3 = Math.sin(i * 39.346) * 9876.5432;
  const f = (v) => v - Math.floor(v);
  return { x: (f(r1) - 0.5) * 1500, y: (f(r2) - 0.5) * 1000, rot: (f(r3) - 0.5) * 180 };
});

function SkillCard({ item, index, cardRef, w, h }) {
  return (
    <div
      ref={cardRef}
      className="group absolute left-1/2 top-1/2 opacity-0"
      style={{ width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, perspective: 800, willChange: 'transform, opacity' }}
      role="listitem"
      aria-label={`${item.name}, ${item.category}`}
      data-index={index}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:[transform:rotateY(180deg)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0b0f1a] p-2 text-center shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="break-words font-mono text-[9px] font-medium uppercase leading-tight tracking-wide text-slate-100 md:text-[11px] md:tracking-wider">
            {item.label}
          </span>
          <span className="mt-2 h-px w-5 bg-amber-400/70" aria-hidden="true" />
          <span className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-slate-500">
            {item.category}
          </span>
        </div>
        {/* back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-amber-400/40 bg-[#0e1320] p-2 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-amber-400">{item.category}</span>
          <span className="mt-1.5 text-[9px] leading-snug text-slate-400">
            {item.siblings.join(' · ')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const introRef = useRef(null);
  const arcCopyRef = useRef(null);
  const cardRefs = useRef([]);
  const listRef = useRef(null);

  // count=2 / tailStart=1 makes the controller's `cp` a plain 0..1 scroll progress.
  useJourneyController({
    store: skillsStore,
    tailStart: 1,
    sectionRef: trackRef,
    count: 2,
    isMobile: false,
    onIndex: () => {}
  });

  const w = isMobile ? 64 : 72;
  const h = isMobile ? 80 : 92;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const size = { w: stage.clientWidth, h: stage.clientHeight };
    const ro = new ResizeObserver(([entry]) => {
      size.w = entry.contentRect.width;
      size.h = entry.contentRect.height;
    });
    ro.observe(stage);

    const cur = { a: 0, m: 0, r: 0, px: 0, py: 0 };
    const ptr = { x: 0, y: 0 };
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true });
    let raf = 0;
    let last = performance.now();

    const layout = () => {
      const { a, m, r } = cur;
      const minDim = Math.min(size.w, size.h);
      const circleR = Math.min(minDim * 0.35, 350);
      const arcR = Math.min(size.w, size.h * 1.5) * (isMobile ? 1.4 : 1.1);
      const apexY = size.h * (isMobile ? 0.35 : 0.25);
      const spread = isMobile ? 140 : 130;
      const step = spread / (TOTAL - 1);
      const startAngle = -90 - spread / 2;
      const rotation = -r * spread * 0.8;
      const lineSpacing = isMobile ? 56 : 76;

      for (let i = 0; i < TOTAL; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        // scatter -> line -> circle (driven by how far the section has entered)
        const sc = SCATTER[i];
        const line = { x: i * lineSpacing - (TOTAL * lineSpacing) / 2, y: 0, rot: 0 };
        const ca = (i / TOTAL) * 360;
        const cr = (ca * Math.PI) / 180;
        const circ = { x: Math.cos(cr) * circleR, y: Math.sin(cr) * circleR, rot: ca + 90 };

        let base;
        if (a < 0.5) {
          const t = smooth(a, 0, 0.5);
          base = { x: lerp(sc.x, line.x, t), y: lerp(sc.y, line.y, t), rot: lerp(sc.rot, line.rot, t), s: lerp(0.6, 1, t) };
        } else {
          const t = smooth(a, 0.5, 1);
          base = { x: lerp(line.x, circ.x, t), y: lerp(line.y, circ.y, t), rot: lerp(line.rot, circ.rot, t), s: 1 };
        }

        // circle -> bottom arc
        const arcAngle = startAngle + i * step + rotation;
        const ar = (arcAngle * Math.PI) / 180;
        const arc = {
          x: Math.cos(ar) * arcR,
          y: Math.sin(ar) * arcR + apexY + arcR,
          rot: arcAngle + 90,
          s: isMobile ? 1.0 : 1.7
        };

        const x = lerp(base.x, arc.x, m);
        const y = lerp(base.y, arc.y, m);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${lerp(base.rot, arc.rot, m)}deg) scale(${lerp(base.s, arc.s, m)})`;
        el.style.opacity = String(smooth(a, 0, 0.25));
      }

      // Only a light wash behind the stage: the shared 3D scene (core, rings, nodes) must stay
      // visible. Tiles carry their own solid faces, so they stay readable over it.
      stage.style.backgroundColor = `rgba(5, 7, 13, ${0.22 * smooth(a, 0.3, 1)})`;
      // 3D depth: the whole arc leans toward the pointer (desktop mouse only).
      if (listRef.current) {
        listRef.current.style.transform = `perspective(1400px) rotateX(${(-cur.py * 5).toFixed(2)}deg) rotateY(${(cur.px * 7).toFixed(2)}deg)`;
      }
      if (introRef.current) {
        introRef.current.style.opacity = String(smooth(a, 0.6, 1) * (1 - smooth(m, 0, 0.45)));
      }
      if (arcCopyRef.current) {
        const o = smooth(m, 0.8, 1);
        arcCopyRef.current.style.opacity = String(o);
        arcCopyRef.current.style.transform = `translateY(${(1 - o) * 20}px)`;
      }
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { enter, cp: p } = skillsStore;
      const target = reduced
        ? { a: 1, m: 1, r: 0 } // static, fully formed arc
        : { a: smooth(enter, 0.1, 0.9), m: smooth(p, 0.02, 0.3), r: clamp01((p - 0.3) / 0.6) };
      const k = reduced ? 1 : 1 - Math.pow(0.02, dt);
      cur.a += (target.a - cur.a) * k;
      cur.m += (target.m - cur.m) * k;
      cur.r += (target.r - cur.r) * k;
      cur.px += (ptr.x - cur.px) * (1 - Math.pow(0.01, dt));
      cur.py += (ptr.y - cur.py) * (1 - Math.pow(0.01, dt));
      layout();
      raf = requestAnimationFrame(frame);
    };

    // Only run while the section is anywhere near the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      },
      { rootMargin: '100% 0px 100% 0px' }
    );
    io.observe(sectionRef.current);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
      ro.disconnect();
    };
  }, [isMobile, reduced]);

  return (
    <div ref={sectionRef} className="relative z-10">
      {/* scroll track: sticky stage inside */}
      <div ref={trackRef} style={{ height: isMobile ? '300vh' : '400vh' }}>
        <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden pt-16">
          <div ref={introRef} className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center opacity-0">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-100 md:text-5xl">Technical Skills</h2>
            <p className="mt-4 font-mono text-xs tracking-[0.25em] text-slate-500 uppercase">Scroll to explore</p>
          </div>

          <div
            ref={arcCopyRef}
            className="pointer-events-none absolute left-0 right-0 top-[14%] z-10 px-6 text-center opacity-0"
          >
            <p className="font-mono text-xs tracking-[0.3em] text-amber-400 uppercase">Stack</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
              Backend, languages, databases, AI &amp; data, infrastructure and frontend — scroll to shuffle, hover a tile to flip it.
            </p>
          </div>

          <div ref={listRef} role="list" aria-label="Featured technologies" className="absolute inset-0">
            {FEATURED.map((item, i) => (
              <SkillCard
                key={item.name}
                item={item}
                index={i}
                w={w}
                h={h}
                cardRef={(el) => (cardRefs.current[i] = el)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* every skill, as plain HTML */}
      <div className="bg-[#05070d]/90 px-6 pb-24 pt-8">
        <div className="mx-auto grid max-w-6xl gap-8 border-t border-white/5 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => (
            <section key={cat.title}>
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400">{cat.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
