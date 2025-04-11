import { db } from '../db';
import { properties, projects, leads, chatUsers } from '@shared/schema';
import { sql } from 'drizzle-orm';

/**
 * Utility to check if all required database tables exist and have data
 * Run this with: npx tsx server/utils/checkDatabaseTables.ts
 */
async function checkDatabaseTables() {
  console.log('🔍 Checking database tables...');
  
  try {
    // Check if database is accessible
    console.log('Testing database connection...');
    const testQuery = await db.execute(sql`SELECT 1 as connected`);
    console.log('✅ Database connection successful');
    
    // Check properties table
    const propertyCount = await db.select({ count: sql<number>`count(*)` }).from(properties);
    console.log(`Properties table has ${propertyCount[0].count} records`);
    
    if (propertyCount[0].count > 0) {
      // Show sample property
      const sampleProperties = await db.select().from(properties).limit(1);
      console.log('Sample property:', JSON.stringify(sampleProperties[0], null, 2));
    }
    
    // Check projects table
    const projectCount = await db.select({ count: sql<number>`count(*)` }).from(projects);
    console.log(`Projects table has ${projectCount[0].count} records`);
    
    // Check leads table
    const leadCount = await db.select({ count: sql<number>`count(*)` }).from(leads);
    console.log(`Leads table has ${leadCount[0].count} records`);
    
    // Check chat_users table
    const chatUserCount = await db.select({ count: sql<number>`count(*)` }).from(chatUsers);
    console.log(`Chat users table has ${chatUserCount[0].count} records`);
    
    console.log('\n📊 Database Tables Summary:');
    console.log('-------------------------');
    console.log(`Properties: ${propertyCount[0].count} records`);
    console.log(`Projects: ${projectCount[0].count} records`);
    console.log(`Leads: ${leadCount[0].count} records`);
    console.log(`Chat Users: ${chatUserCount[0].count} records`);
    console.log('-------------------------');
    
    if (propertyCount[0].count === 0) {
      console.log('⚠️ Warning: Properties table is empty!');
      console.log('This will cause empty responses from the /api/properties endpoint.');
    }
    
    console.log('\n✅ Database check complete');
    
  } catch (error) {
    console.error('❌ Error checking database tables:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
  } finally {
    process.exit(0);
  }
}

// Run the check
checkDatabaseTables();