import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  sector: text("sector").notNull(),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id),
  dateTime: timestamp("date_time").notNull(),
  propagationMethod: text("propagation_method").notNull(),
  diseaseStatus: text("disease_status").notNull(),
  confidence: integer("confidence").notNull(),
  severity: text("severity").notNull(),
  isHealthy: boolean("is_healthy").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFarmSchema = createInsertSchema(farms).omit({
  id: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFarm = z.infer<typeof insertFarmSchema>;
export type Farm = typeof farms.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
