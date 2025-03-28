import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertChatUserSchema } from "@shared/schema";
import { googleSheetsService } from "./services/googleSheets";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  const apiRouter = app.route('/api');

  // Get all properties
  app.get('/api/properties', async (req: Request, res: Response) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  });

  // Get featured properties
  app.get('/api/properties/featured', async (req: Request, res: Response) => {
    try {
      const featuredProperties = await storage.getFeaturedProperties();
      res.json(featuredProperties);
    } catch (error) {
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

  // Log customer lead to Google Sheets
  app.post('/api/sheets/log-lead', async (req: Request, res: Response) => {
    console.log('Received lead data request:', JSON.stringify(req.body));
    
    try {
      // Check environment variables
      if (!process.env.GOOGLE_SHEET_ID) {
        console.error('GOOGLE_SHEET_ID environment variable is missing');
        return res.status(500).json({ 
          error: 'Server configuration error - missing sheet ID',
          details: 'Contact administrator to verify Google Sheets configuration'
        });
      }
      
      if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
        console.error('Google Sheets credentials are missing');
        return res.status(500).json({ 
          error: 'Server configuration error - missing credentials',
          details: 'Contact administrator to verify Google API credentials'
        });
      }
      
      // Validate required fields
      const leadSchema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        contact: z.string().min(5, 'Contact information must be at least 5 characters'),
        interest: z.string(),
        propertyInterest: z.string().optional(),
        locationInterest: z.string().optional(),
        budgetRange: z.string().optional(),
        notes: z.string().optional()
      });
      
      const validatedData = leadSchema.parse(req.body);
      console.log('Validated lead data:', JSON.stringify(validatedData));
      
      // Add timestamp
      const timestamp = new Date().toISOString();
      
      // Log to Google Sheets
      const success = await googleSheetsService.addCustomerData({
        ...validatedData,
        timestamp
      });
      
      if (success) {
        console.log('Successfully logged lead to Google Sheets');
        res.status(201).json({ message: 'Lead logged successfully' });
      } else {
        console.error('Failed to log lead to Google Sheets - service returned failure');
        res.status(500).json({ 
          error: 'Failed to log lead to Google Sheets',
          details: 'The request was processed but the Google Sheets service could not complete the operation'
        });
      }
    } catch (error: any) {
      console.error('Error in /api/sheets/log-lead:', error);
      
      if (error instanceof z.ZodError) {
        console.error('Validation error:', JSON.stringify(error.errors));
        return res.status(400).json({ 
          error: 'Invalid lead data', 
          details: error.errors 
        });
      }
      
      // Check for specific Google API errors
      if (error.message && error.message.includes('invalid_grant')) {
        console.error('Google API authentication error - invalid_grant');
        return res.status(500).json({ 
          error: 'Google Sheets authentication error',
          details: 'The service account credentials may be invalid or expired' 
        });
      }
      
      if (error.message && error.message.includes('permission_denied')) {
        console.error('Google API permission error - permission_denied');
        return res.status(500).json({ 
          error: 'Google Sheets permission error',
          details: 'The service account does not have permission to access the spreadsheet'
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
