import React from 'react';
import { Code, Database, Server, Monitor, Cloud, Brain } from 'lucide-react';
import useTilt from './useTilt';
import { SkillsAmbient } from './SectionAmbient';

function SkillCard({ category, categoryIndex }) {
  const tilt = useTilt({ max: 6, scale: 1.015 });

  return (
    <div
      ref={tilt.ref}
      {...tilt.tiltProps}
      className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 animate-fadeInUp shadow-xl hover:shadow-2xl hover:shadow-amber-400/10"
      style={{ animationDelay: `${categoryIndex * 0.08}s`, ...tilt.style }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon + Title */}
        <div className="flex items-center gap-4 sm:w-56 flex-shrink-0" data-tilt-depth="25">
          <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}>
            <category.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {category.title}
          </h3>
        </div>

        {/* Skills as horizontal chips */}
        <div className="flex flex-wrap gap-2" data-tilt-depth="12">
          {category.skills.map((skill, skillIndex) => (
            <span
              key={skill}
              className="px-3 py-1.5 bg-slate-700/30 rounded-full text-center border border-slate-600/30 hover:border-amber-400/50 hover:bg-slate-700/50 transition-all duration-300 animate-slideInFromLeft text-slate-200 font-medium text-sm whitespace-nowrap"
              style={{
                animationDelay: `${(categoryIndex * 0.08) + (skillIndex * 0.03)}s`
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const skillCategories = [
  {
    title: 'Backend',
    icon: Server,
    skills: ['Node.js', 'Express', 'FastAPI', 'Django', 'Gin', 'RabbitMQ', 'REST APIs', 'Microservices'],
    color: 'from-green-400 to-emerald-500'
  },
  {
    title: 'Languages',
    icon: Code,
    skills: ['TypeScript', 'JavaScript', 'Python', 'C++', 'Java', 'Go'],
    color: 'from-purple-400 to-violet-500'
  },
  {
    title: 'Databases',
    icon: Database,
    skills: ['PostgreSQL', 'MongoDB', 'Redis'],
    color: 'from-pink-400 to-rose-500'
  },
  {
    title: 'AI & Data',
    icon: Brain,
    skills: ['LLM APIs (OpenAI)', 'ML Model Integration', 'RAG', 'Usage Metering and Token Accounting'],
    color: 'from-amber-400 to-orange-500'
  },
  {
    title: 'Infra/DevOps',
    icon: Cloud,
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'AWS S3', 'Nginx', 'Linux', 'Git', 'Grafana', 'NewRelic'],
    color: 'from-red-400 to-pink-500'
  },
  {
    title: 'Frontend',
    icon: Monitor,
    skills: ['React', 'Next.js', 'Canvas2Code'],
    color: 'from-blue-400 to-cyan-500'
  }
];

export default function SkillsSection() {
  return (
    <div className="relative pb-16 pt-4 px-6 z-10">
      <SkillsAmbient />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Building robust solutions with cutting-edge technologies
          </p>
        </div>

        <div className="space-y-4">
          {skillCategories.map((category, categoryIndex) => (
            <SkillCard
              key={category.title}
              category={category}
              categoryIndex={categoryIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
