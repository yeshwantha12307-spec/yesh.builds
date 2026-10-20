import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Play, Pause, Compass, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AngleFrame {
  angle: number;
  label: string;
  sublabel: string;
  webp: string;
  png: string;
}

const ANGLES: AngleFrame[] = [
  { angle: 0, label: '0°', sublabel: 'FRONT', webp: '/media/turntable/turntable_000.webp', png: '/media/turntable/turntable_000.png' },
  { angle: 30, label: '30°', sublabel: 'FRONT-RIGHT', webp: '/media/turntable/turntable_030.webp', png: '/media/turntable/turntable_030.png' },
  { angle: 60, label: '60°', sublabel: 'QUARTER-RIGHT', webp: '/media/turntable/turntable_060.webp', png: '/media/turntable/turntable_060.png' },
  { angle: 90, label: '90°', sublabel: 'PROFILE-RIGHT', webp: '/media/turntable/turntable_090.webp', png: '/media/turntable/turntable_090.png' },
  { angle: 120, label: '120°', sublabel: 'REAR-RIGHT', webp: '/media/turntable/turntable_120.webp', png: '/media/turntable/turntable_120.png' },
  { angle: 150, label: '150°', sublabel: 'OBLIQUE-REAR-R', webp: '/media/turntable/turntable_150.webp', png: '/media/turntable/turntable_150.png' },
  { angle: 180, label: '180°', sublabel: 'REAR', webp: '/media/turntable/turntable_180.webp', png: '/media/turntable/turntable_180.png' },
  { angle: 210, label: '210°', sublabel: 'OBLIQUE-REAR-L', webp: '/media/turntable/turntable_210.webp', png: '/media/turntable/turntable_210.png' },
  { angle: 240, label: '240°', sublabel: 'REAR-LEFT', webp: '/media/turntable/turntable_240.webp', png: '/media/turntable/turntable_240.png' },
  { angle: 270, label: '270°', sublabel: 'PROFILE-LEFT', webp: '/media/turntable/turntable_270.webp', png: '/media/turntable/turntable_270.png' },
  { angle: 300, label: '300°', sublabel: 'QUARTER-LEFT', webp: '/media/turntable/turntable_300.webp', png: '/media/turntable/turntable_300.png' },
  { angle: 330, label: '330°', sublabel: 'FRONT-LEFT', webp: '/media/turntable/turntable_330.webp', png: '/media/turntable/turntable_330.png' },
];

interface PortraitTurntableProps {
  initialAngle?: number;
  autoRotateDefault?: boolean;
  enableScrollRotation?: boolean;
  className?: string;
}

