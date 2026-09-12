import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Zap, TrendingUp, Shield, Cpu } from 'lucide-react';
import useTilt from './useTilt';
import { ExperienceAmbient } from './SectionAmbient';

const experiences = [
  {
    company: 'Airawat Research Foundation (IIT Kanpur)',
    role: 'Software Developer',
    period: 'Aug 2025 \u2013 Present',
    icon: Zap,
    color: 'from-purple-400 to-violet-500',
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
    period: 'May 2024 \u2013 Jun 2025',
    icon: Cpu,
    color: 'from-teal-400 to-cyan-500',
    highlights: [
      'Secure Code Execution Platform: Architected a multi-language Docker sandbox (C++, Python, Java, TypeScript) that isolates untrusted submissions from the host.',
      'Cut per-execution latency by 30\u201350% and removed host-level security incidents, making the platform safe to run at scale on arbitrary user code.',
      'Evaluation Pipeline: Built Node.js services that orchestrated code-run workflows, normalized heterogeneous logs and surfaced structured diffs, shortening benchmarking cycle time by about 40%.',
      'Result Aggregation: Designed an async collection layer on Node.js and Redis that handled out-of-order arrivals and partial failures from distributed workers, dropping reporting lag from minutes to under 10 seconds.',
      'LLM Evaluation: Wrote rubric-based assessments of model-generated code on correctness, edge cases and idiomatic style, producing failure-mode annotations that fed RLHF and fine-tuning pipelines.',
      'Async Collaboration: Worked fully remote with US-based engineering and product teams, writing design briefs in Notion, running code reviews across time zones and owning features end to end.'
    ]
  },
  {
    company: 'InsuranceDekho',
    role: 'Software Engineer',
    period: 'Jul 2022 \u2013 May 2024',
    icon: TrendingUp,
    color: 'from-green-400 to-emerald-500',
    highlights: [
      'Renewal Pipeline Redesign: Consolidated renewal logic spread across 4 loosely coupled microservices into one Node.js (Express) service backed by a RabbitMQ pipeline.',
      'The old fan-out caused cross-service race conditions and inconsistent retries; a single-consumer design with durable queues preserved per-policy ordering and lifted throughput by 30\u201340% across 10,000+ daily leads.',
      'Reliability Engineering: Added dead-letter queues, exponential backoff with jitter and idempotent handlers keyed on policy and event hash, with alerts on DLQ depth and consumer lag, holding 99.5%+ delivery through 3x\u20134x peak traffic.',
      'Integration Layer: Built TypeScript adapters for auth flows, schema normalization and error code translation behind a common interface, covered by contract tests, cutting new partner onboarding from weeks to 2\u20133 days.'
    ]
  },
  {
    company: 'Samsung Research Institute Bangalore',
    role: 'Software Engineer Intern',
    period: 'May 2021 – Jul 2021',
    icon: Shield,
    color: 'from-red-400 to-pink-500',
    highlights: [
      'Low-Light Enhancement Pipeline: Built an end-to-end image enhancement pipeline in TensorFlow based on the See in the Dark (SID) paper — replaced the traditional ISP stack with an end-to-end UNet trained from scratch on the SID dataset to directly map raw dark sensor inputs to clean, well-exposed RGB outputs.',
      'Raw Image Preprocessing: Built a preprocessing pipeline for raw sensor data — applying noise removal, brightness amplification, and normalization before model ingestion, ensuring the training distribution accurately reflected real-world low-light capture conditions and improving PSNR across varying darkness levels.'
    ]
  }
];

export default function ExperienceSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % experiences.length);
        setIsAnimating(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentExperience = experiences[currentIndex];
  const detailTilt = useTilt({ max: 10, scale: 1.02 });

  return (
    <div className="relative py-16 px-6 z-10">
      <ExperienceAmbient />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Work Experience
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Building innovative solutions across diverse technology stacks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Experience Timeline */}
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={exp.company}
                onClick={() => setCurrentIndex(index)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-slate-700/50 border-l-4 border-amber-400'
                    : 'bg-slate-800/30 hover:bg-slate-700/30 border-l-4 border-transparent hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${exp.color} flex items-center justify-center`}>
                    <exp.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{exp.company}</h3>
                    <p className="text-slate-400">{exp.role}</p>
                    <p className="text-sm text-slate-500">{exp.period}</p>
                  </div>
                  {index === currentIndex && (
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Experience Details */}
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-x-8' : 'opacity-100 transform translate-x-0'}`}>
            <div
              ref={detailTilt.ref}
              {...detailTilt.tiltProps}
              className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
              style={detailTilt.style}
            >
              <div className="flex items-center space-x-4 mb-6" data-tilt-depth="30">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${currentExperience.color} flex items-center justify-center shadow-lg`}>
                  <currentExperience.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{currentExperience.company}</h3>
                  <p className="text-lg text-slate-300">{currentExperience.role}</p>
                  <div className="flex items-center text-slate-400 mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {currentExperience.period}
                  </div>
                </div>
              </div>

              <div className="space-y-4" data-tilt-depth="15">
                {currentExperience.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 animate-slideInFromRight"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-slate-300 leading-relaxed">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-12 space-x-2">
          {experiences.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-amber-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
