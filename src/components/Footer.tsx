import StPaulsLogo2 from './StPaulsLogo2';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { label: 'About Us', url: '#about-us' },
      { label: 'Admissions', url: '#admissions' },
      { label: 'Academic', url: '#academic' },
      { label: 'School Life', url: '#school-life' },
      { label: 'The Paulean', url: '#paulean' },
      { label: 'Alumni', url: '#alumni' },
      { label: 'Work with us', url: '#work-with-us' },
      { label: 'Contact Us', url: '#contact-us' },
    ],
    school: [
      { label: 'Junior School', url: '#junior-school' },
      { label: 'Senior School', url: '#senior-school' },
      { label: 'Sixth Form', url: '#sixth-form' },
      { label: 'Learning Ethos', url: '#learning-ethos' },
      { label: 'Enrichment', url: '#enrichment' },
      { label: 'Wellbeing', url: '#wellbeing' },
    ],
    resources: [
      { label: 'Staff Portal', url: '#portal', external: true },
      { label: 'Webmail', url: '#webmail', external: true },
      { label: 'School Calendar', url: '#calendar' },
      { label: 'Term Dates', url: '#term-dates' },
      { label: 'School Policies', url: '#policies' },
      { label: 'Site Map', url: '#site-map' },
    ],
    info: [
      { label: 'Accreditations', url: '#accreditations' },
      { label: 'Our Governors', url: '#governors' },
      { label: 'Our Leadership', url: '#leadership' },
      { label: 'Privacy Policy', url: '#privacy' },
      { label: 'Terms of Service', url: '#terms' },
      { label: 'Accessibility', url: '#accessibility' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', url: '#facebook', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
    { name: 'Instagram', url: '#instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { name: 'LinkedIn', url: '#linkedin', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
    { name: 'YouTube', url: '#youtube', icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' },
    { name: 'Twitter', url: '#twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
  ];

  return (
    <footer>
      {/* Call to action banner */}
      <div className="bg-primary-red py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-primary-white mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Join the St. Paul's community</h3>
              <p className="text-primary-white/90">Find out how to apply for a place at our school</p>
            </div>
            <a
              href="#admissions"
              className="bg-primary-white text-primary-red px-6 py-3 rounded font-semibold transition-colors duration-300 hover:bg-primary-white/90"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-primary-blue pt-16 pb-10 text-primary-white">
        <div className="container mx-auto px-4">
          {/* Top row with logo and contact */}
          <div className="flex flex-col md:flex-row mb-12 space-y-6 md:space-y-0">
            <div className="md:w-1/3">
              <div className="flex items-center mb-6">
                <StPaulsLogo2
                  variant="footer"
                  className="h-[52px] w-auto"
                >
                  <div className="ml-3">
                    <span className="text-2xl font-bold text-primary-white block">St. Paul's</span>
                    <span className="text-sm text-secondary-coral">British School São Paulo</span>
                  </div>
                </StPaulsLogo2>
              </div>

              <div className="space-y-4 text-primary-white/80">
                <p className="max-w-xs">
                  A world-class British education in São Paulo since 1926.
                </p>
                <div className="pt-2">
                  <p className="mb-1">Rua Juquiá, 166, Jardim Paulistano</p>
                  <p>São Paulo, SP, 01440-903, Brazil</p>
                </div>
                <div>
                  <p>+55 (11) 3087-3399</p>
                  <a href="mailto:info@stpauls.br" className="hover:text-secondary-coral">info@stpauls.br</a>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="text-primary-white hover:text-secondary-coral transition-colors duration-300"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:w-2/3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-primary-white">Quick Links</h3>
                <ul className="space-y-3">
                  {footerLinks.quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className="text-primary-white/80 hover:text-secondary-coral transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-primary-white">School</h3>
                <ul className="space-y-3">
                  {footerLinks.school.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className="text-primary-white/80 hover:text-secondary-coral transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-primary-white">Resources</h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className="text-primary-white/80 hover:text-secondary-coral transition-colors duration-300"
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

          {/* Accreditations */}
          <div className="border-t border-primary-white/10 pt-10 mt-10">
            <h3 className="text-lg font-bold mb-6 text-center text-primary-white">Accreditations & Memberships</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {/* Placeholder for accreditation logos */}
              <div className="bg-primary-white/10 h-16 w-24 rounded flex items-center justify-center">
                <span className="text-xs text-primary-white/50">Logo 1</span>
              </div>
              <div className="bg-primary-white/10 h-16 w-24 rounded flex items-center justify-center">
                <span className="text-xs text-primary-white/50">Logo 2</span>
              </div>
              <div className="bg-primary-white/10 h-16 w-24 rounded flex items-center justify-center">
                <span className="text-xs text-primary-white/50">Logo 3</span>
              </div>
              <div className="bg-primary-white/10 h-16 w-24 rounded flex items-center justify-center">
                <span className="text-xs text-primary-white/50">Logo 4</span>
              </div>
              <div className="bg-primary-white/10 h-16 w-24 rounded flex items-center justify-center">
                <span className="text-xs text-primary-white/50">Logo 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-primary-blue/90 text-primary-white/60 py-4 border-t border-primary-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="mb-2 md:mb-0">
              <p>© {currentYear} St. Paul's School. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              {footerLinks.info.slice(3).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="hover:text-secondary-coral transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;