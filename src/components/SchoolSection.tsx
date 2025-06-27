interface SchoolSectionProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  linkUrl: string;
  reverse?: boolean;
}

const SchoolSection = ({
  id,
  title,
  description,
  imageUrl,
  imageAlt,
  linkUrl,
  reverse = false,
}: SchoolSectionProps) => {
  return (
    <section id={id} className="py-16 bg-secondary-lightgray">
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-card transition-transform duration-500 hover:shadow-lg hover:-translate-y-1">
              <img src={imageUrl} alt={imageAlt} className="w-full h-auto object-cover" />
            </div>
          </div>
          <div className="md:w-1/2">
            <span className="inline-block bg-primary-red text-primary-white px-3 py-1 text-sm uppercase font-bold rounded mb-3">School Section</span>
            <h2 className="text-3xl font-bold text-primary-blue mb-4">{title}</h2>
            <p className="text-lg text-primary-darkgray mb-6">{description}</p>
            <a
              href={linkUrl}
              className="inline-block bg-transparent border-2 border-primary-red text-primary-red px-6 py-2 rounded font-semibold transition-colors duration-300 hover:bg-primary-red hover:text-primary-white"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolSection;