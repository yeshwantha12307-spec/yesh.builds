import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronLeft,
  Navigation,
  Compass
} from 'lucide-react';
import { MISSION_LEVELS, MissionLevel } from '../data/experience';
import { soundManager } from '../utils/audio';

// Desktop Bezier Highway Path Definition (viewBox: 0 0 1000 660)
const DESKTOP_ROAD_PATH = "M 160 110 C 400 75, 660 120, 800 200 C 890 250, 450 320, 220 365 C 70 400, 480 475, 780 495 C 870 515, 720 585, 500 590";

// Mobile Vertical Winding Road Path Definition (viewBox: 0 0 380 840)
const MOBILE_ROAD_PATH = "M 110 80 C 110 160, 270 160, 270 240 C 270 320, 110 320, 110 400 C 110 490, 270 490, 270 580 C 270 670, 190 670, 190 760";

// Pre-computed progress points for each milestone along the road
const MILESTONE_RATIOS: Record<string, number> = {
  "01": 0.0,
  "02": 0.28,
  "03": 0.55,
  "04": 0.84,
  "05": 1.0
};

// Desktop waypoint coordinates along the road
const DESKTOP_WAYPOINTS: Record<string, { x: number; y: number; labelPos: 'top' | 'right' | 'left' | 'bottom' }> = {
  "01": { x: 160, y: 110, labelPos: 'top' },
  "02": { x: 800, y: 200, labelPos: 'right' },
  "03": { x: 220, y: 365, labelPos: 'left' },
  "04": { x: 780, y: 495, labelPos: 'right' },
  "05": { x: 500, y: 590, labelPos: 'top' }
};

// Mobile waypoint coordinates along vertical road
const MOBILE_WAYPOINTS: Record<string, { x: number; y: number; labelPos: 'left' | 'right' }> = {
  "01": { x: 110, y: 80, labelPos: 'right' },
  "02": { x: 270, y: 240, labelPos: 'left' },
  "03": { x: 110, y: 400, labelPos: 'right' },
  "04": { x: 270, y: 580, labelPos: 'left' },
  "05": { x: 190, y: 760, labelPos: 'right' }
};

