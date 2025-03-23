import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Chat users schema
export const chatUsers = pgTable("chat_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  conversation: json("conversation").$type<ConversationMessage[]>(),
});

export const insertChatUserSchema = createInsertSchema(chatUsers).pick({
  name: true,
  contact: true,
  conversation: true,
});

// Properties schema
export const properties = pgTable("properties", {
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
  image: text("image").notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).pick({
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
  image: true,
});

// Projects schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  units: text("units").notNull(),
  startingPrice: integer("starting_price").notNull(),
  completionDate: text("completion_date").notNull(),
  status: text("status").notNull(),
  progressPercentage: integer("progress_percentage").notNull(),
  image: text("image").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  location: true,
  units: true,
  startingPrice: true,
  completionDate: true,
  status: true,
  progressPercentage: true,
  image: true,
});

// Types for frontend use
export type ConversationMessage = {
  role: 'user' | 'bot';
  message: string;
  timestamp: number;
};

export type ChatUser = typeof chatUsers.$inferSelect;
export type InsertChatUser = z.infer<typeof insertChatUserSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
