import { useEffect, useState } from 'react';

export type LogoVariant = 
  | 'primary'      // Main logo - Primary color on white
  | 'dark'         // Dark version - Used on light backgrounds
  | 'light'        // Light version - Used on dark backgrounds  
  | 'shield'       // Shield only - Used for small spaces
  | 'print';       // Print version - High-res for PDF/printing

interface LogoSwitcherProps {
  variant?: LogoVariant;
  className?: string;
  alt?: string;
  useSystemTheme?: boolean; // Auto-detect system theme
  isScrolled?: boolean;     // For scroll-based switching (headers)
}

/**
 * LogoSwitcher component that intelligently selects the correct logo variant
 * based on theme, scrolling, and other criteria
 */
const LogoSwitcher: React.FC<LogoSwitcherProps> = ({
  variant = 'primary',
  className = '',
  alt = 'St. Paul\'s School Logo',
  useSystemTheme = false,
  isScrolled = false
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // System theme detection effect
  useEffect(() => {
    if (!useSystemTheme) return;
    
    // Check for system dark mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    // Set up listener for theme changes
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeQuery.addEventListener('change', handleThemeChange);
    return () => darkModeQuery.removeEventListener('change', handleThemeChange);
  }, [useSystemTheme]);

  // Determine which logo file to use based on variant, theme and scroll state
  const getLogoSrc = (): string => {
    // Handle scroll-based switching for nav headers
    if (isScrolled) {
      return '/logos-fix/black-outline-h1.png'; // Dark on light for scrolled headers
    }
    
    // Switch based on variant
    switch (variant) {
      case 'primary':
        return '/logos-fix/primary-logo.png';
      case 'dark':
        return '/logos-fix/black-outline-h1.png';
      case 'light':
        return '/logos-fix/white-outline-h1.png';
      case 'shield':
        return isDarkMode 
          ? '/logos-fix/white-outline.png' 
          : '/logos-fix/black-outline.png';
      case 'print':
        return '/logos-fix/primary-logo.png';
      default:
        return '/logos-fix/primary-logo.png';
    }
  };

  // Get appropriate size based on variant
  const getSizeClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'h-16 w-auto';
      case 'dark':
      case 'light':
        return 'h-12 w-auto';
      case 'shield':
        return 'h-10 w-auto';
      case 'print':
        return 'h-24 w-auto';
      default:
        return 'h-12 w-auto';
    }
  };

  const logoSrc = getLogoSrc();
  const sizeClasses = getSizeClasses();
  
  return (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={`${sizeClasses} ${className}`}
    />
  );
};

export default LogoSwitcher;