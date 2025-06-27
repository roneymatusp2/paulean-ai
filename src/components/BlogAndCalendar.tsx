import heroImage from '../assets/images/hero-placeholder.svg';

const BlogAndCalendar = () => {
  // Featured blog posts
  const blogPosts = [
    {
      id: 1,
      title: "St. Paul's Foundation",
      excerpt: "Supporting excellence in education through scholarships and educational programs.",
      image: heroImage,
      date: "May 8, 2025",
      category: "Community",
      link: "#foundation",
    },
    {
      id: 2,
      title: "Sports Day Highlights",
      excerpt: "Celebrating athletic achievements and team spirit at our annual Sports Day event.",
      image: heroImage,
      date: "May 5, 2025",
      category: "Events",
      link: "#sports-day",
    },
    {
      id: 3,
      title: "Excellence in IGCSE Results",
      excerpt: "Congratulations to our students for their outstanding IGCSE examination results.",
      image: heroImage,
      date: "May 2, 2025",
      category: "Academic",
      link: "#results",
    },
  ];

  // Upcoming events
  const events = [
    {
      id: 1,
      title: "Open Day",
      date: "May 15, 2025",
      time: "9:00 AM - 12:00 PM",
      location: "School Campus",
      link: "#open-day"
    },
    {
      id: 2,
      title: "Parent-Teacher Conferences",
      date: "May 20-21, 2025",
      time: "2:00 PM - 7:00 PM",
      location: "Main Building",
      link: "#conferences"
    },
    {
      id: 3,
      title: "End of Term Concert",
      date: "June 30, 2025",
      time: "6:30 PM",
      location: "School Auditorium",
      link: "#concert"
    }
  ];

  return (
    <section className="py-16 bg-secondary-lightgray">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Blog Section */}
          <div className="lg:w-2/3">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-primary-red"></div>
                <h2 className="text-3xl font-bold text-primary-blue ml-4">The Paulean</h2>
              </div>
              <p className="text-lg text-primary-darkgray">
                Our school's blog celebrates the amazing teaching and learning at St. Paul's.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-primary-white rounded-lg shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative">
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-0 right-0 bg-primary-red text-primary-white px-3 py-1 text-sm font-semibold">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-secondary-gray mb-2">{post.date}</p>
                    <h3 className="text-xl font-bold text-primary-blue mb-2">{post.title}</h3>
                    <p className="text-primary-darkgray mb-4 line-clamp-2">{post.excerpt}</p>
                    <a
                      href={post.link}
                      className="inline-block text-primary-red font-semibold hover:underline"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a
                href="#blog"
                className="inline-block bg-primary-blue text-primary-white px-6 py-3 rounded font-semibold transition-colors duration-300 hover:bg-opacity-90"
              >
                View all posts
              </a>
            </div>
          </div>

          {/* Calendar/Events Section */}
          <div className="lg:w-1/3">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-primary-blue"></div>
                <h2 className="text-3xl font-bold text-primary-blue ml-4">Calendar</h2>
              </div>
              <p className="text-lg text-primary-darkgray">
                Upcoming events at St. Paul's School.
              </p>
            </div>

            <div className="bg-primary-white rounded-lg shadow-card overflow-hidden">
              <div className="bg-primary-blue text-primary-white p-4">
                <h3 className="text-xl font-bold">May - June 2025</h3>
              </div>

              <div className="divide-y divide-secondary-bordergray">
                {events.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-secondary-lightgray transition-colors duration-200">
                    <div className="flex gap-4">
                      <div className="w-12 text-center">
                        <div className="text-primary-red font-bold text-xl">
                          {event.date.split(' ')[1].replace(',', '')}
                        </div>
                        <div className="text-sm text-secondary-gray">
                          {event.date.split(' ')[0]}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-darkgray">{event.title}</h4>
                        <p className="text-sm text-secondary-gray">{event.time}</p>
                        <p className="text-sm text-secondary-gray">{event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 text-center">
                <a
                  href="#calendar"
                  className="inline-block text-primary-blue font-semibold hover:underline"
                >
                  View full calendar →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogAndCalendar;