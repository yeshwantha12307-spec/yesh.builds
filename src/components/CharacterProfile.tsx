import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, GraduationCap, Award, Compass, CheckCircle2 } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { soundManager } from '../utils/audio';

export const CharacterProfile: React.FC = () => {
  const scrollTo = (id: string) => {
    soundManager.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="profile" 
      className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* OCEAN PROMENADE SUNSET BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('/media/backgrounds/about_ocean.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-black/60 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-bold tracking-widest uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            MISSION 02 // KNOW YOUR PLAYER
          </div>
          <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-wide text-shadow-gta leading-none">
            PLAYER PROFILE
          </h2>
          <div className="font-script text-2xl sm:text-3xl text-amber-400 font-bold -mt-1">
            A Developer Who Builds Real Things.
          </div>
        </div>

        {/* TWO-COLUMN OPERATIVE DOSSIER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: IDENTITY CARD & BIOGRAPHY */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-black/80 border border-white/15 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6"
          >
            {/* Header info row with Operative Portrait Avatar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Frameless Operative Cutout — Clean, no box or frame */}
                <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-end justify-center select-none">
                  <img
                    src="/media/yeshwanth_portfolio_cutout.png"
                    alt="Yeshwanth Akbar"
                    className="w-full h-auto max-h-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    OPERATIVE NAME
                  </span>
                  <h3 className="font-gta text-3xl sm:text-4xl text-white tracking-wider leading-none mt-0.5">
                    {PROFILE.name}
                  </h3>
                  <div className="text-xs font-mono text-emerald-400 font-bold mt-1">
                    {PROFILE.roleBadge} • {PROFILE.location}
                  </div>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold text-center self-start sm:self-auto">
                STATUS: LEVEL 2028
              </div>
            </div>

            {/* Authentic Narrative Bio */}
            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
              <p>
                I&apos;m an Information Technology undergraduate at <strong>M.A.M. College of Engineering &amp; Technology, Trichy (Anna University)</strong>, focused on engineering practical software that combines modern full-stack web applications with applied artificial intelligence.
              </p>
              <p>
                From architecting automated issue resolution workflows in <strong>CampusFix AI</strong> to building complete real-time operations in <strong>AngadiFlow</strong>, my development philosophy centers on real-world execution, modular design, and clean architecture.
              </p>
            </div>

            {/* Factual Academic & Project Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase">DEGREE &amp; CGPA</div>
                <div className="font-gta text-2xl text-emerald-400 tracking-wider">7.33 / 10.0</div>
                <div className="text-[10px] text-slate-400 truncate">B.Tech IT (2024–2028)</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase">MAIN MISSIONS</div>
                <div className="font-gta text-2xl text-cyan-400 tracking-wider">2 FEATURED</div>
                <div className="text-[10px] text-slate-400 truncate">CampusFix &amp; AngadiFlow</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">CREDENTIALS</div>
                <div className="font-gta text-2xl text-amber-400 tracking-wider">12 VERIFIED</div>
                <div className="text-[10px] text-slate-400 truncate">Workshops &amp; Internships</div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={() => scrollTo('journey')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-gta text-xl tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                <span>VIEW CAREER JOURNEY</span>
                <Compass className="w-4 h-4 text-black" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: ACTIVE MISSION DIRECTIVES */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Active Goals Panel */}
            <div className="bg-black/80 border border-white/15 rounded-2xl p-6 sm:p-7 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold tracking-widest">
                  <Target className="w-4 h-4 text-emerald-400" />
                  CURRENT MISSION OBJECTIVES
                </div>
                <span className="text-[9px] font-mono text-slate-400">5 ACTIVE</span>
              </div>

              <ul className="space-y-3 font-mono text-xs">
                {PROFILE.goals.map((goal, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
                    <span className="text-slate-200 tracking-wide font-medium">{goal}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Institution Badge */}
            <div className="bg-gradient-to-r from-blue-950/70 to-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  COLLEGE AFFILIATION
                </div>
                <div className="text-sm font-bold text-white leading-snug">
                  M.A.M. College of Engineering &amp; Technology
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Anna University • Reg: {PROFILE.regNo}
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
