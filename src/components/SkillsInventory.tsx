import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, FileCode, Layout, Palette, ShieldCheck, 
  Server, Cpu, Database, Table, Layers, 
  GitBranch, Box, Terminal, Eye, Cloud, Camera, Globe, Sparkles
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
  Box,
  Terminal,
  Eye,
  Cloud,
  Camera,
  Globe
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
          bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          dot: 'bg-emerald-400'
        };
      case 'CURRENTLY LEARNING':
        return {
          bg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
          dot: 'bg-cyan-400'
        };
      case 'EXPLORING':
        return {
          bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-400'
        };
    }
  };

  return (
    <section 
      id="skills" 
      className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* HIGH-TECH CODING WORKSTATION AT NIGHT BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('/media/backgrounds/skills_room.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-black/70 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/85" />
        <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-8 text-left">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            // INVENTORY LOADOUT
          </div>
          <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-wide text-shadow-gta leading-none">
            SKILLS INVENTORY
          </h2>
          <div className="font-script text-2xl sm:text-3xl text-cyan-400 font-bold -mt-1">
            Weapons to Build the Future.
          </div>
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
                className={`px-4 py-1.5 rounded-full font-gta text-lg tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
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
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedSkill(skill);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between min-h-[110px] ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/90 to-black border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400/50'
                      : 'bg-black/70 border-white/10 hover:border-white/30 hover:bg-black/85'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-300'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                  </div>

                  <div>
                    <div className="font-gta text-lg text-white tracking-wide truncate">
                      {skill.name}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider truncate">
                      {skill.category}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: SELECTED WEAPON INSPECTION PANEL */}
          <div className="lg:col-span-4 bg-black/85 border border-white/15 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                ITEM INSPECTION
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold flex items-center gap-1.5 ${getStatusBadge(selectedSkill.status).bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadge(selectedSkill.status).dot}`} />
                {selectedSkill.status}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-gta text-3xl text-white tracking-wide">
                {selectedSkill.name}
              </h3>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                CATEGORY: {selectedSkill.category}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                PRACTICAL USAGE IN BUILDS:
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans bg-white/5 p-3 rounded-xl border border-white/5">
                {selectedSkill.practicalUse}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                VERIFIED CAPABILITY
              </div>
              <div>Ground truth implementation in academic and personal portfolio repositories.</div>
            </div>

            {/* Signature GTA Quote */}
            <div className="text-right pt-2">
              <span className="font-script text-lg text-pink-400 drop-shadow">
                &quot;Same player. Different levels.&quot;
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
