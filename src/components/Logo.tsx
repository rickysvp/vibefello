import React from 'react';

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Elegant "VF" Monogram */}
      <path 
        d="M25 25L50 75L75 25" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M55 45H80" 
        stroke="var(--color-auxiliary)" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
      <path 
        d="M55 25H85" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
    </svg>
  );
};
