import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Shared, mutable scroll state for the Experience journey. The HTML section
 * (ExperienceSection) computes it from its own layout; the WebGL scene
 * (ExperienceJourney) reads it every frame. Plain object, not React state,
 * so scrolling never triggers a re-render.
 *
 *   enter  0..1  how far the section has entered the viewport (0 = not yet
 *                reached, stays 1 once reached or passed)
 *   cp     0..N-1 continuous "company progress" (1.5 = halfway between the
 *                2nd and 3rd company)
 *   tail   0..1  progress through the Experience -> Projects handoff beat
 */
export const experienceStore = { enter: 0, cp: 0, tail: 0, head: 1 };
// head: 0..1 progress through an optional leading phase (Projects' overview gallery).
export const projectsStore = { enter: 0, cp: 0, tail: 0, head: 1 };
// Skills only needs a plain 0..1 progress (read from `cp` with count=2, tailStart=1).
// Set by the Contact section's primary button so the 3D core can react to it.
export const contactStore = { hot: 0 };
export const skillsStore = { enter: 0, cp: 0, tail: 0, head: 1 };

// Fraction of each desktop scroll range spent on items; the rest is the handoff tail.
export const TAIL_START = 0.93;
// Projects = tunnel exit + the book (head), then the convergence ending (tail). No per-project scroll.
export const PROJECTS_TAIL_START = 0.65;
export const PROJECTS_HEAD_START = 0.65;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export function useJourneyController({
  store = experienceStore,
  tailStart = TAIL_START,
  headStart = 0, // fraction of the scroll range spent on a leading phase before item 0
  introRef = null, // element shown only during that leading phase
  introIn = null, // [start, end] of `head` over which that element fades in
  introKeep = false, // keep the intro element up after the head phase (it fades with `tail` instead)
  fadeIn = null, // [start, end] of store.enter over which the content fades in
  sectionRef,
  panelRef,
  fillRef,
  count,
  isMobile,
  onIndex,
}) {
  const onIndexRef = useRef(onIndex);
  onIndexRef.current = onIndex;

  useEffect(() => {
    let ticking = false;
    let lastIndex = -1;

    const compute = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      let cp = 0;
      let tail = 0;
      let head = 1;

      if (!isMobile) {
        const scrollable = rect.height - vh;
        const p = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0;
        head = headStart > 0 ? clamp01(p / headStart) : 1;
        cp = tailStart > headStart ? clamp01((p - headStart) / (tailStart - headStart)) * (count - 1) : 0;
        tail = clamp01((p - tailStart) / (1 - tailStart));
      } else {
        // Stacked articles: derive continuous progress from where the
        // viewport midline sits between article centers.
        const articles = el.querySelectorAll('[data-journey-article]');
        const mid = vh * 0.5;
        const centers = Array.from(articles).map((a) => {
          const r = a.getBoundingClientRect();
          return r.top + r.height / 2;
        });
        if (centers.length) {
          if (mid <= centers[0]) cp = 0;
          else if (mid >= centers[centers.length - 1]) cp = centers.length - 1;
          else {
            let i = 0;
            while (i < centers.length - 2 && mid >= centers[i + 1]) i++;
            cp = i + (mid - centers[i]) / (centers[i + 1] - centers[i]);
          }
        }
        const headEl = el.querySelector('[data-journey-head]');
        if (headEl) {
          const hr = headEl.getBoundingClientRect();
          // the head block is a tall track with a pinned (sticky) screen inside it
          head = clamp01(-hr.top / Math.max(1, hr.height - vh));
        }
        const tailEl = el.querySelector('[data-journey-tail]');
        if (tailEl) {
          const tr = tailEl.getBoundingClientRect();
          tail = clamp01((vh * 0.9 - tr.top) / (tr.height || 1));
        }
      }

      store.enter = clamp01(1 - rect.top / vh);
      store.cp = cp;
      store.tail = tail;
      store.head = head;

      const idx = Math.min(count - 1, Math.max(0, Math.round(cp)));
      if (idx !== lastIndex) {
        lastIndex = idx;
        onIndexRef.current?.(idx);
      }

      if (fillRef?.current) {
        fillRef.current.style.transform = `scaleY(${count > 1 ? cp / (count - 1) : 0})`;
      }
      if (introRef?.current) {
        const g =
          THREE.MathUtils.smoothstep(store.enter, 0.5, 0.9) *
          (introIn ? THREE.MathUtils.smoothstep(head, introIn[0], introIn[1]) : 1) *
          (introKeep ? 1 : 1 - THREE.MathUtils.smoothstep(head, 0.7, 0.95)) *
          (1 - THREE.MathUtils.smoothstep(tail, 0, 0.35));
        introRef.current.style.opacity = String(g);
        introRef.current.style.visibility = g < 0.02 ? 'hidden' : 'visible';
        introRef.current.style.transform = `translateY(${(1 - g) * 12}px)`;
      }
      if (panelRef?.current && !isMobile) {
        const fin = fadeIn ? THREE.MathUtils.smoothstep(store.enter, fadeIn[0], fadeIn[1]) : 1;
        const f = fin * (1 - THREE.MathUtils.smoothstep(tail, 0, 0.3)) * THREE.MathUtils.smoothstep(head, 0.85, 1);
        panelRef.current.style.opacity = String(f);
        panelRef.current.style.transform = `translateY(${(1 - f) * (tail > 0 ? -16 : 16)}px)`;
      }
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
      store.enter = 0;
      store.cp = 0;
      store.tail = 0;
      store.head = 1;
    };
  }, [store, tailStart, headStart, fadeIn, introIn, introKeep, sectionRef, panelRef, fillRef, introRef, count, isMobile]);
}
