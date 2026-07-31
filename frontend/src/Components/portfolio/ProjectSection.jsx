import React, { useState, useEffect } from 'react';
import { Code, TrendingUp, Gamepad2, BarChart3 } from 'lucide-react';

const projects = [
  {
    title: 'Snake Ladder Game',
    description: 'Classic Snake and Ladder board game implementation with modern C++ features and object-oriented design.',
    icon: Gamepad2,
    color: 'from-red-400 to-pink-500',
    technologies: ['C++', 'OOPS', 'Game Development'],
    features: [
      'Complete game logic implementation',
      'Object-oriented design patterns',
      'Interactive gameplay mechanics',
      'Modern C++ best practices'
    ]
  },
  {
    title: 'Cashflow Modelling - Variable Annuity',
    description: 'Mathematical modeling system for variable annuity cashflow analysis with comprehensive parameter calculations.',
    period: 'March 2023 - Jun 2023 | Aagam Capital',
    icon: BarChart3,
    color: 'from-green-400 to-emerald-500',
    technologies: ['C++', 'OOPS', 'Excel', 'Mathematical Modeling'],
    features: [
      'Implemented variable annuity cashflow model',
      'Calculated approximately 40 parameters with cyclic relationships',
      'Excel integration for result storage and analysis',
      'Validation against original results with matching characteristics'
    ]
  },
  {
    title: 'Algo Trading using Greek Analysis',
    description: 'Sophisticated trading strategy using Black-Scholes model and Greek analysis for options trading.',
    period: 'Aug 2024 - Sep 2024 | Freelance',
    icon: TrendingUp,
    color: 'from-blue-400 to-cyan-500',
    technologies: ['Rust', 'Python', 'NSE API', 'Black-Scholes Model'],
    features: [
      'Option chain data extraction using NSE API',
      'Black-Scholes model implementation for Greeks calculation',
      'Mathematical functions for buy/sell signal generation',
      'Backtesting: 62% win rate, 36% max drawdown, 70% yearly ROI'
    ]
  },
  {
    title: 'EMA Trading Strategy',
    description: 'Simple yet effective trading strategy using Exponential Moving Averages (9, 20, and 50 EMA) for market analysis.',
    icon: Code,
    color: 'from-purple-400 to-violet-500',
    technologies: ['Python', 'Technical Analysis', 'EMA', 'Trading Algorithms'],
    features: [
      'Multi-timeframe EMA analysis',
      'Signal generation based on EMA crossovers',
      'Automated trading strategy implementation',
      'Performance optimization and backtesting'
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
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  index === currentIndex
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
            <div
              className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 h-full shadow-2xl"
              style={{
                transform: 'perspective(1000px) rotateX(2deg)',
                transformStyle: 'preserve-3d',
              }}
            >
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
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <p className="text-slate-300 text-sm">
                  📧 For project details and source code access, please contact via the form below.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-12 space-x-2">
          {projects.map((_, index) => (
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
