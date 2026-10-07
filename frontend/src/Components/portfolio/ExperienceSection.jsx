import React, { useRef, useState } from 'react';
import useMediaQuery from './scene/useMediaQuery';
import { useJourneyController, TAIL_START } from './scene/experienceStore';

/**
 * Work Experience as a scroll-driven career path. This file owns all real
 * content (semantic HTML); the 3D scene in scene/ExperienceJourney.jsx only
 * visualizes it. Ordered newest-first, like a resume, so scrolling forward goes back
 * through the career. `legend` and `metrics` only restate what the highlights say.
 */
const EXPERIENCES = [
  {
    company: 'Airawat Research Foundation (IIT Kanpur)',
    role: 'Software Developer',
    period: 'Aug 2025 – Present',
    legend: 'User → Keycloak SSO → Permission-check API → OpenFGA ReBAC → Internal apps',
    metrics: [
      { value: '10+', label: 'Sensor APIs unified' },
      { value: '2', label: 'City deployments' },
      { value: '~60%', label: 'Less manual review' }
    ],
    highlights: [
      'Air Quality Decision Support System: Built a multi-city platform in Node.js unifying 10+ sensor APIs behind one ingestion worker, with a deterministic rule evaluator generating alerts and response procedures on 15-minute and hourly cycles.',
      'Replaced a legacy rule engine, integrated ML models for hotspot detection and PM2.5 forecasting, and made the platform registry-driven so a new city needs only a config and database entry, shipping two city deployments with zero code forks.',
      'Centralized Auth Framework: Architected a central authorization platform on Keycloak SSO with OpenFGA ReBAC, exposing one relationship-aware permission check API for all internal applications.',
      'Removed authorization logic from individual services, making access rules auditable in one place and letting new applications onboard without writing their own permission code.',
      'CI/CD Platform: Built a self-configuring Jenkins setup (Docker Compose, JCasC, Groovy) provisioning Multibranch pipelines across 5+ repositories with SSH-based deployments, replacing hand-made jobs with zero-touch delivery.',
      'LLM-Powered Grievance Dashboard: Shipped a Node.js service on OpenAI APIs doing 8-category classification, summaries and natural-language querying, cutting manual review time by about 60% for a team handling 50,000+ complaints a month.'
    ]
  },
  {
    company: 'Turing',
    role: 'Software Engineer',
    period: 'May 2024 – Jun 2025',
    legend: 'Docker sandboxes (C++ · Python · Java · TS) → Redis aggregation → Rubric evaluation → RLHF data',
    metrics: [
      { value: '30–50%', label: 'Lower latency' },
      { value: '~40%', label: 'Faster benchmarking' },
      { value: '<10s', label: 'Reporting lag' }
    ],
    highlights: [
      'Secure Code Execution Platform: Architected a multi-language Docker sandbox (C++, Python, Java, TypeScript) that isolates untrusted submissions from the host.',
      'Cut per-execution latency by 30–50% and removed host-level security incidents, making the platform safe to run at scale on arbitrary user code.',
      'Evaluation Pipeline: Built Node.js services that orchestrated code-run workflows, normalized heterogeneous logs and surfaced structured diffs, shortening benchmarking cycle time by about 40%.',
      'Result Aggregation: Designed an async collection layer on Node.js and Redis that handled out-of-order arrivals and partial failures from distributed workers, dropping reporting lag from minutes to under 10 seconds.',
      'LLM Evaluation: Wrote rubric-based assessments of model-generated code on correctness, edge cases and idiomatic style, producing failure-mode annotations that fed RLHF and fine-tuning pipelines.',
      'Async Collaboration: Worked fully remote with US-based engineering and product teams, writing design briefs in Notion, running code reviews across time zones and owning features end to end.'
    ]
  },
  {
    company: 'InsuranceDekho',
    role: 'Software Engineer',
    period: 'Jul 2022 – May 2024',
    legend: '4 services → RabbitMQ → Single consumer → Partner adapters · DLQ / retry',
    metrics: [
      { value: '10K+', label: 'Daily leads' },
      { value: '30–40%', label: 'Throughput' },
      { value: '99.5%+', label: 'Delivery' }
    ],
    highlights: [
      'Renewal Pipeline Redesign: Consolidated renewal logic spread across 4 loosely coupled microservices into one Node.js (Express) service backed by a RabbitMQ pipeline.',
      'The old fan-out caused cross-service race conditions and inconsistent retries; a single-consumer design with durable queues preserved per-policy ordering and lifted throughput by 30–40% across 10,000+ daily leads.',
      'Reliability Engineering: Added dead-letter queues, exponential backoff with jitter and idempotent handlers keyed on policy and event hash, with alerts on DLQ depth and consumer lag, holding 99.5%+ delivery through 3x–4x peak traffic.',
      'Integration Layer: Built TypeScript adapters for auth flows, schema normalization and error code translation behind a common interface, covered by contract tests, cutting new partner onboarding from weeks to 2–3 days.'
    ]
  },
  {
    company: 'Samsung Research Institute Bangalore',
    role: 'Software Engineer Intern',
    period: 'May 2021 – Jul 2021',
    legend: 'Raw sensor input → Preprocessing → UNet → RGB output',
    highlights: [
      'Low-Light Enhancement Pipeline: Built an end-to-end image enhancement pipeline in TensorFlow based on the See in the Dark (SID) paper — replaced the traditional ISP stack with an end-to-end UNet trained from scratch on the SID dataset to directly map raw dark sensor inputs to clean, well-exposed RGB outputs.',
      'Raw Image Preprocessing: Built a preprocessing pipeline for raw sensor data — applying noise removal, brightness amplification, and normalization before model ingestion, ensuring the training distribution accurately reflected real-world low-light capture conditions and improving PSNR across varying darkness levels.'
    ]
  }
];

