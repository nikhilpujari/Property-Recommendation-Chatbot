import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@shared/schema";

const Projects = () => {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  if (isLoading) {
    return (
      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-2">Ongoing Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Invest in our new development projects with great potential for growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-y-3 mb-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="w-1/2">
                        <div className="h-4 bg-gray-200 animate-pulse mb-1 w-1/2"></div>
                        <div className="h-6 bg-gray-200 animate-pulse w-3/4"></div>
                      </div>
                    ))}
                  </div>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gray-300 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 animate-pulse w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !projects) {
    return (
      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ongoing Projects</h2>
          <p className="text-red-500">
            Failed to load projects. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-2">Ongoing Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Invest in our new development projects with great potential for growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <div className="text-white">
                    <span className="bg-accent text-white text-xs font-medium px-2.5 py-1 rounded">
                      {project.status}
                    </span>
                    <h3 className="text-xl font-bold mt-2">{project.title}</h3>
                    <p className="text-sm">Completion: {project.completionDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-y-3 mb-4">
                  <div className="w-1/2">
                    <span className="text-gray-600 text-sm">Location</span>
                    <p className="font-medium">{project.location}</p>
                  </div>
                  <div className="w-1/2">
                    <span className="text-gray-600 text-sm">Units</span>
                    <p className="font-medium">{project.units}</p>
                  </div>
                  <div className="w-1/2">
                    <span className="text-gray-600 text-sm">Starting Price</span>
                    <p className="font-medium">${project.startingPrice.toLocaleString()}</p>
                  </div>
                  <div className="w-1/2">
                    <span className="text-gray-600 text-sm">Status</span>
                    <p className="font-medium">{project.progressPercentage}% Complete</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Progress value={project.progressPercentage} className="h-2.5" />
                </div>
                
                <Link href={`/projects/${project.id}`} className="inline-block text-primary hover:underline font-medium">
                  View Project Details <ArrowRight className="inline ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
