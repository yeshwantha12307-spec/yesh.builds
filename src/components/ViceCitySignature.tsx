import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
// -----------------------------------------------------------------------------
// 63-FRAME MINI SIGNATURE 3D ANIMATION ASSETS
// Dedicated, completely isolated from main hero animation
// Source: /frames/frame_001.png -> /frames/frame_063.png
// -----------------------------------------------------------------------------
export const MINI_TOTAL_FRAMES = 63;
export const MINI_FRAME_PATHS: string[] = Array.from({ length: MINI_TOTAL_FRAMES }, (_, i) => {
  const pad = String(i + 1).padStart(3, '0');
  return `/frames/frame_${pad}.png`;
});

// Dedicated in-memory cache for mini turntable frames
const miniImageCache = new Map<number, HTMLImageElement>();
const miniLoadingPromises = new Map<number, Promise<HTMLImageElement | null>>();

export function loadMiniFrameImage(index: number): Promise<HTMLImageElement | null> {
  if (miniImageCache.has(index)) {
    return Promise.resolve(miniImageCache.get(index)!);
  }
  if (miniLoadingPromises.has(index)) {
    return miniLoadingPromises.get(index)!;
  }

  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.src = MINI_FRAME_PATHS[index];
    img.onload = () => {
      miniImageCache.set(index, img);
      miniLoadingPromises.delete(index);
      resolve(img);
    };
    img.onerror = () => {
      miniLoadingPromises.delete(index);
      resolve(null);
    };
  });

  miniLoadingPromises.set(index, promise);
  return promise;
}

export function getNearestMiniImage(targetIndex: number): HTMLImageElement | null {
  if (miniImageCache.has(targetIndex)) {
    return miniImageCache.get(targetIndex)!;
  }

  for (let offset = 1; offset < MINI_TOTAL_FRAMES; offset++) {
    const prev = targetIndex - offset;
    if (prev >= 0 && miniImageCache.has(prev)) {
      return miniImageCache.get(prev)!;
    }
    const next = targetIndex + offset;
    if (next < MINI_TOTAL_FRAMES && miniImageCache.has(next)) {
      return miniImageCache.get(next)!;
    }
  }

  return miniImageCache.get(0) || null;
}

