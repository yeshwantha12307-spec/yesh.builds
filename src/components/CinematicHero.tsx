import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, FileText, ChevronDown, CheckCircle2, Shield, MapPin, Sparkles } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { soundManager } from '../utils/audio';

export const CinematicHero: React.FC = () => {
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const words = ["CODE", "BUILD", "LEARN", "SHIP", "REPEAT"];

  // Rotating Typewriter Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTypewriterIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  const scrollTo = (id: string) => {
    soundManager.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-16 select-none"
    >
      {/* CINEMATIC SUNSET CITY & SPORTS CAR BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('/media/backgrounds/hero_skyline.jpg')` }}
      >
        {/* Cinematic Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />
      </div>

      {/* HERO MAIN HUD CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col justify-between min-h-[82vh]">
        
        {/* TOP STATUS ROW / MISSION HUD */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pt-4">
          
          {/* LEFT: MISSION 01 CHECKLIST PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-xs p-4 rounded-xl bg-black/75 border border-white/15 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <span className="text-[10px] font-mono font-bold text-amber-400 tracking-widest">
                MISSION 01 // PLAYER INTRO
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                READY
              </span>
            </div>

            <ul className="space-y-2 text-xs font-mono">
              <li className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="tracking-wide">PLAYER PROFILE LOADED</span>
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="tracking-wide">SKILL INVENTORY READY</span>
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="tracking-wide">PROJECT MISSIONS ONLINE</span>
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="tracking-wide">EXPLORE THE WORLD</span>
              </li>
            </ul>
          </motion.div>

          {/* RIGHT: TYPEWRITER MOTTO BILLBOARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden sm:flex flex-col items-end text-right font-mono"
          >
            <div className="px-3.5 py-1.5 rounded-lg bg-black/70 border border-white/10 backdrop-blur-md">
              <div className="text-[9px] text-slate-400 uppercase tracking-widest">DEV CADENCE</div>
              <div className="font-gta text-2xl text-emerald-400 tracking-wider flex items-center gap-1">
                <span>{words[typewriterIndex]}</span>
                <span className="w-2 h-5 bg-emerald-400 animate-pulse inline-block" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CENTER: DEVELOPER BRANDING & HERO SHOWCASE */}
        <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT / CENTER-LEFT: BRAND TYPOGRAPHY & BIO */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Identity Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs tracking-widest mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.25)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">{PROFILE.roleBadge}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{PROFILE.degree}</span>
            </motion.div>

            {/* Oversized Brand Typography: YESH BUILDS */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-gta font-extrabold text-6xl sm:text-8xl md:text-9xl tracking-tight text-white uppercase text-shadow-gta leading-none"
            >
              <span>YESH </span>
              <span className="text-emerald-400 text-shadow-lime">BUILDS</span>
            </motion.h1>

            {/* Supporting Bio */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-4 max-w-2xl text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-sans font-normal backdrop-blur-md bg-black/60 p-4 rounded-xl border border-white/10 shadow-2xl"
            >
              {PROFILE.bio}
            </motion.p>

            {/* Primary & Secondary CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-6 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => scrollTo('missions')}
                onMouseEnter={() => soundManager.playHover()}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-gta text-2xl tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(34,197,94,0.6)] cursor-pointer hover:scale-105 active:scale-95"
              >
                <Target className="w-5 h-5 text-black" />
                <span>EXPLORE MISSIONS</span>
              </button>

              <a
                href={PROFILE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-black/75 hover:bg-white/10 border border-white/30 text-white font-gta text-2xl tracking-wider transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer hover:scale-105 active:scale-95"
              >
                <FileText className="w-5 h-5 text-pink-400" />
                <span>DOWNLOAD RESUME</span>
              </a>
            </motion.div>
          </div>

          {/* RIGHT: PROTAGONIST SHOWCASE (YESHWANTH AKBAR — FRAMELESS CINEMATIC INTEGRATION) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="lg:col-span-5 flex flex-col items-center justify-end relative select-none"
          >
            {/* Subtle natural atmospheric rim lighting behind him - no card, no box, no frame */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-emerald-950/15 to-transparent blur-3xl rounded-full pointer-events-none transform -translate-y-4" />

            {/* Frameless Protagonist Figure Directly in Cinematic Environment */}
            <div className="relative flex flex-col items-center group w-full">
              
              {/* Standalone Cutout Image */}
              <div className="relative w-72 sm:w-84 md:w-96 lg:w-[420px] xl:w-[460px] flex items-end justify-center">
                <img
                  src="/media/yeshwanth_portfolio_cutout.png"
                  alt="Yeshwanth Akbar"
                  className="w-full h-auto max-h-[460px] sm:max-h-[500px] md:max-h-[540px] object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-[1.02]"
                />
                
                {/* Subtle soft bottom ground shadow fade so the figure seamlessly roots into the dark baseline */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent pointer-events-none" />
              </div>

              {/* Minimal floating name tag below the figure */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-3 flex items-center justify-between w-full max-w-xs px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg text-[11px] font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-gta text-lg text-white tracking-wider leading-none">
                    YESHWANTH AKBAR
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  PROTAGONIST
                </span>
              </motion.div>

            </div>
          </motion.div>

        </div>

        {/* BOTTOM ROW: LOCATION & SCROLL INDICATOR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span className="tracking-wider uppercase text-slate-300 font-bold">
              {PROFILE.location} // MAMCET TRICHY
            </span>
          </div>

          <button
            onClick={() => scrollTo('profile')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="text-[11px] tracking-widest uppercase font-mono">SCROLL TO EXPLORE</span>
            <ChevronDown className="w-4 h-4 text-pink-400 animate-bounce group-hover:text-emerald-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
