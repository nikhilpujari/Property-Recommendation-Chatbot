import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set!');
  throw new Error('Database connection URL is missing. Please check your environment variables.');
}

console.log('Initializing database connection...');

// Safely get the database URL 
const dbUrl = process.env.DATABASE_URL;

// Configure connection with SSL options (needed for Render and most cloud DB providers)
const connectionConfig = {
  max: 5,                  // Maximum number of connections in pool
  idle_timeout: 30,        // Terminate connections after 30 seconds of inactivity
  connect_timeout: 15,     // How long to wait for connection before failing  
  ssl: { rejectUnauthorized: false },  // Allow self-signed certificates
};

let queryClient;

try {
  // Create connection pool
  queryClient = postgres(dbUrl, connectionConfig);
  console.log('Database connection pool initialized');
} catch (error) {
  console.error('Error initializing database connection pool:', error);
  throw new Error(`Failed to setup database connection: ${error.message}`);
}

// Create the database instance with the schema
export const db = drizzle(queryClient, { schema });

/**
 * Tests the database connection by performing a simple query
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 */
export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    // Simple query to verify connection is working
    const result = await queryClient`SELECT 1 as connected`;
    
    if (result && result[0]?.connected === 1) {
      console.log('✅ Database connection test successful');
      return true;
    } else {
      console.error('Database connection test query returned unexpected result');
      return false;
    }
  } catch (error) {
    console.error('Database connection test failed with error:', error);
    return false;
  }
}