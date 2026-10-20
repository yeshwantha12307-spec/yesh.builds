import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Compass, Sparkles, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

// -----------------------------------------------------------------------------
// 63-FRAME 3D SCROLL ANIMATION ASSETS
// Chronological sequence: /frames/frame_001.png -> /frames/frame_063.png
// Resolution: 1280 x 720 (16:9)
// -----------------------------------------------------------------------------
export const TOTAL_FRAMES = 63;
export const FRAME_PATHS: string[] = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const pad = String(i + 1).padStart(3, '0');
  return `/frames/frame_${pad}.png`;
});

// Module-level in-memory cache to preserve loaded frames across re-renders
const imageCache = new Map<number, HTMLImageElement>();
const loadingPromises = new Map<number, Promise<HTMLImageElement | null>>();

/**
 * Loads a single frame image and caches it in memory.
 */
function loadFrameImage(index: number): Promise<HTMLImageElement | null> {
  if (imageCache.has(index)) {
    return Promise.resolve(imageCache.get(index)!);
  }
  if (loadingPromises.has(index)) {
    return loadingPromises.get(index)!;
  }

  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.src = FRAME_PATHS[index];
    img.onload = () => {
      imageCache.set(index, img);
      loadingPromises.delete(index);
      resolve(img);
    };
    img.onerror = () => {
      loadingPromises.delete(index);
      resolve(null);
    };
  });

  loadingPromises.set(index, promise);
  return promise;
}

/**
 * Retrieves the closest available frame if target frame is still downloading.
 * Prevents flickering or blank canvas during rapid scrubbing.
 */
function getNearestAvailableImage(targetIndex: number): HTMLImageElement | null {
  if (imageCache.has(targetIndex)) {
    return imageCache.get(targetIndex)!;
  }

  // Scan outward from target index
  for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
    const prev = targetIndex - offset;
    if (prev >= 0 && imageCache.has(prev)) {
      return imageCache.get(prev)!;
    }
    const next = targetIndex + offset;
    if (next < TOTAL_FRAMES && imageCache.has(next)) {
      return imageCache.get(next)!;
    }
  }

  return imageCache.get(0) || null;
}

interface PortraitTurntableProps {
  initialAngle?: number;
  autoRotateDefault?: boolean;
  enableScrollRotation?: boolean;
  className?: string;
}

