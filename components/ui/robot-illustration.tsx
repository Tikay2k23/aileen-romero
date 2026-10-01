"use client";

import { useEffect, useRef } from "react";

// A flat drawing of the robot from robot-hero-scene.tsx, for browsers that can't run WebGL. Like the 3D
// version, it blinks and turns toward the cursor, carrying its speech bubble along.

const STYLES = `
  .robot-illustration { --look-x: 0; --look-y: 0; }
  .robot-illustration .robot-follow {
    transform: translate(calc(var(--look-x) * 12vw), 0);
    transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .robot-illustration .robot-bob { animation: robot-bob 4s ease-in-out infinite; }
  .robot-illustration .robot-head {
    transform-box: fill-box; transform-origin: 50% 100%;
    transform: rotate(calc(var(--look-x) * 7deg)) translate(calc(var(--look-x) * 2px), calc(var(--look-y) * 2px));
    transition: transform 0.6s ease-out;
  }
  .robot-illustration .robot-eyes {
    transform-box: fill-box; transform-origin: center;
    transform: translate(calc(var(--look-x) * 6px), calc(var(--look-y) * 3px));
    transition: transform 0.4s ease-out;
  }
  .robot-illustration .robot-eye { transform-box: fill-box; transform-origin: center; animation: robot-blink 3s infinite; }
  .robot-illustration .robot-visor { opacity: 0.85; }
  @keyframes robot-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  @keyframes robot-blink { 0%, 86%, 100% { transform: scaleY(1); } 90% { transform: scaleY(0.1); } }
  @media (prefers-reduced-motion: reduce) {
    .robot-illustration .robot-bob, .robot-illustration .robot-eye { animation: none; }
  }
`;

// One bracket-shaped eye, like the 3D robot's: an open-sided rounded rectangle
function Eye({ x }: { x: number }) {
  const top = 70;
  const w = 11;
  const h = 19;
  const r = 4.5;
  const gap = 2;
  return (
    <g className="robot-eye">
      <path
        d={`M${x} ${top + h / 2 - gap} V${top + r} Q${x} ${top} ${x + r} ${top} H${x + w - r} Q${x + w} ${top} ${x + w} ${top + r} V${top + h / 2 - gap}`}
      />
      <path
        d={`M${x} ${top + h / 2 + gap} V${top + h - r} Q${x} ${top + h} ${x + r} ${top + h} H${x + w - r} Q${x + w} ${top + h} ${x + w} ${top + h - r} V${top + h / 2 + gap}`}
      />
    </g>
  );
}

export function RobotIllustration({ bubble }: { bubble?: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Turn toward the cursor, like the 3D robot (skipped for visitors who prefer reduced motion)
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--look-x", ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty("--look-y", ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="robot-illustration pointer-events-none absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="robot-follow relative">
        {/* The speech bubble, anchored just above the antennas */}
        <div className="pointer-events-auto absolute top-[16%] left-1/2">{bubble}</div>

        {/* Sized like the 3D robot: about a quarter of the screen width, never tiny on phones */}
        <svg viewBox="0 0 200 260" aria-hidden className="robot-bob h-auto w-[clamp(9rem,26vw,22rem)] overflow-visible">
          <defs>
            <radialGradient id="robot-body" cx="38%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#f5f5f5" />
              <stop offset="55%" stopColor="#c8c8c8" />
              <stop offset="100%" stopColor="#8a8a8a" />
            </radialGradient>
            <radialGradient id="robot-head" cx="38%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#3b3b3b" />
              <stop offset="55%" stopColor="#121212" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>
            {/* The glass visor: clear in the middle, cyan at the rim */}
            <radialGradient id="robot-visor" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor="#00ffc6" stopOpacity="0" />
              <stop offset="94%" stopColor="#00ffc6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00ffc6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="robot-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            {/* Dark flecks over the body, like the 3D robot's speckled texture */}
            <filter id="robot-speckle" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="4" />
              {/* Keep only the noise peaks, as small dark dots */}
              <feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.12  0 0 0 0 0.12  0 0 0 18 -12.6" />
            </filter>
            <filter id="robot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="robot-body-clip">
              <circle cx="100" cy="178" r="62" />
            </clipPath>
          </defs>

          {/* Contact shadow */}
          <ellipse cx="100" cy="248" rx="78" ry="10" fill="url(#robot-shadow)" />

          {/* Body with its speckles, then the neck ring */}
          <circle cx="100" cy="178" r="62" fill="url(#robot-body)" />
          <rect
            x="38"
            y="116"
            width="124"
            height="124"
            filter="url(#robot-speckle)"
            clipPath="url(#robot-body-clip)"
            opacity="0.55"
          />
          <ellipse cx="100" cy="121" rx="45" ry="9" fill="#d6d6d6" />
          <ellipse cx="100" cy="118" rx="40" ry="6" fill="#9f9f9f" />

          <g className="robot-head">
            {/* Antennas and ears */}
            <g stroke="#cfcfcf" strokeWidth="1.6" strokeLinecap="round">
              <line x1="57" y1="76" x2="59" y2="48" />
              <line x1="143" y1="76" x2="141" y2="48" />
            </g>
            <circle cx="59" cy="47" r="2.4" fill="#ff3366" />
            <circle cx="141" cy="47" r="2.4" fill="#ff3366" />
            <ellipse cx="56" cy="82" rx="4.5" ry="10" fill="#f0f0f0" stroke="#bdbdbd" strokeWidth="1" />
            <ellipse cx="144" cy="82" rx="4.5" ry="10" fill="#f0f0f0" stroke="#bdbdbd" strokeWidth="1" />

            {/* Head and glowing visor */}
            <circle cx="100" cy="82" r="42" fill="url(#robot-head)" />
            <circle className="robot-visor" cx="100" cy="82" r="47" fill="url(#robot-visor)" />

            <g
              className="robot-eyes"
              fill="none"
              stroke="#f4fffd"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#robot-glow)"
            >
              <Eye x={82} />
              <Eye x={107} />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