const N = EXPERIENCES.length;
const pad = (n) => String(n).padStart(2, '0');
const yearOf = (period) => period.match(/\d{4}/)[0];

// "Label: detail" -> bold label + detail, only when the prefix really is a short label.
function splitHighlight(text) {
  const i = text.indexOf(': ');
  if (i > 0 && i <= 45 && !/[,.;]/.test(text.slice(0, i))) {
    return { lead: text.slice(0, i), rest: text.slice(i + 2) };
  }
  return { lead: null, rest: text };
}

function Article({ exp, index }) {
  return (
    <>
      <p className="font-mono text-xs tracking-[0.3em] text-slate-500">
        {pad(index + 1)} / {pad(N)}
      </p>
      <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-100">
        {exp.company}
      </h3>
      <p className="mt-2 font-mono text-xs tracking-[0.2em] uppercase text-amber-400">
        {exp.role} · {exp.period}
      </p>

      {exp.metrics && (
        <dl className="mt-4 grid grid-cols-3 gap-4 border-y border-white/5 py-3">
          {exp.metrics.map((m) => (
            <div key={m.label} className="flex flex-col">
              <dt className="order-2 mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{m.label}</dt>
              <dd className="font-mono text-xl md:text-2xl font-semibold text-amber-300">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="mt-4 space-y-2.5">
        {exp.highlights.map((h) => {
          const { lead, rest } = splitHighlight(h);
          return (
            <li key={h} className="flex gap-3 text-[13px] leading-[1.55] text-slate-400">
              <span aria-hidden="true" className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400/80" />
              <span>
                {lead && <strong className="font-medium text-slate-200">{lead}: </strong>}
                {rest}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Legend({ text }) {
  return (
    <p className="font-mono text-[11px] leading-relaxed tracking-[0.16em] uppercase text-slate-500">
      <span className="text-amber-400">Architecture</span>
      <br />
      {text}
    </p>
  );
}

export default function ExperienceSection() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const fillRef = useRef(null);
  const [active, setActive] = useState(0);

  useJourneyController({ sectionRef, panelRef, fillRef, count: N, isMobile, onIndex: setActive });

  const goTo = (i) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY + (i / (N - 1)) * TAIL_START * (rect.height - window.innerHeight);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const stateClass = (i) =>
    i === active
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-3 invisible pointer-events-none';

  if (isMobile) {
    return (
      <div ref={sectionRef} className="relative z-10 px-6 pt-24">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-100">Work Experience</h2>
        {EXPERIENCES.map((exp, i) => (
          <article key={exp.company} data-journey-article className="pb-20">
            {/* reserves the upper screen for the 3D checkpoint behind the text */}
            <div className="h-[30vh]" aria-hidden="true" />
            <Article exp={exp} index={i} />
            <div className="mt-6 border-t border-white/5 pt-4">
              <Legend text={exp.legend} />
            </div>
          </article>
        ))}
        <div data-journey-tail className="h-[45vh]" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative z-10" style={{ height: `${N * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center px-6 pt-16">
        <div ref={panelRef} className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-12">
          {/* Left: heading, progress rail, architecture legend (3D checkpoint renders behind) */}
          <div className="flex max-h-[78vh] flex-col justify-between">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-100">
              Work Experience
            </h2>

            <ol className="relative flex w-28 flex-col gap-8" aria-label="Career timeline">
              <span aria-hidden="true" className="absolute left-[3px] top-2 bottom-2 w-px bg-white/10" />
              <span
                ref={fillRef}
                aria-hidden="true"
                className="absolute left-[3px] top-2 bottom-2 w-px origin-top bg-amber-400"
                style={{ transform: 'scaleY(0)' }}
              />
              {EXPERIENCES.map((exp, i) => (
                <li key={exp.company}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to ${exp.company}`}
                    aria-current={i === active ? 'step' : undefined}
                    className="relative block pl-6 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full transition-colors duration-300 ${
                        i <= active ? 'bg-amber-400' : 'bg-slate-600'
                      }`}
                    />
                    <span
                      className={`block font-mono text-xs tracking-[0.25em] transition-colors duration-300 ${
                        i === active ? 'text-slate-100' : 'text-slate-500'
                      }`}
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="block font-mono text-[10px] tracking-[0.2em] text-slate-600">
                      {yearOf(exp.period)}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="grid">
              {EXPERIENCES.map((exp, i) => (
                <div
                  key={exp.company}
                  className={`col-start-1 row-start-1 transition-[opacity,visibility] duration-500 ${
                    i === active ? 'opacity-100' : 'opacity-0 invisible'
                  }`}
                >
                  <Legend text={exp.legend} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: active company (all four stay in the DOM) */}
          <div className="grid max-h-[calc(100vh-7rem)] self-center overflow-y-auto pr-2">
            {EXPERIENCES.map((exp, i) => (
              <article
                key={exp.company}
                aria-hidden={i === active ? undefined : 'true'}
                className={`col-start-1 row-start-1 transition-[opacity,transform,visibility] duration-500 ease-out ${stateClass(i)}`}
              >
                <Article exp={exp} index={i} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
