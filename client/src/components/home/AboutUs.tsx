import { CheckCircle } from "lucide-react";

const AboutUs = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-medium">About PrimeEstate</span>
            <h2 className="text-3xl font-bold mt-2 mb-6">
              Your Trusted Real Estate Partner for Over 15 Years
            </h2>
            <p className="text-gray-600 mb-6">
              PrimeEstate has been helping clients find their perfect homes and investment properties since 2008. 
              Our team of experienced real estate professionals combines market expertise with personalized service 
              to make your property journey smooth and successful.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="text-primary mr-2 h-5 w-5" />
                  <span className="font-medium">Expert Agents</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Our licensed agents have years of experience in the local market
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="text-primary mr-2 h-5 w-5" />
                  <span className="font-medium">Verified Listings</span>
                </div>
                <p className="text-gray-600 text-sm">
                  All our property listings are verified for accuracy and legitimacy
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="text-primary mr-2 h-5 w-5" />
                  <span className="font-medium">24/7 Support</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Our customer service team is available around the clock to assist you
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="text-primary mr-2 h-5 w-5" />
                  <span className="font-medium">Financing Help</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Get expert guidance on financing options and mortgage applications
                </p>
              </div>
            </div>
            
            <a 
              href="#contact" 
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md"
            >
              Contact Us
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80" 
                alt="PrimeEstate office" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
                alt="Property handover" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=853&q=80" 
                alt="Real estate agent" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=884&q=80" 
                alt="Client meeting" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
