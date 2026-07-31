import React, { useEffect, useRef } from 'react';

/**
 * Themed 3D ambient backgrounds — pure CSS 3D, no WebGL needed.
 * Each variant renders floating, mouse-parallaxed elements inside a
 * `perspective` + `preserve-3d` stage, absolutely positioned behind content.
 */

function useParallax(ref, strength = 30) {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = (e.clientY / window.innerHeight) * 2 - 1;
      el.querySelectorAll('[data-layer]').forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-layer')) || 0;
        layer.style.transform = `translate3d(${px * depth * -strength}px, ${py * depth * -strength}px, ${depth * 80}px)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [ref, strength]);
}

function Stage({ children, innerRef }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div
        ref={innerRef}
        className="absolute inset-0"
        style={{ perspective: '900px', transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  );
}

const sharedStyles = `
  @keyframes scanDown {
    0% { top: -10%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 110%; opacity: 0; }
  }
  @keyframes orbitSpin {
    from { transform: rotateZ(0deg) rotateX(70deg); }
    to { transform: rotateZ(360deg) rotateX(70deg); }
  }
  @keyframes counterOrbit {
    from { transform: rotateZ(0deg); }
    to { transform: rotateZ(-360deg); }
  }
  @keyframes monolithRise {
    0%, 100% { transform: translateY(0) rotateX(8deg); }
    50% { transform: translateY(-14px) rotateX(8deg); }
  }
  @keyframes pedestalGlow {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.7; }
  }
  @keyframes waveDrift {
    0%, 100% { transform: translateY(0) rotateX(60deg); }
    50% { transform: translateY(-18px) rotateX(60deg); }
  }
  @keyframes pulseRing {
    0% { transform: rotateX(70deg) scale(0.6); opacity: 0.6; }
    100% { transform: rotateX(70deg) scale(1.6); opacity: 0; }
  }
  @keyframes hologramSweep {
    0%, 100% { background-position: 0% 0%; }
    50% { background-position: 0% 100%; }
  }
