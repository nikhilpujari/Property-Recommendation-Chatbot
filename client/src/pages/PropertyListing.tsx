import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Bed, 
  Bath, 
  Move, 
  Car, 
  MapPin, 
  ArrowRight, 
  Search, 
  FilterX 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

const PropertyListing = () => {
  const [location] = useLocation();
  const [filterParams, setFilterParams] = useState({
    location: "",
    type: "",
    price: "",
    minBeds: "",
    minBaths: ""
  });
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    setFilterParams({
      location: params.get('location') || "",
      type: params.get('type') || "",
      price: params.get('price') || "",
      minBeds: params.get('minBeds') || "",
      minBaths: params.get('minBaths') || ""
    });
  }, [location]);

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilterParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilterParams({
      location: "",
      type: "",
      price: "",
      minBeds: "",
      minBaths: ""
    });
  };

  // Filter properties based on selected filters
  const filteredProperties = properties?.filter(property => {
    if (filterParams.location && !property.location.toLowerCase().includes(filterParams.location.toLowerCase())) {
      return false;
    }
    if (filterParams.type && property.type.toLowerCase() !== filterParams.type.toLowerCase()) {
      return false;
    }
    if (filterParams.price) {
      const [min, max] = filterParams.price.split('-').map(Number);
      if (min && property.price < min) return false;
      if (max && property.price > max) return false;
    }
    if (filterParams.minBeds && property.bedrooms < parseInt(filterParams.minBeds)) {
      return false;
    }
    if (filterParams.minBaths && property.bathrooms < parseInt(filterParams.minBaths)) {
      return false;
    }
    return true;
  }) || [];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Properties</h1>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">
              {filteredProperties.length} properties found
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-primary flex items-center"
                    onClick={clearFilters}
                  >
                    <FilterX className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </Label>
                    <Select 
                      value={filterParams.location} 
                      onValueChange={val => handleFilterChange('location', val)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-locations">Any location</SelectItem>
                        <SelectItem value="downtown">Downtown</SelectItem>
                        <SelectItem value="suburb">Suburb</SelectItem>
                        <SelectItem value="beachfront">Beachfront</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </Label>
                    <Select 
                      value={filterParams.type} 
                      onValueChange={val => handleFilterChange('type', val)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-types">Any type</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range
                    </Label>
                    <Select 
                      value={filterParams.price} 
                      onValueChange={val => handleFilterChange('price', val)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Any price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-prices">Any price</SelectItem>
                        <SelectItem value="0-200000">$0 - $200,000</SelectItem>
                        <SelectItem value="200000-500000">$200,000 - $500,000</SelectItem>
                        <SelectItem value="500000-1000000">$500,000 - $1,000,000</SelectItem>
                        <SelectItem value="1000000-5000000">$1,000,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Bedrooms
                    </Label>
                    <Select 
                      value={filterParams.minBeds} 
                      onValueChange={val => handleFilterChange('minBeds', val)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Any number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any-bedrooms">Any number</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Bathrooms
                    </Label>
                    <Select 
                      value={filterParams.minBaths} 
                      onValueChange={val => handleFilterChange('minBaths', val)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Any number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any-bathrooms">Any number</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Property Listings */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
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
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">
                  Failed to load properties. Please try again later.
                </p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No properties found matching your criteria. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
