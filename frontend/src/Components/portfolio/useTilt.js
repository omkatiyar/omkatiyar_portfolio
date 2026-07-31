import { useRef, useCallback } from 'react';

/**
 * Attaches a real physical 3D tilt to a card element.
 * The card rotates in 3D perspective toward the cursor, with layered
 * children able to lift forward via [data-tilt-depth].
 */
export default function useTilt({ max = 12, scale = 1.03, perspective = 900 } = {}) {
  const ref = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const rotateY = (px - 0.5) * 2 * max; // left/right
      const rotateX = (0.5 - py) * 2 * max; // up/down

      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

      // Lift depth-layered children forward
      el.querySelectorAll('[data-tilt-depth]').forEach((child) => {
        const depth = parseFloat(child.getAttribute('data-tilt-depth')) || 0;
        child.style.transform = `translateZ(${depth}px)`;
        child.style.transition = 'transform 0.1s ease-out';
      });
    },
    [max, scale, perspective]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    el.querySelectorAll('[data-tilt-depth]').forEach((child) => {
      child.style.transform = 'translateZ(0px)';
    });
  }, [perspective]);

  return {
    ref,
    tiltProps: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
    style: {
      transformStyle: 'preserve-3d',
      transition: 'transform 0.25s ease-out',
      willChange: 'transform',
    },
  };
}
