import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/config';
import axios from 'axios';
import { useLocation } from 'wouter';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Lead {
  id: number;
  name: string;
  contact: string;
  interest: string;
  createdAt: string;
  propertyInterest: string | null;
  locationInterest: string | null;
  budgetRange: string | null;
  notes: string | null;
  assignedAgent: string | null;
  followUpDate: string | null;
}

// Chat User interface removed as no longer needed

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  garage: number;
  isFeatured: boolean | null;
  image: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  status: string;
  completionDate: string;
  totalUnits: number;
  unitsAvailable: number;
  priceRange: string;
  image: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('leads');
  const [, navigate] = useLocation();
  
  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch leads
  const { 
    data: leads = [], 
    isLoading: isLoadingLeads,
    refetch: refetchLeads
  } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/leads`);
        return response.data;
      } catch (error) {
        console.error('Error fetching leads:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch when tab becomes active
  });

  // Chat users query removed

  // Fetch properties
  const { 
    data: properties = [], 
    isLoading: isLoadingProperties,
    refetch: refetchProperties
  } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/properties`);
        return response.data;
      } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Fetch projects
  const { 
    data: projects = [], 
    isLoading: isLoadingProjects,
    refetch: refetchProjects
  } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/projects`);
        return response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Handle tab change and refetch data
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Refetch data based on the selected tab
    if (value === 'leads') {
      refetchLeads();
    } else if (value === 'properties') {
      refetchProperties();
    } else if (value === 'projects') {
      refetchProjects();
    }
  };
  
  // Refetch all data
  const refreshAllData = () => {
    refetchLeads();
    refetchProperties();
    refetchProjects();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={refreshAllData}
            className="flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            Refresh Data
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Site
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              sessionStorage.removeItem('isAuthenticated');
              navigate('/login');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="leads" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>
                View and manage customer leads and inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLeads ? (
                <p>Loading leads...</p>
              ) : (
                <Table>
                  <TableCaption>List of customer leads</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No leads found
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.map((lead: Lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>{lead.id}</TableCell>
                          <TableCell>{lead.name}</TableCell>
                          <TableCell>{lead.contact}</TableCell>
                          <TableCell>{lead.interest}</TableCell>
                          <TableCell>
                            {formatDate(lead.createdAt)}
                          </TableCell>
                          <TableCell>{lead.propertyInterest || 'N/A'}</TableCell>
                          <TableCell>{lead.budgetRange || 'N/A'}</TableCell>
                          <TableCell>{lead.assignedAgent || 'Unassigned'}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete lead: ${lead.name}?`)) {
                                  // Call the delete API
                                  axios.delete(`${API_BASE_URL}/api/leads/${lead.id}`)
                                    .then(() => {
                                      // Refresh the leads list
                                      refetchLeads();
                                      alert('Lead deleted successfully');
                                    })
                                    .catch(error => {
                                      console.error('Error deleting lead:', error);
                                      alert('Failed to delete lead');
                                    });
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
              <CardDescription>
                Manage property listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProperties ? (
                <p>Loading properties...</p>
              ) : (
                <Table>
                  <TableCaption>List of properties</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No properties found
                        </TableCell>
                      </TableRow>
                    ) : (
                      properties.map((property: Property) => (
                        <TableRow key={property.id}>
                          <TableCell>{property.id}</TableCell>
                          <TableCell className="font-medium">
                            {property.title}
                          </TableCell>
                          <TableCell>{property.type}</TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>${property.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                property.status === 'For Sale'
                                  ? 'default'
                                  : property.status === 'For Rent'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {property.isFeatured ? 'Yes' : 'No'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage real estate development projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProjects ? (
                <p>Loading projects...</p>
              ) : (
                <Table>
                  <TableCaption>List of projects</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Price Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No projects found
                        </TableCell>
                      </TableRow>
                    ) : (
                      projects.map((project: Project) => (
                        <TableRow key={project.id}>
                          <TableCell>{project.id}</TableCell>
                          <TableCell className="font-medium">
                            {project.title}
                          </TableCell>
                          <TableCell>{project.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === 'Under Construction'
                                  ? 'default'
                                  : project.status === 'Completed'
                                  ? 'outline'
                                  : 'secondary'
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{project.completionDate}</TableCell>
                          <TableCell>{project.totalUnits}</TableCell>
                          <TableCell>{project.unitsAvailable}</TableCell>
                          <TableCell>{project.priceRange}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}