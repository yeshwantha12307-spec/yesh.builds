import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  withGlow?: boolean;
  animated?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = true,
  animated = false,
}) => {
  // Determine pixel dimension
  let dim = 36;
  if (typeof size === 'number') {
    dim = size;
  } else {
    switch (size) {
      case 'sm':
        dim = 28;
        break;
      case 'md':
        dim = 38;
        break;
      case 'lg':
        dim = 60;
        break;
      case 'xl':
        dim = 96;
        break;
    }
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        animated ? 'transition-transform duration-300 hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{ width: `${dim}px`, height: `${dim}px` }}
      aria-label="Yeshwanth Brand Emblem"
    >
      {/* Soft Ambient Gold/Amber Rim Glow */}
      {withGlow && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/25 to-red-500/20 blur-md pointer-events-none transform -translate-y-0.5"
          aria-hidden="true"
        />
      )}

      {/* Official 3D Metallic Red-and-Gold Y Emblem */}
      <img
        src="/brand/y_emblem.png"
        alt="Yeshwanth Akbar Official 3D Y Logo"
        width={dim}
        height={dim}
        className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        loading="eager"
      />
    </div>
  );
};
