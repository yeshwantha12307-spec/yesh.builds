import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { FEATURED_PROJECTS, ProjectMission } from '../data/projects';
import { soundManager } from '../utils/audio';

export const MissionSystem: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<ProjectMission>(FEATURED_PROJECTS[0]);

  return (
    <section 
      id="missions" 
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* THEMATIC WORK BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity transition-all duration-700"
          style={{ backgroundImage: `url('/media/backgrounds/projects_laptop.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-transparent to-[#030712]/95" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-10 text-left flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              // FEATURED WORK
            </div>
            <h2 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl text-white uppercase tracking-wider leading-none">
              Featured Projects
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Production deployments and software prototypes built with modern web technologies, structured problem workflows, and deliberate user experiences.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-black/80 border border-emerald-500/30 text-emerald-300 font-display font-bold text-xs uppercase tracking-wider">
            {FEATURED_PROJECTS.length} PRIMARY BUILDS
          </div>
        </div>

        {/* PROJECT SELECTOR TABS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-8">
          {FEATURED_PROJECTS.map((mission) => {
            const isSelected = selectedMission.missionId === mission.missionId;
            return (
              <button
                key={mission.missionId}
                onClick={() => {
                  soundManager.playProjectTab();
                  setSelectedMission(mission);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`p-4 rounded-xl text-left transition-all border cursor-pointer backdrop-blur-md flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/90 via-black/90 to-teal-950/80 border-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.25)] ring-1 ring-emerald-400/40'
                    : 'bg-black/60 border-white/10 hover:border-white/25 text-slate-300 hover:bg-black/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-emerald-500 text-black font-bold' : 'bg-white/5 text-slate-400'}`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                      {mission.missionNumber} // {mission.status}
                    </div>
                    <div className="font-heading font-bold text-xl sm:text-2xl text-white uppercase tracking-wider">
                      {mission.name}
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* SELECTED PROJECT DOSSIER / TERMINAL BRIEFING */}
        <motion.div 
          key={selectedMission.missionId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-black/85 border border-white/15 rounded-2xl p-6 sm:p-10 backdrop-blur-md shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-display font-bold uppercase tracking-wider text-emerald-300">
                {selectedMission.missionNumber}
              </span>
              <span className="px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-display font-bold uppercase tracking-wider text-cyan-300">
                {selectedMission.type}
              </span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-wider leading-none">
                {selectedMission.name}
              </h3>
              <div className="text-sm sm:text-base font-display font-bold uppercase tracking-wider text-emerald-400 mt-2">
                {selectedMission.tagline}
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans bg-white/5 p-4 sm:p-5 rounded-xl border border-white/5">
              {selectedMission.description}
            </p>

            {/* Key Features */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                CORE SYSTEM CAPABILITIES:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-slate-200">
                {selectedMission.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                TECHNOLOGY STACK:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMission.techStack.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* PRIMARY CTA: VIEW PROJECT */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                id="btn-view-live-project"
                href={selectedMission.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View Live Project: ${selectedMission.name} at ${selectedMission.liveUrl}`}
                onClick={() => {
                  try {
                    soundManager.playProjectLaunch();
                  } catch {
                    // Safe fallback
                  }
                }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-base sm:text-lg tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.5)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] touch-manipulation z-20 min-h-[48px] pointer-events-auto"
              >
                <span>VIEW LIVE PROJECT</span>
                <ExternalLink className="w-4 h-4 text-black stroke-[2.5]" />
              </a>

              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Live Deployment
              </span>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <a
              id="btn-preview-project-card"
              href={selectedMission.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${selectedMission.name} live website (${selectedMission.liveUrl})`}
              onClick={() => {
                try {
                  soundManager.playProjectLaunch();
                } catch {
                  // Safe fallback
                }
              }}
              className="relative w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl group block cursor-pointer pointer-events-auto"
              title={`View Project: ${selectedMission.name} (${selectedMission.liveUrl})`}
            >
              <img 
                src={selectedMission.previewImage} 
                alt={selectedMission.name}
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 group-hover:bg-black/30 transition-colors" />
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs">
                <span className="font-display font-bold text-white uppercase tracking-wider">{selectedMission.name}</span>
                <span className="text-emerald-400 bg-black/80 px-2.5 py-1 rounded-md border border-emerald-500/40 flex items-center gap-1.5 font-display font-bold uppercase tracking-wider shadow-md">
                  <span>OPEN SITE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