`;

/* ============ HERO: floating code brackets + drifting terminal panes ============ */
export function HeroAmbient() {
  const ref = useRef(null);
  useParallax(ref, 26);

  const brackets = [
    { text: '</>', top: '12%', left: '8%', depth: 0.5, size: '3.5rem', dur: '9s' },
    { text: '{ }', top: '22%', left: '85%', depth: 0.8, size: '3rem', dur: '12s' },
    { text: '( )', top: '70%', left: '6%', depth: 0.7, size: '2.6rem', dur: '10s' },
    { text: '[ ]', top: '76%', left: '88%', depth: 0.6, size: '2.8rem', dur: '11s' },
    { text: '=>', top: '8%', left: '55%', depth: 1.0, size: '2.4rem', dur: '8s' },
    { text: '01', top: '48%', left: '93%', depth: 0.9, size: '2.2rem', dur: '13s' },
  ];

  return (
    <>
      <Stage innerRef={ref}>
        {brackets.map((b, i) => (
          <div
            key={i}
            data-layer={b.depth}
            className="absolute font-mono font-bold text-amber-400/30"
            style={{
              top: b.top,
              left: b.left,
              fontSize: b.size,
              textShadow: '0 0 25px rgba(251, 191, 36, 0.5)',
              animation: `scanDown${''} none, float${(i % 3) + 1} ${b.dur} ease-in-out infinite`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            {b.text}
          </div>
        ))}

        {/* drifting translucent terminal panes */}
        {[0, 1].map((i) => (
          <div
            key={`pane-${i}`}
            data-layer={i === 0 ? 0.35 : 0.65}
            className="absolute rounded-lg border border-sky-400/20 bg-sky-400/5 backdrop-blur-[1px]"
            style={{
              width: i === 0 ? 220 : 170,
              height: i === 0 ? 130 : 100,
              top: i === 0 ? '18%' : '62%',
              left: i === 0 ? '72%' : '3%',
              boxShadow: '0 0 40px rgba(56, 189, 248, 0.12)',
              animation: `float${(i % 3) + 1} ${16 + i * 4}s ease-in-out infinite`,
              transition: 'transform 0.25s ease-out',
              overflow: 'hidden',
            }}
          >
            {/* fake code lines */}
            {[70, 45, 85, 55, 65].map((w, j) => (
              <div
                key={j}
                className="h-1.5 rounded-full mx-3"
                style={{
                  width: `${w}%`,
                  marginTop: j === 0 ? 14 : 10,
                  background: 'linear-gradient(90deg, rgba(56,189,248,0.35), rgba(251,191,36,0.25))',
                }}
              />
            ))}
          </div>
        ))}
      </Stage>
      <style>{sharedStyles}</style>
    </>
  );
}

/* ============ SKILLS: orbiting orbital rings around a glowing core ============ */
export function SkillsAmbient() {
  const ref = useRef(null);
  useParallax(ref, 20);

  return (
    <>
      <Stage innerRef={ref}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* core */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 90,
              height: 90,
              background: 'radial-gradient(circle, rgba(251,191,36,0.45) 0%, rgba(251,191,36,0.05) 65%, transparent 75%)',
              filter: 'blur(2px)',
            }}
          />
          {/* orbital rings */}
          {[260, 400, 540].map((d, i) => (
            <div
              key={i}
              data-layer={0.2 + i * 0.15}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: d,
                height: d,
                border: `1.5px solid ${['rgba(251,191,36,0.35)', 'rgba(56,189,248,0.28)', 'rgba(244,114,182,0.22)'][i]}`,
                animation: `orbitSpin ${26 + i * 10}s linear infinite`,
                transition: 'transform 0.25s ease-out',
              }}
            >
              {/* satellite node on each ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 14 - i * 2,
                  height: 14 - i * 2,
                  top: -7,
                  left: '50%',
                  background: ['#fbbf24', '#38bdf8', '#f472b6'][i],
                  boxShadow: `0 0 18px ${['#fbbf24', '#38bdf8', '#f472b6'][i]}`,
                }}
              />
            </div>
          ))}
        </div>
      </Stage>
      <style>{sharedStyles}</style>
    </>
  );
}

/* ============ EXPERIENCE: ascending 3D monolith towers (career growth) ============ */
export function ExperienceAmbient() {
  const ref = useRef(null);
  useParallax(ref, 22);

  const towers = [
    { h: 120, w: 34, left: '6%', color: 'rgba(245,158,11,0.28)', duration: '7s' },
    { h: 190, w: 34, left: '11%', color: 'rgba(251,146,60,0.26)', duration: '8s' },
    { h: 260, w: 34, left: '16%', color: 'rgba(251,191,36,0.26)', duration: '9s' },
    { h: 340, w: 34, left: '21%', color: 'rgba(252,211,77,0.26)', duration: '10s' },
  ];

  return (
    <>
      <Stage innerRef={ref}>
        {/* towers rising from the bottom-left corner */}
        <div
          className="absolute bottom-0"
          style={{ left: 0, transformStyle: 'preserve-3d', perspective: '700px', width: '32%', height: '100%' }}
        >
          {towers.map((t, i) => (
            <div
              key={i}
              data-layer={0.25 + i * 0.12}
              className="absolute bottom-0"
              style={{
                left: `calc(${t.left} - 6%)`,
                height: t.h,
                width: t.w,
                background: `linear-gradient(to top, ${t.color}, transparent)`,
                border: `1px solid ${t.color}`,
                borderBottom: 'none',
                borderRadius: '6px 6px 0 0',
                boxShadow: `0 0 30px ${t.color}`,
                animation: `monolithRise ${t.duration} ease-in-out infinite`,
                animationDelay: `${i * 0.7}s`,
                transition: 'transform 0.25s ease-out',
              }}
            />
          ))}
        </div>

        {/* mirrored set on the right, dimmer */}
        <div
          className="absolute bottom-0 right-0 hidden md:block"
          style={{ transformStyle: 'preserve-3d', perspective: '700px', width: '30%', height: '100%', opacity: 0.55 }}
        >
          {towers.map((t, i) => (
            <div
              key={i}
              data-layer={0.25 + (3 - i) * 0.12}
              className="absolute bottom-0"
              style={{
                right: `calc(${t.left} - 6%)`,
                height: t.h,
                width: t.w,
                background: `linear-gradient(to top, rgba(56,189,248,0.22), transparent)`,
                border: `1px solid rgba(56,189,248,0.2)`,
                borderBottom: 'none',
                borderRadius: '6px 6px 0 0',
                animation: `monolithRise ${t.duration} ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                transition: 'transform 0.25s ease-out',
              }}
            />
          ))}
        </div>
      </Stage>
      <style>{sharedStyles}</style>
    </>
  );
}

