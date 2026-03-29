import React from 'react';

interface VibeLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const VibeLogo: React.FC<VibeLogoProps> = ({ 
  className = "h-10", 
  iconOnly = false 
}) => (
  <div className={`flex items-center ${!iconOnly ? 'group cursor-pointer' : ''}`}>
    <img 
      src="/logo_light.png" 
      alt="VibeFello" 
      className={`${className} object-contain`}
    />
  </div>
);

export default VibeLogo;
