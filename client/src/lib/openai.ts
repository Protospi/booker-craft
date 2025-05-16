import { Book, ChapterContent } from "@shared/schema";

export type GenerateBookSkeletonResponse = {
  title: string;
  subtitle: string;
  chapters: Array<{
    number: number;
    title: string;
  }>;
};

export type GenerateChapterContentResponse = {
  content: string;
  summary: string;
};

export type GenerateImageResponse = {
  url: string;
};

// These functions make API calls to our backend which will handle the OpenAI API calls
export const generateBookSkeleton = async (
  theme: string,
  numChapters: number,
  language: string
): Promise<GenerateBookSkeletonResponse> => {
  const response = await fetch("/api/books/skeleton", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme, numChapters, language }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate book skeleton: ${error}`);
  }

  return response.json();
};

export const generateChapterContent = async (
  theme: string,
  chapterTitle: string,
  chapterNumber: number,
  totalChapters: number,
  language: string
): Promise<GenerateChapterContentResponse> => {
  const response = await fetch("/api/books/chapter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      theme,
      chapterTitle,
      chapterNumber,
      totalChapters,
      language,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate chapter content: ${error}`);
  }

  return response.json();
};

export const generateImage = async (
  prompt: string
): Promise<GenerateImageResponse> => {
  const response = await fetch("/api/books/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate image: ${error}`);
  }

  return response.json();
};