export const CareerMap: React.FC = () => {
  // Default to Level 04 (BUILD MODE) as the currently active mission
  const [selectedLevelId, setSelectedLevelId] = useState<string>("04");
  const [currentProgress, setCurrentProgress] = useState<number>(MILESTONE_RATIOS["04"]);
  const [riderDesktopPos, setRiderDesktopPos] = useState({ x: 780, y: 495, angle: 0, headingLeft: false });
  const [riderMobilePos, setRiderMobilePos] = useState({ x: 270, y: 580, angle: 0, headingLeft: false });
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const desktopPathRef = useRef<SVGPathElement>(null);
  const mobilePathRef = useRef<SVGPathElement>(null);
  const hasEnteredRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

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

  // Compute rider position and angle along the desktop highway
  const updateDesktopRider = useCallback((progress: number) => {
    const path = desktopPathRef.current;
    if (!path) return;

    try {
      const totalLen = path.getTotalLength();
      const currentDist = Math.max(0, Math.min(totalLen, progress * totalLen));
      const pt = path.getPointAtLength(currentDist);

      // Sample slightly ahead to compute tangent/heading
      const sampleDist = Math.min(totalLen, currentDist + 5);
      const nextPt = path.getPointAtLength(sampleDist);

      const dx = nextPt.x - pt.x;
      const dy = nextPt.y - pt.y;
      const headingLeft = dx < 0;
      const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Calculate realistic vehicle lean angle (clamped between -12 and +12 deg)
      let leanAngle = headingLeft ? (rawAngle - 180) : rawAngle;
      if (leanAngle > 180) leanAngle -= 360;
      if (leanAngle < -180) leanAngle += 360;
      const clampedLean = Math.max(-12, Math.min(12, leanAngle * 0.35));

      setRiderDesktopPos({
        x: pt.x,
        y: pt.y,
        angle: clampedLean,
        headingLeft
      });
    } catch {
      // Fallback
    }
  }, []);

  // Compute rider position and angle along the mobile road
  const updateMobileRider = useCallback((progress: number) => {
    const path = mobilePathRef.current;
    if (!path) return;

    try {
      const totalLen = path.getTotalLength();
      const currentDist = Math.max(0, Math.min(totalLen, progress * totalLen));
      const pt = path.getPointAtLength(currentDist);

      const sampleDist = Math.min(totalLen, currentDist + 5);
      const nextPt = path.getPointAtLength(sampleDist);

      const dx = nextPt.x - pt.x;
      const dy = nextPt.y - pt.y;
      const headingLeft = dx < 0;
      const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      const clampedLean = Math.max(-15, Math.min(15, (rawAngle - 90) * 0.4));

      setRiderMobilePos({
        x: pt.x,
        y: pt.y,
        angle: clampedLean,
        headingLeft
      });
    } catch {
      // Fallback
    }
  }, []);

  // Smoothly interpolate currentProgress toward target
  const animateProgressTo = useCallback((targetProgress: number, duration = 650) => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCurrentProgress(targetProgress);
      updateDesktopRider(targetProgress);
      updateMobileRider(targetProgress);
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startProgress = currentProgress;
    const startTime = performance.now();

    const step = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth easeInOutCubic
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const val = startProgress + (targetProgress - startProgress) * ease;

      setCurrentProgress(val);
      updateDesktopRider(val);
      updateMobileRider(val);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsAutoScrolling(false);
      }
    };

    setIsAutoScrolling(true);
    animFrameRef.current = requestAnimationFrame(step);
  }, [currentProgress, updateDesktopRider, updateMobileRider]);

  // Initial calculation on mount
  useEffect(() => {
    const initialT = MILESTONE_RATIOS[selectedLevelId] ?? 0.84;
    updateDesktopRider(initialT);
    updateMobileRider(initialT);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedLevelId, updateDesktopRider, updateMobileRider]);

  // Scroll synchronization: forward and reverse scrolling tracks highway progress
  useEffect(() => {
    const section = document.getElementById('journey');
    if (!section) return;

    let rafId: number;
    const handleScroll = () => {
      // Don't override if actively animating between milestones via click
      if (isAutoScrolling) return;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Active scroll range through the section
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        // When top of section enters 70% from top to when bottom reaches 30% from bottom
        const startOffset = windowHeight * 0.7;
        const totalTravel = sectionHeight + windowHeight * 0.4;
        const scrolled = startOffset - sectionTop;
        const rawT = scrolled / totalTravel;
        const clampedT = Math.max(0, Math.min(1, rawT));

        // Only update if in viewport
        if (rawT >= -0.1 && rawT <= 1.1) {
          setCurrentProgress(clampedT);
          updateDesktopRider(clampedT);
          updateMobileRider(clampedT);

          // Update active selected milestone based on closest waypoint
          let closestId = "01";
          let minDiff = 999;
          Object.entries(MILESTONE_RATIOS).forEach(([id, ratio]) => {
            const diff = Math.abs(ratio - clampedT);
            if (diff < minDiff) {
              minDiff = diff;
              closestId = id;
            }
          });
          if (closestId !== selectedLevelId) {
            setSelectedLevelId(closestId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isAutoScrolling, selectedLevelId, updateDesktopRider, updateMobileRider]);

  const selectedLevel = MISSION_LEVELS.find(l => l.levelNumber === selectedLevelId) || MISSION_LEVELS[3];

  const handleSelectLevel = (levelNumber: string) => {
    soundManager.playMilestoneSelect();
    setSelectedLevelId(levelNumber);
    const targetT = MILESTONE_RATIOS[levelNumber] ?? 0;
    animateProgressTo(targetT);
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
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center py-20 sm:py-24 px-4 sm:px-6 select-none overflow-x-hidden"
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
            EDITORIAL HEADER
           ========================================================================= */}
        <div className="mb-8 text-left flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse" />
              <span>// CAREER &amp; MILESTONE PROGRESSION</span>
            </div>
            <h2 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl text-white uppercase tracking-wider leading-none">
              Developer Journey
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Winding highway trajectory through computer science foundations, technical milestones, virtual internships, and active production deployments.
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-black/80 border border-amber-500/40 text-amber-300 font-display font-bold text-xs uppercase tracking-wider shrink-0 self-start md:self-end">
            <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '16s' }} />
            <span>JAWA HIGHWAY CRUISE</span>
          </div>
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
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all duration-200 cursor-pointer shrink-0 border min-h-[44px] ${
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-[1.02]'
                    : isActive
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/50 hover:bg-amber-900/40'
                    : isCompleted
                    ? 'bg-black/60 text-slate-300 border-white/15 hover:border-amber-400/40 hover:text-white'
                    : 'bg-black/40 text-slate-400 border-white/10 hover:text-slate-200'
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
                  <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            ATMOSPHERIC PROGRESSION TRAJECTORY — WINDING ASPHALT HIGHWAY STAGE
           ========================================================================= */}
        <div className="relative w-full rounded-3xl bg-[#06080e]/95 border border-white/15 p-4 sm:p-6 mb-8 backdrop-blur-xl shadow-2xl overflow-hidden">
          
          {/* Top Trajectory Status HUD */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
              <span className="font-semibold tracking-wider text-white">ATMOSPHERIC PROGRESSION TRAJECTORY</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-slate-400 text-[10px]">
                JAWA RIDER ON HIGHWAY
              </span>
              <div className="text-amber-400 font-semibold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25 text-[10px] flex items-center gap-1.5">
                <Navigation className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>5 MILESTONES MAPPED</span>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              DESKTOP & TABLET HIGHWAY VIEWPORT (≥ 768px)
             ----------------------------------------------------------------------- */}
          <div className="hidden md:block relative w-full h-[560px] lg:h-[620px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#04060b] via-[#080d16] to-[#04060a]">
            
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 660"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Neon Amber Glow Filter */}
                <filter id="amberEdgeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Soft Contact Shadow Filter */}
                <filter id="bikeShadow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>

                {/* Asphalt Linear Shading */}
                <linearGradient id="asphaltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1b1f28" />
                  <stop offset="25%" stopColor="#12151d" />
                  <stop offset="50%" stopColor="#151922" />
                  <stop offset="75%" stopColor="#10131a" />
                  <stop offset="100%" stopColor="#181c25" />
                </linearGradient>

                {/* Amber Road Curb Gradient */}
                <linearGradient id="amberCurbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Cyber Streetlight Cone Gradient */}
                <radialGradient id="lampCone" cx="50%" cy="10%" r="90%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.32" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>

                {/* Atmospheric Fog Drift */}
                <radialGradient id="fogDrift" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.08" />
                  <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="#030712" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 1. TERRAIN CONTOURS & AMBIENT DEPTH MESH */}
              <g opacity="0.15">
                <line x1="150" y1="0" x2="150" y2="660" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 9" />
                <line x1="500" y1="0" x2="500" y2="660" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 9" />
                <line x1="850" y1="0" x2="850" y2="660" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 9" />
                <line x1="0" y1="180" x2="1000" y2="180" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 9" />
                <line x1="0" y1="360" x2="1000" y2="360" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 9" />
                <line x1="0" y1="520" x2="1000" y2="520" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 9" />
              </g>

              {/* Distant Mountain Ridges */}
              <path
                d="M 0 160 Q 250 90, 500 140 T 1000 110 L 1000 0 L 0 0 Z"
                fill="#080c14"
                opacity="0.6"
              />
              <path
                d="M 0 190 Q 300 130, 600 170 T 1000 140 L 1000 0 L 0 0 Z"
                fill="#05080e"
                opacity="0.8"
              />

              {/* 2. THE REALISTIC WINDING ASPHALT ROAD */}
              
              {/* Outer Amber Ambient Roadbed Spill */}
              <path
                d={DESKTOP_ROAD_PATH}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="74"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.14"
                filter="url(#amberEdgeGlow)"
              />

              {/* Dark Road Shoulder / Foundation */}
              <path
                d={DESKTOP_ROAD_PATH}
                fill="none"
                stroke="#1e232e"
                strokeWidth="60"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing Amber Road Edge Curbs (Left & Right borders) */}
              <path
                d={DESKTOP_ROAD_PATH}
                fill="none"
                stroke="url(#amberCurbGrad)"
                strokeWidth="52"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))"
              />

              {/* Main Asphalt Pavement Surface */}
              <path
                d={DESKTOP_ROAD_PATH}
                fill="none"
                stroke="url(#asphaltGrad)"
                strokeWidth="44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Subtle Parallel Tire Wear Tracks */}
              <path
                d={DESKTOP_ROAD_PATH}
                fill="none"
                stroke="#090b10"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.35"
                transform="translate(0, -6)"
              />
              <path
                d={DESKTOP_ROAD_PATH}
                fill="none"
                stroke="#090b10"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.35"
                transform="translate(0, 6)"
              />

              {/* Subtle Dashed Center Dividing Lane */}
              <path
                d={DESKTOP_ROAD_PATH}
                fill="none"
                stroke="#fef08a"
                strokeWidth="2.2"
                strokeDasharray="14 18"
                opacity="0.8"
                strokeLinecap="round"
                filter="drop-shadow(0 0 2px rgba(251, 191, 36, 0.5))"
              />

              {/* Active Golden Trajectory Progress Glow Line */}
              <path
                ref={desktopPathRef}
                d={DESKTOP_ROAD_PATH}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="2169"
                strokeDashoffset={2169 * (1 - currentProgress)}
                filter="drop-shadow(0 0 6px rgba(251, 191, 36, 0.9))"
                opacity="0.85"
              />

              {/* 3. GUARDRAILS & PROTECTIVE HIGHWAY BARRIERS ON OUTER BENDS */}
              {/* Turn 1 Guardrail (outer right bend) */}
              <g opacity="0.75">
                <path
                  d="M 760 170 C 850 215, 870 270, 780 300"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 760 174 C 850 219, 870 274, 780 304"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <circle cx="835" cy="225" r="2.5" fill="#fbbf24" filter="drop-shadow(0 0 3px #f59e0b)" />
                <circle cx="855" cy="260" r="2.5" fill="#fbbf24" filter="drop-shadow(0 0 3px #f59e0b)" />
              </g>

              {/* Turn 2 Guardrail (outer left bend) */}
              <g opacity="0.75">
                <path
                  d="M 270 335 C 160 370, 150 435, 270 470"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 270 339 C 160 374, 150 439, 270 474"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <circle cx="175" cy="385" r="2.5" fill="#fbbf24" filter="drop-shadow(0 0 3px #f59e0b)" />
                <circle cx="185" cy="425" r="2.5" fill="#fbbf24" filter="drop-shadow(0 0 3px #f59e0b)" />
              </g>

              {/* Turn 3 Guardrail (outer right bend) */}
              <g opacity="0.75">
                <path
                  d="M 730 480 C 840 505, 860 560, 760 590"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 730 484 C 840 509, 860 564, 760 594"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <circle cx="820" cy="525" r="2.5" fill="#fbbf24" filter="drop-shadow(0 0 3px #f59e0b)" />
                <circle cx="825" cy="560" r="2.5" fill="#fbbf24" filter="drop-shadow(0 0 3px #f59e0b)" />
              </g>

              {/* 4. HIGHWAY STREETLIGHTS WITH AMBER LIGHT POOLS */}
              {/* Streetlamp 1: Near Turn 1 */}
              <g>
                <ellipse cx="490" cy="100" rx="65" ry="32" fill="url(#lampCone)" />
                <line x1="490" y1="100" x2="490" y2="40" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 490 40 Q 490 28, 505 28" fill="none" stroke="#64748b" strokeWidth="2" />
                <circle cx="505" cy="28" r="3" fill="#fef08a" filter="drop-shadow(0 0 4px #fbbf24)" />
              </g>

              {/* Streetlamp 2: Turn 2 valley */}
              <g>
                <ellipse cx="820" cy="280" rx="70" ry="36" fill="url(#lampCone)" />
                <line x1="885" y1="280" x2="885" y2="215" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 885 215 Q 885 203, 870 203" fill="none" stroke="#64748b" strokeWidth="2" />
                <circle cx="870" cy="203" r="3" fill="#fef08a" filter="drop-shadow(0 0 4px #fbbf24)" />
              </g>

              {/* Streetlamp 3: Turn 3 crest */}
              <g>
                <ellipse cx="180" cy="365" rx="65" ry="32" fill="url(#lampCone)" />
                <line x1="120" y1="365" x2="120" y2="305" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 120 305 Q 120 293, 135 293" fill="none" stroke="#64748b" strokeWidth="2" />
                <circle cx="135" cy="293" r="3" fill="#fef08a" filter="drop-shadow(0 0 4px #fbbf24)" />
              </g>

              {/* Streetlamp 4: Near Finish */}
              <g>
                <ellipse cx="780" cy="510" rx="70" ry="36" fill="url(#lampCone)" />
                <line x1="850" y1="510" x2="850" y2="445" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 850 445 Q 850 433, 835 433" fill="none" stroke="#64748b" strokeWidth="2" />
                <circle cx="835" cy="433" r="3" fill="#fef08a" filter="drop-shadow(0 0 4px #fbbf24)" />
              </g>

              {/* 5. ATMOSPHERIC VOLUMETRIC FOG LAYERS */}
              <ellipse cx="360" cy="260" rx="190" ry="75" fill="url(#fogDrift)" />
              <ellipse cx="640" cy="430" rx="210" ry="85" fill="url(#fogDrift)" />
              <ellipse cx="480" cy="590" rx="160" ry="60" fill="url(#fogDrift)" />

              {/* 6. ILLUMINATED ASPHALT WAYPOINT PADS */}
              {MISSION_LEVELS.map((lvl) => {
                const pt = DESKTOP_WAYPOINTS[lvl.levelNumber];
                if (!pt) return null;
                const isSelected = lvl.levelNumber === selectedLevelId;
                const isActive = lvl.status === 'IN_PROGRESS';

                return (
                  <g key={`pad-${lvl.levelNumber}`} className="cursor-pointer" onClick={() => handleSelectLevel(lvl.levelNumber)}>
                    {/* Road Surface Pad */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="26"
                      fill="#0d111a"
                      stroke={isActive ? '#10b981' : isSelected ? '#fbbf24' : '#475569'}
                      strokeWidth="2.5"
                      strokeDasharray={isActive ? "4 4" : "none"}
                      opacity="0.95"
                    />

                    {/* Concentric Glow Disc */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill={isActive ? 'rgba(16, 185, 129, 0.25)' : isSelected ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.06)'}
                    />

                    {/* Active Radar Ripple */}
                    {isActive && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="32"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping"
                        style={{ transformOrigin: `${pt.x}px ${pt.y}px`, animationDuration: '3s' }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* -------------------------------------------------------------------
                THE JAWA MOTORCYCLE RIDER (DESKTOP DYNAMIC VEHICLE)
               ------------------------------------------------------------------- */}
            <div 
              className="absolute pointer-events-none z-30 transition-transform duration-100 ease-out"
              style={{
                left: `${(riderDesktopPos.x / 1000) * 100}%`,
                top: `${(riderDesktopPos.y / 660) * 100}%`,
                transform: 'translate(-50%, -85%)'
              }}
            >
              <div 
                className="relative transition-transform duration-300"
                style={{
                  transform: `scaleX(${riderDesktopPos.headingLeft ? -1 : 1}) rotate(${riderDesktopPos.angle}deg)`
                }}
              >
                {/* Contact Tire Shadow on Asphalt */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black/85 blur-[4px]" />

                {/* Dynamic Amber Headlight Beam Cone */}
                <div 
                  className="absolute top-[48%] left-[72%] w-40 h-24 pointer-events-none -translate-y-1/2"
                  style={{
                    background: 'radial-gradient(ellipse at 15% 50%, rgba(251, 191, 36, 0.65) 0%, rgba(245, 158, 11, 0.22) 40%, transparent 75%)',
                    clipPath: 'polygon(0% 45%, 100% 0%, 100% 100%, 0% 55%)'
                  }}
                />

                {/* High-Resolution Jawa Motorcycle Rider Cutout */}
                <img 
                  src="/media/rider-jawa.webp" 
                  alt="Yeshwanth on Jawa Motorcycle"
                  width="136"
                  height="205"
                  className="w-16 lg:w-20 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] filter contrast-105 select-none"
                  loading="eager"
                  decoding="sync"
                />

                {/* Subtle Amber Headlight Flare */}
                <div className="absolute top-[48%] left-[68%] w-3 h-3 rounded-full bg-amber-300 blur-[2px] animate-pulse" />
              </div>
            </div>

            {/* -------------------------------------------------------------------
                FLOATING MILESTONE BEACON CARDS (DESKTOP & TABLET)
               ------------------------------------------------------------------- */}
            {MISSION_LEVELS.map((lvl) => {
              const pt = DESKTOP_WAYPOINTS[lvl.levelNumber];
              if (!pt) return null;
              const isSelected = lvl.levelNumber === selectedLevelId;
              const isCompleted = lvl.status === 'COMPLETED';
              const isActive = lvl.status === 'IN_PROGRESS';
              const isUpcoming = lvl.status === 'UPCOMING';

              // Positioning offset to prevent card from overlapping road or rider
              let transformClass = "-translate-x-1/2 -translate-y-1/2";
              let labelOffset = "top-14";
              if (pt.labelPos === 'top') {
                labelOffset = "-top-20";
              } else if (pt.labelPos === 'right') {
                labelOffset = "-top-6 left-14";
                transformClass = "";
              } else if (pt.labelPos === 'left') {
                labelOffset = "-top-6 -left-44";
                transformClass = "";
              } else if (pt.labelPos === 'bottom') {
                labelOffset = "top-14 -left-20";
                transformClass = "";
              }

              return (
                <div
                  key={lvl.levelNumber}
                  className="absolute z-20 pointer-events-auto"
                  style={{ 
                    left: `${(pt.x / 1000) * 100}%`, 
                    top: `${(pt.y / 660) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <button
                    onClick={() => handleSelectLevel(lvl.levelNumber)}
                    onMouseEnter={() => soundManager.playHover()}
                    className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
                    aria-label={`${lvl.levelTag}: ${lvl.title}`}
                  >
                    {/* Interactive Marker Center Disc */}
                    <div className={`relative w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-xl ${
                      isActive
                        ? 'bg-amber-400 text-black border-2 border-white shadow-[0_0_22px_rgba(245,158,11,0.7)] scale-105'
                        : isSelected
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black border-2 border-white shadow-[0_0_18px_rgba(245,158,11,0.5)]'
                        : isCompleted
                        ? 'bg-[#0b0f19] text-amber-400 border border-amber-400/50 hover:border-amber-400'
                        : 'bg-[#090b12] text-slate-400 border border-white/20 hover:border-white/40'
                    }`}>
                      {renderIcon(lvl.iconName, "w-5 h-5")}

                      {/* Completed Gold Checkmark Badge */}
                      {isCompleted && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border border-black flex items-center justify-center text-black">
                          <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      {/* Active Status Star */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border border-black flex items-center justify-center text-black text-[9px] font-bold">
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

                    {/* Floating Label Badge */}
                    <div className={`absolute ${labelOffset} flex flex-col items-center pointer-events-none whitespace-nowrap z-20`}>
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold tracking-wider shadow-md ${
                        isActive
                          ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                          : isSelected
                          ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                          : 'bg-black/85 text-slate-300 border border-white/15'
                      }`}>
                        {lvl.levelTag}
                      </span>
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-white mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-[130px] text-center truncate">
                        {lvl.badge}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* -----------------------------------------------------------------------
              DEDICATED MOBILE VERTICAL HIGHWAY ( < 768px )
             ----------------------------------------------------------------------- */}
          <div className="block md:hidden relative w-full h-[620px] rounded-2xl bg-gradient-to-b from-[#04060b] via-[#080d16] to-[#04060a] overflow-hidden p-2">
            
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 380 840"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="mobileAsphalt" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1b1f28" />
                  <stop offset="50%" stopColor="#12151d" />
                  <stop offset="100%" stopColor="#181c25" />
                </linearGradient>
              </defs>

              {/* Outer Amber Highway Glow */}
              <path
                d={MOBILE_ROAD_PATH}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="56"
                opacity="0.16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Road Shoulder */}
              <path
                d={MOBILE_ROAD_PATH}
                fill="none"
                stroke="#1e232e"
                strokeWidth="48"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing Amber Curbs */}
              <path
                d={MOBILE_ROAD_PATH}
                fill="none"
                stroke="#d97706"
                strokeWidth="42"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 4px #f59e0b)"
              />

              {/* Dark Asphalt Surface */}
              <path
                d={MOBILE_ROAD_PATH}
                fill="none"
                stroke="url(#mobileAsphalt)"
                strokeWidth="36"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dashed Center Markings */}
              <path
                d={MOBILE_ROAD_PATH}
                fill="none"
                stroke="#fef08a"
                strokeWidth="2"
                strokeDasharray="10 14"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Active Golden Progress Path on Mobile */}
              <path
                ref={mobilePathRef}
                d={MOBILE_ROAD_PATH}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="980"
                strokeDashoffset={980 * (1 - currentProgress)}
                opacity="0.9"
              />

              {/* Mobile Waypoint Pads */}
              {MISSION_LEVELS.map((lvl) => {
                const pt = MOBILE_WAYPOINTS[lvl.levelNumber];
                if (!pt) return null;
                const isSelected = lvl.levelNumber === selectedLevelId;
                const isActive = lvl.status === 'IN_PROGRESS';

                return (
                  <circle
                    key={`mobile-pad-${lvl.levelNumber}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="20"
                    fill="#0a0e17"
                    stroke={isActive ? '#10b981' : isSelected ? '#fbbf24' : '#475569'}
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* Mobile Jawa Motorcycle Rider */}
            <div 
              className="absolute pointer-events-none z-30 transition-transform duration-100 ease-out"
              style={{
                left: `${(riderMobilePos.x / 380) * 100}%`,
                top: `${(riderMobilePos.y / 840) * 100}%`,
                transform: 'translate(-50%, -85%)'
              }}
            >
              <div 
                className="relative"
                style={{
                  transform: `scaleX(${riderMobilePos.headingLeft ? -1 : 1}) rotate(${riderMobilePos.angle}deg)`
                }}
              >
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full bg-black/85 blur-[3px]" />
                <img 
                  src="/media/rider-jawa.webp" 
                  alt="Yeshwanth on Jawa Motorcycle"
                  width="92"
                  height="138"
                  className="w-12 h-auto drop-shadow-lg filter contrast-105 select-none"
                  loading="eager"
                />
              </div>
            </div>

            {/* Mobile Touch-Friendly Milestone Cards */}
            {MISSION_LEVELS.map((lvl) => {
              const pt = MOBILE_WAYPOINTS[lvl.levelNumber];
              if (!pt) return null;
              const isSelected = lvl.levelNumber === selectedLevelId;
              const isCompleted = lvl.status === 'COMPLETED';
              const isActive = lvl.status === 'IN_PROGRESS';

              const cardLeft = pt.labelPos === 'right' ? 'left-[40%]' : 'left-3';

              return (
                <div
                  key={`mobile-${lvl.levelNumber}`}
                  className="absolute z-20"
                  style={{
                    top: `${(pt.y / 840) * 100}%`,
                    transform: 'translateY(-50%)',
                    left: `${(pt.x / 380) * 100}%`
                  }}
                >
                  {/* Waypoint Icon Button */}
                  <button
                    onClick={() => handleSelectLevel(lvl.levelNumber)}
                    className={`relative -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-lg border cursor-pointer min-h-[44px] min-w-[44px] ${
                      isActive
                        ? 'bg-amber-400 text-black border-white shadow-[0_0_16px_rgba(245,158,11,0.7)]'
                        : isSelected
                        ? 'bg-amber-500 text-black border-white'
                        : isCompleted
                        ? 'bg-[#0e121b] text-amber-400 border-amber-400/50'
                        : 'bg-[#090b12] text-slate-400 border-white/20'
                    }`}
                    aria-label={`Milestone ${lvl.levelTag}`}
                  >
                    {renderIcon(lvl.iconName, "w-4 h-4")}
                  </button>

                  {/* Waypoint Text Badge */}
                  <div 
                    onClick={() => handleSelectLevel(lvl.levelNumber)}
                    className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap cursor-pointer ${
                      pt.labelPos === 'right' ? 'left-8' : '-right-8 -translate-x-full'
                    }`}
                  >
                    <div className={`px-2 py-1 rounded-lg backdrop-blur-md border text-left shadow-md ${
                      isSelected
                        ? 'bg-amber-400 text-black border-amber-300 font-bold'
                        : 'bg-black/85 text-slate-200 border-white/15'
                    }`}>
                      <div className="text-[9px] font-mono leading-none">{lvl.levelTag}</div>
                      <div className="text-[11px] font-display font-bold uppercase tracking-wider mt-0.5 leading-tight">{lvl.badge}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Highway Status & Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
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
            <div className="text-slate-400 text-[10px] hidden sm:inline">
              Scroll or tap waypoints to ride along the Jawa highway
            </div>
          </div>

        </div>

        {/* =========================================================================
            MILESTONE BRIEFING DOSSIER (EXPANDED TO FULL WIDTH WITH DUAL-COLUMN GRID)
           ========================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLevel.levelNumber}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#08090f]/95 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Subtle Amber Horizon Backlight */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Core Dossier Information */}
              <div className="lg:col-span-7 space-y-4">
                
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
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}>
                    {selectedLevel.statusLabel}
                  </span>
                </div>

                {/* Title & Organization Header */}
                <div>
                  <h3 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wider leading-tight">
                    {selectedLevel.title}
                  </h3>
                  <div className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-amber-400 mt-1">
                    {selectedLevel.subtitle}
                  </div>
                </div>

                {/* Metadata Row: Period & Location */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{selectedLevel.period}</span>
                  </div>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedLevel.location}</span>
                  </div>
                </div>

                {/* Narrative Description */}
                <p className="text-slate-300 text-sm leading-relaxed font-sans bg-black/40 p-4 rounded-xl border border-white/5">
                  {selectedLevel.description}
                </p>

                {/* Tech Stack Pills */}
                {selectedLevel.techStack && (
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                      OPERATIONAL TECH ARSENAL:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLevel.techStack.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-cyan-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Objectives, Evidence & Actions */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                
                {/* Verified Details Checklist */}
                <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-white/10 flex items-center justify-between">
                    <span>VERIFIED OBJECTIVES &amp; EVIDENCE</span>
                    <span className="text-amber-400 font-bold">{selectedLevel.verifiedDetails.length} ITEMS</span>
                  </div>
                  <ul className="space-y-2 text-xs font-mono text-slate-300">
                    {selectedLevel.verifiedDetails.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Navigation & Contextual Jump Button */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrevLevel}
                      disabled={selectedLevel.levelNumber === "01"}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/10"
                      title="Previous Milestone"
                      aria-label="Previous Milestone"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextLevel}
                      disabled={selectedLevel.levelNumber === "05"}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/10"
                      title="Next Milestone"
                      aria-label="Next Milestone"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-slate-400 ml-1">
                      {selectedLevel.levelNumber} / 05
                    </span>
                  </div>

                  {/* Contextual Jump Button */}
                  {selectedLevel.associatedSectionId && (
                    <button
                      onClick={() => scrollToSection(selectedLevel.associatedSectionId!)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_18px_rgba(212,175,55,0.4)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
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

              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
