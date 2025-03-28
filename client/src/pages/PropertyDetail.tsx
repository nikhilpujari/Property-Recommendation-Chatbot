import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { 
  Bed, 
  Bath, 
  Move, 
  Car, 
  MapPin, 
  ArrowLeft,
  CalendarClock,
  Phone,
  Mail,
  Share2,
  Heart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Property } from "@shared/schema";

const PropertyDetail = () => {
  const { id } = useParams();
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-8 bg-gray-200 w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 w-full mb-3"></div>
              <div className="h-4 bg-gray-200 w-full mb-3"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded-lg mb-6"></div>
            </div>
            <div className="md:col-span-1">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-8">
          The property you're looking for doesn't exist or there was an error.
        </p>
        <Link href="/properties">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/properties" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Property Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <p className="text-lg text-gray-600 flex items-center">
                <MapPin className="text-primary mr-2 h-5 w-5" />
                {property.location}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <Badge 
                  variant="outline" 
                  className="bg-white text-primary text-base font-medium px-4 py-1.5 rounded-full"
                >
                  {property.status}
                </Badge>
                <span className="text-3xl font-bold text-primary">
                  ${property.price.toLocaleString()}
                  {property.status === "For Rent" && (
                    <span className="text-gray-600 text-lg">/month</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {/* Property Image */}
          <div className="relative h-[60vh] w-full overflow-hidden rounded-lg bg-cover bg-center">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Property Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="md:col-span-2">
              {/* Property Features */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                        <Bed className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 text-sm">Bedrooms</p>
                      <p className="font-semibold text-lg">{property.bedrooms}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                        <Bath className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 text-sm">Bathrooms</p>
                      <p className="font-semibold text-lg">{property.bathrooms}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                        <Move className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 text-sm">Area</p>
                      <p className="font-semibold text-lg">{property.squareFeet} sqft</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                        <Car className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 text-sm">Garage</p>
                      <p className="font-semibold text-lg">{property.garage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Property Tabs */}
              <Tabs defaultValue="description" className="mb-8">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="bg-white p-6 rounded-b-lg border border-t-0">
                  <h3 className="text-xl font-semibold mb-4">Property Description</h3>
                  <p className="text-gray-600 mb-4">
                    {property.description}
                  </p>
                  <p className="text-gray-600">
                    This beautiful property offers a comfortable living experience with modern amenities and a great location. 
                    Perfect for families or professionals looking for a high-quality home in a desirable neighborhood.
                  </p>
                </TabsContent>
                <TabsContent value="features" className="bg-white p-6 rounded-b-lg border border-t-0">
                  <h3 className="text-xl font-semibold mb-4">Property Features</h3>
                  <ul className="grid grid-cols-2 gap-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                      Central Air Conditioning
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                      Hardwood Flooring
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                      Modern Kitchen
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                      Stainless Steel Appliances
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                      Walk-in Closets
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                      Granite Countertops
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                      High Ceilings
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                      Energy-Efficient Windows
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="location" className="bg-white p-6 rounded-b-lg border border-t-0">
                  <h3 className="text-xl font-semibold mb-4">Property Location</h3>
                  <p className="text-gray-600 mb-4">
                    This property is located in the {property.location} area, known for its excellent amenities and accessibility.
                  </p>
                  <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map View Placeholder</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Similar Properties */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Similar Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card 
                      key={i} 
                      className="bg-white rounded-lg shadow-md overflow-hidden property-card transition-all duration-300"
                    >
                      <div className="relative h-48">
                        <img 
                          src={`https://images.unsplash.com/photo-156${i === 1 ? 8 : 0}605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`} 
                          alt="Similar property" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-1">Similar {property.type}</h4>
                        <p className="text-gray-500 text-sm mb-2">Near {property.location}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary">${(property.price * 0.9).toLocaleString()}</span>
                          <Button size="sm" variant="outline" className="text-primary border-primary">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Contact & Actions */}
            <div className="md:col-span-1">
              {/* Agent Contact */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" 
                        alt="Real estate agent" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">John Anderson</h3>
                      <p className="text-gray-500 text-sm">Senior Property Consultant</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Phone className="text-primary mr-2 h-4 w-4" />
                      <a href="tel:+15551234567" className="text-gray-600 hover:text-primary">
                        (555) 123-4567
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="text-primary mr-2 h-4 w-4" />
                      <a href="mailto:john@primeestate.com" className="text-gray-600 hover:text-primary">
                        john@primeestate.com
                      </a>
                    </div>
                  </div>
                  
                  <Button className="w-full mb-3">
                    Contact Agent
                  </Button>
                </CardContent>
              </Card>
              
              {/* Schedule Visit */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <CalendarClock className="text-primary mr-2 h-5 w-5" />
                    Schedule a Visit
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Choose your preferred date and time to visit this property
                  </p>
                  <Button className="w-full">
                    Schedule Viewing
                  </Button>
                </CardContent>
              </Card>
              
              {/* Property Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
