import React from 'react';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import useTilt from './useTilt';
import { HeroAmbient } from './SectionAmbient';

export default function HeroSection({ onScrollToNext }) {
  const aboutTilt = useTilt({ max: 8, scale: 1.01 });

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-16 pb-0">
      <HeroAmbient />
      <div className="max-w-4xl mx-auto text-center z-10">
        <div className="mb-8 animate-fade-in-up">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300">
            <span className="text-6xl font-bold text-slate-900">O</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight animate-fadeIn">
            Software Developer
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed animate-fadeIn" style={{animationDelay: '0.2s'}}>
            Crafting elegant solutions with modern technologies.<br/>
            Specializing in AI, Backend Systems & Performance Optimization.
          </p>

          {/* About Me Section */}
          <div
            ref={aboutTilt.ref}
            {...aboutTilt.tiltProps}
            className="max-w-3xl mx-auto mb-12 p-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 animate-fadeInUp shadow-2xl"
            style={{ animationDelay: '0.4s', ...aboutTilt.style }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
              data-tilt-depth="35"
            >
              About Me
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed" data-tilt-depth="20">
              Hi, this is <span className="text-amber-400 font-semibold">Om Katiyar</span>, a passionate Full Stack Developer who specializes in creating elegant, efficient, and scalable applications. I have extensive experience in C++, JavaScript, TypeScript, Python, Go, SQL, MongoDB, Express.js, React, FastAPI and Node.js. I am also currently unveiling the mysteries of <span className="text-amber-400 font-semibold">Gen AI Development</span>. My journey has taken me through diverse projects, from MVP startups to enterprise solutions, and now building AI-powered systems at scale.
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
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                <Icon className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors duration-300" />
              </a>
            ))}
          </div>
          
          <button
            onClick={onScrollToNext}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fadeInUp"
            style={{animationDelay: '1s'}}
          >
            View My Work
            <ChevronDown className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
