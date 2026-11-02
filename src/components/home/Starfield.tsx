'use client';

import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import styles from './Starfield.module.css';

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
}

export interface StarfieldHandle {
  triggerWarp: (durationMs?: number) => Promise<void>;
}

const STAR_COUNT = 400;
const STAR_COUNT_MOBILE = 200;
const MAX_Z = 1000;
const BASE_SPEED = 0.5;
const WARP_SPEED = 20;
const FOCAL_LENGTH = 250;
const MAX_RADIUS = 3;

function createStar(): Star {
  return {
    x: (Math.random() - 0.5) * 2000,
    y: (Math.random() - 0.5) * 2000,
    z: Math.random() * MAX_Z,
    prevZ: MAX_Z,
  };
}

export const Starfield = forwardRef<StarfieldHandle>(
  (_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const speedRef = useRef(BASE_SPEED);
    const isWarpingRef = useRef(false);
    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const warpGenRef = useRef(0);
    const reducedMotionRef = useRef(false);

    // Expose warp trigger via ref
    useImperativeHandle(ref, () => ({
      triggerWarp: (durationMs = 1500) => {
        // Reduced motion: no warp streaks, no speed ramp — resolve immediately.
        if (reducedMotionRef.current) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const gen = ++warpGenRef.current; // cancel any previous warp
          isWarpingRef.current = true;

          // Ramp up speed
          const rampUp = () => {
            if (gen !== warpGenRef.current) return; // stale, abort
            if (speedRef.current < WARP_SPEED) {
              speedRef.current = Math.min(speedRef.current + 1.5, WARP_SPEED);
              requestAnimationFrame(rampUp);
            }
          };
          rampUp();

          // After duration, ramp down and resolve
          setTimeout(() => {
            if (gen !== warpGenRef.current) { resolve(); return; } // stale, abort
            const rampDown = () => {
              if (gen !== warpGenRef.current) { resolve(); return; } // stale, abort
              if (speedRef.current > BASE_SPEED) {
                speedRef.current = Math.max(speedRef.current - 1, BASE_SPEED);
                requestAnimationFrame(rampDown);
              } else {
                isWarpingRef.current = false;
                resolve();
              }
            };
            rampDown();
          }, durationMs);
        });
      },
    }));

    const initStars = useCallback((count: number) => {
      starsRef.current = Array.from({ length: count }, createStar);
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      reducedMotionRef.current = mediaQuery.matches;
      const onMotionPreferenceChange = (e: MediaQueryListEvent) => {
        reducedMotionRef.current = e.matches;
        if (e.matches) {
          cancelAnimationFrame(animationRef.current);
        } else {
          lastTimeRef.current = 0;
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      mediaQuery.addEventListener('change', onMotionPreferenceChange);

      // Size canvas to window
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // A resize clears the canvas; with reduced motion there is no loop to
        // repaint it, so draw one static frame.
        if (reducedMotionRef.current) {
          requestAnimationFrame(animate);
        }
      };
      resize();

      // Init stars based on screen size
      const isMobile = window.innerWidth < 768;
      initStars(isMobile ? STAR_COUNT_MOBILE : STAR_COUNT);

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(document.documentElement);

      const animate = (time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        const delta = Math.min((time - lastTimeRef.current) / 16.667, 3); // cap at 3x normal
        lastTimeRef.current = time;

        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const reduced = reducedMotionRef.current;
        const speed = reduced ? 0 : speedRef.current;
        const isWarping = !reduced && (isWarpingRef.current || speed > BASE_SPEED * 2);

        // Clear with near-black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        // Subtle radial vignette
        const vignette = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);

        for (const star of starsRef.current) {
          star.prevZ = star.z;
          star.z -= speed * delta;

          // Recycle star if past camera or off-screen
          if (star.z <= 1) {
            star.x = (Math.random() - 0.5) * 2000;
            star.y = (Math.random() - 0.5) * 2000;
            star.z = MAX_Z;
            star.prevZ = MAX_Z;
            continue;
          }

          // Project to 2D
          const screenX = (star.x / star.z) * FOCAL_LENGTH + cx;
          const screenY = (star.y / star.z) * FOCAL_LENGTH + cy;

          // Skip off-screen
          if (screenX < -10 || screenX > w + 10 || screenY < -10 || screenY > h + 10) {
            continue;
          }

          // Size and brightness based on depth
          const depthRatio = 1 - star.z / MAX_Z;
          const radius = Math.max(0.3, MAX_RADIUS * depthRatio);
          const brightness = Math.min(1, depthRatio * 1.5);

          if (isWarping && speed > 2) {
            // Streak rendering: draw line from previous position to current
            const prevScreenX = (star.x / star.prevZ) * FOCAL_LENGTH + cx;
            const prevScreenY = (star.y / star.prevZ) * FOCAL_LENGTH + cy;

            const streakAlpha = Math.min(brightness * 0.8, 0.9);
            ctx.strokeStyle = `rgba(189, 118, 74, ${streakAlpha})`;
            ctx.lineWidth = Math.max(0.5, radius * 0.6);
            ctx.beginPath();
            ctx.moveTo(prevScreenX, prevScreenY);
            ctx.lineTo(screenX, screenY);
            ctx.stroke();
          }

          // Draw star dot
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 165, 116, ${brightness})`;
          ctx.fill();

          // Glow for closer/brighter stars
          if (radius > 1.5) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(119, 126, 95, ${brightness * 0.2})`;
            ctx.fill();
          }
        }

        // Reduced motion: this frame was a one-off static paint — don't loop.
        if (!reduced) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationRef.current);
        resizeObserver.disconnect();
        mediaQuery.removeEventListener('change', onMotionPreferenceChange);
      };
    }, [initStars]);

    return (
      <div className={styles.starfieldContainer}>
        <canvas ref={canvasRef} className={styles.starCanvas} />
      </div>
    );
  }
);

Starfield.displayName = 'Starfield';
