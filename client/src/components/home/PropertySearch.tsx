import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PropertySearch = () => {
  const [, navigate] = useLocation();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query params from selected filters
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (propertyType) params.append("type", propertyType);
    if (priceRange) params.append("price", priceRange);
    
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Find Your Perfect Property</h2>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="bg-gray-50 border border-gray-300">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-locations">Select location</SelectItem>
                    <SelectItem value="downtown">Downtown</SelectItem>
                    <SelectItem value="suburb">Suburban Area</SelectItem>
                    <SelectItem value="beachfront">Beachfront</SelectItem>
                    <SelectItem value="countryside">Countryside</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="bg-gray-50 border border-gray-300">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">Select type</SelectItem>
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
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="bg-gray-50 border border-gray-300">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-prices">Select range</SelectItem>
                    <SelectItem value="0-200000">$0 - $200,000</SelectItem>
                    <SelectItem value="200000-500000">$200,000 - $500,000</SelectItem>
                    <SelectItem value="500000-1000000">$500,000 - $1,000,000</SelectItem>
                    <SelectItem value="1000000+">$1,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search Properties
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PropertySearch;