// -----------------------------------------------------------------------------
// PRECISION 1980s MIAMI BRUSH SCRIPT VECTOR PATH FOR "YESH"
// Extracted from iconic retro cursive typography matching the reference aesthetic
// -----------------------------------------------------------------------------
const YESH_PATH_D = "M 124.1 20.7 Q 124.8 21.3 124.8 22.2 Q 124.8 23.1 124.2 23.8 L 112.1 36.8 Q 94.7 57.2 72.8 88.0 Q 67.3 97.4 53.7 110.9 Q 46.6 118.1 37.8 123.2 Q 29.0 128.2 21.6 128.2 Q 20.0 128.2 18.0 126.3 Q 16.0 124.4 16.0 121.0 Q 16.0 116.4 22.2 110.2 Q 28.3 104.1 36.6 99.8 Q 44.9 95.5 50.7 95.5 L 51.1 95.5 Q 70.9 72.5 75.5 67.3 L 92.2 49.0 Q 92.3 48.8 92.5 48.6 Q 92.7 48.4 93.1 47.9 Q 93.9 46.9 93.7 46.9 Q 93.5 46.9 91.9 48.3 L 76.7 63.2 Q 49.0 90.4 36.3 90.4 Q 33.2 90.4 30.4 88.0 Q 27.7 85.6 27.7 81.2 Q 27.7 72.8 43.1 57.4 L 71.1 32.4 Q 76.2 27.6 76.2 26.2 Q 76.2 25.7 75.5 25.7 Q 74.9 25.7 72.5 26.2 Q 70.1 26.6 65.0 28.2 Q 59.9 29.8 54.3 32.4 Q 48.7 34.9 41.4 39.7 Q 34.1 44.5 27.5 50.6 Q 26.4 52.1 25.1 52.1 L 24.8 52.1 Q 24.4 52.0 24.4 51.6 Q 24.4 50.5 26.0 49.0 Q 35.3 35.5 48.3 27.0 Q 61.4 18.5 71.8 18.5 Q 76.2 18.5 79.9 20.9 Q 83.5 23.2 83.5 28.8 Q 83.5 32.7 78.8 38.7 Q 74.1 44.8 67.3 51.0 Q 60.5 57.1 53.7 63.0 Q 37.4 77.2 37.4 81.5 Q 37.4 81.7 38.4 81.7 Q 39.4 81.7 42.6 80.2 Q 45.8 78.6 50.1 75.6 Q 54.4 72.7 58.7 69.6 Q 62.9 66.5 68.1 62.4 Q 73.3 58.3 76.9 55.5 Q 86.8 47.6 89.8 45.0 L 112.1 26.0 L 118.3 19.9 Q 119.3 18.7 120.3 18.7 Q 121.2 18.7 121.6 19.0 L 124.1 20.7 Z M 48.4 98.2 Q 49.2 97.4 49.2 97.2 Q 49.2 97.0 49.0 97.0 L 47.2 97.7 Q 37.0 103.1 28.7 112.2 Q 20.4 121.2 20.4 124.2 Q 20.4 124.6 20.7 124.6 L 21.4 124.3 Q 26.7 121.2 33.5 114.7 Q 40.3 108.2 44.4 103.1 L 48.4 98.2 Z M 93.9 33.6 Q 93.9 32.0 96.0 30.9 L 108.3 26.1 Q 108.7 25.9 109.5 25.9 Q 110.3 25.9 110.9 26.6 Q 111.6 27.3 112.3 27.3 Q 113.0 27.3 115.4 26.7 Q 117.8 26.2 121.7 25.3 Q 125.7 24.4 130.7 23.5 Q 142.2 21.5 154.7 21.5 Q 169.5 21.5 175.9 23.8 Q 178.4 24.7 180.2 26.3 Q 181.9 28.0 181.9 30.3 Q 181.9 31.6 180.0 31.6 Q 153.8 32.4 137.1 35.0 Q 135.4 35.2 135.4 36.1 Q 135.4 36.5 135.4 36.7 Q 135.5 37.0 134.7 37.9 L 122.8 50.6 Q 122.1 51.4 122.1 51.8 Q 122.1 52.1 122.3 52.1 Q 122.6 52.1 123.6 51.9 Q 130.5 51.5 136.2 51.5 Q 142.0 51.5 142.9 52.1 Q 147.5 55.6 148.3 56.6 Q 149.0 57.7 149.0 58.3 Q 149.0 59.7 146.7 60.0 Q 119.0 62.7 116.8 62.7 Q 114.6 62.6 114.0 62.6 Q 112.3 62.6 110.2 65.2 L 97.4 82.2 Q 96.9 83.1 96.9 83.5 Q 96.9 83.8 97.3 83.8 Q 97.7 83.8 98.5 83.4 Q 108.4 81.8 117.0 81.8 Q 125.5 81.8 129.7 82.3 Q 135.5 82.3 142.1 90.8 Q 142.6 91.6 142.6 92.2 Q 142.6 92.8 141.1 92.8 Q 114.9 92.8 101.3 93.9 Q 100.7 94.0 99.9 94.0 Q 95.4 94.0 93.7 91.9 Q 93.4 91.3 92.7 91.3 Q 91.9 91.3 91.4 92.0 Q 90.8 92.8 90.5 92.8 Q 90.1 92.8 89.2 92.1 Q 88.3 91.5 87.3 90.0 Q 86.3 88.4 86.3 86.7 Q 86.3 85.0 86.9 83.5 Q 87.6 82.0 88.7 79.7 Q 89.8 77.4 93.7 71.8 Q 97.5 66.2 101.7 62.2 Q 102.2 61.7 102.2 61.2 Q 102.2 60.7 101.1 60.7 Q 100.0 60.7 98.9 59.9 Q 97.8 59.2 97.8 57.7 Q 97.8 56.3 101.5 55.4 L 107.2 53.9 Q 107.3 53.9 107.3 53.9 Q 108.9 53.9 110.6 51.7 Q 122.8 39.8 125.5 38.5 Q 126.5 37.8 126.5 37.5 Q 126.5 37.1 125.8 37.1 Q 125.2 37.1 124.8 37.2 Q 115.0 38.8 109.3 38.8 Q 103.5 38.8 100.9 38.2 Q 98.2 37.7 97.0 37.0 Q 94.2 35.2 94.0 34.1 L 93.9 33.6 Z M 187.4 61.7 L 176.7 62.1 Q 166.8 62.1 163.4 61.4 Q 160.0 60.7 157.3 59.8 Q 154.6 58.8 153.0 57.6 Q 149.2 54.6 149.2 49.7 Q 149.2 48.2 150.9 45.3 Q 152.7 42.4 157.1 38.3 Q 161.4 34.3 167.5 30.6 Q 173.5 27.0 183.4 24.3 Q 193.3 21.5 204.8 21.1 Q 208.9 21.1 213.4 22.1 Q 218.0 23.1 221.0 24.5 Q 224.0 25.9 226.3 28.7 Q 228.6 31.4 228.6 35.1 Q 228.6 38.0 223.0 41.4 Q 216.7 45.2 206.3 45.2 Q 196.0 45.2 196.0 43.7 Q 196.0 42.5 202.0 41.0 Q 208.1 39.4 214.1 37.3 Q 220.2 35.2 220.2 32.6 Q 220.2 31.2 215.6 31.2 Q 185.2 31.2 163.3 47.0 Q 159.2 50.0 159.2 52.2 Q 159.2 55.7 181.1 55.7 Q 200.7 55.9 200.7 66.2 Q 200.7 73.5 190.7 80.2 Q 180.8 86.8 167.2 90.4 Q 153.8 94.1 141.9 94.2 Q 136.3 94.2 130.2 91.3 Q 124.0 88.3 124.0 84.1 Q 124.0 82.8 126.2 82.7 Q 138.7 81.3 142.1 79.7 Q 143.0 79.5 143.5 79.5 Q 144.0 79.5 144.0 79.7 Q 144.0 80.2 142.7 81.1 Q 141.6 81.7 140.2 82.2 Q 137.3 83.3 137.3 83.6 Q 137.3 83.9 139.4 83.9 Q 141.5 83.9 150.0 82.2 Q 158.5 80.6 168.2 77.9 Q 177.9 75.3 185.4 71.4 Q 192.8 67.5 192.8 64.0 Q 192.8 61.7 187.4 61.7 Z M 242.6 49.9 L 253.2 48.7 L 253.4 48.7 Q 256.1 48.7 257.9 47.0 Q 284.5 19.7 293.0 14.6 Q 293.8 14.0 294.6 14.0 Q 295.3 14.0 295.7 14.4 Q 298.0 16.1 298.0 16.6 Q 298.0 17.0 297.7 17.3 Q 270.3 44.2 270.3 46.3 Q 270.3 46.9 271.2 46.9 Q 277.4 47.0 278.1 47.6 Q 278.7 48.2 280.0 48.4 Q 281.7 48.4 285.1 49.7 Q 288.6 50.8 288.6 52.9 Q 288.6 53.4 288.1 53.5 Q 287.6 53.7 284.0 54.2 Q 280.3 54.7 274.5 55.5 Q 268.7 56.2 265.3 56.6 Q 261.9 57.0 260.5 57.3 Q 259.2 57.6 258.5 58.8 Q 243.1 78.8 237.2 88.1 Q 237.0 89.3 236.0 89.3 Q 234.9 89.3 233.8 87.3 Q 232.7 85.3 232.7 82.9 Q 232.7 76.8 245.2 60.9 Q 246.0 60.3 246.0 59.9 Q 246.0 59.7 245.5 59.7 L 245.0 59.7 L 231.3 62.0 Q 229.9 62.0 228.9 63.2 Q 215.0 82.3 213.0 85.9 Q 212.7 87.2 211.6 87.2 Q 210.5 87.2 208.9 85.5 Q 207.3 83.9 207.3 81.8 Q 207.3 79.7 210.1 74.1 Q 212.9 68.5 215.9 64.8 Q 216.5 64.1 216.5 63.7 Q 216.5 63.2 215.7 63.2 L 210.8 63.0 Q 209.0 62.9 205.7 59.8 Q 202.4 56.7 202.4 54.3 Q 202.4 53.4 203.4 53.4 Q 211.0 54.2 213.7 54.2 Q 216.3 54.2 226.0 52.5 Q 227.0 52.2 228.5 50.4 Q 260.2 17.5 264.1 17.5 Q 264.8 17.5 265.7 18.5 Q 266.7 19.6 266.7 20.1 Q 266.7 20.7 266.3 21.1 Q 244.8 44.6 243.1 46.6 Q 241.4 48.5 241.4 49.2 Q 241.4 49.9 242.6 49.9 Z";

