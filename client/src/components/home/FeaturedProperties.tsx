import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Bed, 
  Bath, 
  Move, 
  Car, 
  MapPin, 
  ArrowRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@shared/schema";

const FeaturedProperties = () => {
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties/featured'],
  });

  if (isLoading) {
    return (
      <section id="properties" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties that match your lifestyle needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-56 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse mb-4 w-1/2"></div>
                  <div className="flex flex-wrap gap-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="w-1/2 flex items-center">
                        <div className="h-4 bg-gray-200 animate-pulse w-3/4"></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="h-6 bg-gray-200 animate-pulse w-1/3"></div>
                    <div className="h-4 bg-gray-200 animate-pulse w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !properties) {
    return (
      <section id="properties" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
          <p className="text-red-500">
            Failed to load properties. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties that match your lifestyle needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card 
              key={property.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden property-card transition-all duration-300"
            >
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 left-4">
                  {property.isFeatured && (
                    <Badge className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant="outline" 
                    className="bg-white text-primary text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {property.status}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-gray-500 mb-4">
                  <span className="flex items-center">
                    <MapPin className="text-primary mr-2 h-4 w-4" />
                    {property.location}
                  </span>
                </p>
                
                <div className="flex flex-wrap gap-y-2">
                  <div className="w-1/2 flex items-center">
                    <Bed className="text-gray-400 mr-2 h-4 w-4" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="w-1/2 flex items-center">
                    <Bath className="text-gray-400 mr-2 h-4 w-4" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="w-1/2 flex items-center">
                    <Move className="text-gray-400 mr-2 h-4 w-4" />
                    <span>{property.squareFeet} sqft</span>
                  </div>
                  <div className="w-1/2 flex items-center">
                    <Car className="text-gray-400 mr-2 h-4 w-4" />
                    <span>{property.garage} Garage</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                    </span>
                    {property.status === "For Rent" && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                  <Link href={`/properties/${property.id}`} className="text-secondary hover:text-primary">
                    View Details <ArrowRight className="inline ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/properties">
            <Button variant="outline" className="bg-white hover:bg-gray-100 text-primary border-primary">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
