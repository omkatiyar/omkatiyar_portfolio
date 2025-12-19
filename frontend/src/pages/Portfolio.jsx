import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import AnimatedBackground from '../Components/portfolio/AnimatedBackground';
import HeroSection from '../Components/portfolio/HeroSection';
import SkillSection from '../Components/portfolio/SkillSection';
import ExperienceSection from '../Components/portfolio/ExperienceSection';
import ProjectSection from '../Components/portfolio/ProjectSection';
import ContactSection from '../Components/portfolio/ContactSection';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'skills', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY;
      
      for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + offsetHeight - 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Portfolio
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
                  className={`transition-all duration-300 hover:text-amber-400 ${
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
        <HeroSection onScrollToNext={() => scrollToSection('skills')} />
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

      {/* Scroll indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => scrollToSection('skills')}
          className="animate-bounce bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ChevronDown className="w-6 h-6 text-slate-900" />
        </button>
      </div>
    </div>
  );
}
