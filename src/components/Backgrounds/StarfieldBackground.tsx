"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Minimal prefers-reduced-motion hook (inline so this stays single-file)
 */
function useReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return prefers;
}

type Star = {
  x: number; // CSS px
  y: number; // CSS px
  z: number; // depth/scale
  colorIndex: number; // index into palette
  opacity: number; // fixed per star
};

interface StarfieldBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  /** If provided, overrides palette with a single color */
  starColor?: string;
  /** Base star size in CSS px (scaled by z) */
  starSize?: number;
  /** Fixed number of stars. If omitted, auto-densities with caps. */
  starCount?: number;
  /** Forward velocity (depth) factor, ~0.0003–0.001 feels good */
  speed?: number;
  /** Recompute on resize */
  responsive?: boolean;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  className = "",
  children,
  starColor,
  starSize = 2.25,
  starCount,
  speed = 0.0005,
  responsive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const starsRef = useRef<Star[]>([]);
  const velocityRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, z: speed });
  const pointerRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const dimsRef = useRef<{ cssW: number; cssH: number; scale: number }>({ cssW: 0, cssH: 0, scale: 1 });
  const lastMoveTimeRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const STAR_MIN_SCALE = 0.2;
  const OVERFLOW_THRESHOLD = 50; // CSS px

  const palette = useMemo(
    () =>
      starColor
        ? [starColor]
        : !mounted || resolvedTheme === "dark"
        ? ["#ffffff", "#f9a8d4", "#d8b4fe", "#c4b5fd"] // white + soft tints for dark theme (default)
        : ["#6c63ff", "#8b5cf6", "#a855f7", "#9333ea"], // purple tints for light theme
    [starColor, mounted, resolvedTheme]
  );

  const nowMs = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

  const recycleStar = useCallback((star: Star): Star => {
    const { cssW, cssH } = dimsRef.current;
    const v = velocityRef.current;
    const vx = Math.abs(v.x);
    const vy = Math.abs(v.y);

    // pick an entry direction
    let direction: "z" | "l" | "r" | "t" | "b" = "z";
    if (vx > 1 || vy > 1) {
      if (vx > vy) direction = v.x > 0 ? "l" : "r";
      else direction = v.y > 0 ? "t" : "b";
    }

    const newStar: Star = { ...star };
    newStar.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
    newStar.colorIndex = Math.floor(Math.random() * palette.length);
    newStar.opacity = 0.55 + Math.random() * 0.45;

    switch (direction) {
      case "z":
        newStar.z = 0.12;
        newStar.x = Math.random() * cssW;
        newStar.y = Math.random() * cssH;
        break;
      case "l":
        newStar.x = -OVERFLOW_THRESHOLD;
        newStar.y = cssH * Math.random();
        break;
      case "r":
        newStar.x = cssW + OVERFLOW_THRESHOLD;
        newStar.y = cssH * Math.random();
        break;
      case "t":
        newStar.x = cssW * Math.random();
        newStar.y = -OVERFLOW_THRESHOLD;
        break;
      case "b":
        newStar.x = cssW * Math.random();
        newStar.y = cssH + OVERFLOW_THRESHOLD;
        break;
    }
    return newStar;
  }, [palette.length]);

  const computeCounts = useCallback(
    (cssW: number, cssH: number) => {
      if (typeof starCount === "number") return Math.max(0, starCount);
      // Density by area, safely capped
      const MAX_STARS = 900;
      const MIN_STARS = 180;
      const density = Math.round((cssW * cssH) / 1200); // tune divisor for your taste
      return Math.max(MIN_STARS, Math.min(MAX_STARS, density));
    },
    [starCount]
  );

  const generateStars = useCallback(() => {
    const { cssW, cssH } = dimsRef.current;
    if (!cssW || !cssH) return;
    const count = computeCounts(cssW, cssH);

    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * cssW,
      y: Math.random() * cssH,
      z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
      colorIndex: Math.floor(Math.random() * palette.length),
      opacity: 0.55 + Math.random() * 0.45,
    }));
  }, [computeCounts, palette.length]);

  const updateDimensions = useCallback(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const rect = el.getBoundingClientRect();
    const cssW = Math.max(1, Math.round(rect.width));
    const cssH = Math.max(1, Math.round(rect.height));
    const scale = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    canvas.width = cssW * scale;
    canvas.height = cssH * scale;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    dimsRef.current = { cssW, cssH, scale };

    // rebuild stars on resize for consistent density
    generateStars();
  }, [generateStars]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cssW, cssH, scale } = dimsRef.current;
    const v = velocityRef.current;
    const stars = starsRef.current;

    // draw in CSS pixels; scale the buffer
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    // smooth velocity
    v.tx *= 0.96;
    v.ty *= 0.96;
    v.x += (v.tx - v.x) * 0.8;
    v.y += (v.ty - v.y) * 0.8;

    // --- batched by color ---
    for (let c = 0; c < palette.length; c++) {
      ctx.strokeStyle = palette[c];
      ctx.lineCap = "round";
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (s.colorIndex !== c) continue;

        // update
        s.x += v.x * s.z;
        s.y += v.y * s.z;

        s.x += (s.x - cssW / 2) * v.z * s.z;
        s.y += (s.y - cssH / 2) * v.z * s.z;
        s.z += v.z;

        // recycle out-of-bounds
        if (
          s.x < -OVERFLOW_THRESHOLD ||
          s.x > cssW + OVERFLOW_THRESHOLD ||
          s.y < -OVERFLOW_THRESHOLD ||
          s.y > cssH + OVERFLOW_THRESHOLD
        ) {
          stars[i] = recycleStar(s);
          continue;
        }

        // draw
        let tailX = v.x * 2;
        let tailY = v.y * 2;
        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        ctx.globalAlpha = s.opacity;
        ctx.lineWidth = Math.max(0.5, starSize * s.z);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + tailX, s.y + tailY);
        ctx.stroke();
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [palette, recycleStar, starSize]);

  const movePointer = useCallback((x: number, y: number, isTouch: boolean) => {
    const t = nowMs();
    if (t - lastMoveTimeRef.current < 16) return; // ~60fps throttle
    lastMoveTimeRef.current = t;

    const p = pointerRef.current;
    const v = velocityRef.current;

    if (p.x !== null && p.y !== null) {
      const ox = x - p.x;
      const oy = y - p.y;
      const damp = isTouch ? 0.2 : -0.2;
      v.tx += (ox / 40) * damp;
      v.ty += (oy / 40) * damp;
    }

    p.x = x;
    p.y = y;
  }, []);

  // pointer events scoped to container (passive)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => movePointer(e.clientX, e.clientY, e.pointerType === "touch");
    const onLeave = () => (pointerRef.current = { x: null, y: null });

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [movePointer]);

  // init & resize
  useEffect(() => {
    updateDimensions();
    if (!prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      // render a single static frame for reduced motion
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const { cssW, cssH, scale } = dimsRef.current;
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, cssW, cssH);
        for (const s of starsRef.current) {
          ctx.globalAlpha = s.opacity;
          ctx.strokeStyle = palette[s.colorIndex];
          ctx.lineCap = "round";
          ctx.lineWidth = Math.max(0.5, starSize * s.z);
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + 0.5, s.y + 0.5);
          ctx.stroke();
        }
      }
    }

    const onResize = () => {
      if (!responsive) return;
      updateDimensions();
    };
    if (responsive) window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (responsive) window.removeEventListener("resize", onResize);
    };
  }, [animate, palette, prefersReducedMotion, responsive, starSize, updateDimensions]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Soft gradient backdrop (cheap, static) */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: "none",
          background:
            mounted && resolvedTheme === "light"
              ? "radial-gradient(ellipse at top right, rgba(108,0,167,0.06), transparent 70%)," +
                "radial-gradient(ellipse at bottom left, rgba(232,121,249,0.04), transparent 70%)," +
                "radial-gradient(circle at 60% 30%, rgba(76,29,149,0.05), transparent 50%)," +
                "#f4f2ff"
              : "radial-gradient(ellipse at top right, rgba(108,0,167,0.08), transparent 70%)," +
                "radial-gradient(ellipse at bottom left, rgba(232,121,249,0.05), transparent 70%)," +
                "radial-gradient(circle at 60% 30%, rgba(76,29,149,0.07), transparent 50%)," +
                "#171c28",
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "none" }}
        aria-hidden
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default StarfieldBackground;
