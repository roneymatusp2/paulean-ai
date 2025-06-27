import React from 'react';
import LogoUsageExample from '../components/LogoUsageExample';

const LogoGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">St. Paul's Logo Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive guide to using the St. Paul's School branding across the website
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <LogoUsageExample />
        </div>
        
        <div className="max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Implementation Details</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Component Structure</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="bg-gray-100 px-2 py-1 rounded">StPaulsLogo.tsx</code> - Main logo component with support for different variants</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">AccreditationLogos.tsx</code> - Component for displaying accreditation logos</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">File Organization</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>All logo files are stored in <code className="bg-gray-100 px-2 py-1 rounded">/public/logos/</code></li>
            <li>Accreditation logos are in <code className="bg-gray-100 px-2 py-1 rounded">/public/logos/accreditations/</code></li>
            <li>Original filenames are preserved for easy reference</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Usage Guidelines</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Always include proper <code className="bg-gray-100 px-2 py-1 rounded">alt</code> text for accessibility</li>
            <li>Maintain consistent sizing according to the design specifications</li>
            <li>For headers that change on scroll, use the <code className="bg-gray-100 px-2 py-1 rounded">isScrolled</code> prop</li>
            <li>For favicon and social sharing, use the shield-color variant</li>
          </ul>
          
          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h4 className="font-semibold text-blue-800">Note</h4>
            <p className="text-blue-700">
              This implementation follows the official St. Paul's School branding guidelines and 
              matches the logo usage patterns found on the official website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoGuidePage;