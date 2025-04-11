import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./utils/databaseSeeder";
import { testDatabaseConnection } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware to allow cross-origin requests from any domain (for demo purposes)
app.use((req, res, next) => {
  // For this demo project, allow all origins to simplify deployment and testing
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  // Allow specific headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Allow specific methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Test the database connection first
  try {
    // Verify database connection before proceeding
    console.log('Testing database connectivity...');
    const isConnected = await testDatabaseConnection();
    
    if (isConnected) {
      // If connection is successful, proceed with seeding
      try {
        await seedDatabase();
        console.log('Database initialization complete');
      } catch (seedError) {
        console.error('Error seeding database:', seedError);
        // Log more diagnostic info for Render deployment
        if (process.env.RENDER) {
          console.error('Running on Render, database seeding failed');
          if (seedError instanceof Error) {
            console.error('Error details:', seedError.message);
            console.error('Stack trace:', seedError.stack);
          }
        }
      }
    } else {
      console.error('Database connection test failed - skipping seeding');
      console.error('IMPORTANT: API endpoints requiring database access may not work');
      
      // If on Render, print a more detailed diagnostic message
      if (process.env.RENDER) {
        console.error('Running on Render environment - database connection issues');
        console.error('Check that the DATABASE_URL environment variable is correctly set');
        console.error('Ensure database permissions allow connections from Render IP addresses');
        console.error('API endpoints requiring database access may return empty arrays');
      }
    }
  } catch (connectionError) {
    console.error('Critical database connection error:', connectionError);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
