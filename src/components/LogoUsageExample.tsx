import { useState, useEffect } from 'react';
import StPaulsLogo from './StPaulsLogo';
import { AccreditationGrid } from './AccreditationLogos';

/**
 * Example component demonstrating how to use the StPaulsLogo component 
 * in different contexts throughout the site
 */
const LogoUsageExample = () => {
  // State to track scroll position for header logo switching
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="space-y-16">
      {/* Example 1: Header Usage */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-2xl font-bold mb-4">1. Header Logo Usage</h2>
        <div className={`flex items-center justify-between p-4 ${scrolled ? 'bg-white text-blue-900' : 'bg-blue-900 text-white'} transition-colors duration-300`}>
          <a href="/" className="flex items-center">
            <StPaulsLogo
              variant="header"
              isScrolled={scrolled}
              className="transition-all duration-300"
            />
          </a>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="px-3 py-2">About Us</a>
            <a href="#" className="px-3 py-2">Admissions</a>
            <a href="#" className="px-3 py-2">Academic</a>
          </div>
          <div className="block md:hidden">
            <StPaulsLogo
              variant="header-mobile"
              isScrolled={scrolled}
              className="transition-all duration-300"
            />
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p>This example shows how the header logo automatically changes from white to dark variant based on scroll position.</p>
          <p><strong>Try scrolling this page</strong> to see how the header logo above changes.</p>
        </div>
      </section>

      {/* Example 2: Footer Usage */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-2xl font-bold mb-4">2. Footer Logo Usage</h2>
        <div className="bg-blue-900 text-white p-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <StPaulsLogo
              variant="footer"
            >
              <div className="ml-3">
                <span className="text-xl font-bold block">St. Paul's</span>
                <span className="text-sm text-orange-300">British School São Paulo</span>
              </div>
            </StPaulsLogo>
            <div className="md:ml-auto mt-4 md:mt-0 text-sm">
              <p>Rua Juquiá, 166, Jardim Paulistano</p>
              <p>São Paulo, SP, 01440-903, Brazil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example 3: Shield Only Usage */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-2xl font-bold mb-4">3. Shield Logo Usage</h2>
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="bg-blue-900 p-4 rounded-lg inline-block">
              <StPaulsLogo variant="shield" />
            </div>
            <p className="mt-2 text-sm">Shield (Dark Background)</p>
          </div>
          <div className="text-center">
            <div className="bg-white border border-gray-200 p-4 rounded-lg inline-block">
              <StPaulsLogo variant="shield" />
            </div>
            <p className="mt-2 text-sm">Shield (Light Background)</p>
          </div>
          <div className="text-center">
            <div className="p-4 rounded-lg inline-block">
              <StPaulsLogo variant="shield-color" />
            </div>
            <p className="mt-2 text-sm">Color Shield (Favicon)</p>
          </div>
        </div>
      </section>

      {/* Example 4: Favicon & Meta Tags */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-2xl font-bold mb-4">4. Favicon & Meta Tags</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <code className="text-sm block mb-2">{'<link rel="icon" type="image/png" href="/logos-fix/solid-color.png" sizes="32x32" />'}</code>
          <code className="text-sm block mb-2">{'<meta property="og:image" content="/logos-fix/solid-color.png" />'}</code>
        </div>
      </section>

      {/* Example 5: Print Version */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-2xl font-bold mb-4">5. Print Version</h2>
        <div className="flex justify-center bg-white p-8 border border-gray-200 rounded-lg">
          <StPaulsLogo variant="print" />
        </div>
        <p className="mt-2 text-sm text-center">High resolution logo for PDF documents and printing</p>
      </section>

      {/* Example 6: Accreditation Logos */}
      <section>
        <h2 className="text-2xl font-bold mb-4">6. Accreditation Logos</h2>
        <p className="mb-4">These logos represent the school's various accreditations and memberships:</p>
        <AccreditationGrid />
      </section>
    </div>
  );
};

export default LogoUsageExample;