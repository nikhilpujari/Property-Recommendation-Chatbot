import { 
  chatUsers, 
  properties, 
  projects, 
  type ChatUser, 
  type InsertChatUser, 
  type Property, 
  type InsertProperty, 
  type Project, 
  type InsertProject,
  type ConversationMessage
} from "@shared/schema";

export interface IStorage {
  // Chat Users
  getChatUser(id: number): Promise<ChatUser | undefined>;
  getChatUserByContact(contact: string): Promise<ChatUser | undefined>;
  createChatUser(user: InsertChatUser): Promise<ChatUser>;
  updateChatUserConversation(id: number, conversation: ConversationMessage[]): Promise<ChatUser | undefined>;
  
  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getFeaturedProperties(): Promise<Property[]>;
  getPropertiesByType(type: string): Promise<Property[]>;
  getPropertiesByLocation(location: string): Promise<Property[]>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
}

export class MemStorage implements IStorage {
  private chatUsers: Map<number, ChatUser>;
  private properties: Map<number, Property>;
  private projects: Map<number, Project>;
  private currentChatUserId: number;
  private currentPropertyId: number;
  private currentProjectId: number;

  constructor() {
    this.chatUsers = new Map();
    this.properties = new Map();
    this.projects = new Map();
    this.currentChatUserId = 1;
    this.currentPropertyId = 1;
    this.currentProjectId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // Chat Users Methods
  async getChatUser(id: number): Promise<ChatUser | undefined> {
    return this.chatUsers.get(id);
  }

  async getChatUserByContact(contact: string): Promise<ChatUser | undefined> {
    return Array.from(this.chatUsers.values()).find(
      (user) => user.contact === contact,
    );
  }

  async createChatUser(user: InsertChatUser): Promise<ChatUser> {
    const id = this.currentChatUserId++;
    const chatUser: ChatUser = { ...user, id };
    this.chatUsers.set(id, chatUser);
    return chatUser;
  }

  async updateChatUserConversation(id: number, conversation: ConversationMessage[]): Promise<ChatUser | undefined> {
    const user = await this.getChatUser(id);
    if (!user) return undefined;
    
    const updatedUser: ChatUser = { ...user, conversation };
    this.chatUsers.set(id, updatedUser);
    return updatedUser;
  }

  // Properties Methods
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isFeatured,
    );
  }

  async getPropertiesByType(type: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.type.toLowerCase() === type.toLowerCase(),
    );
  }

  async getPropertiesByLocation(location: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.location.toLowerCase().includes(location.toLowerCase()),
    );
  }

  // Projects Methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  // Initialize data
  private initializeData() {
    // Properties
    const sampleProperties: InsertProperty[] = [
      {
        title: "Modern Family Home",
        description: "Beautiful modern family home with spacious rooms and a gorgeous backyard.",
        price: 750000,
        location: "123 Main St, Downtown",
        type: "House",
        status: "For Sale",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2400,
        garage: 2,
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
      },
      {
        title: "Luxury Downtown Apartment",
        description: "High-end apartment in the heart of the city with beautiful views and amenities.",
        price: 3500,
        location: "456 Park Ave, Downtown",
        type: "Apartment",
        status: "For Rent",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        garage: 1,
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
      },
      {
        title: "Suburban Family Home",
        description: "Spacious family home in a peaceful suburb with excellent schools nearby.",
        price: 650000,
        location: "789 Oak Dr, Suburb",
        type: "House",
        status: "For Sale",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2800,
        garage: 2,
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
      },
      {
        title: "Cozy Beachfront Condo",
        description: "Beautiful condo with amazing ocean views and direct beach access.",
        price: 450000,
        location: "101 Beach Rd, Beachfront",
        type: "Condo",
        status: "For Sale",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1100,
        garage: 1,
        isFeatured: false,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
      }
    ];

    sampleProperties.forEach(property => {
      const id = this.currentPropertyId++;
      this.properties.set(id, { ...property, id });
    });

    // Projects
    const sampleProjects: InsertProject[] = [
      {
        title: "Sunset Villas",
        description: "Luxury villas with panoramic ocean views and private pools.",
        location: "Beachfront",
        units: "24 Villas",
        startingPrice: 950000,
        completionDate: "December 2023",
        status: "Coming Soon",
        progressPercentage: 80,
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
      },
      {
        title: "Urban Heights",
        description: "Modern high-rise apartments in the heart of downtown with premium amenities.",
        location: "Downtown",
        units: "120 Apartments",
        startingPrice: 350000,
        completionDate: "March 2024",
        status: "Pre-selling",
        progressPercentage: 40,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
      }
    ];

    sampleProjects.forEach(project => {
      const id = this.currentProjectId++;
      this.projects.set(id, { ...project, id });
    });
  }
}

export const storage = new MemStorage();
