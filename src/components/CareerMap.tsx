import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Code, 
  Briefcase, 
  Cpu, 
  Flag, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Lock, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { MISSION_LEVELS, MissionLevel } from '../data/experience';
import { soundManager } from '../utils/audio';

export const CareerMap: React.FC = () => {
  // Default to Level 04 (BUILD MODE) as the currently active mission
  const [selectedLevelId, setSelectedLevelId] = useState<string>("04");
  const hasEnteredRef = useRef<boolean>(false);

  // Play gentle cinematic milestone cue when Career section enters viewport (once per session)
  useEffect(() => {
    const el = document.getElementById('journey');
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasEnteredRef.current) {
          hasEnteredRef.current = true;
          soundManager.playMilestoneEnter();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectedLevel = MISSION_LEVELS.find(l => l.levelNumber === selectedLevelId) || MISSION_LEVELS[3];

  const handleSelectLevel = (levelNumber: string) => {
    soundManager.playMilestoneSelect();
    setSelectedLevelId(levelNumber);
  };

  const handlePrevLevel = () => {
    const currentIndex = MISSION_LEVELS.findIndex(l => l.levelNumber === selectedLevelId);
    if (currentIndex > 0) {
      handleSelectLevel(MISSION_LEVELS[currentIndex - 1].levelNumber);
    }
  };

  const handleNextLevel = () => {
    const currentIndex = MISSION_LEVELS.findIndex(l => l.levelNumber === selectedLevelId);
    if (currentIndex < MISSION_LEVELS.length - 1) {
      handleSelectLevel(MISSION_LEVELS[currentIndex + 1].levelNumber);
    }
  };

  const scrollToSection = (sectionId: string) => {
    soundManager.playClick();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Code':
        return <Code className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Flag':
        return <Flag className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <section 
      id="journey" 
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* CAREER TIMELINE THEMATIC BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity transition-all duration-700"
          style={{ backgroundImage: `url('/media/backgrounds/experience_skyline.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-transparent to-[#030712]/95" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* =========================================================================
            CLEAN EDITORIAL HEADER
           ========================================================================= */}
        <div className="mb-8 text-left">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold tracking-widest uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse" />
            <span>// CAREER &amp; MILESTONE PROGRESSION</span>
          </div>
          <h2 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl text-white uppercase tracking-wider leading-none">
            Developer Journey
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
            Key milestones spanning computer science foundations, virtual internship projects, and active software deployments.
          </p>
        </div>

        {/* =========================================================================
            MILESTONE SELECTOR NAVIGATION TABS
           ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-white/10">
          {MISSION_LEVELS.map((lvl) => {
            const isSelected = lvl.levelNumber === selectedLevelId;
            const isCompleted = lvl.status === 'COMPLETED';
            const isActive = lvl.status === 'IN_PROGRESS';

            return (
              <button
                key={lvl.levelNumber}
                onClick={() => handleSelectLevel(lvl.levelNumber)}
                onMouseEnter={() => soundManager.playHover()}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all duration-200 cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-[1.02]'
                    : isActive
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/50 hover:bg-amber-900/40'
                    : isCompleted
                    ? 'bg-black/60 text-slate-300 border-white/15 hover:border-amber-400/40 hover:text-white'
                    : 'bg-black/40 text-slate-500 border-white/10 hover:text-slate-300'
                }`}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black/40 text-[10px] font-bold">
                  {lvl.levelNumber}
                </span>
                <span className="font-display font-bold text-sm tracking-wider uppercase">
                  {lvl.badge}
                </span>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                )}
                {lvl.status === 'UPCOMING' && (
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            MAIN CINEMATIC PROGRESSION STAGE
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* -----------------------------------------------------------------------
              LEFT / TOP: ABSTRACT CINEMATIC PROGRESSION PATH (SVG) — BORDERLESS OPEN TIMELINE
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 relative p-2 sm:p-4 min-h-[460px] sm:min-h-[500px] flex flex-col justify-between overflow-visible">
            
            {/* Top Trajectory Status */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-[11px] font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse" />
                <span className="font-semibold tracking-wider text-white">ATMOSPHERIC PROGRESSION TRAJECTORY</span>
              </div>
              <div className="text-amber-400 font-semibold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25 text-[10px]">
                5 MILESTONES MAPPED
              </div>
            </div>

            {/* Faint Architectural Depth Grid */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
              preserveAspectRatio="none"
              viewBox="0 0 1000 700"
            >
              <line x1="200" y1="0" x2="200" y2="700" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="500" y1="0" x2="500" y2="700" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="780" y1="0" x2="780" y2="700" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="0" y1="220" x2="1000" y2="220" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="0" y1="360" x2="1000" y2="360" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="0" y1="500" x2="1000" y2="500" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 8" />
            </svg>

            {/* THE THIN, ELEGANT CURVING PROGRESSION ROUTE */}
            <div className="relative w-full h-[380px] sm:h-[420px]">
              <svg 
                className="w-full h-full overflow-visible" 
                viewBox="0 0 1000 700"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="routeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* 1. Underlying Base Trajectory Line (Faint, elegant 1.5px guide) */}
                <path
                  d="M 200 105 C 440 80, 680 140, 780 224 C 840 280, 500 320, 240 364 C 60 400, 460 460, 760 504 C 850 540, 680 600, 500 630"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />

                {/* 2. Illuminated Progression Route Line (Nodes 1 through 4) */}
                <path
                  d="M 200 105 C 440 80, 680 140, 780 224 C 840 280, 500 320, 240 364 C 60 400, 460 460, 760 504"
                  fill="none"
                  stroke="url(#routeGoldGrad)"
                  strokeWidth="2.5"
                  className="filter drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]"
                />

                {/* 3. Future Upcoming Path Segment (Node 4 to 5) */}
                <path
                  d="M 760 504 C 850 540, 680 600, 500 630"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* MINIMAL CHECKPOINT MARKERS (Positioned along the route) */}
              {MISSION_LEVELS.map((lvl) => {
                const isSelected = lvl.levelNumber === selectedLevelId;
                const isCompleted = lvl.status === 'COMPLETED';
                const isActive = lvl.status === 'IN_PROGRESS';
                const isUpcoming = lvl.status === 'UPCOMING';

                return (
                  <div
                    key={lvl.levelNumber}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{ left: `${lvl.coords.x}%`, top: `${lvl.coords.y}%` }}
                  >
                    <button
                      onClick={() => handleSelectLevel(lvl.levelNumber)}
                      onMouseEnter={() => soundManager.playHover()}
                      className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
                      title={`${lvl.levelTag} — ${lvl.badge}`}
                      aria-label={`${lvl.levelTag}: ${lvl.title}`}
                    >
                      {/* Active Node Subtle Warm-Gold Breathing Halo */}
                      {isActive && (
                        <span className="absolute -inset-2 rounded-full border border-amber-400/80 shadow-[0_0_18px_rgba(212,175,55,0.5)] animate-pulse pointer-events-none" />
                      )}

                      {/* Selected Node Ring */}
                      {isSelected && !isActive && (
                        <span className="absolute -inset-1.5 rounded-full border border-amber-300/80 shadow-[0_0_12px_rgba(212,175,55,0.4)] pointer-events-none" />
                      )}

                      {/* Compact Minimal Checkpoint Marker Circle */}
                      <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg ${
                        isActive
                          ? 'bg-amber-400 text-black border-2 border-white shadow-[0_0_20px_rgba(212,175,55,0.6)] scale-105'
                          : isSelected
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black border border-white'
                          : isCompleted
                          ? 'bg-[#0e1017] text-amber-400 border border-amber-400/50 hover:border-amber-400'
                          : 'bg-[#090a0f] text-slate-500 border border-white/20 hover:border-white/40'
                      }`}>
                        {renderIcon(lvl.iconName, "w-5 h-5 sm:w-5.5 sm:h-5.5")}

                        {/* Completed Checkmark Indicator */}
                        {isCompleted && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border border-black flex items-center justify-center text-black">
                            <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        {/* Active Pulse Star */}
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border border-black flex items-center justify-center text-black text-[8px] font-bold">
                            ★
                          </div>
                        )}

                        {/* Upcoming Lock Badge */}
                        {isUpcoming && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      {/* Compact Title Label Below Marker */}
                      <div className="mt-1.5 flex flex-col items-center pointer-events-none">
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold tracking-wider whitespace-nowrap ${
                          isActive
                            ? 'bg-amber-400 text-black'
                            : isSelected
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : 'bg-black/80 text-slate-400 border border-white/10'
                        }`}>
                          {lvl.levelTag}
                        </span>
                        <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-slate-200 tracking-wide mt-0.5 max-w-[85px] text-center truncate">
                          {lvl.badge}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Trajectory Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>COMPLETED</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-300 font-semibold">CURRENT ACTIVE</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span>FUTURE HORIZON</span>
                </span>
              </div>
              <div className="text-slate-400 text-[10px]">
                Click any waypoint to inspect briefing dossier
              </div>
            </div>

          </div>

          {/* -----------------------------------------------------------------------
              RIGHT / BOTTOM: REFINED MILESTONE BRIEFING DOSSIER
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLevel.levelNumber}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-[#08090f]/90 border border-white/15 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden"
              >
                {/* Subtle Amber Glow Accent */}
                <div className="absolute top-0 right-0 w-52 h-52 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

                <div>
                  {/* Top Bar: Level Tag & Status Pill */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 font-mono text-xs font-bold text-white">
                        {selectedLevel.levelTag}
                      </span>
                      <span className="font-heading font-bold text-xl sm:text-2xl tracking-wider text-amber-400 uppercase">
                        {selectedLevel.badge}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-display font-bold text-[10px] uppercase tracking-wider border ${
                      selectedLevel.status === 'IN_PROGRESS'
                        ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                        : selectedLevel.status === 'COMPLETED'
                        ? 'bg-white/5 text-slate-300 border-white/20'
                        : 'bg-white/5 text-slate-500 border-white/10'
                    }`}>
                      {selectedLevel.statusLabel}
                    </span>
                  </div>

                  {/* Title & Organization Header */}
                  <div className="mt-4">
                    <h3 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wider leading-tight">
                      {selectedLevel.title}
                    </h3>
                    <div className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-amber-400 mt-1">
                      {selectedLevel.subtitle}
                    </div>
                  </div>

                  {/* Metadata Row: Period & Location */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{selectedLevel.period}</span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedLevel.location}</span>
                    </div>
                  </div>

                  {/* Narrative Description */}
                  <p className="mt-4 text-slate-300 text-sm leading-relaxed font-sans">
                    {selectedLevel.description}
                  </p>

                  {/* Tech Stack Pills (if applicable) */}
                  {selectedLevel.techStack && (
                    <div className="mt-4">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                        OPERATIONAL TECH ARSENAL:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedLevel.techStack.map((tech, idx) => (
                          <span 
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verified Details Checklist */}
                  <div className="mt-5 space-y-2 pt-4 border-t border-white/10">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      VERIFIED OBJECTIVES &amp; EVIDENCE:
                    </div>
                    <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                      {selectedLevel.verifiedDetails.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Navigation & Deep Link Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevLevel}
                      disabled={selectedLevel.levelNumber === "01"}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors cursor-pointer"
                      title="Previous Milestone"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextLevel}
                      disabled={selectedLevel.levelNumber === "05"}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors cursor-pointer"
                      title="Next Milestone"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contextual Jump Button */}
                  {selectedLevel.associatedSectionId && (
                    <button
                      onClick={() => scrollToSection(selectedLevel.associatedSectionId!)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(212,175,55,0.35)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>
                        {selectedLevel.levelNumber === "04"
                          ? "INSPECT FEATURED PROJECTS"
                          : selectedLevel.levelNumber === "02"
                          ? "VIEW SKILLS INVENTORY"
                          : selectedLevel.levelNumber === "03"
                          ? "VIEW VERIFIED CERTIFICATES"
                          : selectedLevel.levelNumber === "01"
                          ? "VIEW ACADEMIC RECORD"
                          : "GET IN TOUCH"}
                      </span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
};
