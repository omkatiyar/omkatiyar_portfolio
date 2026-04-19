import React, { useState, useEffect } from 'react';
import { Building, Calendar, ChevronRight, Zap, TrendingUp, Shield } from 'lucide-react';

const experiences = [
  {
    company: 'Airawat',
    role: 'Software Developer',
    period: 'Dec 2025 – Present',
    icon: Zap,
    color: 'from-purple-400 to-violet-500',
    highlights: [
      { title: 'AI Grievance Dashboard (Madhya Pradesh):', description: ' Shipped an LLM-integrated dashboard (OpenAI APIs) — automated 8-category classification, AI-generated summaries, and natural-language querying, cutting manual review time by ~60% for state administrators handling 50,000+ complaints/month.' },
      { title: 'Agentic WhatsApp Chatbot (DJB):', description: ' Built an intent-aware chatbot using LLM-based classification over free-form Hinglish messages, webhook integration, and Redis session tracking — enabled 24/7 automated grievance intake and eliminated manual call-center triage for 10K+ citizens.' },
      { title: 'Production Deployment:', description: ' Independently owned end-to-end deployment — FastAPI + Uvicorn backend, PM2-managed React frontend on bare-metal Linux — authored deployment runbooks and managed zero-downtime releases serving live government users.' }
    ]
  },
  {
    company: 'Turing',
    role: 'Software Developer',
    period: 'May 2024 – June 2025',
    icon: Zap,
    color: 'from-purple-400 to-violet-500',
    highlights: [
      { title: 'Secure Code Execution Platform:', description: ' Architected a multi-language sandbox (C++, Python, Java, TypeScript) using Docker to safely execute untrusted code submissions — reduced per-execution latency by 30–50% and eliminated host-level security incidents.' },
      { title: 'Evaluation Pipeline:', description: ' Built Node.js services that orchestrated code-run workflows, normalized heterogeneous logs, and surfaced structured diffs — shortened benchmarking cycle time by ~40% across engineering teams.' },
      { title: 'Result Aggregation Service:', description: ' Designed an async collection layer (Node.js + Redis) that ingested sandbox outputs from distributed workers, handled out-of-order arrivals and partial failures gracefully, and pushed batched evaluation reports via webhooks — cut reporting lag from minutes to under 10s.' },
      { title: 'Remote-First Collaboration:', description: ' Worked fully remotely with US-based engineering and product teams — authored design briefs in Notion, conducted async code reviews across timezones, and independently owned features from spec through production deploy.' }
    ]
  },
  {
    company: 'InsuranceDekho',
    role: 'Software Engineer',
    period: 'May 2023 – May 2024',
    icon: TrendingUp,
    color: 'from-green-400 to-emerald-500',
    highlights: [
      { title: 'Renewal Pipeline Redesign:', description: ' Designed and built a unified Renewal Service that consolidated scattered renewal logic previously split across 4 loosely coupled microservices — Storage, Renewal, Middleware, and Lead Management - into a single RabbitMQ-driven pipeline for health and motor insurance. Adopted a single-consumer design to preserve strict event ordering and respect insurer-side rate limits, improving lead throughput by 30–40% across 10,000+ daily leads without overwhelming downstream insurer APIs.' },
      { title: 'Reliability Engineering:', description: ' Implemented event-ordering guarantees with dead-letter queues and configurable retry backoffs — maintained 99.5%+ message delivery reliability across peak renewal windows.' },
      { title: 'Operational Dashboards:', description: ' Built real-time views of agent KPIs, queue backlogs, and failure hotspots — eliminated 25% of manual reporting overhead and enabled proactive resolution before SLA breaches.' },
      { title: 'Insurer Integration Layer:', description: ' Built adapter modules with schema-normalization contracts and test suites per insurer - reduced new insurer onboarding from weeks to 2–3 days.' }
    ]
  },
  {
    company: 'ClearTax',
    role: 'Software Engineer',
    period: 'Jul 2022 – Dec 2022',
    icon: Building,
    color: 'from-blue-400 to-cyan-500',
    highlights: [
      { title: 'Async Onboarding Execution:', description: ' Redesigned a blocking onboarding flow using background job handlers to decouple heavy tasks from API requests — enabled non-blocking parallel workflows and eliminated processing bottlenecks under concurrent load.' },
      { title: 'Fault-Tolerant Onboarding:', description: ' Enforced idempotent execution with validation checkpoints and dedupe logic — eliminated duplicate records and ensured consistent state transitions across repeated attempts.' },
      { title: 'Faster Customer Activation:', description: ' Streamlined onboarding steps and stabilized workflow state propagation, reducing onboarding turnaround time by 30% and improving enterprise activation SLAs.' }
    ]
  },
  {
    company: 'Samsung Research Institute Bangalore',
    role: 'Software Engineer Intern',
    period: 'May 2021 – Jul 2021',
    icon: Shield,
    color: 'from-red-400 to-pink-500',
    highlights: [
      { title: 'Low-Light Enhancement Pipeline:', description: ' Built an end-to-end image enhancement pipeline in TensorFlow based on the See in the Dark (SID) paper — replaced the traditional ISP stack with an end-to-end UNet trained from scratch on the SID dataset to directly map raw dark sensor inputs to clean, well-exposed RGB outputs.' },
      { title: 'Raw Image Preprocessing:', description: ' Built a preprocessing pipeline for raw sensor data — applying noise removal, brightness amplification, and normalization before model ingestion, ensuring the training distribution accurately reflected real-world low-light capture conditions and improving PSNR across varying darkness levels.' }
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

  return (
    <div className="relative py-16 px-6 z-10">
      <div className="max-w-6xl mx-auto">
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
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${index === currentIndex
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
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center space-x-4 mb-6">
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

              <div className="space-y-4">
                {currentExperience.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: isAnimating ? 'none' : 'slideInFromRight 0.6s ease-out forwards'
                    }}
                  >
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-slate-300 leading-relaxed">
                      {typeof highlight === 'string' ? highlight : (
                        <>
                          <span className="font-semibold text-white">{highlight.title}</span>
                          {highlight.description}
                        </>
                      )}
                    </p>
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-amber-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'
                }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}