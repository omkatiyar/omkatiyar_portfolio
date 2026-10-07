import { useEffect, useRef } from 'react';

/**
 * Tracks scroll progress (0 -> 1) as `sectionId` scrolls out of view upward,
 * scoped to roughly one viewport height. Written to a ref (not React state)
 * so the animation loop that reads it never triggers a React re-render.
 *
 * 0  = section top aligned with viewport top
 * 1  = section has scrolled up by ~one viewport height (next section arriving)
 */
export default function useScrollProgress(sectionId) {
  const progressRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const compute = () => {
      ticking = false;
      const el = document.getElementById(sectionId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = -rect.top / vh;
      progressRef.current = Math.min(1, Math.max(0, raw));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionId]);

  return progressRef;
}
