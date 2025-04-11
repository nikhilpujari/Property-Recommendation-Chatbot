import { db } from '../db';
import { properties, projects, type InsertProperty, type InsertProject } from '@shared/schema';
import { sql } from 'drizzle-orm';

// Sample property data
const sampleProperties: InsertProperty[] = [
  {
    title: 'Modern Family Home',
    description: 'A beautiful 4-bedroom house with modern amenities and a spacious backyard.',
    price: 750000,
    location: 'Beverly Hills',
    type: 'Residential',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    garage: 2,
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isFeatured: true,
  },
  {
    title: 'Downtown Apartment',
    description: 'Luxurious 2-bedroom apartment in the heart of downtown with amazing city views.',
    price: 550000,
    location: 'Downtown',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    garage: 1,
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1551361415-69c87624334f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isFeatured: false,
  },
  {
    title: 'Luxury Beachfront Villa',
    description: 'Exclusive beachfront property with private access to the beach and stunning ocean views.',
    price: 2500000,
    location: 'Malibu',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4500,
    garage: 3,
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isFeatured: true,
  },
  {
    title: 'Cozy Studio for Rent',
    description: 'A charming studio apartment perfect for young professionals or students.',
    price: 1200,
    location: 'West Hollywood',
    type: 'Apartment',
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 500,
    garage: 0,
    status: 'For Rent',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isFeatured: false,
  }
];

// Sample project data
const sampleProjects: InsertProject[] = [
  {
    title: 'Sunset Villas',
    description: 'A new development of luxury villas with ocean views and modern amenities.',
    location: 'Coastal Hills',
    status: 'Under Construction',
    completionDate: '2025-12-31',
    units: '24 Units',
    startingPrice: 1200000,
    progressPercentage: 65,
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    title: 'Metro Heights',
    description: 'Modern apartment complex in the heart of downtown with retail and restaurant spaces.',
    location: 'Downtown',
    status: 'Planning',
    completionDate: '2026-06-30',
    units: '120 Units',
    startingPrice: 400000,
    progressPercentage: 20,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    title: 'Green Valley Community',
    description: 'Eco-friendly residential community with green spaces and sustainable features.',
    location: 'Valley District',
    status: 'Under Construction',
    completionDate: '2025-08-15',
    units: '45 Units',
    startingPrice: 650000,
    progressPercentage: 45,
    image: 'https://images.unsplash.com/photo-1592595896616-c37162298647?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
];

/**
 * Seed the database with sample data
 * @param force If true, seed the database even if there is already data
 * @returns Promise that resolves when seeding is complete
 */
export async function seedDatabase(force: boolean = false) {
  console.log('🌱 Checking database for seed data...');
  
  try {
    // Check if properties table is empty
    const propertyCount = await db.select({ count: sql<number>`count(*)` }).from(properties);
    
    if (propertyCount[0].count === 0 || force) {
      if (force) {
        console.log('🔄 Forced seeding requested for properties table');
      } else {
        console.log('🏠 Properties table is empty. Seeding properties...');
      }
      
      // Seed properties - in force mode, we don't delete existing records, just add more
      await db.insert(properties).values(sampleProperties);
      console.log(`✅ Successfully seeded ${sampleProperties.length} properties`);
    } else {
      console.log(`✓ Properties table already has ${propertyCount[0].count} records. Skipping seeding.`);
    }
    
    // Check if projects table is empty
    const projectCount = await db.select({ count: sql<number>`count(*)` }).from(projects);
    
    if (projectCount[0].count === 0 || force) {
      if (force) {
        console.log('🔄 Forced seeding requested for projects table');
      } else {
        console.log('🏗️ Projects table is empty. Seeding projects...');
      }
      
      // Seed projects
      await db.insert(projects).values(sampleProjects);
      console.log(`✅ Successfully seeded ${sampleProjects.length} projects`);
    } else {
      console.log(`✓ Projects table already has ${projectCount[0].count} records. Skipping seeding.`);
    }
    
    console.log('🌱 Database seed check completed.');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
    throw error; // Re-throw the error so the caller can handle it
  }
}