// Sweeping Miami Vice Underline Flourish Path
const FLOURISH_PATH_D = "M 32,122 C 85,130 165,127 232,114 C 262,107 282,99 292,91 C 280,98 250,107 215,114 C 152,124 82,124 32,122 Z";
const FLOURISH_HIGHLIGHT_D = "M 48,123 C 95,129 160,126 220,114 C 245,109 265,102 276,96 C 260,101 235,108 202,113 C 145,121 85,123 48,123 Z";

// In-memory cache of transparent cutout frames for the mini animation
const miniCanvasCache = new Map<number, HTMLCanvasElement>();

/**
 * Creates or retrieves a transparent cutout canvas for the mini turntable.
 * Removes the off-white/grey studio backdrop while preserving the subject's
 * original shape, skin tone, clothing, white collar, and suit.
 * Applies a 2-pass Chamfer distance transform for consistent sub-pixel
 * edge feathering and defringing to eliminate light halos against dark themes.
 */
function getCutoutMiniCanvas(frameIdx: number): HTMLCanvasElement | null {
  if (miniCanvasCache.has(frameIdx)) {
    return miniCanvasCache.get(frameIdx)!;
  }

  const img = miniImageCache.get(frameIdx) || getNearestMiniImage(frameIdx);
  if (!img || !img.complete || img.naturalWidth === 0) return null;

  const width = 640;
  const height = 360;

  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!offCtx) return null;

  offCtx.drawImage(img, 0, 0, width, height);
  const imgData = offCtx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const totalPixels = width * height;

  // 1. Multi-directional outer scan to isolate background without encroaching on subject
  const bgMask = new Uint8Array(totalPixels);
  const dist = new Float32Array(totalPixels);
  dist.fill(999.0);

  // Horizontal scan from left and right for each row
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;

    // Scan inward from left
    let lx = 0;
    while (lx < width) {
      const idx = rowOffset + lx;
      const pIdx = idx * 4;
      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];
      const val = (r + g + b) / 3;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC - minC;

      if (val > 195 && sat < 18) {
        bgMask[idx] = 1;
        lx++;
      } else {
        break;
      }
    }

    // Scan inward from right
    let rx = width - 1;
    while (rx > lx) {
      const idx = rowOffset + rx;
      const pIdx = idx * 4;
      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];
      const val = (r + g + b) / 3;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC - minC;

      if (val > 195 && sat < 18) {
        bgMask[idx] = 1;
        rx--;
      } else {
        break;
      }
    }
  }

  // Vertical scan downward from top for each column (clears background above hair)
  for (let x = 0; x < width; x++) {
    let ty = 0;
    while (ty < height) {
      const idx = ty * width + x;
      const pIdx = idx * 4;
      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];
      const val = (r + g + b) / 3;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC - minC;

      if (val > 195 && sat < 18) {
        bgMask[idx] = 1;
        ty++;
      } else {
        break;
      }
    }
  }

  // 2. Fast 2-Pass Distance Transform (Chamfer 3-4 Metric for smooth 2D distance)
  // Forward pass (top-left to bottom-right)
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + x;
      if (bgMask[idx] === 1) {
        dist[idx] = 0.0;
      } else {
        let d = dist[idx];
        if (x > 0) d = Math.min(d, dist[idx - 1] + 1.0);
        if (y > 0) {
          d = Math.min(d, dist[idx - width] + 1.0);
          if (x > 0) d = Math.min(d, dist[idx - width - 1] + 1.414);
          if (x < width - 1) d = Math.min(d, dist[idx - width + 1] + 1.414);
        }
        dist[idx] = d;
      }
    }
  }

  // Backward pass (bottom-right to top-left)
  for (let y = height - 1; y >= 0; y--) {
    const rowOffset = y * width;
    for (let x = width - 1; x >= 0; x--) {
      const idx = rowOffset + x;
      let d = dist[idx];
      if (x < width - 1) d = Math.min(d, dist[idx + 1] + 1.0);
      if (y < height - 1) {
        d = Math.min(d, dist[idx + width] + 1.0);
        if (x > 0) d = Math.min(d, dist[idx + width - 1] + 1.414);
        if (x < width - 1) d = Math.min(d, dist[idx + width + 1] + 1.414);
      }
      dist[idx] = d;
    }
  }

  // 3. Alpha Feathering & Edge Defringing to eliminate bright halos against dark background
  for (let i = 0; i < totalPixels; i++) {
    const d = dist[i];
    const pIdx = i * 4;

    if (d === 0.0) {
      data[pIdx + 3] = 0;
    } else if (d < 2.5) {
      // Soft sub-pixel edge feathering
      const alphaFactor = Math.min(1.0, d / 2.0);
      data[pIdx + 3] = Math.round(alphaFactor * 255);

      // Defringe bright background bleed along outer perimeter
      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC - minC;
      const val = (r + g + b) / 3;

      if (sat < 16 && val > 170) {
        const haloFactor = Math.min(1.0, (val - 170) / 70) * ((2.5 - d) / 2.5);
        const darken = 1.0 - haloFactor * 0.75;
        data[pIdx] = Math.round(r * darken);
        data[pIdx + 1] = Math.round(g * darken);
        data[pIdx + 2] = Math.round(b * darken);
      }
    }
  }

  offCtx.putImageData(imgData, 0, 0);
  miniCanvasCache.set(frameIdx, offscreen);
  return offscreen;
}

