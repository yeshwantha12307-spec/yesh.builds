import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface IntroProps {
  onComplete: () => void;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  isRedGlow: boolean;
}

export const IntroSequence: React.FC<IntroProps> = ({ onComplete }) => {
  // Phase 0: Initial black screen with teaser text (0 - 1.8s)
  // Phase 1: Massive metallic PORTFOLIO title reveals with light sweep (1.8s - 4.2s)
  // Phase 2: Yeshwanth's portrait rises cleanly in the center (4.2s - 6.6s)
  // Phase 3: Title morphs to YESH.BUILDS + FULL STACK DEVELOPER • AI (6.6s - 8.5s)
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);

  const isFinishedRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const elapsedRef = useRef<number>(0);

  // Audio cue execution flags (play once per visual milestone)
  const cueDroneRef = useRef<boolean>(false);
  const cueCityRef = useRef<boolean>(false);
  const cueIgnitionRef = useRef<boolean>(false);
  const cueSmokeRef = useRef<boolean>(false);
  const cueRiserRef = useRef<boolean>(false);
  const cueImpactRef = useRef<boolean>(false);
  const cueCompleteRef = useRef<boolean>(false);

  // Sync with soundManager state updates
  useEffect(() => {
    const unsub = soundManager.subscribe(() => {
      setIsMuted(soundManager.isMuted);
    });
    return unsub;
  }, []);

  const handleToggleSound = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);

    if (!newMuted) {
      // Catch up audio state to the current visual scene immediately
      const cur = elapsedRef.current;
      soundManager.startIntroDrone();
      if (cur >= 1800 && cur < 6600) {
        soundManager.playEngineIgnition();
      }
    }
  };

  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    try {
      sessionStorage.setItem('yesh_intro_seen', 'true');
    } catch {
      // Ignore storage errors safely
    }

    // Smooth transition whoosh and crossfade into main portfolio ambience
    soundManager.playPortfolioTransition();
    onComplete();
  }, [onComplete]);

  // Handle keyboard shortcuts (Escape, Space, Enter to skip immediately)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Preload portrait asset and run smooth continuous intro timeline
  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Check if intro has already been seen in this session
    try {
      if (sessionStorage.getItem('yesh_intro_seen') === 'true') {
        onComplete();
        return;
      }
    } catch {
      // Ignore storage errors safely
    }

    // Preload portrait image in the background
    const portraitImg = new Image();
    portraitImg.src = '/media/yeshwanth_suit_cutout.png';

    const bgImg = new Image();
    bgImg.src = '/media/backgrounds/intro_supra_bg.jpg';

    const TOTAL_DURATION = 8500; // 8.5 seconds total cinematic sequence
    const startTime = performance.now();

    const tick = (currentTime: number) => {
      if (isFinishedRef.current) return;

      const elapsed = currentTime - startTime;
      elapsedRef.current = elapsed;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100));
      setProgress(pct);

      // Phase transitions
      if (elapsed >= 1800 && elapsed < 4200) {
        setPhase((prev) => (prev < 1 ? 1 : prev));
      } else if (elapsed >= 4200 && elapsed < 6600) {
        setPhase((prev) => (prev < 2 ? 2 : prev));
      } else if (elapsed >= 6600) {
        setPhase(3);
      }

      // Synchronized Cinematic Sound Cues (Follows real visual milestones)
      if (!soundManager.isMuted) {
        // Scene 1: Opening ambient sub swell
        if (elapsed >= 50 && !cueDroneRef.current) {
          cueDroneRef.current = true;
          soundManager.startIntroDrone();
        }
        // Scene 2: Distant city atmosphere
        if (elapsed >= 800 && !cueCityRef.current) {
          cueCityRef.current = true;
          soundManager.playCityAtmosphere();
        }
        // Scene 3: Headlight relay click and engine starter + ignition roar
        if (elapsed >= 1800 && !cueIgnitionRef.current) {
          cueIgnitionRef.current = true;
          soundManager.playHeadlightClick();
          soundManager.playEngineIgnition();
        }
        // Scene 4: Billowing smoke exhaust whoosh
        if (elapsed >= 3200 && !cueSmokeRef.current) {
          cueSmokeRef.current = true;
          soundManager.playSmokeWhoosh();
        }
        // Scene 5a: Tension riser building into title reveal
        if (elapsed >= 4800 && !cueRiserRef.current) {
          cueRiserRef.current = true;
          soundManager.playCinematicRiser(1.8);
        }
        // Scene 5b: Metallic title reveal impact & sub boom with shimmer
        if (elapsed >= 6600 && !cueImpactRef.current) {
          cueImpactRef.current = true;
          soundManager.playTitleImpact();
        }
        // Scene 6: Loading bar 100% completion chord
        if (pct >= 100 && !cueCompleteRef.current) {
          cueCompleteRef.current = true;
          soundManager.playLoadingComplete();
        }
      }

      if (elapsed < TOTAL_DURATION) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        handleFinish();
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    // Hard fallback timeout to guarantee intro never remains on screen indefinitely
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 9000);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      clearTimeout(fallbackTimer);
      soundManager.stopIntroAudio();
    };
  }, [handleFinish, onComplete]);

  // Real-time Billowing Smoke Particle Simulation on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: SmokeParticle[] = [];
    const MAX_PARTICLES = 75;

    let simAnimId: number;

    const createParticle = (): SmokeParticle => {
      // Emitters positioned around the Toyota Supra burnout rear tires & diffuser
      // Coordinates mapped to the center-lower automotive scene
      const emitterChoice = Math.random();
      let emitX: number;
      let emitY: number;
      let vx: number;
      let vy: number;
      let isRedGlow = false;

      if (emitterChoice < 0.45) {
        // Left burnout wheel
        emitX = width * 0.435 + (Math.random() - 0.5) * 35;
        emitY = height * 0.685 + (Math.random() - 0.5) * 25;
        vx = -(0.6 + Math.random() * 1.8);
        vy = -(0.3 + Math.random() * 0.9);
        isRedGlow = Math.random() < 0.35;
      } else if (emitterChoice < 0.9) {
        // Right burnout wheel
        emitX = width * 0.585 + (Math.random() - 0.5) * 35;
        emitY = height * 0.685 + (Math.random() - 0.5) * 25;
        vx = 0.6 + Math.random() * 1.8;
        vy = -(0.3 + Math.random() * 0.9);
        isRedGlow = Math.random() < 0.55; // higher red reflection from right taillights
      } else {
        // Center exhaust & underbody drift
        emitX = width * 0.51 + (Math.random() - 0.5) * 30;
        emitY = height * 0.72 + (Math.random() - 0.5) * 20;
        vx = (Math.random() - 0.5) * 1.2;
        vy = -(0.4 + Math.random() * 1.1);
        isRedGlow = Math.random() < 0.4;
      }

      const maxLife = 70 + Math.random() * 60;
      return {
        x: emitX,
        y: emitY,
        vx,
        vy,
        radius: 18 + Math.random() * 15,
        maxRadius: 85 + Math.random() * 80,
        alpha: 0,
        maxAlpha: 0.18 + Math.random() * 0.22,
        life: 0,
        maxLife,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        isRedGlow,
      };
    };

    // Pre-populate initial puff
    for (let i = 0; i < 20; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife * 0.6;
      particles.push(p);
    }

    const renderSmoke = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn new puffs
      if (particles.length < MAX_PARTICLES && Math.random() < 0.75) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985; // Air drag
        p.vy -= 0.006; // Buoyancy lift
        p.rotation += p.vRot;

        // Radius expansion
        const lifeRatio = p.life / p.maxLife;
        p.radius = p.radius + (p.maxRadius - p.radius) * 0.025;

        // Opacity envelope (quick fade in, long dissipate)
        if (lifeRatio < 0.2) {
          p.alpha = (lifeRatio / 0.2) * p.maxAlpha;
        } else {
          p.alpha = (1 - (lifeRatio - 0.2) / 0.8) * p.maxAlpha;
        }

        if (p.life >= p.maxLife || p.alpha <= 0.005) {
          particles.splice(i, 1);
          continue;
        }

        // Render soft radial smoke puff
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const grad = ctx.createRadialGradient(0, 0, p.radius * 0.1, 0, 0, p.radius);
        if (p.isRedGlow) {
          // Illuminated by crimson taillights & brake embers
          grad.addColorStop(0, `rgba(255, 65, 45, ${p.alpha * 0.75})`);
          grad.addColorStop(0.4, `rgba(220, 35, 35, ${p.alpha * 0.4})`);
          grad.addColorStop(0.8, `rgba(160, 25, 25, ${p.alpha * 0.15})`);
          grad.addColorStop(1, 'rgba(100, 15, 15, 0)');
        } else {
          // Atmospheric cool white & misty city haze
          grad.addColorStop(0, `rgba(225, 235, 245, ${p.alpha * 0.7})`);
          grad.addColorStop(0.45, `rgba(170, 185, 205, ${p.alpha * 0.35})`);
          grad.addColorStop(0.85, `rgba(110, 125, 145, ${p.alpha * 0.12})`);
          grad.addColorStop(1, 'rgba(60, 75, 95, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      simAnimId = requestAnimationFrame(renderSmoke);
    };

    simAnimId = requestAnimationFrame(renderSmoke);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(simAnimId);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none overflow-hidden font-sans"
      >
        {/* =========================================================================
            1. CINEMATIC AUTOMOTIVE BACKGROUND WITH SLOW CAMERA DRIFT
           ========================================================================= */}
        <motion.div
          initial={{ scale: 1.0, x: 0 }}
          animate={{ scale: 1.035, x: -6 }}
          transition={{ duration: 8.5, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {/* Base Toyota Supra Night Scene (Cleaned, No Watermarks) */}
          <img
            src="/media/backgrounds/intro_supra_bg.jpg"
            alt="Toyota Supra Burnout Night Scene"
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
          />

          {/* Deep Cinematic Vignette & Edge Focus */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

          {/* Subtle Authentic CRT Scanline Filter */}
          <div className="absolute inset-0 scanlines opacity-20" />
        </motion.div>

        {/* =========================================================================
            2. REAL-TIME CANVAS PARTICLE TIRE SMOKE ENGINE
           ========================================================================= */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* =========================================================================
            3. CAR LIGHTING OVERLAYS: PULSING RED LED TAILLIGHTS & ROAD BLOOM
           ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {/* Left Taillight Circular LED Bloom Cluster */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5"
            style={{ left: '49.3%', top: '61.2%' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_4px_#ff1a1a,0_0_35px_12px_rgba(255,20,20,0.7)] animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_4px_#ff1a1a,0_0_35px_12px_rgba(255,20,20,0.7)] animate-pulse delay-75" />
          </div>

          {/* Right Taillight Circular LED Bloom Cluster */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5"
            style={{ left: '59.5%', top: '61.2%' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_4px_#ff1a1a,0_0_35px_12px_rgba(255,20,20,0.7)] animate-pulse delay-100" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_4px_#ff1a1a,0_0_35px_12px_rgba(255,20,20,0.7)] animate-pulse delay-150" />
          </div>

          {/* Wet Asphalt Red Road Reflection Pulse */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-16 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,30,30,0.5)_0%,rgba(200,10,10,0.2)_50%,transparent_80%)] blur-lg animate-pulse"
            style={{ left: '54.5%', top: '78%' }}
          />

          {/* Amber Volumetric Streetlight Ambient Glow (Left Highway) */}
          <div
            className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"
            style={{ left: '8%', top: '22%' }}
          />
        </div>

        {/* =========================================================================
            4. MINIMAL TOP BAR: SOUND CONTROLS & SKIP INTRO [ESC]
           ========================================================================= */}
        <header className="relative z-30 flex items-center justify-between p-4 sm:p-6 w-full text-xs font-mono">
          {/* Sound Toggle Button (Mobile & Desktop friendly) */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? "Enable cinematic sound" : "Sound active (click to mute)"}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-mono tracking-wider backdrop-blur-md transition-all cursor-pointer ${
              isMuted
                ? 'bg-black/60 hover:bg-black/85 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:border-amber-400'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
            }`}
            title={isMuted ? "Click to enable cinematic sound" : "Sound active"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="font-semibold">{isMuted ? 'ENABLE SOUND' : 'SOUND ON'}</span>
          </button>

          {/* Skip Intro Button */}
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 border border-white/20 text-white font-mono text-[11px] tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            title="Skip Intro (Space / Esc)"
          >
            <span>SKIP INTRO</span>
            <FastForward className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-[9px] text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
              ESC
            </span>
          </button>
        </header>

        {/* =========================================================================
            5. CENTER STAGE: METALLIC TYPOGRAPHY & YESHWANTH PORTRAIT
           ========================================================================= */}
        <main className="relative z-20 flex flex-col items-center justify-center flex-1 w-full px-4 text-center">
          
          {/* TEASER TEXT (0s - 1.8s) */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-4 sm:mb-6"
          >
            <div className="font-sans font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-slate-300 uppercase">
              Software Developer Portfolio is
            </div>
            <div className="flex items-center justify-center gap-2 font-sans font-black text-lg sm:text-xl md:text-2xl tracking-wide text-white mt-0.5">
              <span>finally LIVE!</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-500 animate-pulse text-sm">
                ❤️‍🔥
              </span>
            </div>

            {/* Seamless One-Tap Cinematic Audio Activation */}
            {isMuted && phase === 0 && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleToggleSound}
                className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/75 hover:bg-black/95 border border-amber-400/50 hover:border-amber-400 text-amber-300 text-xs font-mono tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>EXPERIENCE WITH SOUND [CLICK TO ENABLE]</span>
              </motion.button>
            )}
          </motion.div>

          {/* OVERSIZED METALLIC CHROME TYPOGRAPHY & OVERLAPPING PORTRAIT CONTAINER */}
          <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center py-2 min-h-[300px] sm:min-h-[380px]">
            
            {/* The Big Word: PORTFOLIO or YESH.BUILDS */}
            <div className="relative overflow-hidden w-full flex items-center justify-center">
              
              {/* PORTFOLIO (Phases 1 and 2) */}
              {phase < 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ 
                    opacity: phase >= 1 ? 1 : 0, 
                    scale: phase >= 1 ? 1 : 0.94 
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative select-none"
                >
                  <h1 className="font-gta font-extrabold text-6xl sm:text-8xl md:text-9xl lg:text-[135px] tracking-wider text-chrome uppercase leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
                    PORTFOLIO
                  </h1>

                  {/* Luminous Metallic Light Sweep */}
                  {phase >= 1 && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-25 animate-chrome-sweep" />
                    </div>
                  )}
                </motion.div>
              )}

              {/* YESH.BUILDS (Phase 3 Morph) */}
              {phase >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative select-none text-center"
                >
                  <h1 className="font-gta font-black text-6xl sm:text-8xl md:text-9xl lg:text-[135px] tracking-tight uppercase leading-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.98)]">
                    <span className="text-chrome">YESH.</span>
                    <span className="text-emerald-400 text-shadow-lime ml-2">BUILDS</span>
                  </h1>

                  {/* Subtitle Badge: Strictly FULL STACK DEVELOPER • AI */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-mono text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold">FULL STACK DEVELOPER • AI</span>
                  </motion.div>
                </motion.div>
              )}

            </div>

            {/* YESHWANTH IN SUIT PORTRAIT CUTOUT (Clean, natural skin tone, no artificial filters) */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 80, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.96 }}
                  transition={{ 
                    duration: 0.85, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="absolute z-20 bottom-[-15px] pointer-events-none flex flex-col items-center"
                >
                  {/* Subtle cool slate backlight halo to naturally separate portrait from sky */}
                  <div className="absolute top-1/4 -inset-x-12 h-64 bg-slate-900/35 blur-3xl rounded-full pointer-events-none" />

                  {/* Authentic Portrait with 100% natural colors - NO artificial CSS brightness/hue filters */}
                  <div className="relative">
                    <img
                      src="/media/yeshwanth_suit_cutout.png"
                      alt="Yeshwanth Akbar"
                      className="w-48 sm:w-60 md:w-72 lg:w-84 h-auto max-h-[420px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* CALL TO ACTION BUTTON (Phase 3) */}
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-4 sm:mt-6 z-30"
            >
              <button
                onClick={handleFinish}
                className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-gta text-2xl tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_30px_rgba(34,197,94,0.7)] hover:scale-105 active:scale-95"
              >
                <span>ENTER OPEN WORLD</span>
                <ArrowRight className="w-5 h-5 text-black stroke-[3]" />
              </button>
            </motion.div>
          )}

        </main>

        {/* =========================================================================
            6. MINIMAL BOTTOM LOADING BAR: CLEAN, CONTINUOUS, NEVER GETS STUCK
           ========================================================================= */}
        <footer className="relative z-30 w-full p-4 sm:p-6 flex flex-col gap-2 max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="text-white font-bold tracking-wider">YESH.BUILDS</span>
            <span className="text-emerald-400 font-bold">{progress}%</span>
          </div>

          {/* Continuous Loading Bar */}
          <div className="w-full h-1.5 rounded-full bg-black/60 backdrop-blur-md overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_#22c55e] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </footer>

      </motion.div>
    </AnimatePresence>
  );
};
