import React from 'react';
import StPaulsLogo2 from './StPaulsLogo2';

const LogoTester: React.FC = () => {
  const logos = [
    { name: 'primary-logo.png', path: '/logos-fix/primary-logo.png' },
    { name: 'black-outline-h1.png', path: '/logos-fix/black-outline-h1.png' },
    { name: 'white-outline-h1.png', path: '/logos-fix/white-outline-h1.png' },
    { name: 'black-outline.png', path: '/logos-fix/black-outline.png' },
    { name: 'white-outline.png', path: '/logos-fix/white-outline.png' },
    { name: 'white-outline-h2.png', path: '/logos-fix/white-outline-h2.png' },
    { name: 'solid-color.png', path: '/logos-fix/solid-color.png' },
  ];

  const logoOriginals = [
    { name: 'BRAND_ST PAULS_Primary logo_N.png', path: '/logos/BRAND_ST PAULS_Primary logo_N.png' },
    { name: 'BRAND_ST PAULS_Black Outline Horizontal_V1.png', path: '/logos/BRAND_ST PAULS_Black Outline Horizontal_V1.png' },
    { name: 'BRAND_ST PAULS_White Outline Horizontal_V1.png', path: '/logos/BRAND_ST PAULS_White Outline Horizontal_V1.png' },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Logo Tester</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Logos com caminhos simplificados (/logos-fix/)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {logos.map((logo) => (
            <div key={logo.name} className="border p-4 rounded-lg flex flex-col items-center">
              <img 
                src={logo.path} 
                alt={logo.name} 
                className="h-40 w-auto my-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.classList.add('border', 'border-red-500');
                  console.error(`Erro ao carregar: ${logo.path}`);
                }}
                onLoad={() => console.log(`Carregado com sucesso: ${logo.path}`)}
              />
              <p className="text-sm text-center mt-2">{logo.name}</p>
              <p className="text-xs text-gray-500 text-center mt-1">{logo.path}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Logos com caminhos originais (/logos/)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {logoOriginals.map((logo) => (
            <div key={logo.name} className="border p-4 rounded-lg flex flex-col items-center">
              <img 
                src={logo.path} 
                alt={logo.name} 
                className="h-40 w-auto my-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.classList.add('border', 'border-red-500');
                  console.error(`Erro ao carregar: ${logo.path}`);
                }}
                onLoad={() => console.log(`Carregado com sucesso: ${logo.path}`)}
              />
              <p className="text-sm text-center mt-2">{logo.name}</p>
              <p className="text-xs text-gray-500 text-center mt-1">{logo.path}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">StPaulsLogo2 Component Renderizado</h2>
        <div className="p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-900 p-6 rounded-lg">
            <h3 className="text-white mb-4">Header (não scrolled - deveria ser logo branco)</h3>
            <StPaulsLogo2 variant="header" isScrolled={false} className="h-20 w-auto" />
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="mb-4">Header (scrolled - deveria ser logo escuro)</h3>
            <StPaulsLogo2 variant="header" isScrolled={true} className="h-20 w-auto" />
          </div>
          <div className="bg-blue-900 p-6 rounded-lg">
            <h3 className="text-white mb-4">Mobile Header (não scrolled)</h3>
            <StPaulsLogo2 variant="header-mobile" isScrolled={false} className="h-20 w-auto" />
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="mb-4">Mobile Header (scrolled)</h3>
            <StPaulsLogo2 variant="header-mobile" isScrolled={true} className="h-20 w-auto" />
          </div>
          <div className="bg-blue-900 p-6 rounded-lg">
            <h3 className="text-white mb-4">Footer</h3>
            <StPaulsLogo2 variant="footer" className="h-20 w-auto" />
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Como é usado na Navbar</h2>
        
        <h3 className="text-lg font-semibold mb-2">Cabeçalho não rolado (vermelho)</h3>
        <div className="bg-primary-red shadow-md p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="block">
                  <img 
                    src="/logos-fix/white-outline-h1.png"
                    alt="St. Paul's School Logo"
                    className="h-[70px] w-auto transition-all duration-300"
                  />
                </div>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Utility Links</span>
              <button className="bg-white text-primary-red px-4 py-2 rounded">Work with us</button>
              <span className="text-white">Search</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Cabeçalho rolado (branco)</h3>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="block">
                  <img 
                    src="/logos-fix/black-outline-h1.png"
                    alt="St. Paul's School Logo"
                    className="h-[70px] w-auto transition-all duration-300"
                  />
                </div>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Utility Links</span>
              <button className="bg-primary-red text-white px-4 py-2 rounded">Work with us</button>
              <span className="text-gray-700">Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTester; 