// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  chatUsers;
  properties;
  projects;
  currentChatUserId;
  currentPropertyId;
  currentProjectId;
  constructor() {
    this.chatUsers = /* @__PURE__ */ new Map();
    this.properties = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.currentChatUserId = 1;
    this.currentPropertyId = 1;
    this.currentProjectId = 1;
    this.initializeData();
  }
  // Chat Users Methods
  async getChatUser(id) {
    return this.chatUsers.get(id);
  }
  async getChatUserByContact(contact) {
    return Array.from(this.chatUsers.values()).find(
      (user) => user.contact === contact
    );
  }
  async createChatUser(user) {
    const id = this.currentChatUserId++;
    const chatUser = { ...user, id };
    this.chatUsers.set(id, chatUser);
    return chatUser;
  }
  async updateChatUserConversation(id, conversation) {
    const user = await this.getChatUser(id);
    if (!user) return void 0;
    const updatedUser = { ...user, conversation };
    this.chatUsers.set(id, updatedUser);
    return updatedUser;
  }
  // Properties Methods
  async getProperties() {
    return Array.from(this.properties.values());
  }
  async getProperty(id) {
    return this.properties.get(id);
  }
  async getFeaturedProperties() {
    return Array.from(this.properties.values()).filter(
      (property) => property.isFeatured
    );
  }
  async getPropertiesByType(type) {
    return Array.from(this.properties.values()).filter(
      (property) => property.type.toLowerCase() === type.toLowerCase()
    );
  }
  async getPropertiesByLocation(location) {
    return Array.from(this.properties.values()).filter(
      (property) => property.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  // Projects Methods
  async getProjects() {
    return Array.from(this.projects.values());
  }
  async getProject(id) {
    return this.projects.get(id);
  }
  // Initialize data
  initializeData() {
    const sampleProperties = [
      {
        title: "Modern Family Home",
        description: "Beautiful modern family home with spacious rooms and a gorgeous backyard.",
        price: 75e4,
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
        price: 65e4,
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
        price: 45e4,
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
    sampleProperties.forEach((property) => {
      const id = this.currentPropertyId++;
      this.properties.set(id, { ...property, id });
    });
    const sampleProjects = [
      {
        title: "Sunset Villas",
        description: "Luxury villas with panoramic ocean views and private pools.",
        location: "Beachfront",
        units: "24 Villas",
        startingPrice: 95e4,
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
        startingPrice: 35e4,
        completionDate: "March 2024",
        status: "Pre-selling",
        progressPercentage: 40,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
      }
    ];
    sampleProjects.forEach((project) => {
      const id = this.currentProjectId++;
      this.projects.set(id, { ...project, id });
    });
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var chatUsers = pgTable("chat_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  conversation: json("conversation").$type()
});
var insertChatUserSchema = createInsertSchema(chatUsers).pick({
  name: true,
  contact: true,
  conversation: true
});
var properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  garage: integer("garage").notNull(),
  isFeatured: boolean("is_featured").default(false),
  image: text("image").notNull()
});
var insertPropertySchema = createInsertSchema(properties).pick({
  title: true,
  description: true,
  price: true,
  location: true,
  type: true,
  status: true,
  bedrooms: true,
  bathrooms: true,
  squareFeet: true,
  garage: true,
  isFeatured: true,
  image: true
});
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  units: text("units").notNull(),
  startingPrice: integer("starting_price").notNull(),
  completionDate: text("completion_date").notNull(),
  status: text("status").notNull(),
  progressPercentage: integer("progress_percentage").notNull(),
  image: text("image").notNull()
});
var insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  location: true,
  units: true,
  startingPrice: true,
  completionDate: true,
  status: true,
  progressPercentage: true,
  image: true
});

