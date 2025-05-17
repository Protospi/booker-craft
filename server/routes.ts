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
      // Extract the API key from the request headers
      const apiKey = req.headers['x-api-key'] as string;
      console.log("Server - API Key in headers:", apiKey ? "API key is present" : "No API key in headers");
      
      // Parse the book parameters
      const bookParams = bookParamsSchema.parse(req.body);
      console.log("Server - API Key in request body:", bookParams.apiKey ? "API key is present in body" : "No API key in body");
      
      // Add the API key to the parameters for use in OpenAI calls
      const paramsWithApiKey = { ...bookParams, apiKey };
      
      // Generate the book with the API key
      const book = await generateBook(paramsWithApiKey);
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
      const apiKey = req.headers['x-api-key'] as string;
      const skeleton = await generateBookSkeleton(theme, numChapters, language, apiKey);
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
      const apiKey = req.headers['x-api-key'] as string;
      const chapter = await generateChapterContent(
        theme, 
        chapterTitle, 
        chapterNumber, 
        totalChapters, 
        language,
        apiKey
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
      const apiKey = req.headers['x-api-key'] as string;
      const imageUrl = await generateImage(prompt, apiKey);
      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
