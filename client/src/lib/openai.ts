import { Book } from "@shared/schema";

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

// Get the user's API key from localStorage
const getApiKey = (): string | null => {
  return localStorage.getItem('openai-api-key');
};

// These functions make API calls to our backend which will handle the OpenAI API calls
export const generateBookSkeleton = async (
  theme: string,
  numChapters: number,
  language: string
): Promise<GenerateBookSkeletonResponse> => {
  const apiKey = getApiKey();
  const headers: Record<string, string> = { 
    "Content-Type": "application/json"
  };
  
  // Add the API key to headers if available
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  
  const response = await fetch("/api/books/skeleton", {
    method: "POST",
    headers: headers,
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
  const apiKey = getApiKey();
  const headers: Record<string, string> = { 
    "Content-Type": "application/json"
  };
  
  // Add the API key to headers if available
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  
  const response = await fetch("/api/books/chapter", {
    method: "POST",
    headers: headers,
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
  const apiKey = getApiKey();
  const headers: Record<string, string> = { 
    "Content-Type": "application/json"
  };
  
  // Add the API key to headers if available
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  
  const response = await fetch("/api/books/image", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate image: ${error}`);
  }

  return response.json();
};