// server/services/googleSheets.ts
import { google } from "googleapis";
var contactRowMap = /* @__PURE__ */ new Map();
var GoogleSheetsService = class {
  sheets;
  sheetId;
  constructor() {
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    this.sheets = google.sheets({ version: "v4", auth });
    this.sheetId = process.env.GOOGLE_SHEET_ID || "";
    if (!this.sheetId) {
      console.warn("Warning: GOOGLE_SHEET_ID environment variable is not set.");
    }
  }
  /**
   * Check if a contact exists in the sheet and find its row number
   */
  async findContactRow(contact) {
    try {
      if (contactRowMap.has(contact)) {
        return contactRowMap.get(contact) || null;
      }
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: "Sheet1!C:C"
        // Contact column (Column C)
      });
      const rows = response.data.values;
      if (rows && rows.length > 0) {
        for (let i = 1; i < rows.length; i++) {
          if (rows[i] && rows[i][0] === contact) {
            contactRowMap.set(contact, i + 1);
            return i + 1;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error finding contact in sheet:", error);
      return null;
    }
  }
  /**
   * Adds a new row to the Google Sheet with customer data or updates an existing row
   */
  async addCustomerData(data) {
    try {
      if (!this.sheetId) {
        console.error("Error: Google Sheet ID is not configured");
        throw new Error("Google Sheet ID is not configured");
      }
      console.log("Adding customer data to Google Sheets for contact:", data.contact);
      const values = [
        data.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
        data.name,
        data.contact,
        data.interest,
        data.propertyInterest || "",
        data.locationInterest || "",
        data.budgetRange || "",
        data.notes || ""
      ];
      console.log("Checking if contact already exists in Google Sheets");
      const existingRow = await this.findContactRow(data.contact);
      if (existingRow) {
        console.log(`Contact ${data.contact} found at row ${existingRow}, updating existing entry`);
        const result = await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.sheetId,
          range: `Sheet1!A${existingRow}:H${existingRow}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [values]
          }
        });
        if (result.status === 200) {
          console.log(`Successfully updated existing contact at row ${existingRow}`);
          return true;
        } else {
          console.error(`Error updating row ${existingRow}, status code: ${result.status}`);
          return false;
        }
      } else {
        console.log(`Contact ${data.contact} not found, appending new row`);
        const result = await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.sheetId,
          range: "Sheet1!A:H",
          valueInputOption: "RAW",
          requestBody: {
            values: [values]
          }
        });
        if (result.status === 200) {
          const updatedRange = result.data.updates?.updatedRange;
          if (updatedRange) {
            const match = updatedRange.match(/A(\d+):/);
            if (match && match[1]) {
              const rowNumber = parseInt(match[1]);
              contactRowMap.set(data.contact, rowNumber);
              console.log(`New contact added at approximate row ${rowNumber}`);
            } else {
              console.log("Added new contact but could not determine row number");
            }
          }
          return true;
        }
        console.error("Failed to append new row, status code:", result.status);
        return false;
      }
    } catch (error) {
      console.error("Error adding/updating data in Google Sheet:", error);
      if (error.response) {
        console.error("Google API error details:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        if (error.response.status === 403) {
          console.error("Permission denied. Make sure the service account has Editor access to the spreadsheet");
        } else if (error.response.status === 404) {
          console.error("Spreadsheet not found. Check the GOOGLE_SHEET_ID value");
        }
      }
      throw error;
    }
  }
};
var googleSheetsService = new GoogleSheetsService();

// server/routes.ts
async function registerRoutes(app2) {
  const apiRouter = app2.route("/api");
  app2.get("/api/properties", async (req, res) => {
    try {
      const properties2 = await storage.getProperties();
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });
  app2.get("/api/properties/featured", async (req, res) => {
    try {
      const featuredProperties = await storage.getFeaturedProperties();
      res.json(featuredProperties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });
  app2.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });
  app2.get("/api/properties/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const properties2 = await storage.getPropertiesByType(type);
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties by type" });
    }
  });
  app2.get("/api/properties/location/:location", async (req, res) => {
    try {
      const location = req.params.location;
      const properties2 = await storage.getPropertiesByLocation(location);
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties by location" });
    }
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });
  app2.post("/api/chat/users", async (req, res) => {
    try {
      const validatedData = insertChatUserSchema.parse(req.body);
      const existingUser = await storage.getChatUserByContact(validatedData.contact);
      if (existingUser) {
        if (validatedData.conversation) {
          const updatedUser = await storage.updateChatUserConversation(
            existingUser.id,
            validatedData.conversation
          );
          return res.json(updatedUser);
        }
        return res.json(existingUser);
      }
      const newUser = await storage.createChatUser(validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create chat user" });
    }
  });
  app2.patch("/api/chat/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const conversationSchema = z.array(z.object({
        role: z.enum(["user", "bot"]),
        message: z.string(),
        timestamp: z.number()
      }));
      const conversation = conversationSchema.parse(req.body.conversation);
      const updatedUser = await storage.updateChatUserConversation(id, conversation);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update chat user conversation" });
    }
  });
  app2.post("/api/sheets/log-lead", async (req, res) => {
    console.log("Received lead data request:", JSON.stringify(req.body));
    try {
      if (!process.env.GOOGLE_SHEET_ID) {
        console.error("GOOGLE_SHEET_ID environment variable is missing");
        return res.status(500).json({
          error: "Server configuration error - missing sheet ID",
          details: "Contact administrator to verify Google Sheets configuration"
        });
      }
      if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
        console.error("Google Sheets credentials are missing");
        return res.status(500).json({
          error: "Server configuration error - missing credentials",
          details: "Contact administrator to verify Google API credentials"
        });
      }
      const leadSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        contact: z.string().min(5, "Contact information must be at least 5 characters"),
        interest: z.string(),
        propertyInterest: z.string().optional(),
        locationInterest: z.string().optional(),
        budgetRange: z.string().optional(),
        notes: z.string().optional()
      });
      const validatedData = leadSchema.parse(req.body);
      console.log("Validated lead data:", JSON.stringify(validatedData));
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const success = await googleSheetsService.addCustomerData({
        ...validatedData,
        timestamp
      });
      if (success) {
        console.log("Successfully logged lead to Google Sheets");
        res.status(201).json({ message: "Lead logged successfully" });
      } else {
        console.error("Failed to log lead to Google Sheets - service returned failure");
        res.status(500).json({
          error: "Failed to log lead to Google Sheets",
          details: "The request was processed but the Google Sheets service could not complete the operation"
        });
      }
    } catch (error) {
      console.error("Error in /api/sheets/log-lead:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation error:", JSON.stringify(error.errors));
        return res.status(400).json({
          error: "Invalid lead data",
          details: error.errors
        });
      }
      if (error.message && error.message.includes("invalid_grant")) {
        console.error("Google API authentication error - invalid_grant");
        return res.status(500).json({
          error: "Google Sheets authentication error",
          details: "The service account credentials may be invalid or expired"
        });
      }
      if (error.message && error.message.includes("permission_denied")) {
        console.error("Google API permission error - permission_denied");
        return res.status(500).json({
          error: "Google Sheets permission error",
          details: "The service account does not have permission to access the spreadsheet"
        });
      }
      res.status(500).json({
        error: "Failed to log lead",
        details: error.message || "Unknown error occurred"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
