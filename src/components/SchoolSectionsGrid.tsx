import heroImage from '../assets/images/hero-placeholder.svg';

const schoolSections = [
  {
    id: "junior-school",
    title: "Junior School",
    ageRange: "Ages 3-11",
    description: "A creative environment where young pupils can explore their potential and develop a love of learning.",
    imageUrl: heroImage,
    linkUrl: "#junior-school",
    color: "primary-red"
  },
  {
    id: "senior-school",
    title: "Senior School",
    ageRange: "Ages 11-16",
    description: "A stimulating environment where pupils can develop their academic interests and discover their strengths.",
    imageUrl: heroImage,
    linkUrl: "#senior-school",
    color: "primary-blue"
  },
  {
    id: "sixth-form",
    title: "Sixth Form",
    ageRange: "Ages 16-18",
    description: "A pre-university environment preparing pupils for higher education and their professional future.",
    imageUrl: heroImage,
    linkUrl: "#sixth-form",
    color: "secondary-coral"
  },
];

// Additional content sections that appear in the image-button-container
const additionalSections = [
  {
    id: "academic",
    title: "Academic",
    description: "Discover our high-quality Anglo-Brazilian curriculum.",
    imageUrl: heroImage,
    linkUrl: "#academic",
    btnText: "Learn more"
  },
  {
    id: "admissions",
    title: "Admissions",
    description: "Find out how to join our school community.",
    imageUrl: heroImage,
    linkUrl: "#admissions",
    btnText: "Apply now"
  },
  {
    id: "enrichment",
    title: "Enrichment",
    description: "Explore our extensive co-curricular programme.",
    imageUrl: heroImage,
    linkUrl: "#enrichment",
    btnText: "Discover more"
  }
];

const SchoolSectionsGrid = () => {
  return (
    <section className="bg-primary-white">
      <div className="container mx-auto">
        {/* School Sections Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 relative z-20 mb-16">
          {schoolSections.map((section, index) => (
            <div key={index} className="group">
              <div className="bg-primary-white rounded-lg shadow-card overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={section.imageUrl}
                    alt={section.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-${section.color} opacity-70`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-primary-white">{section.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-primary-darkgray mb-3">{section.ageRange}</div>
                  <p className="mb-5 text-primary-darkgray">{section.description}</p>
                  <a
                    href={section.linkUrl}
                    className={`inline-block px-5 py-2 rounded text-primary-white font-semibold bg-${section.color} hover:bg-opacity-90 transition-colors duration-300`}
                    aria-label={`Learn more about ${section.title}`}
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Content Sections */}
        <div className="py-12 border-t border-secondary-bordergray">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalSections.map((section, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-lg h-80">
                  <img
                    src={section.imageUrl}
                    alt={section.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-darkgray/90 via-primary-darkgray/50 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-primary-white mb-2">{section.title}</h3>
                    <p className="text-primary-white/90 mb-4">{section.description}</p>
                    <a
                      href={section.linkUrl}
                      className="inline-block bg-primary-white text-primary-darkgray px-5 py-2 rounded font-semibold transition-colors duration-300 hover:bg-primary-white/90"
                    >
                      {section.btnText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News and Events Preview */}
        <div className="py-12 border-t border-secondary-bordergray">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-primary-blue mb-2">Latest News & Events</h2>
            <p className="text-primary-darkgray max-w-3xl mx-auto">
              Stay up to date with what's happening at St. Paul's
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-primary-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={heroImage}
                    alt="News item"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-secondary-gray mb-2">15 April 2025</div>
                  <h3 className="text-lg font-bold text-primary-blue mb-2 line-clamp-2">School community gathers for annual charity event</h3>
                  <p className="text-sm text-primary-darkgray mb-3 line-clamp-3">
                    Our school community came together to raise funds for local charities through various activities and performances.
                  </p>
                  <a href="#news-item" className="text-primary-red font-semibold text-sm hover:underline">
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <a
              href="#news"
              className="inline-block bg-primary-blue text-primary-white px-6 py-3 rounded font-semibold transition-colors duration-300 hover:bg-primary-blue/90"
            >
              View all news & events
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolSectionsGrid;