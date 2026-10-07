import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import SystemScene from '../Components/portfolio/scene/SystemScene';
import HeroSection from '../Components/portfolio/HeroSection';
import SkillSection from '../Components/portfolio/SkillSection';
import ExperienceSection from '../Components/portfolio/ExperienceSection';
import ProjectSection from '../Components/portfolio/ProjectSection';
import ContactSection from '../Components/portfolio/ContactSection';

const SECTION_ORDER = ['hero', 'skills', 'experience', 'projects', 'contact'];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'skills', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY;
      
      // The last section can be shorter than the viewport, so at the very bottom it never
      // reaches its own offsetTop — treat "scrolled to the end" as Contact.
      if (window.innerHeight + scrollPosition >= document.documentElement.scrollHeight - 4) {
        setActiveSection('contact');
        return;
      }

      // Sections can overlap (Projects pins as Experience ends), so take the LAST section whose
      // start has been passed rather than the first one whose range matches.
      let current = sections[0];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop - 100) current = section;
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-clip">
      <SystemScene />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05070d]/70 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="font-mono text-sm tracking-[0.3em] text-slate-300">
              OK<span className="text-amber-400">.</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'skills', label: 'Skills' },
                { id: 'experience', label: 'Experience' },
                { id: 'projects', label: 'Projects' },
                { id: 'contact', label: 'Contact' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm tracking-wide transition-all duration-300 hover:text-amber-400 ${
                    activeSection === item.id ? 'text-amber-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <section id="hero">
        <HeroSection
          onScrollToNext={() => scrollToSection('skills')}
          onScrollToContact={() => scrollToSection('contact')}
        />
      </section>
      
      <section id="skills">
        <SkillSection />
      </section>
      
      <section id="experience">
        <ExperienceSection />
      </section>
      
      <section id="projects">
        <ProjectSection />
      </section>
      
      <section id="contact">
        <ContactSection />
      </section>

      {/* Scroll indicator: goes to the next section, hidden on the last one */}
      {activeSection !== 'contact' && (
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          aria-label="Next section"
          onClick={() => scrollToSection(SECTION_ORDER[Math.min(SECTION_ORDER.length - 1, SECTION_ORDER.indexOf(activeSection) + 1)])}
          className="animate-bounce bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ChevronDown className="w-6 h-6 text-slate-900" />
        </button>
      </div>
      )}
    </div>
  );
}