export const PortraitTurntable: React.FC<PortraitTurntableProps> = ({
  initialAngle = 0,
  autoRotateDefault = false,
  enableScrollRotation = true,
  className = '',
}) => {
  const [frameIndex, setFrameIndex] = useState(() => {
    const idx = ANGLES.findIndex(a => a.angle === initialAngle);
    return idx >= 0 ? idx : 0;
  });

  const [isAutoRotating, setIsAutoRotating] = useState(autoRotateDefault);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number>(0);
  const dragStartIndexRef = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRotateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) setIsAutoRotating(false);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Preload all 12 WebP & PNG frames into browser cache
  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = ANGLES.length;

    ANGLES.forEach(frame => {
      const img = new Image();
      img.src = frame.webp;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalToLoad) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  // Set frame index with wrapping 0..11
  const setClampedFrame = useCallback((idx: number) => {
    const normalized = ((idx % 12) + 12) % 12;
    setFrameIndex(prev => {
      if (prev !== normalized) {
        soundManager.playHover();
      }
      return normalized;
    });
  }, []);

  // Step angle clockwise or counter-clockwise
  const stepFrame = useCallback((direction: 1 | -1) => {
    setClampedFrame(frameIndex + direction);
    setHasInteracted(true);
  }, [frameIndex, setClampedFrame]);

  // Handle subtle scroll-driven rotation (clamped so it NEVER hijacks page scroll)
  useEffect(() => {
    if (!enableScrollRotation || prefersReducedMotion || isDragging) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Rotate gently over the first 480px of page scroll
          if (scrollY <= 480) {
            const scrollStep = Math.floor((scrollY / 480) * 12);
            setFrameIndex(scrollStep % 12);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableScrollRotation, prefersReducedMotion, isDragging]);

  // Handle continuous auto-rotation
  useEffect(() => {
    if (!isAutoRotating || prefersReducedMotion || isDragging) {
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
      return;
    }

    autoRotateIntervalRef.current = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % 12);
    }, 450);

    return () => {
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
    };
  }, [isAutoRotating, prefersReducedMotion, isDragging]);

  // Mouse & Touch Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only respond to primary mouse button or touch
    if (e.button !== 0) return;

    setIsDragging(true);
    setHasInteracted(true);
    dragStartXRef.current = e.clientX;
    dragStartIndexRef.current = frameIndex;

    // Capture pointer events on the container
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartXRef.current;
    // 22 pixels per 30-degree frame gives fluid, responsive turntable control
    const frameDelta = Math.round(deltaX / 22);
    const newIdx = ((dragStartIndexRef.current - frameDelta) % 12 + 12) % 12;

    if (newIdx !== frameIndex) {
      setFrameIndex(newIdx);
      soundManager.playHover();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      stepFrame(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      stepFrame(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setClampedFrame(0);
      setHasInteracted(true);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsAutoRotating(prev => !prev);
      soundManager.playClick();
    }
  };

  const currentFrame = ANGLES[frameIndex];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive 360-degree portrait turntable of Yeshwanth Akbar. Use Left and Right arrow keys to rotate."
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'pan-y' }}
      className={`relative group flex flex-col items-center justify-end select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-3xl ${className}`}
    >
      {/* ATMOSPHERIC RESTRAINED LIGHTING GLOW */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-emerald-950/25 via-slate-900/30 to-transparent blur-3xl rounded-full pointer-events-none transform -translate-y-6 transition-opacity duration-700" 
      />

      {/* RESTRAINED CINEMATIC TURNTABLE PEDESTAL / BASE */}
      <div className="absolute bottom-2 sm:bottom-4 w-64 sm:w-80 h-20 pointer-events-none flex items-center justify-center">
        {/* Outer radial glow */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full transform scale-y-50" />
        
        {/* Concentric turntable rings */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-56 sm:w-72 h-14 sm:h-16 rounded-full border border-emerald-500/30 bg-black/60 shadow-[0_0_20px_rgba(34,197,94,0.15)] transform scale-y-45 flex items-center justify-center">
            <div className="w-44 sm:w-56 h-10 sm:h-12 rounded-full border border-white/15 bg-black/80" />
          </div>

          {/* Dynamic Azimuth Needle / Indicator tick on turntable rim */}
          <div 
            className="absolute w-56 sm:w-72 h-14 sm:h-16 rounded-full pointer-events-none transform scale-y-45 transition-transform duration-150 ease-out"
            style={{ transform: `scaleY(0.45) rotate(${currentFrame.angle}deg)` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e]" />
          </div>
        </div>
      </div>

      {/* PORTRAIT DISPLAY STACK (FRAME-PRELOADED, ZERO LAYOUT SHIFT) */}
      <div 
        className={`relative w-72 sm:w-84 md:w-96 lg:w-[410px] xl:w-[440px] aspect-[220/360] flex items-end justify-center cursor-grab active:cursor-grabbing transition-transform duration-300 ${isDragging ? 'scale-[1.01]' : 'group-hover:scale-[1.015]'}`}
      >
        {ANGLES.map((frame, idx) => {
          const isActive = frameIndex === idx;
          return (
            <picture key={frame.angle}>
              <source type="image/webp" srcSet={frame.webp} />
              <img
                src={frame.png}
                alt={`Yeshwanth Akbar portrait view at ${frame.angle} degrees`}
                draggable={false}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                width={220}
                height={360}
                className={`absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] transition-opacity duration-75 ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            </picture>
          );
        })}

        {/* Soft bottom ground fade so figure seamlessly roots into dark baseline */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#05050f] via-[#05050f]/60 to-transparent pointer-events-none z-20" />

        {/* INTERACTIVE DRAG HINT BADGE (Fades out once user interacts) */}
        <AnimatePresence>
          {!hasInteracted && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute top-8 px-3.5 py-1.5 rounded-full bg-black/75 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.3)] text-[10px] font-mono text-emerald-300 flex items-center gap-2 pointer-events-none z-30"
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="tracking-widest font-bold">◄ DRAG TO ROTATE 360° ►</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TACTICAL HUD TELEMETRY & CONTROLS STRIP */}
      <div className="relative z-30 mt-2 w-full max-w-sm flex flex-col items-center gap-2 px-2">
        
        {/* Main Name & Protagonist Tag */}
        <div className="flex items-center justify-between w-full px-4 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md shadow-lg text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display font-bold text-base text-white tracking-wide leading-none">
              YESHWANTH AKBAR
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider font-mono">
              DEVELOPER
            </span>
          </div>
        </div>

        {/* 360 Turntable Telemetry Controls Bar */}
        <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-300 shadow-md">
          {/* Active Angle Azimuth Gauge */}
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400">AZIMUTH:</span>
            <span className="font-bold text-emerald-300 tracking-wider">
              {currentFrame.label} // {currentFrame.sublabel}
            </span>
          </div>

          {/* Quick HUD Controls: Reset & Play/Pause */}
          <div className="flex items-center gap-1.5">
            {/* Auto-rotate Toggle */}
            {!prefersReducedMotion && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  setIsAutoRotating(prev => !prev);
                  setHasInteracted(true);
                }}
                title={isAutoRotating ? 'Pause auto-turntable' : 'Play auto-turntable'}
                aria-label={isAutoRotating ? 'Pause auto-turntable' : 'Play auto-turntable'}
                className="p-1 rounded-md bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 transition-colors border border-white/10"
              >
                {isAutoRotating ? (
                  <Pause className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Play className="w-3 h-3 text-slate-300" />
                )}
              </button>
            )}

            {/* Quick Reset to Front 0° */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                setClampedFrame(0);
                setHasInteracted(true);
              }}
              title="Reset to 0° Front View"
              aria-label="Reset to 0° Front View"
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-[9px] text-slate-300 hover:text-white transition-colors border border-white/10 font-bold"
            >
              FRONT (0°)
            </button>
          </div>
        </div>

        {/* Discrete Angle Stepper Dots (Aids accessibility & discrete jump) */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5" role="tablist" aria-label="Portrait camera angles">
          {ANGLES.map((a, idx) => (
            <button
              key={a.angle}
              type="button"
              role="tab"
              aria-selected={frameIndex === idx}
              aria-label={`Angle ${a.angle} degrees`}
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                setClampedFrame(idx);
                setHasInteracted(true);
              }}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                frameIndex === idx
                  ? 'w-5 bg-emerald-400 shadow-[0_0_8px_#22c55e]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
