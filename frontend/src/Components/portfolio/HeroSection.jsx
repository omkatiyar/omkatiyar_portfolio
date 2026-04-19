import React from 'react';
import { ChevronDown, Github, Linkedin, Mail, Globe } from 'lucide-react';

export default function HeroSection({ onScrollToNext }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl mx-auto text-center z-10">
        <div className="mb-8 animate-fade-in-up">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300">
            <span className="text-6xl font-bold text-slate-900">O</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight animate-fadeIn">
            Backend / Full-Stack Engineer
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-4 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            3+ years shipping production backend systems.<br />
            Specializing in distributed architectures, AI-integrated services & performance at scale.
          </p>

          {/* Remote Availability Badge */}
          <div className="flex justify-center mb-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Open to Remote — Any Timezone</span>
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* About Me Section */}
          <div className="max-w-3xl mx-auto mb-12 p-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Hi, I'm <span className="text-amber-400 font-semibold">Om Katiyar</span> — a backend-heavy full-stack engineer with 3+ years of experience building production systems that handle real scale. I've designed RabbitMQ-driven pipelines processing 10,000+ daily leads, architected Docker-based sandboxes for secure code execution, and shipped LLM-integrated dashboards serving 50,000+ monthly users. Previously collaborated <span className="text-amber-400 font-semibold">fully remotely with US-based teams at Turing</span> — comfortable working PST-overlap hours, async-first communication, and owning features end-to-end across timezones. Currently exploring the frontier of <span className="text-amber-400 font-semibold">AI-powered backend systems</span>.
            </p>
          </div>

          <div className="flex justify-center space-x-6 mb-12">
            {[
              { Icon: Github, href: 'https://github.com/omkatiyar', label: 'GitHub' },
              { Icon: Linkedin, href: 'https://www.linkedin.com/in/om-katiyar-277a301ba/', label: 'LinkedIn' },
              { Icon: Mail, href: 'mailto:omkatiyar123hash@gmail.com', label: 'Email' }
            ].map(({ Icon, href, label }, index) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700 hover:border-amber-400 hover:bg-amber-400/10 transition-all duration-300 group hover:scale-110"
                aria-label={label}
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <Icon className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors duration-300" />
              </a>
            ))}
          </div>

          <button
            onClick={onScrollToNext}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fadeInUp"
            style={{ animationDelay: '1s' }}
          >
            View My Work
            <ChevronDown className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}