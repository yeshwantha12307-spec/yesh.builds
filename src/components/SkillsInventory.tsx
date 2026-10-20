import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, FileCode, Layout, Palette, ShieldCheck, 
  Server, Cpu, Database, Table, Layers, 
  GitBranch, Terminal, Camera, Globe, Sparkles
} from 'lucide-react';
import { SKILLS_DATA, SKILL_CATEGORIES, InventorySkill } from '../data/skills';
import { soundManager } from '../utils/audio';

const iconMap: Record<string, React.ElementType> = {
  Code,
  FileCode,
  Layout,
  Palette,
  ShieldCheck,
  Server,
  Cpu,
  Database,
  Table,
  Layers,
  GitBranch,
  Terminal,
  Camera,
  Globe,
  Sparkles
};

export const SkillsInventory: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedSkill, setSelectedSkill] = useState<InventorySkill>(SKILLS_DATA[0]);

  const filteredSkills = activeCategory === "ALL" 
    ? SKILLS_DATA 
    : SKILLS_DATA.filter(s => s.category === activeCategory);

  const getStatusBadge = (status: InventorySkill['status']) => {
    switch (status) {
      case 'USED IN PROJECTS':
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400'
        };
      case 'CURRENTLY LEARNING':
        return {
          bg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
          dot: 'bg-cyan-400'
        };
      case 'EXPLORING':
        return {
          bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400'
        };
    }
  };

  return (
    <section 
      id="skills" 
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* THEMATIC WORKSTATION BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity transition-all duration-700"
          style={{ backgroundImage: `url('/media/backgrounds/skills_room.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-transparent to-[#030712]/95" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold tracking-widest uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            // TECHNICAL ARSENAL
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
            Skills &amp; Technologies
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
            Core technologies and engineering workflows actively applied across production web applications, academic software, and applied AI systems.
          </p>
        </div>

        {/* CATEGORY SELECTOR TABS */}
        <div className="flex flex-wrap items-center gap-2 pb-6 mb-8 border-b border-white/10">
          {SKILL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.35)] font-semibold border border-cyan-400/50'
                    : 'bg-black/60 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* TWO-COLUMN INVENTORY INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INTERACTIVE SLOTS GRID */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredSkills.map((skill) => {
              const Icon = iconMap[skill.iconName] || Code;
              const isSelected = selectedSkill.id === skill.id;
              const badge = getStatusBadge(skill.status);

              return (
                <motion.div
                  key={skill.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedSkill(skill);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between min-h-[115px] ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/90 to-black/90 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/40'
                      : 'bg-black/60 border-white/10 hover:border-white/25 hover:bg-black/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-300'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                  </div>

                  <div className="mt-2">
                    <div className="font-display font-semibold text-sm sm:text-base text-white tracking-tight truncate">
                      {skill.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate mt-0.5">
                      {skill.category}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: SELECTED ITEM INSPECTION PANEL */}
          <div className="lg:col-span-4 bg-black/80 border border-white/15 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                ITEM INSPECTION
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold flex items-center gap-1.5 ${getStatusBadge(selectedSkill.status).bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadge(selectedSkill.status).dot}`} />
                {selectedSkill.status}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                {selectedSkill.name}
              </h3>
              <div className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                CATEGORY: {selectedSkill.category}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                PRACTICAL APPLICATION IN BUILDS:
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans bg-white/5 p-3.5 rounded-xl border border-white/5">
                {selectedSkill.practicalUse}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                VERIFIED IMPLEMENTATION
              </div>
              <div className="text-slate-400 leading-normal">
                Implemented directly in student project codebases, production deployments, and academic labs.
              </div>
            </div>

            {/* Editorial Footer Note */}
            <div className="pt-2 text-right">
              <span className="font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
                PRACTICAL CODE OVER THEORETICAL NOISE
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
