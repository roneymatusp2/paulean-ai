import React from 'react';

// Define available accreditation organizations
export type AccreditationType = 
  | 'hmc'          // Headmasters' and Headmistresses' Conference
  | 'cambridge'    // Cambridge Assessment International Education
  | 'ib'           // International Baccalaureate
  | 'ibdp'         // IB Diploma Programme
  | 'lahc'         // Latin American Heads Conference
  | 'isc'          // Independent Schools Council
  | 'iaps'         // Independent Association of Prep Schools
  | 'cobis'        // Council of British International Schools
  | 'spears'       // Spears Schools
  | 'apple';       // Apple Distinguished School

interface AccreditationLogoProps {
  type: AccreditationType;
  className?: string;
  alt?: string;
}

/**
 * Component for displaying standardized accreditation logos as seen on
 * https://www.stpauls.br/about-us/accreditations
 */
const AccreditationLogo: React.FC<AccreditationLogoProps> = ({
  type,
  className = '',
  alt,
}) => {
  // Based on actual logos from https://www.stpauls.br/about-us/accreditations
  const getLogoDetails = () => {
    switch (type) {
      case 'hmc':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1636424110/stpaulsbr/hvobc0xgtowfhpu2qcqx/Memberships-7.jpg
          src: '/accreditations/hmc.png',
          defaultAlt: 'Headmasters\' and Headmistresses\' Conference',
          width: 256,
          height: 203,
          fileSize: '4.2 KB',
          originalFormat: 'PNG'
        };
      case 'cambridge':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1636424109/stpaulsbr/kto6443cvxt8sszyz2dc/Memberships-6.jpg
          src: '/accreditations/cambridge.png',
          defaultAlt: 'Cambridge Assessment International Education',
          width: 256,
          height: 203,
          fileSize: '5.2 KB',
          originalFormat: 'PNG'
        };
      case 'ib':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1636424109/stpaulsbr/fbtxxl8q4svr6xh73bcw/Memberships-4.jpg
          src: '/accreditations/ib.jpg',
          defaultAlt: 'International Baccalaureate',
          width: 256,
          height: 203,
          fileSize: '8.5 KB',
          originalFormat: 'JPEG'
        };
      case 'ibdp':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1670422299/stpaulsbr/uuw4tajvci9qwjr1uabj/IBDPlogo.png
          src: '/accreditations/ibdp.png',
          defaultAlt: 'IB Diploma Programme',
          width: 256,
          height: 78,
          fileSize: '4.9 KB',
          originalFormat: 'PNG'
        };
      case 'lahc':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1636424109/stpaulsbr/teuiaqvmalosqkmkzadz/Memberships-5.jpg
          src: '/accreditations/lahc.png',
          defaultAlt: 'Latin American Heads Conference',
          width: 256,
          height: 203,
          fileSize: '7.5 KB',
          originalFormat: 'PNG'
        };
      case 'isc':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1636424109/stpaulsbr/aqdvp8bbgtx1hhkv7zuk/Memberships-3.jpg
          src: '/accreditations/isc.jpg',
          defaultAlt: 'Independent Schools Council',
          width: 256,
          height: 203,
          fileSize: '3.9 KB',
          originalFormat: 'JPEG'
        };
      case 'iaps':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1636424110/stpaulsbr/escrikuhlk5p0mchc93w/Memberships-2.jpg
          src: '/accreditations/iaps.png',
          defaultAlt: 'Independent Association of Prep Schools',
          width: 256,
          height: 203,
          fileSize: '4.7 KB',
          originalFormat: 'PNG'
        };
      case 'cobis':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1636424110/stpaulsbr/nhfbweslhe9gg9mfccf1/Memberships-1.jpg
          src: '/accreditations/cobis.png',
          defaultAlt: 'Council of British International Schools',
          width: 256,
          height: 203,
          fileSize: '4.7 KB',
          originalFormat: 'PNG'
        };
      case 'spears':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1636428124/stpaulsbr/qewrjd08qvtpvomcceyp/member_spears.png
          src: '/accreditations/spears.jpg',
          defaultAlt: 'Spears Schools',
          width: 256,
          height: 214,
          fileSize: '12.6 KB',
          originalFormat: 'JPEG'
        };
      case 'apple':
        return {
          // Real URL: https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1682647851/stpaulsbr/mmohhv8zcayp4vkt8cgn/Untitleddesign20.png
          src: '/accreditations/apple.png',
          defaultAlt: 'Apple Distinguished School',
          width: 256,
          height: 256,
          fileSize: '5.0 KB',
          originalFormat: 'PNG'
        };
      default:
        return {
          src: '/logos-fix/primary-logo.png',
          defaultAlt: 'Accreditation',
          width: 256,
          height: 203,
          fileSize: '4.0 KB',
          originalFormat: 'PNG'
        };
    }
  };

  const { src, defaultAlt, width, height } = getLogoDetails();
  
  // Use provided alt text or fall back to the default for the logo type
  const logoAlt = alt || defaultAlt;

  return (
    <img
      src={src}
      alt={logoAlt}
      width={width}
      height={height}
      className={`object-contain ${className}`}
    />
  );
};

/**
 * Grid display of all accreditation logos
 */
export const AccreditationGrid: React.FC = () => {
  // List of all accreditations to display in the grid
  const accreditations: AccreditationType[] = [
    'hmc', 'cambridge', 'ib', 'ibdp', 'lahc', 
    'isc', 'iaps', 'cobis', 'spears'
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
      {accreditations.map((type) => (
        <div key={type} className="flex justify-center items-center p-4 bg-white rounded-lg shadow-sm">
          <AccreditationLogo 
            type={type} 
            className="max-h-24 w-auto transition-transform hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
};

// Special component for showing the Apple Distinguished School logo
export const AppleDistinguishedLogo: React.FC<{className?: string}> = ({className = ''}) => {
  return (
    <div className="flex flex-col items-center">
      <AccreditationLogo 
        type="apple"
        className={`max-h-32 w-auto ${className}`}
      />
      <p className="mt-2 text-center text-sm text-gray-600">
        Apple Distinguished School
      </p>
    </div>
  );
};

export default AccreditationLogo;