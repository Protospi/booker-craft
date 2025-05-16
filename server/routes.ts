import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { BookParams, bookParamsSchema } from "@shared/schema";
import { z } from "zod";
import { generateBook, generateBookSkeleton, generateChapterContent, generateImage } from "./book-generator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Main book generation endpoint
  app.post("/api/books/generate", async (req, res) => {
    try {
      const bookParams = bookParamsSchema.parse(req.body);
      const book = await generateBook(bookParams);
      res.json(book);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid book parameters", errors: error.errors });
      } else {
        console.error("Book generation error:", error);
        res.status(500).json({ message: "Failed to generate book" });
      }
    }
  });

  // Skeleton generation endpoint
  app.post("/api/books/skeleton", async (req, res) => {
    try {
      const { theme, numChapters, language } = req.body;
      const skeleton = await generateBookSkeleton(theme, numChapters, language);
      res.json(skeleton);
    } catch (error) {
      console.error("Skeleton generation error:", error);
      res.status(500).json({ message: "Failed to generate book skeleton" });
    }
  });

  // Chapter content generation endpoint
  app.post("/api/books/chapter", async (req, res) => {
    try {
      const { theme, chapterTitle, chapterNumber, totalChapters, language } = req.body;
      const chapter = await generateChapterContent(
        theme, 
        chapterTitle, 
        chapterNumber, 
        totalChapters, 
        language
      );
      res.json(chapter);
    } catch (error) {
      console.error("Chapter generation error:", error);
      res.status(500).json({ message: "Failed to generate chapter content" });
    }
  });

  // Image generation endpoint
  app.post("/api/books/image", async (req, res) => {
    try {
      const { prompt } = req.body;
      const imageUrl = await generateImage(prompt);
      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
