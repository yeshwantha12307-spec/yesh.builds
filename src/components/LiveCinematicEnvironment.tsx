import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  layer: 'far' | 'mid' | 'near';
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayPhase: number;
}

interface EnvironmentProps {
  intensity?: number; // 0 to 1 scale for visual weight
  accentReveal?: boolean; // Trigger cinematic light swell during key reveal milestones
}

const LiveCinematicEnvironmentComponent: React.FC<EnvironmentProps> = ({
  intensity = 1.0,
  accentReveal = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(true);

  // Parallax target and current lerped values
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const scrollRef = useRef<{ y: number; targetY: number }>({
    y: 0,
    targetY: 0,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Track mouse position for soft spatial parallax (smoothly lerped in RAF loop)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - halfW) / halfW; // -1 to +1
      mouseRef.current.targetY = (e.clientY - halfH) / halfH; // -1 to +1
    };

    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // High-performance Canvas Particle Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Device performance adaptation
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isLowPower = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) <= 4;

    const PARTICLE_COUNT = isMobile ? 22 : isTablet || isLowPower ? 38 : 65;

    // Palette of cinematic colors matching the portfolio aesthetic
    const COLOR_PALETTE = {
      cyan: 'rgba(0, 240, 255,',     // Iconic cyber cyan
      emerald: 'rgba(34, 197, 94,',   // Signature Yesh Builds emerald
      amber: 'rgba(245, 158, 11,',    // Warm streetlight amber
      white: 'rgba(226, 232, 240,',   // Subtle starlight white
      rose: 'rgba(236, 72, 153,',     // Neon Vice City magenta accent
    };

    const particles: Particle[] = [];

    const createParticle = (isInit = false): Particle => {
      // Tier distribution: 45% far, 40% mid, 15% near (bokeh)
      const roll = Math.random();
      let layer: 'far' | 'mid' | 'near';
      let baseRadius: number;
      let baseAlpha: number;
      let vy: number;
      let colorKey: keyof typeof COLOR_PALETTE;

      if (roll < 0.45) {
        // Far tier: tiny, slow, ambient starlight
        layer = 'far';
        baseRadius = 0.8 + Math.random() * 0.8;
        baseAlpha = 0.15 + Math.random() * 0.2;
        vy = -(0.08 + Math.random() * 0.14);
        colorKey = Math.random() < 0.6 ? 'cyan' : 'white';
      } else if (roll < 0.85) {
        // Mid tier: medium, organic floating dust motes
        layer = 'mid';
        baseRadius = 1.4 + Math.random() * 1.4;
        baseAlpha = 0.25 + Math.random() * 0.25;
        vy = -(0.15 + Math.random() * 0.28);
        const colRoll = Math.random();
        colorKey = colRoll < 0.45 ? 'emerald' : colRoll < 0.8 ? 'amber' : 'cyan';
      } else {
        // Near tier: large, out-of-focus cinematic bokeh motes
        layer = 'near';
        baseRadius = 4.5 + Math.random() * 4.5;
        baseAlpha = 0.08 + Math.random() * 0.14;
        vy = -(0.25 + Math.random() * 0.35);
        colorKey = Math.random() < 0.5 ? 'emerald' : 'amber';
      }

      return {
        x: Math.random() * width,
        y: isInit ? Math.random() * height : height + 10 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.15,
        vy,
        baseRadius,
        radius: baseRadius,
        alpha: baseAlpha,
        baseAlpha,
        layer,
        color: COLOR_PALETTE[colorKey],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        swayAmplitude: 0.3 + Math.random() * 0.7,
        swaySpeed: 0.008 + Math.random() * 0.015,
        swayPhase: Math.random() * Math.PI * 2,
      };
    };

    // Initialize particle field
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Visibility handling: Pause RAF when tab is hidden to save 100% GPU/CPU
    const handleVisibility = () => {
      if (document.hidden) {
        isRunningRef.current = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      } else {
        isRunningRef.current = true;
        lastTime = performance.now();
        animFrameRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      if (!isRunningRef.current) return;

      const dt = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;
      const speedFactor = dt / 16.66; // Normalized to 60fps

      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse & scroll parallax
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const scroll = scrollRef.current;
      scroll.y += (scroll.targetY - scroll.y) * 0.05;

      // When reduced motion is preferred, render static calm particles without movement
      if (prefersReducedMotion) {
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color} ${p.alpha * intensity})`;
          ctx.fill();
        });
        return; // Don't loop requestAnimationFrame when reduced motion is preferred
      }

      // Update & Draw particles across 3 depth tiers
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic sinusoidal floating sway
        p.swayPhase += p.swaySpeed * speedFactor;
        p.pulsePhase += p.pulseSpeed * speedFactor;

        p.x += (p.vx + Math.sin(p.swayPhase) * p.swayAmplitude) * speedFactor;
        p.y += p.vy * speedFactor;

        // Subtle alpha pulsation (breathing light)
        const alphaPulse = 1 + Math.sin(p.pulsePhase) * 0.25;
        p.alpha = Math.max(0.01, Math.min(1, p.baseAlpha * alphaPulse * intensity));

        // Depth parallax multipliers
        let parallaxX = 0;
        let parallaxY = 0;
        if (p.layer === 'far') {
          parallaxX = mouse.x * 6;
          parallaxY = mouse.y * 6 - (scroll.y * 0.03) % height;
        } else if (p.layer === 'mid') {
          parallaxX = mouse.x * 14;
          parallaxY = mouse.y * 14 - (scroll.y * 0.08) % height;
        } else {
          parallaxX = mouse.x * 24;
          parallaxY = mouse.y * 24 - (scroll.y * 0.16) % height;
        }

        const drawX = p.x + parallaxX;
        let drawY = p.y + parallaxY;

        // Wrap around boundaries seamlessly
        if (drawY < -20) {
          p.y = height + 15;
          p.x = Math.random() * width;
        } else if (drawY > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        if (drawX < -20) {
          p.x = width + 10;
        } else if (drawX > width + 20) {
          p.x = -10;
        }

        // Render particle
        if (p.layer === 'near') {
          // Soft radial bokeh glow for near layer
          const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.radius);
          grad.addColorStop(0, `${p.color} ${p.alpha * 0.9})`);
          grad.addColorStop(0.4, `${p.color} ${p.alpha * 0.4})`);
          grad.addColorStop(1, `${p.color} 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sharp glowing motes for mid and far layers
          ctx.fillStyle = `${p.color} ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [prefersReducedMotion, intensity]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* =========================================================================
          1. DEEP CINEMATIC BASE & VOLUMETRIC LIGHT ORBS (GPU ACCELERATED CSS)
         ========================================================================= */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Volumetric Orb 1: Cyan / Emerald Ambient Horizon (Top-Right / Center) */}
      <div
        className={`absolute -top-32 -right-32 w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.065)_0%,rgba(16,185,129,0.035)_40%,transparent_70%)] blur-3xl transform-gpu ${
          prefersReducedMotion ? '' : 'animate-volumetric-1'
        } ${accentReveal ? 'scale-125 opacity-100 transition-all duration-1000' : 'opacity-85'}`}
      />

      {/* Volumetric Orb 2: Warm Cinematic Streetlight Glow (Bottom-Left) */}
      <div
        className={`absolute -bottom-40 -left-40 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.07)_0%,rgba(217,119,6,0.025)_45%,transparent_70%)] blur-3xl transform-gpu ${
          prefersReducedMotion ? '' : 'animate-volumetric-2'
        }`}
      />

      {/* Volumetric Orb 3: Subtle Neon Vice-City Horizon Glow (Mid-Lower Center) */}
      <div
        className={`absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[400px] sm:h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(236,72,153,0.035)_0%,rgba(139,92,246,0.02)_40%,transparent_75%)] blur-3xl transform-gpu ${
          prefersReducedMotion ? '' : 'animate-volumetric-3'
        }`}
      />

      {/* Volumetric Sweeping Atmospheric Light Beam (Diagonal Slow Drift) */}
      <div
        className={`absolute inset-0 bg-[linear-gradient(125deg,transparent_30%,rgba(0,240,255,0.025)_48%,rgba(245,158,11,0.025)_52%,transparent_70%)] opacity-70 transform-gpu ${
          prefersReducedMotion ? '' : 'animate-atmospheric-beam'
        }`}
      />

      {/* =========================================================================
          2. REAL-TIME MULTI-DEPTH CANVAS PARTICLE FIELD
         ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* =========================================================================
          3. TACTICAL GRID & ATMOSPHERIC WIDESCREEN VIGNETTE
         ========================================================================= */}
      {/* Subtle Tactical Cyber Matrix Grid */}
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.09] pointer-events-none" />

      {/* Heavy Cinematic Vignette Framing (Focuses center, preserves text contrast) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(3,7,18,0.7)_80%,rgba(3,7,18,0.95)_100%)] pointer-events-none" />

      {/* Subtle CRT Scanline Film Texture */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
    </div>
  );
};
export const LiveCinematicEnvironment = React.memo(LiveCinematicEnvironmentComponent);
