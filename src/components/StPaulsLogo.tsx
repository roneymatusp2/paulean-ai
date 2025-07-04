import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type LogoVariant = 
  | 'header'           // Logo for the main header (official SVG with name)
  | 'header-mobile'    // Mobile header version (shield only)
  | 'footer'           // Footer version
  | 'shield'           // Just the shield icon for small spaces
  | 'shield-color'     // Colored shield for favicon/social
  | 'print'            // High-res for print
  | 'accreditation';   // For accreditation badges

interface StPaulsLogoProps {
  variant?: LogoVariant;
  className?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  wrapperClassName?: string;
  children?: ReactNode;
  isScrolled?: boolean; // For dynamic header behavior
}

/**
 * StPaulsLogo component that replicates the St. Paul's School branding system
 * Based on official website: https://www.stpauls.br/
 */
const StPaulsLogo = ({
  variant = 'header',
  className = '',
  alt = 'St. Paul\'s School Logo',
  width,
  height,
  onClick,
  wrapperClassName = '',
  children,
  isScrolled = false
}: StPaulsLogoProps) => {
  
  // For handling system/user theme preference
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // System theme detection
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeQuery.addEventListener('change', handleThemeChange);
    return () => darkModeQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Get the logo path based on variant and current state
  const getLogoSrc = (): string => {
    // Special case for header that changes on scroll state
    if (variant === 'header') {
      if (isScrolled) {
        // Dark logo on light background when scrolled
        return '/logos-fix/black-outline-h1.png';
      } else {
        // Light logo on dark/transparent background
        return '/logos-fix/white-outline-h1.png';
      }
    }

    // Special case for shield that adapts to system theme
    if (variant === 'shield') {
      return isDarkMode
        ? '/logos-fix/white-outline.png'  // Light shield on dark mode
        : '/logos-fix/black-outline.png'; // Dark shield on light mode
    }

    // Standard variants
    switch (variant) {
      case 'header-mobile':
        return isScrolled
          ? '/logos-fix/black-outline.png'
          : '/logos-fix/white-outline.png';
      case 'footer':
        return '/logos-fix/white-outline-h2.png';
      case 'shield-color':
        return '/logos-fix/solid-color.png';
      case 'print':
        return '/logos-fix/primary-logo.png';
      case 'accreditation':
        return '/logos-fix/primary-logo.png';
      default:
        return '/logos-fix/white-outline-h1.png';
    }
  };

  // Default dimensions based on the exact specification from original site
  const getDefaultDimensions = () => {
    switch (variant) {
      case 'header':
        return { width: 'auto', height: 40 }; // Standard header logo height
      case 'header-mobile':
        return { width: 'auto', height: 32 }; // Mobile header logo height
      case 'footer':
        return { width: 'auto', height: 52 }; // Footer logo has larger height
      case 'shield':
      case 'shield-color':
        return { width: 32, height: 32 }; // Square shield icon
      case 'print':
        return { width: 'auto', height: 80 }; // Larger for print
      case 'accreditation':
        return { width: 120, height: 'auto' }; // Standard size for partner logos
      default:
        return { width: 'auto', height: 40 };
    }
  };

  const { width: defaultWidth, height: defaultHeight } = getDefaultDimensions();
  
  const logoSrc = getLogoSrc();
  
  // Create the img element
  const logoImg = (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={`${className}`}
      width={width || defaultWidth}
      height={height || defaultHeight}
    />
  );

  // Conditional rendering based on click handler and children
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

export default StPaulsLogo;