interface InfoSectionProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  buttonText?: string;
  linkUrl?: string;
  color?: 'red' | 'blue' | 'coral';
}

const InfoSection = ({
  id,
  title,
  description,
  imageUrl,
  imageAlt,
  buttonText,
  linkUrl,
  color = 'red'
}: InfoSectionProps) => {
  const colorClasses = {
    red: 'bg-primary-red',
    blue: 'bg-primary-blue',
    coral: 'bg-secondary-coral'
  };

  return (
    <section id={id} className="py-6">
      <div className="rounded-lg overflow-hidden bg-primary-white shadow-card transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-56 object-cover"
          />
          <div className={`absolute top-0 left-0 ${colorClasses[color]} text-primary-white px-4 py-2 text-sm font-bold uppercase`}>
            {title}
          </div>
        </div>
        <div className="p-6">
          <p className="text-primary-darkgray mb-4">{description}</p>
          {buttonText && linkUrl && (
            <a
              href={linkUrl}
              className={`inline-block ${color === 'red' ? 'bg-primary-red' : color === 'blue' ? 'bg-primary-blue' : 'bg-secondary-coral'} text-primary-white px-6 py-2 rounded font-semibold transition-colors duration-300 hover:bg-opacity-90`}
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;