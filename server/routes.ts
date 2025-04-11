import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertChatUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  const apiRouter = app.route('/api');

  // Get all properties
  app.get('/api/properties', async (req: Request, res: Response) => {
    try {
      console.log('GET /api/properties request received');
      
      // Add CORS headers to this specific endpoint for troubleshooting
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
      
      const properties = await storage.getProperties();
      console.log(`Retrieved ${properties.length} properties from storage`);
      
      // Send explicit response with proper content type
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(properties);
    } catch (error: any) {
      console.error('Error in GET /api/properties:', error);
      res.status(500).json({ 
        error: 'Failed to fetch properties',
        message: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Get featured properties
  app.get('/api/properties/featured', async (req: Request, res: Response) => {
    try {
      const featuredProperties = await storage.getFeaturedProperties();
      res.json(featuredProperties);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      res.status(500).json({ error: 'Failed to fetch featured properties' });
    }
  });

  // Get property by ID
  app.get('/api/properties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }
      
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  });

  // Get properties by type
  app.get('/api/properties/type/:type', async (req: Request, res: Response) => {
    try {
      const type = req.params.type;
      const properties = await storage.getPropertiesByType(type);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch properties by type' });
    }
  });

  // Get properties by location
  app.get('/api/properties/location/:location', async (req: Request, res: Response) => {
    try {
      const location = req.params.location;
      const properties = await storage.getPropertiesByLocation(location);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch properties by location' });
    }
  });

  // Get all projects
  app.get('/api/projects', async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Get project by ID
  app.get('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid project ID' });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  // Create chat user or update existing one
  app.post('/api/chat/users', async (req: Request, res: Response) => {
    try {
      const validatedData = insertChatUserSchema.parse(req.body);
      
      // Check if user already exists by contact
      const existingUser = await storage.getChatUserByContact(validatedData.contact);
      
      if (existingUser) {
        // Update conversation if provided
        if (validatedData.conversation) {
          const updatedUser = await storage.updateChatUserConversation(
            existingUser.id, 
            validatedData.conversation
          );
          return res.json(updatedUser);
        }
        return res.json(existingUser);
      }
      
      // Create new user
      const newUser = await storage.createChatUser(validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create chat user' });
    }
  });

  // Update chat user conversation
  app.patch('/api/chat/users/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Validate the conversation array
      const conversationSchema = z.array(z.object({
        role: z.enum(['user', 'bot']),
        message: z.string(),
        timestamp: z.number()
      }));
      
      const conversation = conversationSchema.parse(req.body.conversation);
      
      const updatedUser = await storage.updateChatUserConversation(id, conversation);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update chat user conversation' });
    }
  });

  // Get all chat users
  app.get('/api/chat/users', async (req: Request, res: Response) => {
    try {
      // Get current leads to ensure we have chat user records for all leads
      const leads = await storage.getLeads();
      
      // Create chat users from leads if they don't exist
      if (leads && leads.length > 0) {
        for (const lead of leads) {
          try {
            // Check if chat user exists
            const existingUser = await storage.getChatUserByContact(lead.contact);
            
            if (!existingUser) {
              // Create chat user from lead
              await storage.createChatUser({
                name: lead.name,
                contact: lead.contact,
                conversation: null
              });
              console.log(`Created chat user from lead: ${lead.name}`);
            }
          } catch (e) {
            console.error(`Failed to process chat user for lead ${lead.id}:`, e);
          }
        }
      }
      
      // Get all chat users from database with unique contact info
      const allLeads = await storage.getLeads();
      const uniqueContacts = new Set();
      const uniqueLeads = [];
      
      // Create a set of unique contacts and corresponding leads
      for (const lead of allLeads) {
        if (!uniqueContacts.has(lead.contact)) {
          uniqueContacts.add(lead.contact);
          uniqueLeads.push(lead);
        }
      }
      
      // Convert leads to chat users format
      const users = uniqueLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        contact: lead.contact,
        conversation: null
      }));
      
      res.json(users);
    } catch (error) {
      console.error('Error fetching chat users:', error);
      res.status(500).json({ error: 'Failed to fetch chat users' });
    }
  });
  
  // Get all leads
  app.get('/api/leads', async (req: Request, res: Response) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });
  
  // Delete a lead by ID
  app.delete('/api/leads/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid lead ID' });
      }
      
      const success = await storage.deleteLead(id);
      if (success) {
        res.status(200).json({ message: 'Lead deleted successfully' });
      } else {
        res.status(404).json({ error: 'Lead not found' });
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      res.status(500).json({ error: 'Failed to delete lead' });
    }
  });

  // Log customer lead to Database and create/update chat user
  app.post('/api/sheets/log-lead', async (req: Request, res: Response) => {
    console.log('Received lead data request:', JSON.stringify(req.body));
    
    try {
      // Validate required fields
      const leadSchema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        contact: z.string().min(5, 'Contact information must be at least 5 characters'),
        interest: z.string(),
        propertyInterest: z.string().optional(),
        locationInterest: z.string().optional(),
        budgetRange: z.string().optional(),
        notes: z.string().optional(),
        conversation: z.array(z.object({
          role: z.enum(['user', 'bot']),
          message: z.string(),
          timestamp: z.number()
        })).optional()
      });
      
      const validatedData = leadSchema.parse(req.body);
      console.log('Validated lead data:', JSON.stringify(validatedData));
      
      // Check if lead with this contact already exists
      const existingLeads = await storage.getLeads();
      const existingLead = existingLeads.find(lead => lead.contact === validatedData.contact);
      
      let result;
      let leadId;
      
      if (existingLead) {
        // Update the existing lead
        result = await storage.updateLead(existingLead.id, {
          interest: validatedData.interest,
          propertyInterest: validatedData.propertyInterest || null,
          locationInterest: validatedData.locationInterest || null,
          budgetRange: validatedData.budgetRange || null,
          notes: validatedData.notes || null
        });
        leadId = existingLead.id;
        console.log(`Updated existing lead with ID: ${existingLead.id}`);
      } else {
        // Create a new lead
        result = await storage.createLead({
          name: validatedData.name,
          contact: validatedData.contact,
          interest: validatedData.interest,
          propertyInterest: validatedData.propertyInterest || null,
          locationInterest: validatedData.locationInterest || null,
          budgetRange: validatedData.budgetRange || null,
          notes: validatedData.notes || null,
          assignedAgent: null,
          followUpDate: null
        });
        leadId = result.id;
        console.log('Created new lead in database with ID:', leadId);
      }
      
      // Check if chat user exists and create/update as needed
      const existingChatUser = await storage.getChatUserByContact(validatedData.contact);
      
      if (existingChatUser) {
        // If conversation data was provided, update it
        if (validatedData.conversation) {
          await storage.updateChatUserConversation(
            existingChatUser.id,
            validatedData.conversation
          );
          console.log(`Updated chat user conversation for ID: ${existingChatUser.id}`);
        }
      } else {
        // Create new chat user
        const chatUser = await storage.createChatUser({
          name: validatedData.name,
          contact: validatedData.contact,
          conversation: validatedData.conversation || null
        });
        console.log(`Created new chat user with ID: ${chatUser.id}`);
      }
      
      console.log('Successfully saved lead to database');
      res.status(201).json({ 
        message: 'Lead logged successfully', 
        data: result,
        leadId: leadId // Return the lead ID so the client can use it for conversation updates
      });
    } catch (error: any) {
      console.error('Error in /api/sheets/log-lead:', error);
      
      if (error instanceof z.ZodError) {
        console.error('Validation error:', JSON.stringify(error.errors));
        return res.status(400).json({ 
          error: 'Invalid lead data', 
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to log lead',
        details: error.message || 'Unknown error occurred'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
