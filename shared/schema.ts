import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Book creation parameters
export const bookParamsSchema = z.object({
  theme: z.string().min(1, "Theme is required"),
  totalPages: z.number().int().min(10).max(200),
  numImages: z.number().int().min(0).max(20),
  numChapters: z.number().int().min(1).max(20),
  language: z.string().min(1, "Language is required"),
  apiKey: z.string().optional()
});

export type BookParams = z.infer<typeof bookParamsSchema>;

// Book cover type
export type BookCover = {
  title: string;
  subtitle: string;
  imageUrl: string;
  centralImageUrl?: string;
};

// Chapter page type
export type ChapterPage = {
  content: string;
  imageUrl?: string;
  isChapterStart?: boolean;
};

// Book chapter type
export type BookChapter = {
  number: number;
  title: string;
  summary: string;
  pages: ChapterPage[];
};

// Complete book type
export type Book = {
  cover: BookCover;
  chapters: BookChapter[];
};

// Database schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  theme: text("theme").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  centralImageUrl: text("central_image_url"),
  language: text("language").notNull(),
  createdAt: text("created_at").notNull(),
  content: jsonb("content").notNull() // Store full book content as JSON
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type BookRecord = typeof books.$inferSelect;
