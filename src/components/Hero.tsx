import { useState, useEffect } from 'react';
import heroImage from '../assets/images/hero-placeholder.svg';

// Hero slide type
type HeroSlide = {
  id: string;
  title: string;
  description?: string;
  image: string;
  type: 'image' | 'video';
  videoSrc?: string;
};

const heroSlides: HeroSlide[] = [
  {
    id: 'slide1',
    title: 'Greatness is born of inspiration',
    description: 'This is St. Paul\'s School, the British School of São Paulo',
    image: heroImage,
    type: 'video',
  },
  {
    id: 'slide2',
    title: 'Welcome to St. Paul\'s',
    description: 'Achieving the best in yourself',
    image: heroImage,
    type: 'video',
  },
  {
    id: 'slide3',
    title: 'Holistic education',
    description: 'We challenge our young people to engage themselves within the classroom and beyond, and, through their adventures, to learn as much as they can about themselves and the world about them',
    image: heroImage,
    type: 'image',
  },
  {
    id: 'slide4',
    title: 'A kind community',
    description: 'As members of a strong community, Pauleans are equipped with everything they need to be global citizens who can make a tangible difference',
    image: heroImage,
    type: 'image',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-rotation for slides
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 10000); // 10 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative">
      {/* Full-width hero slider */}
      <div className="relative h-[700px] overflow-hidden">
        {/* Hero slides */}
        <div className="relative h-full w-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {slide.type === 'image' ? (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                // Placeholder for video - you'd add actual video elements here
                <div className="absolute inset-0 bg-primary-blue flex items-center justify-center">
                  <div className="text-white text-xl">Video Placeholder</div>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-darkgray/70 to-transparent"></div>

              {/* Slide content */}
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 pb-20">
                  <div className="max-w-2xl text-primary-white">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-lora font-bold mb-4 leading-tight">
                      {slide.title}
                    </h2>
                    {slide.description && (
                      <p className="text-lg md:text-xl mb-6">
                        {slide.description}
                      </p>
                    )}
                    {index === 0 && (
                      <div className="flex flex-wrap gap-4 mt-6">
                        <a
                          href="#admissions"
                          className="bg-primary-red text-primary-white px-6 py-3 rounded font-semibold transition-colors duration-300 hover:bg-primary-red/90"
                        >
                          Apply now
                        </a>
                        <a
                          href="#visit"
                          className="bg-transparent border-2 border-primary-white text-primary-white px-6 py-3 rounded font-semibold transition-colors duration-300 hover:bg-primary-white hover:text-primary-blue"
                        >
                          Visit us
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-5 right-4 z-20 flex items-center space-x-2">
          <button
            aria-label="Previous slide"
            onClick={prevSlide}
            className="text-primary-white hover:text-secondary-coral p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <button
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            onClick={togglePlayPause}
            className="text-primary-white hover:text-secondary-coral p-2"
            value={isPlaying ? "pause" : "play"}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
          </button>

          <button
            aria-label="Next slide"
            onClick={nextSlide}
            className="text-primary-white hover:text-secondary-coral p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-primary-white' : 'bg-primary-white/50 hover:bg-primary-white/80'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      <div className="bg-primary-white py-3 border-b border-secondary-bordergray">
        <div className="container mx-auto px-4">
          <nav aria-label="breadcrumb">
            <ul className="flex items-center text-sm">
              <li aria-current="location" className="text-primary-darkgray">
                St. Paul's
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Welcome section */}
      <div className="bg-primary-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-2">Welcome to St. Paul's</h2>
              <div className="text-primary-darkgray">
                <p>Introduction</p>
              </div>
            </header>
            <div className="text-lg text-primary-darkgray space-y-4 mb-8">
              <p>
                We are the British school of São Paulo. At St. Paul's we always strive to be the best we can be.
                We have the courage of our convictions, essential values, and the freedom to imagine and create.
                This is achieved through our high-quality British and Brazilian holistic education which drives
                the personal and academic development of pupils, within a caring, inclusive and united community.
              </p>
              <p>
                <a
                  href="#about"
                  className="text-primary-blue hover:text-primary-red font-medium"
                >
                  Read more about us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;