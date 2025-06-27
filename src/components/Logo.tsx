import type { ReactNode } from 'react';

export type LogoVariant =
  | 'navbar-dark'       // Dark version for transparent navbar
  | 'navbar-light'      // Light version for fixed/white navbar
  | 'footer'            // Footer version
  | 'favicon'           // Favicon/social media version
  | 'print'             // Version for printing/PDF;

export type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  wrapperClassName?: string;
  children?: ReactNode;
};

/**
 * Logo component that can render different variants of the St. Paul's logo
 */
const Logo = ({
  variant = 'navbar-dark',
  className = '',
  alt = 'St. Paul\'s School Logo',
  width,
  height,
  onClick,
  wrapperClassName = '',
  children
}: LogoProps) => {
  
  // Map variant to file path according to the optimized structure
  const getLogoSrc = (): string => {
    switch (variant) {
      case 'navbar-dark':
        return '/logos-fix/white-outline-h1.png'; // White version for dark backgrounds
      case 'navbar-light':
        return '/logos-fix/black-outline-h1.png'; // Dark version for light backgrounds
      case 'footer':
        return '/logos-fix/white-outline-h2.png'; // Specific version for footer
      case 'favicon':
        return '/logos-fix/solid-color.png'; // Shield only version for favicon/social
      case 'print':
        return '/logos-fix/primary-logo.png'; // High-resolution version for print
      default:
        return '/logos-fix/white-outline-h1.png';
    }
  };

  // Default sizes based on the exact specification
  const getDefaultDimensions = () => {
    switch (variant) {
      case 'navbar-dark':
      case 'navbar-light':
        return { width: 'auto', height: 34 }; // 34px height for navbar logos
      case 'footer':
        return { width: 'auto', height: 52 }; // 52px height for footer logo
      case 'favicon':
        return { width: 32, height: 32 }; // 32px square for favicon
      case 'print':
        return { width: 'auto', height: 80 }; // 80px height for print version
      default:
        return { width: 'auto', height: 34 };
    }
  };

  const { width: defaultWidth, height: defaultHeight } = getDefaultDimensions();

  const logoSrc = getLogoSrc();
  
  const logoImg = (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={`${className}`}
      width={width || defaultWidth}
      height={height || defaultHeight}
    />
  );

  // If click handler is provided, wrap in a button
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={`flex items-center focus:outline-none ${wrapperClassName}`}
        aria-label={alt}
      >
        {logoImg}
        {children}
      </button>
    );
  }

  // Otherwise just return the logo, possibly with a wrapper if children exist
  if (children) {
    return (
      <div className={`flex items-center ${wrapperClassName}`}>
        {logoImg}
        {children}
      </div>
    );
  }

  return logoImg;
};

export default Logo;