import React, { useRef } from 'react';
import useMediaQuery from './scene/useMediaQuery';
import { useJourneyController, projectsStore, PROJECTS_TAIL_START, PROJECTS_HEAD_START } from './scene/experienceStore';
import { PROJECTS } from './projectsData';
import ProjectBook from './ProjectBook';

/**
 * Projects = the project book and nothing else. Every project's description, stack,
 * diagram and engineering points live on the book's pages (real HTML). Scroll opens the
 * pages, then the section hands off to Contact through the 3D convergence ending
 * (scene/ProjectsJourney.jsx). A "source" link renders only for projects that actually
 * have a URL (today just AI Metering Service); it sits outside the flip target.
 */

// module-level so the controller effect doesn't re-run each render
const INTRO_IN = [0.08, 0.28]; // book fades in after the camera has left the tunnel
const noop = () => {};

export default function ProjectsSection() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const sectionRef = useRef(null);
  const introRef = useRef(null);

  useJourneyController({
    store: projectsStore,
    tailStart: PROJECTS_TAIL_START,
    headStart: PROJECTS_HEAD_START,
    introRef,
    introIn: INTRO_IN,
    introKeep: true,
    sectionRef,
    count: 2,
    isMobile,
    onIndex: noop
  });

  const linked = PROJECTS.filter((p) => p.github);

  const caption = (
    <>
      <p className="mt-8 font-mono text-xs tracking-[0.3em] text-amber-400 uppercase">Engineering projects</p>
      <p className="mt-2 text-2xl font-semibold uppercase tracking-tight text-slate-100 md:text-3xl">Systems at a glance</p>
      {linked.length > 0 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-3">
          {linked.map((p) => (
            <li key={p.title}>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] uppercase text-amber-300 transition-colors duration-300 hover:border-amber-400 hover:bg-amber-400/10"
              >
                {p.short} source <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div ref={sectionRef} className="relative z-10 px-6">
        {/* the card stays pinned while scroll turns it through every project */}
        <div data-journey-head style={{ height: '230vh' }}>
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center pt-16">
            <ProjectBook variant="deck" pageWidth={300} />
            <div className="flex flex-col items-center text-center">{caption}</div>
          </div>
        </div>
        <div data-journey-tail className="h-[45vh]" aria-hidden="true" />
      </div>
    );
  }

  return (
    // 260vh = one pinned screen + 160vh of scroll: opening the book, then the ending
    <div ref={sectionRef} className="relative z-10" style={{ height: '260vh', marginTop: '-100vh' }}>
      <div className="sticky top-0 flex h-screen items-center px-6 pt-16">
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pt-16"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="pointer-events-auto">
            <ProjectBook pageWidth={340} />
          </div>
          <div className="pointer-events-auto flex flex-col items-center text-center">{caption}</div>
        </div>
      </div>
    </div>
  );
}
