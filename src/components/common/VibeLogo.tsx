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
    <img 
      src="/logo_light.png" 
      alt="VibeFello" 
      className={`${className} object-contain`}
    />
    {!iconOnly && (
      <span className="font-black text-xl tracking-tighter text-vibe-primary vibe-glow-text">
        VIBE<span className="text-vibe-accent">FELLO</span>
      </span>
    )}
  </div>
);

export default VibeLogo;
