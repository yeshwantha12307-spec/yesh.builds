import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, FileText, ChevronDown, MapPin, Sparkles } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { soundManager } from '../utils/audio';
import { PortraitTurntable } from './PortraitTurntable';
import { ViceCitySignature } from './ViceCitySignature';

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
      {/* CINEMATIC SUNSET CITY & SPORTS CAR THEMATIC BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/media/backgrounds/hero_skyline.webp'), url('/media/backgrounds/hero_skyline.jpg')` }}
        />
        {/* Soft Vignette & Atmospheric Gradients Revealing Live Environment */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/90 via-transparent to-[#030712]/90" />
      </div>

      {/* HERO MAIN HUD CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col justify-between min-h-[82vh]">
        
        {/* TOP STATUS ROW / MISSION HUD */}
        <div className="flex items-center justify-end pt-4">

          {/* RIGHT: TYPEWRITER MOTTO BILLBOARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden sm:flex flex-col items-end text-right font-mono"
          >
            <div className="px-3.5 py-1.5 rounded-lg bg-black/70 border border-white/10 backdrop-blur-md">
              <div className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">DEV CYCLE</div>
              <div className="font-heading font-bold text-2xl sm:text-3xl text-emerald-400 tracking-wider uppercase flex items-center gap-1 leading-none mt-0.5">
                <span>{words[typewriterIndex]}</span>
                <span className="w-1.5 h-4 bg-emerald-400 animate-pulse inline-block" />
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-300 font-display font-bold text-xs sm:text-sm tracking-wider uppercase mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{PROFILE.roleBadge}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{PROFILE.degree}</span>
            </motion.div>

            {/* Oversized Brand Typography: YESH BUILDS */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-heading font-extrabold text-6xl sm:text-8xl md:text-9xl tracking-tight text-white uppercase text-shadow-gta leading-none"
            >
              <span>YESH </span>
              <span className="text-emerald-400 text-shadow-lime">BUILDS</span>
            </motion.h1>

            {/* Supporting Bio */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-4 max-w-2xl text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-sans font-normal backdrop-blur-md bg-black/60 p-4 sm:p-5 rounded-xl border border-white/10 shadow-2xl"
            >
              {PROFILE.bio}
            </motion.p>

            {/* Primary & Secondary CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-6 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <button
                onClick={() => scrollTo('missions')}
                onMouseEnter={() => soundManager.playHover()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-base sm:text-lg tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.5)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Target className="w-5 h-5 text-black" />
                <span>EXPLORE PROJECTS</span>
              </button>

              <a
                href={PROFILE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-black/75 hover:bg-white/10 border border-white/25 text-white font-display font-bold text-base sm:text-lg tracking-wider uppercase transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileText className="w-5 h-5 text-amber-400" />
                <span>VIEW RESUME</span>
              </a>
            </motion.div>
          </div>

          {/* RIGHT: PROTAGONIST SHOWCASE (YESHWANTH AKBAR — 360 PHOTOREALISTIC TURNTABLE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="lg:col-span-5 flex flex-col items-center justify-end relative select-none"
          >
            <PortraitTurntable enableScrollRotation={true} autoRotateDefault={false} />
          </motion.div>

        </div>

        {/* BOTTOM ROW: LOCATION & SCROLL INDICATOR & VICE CITY SIGNATURE */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono text-slate-400">
          {/* Location Tag */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wider uppercase text-slate-300 font-semibold">
              {PROFILE.location} // MAMCET TRICHY
            </span>
          </div>

          {/* Centered Scroll Indicator: Prominently centered, never overlapping corners or buttons */}
          <button
            onClick={() => scrollTo('profile')}
            className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="text-[11px] font-display font-bold tracking-widest uppercase text-slate-300 group-hover:text-white transition-colors">SCROLL TO INSPECT DOSSIER</span>
            <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
          </button>

          {/* Reserved Right Column Spacer on Desktop (Maintains symmetry & clean clearance) */}
          <div className="hidden sm:block w-36 lg:w-44 h-1 pointer-events-none" />
        </div>

      </div>

      {/* VICE CITY CREATOR SIGNATURE + MINI 63-FRAME TURNTABLE */}
      {/* Positioned on the RIGHT side, in the bottom-right area on desktop, tablet, and mobile */}
      <div className="flex justify-end pr-4 sm:pr-0 sm:absolute sm:bottom-4 sm:right-6 lg:bottom-6 lg:right-8 xl:right-10 z-20 mt-6 sm:mt-0 scale-90 sm:scale-95 lg:scale-100 origin-right sm:origin-bottom-right">
        <ViceCitySignature />
      </div>
    </section>
  );
};
