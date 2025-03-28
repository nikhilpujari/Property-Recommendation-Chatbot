import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { 
  MapPin, 
  ArrowLeft,
  Phone,
  Mail,
  Users,
  Home,
  Calendar,
  DollarSign,
  Clock,
  ChevronRight,
  DownloadCloud
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@shared/schema";

const ProjectDetail = () => {
  const { id } = useParams();
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
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

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="text-gray-600 mb-8">
          The project you're looking for doesn't exist or there was an error.
        </p>
        <Link href="/#projects">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/#projects" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Project Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <Badge className="bg-accent text-white text-xs font-medium px-3 py-1 rounded mb-2">
                {project.status}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-lg text-gray-600 flex items-center">
                <MapPin className="text-primary mr-2 h-5 w-5" />
                {project.location}
              </p>
            </div>
            <div>
              <div>
                <span className="text-3xl font-bold text-primary">
                  ${project.startingPrice.toLocaleString()}
                </span>
                <span className="text-gray-600 text-lg ml-1">starting price</span>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-gray-600 mr-2">Completion:</span>
                <span className="font-medium">{project.completionDate}</span>
              </div>
            </div>
          </div>
          
          {/* Project Image */}
          <div className="relative h-[60vh] w-full overflow-hidden rounded-lg bg-cover bg-center">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Project Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="md:col-span-2">
              {/* Project Features */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 text-sm">Location</p>
                      <p className="font-semibold text-lg">{project.location}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                        <Users className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 text-sm">Units</p>
                      <p className="font-semibold text-lg">{project.units}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 text-sm">Completion</p>
                      <p className="font-semibold text-lg">{project.completionDate}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 text-sm">Starting Price</p>
                      <p className="font-semibold text-lg">${project.startingPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Project Progress */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Clock className="text-primary mr-2 h-5 w-5" />
                    Construction Progress
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Current Progress</span>
                      <span className="font-medium">{project.progressPercentage}% Complete</span>
                    </div>
                    <Progress value={project.progressPercentage} className="h-2.5" />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 border border-gray-200 rounded-md p-3">
                      <p className="text-gray-600 text-sm">Construction Start</p>
                      <p className="font-medium">January 2023</p>
                    </div>
                    <div className="flex-1 border border-gray-200 rounded-md p-3">
                      <p className="text-gray-600 text-sm">Current Phase</p>
                      <p className="font-medium">Interior Finishing</p>
                    </div>
                    <div className="flex-1 border border-gray-200 rounded-md p-3">
                      <p className="text-gray-600 text-sm">Estimated Completion</p>
                      <p className="font-medium">{project.completionDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Project Tabs */}
              <Tabs defaultValue="description" className="mb-8">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="bg-white p-6 rounded-b-lg border border-t-0">
                  <h3 className="text-xl font-semibold mb-4">Project Description</h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                  <p className="text-gray-600">
                    This development offers a unique opportunity to own a property in one of the most sought-after areas. 
                    With premium finishes, modern amenities, and strategic location, {project.title} represents an 
                    excellent investment opportunity with great potential for appreciation.
                  </p>
                </TabsContent>
                <TabsContent value="amenities" className="bg-white p-6 rounded-b-lg border border-t-0">
                  <h3 className="text-xl font-semibold mb-4">Project Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5 mr-3">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Modern Architecture</p>
                        <p className="text-gray-600 text-sm">Contemporary design with premium finishes</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5 mr-3">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Swimming Pool</p>
                        <p className="text-gray-600 text-sm">Resort-style pool with lounge area</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5 mr-3">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Fitness Center</p>
                        <p className="text-gray-600 text-sm">State-of-the-art gym equipment</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5 mr-3">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Landscaped Gardens</p>
                        <p className="text-gray-600 text-sm">Beautifully maintained outdoor spaces</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5 mr-3">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">24/7 Security</p>
                        <p className="text-gray-600 text-sm">CCTV surveillance and guard service</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5 mr-3">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Covered Parking</p>
                        <p className="text-gray-600 text-sm">Dedicated parking spots for residents</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="location" className="bg-white p-6 rounded-b-lg border border-t-0">
                  <h3 className="text-xl font-semibold mb-4">Project Location</h3>
                  <p className="text-gray-600 mb-4">
                    {project.title} is located in the {project.location} area, known for its excellent amenities, 
                    accessibility, and premium lifestyle.
                  </p>
                  <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map View Placeholder</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Available Units */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Available Unit Types</h3>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">1 Bedroom Unit</h4>
                          <p className="text-gray-600 mb-2">700-850 sq ft</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-4">1 Bedroom</span>
                            <span className="mr-4">1 Bathroom</span>
                            <span>1 Parking</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                          <div className="mr-6">
                            <span className="block text-xl font-bold text-primary">$350,000</span>
                            <span className="text-sm text-gray-500">Starting price</span>
                          </div>
                          <Button size="sm" className="shrink-0">
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">2 Bedroom Unit</h4>
                          <p className="text-gray-600 mb-2">1,000-1,200 sq ft</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-4">2 Bedrooms</span>
                            <span className="mr-4">2 Bathrooms</span>
                            <span>1 Parking</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                          <div className="mr-6">
                            <span className="block text-xl font-bold text-primary">$550,000</span>
                            <span className="text-sm text-gray-500">Starting price</span>
                          </div>
                          <Button size="sm" className="shrink-0">
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">3 Bedroom Unit</h4>
                          <p className="text-gray-600 mb-2">1,500-1,800 sq ft</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-4">3 Bedrooms</span>
                            <span className="mr-4">2.5 Bathrooms</span>
                            <span>2 Parking</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                          <div className="mr-6">
                            <span className="block text-xl font-bold text-primary">$750,000</span>
                            <span className="text-sm text-gray-500">Starting price</span>
                          </div>
                          <Button size="sm" className="shrink-0">
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Right Column - Contact & Actions */}
            <div className="md:col-span-1">
              {/* Project Details Card */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium">{project.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Units</span>
                      <span className="font-medium">{project.units}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Starting Price</span>
                      <span className="font-medium">${project.startingPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-medium">{project.completionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Developer</span>
                      <span className="font-medium">PrimeEstate Developers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Sales Contact */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" 
                        alt="Sales representative" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Sarah Johnson</h3>
                      <p className="text-gray-500 text-sm">Project Sales Manager</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Phone className="text-primary mr-2 h-4 w-4" />
                      <a href="tel:+15551234567" className="text-gray-600 hover:text-primary">
                        (555) 987-6543
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="text-primary mr-2 h-4 w-4" />
                      <a href="mailto:sarah@primeestate.com" className="text-gray-600 hover:text-primary">
                        sarah@primeestate.com
                      </a>
                    </div>
                  </div>
                  
                  <Button className="w-full mb-3">
                    Contact Sales Team
                  </Button>
                </CardContent>
              </Card>
              
              {/* Project Brochure */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <DownloadCloud className="text-primary mr-2 h-5 w-5" />
                    Project Resources
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Download Brochure
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Floor Plans
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Payment Schedule
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

export default ProjectDetail;
