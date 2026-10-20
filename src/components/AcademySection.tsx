import React from 'react';
import { motion } from 'framer-motion';
import { School, GraduationCap, MapPin, Calendar, Award, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const AcademySection: React.FC = () => {
  return (
    <section 
      id="academy" 
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* THEMATIC ACADEMY BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity transition-all duration-700"
          style={{ backgroundImage: `url('/media/backgrounds/academy_campus.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-transparent to-[#030712]/95" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-10 text-left flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              // ACADEMIC RECORD
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
              Education &amp; Credentials
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Formal education progression from secondary schooling in Attur to ongoing undergraduate engineering studies at Anna University.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-black/80 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            2 VERIFIED STAGES
          </div>
        </div>

        {/* PROGRESSION TIMELINE INDICATOR BAR */}
        <div className="hidden md:flex items-center justify-between mb-8 px-6 py-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md font-mono text-xs text-slate-400">
          <div className="flex items-center gap-3 text-amber-300 font-semibold">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-[11px]">1</span>
            <span>STAGE 01: SECONDARY &amp; HIGHER SECONDARY</span>
          </div>
          <div className="h-[1px] flex-1 mx-6 bg-gradient-to-r from-amber-400/50 to-emerald-400/50" />
          <div className="flex items-center gap-3 text-emerald-300 font-semibold">
            <span className="w-6 h-6 rounded-full bg-emerald-400 text-black flex items-center justify-center font-bold text-[11px]">2</span>
            <span>STAGE 02: UNDERGRADUATE ENGINEERING</span>
          </div>
        </div>

        {/* EDUCATION CARDS GRID: 1. SECONDARY EDUCATION FIRST, 2. HIGHER EDUCATION SECOND */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* =========================================================================
              CARD 1 (FIRST): SECONDARY EDUCATION
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => soundManager.playHover()}
            className="group relative bg-[#07080f]/90 border border-amber-400/25 hover:border-amber-400/60 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
          >
            {/* Top Amber Ambient Aura */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber-400/5 blur-3xl pointer-events-none group-hover:bg-amber-400/10 transition-colors" />

            <div className="space-y-5">
              {/* Card Meta Badges */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-[11px] tracking-wider">
                    STAGE 01
                  </span>
                  <span className="text-slate-400 font-semibold uppercase">
                    SECONDARY EDUCATION
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/15 text-slate-300 text-[10px] font-semibold">
                  COMPLETED
                </span>
              </div>

              {/* Institution Title */}
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold uppercase mb-1">
                  <School className="w-4 h-4 text-amber-400" />
                  <span>Matriculation &amp; Higher Secondary</span>
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  Vivekananda Matric Higher Secondary School
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Attur, Tamil Nadu</span>
                </div>
              </div>

              {/* Academic Scores Showcase: SSLC 73% & HSC 71.5% */}
              <div className="pt-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
                  ACADEMIC RESULTS &amp; PERCENTAGES:
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* SSLC Metric Card */}
                  <div className="p-4 rounded-xl bg-black/60 border border-amber-400/30 backdrop-blur-md flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>SSLC (CLASS X)</span>
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
                        73%
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-emerald-400 font-semibold">
                      Secondary Certificate
                    </div>
                  </div>

                  {/* HSC Metric Card */}
                  <div className="p-4 rounded-xl bg-black/60 border border-amber-400/30 backdrop-blur-md flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>HSC (CLASS XII)</span>
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-3xl sm:text-4xl text-amber-400 font-bold tracking-tight">
                        71.5%
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-emerald-400 font-semibold">
                      Higher Secondary
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Checklist */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Mathematics, Physics, Chemistry, and Computer Science foundations</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Tamil Nadu State Board Curriculum</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Foundation Phase</span>
              <span className="text-amber-300 font-bold">Completed</span>
            </div>
          </motion.div>


          {/* =========================================================================
              CARD 2 (SECOND): HIGHER EDUCATION
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            onMouseEnter={() => soundManager.playHover()}
            className="group relative bg-[#07080f]/90 border border-emerald-400/30 hover:border-emerald-400/70 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
          >
            {/* Top Emerald Ambient Aura */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none group-hover:bg-emerald-400/10 transition-colors" />

            <div className="space-y-5">
              {/* Card Meta Badges */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] tracking-wider">
                    STAGE 02
                  </span>
                  <span className="text-slate-400 font-semibold uppercase">
                    HIGHER EDUCATION
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE DEGREE
                </span>
              </div>

              {/* Degree & Institution */}
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase mb-1">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Bachelor of Technology</span>
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  B.Tech Information Technology
                </h3>
                <div className="text-sm font-sans font-medium text-slate-200 mt-1">
                  M.A.M. College of Engineering and Technology, Trichy
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-white font-semibold">2024–2028</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Trichy, Tamil Nadu</span>
                  </div>
                  <span>•</span>
                  <span className="text-slate-400">Anna University Affiliated</span>
                </div>
              </div>

              {/* Performance Metric Showcase: CGPA 7.33/10 */}
              <div className="pt-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
                  ACADEMIC STANDING &amp; REGISTRATION:
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Current CGPA Metric Card */}
                  <div className="p-4 rounded-xl bg-black/60 border border-emerald-400/30 backdrop-blur-md flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>CURRENT CGPA</span>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-3xl sm:text-4xl text-emerald-400 font-bold tracking-tight">
                        7.33
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-semibold">/ 10</span>
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-slate-300 font-semibold">
                      Cumulative Grade Point
                    </div>
                  </div>

                  {/* University Registration ID */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>REGISTER NO.</span>
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="mt-2 font-mono text-base sm:text-lg text-white font-bold tracking-wider">
                      812024205055
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-cyan-300 font-semibold">
                      Anna University
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Checklist */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Core IT: Data Structures, Algorithms, Relational Databases &amp; Web Architectures</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lead developer for CampusFix AI institutional defect management platform</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Program Timeline</span>
              <span className="text-emerald-400 font-bold">2024 – 2028 (In Progress)</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
