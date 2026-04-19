import React, { useState, useEffect } from 'react';
import { Code, TrendingUp, Gamepad2, BarChart3 } from 'lucide-react';

const projects = [
  {
    title: 'Job Queue Visualizer',
    description: 'Real-time visualization of distributed job processing with retry logic, dead-letter routing, and backpressure monitoring.',
    icon: BarChart3,
    color: 'from-green-400 to-emerald-500',
    technologies: ['Node.js', 'Redis', 'BullMQ', 'WebSockets', 'React'],
    features: [
      'Push jobs via REST API, watch them process in real-time',
      'Visual dead-letter queue with retry/discard controls',
      'Configurable concurrency, backoff, and rate limiting',
      'Live dashboard with queue depth, throughput, and failure rate metrics'
    ]
  },
  {
    title: 'Webhook Relay Service',
    description: 'Self-hosted webhook inspection and replay tool with rate limiting, filtering, and delivery guarantees.',
    icon: Code,
    color: 'from-purple-400 to-violet-500',
    technologies: ['FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    features: [
      'Receive, store, and inspect incoming webhooks in real-time',
      'Replay failed deliveries with exponential backoff',
      'Per-endpoint rate limiting and authentication',
      'Filterable event log with full request/response capture'
    ]
  },
  {
    title: 'Nifty Options Greeks Engine',
    description: 'Algorithmic trading engine using Black-Scholes model and Greek analysis for options signal generation on NSE.',
    period: 'Aug 2024 - Sep 2024',
    icon: TrendingUp,
    color: 'from-blue-400 to-cyan-500',
    technologies: ['Rust', 'Python', 'NSE API', 'Black-Scholes Model'],
    features: [
      'Real-time option chain extraction via NSE API',
      'Black-Scholes Greeks calculation (Delta, Gamma, Theta, Vega)',
      'Signal generation engine with buy/sell thresholds',
      'Backtested: 62% win rate, 70% yearly ROI, 36% max drawdown'
    ]
  },
  {
    title: 'C++ System Design Patterns',
    description: 'Production-grade implementations of design patterns applied to real-world systems — Uber, Amazon, Zomato, and more.',
    icon: Gamepad2,
    color: 'from-red-400 to-pink-500',
    technologies: ['C++', 'OOP', 'Strategy', 'Factory', 'Observer'],
    features: [
      'Strategy Pattern: Uber dynamic pricing, Amazon tax calculation',
      'Factory Pattern: Loan processing, cloud storage provisioning',
      'Observer Pattern: YouTube channel notifications, alert systems',
      'Multiple other design patterns practiced along with these (See GitHub for more)'
    ]
  }
];

export default function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
        setIsAnimating(false);
      }, 300);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const currentProject = projects[currentIndex];

  return (
    <div className="relative py-16 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Innovative solutions spanning game development, financial modeling, and trading systems
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Project Navigation */}
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={project.title}
                onClick={() => setCurrentIndex(index)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${index === currentIndex
                    ? 'bg-slate-700/50 border border-amber-400/50 shadow-lg'
                    : 'bg-slate-800/30 hover:bg-slate-700/30 border border-slate-700/30 hover:border-slate-600'
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.color} flex items-center justify-center flex-shrink-0`}>
                    <project.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{project.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-1">{project.description}</p>
                    {project.period && (
                      <p className="text-xs text-slate-500 mt-1">{project.period}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Details */}
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 h-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${currentProject.color} flex items-center justify-center shadow-lg`}>
                  <currentProject.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">{currentProject.title}</h3>
                  {currentProject.period && (
                    <p className="text-amber-400 text-sm font-medium mt-1">{currentProject.period}</p>
                  )}
                </div>
              </div>

              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                {currentProject.description}
              </p>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {currentProject.technologies.map((tech, index) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm border border-slate-600/50"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: isAnimating ? 'none' : 'fadeInScale 0.6s ease-out forwards'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">Key Features</h4>
                <div className="space-y-3">
                  {currentProject.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: isAnimating ? 'none' : 'slideInFromLeft 0.6s ease-out forwards'
                      }}
                    >
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-slate-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Info */}

            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-12 space-x-2">
          {projects.map((_, index) => (
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
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
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
