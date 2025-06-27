import { useState } from 'react';
import heroImage from '../assets/images/hero-placeholder.svg';

interface TestimonialItem {
  id: string;
  quote: string;
  source: string;
  role?: string;
}

interface TestimonialProps {
  quote: string;
  source: string;
}

// Multiple testimonials for a slider
const testimonials: TestimonialItem[] = [
  {
    id: "testimonial1",
    quote: "[The curriculum] is particularly effective in developing pupils understanding and use of spoken and written English in a setting where almost all pupils speak English as an additional language.",
    source: "ISI Report 2023",
  },
  {
    id: "testimonial2",
    quote: "St. Paul's has provided an exceptional educational environment for my children. The balance between academic excellence and personal development is outstanding.",
    source: "Parent of Year 8 and Year 11 pupils",
  },
  {
    id: "testimonial3",
    quote: "The breadth of co-curricular activities offered at St. Paul's helped me discover my talents and build confidence. I'm grateful for the opportunities I had during my time at the school.",
    source: "Former Student",
    role: "Class of 2021"
  },
];

const Testimonial = (_props: TestimonialProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <section className="relative py-20">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="St. Paul's School Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/90 to-primary-blue/75"></div>
      </div>

      {/* Testimonial content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-white">
          <div className="mb-8">
            <svg
              className="w-16 h-16 text-secondary-coral mx-auto mb-6 opacity-80"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391C14.017 10.645 16.645 8 19.609 8V10c-1.655 0-3 1.363-3 3.043v1.957h3v6h-5.592zM6.017 21v-7.391C6.017 10.645 8.645 8 11.609 8V10c-1.655 0-3 1.363-3 3.043v1.957h3v6H6.017z" />
            </svg>
          </div>

          {/* Testimonial slider */}
          <div className="relative min-h-[220px]">
            {testimonials.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-700 flex flex-col items-center justify-center ${
                  index === currentTestimonial ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <blockquote>
                  <p className="text-xl md:text-2xl lg:text-3xl font-lora font-medium italic mb-6 leading-relaxed">
                    {item.quote}
                  </p>
                </blockquote>

                <div>
                  <cite className="text-xl not-italic font-semibold">
                    {item.source}
                  </cite>
                  {item.role && (
                    <p className="text-sm text-primary-white/80 mt-1">{item.role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="w-16 h-1 bg-primary-red mx-auto mt-8 mb-8"></div>

          {/* Navigation dots */}
          <div className="flex justify-center space-x-3 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  index === currentTestimonial
                    ? 'bg-secondary-coral'
                    : 'bg-primary-white/30 hover:bg-primary-white/60'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Previous/Next buttons */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={prevTestimonial}
              className="text-primary-white hover:text-secondary-coral transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="text-primary-white hover:text-secondary-coral transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;