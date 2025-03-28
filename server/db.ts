import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Initialize the database connection
const databaseUrl = process.env.DATABASE_URL as string;
const queryClient = postgres(databaseUrl, { max: 10 });

// Create the database instance with the schema
export const db = drizzle(queryClient, { schema });