export const PortraitTurntable: React.FC<PortraitTurntableProps> = ({
  enableScrollRotation = true,
  className = '',
}) => {
  // Currently rendered frame index (0..62)
  const [displayedFrame, setDisplayedFrame] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [initialFrameReady, setInitialFrameReady] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Drag interaction refs
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartIndexRef = useRef<number>(0);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // ---------------------------------------------------------------------------
  // Canvas Frame Drawing
  // ---------------------------------------------------------------------------
  const drawFrameToCanvas = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = imageCache.get(index) || getNearestAvailableImage(index);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Direct 1:1 hardware-accelerated draw
    ctx.clearRect(0, 0, 1280, 720);
    ctx.drawImage(img, 0, 0, 1280, 720);
  }, []);

  // Efficient requestAnimationFrame scheduler
  const scheduleFrameDraw = useCallback((targetIndex: number) => {
    currentFrameRef.current = targetIndex;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      drawFrameToCanvas(targetIndex);
      rafIdRef.current = null;
    });
  }, [drawFrameToCanvas]);

  // ---------------------------------------------------------------------------
  // Progressive Preloading Strategy
  // 1. Priority load Frame 0 (frame_001.png) immediately.
  // 2. Preload remaining 62 frames in small controlled batches of 4.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;

    // Load initial visible frame first
    loadFrameImage(0).then((img) => {
      if (isCancelled) return;
      if (img) {
        setInitialFrameReady(true);
        drawFrameToCanvas(0);
      }

      // Then progressively preload remaining frames in batches of 4
      const preloadBatches = async () => {
        const BATCH_SIZE = 4;
        for (let i = 1; i < TOTAL_FRAMES; i += BATCH_SIZE) {
          if (isCancelled) break;
          const batchPromises: Promise<HTMLImageElement | null>[] = [];
          for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_FRAMES); j++) {
            if (!imageCache.has(j)) {
              batchPromises.push(loadFrameImage(j));
            }
          }
          if (batchPromises.length > 0) {
            await Promise.all(batchPromises);
            // Brief yield to avoid blocking the main thread
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
        }
      };

      // Defer remaining preloading slightly so hero text & initial paint remain instant
      setTimeout(preloadBatches, 100);
    });

    return () => {
      isCancelled = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawFrameToCanvas]);

  // ---------------------------------------------------------------------------
  // Smooth Scroll-Driven Frame Playback
  // Maps scroll progress through the hero section to all 63 frames:
  // frameIndex = Math.min(62, Math.floor(progress * 63))
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!enableScrollRotation || prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isDraggingRef.current) {
            ticking = false;
            return;
          }

          const heroEl = document.getElementById('hero') || containerRef.current?.closest('section');
          const startY = heroEl ? heroEl.offsetTop : 0;
          const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
          // Smooth scroll range across the hero section
          const scrollDistance = Math.max(380, heroHeight - 120);

          const currentScroll = window.scrollY;
          const rawProgress = (currentScroll - startY) / scrollDistance;
          // Normalized progress clamped strictly between 0 and 1
          const progress = Math.max(0, Math.min(1, rawProgress));

          // Exact mathematical mapping: frameIndex = Math.min(62, Math.floor(progress * 63))
          const targetIndex = Math.min(62, Math.floor(progress * 63));

          if (targetIndex !== currentFrameRef.current) {
            scheduleFrameDraw(targetIndex);
            setDisplayedFrame(targetIndex);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enableScrollRotation, prefersReducedMotion, scheduleFrameDraw]);

  // ---------------------------------------------------------------------------
  // Interactive Pointer Drag Scrubbing
  // ---------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    setHasInteracted(true);
    dragStartXRef.current = e.clientX;
    dragStartIndexRef.current = currentFrameRef.current;

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    // ~7px per frame provides responsive, fluid scrub across all 63 frames
    const frameDelta = Math.round(deltaX / 7);
    const targetIndex = Math.max(0, Math.min(62, dragStartIndexRef.current + frameDelta));

    if (targetIndex !== currentFrameRef.current) {
      scheduleFrameDraw(targetIndex);
      setDisplayedFrame(targetIndex);
      soundManager.playHover();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Keyboard accessibility: Left/Right arrows, Home, End
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(62, currentFrameRef.current + 1);
      scheduleFrameDraw(nextIdx);
      setDisplayedFrame(nextIdx);
      setHasInteracted(true);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prevIdx = Math.max(0, currentFrameRef.current - 1);
      scheduleFrameDraw(prevIdx);
      setDisplayedFrame(prevIdx);
      setHasInteracted(true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scheduleFrameDraw(0);
      setDisplayedFrame(0);
      setHasInteracted(true);
    } else if (e.key === 'End') {
      e.preventDefault();
      scheduleFrameDraw(62);
      setDisplayedFrame(62);
      setHasInteracted(true);
    }
  };

  const handleResetToStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    scheduleFrameDraw(0);
    setDisplayedFrame(0);
    setHasInteracted(true);
  };

  // Azimuth degree calculation across 63 frames (0° to 360°)
  const currentDegrees = Math.round((displayedFrame / 62) * 360);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive 63-frame 3D animation sequence. Scroll or drag horizontally to scrub frames."
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
      <div className="absolute bottom-2 sm:bottom-3 w-44 sm:w-52 h-14 sm:h-15 pointer-events-none flex items-center justify-center">
        {/* Outer radial glow */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full transform scale-y-50" />
        
        {/* Concentric turntable rings */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-38 sm:w-46 h-9 sm:h-11 rounded-full border border-emerald-500/30 bg-black/60 shadow-[0_0_20px_rgba(34,197,94,0.15)] transform scale-y-45 flex items-center justify-center">
            <div className="w-30 sm:w-36 h-6 sm:h-8 rounded-full border border-white/15 bg-black/80" />
          </div>

          {/* Dynamic Azimuth Needle / Indicator tick on turntable rim */}
          <div 
            className="absolute w-38 sm:w-46 h-9 sm:h-11 rounded-full pointer-events-none transform scale-y-45 transition-transform duration-100 ease-out"
            style={{ transform: `scaleY(0.45) rotate(${currentDegrees}deg)` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e]" />
          </div>
        </div>
      </div>

      {/* 3D ANIMATION VIEWPORT (PRESERVED REFINED ~17% SIZE ADJUSTMENT & EXACT 16:9 RATIO) */}
      <div 
        className={`relative w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[410px] aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-[0_20px_45px_rgba(0,0,0,0.9)] backdrop-blur-md bg-black/80 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-300 ${
          isDragging ? 'scale-[1.01]' : 'group-hover:scale-[1.015]'
        }`}
      >
        {/* High-Performance Single Canvas Renderer */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Viewfinder Corner Crosshairs & Overlay */}
        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl">
          {/* Top telemetry HUD tag */}
          <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>3D CAM // 63F</span>
          </div>

          <div className="absolute top-2 right-3 text-[9px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
            <span>RES: 1280×720</span>
          </div>
        </div>

        {/* Soft bottom ground fade so figure seamlessly roots into dark baseline */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#05050f]/80 to-transparent pointer-events-none z-10" />

        {/* INTERACTIVE DRAG HINT BADGE (Fades out once user interacts) */}
        <AnimatePresence>
          {!hasInteracted && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute top-8 px-3 py-1 rounded-full bg-black/85 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.3)] text-[10px] font-mono text-emerald-300 flex items-center gap-2 pointer-events-none z-20"
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="tracking-widest font-bold font-display uppercase">◄ SCROLL OR DRAG 63 FRAMES ►</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TACTICAL HUD TELEMETRY & CONTROLS STRIP */}
      <div className="relative z-30 mt-2.5 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] flex flex-col items-center gap-2 px-1">
        
        {/* Main Name & Protagonist Tag */}
        <div className="flex items-center justify-between w-full px-3.5 py-1.5 rounded-full bg-black/75 border border-white/10 backdrop-blur-md shadow-lg text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display font-bold text-base sm:text-lg text-white tracking-wider leading-none uppercase">
              YESHWANTH AKBAR
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest font-display">
              DEVELOPER
            </span>
          </div>
        </div>

        {/* 63-Frame Telemetry & Quick Reset Bar */}
        <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-300 shadow-md">
          {/* Active Frame Gauge */}
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">FRAME:</span>
            <span className="font-display font-bold text-emerald-300 tracking-wider text-xs uppercase">
              {String(displayedFrame + 1).padStart(2, '0')} // 63 ({currentDegrees}°)
            </span>
          </div>

          {/* Quick Reset to Frame 1 */}
          <button
            type="button"
            onClick={handleResetToStart}
            title="Reset to Frame 1 (0°)"
            aria-label="Reset to Frame 1 (0°)"
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-[9px] font-display text-slate-300 hover:text-white transition-colors border border-white/10 font-bold tracking-wider uppercase cursor-pointer"
          >
            <RefreshCw className="w-2.5 h-2.5 text-emerald-400" />
            <span>FRAME 01</span>
          </button>
        </div>

        {/* Tactile Progress Scrub Track */}
        <div 
          className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, clickX / rect.width));
            const targetIdx = Math.min(62, Math.floor(pct * 63));
            scheduleFrameDraw(targetIdx);
            setDisplayedFrame(targetIdx);
            setHasInteracted(true);
          }}
          title="Click to scrub frame timeline"
        >
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_8px_#22c55e] transition-all duration-75"
            style={{ width: `${((displayedFrame + 1) / 63) * 100}%` }}
          />
        </div>

      </div>
    </div>
  );
};