/* ============ PROJECTS: display pedestals with hologram sweeps ============ */
export function ProjectsAmbient() {
  const ref = useRef(null);
  useParallax(ref, 24);

  const pedestals = [
    { top: '10%', left: '4%', depth: 0.45, hue: 'rgba(251,191,36,' },
    { top: '58%', left: '86%', depth: 0.65, hue: 'rgba(56,189,248,' },
    { top: '78%', left: '8%', depth: 0.5, hue: 'rgba(244,114,182,' },
  ];

  return (
    <>
      <Stage innerRef={ref}>
        {pedestals.map((p, i) => (
          <div
            key={i}
            data-layer={p.depth}
            className="absolute"
            style={{ top: p.top, left: p.left, transition: 'transform 0.25s ease-out', transformStyle: 'preserve-3d' }}
          >
            {/* light cone from a virtual spotlight above */}
            <div
              style={{
                width: 120,
                height: 160,
                background: `linear-gradient(to bottom, ${p.hue}0.18) 0%, transparent 80%)`,
                clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)',
                animation: `pedestalGlow ${5 + i * 2}s ease-in-out infinite`,
              }}
            />
            {/* pedestal base — a real 3D-looking ellipse via rotateX */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: `1.5px solid ${p.hue}0.45)`,
                boxShadow: `0 0 25px ${p.hue}0.3), inset 0 0 25px ${p.hue}0.12)`,
                transform: 'rotateX(72deg)',
                animation: `pedestalGlow ${5 + i * 2}s ease-in-out infinite`,
              }}
            />
          </div>
        ))}

        {/* pulsing showcase ring in the middle-right */}
        <div
          data-layer="0.3"
          className="absolute right-[8%] top-[30%] hidden lg:block"
          style={{ transition: 'transform 0.25s ease-out', transformStyle: 'preserve-3d' }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-amber-400/40"
              style={{
                width: 180,
                height: 180,
                animation: `pulseRing ${4 + i * 2}s linear infinite`,
                animationDelay: `${i}s`,
              }}
            />
          ))}
        </div>
      </Stage>
      <style>{sharedStyles}</style>
    </>
  );
}

/* ============ CONTACT: signal waves ringing outward (opening a channel) ============ */
export function ContactAmbient() {
  const ref = useRef(null);
  useParallax(ref, 18);

  return (
    <>
      <Stage innerRef={ref}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              data-layer={0.15 + i * 0.08}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 160,
                height: 160,
                border: '1.5px solid rgba(251,191,36,0.35)',
                animation: `pulseRing ${5}s linear infinite`,
                animationDelay: `${i * 1.25}s`,
                transition: 'transform 0.25s ease-out',
              }}
            />
          ))}
          {/* center beacon */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 26,
              height: 26,
              background: 'radial-gradient(circle, rgba(251,191,36,0.9), rgba(251,191,36,0))',
              boxShadow: '0 0 40px rgba(251,191,36,0.6)',
            }}
          />
        </div>

        {/* two wave planes drifting in 3D */}
        {[0, 1].map((i) => (
          <div
            key={`wave-${i}`}
            data-layer={0.2 + i * 0.1}
            className="absolute left-0 right-0"
            style={{
              bottom: i === 0 ? '-5%' : '58%',
              height: '40%',
              backgroundImage: `repeating-linear-gradient(to right, ${i === 0 ? 'rgba(251,191,36,0.12)' : 'rgba(56,189,248,0.1)'} 0px, transparent 60px)`,
              animation: `waveDrift ${7 + i * 3}s ease-in-out infinite`,
              transition: 'transform 0.25s ease-out',
              transformStyle: 'preserve-3d',
              transform: 'rotateX(60deg)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 80%)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 80%)',
            }}
          />
        ))}
      </Stage>
      <style>{sharedStyles}</style>
    </>
  );
}
