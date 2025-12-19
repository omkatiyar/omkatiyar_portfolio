
import React from 'react';
import { Code, Database, Server } from 'lucide-react';

const skillCategories = [
  {
    title: 'Programming Languages',
    icon: Code,
    skills: ['C++', 'JavaScript', 'TypeScript', 'Python', 'Go'],
    color: 'from-blue-400 to-cyan-500'
  },
  {
    title: 'Backend & Frameworks',
    icon: Server,
    skills: ['Node.js', 'Express', 'Django'],
    color: 'from-green-400 to-emerald-500'
  },
  {
    title: 'Databases',
    icon: Database,
    skills: ['SQL', 'MongoDB'],
    color: 'from-purple-400 to-violet-500'
  }
];

export default function SkillsSection() {
  return (
    <div className="relative py-16 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Building robust solutions with cutting-edge technologies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:transform hover:scale-105 animate-fadeInUp"
              style={{
                animationDelay: `${categoryIndex * 0.2}s`
              }}
            >
              <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-6 text-white">
                {category.title}
              </h3>
              
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill}
                    className="bg-slate-700/30 rounded-xl px-4 py-3 text-center border border-slate-600/30 hover:border-amber-400/50 hover:bg-slate-700/50 transition-all duration-300 animate-slideInFromLeft"
                    style={{
                      animationDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s`
                    }}
                  >
                    <span className="text-slate-200 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
