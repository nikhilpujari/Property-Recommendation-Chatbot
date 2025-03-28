import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative">
      <div 
        className="w-full h-[70vh] bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-secondary bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Your Dream Home
              </h1>
              <p className="text-lg text-white mb-8">
                Let us help you discover the perfect property tailored to your lifestyle
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/properties">
                  <a className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md text-center">
                    Browse Properties
                  </a>
                </Link>
                <a 
                  href="#chatbot" 
                  className="bg-white hover:bg-gray-100 text-secondary font-medium py-3 px-6 rounded-md text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    // Scroll to bottom where the chatbot is
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: 'smooth'
                    });
                  }}
                >
                  Chat with Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
