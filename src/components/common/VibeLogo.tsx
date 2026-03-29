import React from 'react';

interface VibeLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const VibeLogo: React.FC<VibeLogoProps> = ({ 
  className = "w-9 h-9", 
  iconOnly = false 
}) => (
  <div className={`flex items-center gap-3 ${!iconOnly ? 'group cursor-pointer' : ''}`}>
    <div className={`${className} bg-vibe-primary rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg shadow-vibe-primary/20 border border-slate-800 group-hover:shadow-vibe-accent/20 transition-shadow duration-300`}>
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-vibe-accent/10 to-transparent" />
      
      {/* Clean Geometric V */}
      <svg 
        viewBox="0 0 40 40" 
        className="w-1/2 h-1/2 relative z-10"
        fill="none"
      >
        {/* Main V - sharp geometric */}
        <path 
          d="M10 10 L20 30 L30 10"
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Top horizontal bar */}
        <line x1="8" y1="10" x2="14" y2="10" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="square" />
        <line x1="26" y1="10" x2="32" y2="10" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="square" />
      </svg>
    </div>
    {!iconOnly && (
      <span className="font-black text-xl tracking-tighter text-vibe-primary vibe-glow-text">
        VIBE<span className="text-vibe-accent">FELLO</span>
      </span>
    )}
  </div>
);

export default VibeLogo;
