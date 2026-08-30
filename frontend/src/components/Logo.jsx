import React from "react";

export function LogoIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="cyberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="cyberGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00ff9d" />
          <stop offset="100%" stopColor="#00f0ff" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hexagonal Cyber Outer Frame */}
      <path
        d="M20 3L35 11.5V28.5L20 37L5 28.5V11.5L20 3Z"
        stroke="url(#cyberGrad1)"
        strokeWidth="2"
        fill="#080c16"
        fillOpacity="0.8"
        filter="url(#glow)"
      />

      {/* Inner Tech Core / Terminal Glyph */}
      <path
        d="M14 15L9 20L14 25"
        stroke="#00f0ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 15L31 20L26 25"
        stroke="#00ff9d"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 13L18 27"
        stroke="url(#cyberGrad1)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Pulsing Core Node Dot */}
      <circle cx="20" cy="20" r="1.5" fill="#00f0ff" filter="url(#glow)" />
    </svg>
  );
}

function Logo({ size = "md", subtitle = "OS.v2", showSubtitle = true, className = "" }) {
  const iconSize = size === "sm" ? 22 : size === "lg" ? 34 : 28;
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base sm:text-lg" : "text-sm";

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      <div className="relative flex items-center justify-center transition-transform group-hover:scale-105">
        <LogoIcon size={iconSize} />
      </div>
      <div className="flex flex-col">
        <span className={`font-display font-extrabold tracking-wider text-white uppercase ${textSize} flex items-center gap-1.5`}>
          COURSE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">SHIP</span>
          {showSubtitle && (
            <span className="text-[9px] font-mono text-cyan-400 border border-cyan-500/30 px-1 py-0.2 rounded bg-cyan-950/60 tracking-normal font-normal">
              {subtitle}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default Logo;
