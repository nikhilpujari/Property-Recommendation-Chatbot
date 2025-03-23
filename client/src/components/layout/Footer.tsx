import { Link } from "wouter";
import { Building, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-6">
              <Building className="text-primary h-6 w-6 mr-2" />
              <span className="text-xl font-bold">PrimeEstate</span>
            </div>
            <p className="text-gray-300 mb-6">
              Your trusted partner in finding the perfect property that meets all your needs and expectations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-primary">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-gray-300 hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-300 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">
                  Buy Property
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">
                  Sell Property
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">
                  Rent Property
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">
                  Property Valuation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">
                  Property Management
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Subscribe</h4>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest property updates
            </p>
            <form className="flex">
              <Input 
                type="email" 
                placeholder="Your email"
                className="bg-gray-700 text-white rounded-r-none border-gray-700 focus:ring-primary"
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white rounded-l-none"
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} PrimeEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
