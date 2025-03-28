import { db } from './db';
import { 
  chatUsers, 
  properties, 
  projects, 
  leads,
  type ChatUser, 
  type InsertChatUser, 
  type Property, 
  type InsertProperty, 
  type Project, 
  type InsertProject,
  type Lead,
  type InsertLead,
  type ConversationMessage
} from "@shared/schema";
import { IStorage } from './storage';
import { eq, desc, sql } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // Chat Users Methods
  async getChatUser(id: number): Promise<ChatUser | undefined> {
    const [user] = await db.select().from(chatUsers).where(eq(chatUsers.id, id));
    return user || undefined;
  }

  async getChatUserByContact(contact: string): Promise<ChatUser | undefined> {
    const [user] = await db.select().from(chatUsers).where(eq(chatUsers.contact, contact));
    return user || undefined;
  }

  async createChatUser(user: InsertChatUser): Promise<ChatUser> {
    // Create values array with the user data
    const [createdUser] = await db.insert(chatUsers).values([user]).returning();
    return createdUser;
  }

  async updateChatUserConversation(id: number, conversation: ConversationMessage[]): Promise<ChatUser | undefined> {
    const [updatedUser] = await db
      .update(chatUsers)
      .set({ conversation })
      .where(eq(chatUsers.id, id))
      .returning();
    return updatedUser || undefined;
  }

  // Properties Methods
  async getProperties(): Promise<Property[]> {
    return await db.select().from(properties);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.isFeatured, true));
  }

  async getPropertiesByType(type: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.type, type));
  }

  async getPropertiesByLocation(location: string): Promise<Property[]> {
    // PostgreSQL case-insensitive search using ILIKE
    return await db
      .select()
      .from(properties)
      .where(sql`${properties.location} ILIKE ${`%${location}%`}`);
  }

  // Projects Methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  // Leads Methods
  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [createdLead] = await db.insert(leads).values([lead]).returning();
    return createdLead;
  }

  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updatedLead] = await db
      .update(leads)
      .set(lead)
      .where(eq(leads.id, id))
      .returning();
    return updatedLead || undefined;
  }

  async deleteLead(id: number): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id)).returning({ id: leads.id });
    return result.length > 0;
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.status, status));
  }

  async getLeadsByAgent(agent: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.assignedAgent, agent));
  }
}