interface ViceCitySignatureProps {
  className?: string;
}

export const ViceCitySignature: React.FC<ViceCitySignatureProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef<number>(0);

  // Frame drawer for frameless floating mini canvas
  const drawMiniFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cutoutCanvas = getCutoutMiniCanvas(frameIdx);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (cutoutCanvas) {
      ctx.drawImage(cutoutCanvas, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Scroll-Driven Frame Scrubber: NEVER autoplays or loops independently.
  // Maps entire page scroll progress (from top of hero to bottom of page) to 63 frames.
  // Formula: frameIndex = Math.min(62, Math.floor(progress * 63))
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight;
          const winHeight = window.innerHeight;
          const maxScroll = Math.max(1, docHeight - winHeight);

          // Normalized progress across the website (0 to 1)
          const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

          // Exact mathematical mapping: frameIndex = Math.min(62, Math.floor(progress * 63))
          const targetIndex = Math.min(62, Math.floor(progress * 63));

          if (targetIndex !== currentFrameRef.current) {
            currentFrameRef.current = targetIndex;
            drawMiniFrame(targetIndex);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let isCancelled = false;

    // Initial render of Frame 1 (index 0)
    loadMiniFrameImage(0).then(() => {
      if (isCancelled) return;
      drawMiniFrame(0);
      handleScroll();

      // Progressive background preload for remaining 62 mini frames in small batches
      const preloadMiniBatches = async () => {
        const BATCH_SIZE = 4;
        for (let i = 1; i < MINI_TOTAL_FRAMES; i += BATCH_SIZE) {
          if (isCancelled) break;
          const batchPromises: Promise<HTMLImageElement | null>[] = [];
          for (let j = i; j < Math.min(i + BATCH_SIZE, MINI_TOTAL_FRAMES); j++) {
            if (!miniImageCache.has(j)) {
              batchPromises.push(loadMiniFrameImage(j));
            }
          }
          if (batchPromises.length > 0) {
            await Promise.all(batchPromises);
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
        }
      };

      // Slight delay so hero text and initial frame draw immediately
      setTimeout(preloadMiniBatches, 200);
    });

    return () => {
      isCancelled = true;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [drawMiniFrame]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      role="region"
      aria-label="YESH creator signature with scroll-driven miniature 3D portrait"
      className={`fixed bottom-3 left-3 sm:bottom-4 sm:left-5 md:bottom-5 md:left-6 z-30 pointer-events-none select-none flex flex-col items-center group ${className}`}
    >
      {/* ATMOSPHERIC 1980s MIAMI VICE HOT-PINK & CYAN AMBIENT GLOW */}
      <div 
        className="absolute -inset-3 bg-gradient-to-r from-pink-500/15 via-fuchsia-500/10 to-cyan-500/15 blur-2xl rounded-full pointer-events-none transform scale-90 group-hover:scale-105 transition-transform duration-700" 
      />

      {/* =================================================================== */}
      {/* 1. CUSTOM 1980s MIAMI VICE "YESH" WORDMARK                          */}
      {/* Positioned directly ABOVE the mini animation; refined compact scale */}
      {/* =================================================================== */}
      <div className="relative w-[86px] sm:w-[98px] md:w-[108px] lg:w-[118px] aspect-[315/140] pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
        <svg 
          viewBox="0 0 315 140" 
          width="100%" 
          height="100%" 
          className="overflow-visible select-none"
        >
          <defs>
            {/* Neon Hot-Pink Signature Gradient */}
            <linearGradient id="vicePinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3b94" />
              <stop offset="50%" stopColor="#ff007f" />
              <stop offset="100%" stopColor="#e60067" />
            </linearGradient>

            {/* Miami Vice Underline Flourish Gradient (Pink to Cyan) */}
            <linearGradient id="flourishGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff007f" />
              <stop offset="65%" stopColor="#ff2a85" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>

            {/* Specular White Chrome Face Gradient */}
            <linearGradient id="whiteChrome" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#fdf2f8" />
              <stop offset="100%" stopColor="#fce7f3" />
            </linearGradient>

            {/* Sticker Shadow & Ambient Neon Glow Filter */}
            <filter id="viceStickerGlow" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="3.5" dy="4.5" stdDeviation="0" floodColor="#000000" floodOpacity="0.95" />
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ff007f" floodOpacity="0.6" />
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#ff007f" floodOpacity="0.25" />
            </filter>

            {/* Lens Glint Filter */}
            <filter id="glintGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#viceStickerGlow)">
            {/* LAYER 1: Deep Black Dimensional Drop Shadow Silhouette */}
            <g transform="translate(3.5, 4.5)" opacity="0.95">
              <path 
                d={YESH_PATH_D} 
                fill="#000000" 
                stroke="#000000" 
                strokeWidth="15" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
              />
              <path 
                d={FLOURISH_PATH_D} 
                fill="#000000" 
                stroke="#000000" 
                strokeWidth="8" 
                strokeLinejoin="round" 
              />
            </g>

            {/* LAYER 2: Hot-Pink Outer Contour / Neon Sticker Halo */}
            <g>
              <path 
                d={YESH_PATH_D} 
                fill="none" 
                stroke="url(#vicePinkGrad)" 
                strokeWidth="13" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
              />
              <path 
                d={FLOURISH_PATH_D} 
                fill="url(#flourishGrad)" 
                stroke="url(#vicePinkGrad)" 
                strokeWidth="6" 
                strokeLinejoin="round" 
              />
            </g>

            {/* LAYER 3: Thick Solid Black Inner Contour (Clean Sticker Core) */}
            <g>
              <path 
                d={YESH_PATH_D} 
                fill="none" 
                stroke="#050505" 
                strokeWidth="6.5" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
              />
              <path 
                d={FLOURISH_PATH_D} 
                stroke="#050505" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinejoin="round" 
              />
            </g>

            {/* LAYER 4: Brilliant Pure White Face Fill */}
            <g>
              <path 
                d={YESH_PATH_D} 
                fill="url(#whiteChrome)" 
              />
              
              {/* Hot-Pink Sweeping Cursive Underline Flourish */}
              <path 
                d={FLOURISH_PATH_D} 
                fill="url(#flourishGrad)" 
              />
              
              {/* Inner White Specular Highlight Ribbon */}
              <path 
                d={FLOURISH_HIGHLIGHT_D} 
                fill="#ffffff" 
                opacity="0.85" 
              />
            </g>

            {/* LAYER 5: 1980s Miami Starburst Lens Glints */}
            {/* Glint 1: Top hook of 'Y' */}
            <g transform="translate(28, 20)" filter="url(#glintGlow)">
              <path d="M 0,-7 Q 0,0 7,0 Q 0,0 0,7 Q 0,0 -7,0 Q 0,0 0,-7 Z" fill="#ffffff" />
              <circle cx="0" cy="0" r="1.8" fill="#00f0ff" />
            </g>

            {/* Glint 2: Tip of Flourish */}
            <g transform="translate(290, 92)" filter="url(#glintGlow)">
              <path d="M 0,-6 Q 0,0 6,0 Q 0,0 0,6 Q 0,0 -6,0 Q 0,0 0,-6 Z" fill="#ffffff" />
              <circle cx="0" cy="0" r="1.5" fill="#ff66b2" />
            </g>

            {/* Glint 3: Top curve of 'H' */}
            <g transform="translate(262, 17)" filter="url(#glintGlow)">
              <path d="M 0,-5 Q 0,0 5,0 Q 0,0 0,5 Q 0,0 -5,0 Q 0,0 0,-5 Z" fill="#ffffff" />
              <circle cx="0" cy="0" r="1.2" fill="#00f0ff" />
            </g>
          </g>
        </svg>
      </div>

      {/* =================================================================== */}
      {/* 2. FRAMELESS, FLOATING MINI 63-FRAME SCROLL ANIMATION               */}
      {/* Positioned directly underneath YESH; no background card, no frame   */}
      {/* Strictly scroll-driven: maps scroll progress to 63 frames           */}
      {/* =================================================================== */}
      <div className="relative -mt-0.5 flex flex-col items-center justify-center pointer-events-none">
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-[80px] sm:w-[92px] md:w-[102px] lg:w-[110px] aspect-[16/9] object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
        />
      </div>
    </motion.div>
  );
};
