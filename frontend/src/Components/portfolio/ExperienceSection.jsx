import React, { useState, useEffect } from 'react';
import { Building, Calendar, ChevronRight, Zap, TrendingUp, Shield } from 'lucide-react';

const experiences = [
  {
    company: 'Turing',
    role: 'Software Developer',
    period: 'May 2024 – June 2025',
    icon: Zap,
    color: 'from-purple-400 to-violet-500',

    highlights: [
      'Worked on building a robust evaluation pipeline to train AI models using reinforcement learning',
      'Created and containerized multi-language code execution environments using Docker for languages like C++, Python, and JavaScript, and developed microservice using Node.js.',
      'Evaluated two AI-generated responses, analyzing their strengths, weaknesses, and correctness in terms of logic, readability, and edge-case handling.',
      'Assessed and rated four AI-generated responses, detailing pros and cons for each and writing rubrics and reference solutions to guide the model toward generating higher-quality, correct code.',
      'Executed and tested AI-generated code against custom-built unit tests, identified logic or syntax failures, and produced corrected implementations ensuring all tests passed successfully.'
    ]
  },
  {
    company: 'InsuranceDekho',
    role: 'Software Engineer',
    period: 'May 2023 – May 2024',
    icon: TrendingUp,
    color: 'from-green-400 to-emerald-500',
    highlights: [
      'Renewal Lead Flow Sales Funnel (Health + Motor)',
      'Designed and implemented the Renewal Service microservice for processing renewal leads',
      'Replaced old architecture with ITMS → RabbitMQ → Renewal Service → LMW → LMS/POS',
      'Achieved ~40% faster lead readiness time for agents through asynchronous message handling',
      'Built managerial dashboard using React.js, Node.js, and SQL to monitor agent performance and lead conversion rates'
    ]
  },
  {
    company: 'ClearTax',
    role: 'Software Engineer',
    period: 'Jul 2022 – Feb 2023',
    icon: Building,
    color: 'from-blue-400 to-cyan-500',
    highlights: [
      'Developed REST APIs in Node.js for survey and invoice processing',
      'Reduced API response time by 20% through optimization',
      'Built Bulk User Creation API for invoice discounting, cutting onboarding time by 30%',
      'Optimized SQL queries and backend logic, reducing banking integration response times by 90%',
      'Ensured fault tolerance by simulating faulty inputs and concurrency edge cases'
    ]
  },
  {
    company: 'Samsung Research Institute Bangalore',
    role: 'Software Engineer Intern',
    period: 'May 2021 – Jul 2021',
    icon: Shield,
    color: 'from-red-400 to-pink-500',
    highlights: [
      'Developed deep learning pipeline for extreme low-light image enhancement using TensorFlow',
      'Trained UNet-based CNN on the SID dataset, improving image brightness and noise reduction',
      'Strengthened skills in Python scripting, data preprocessing, and GPU-based computation',
      'Worked on ML-heavy project focusing on computer vision and image processing'
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
