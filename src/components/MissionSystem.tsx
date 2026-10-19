import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ExternalLink, ShieldCheck, Sparkles, ChevronRight, Layers, Cpu } from 'lucide-react';
import { FEATURED_PROJECTS, ProjectMission } from '../data/projects';
import { soundManager } from '../utils/audio';

export const MissionSystem: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<ProjectMission>(FEATURED_PROJECTS[0]);

  return (
    <section 
      id="missions" 
      className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* MARINA BAYFRONT LUXURY POOLSIDE & LAPTOP BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('/media/backgrounds/projects_laptop.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-black/75 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/90" />
        <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-10 text-left flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              // MAIN MISSIONS
            </div>
            <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-wide text-shadow-gta leading-none">
              REAL PROJECTS. <span className="text-emerald-400 text-shadow-lime">REAL IMPACT.</span>
            </h2>
            <div className="font-script text-2xl sm:text-3xl text-cyan-400 font-bold -mt-1">
              Mission Selection &amp; Briefing
            </div>
          </div>

          <div className="px-4 py-2 rounded-full bg-black/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
            2 PRIMARY DEPLOYMENTS
          </div>
        </div>

        {/* MISSION SELECTOR TABS (EXACTLY TWO FEATURED MISSIONS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {FEATURED_PROJECTS.map((mission) => {
            const isSelected = selectedMission.missionId === mission.missionId;
            return (
              <button
                key={mission.missionId}
                onClick={() => {
                  soundManager.playMissionOpen();
                  setSelectedMission(mission);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`p-4 rounded-xl text-left transition-all border cursor-pointer backdrop-blur-md flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/90 via-black/90 to-teal-950/80 border-emerald-400 shadow-[0_0_25px_rgba(34,197,94,0.3)] ring-1 ring-emerald-400/50'
                    : 'bg-black/70 border-white/15 hover:border-white/30 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-emerald-500 text-black font-bold' : 'bg-white/5 text-slate-400'}`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest">
                      {mission.missionNumber} // {mission.status}
                    </div>
                    <div className="font-gta text-2xl text-white tracking-wide">
                      {mission.name}
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* SELECTED MISSION DOSSIER / TERMINAL BRIEFING */}
        <motion.div 
          key={selectedMission.missionId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-black/85 border border-white/20 rounded-2xl p-6 sm:p-10 backdrop-blur-md shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300">
                {selectedMission.missionNumber}
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                {selectedMission.type}
              </span>
            </div>

            <div>
              <h3 className="font-gta text-4xl sm:text-5xl text-white tracking-wide leading-none">
                {selectedMission.name}
              </h3>
              <div className="text-sm font-sans font-medium text-emerald-400 mt-2">
                {selectedMission.tagline}
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans bg-white/5 p-4 rounded-xl border border-white/5">
              {selectedMission.description}
            </p>

            {/* Key Features */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                CORE SYSTEM CAPABILITIES:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-200">
                {selectedMission.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                TECHNOLOGY ARSENAL:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMission.techStack.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* PRIMARY CTA: OPEN LIVE PROJECT */}
            <div className="pt-4 flex items-center gap-4">
              <a
                href={selectedMission.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-gta text-2xl tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.6)] cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>OPEN LIVE PROJECT</span>
                <ExternalLink className="w-5 h-5 text-black" />
              </a>

              <span className="text-xs font-mono text-slate-400">
                Verified Production Link
              </span>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full rounded-xl overflow-hidden border border-white/20 shadow-2xl group">
              <img 
                src={selectedMission.previewImage} 
                alt={selectedMission.name}
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-mono">
                <span className="text-white font-bold">{selectedMission.name}</span>
                <span className="text-emerald-400 bg-black/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  {selectedMission.status}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
