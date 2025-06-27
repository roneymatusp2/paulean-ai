import { useState, useEffect } from 'react';
import whiteLogo from '../assets/white-logo.png';
import darkLogo from '../assets/dark-logo.png';
import whiteOutline from '../assets/white-outline.png';
import blackOutline from '../assets/black-outline.png';

type DropdownItem = {
  label: string;
  url: string;
  children?: DropdownItem[];
};

type MenuItem = {
  label: string;
  url: string;
  dropdown?: DropdownItem[];
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
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

  const menuItems: MenuItem[] = [
    {
      label: 'About us',
      url: '#about',
      dropdown: [
        { label: 'Why St. Paul\'s', url: '#why-st-pauls' },
        { label: 'Our History', url: '#history' },
        { label: 'Our Leadership', url: '#leadership' },
        { label: 'Our Governors', url: '#governors' },
        { label: 'Accreditations', url: '#accreditations' },
        { label: 'St. Paul\'s Education Conference', url: '#conference' },
        { label: 'Work with us', url: '#work-with-us' },
      ]
    },
    {
      label: 'Admissions',
      url: '#admissions',
      dropdown: [
        { label: 'How to apply', url: '#how-to-apply' },
        { label: 'Admissions calendar', url: '#admissions-calendar' },
        { label: 'Open Morning', url: '#open-morning' },
        { label: 'Contact form international families', url: '#international-families' },
        { label: 'Scholarship Programme', url: '#scholarship' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Bursary fund', url: '#bursary-fund' },
      ]
    },
    {
      label: 'Academic',
      url: '#academic',
      dropdown: [
        { label: 'Learning ethos', url: '#learning-ethos' },
        { label: 'Curriculum', url: '#curriculum' },
        { label: 'Digital learning', url: '#digital-learning' },
        { label: 'University Guidance & Careers', url: '#university-guidance' },
      ]
    },
    {
      label: 'School life',
      url: '#school-life',
      dropdown: [
        { label: 'Junior School', url: '#junior-school' },
        { label: 'Senior School', url: '#senior-school' },
        { label: 'Enrichment', url: '#enrichment' },
        { label: 'Pupils\' well-being', url: '#well-being' },
        { label: 'Policies & Documents', url: '#policies' },
        { label: 'Calendar & Term Dates', url: '#calendar' },
        { label: 'Community', url: '#community' },
      ]
    },
    {
      label: 'The Paulean',
      url: '#paulean',
    },
    {
      label: 'Alumni',
      url: '#alumni',
      dropdown: [
        { label: 'The Old Paulean', url: '#old-paulean' },
      ]
    },
    {
      label: 'Contact us',
      url: '#contact',
    }
  ];

  const utilityLinks = [
    { label: 'Staff portal', url: '#portal', external: true },
    { label: 'Webmail', url: '#webmail', external: true },
    { label: 'Term dates', url: '#term-dates' },
    { label: 'Admissions', url: '#admissions' },
    { label: 'Work with us', url: '#work-with-us', buttonStyle: true }
  ];

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  return (
    <div>
      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 bg-primary-darkgray/90 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto h-full flex flex-col">
          {/* Mobile menu header */}
          <div className="flex justify-between items-center py-4 border-b border-white/20">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <img 
                  src={whiteOutline}
                  alt="St. Paul's School Logo"
                  className="h-[50px] w-auto mr-2"
                />
              </a>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-white hover:text-secondary-coral"
              aria-label="Close menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="py-4 border-b border-white/20">
            <div className="relative">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full py-3 px-4 pr-10 bg-white/10 text-primary-white placeholder-white/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-coral"
              />
              <button
                className="absolute right-3 top-3 text-primary-white"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="text-primary-white divide-y divide-white/10">
              {menuItems.map((item, index) => (
                <li key={index} className="py-2">
                  <div
                    className="flex justify-between items-center px-2 py-2"
                    onClick={() => item.dropdown && toggleDropdown(item.label)}
                  >
                    <a href={item.url} className="text-lg font-semibold hover:text-secondary-coral">
                      {item.label}
                    </a>
                    {item.dropdown && (
                      <button
                        aria-expanded={activeDropdown === item.label}
                        className="expander p-2"
                        aria-label={`toggle ${item.label} section`}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="mt-2 ml-4 space-y-2">
                      {item.dropdown.map((dropdownItem, idx) => (
                        <a
                          key={idx}
                          href={dropdownItem.url}
                          className="block px-4 py-2 text-primary-white/80 hover:text-secondary-coral"
                        >
                          {dropdownItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile utility links */}
          <div className="py-4 border-t border-white/20">
            <ul className="flex flex-col space-y-3">
              {utilityLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className={`block px-2 py-2 ${link.buttonStyle
                      ? 'bg-primary-red text-primary-white rounded-md text-center'
                      : 'text-primary-white/80 hover:text-secondary-coral'}`}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                    {link.external && <span className="sr-only">(opens in new window/tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={`fixed inset-0 bg-primary-darkgray/90 z-50 transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto h-full flex flex-col justify-center items-center">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full py-4 px-6 pr-12 bg-white/10 text-white text-xl placeholder-white/50 border-b-2 border-white/30 focus:outline-none focus:border-secondary-coral"
              autoFocus={isSearchOpen}
            />
            <button
              className="absolute right-2 top-4 text-primary-white"
              aria-label="Search"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-6 right-6 text-primary-white hover:text-secondary-coral"
            aria-label="Close search"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40">
        {/* Top bar - vermelho quando não rolado, branco quando rolado */}
        <div className={`${scrolled ? 'bg-primary-white' : 'bg-primary-red'} transition-colors duration-300 navbar-top py-3`}>
          <div className="container mx-auto px-4">
            {/* Header top */}
            <div className="flex justify-between items-center h-full">
              {/* Logo container */}
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <div className="hidden sm:block">
                    <img 
                      src={scrolled ? darkLogo : whiteLogo}
                      alt="St. Paul's School Logo"
                      className="h-[70px] w-auto transition-all duration-300"
                    />
                  </div>
                  <div className="block sm:hidden">
                    <img 
                      src={scrolled ? blackOutline : whiteOutline}
                      alt="St. Paul's School Logo"
                      className="h-[50px] w-auto transition-all duration-300"
                    />
                  </div>
                </a>
              </div>

              {/* Header inner right */}
              <div className="flex items-center space-x-4">
                {/* Utility navigation */}
                <nav className="hidden lg:block">
                  <ul className="flex items-center space-x-4">
                    <li className="relative group">
                      <button className={`${scrolled ? 'text-primary-darkgray hover:text-primary-red' : 'text-primary-white hover:text-primary-white/80'} px-2 py-1 flex items-center text-sm font-medium`}>
                        Utility Links
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-primary-white shadow-dropdown rounded overflow-hidden hidden group-hover:block navbar-dropdown">
                        <ul>
                          {utilityLinks.map((link, idx) => (
                            !link.buttonStyle && (
                              <li key={idx}>
                                <a
                                  href={link.url}
                                  className="navbar-dropdown-item"
                                  target={link.external ? "_blank" : undefined}
                                  rel={link.external ? "noopener noreferrer" : undefined}
                                >
                                  {link.label}
                                  {link.external && <span className="sr-only">(opens in new window/tab)</span>}
                                </a>
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    </li>
                    {utilityLinks.map((link, idx) => (
                      link.buttonStyle && (
                        <li key={idx} className="button-style">
                          <a
                            href={link.url}
                            className={`navbar-utility-button ${scrolled ? 'bg-primary-red text-primary-white' : 'bg-primary-white text-primary-red'}`}
                          >
                            {link.label}
                          </a>
                        </li>
                      )
                    ))}
                  </ul>
                </nav>

                {/* Search container */}
                <div className="hidden lg:block">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className={`p-2 ${scrolled ? 'text-primary-darkgray hover:text-primary-red' : 'text-primary-white hover:text-primary-white/80'}`}
                    aria-label="Open search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>

                {/* Mobile menu trigger */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setIsOpen(true)}
                    className={`p-2 ${scrolled ? 'text-primary-darkgray hover:text-primary-red' : 'text-primary-white hover:text-primary-white/80'} mobile-toggle`}
                    aria-label="Open menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation - sempre com fundo branco */}
        <div className="bg-primary-white border-t border-[#e5e5e5] shadow-sm navbar-menu">
          <div className="container mx-auto px-4">
            <nav aria-label="main" className="hidden lg:block h-full">
              <ul className="flex justify-center items-center h-full">
                {menuItems.map((item, index) => (
                  <li key={index} className="relative group h-full flex items-center" role="menuitem" aria-haspopup={!!item.dropdown}>
                    <a
                      href={item.url}
                      className="inline-block px-4 py-3 text-[15px] text-primary-darkgray hover:text-primary-red font-medium transition-colors duration-200 h-full flex items-center"
                    >
                      {item.label}
                    </a>
                    {item.dropdown && (
                      <div
                        className="absolute left-0 mt-0 w-64 bg-primary-white invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 navbar-dropdown"
                        aria-hidden="true"
                        style={{top: '100%'}}
                      >
                        <ul className="py-1" role="menu">
                          {item.dropdown.map((dropdownItem, idx) => (
                            <li key={idx} role="menuitem">
                              <a
                                href={dropdownItem.url}
                                className="navbar-dropdown-item"
                                tabIndex={-1}
                              >
                                {dropdownItem.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;