import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import SystemCore from './SystemCore';
import ExperienceJourney from './ExperienceJourney';
import ProjectsJourney from './ProjectsJourney';
import useMediaQuery from './useMediaQuery';
import useScrollProgress from './useScrollProgress';
import { supportsWebGL, WebGLErrorBoundary } from './WebGLGuard';

/**
 * Persistent, fixed, full-viewport WebGL layer. Mounted once at the page
 * level so later sections (Skills, Experience, ...) can extend the same
 * canvas/world by reading further scroll range instead of spinning up
 * their own Three.js contexts.
 */
export default function SystemScene() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const scrollProgress = useScrollProgress('hero');
  const pointer = useRef({ x: 0, y: 0 });
  const webglOk = useMemo(() => supportsWebGL(), []);
  // Set by ExperienceJourney once it owns the shared camera; Hero's rig reads it to step aside.
  const suppress = useRef(false);
  const vignetteRef = useRef(null);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const handlePointerMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [reducedMotion, isMobile]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(30,41,59,0.45) 0%, transparent 60%), linear-gradient(180deg, #05070d 0%, #090c15 45%, #05070d 100%)',
        }}
      />
      {/* If this browser/machine can't create a WebGL context (GPU accel
          disabled, VM/remote desktop, too many contexts already open), skip
          the canvas entirely and keep the gradient backdrop above. The
          error boundary is a second line of defense in case the probe
          passes but react-three-fiber's mount effect still throws. */}
      {webglOk && (
        <WebGLErrorBoundary>
          <div className="absolute inset-0">
            <Canvas
              dpr={[1, isMobile ? 1.5 : 2]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              camera={{ position: [0, 0, isMobile ? 12.5 : 10.5], fov: 45 }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <SystemCore
                  pointer={pointer}
                  scrollProgress={scrollProgress}
                  reducedMotion={reducedMotion}
                  isMobile={isMobile}
                  suppress={suppress}
                />
                <ExperienceJourney
                  pointer={pointer}
                  reducedMotion={reducedMotion}
                  isMobile={isMobile}
                  suppress={suppress}
                  vignetteRef={vignetteRef}
                />
                <ProjectsJourney
                  pointer={pointer}
                  reducedMotion={reducedMotion}
                  isMobile={isMobile}
                  suppress={suppress}
                />
              </Suspense>
            </Canvas>
          </div>

          {/* Recede the system behind the text column — keeps the headline
              and copy legible while the flanking nodes stay visible as
              architecture. drei's <Html> labels (and the canvas itself)
              carry very high inline z-indices, so this mask needs an
              explicit z-index above those to actually paint on top rather
              than just matching document order. */}
          <div
            ref={vignetteRef}
            className="absolute inset-0"
            style={{
              zIndex: 2147483000,
              background: isMobile
                ? 'radial-gradient(ellipse 95% 80% at 50% 42%, rgba(5,7,13,0.96) 0%, rgba(5,7,13,0.88) 55%, rgba(5,7,13,0.55) 78%, transparent 92%)'
                : 'radial-gradient(ellipse 40% 60% at 50% 42%, rgba(5,7,13,0.92) 0%, rgba(5,7,13,0.65) 45%, transparent 72%)',
            }}
          />
        </WebGLErrorBoundary>
      )}
    </div>
  );
}
