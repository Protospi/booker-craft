import OpenAI from "openai";
import { BookParams, Book, BookCover, BookChapter, ChapterPage } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// Get the default API key from environment variables
const getOpenAI = (apiKey?: string) => {
  // Use provided API key if available, otherwise fall back to environment variable
  const finalApiKey = apiKey || process.env.OPENAI_API_KEY || "";
  console.log("OpenAI Client - Using API key:", finalApiKey ? "API key is provided" : "No API key available");
  return new OpenAI({ apiKey: finalApiKey });
};

export async function generateBook(params: BookParams): Promise<Book> {
  try {
    // Extract API key from params if available
    const apiKey = (params as any).apiKey;
    console.log("Book Generator - API Key in params:", apiKey ? "API key is present" : "No API key in params");
    
    // 1. Generate book skeleton
    const skeleton = await generateBookSkeleton(params.theme, params.numChapters, params.language, apiKey);
    
    // 2. Generate chapters concurrently
    const chaptersPromises = skeleton.chapters.map(async (chapterInfo) => {
      const chapterContent = await generateChapterContent(
        params.theme,
        chapterInfo.title,
        chapterInfo.number,
        params.numChapters,
        params.language,
        apiKey
      );
      
      // 3. Generate images if needed
      let chapterImageUrl: string | undefined;
      if (params.numImages > 0) {
        // Allocate images across chapters
        if (chapterInfo.number <= params.numImages) {
          const imagePrompt = `A high-quality illustration for a book chapter titled "${chapterInfo.title}" about ${params.theme}`;
          chapterImageUrl = await generateImage(imagePrompt, apiKey);
        }
      }
      
      // 4. Format chapter content into pages
      const pages = formatChapterIntoPages(
        chapterContent.content,
        chapterImageUrl,
        chapterInfo.number === 1 // First chapter includes introduction
      );
      
      return {
        number: chapterInfo.number,
        title: chapterInfo.title,
        summary: chapterContent.summary,
        pages
      };
    });
    
    const chapters = await Promise.all(chaptersPromises);
    
    // 5. Generate cover image
    const coverImagePrompt = `A striking book cover for a book about ${params.theme}`;
    const coverImageUrl = await generateImage(coverImagePrompt, apiKey);
    
    // 6. Assemble final book
    const book: Book = {
      cover: {
        title: skeleton.title,
        subtitle: skeleton.subtitle,
        imageUrl: coverImageUrl,
        centralImageUrl: params.numImages > 0 ? 
          await generateImage(`A centered focal image for a book about ${params.theme}`, apiKey) : 
          undefined
      },
      chapters
    };
    
    return book;
  } catch (error: any) {
    console.error("Error in generateBook:", error);
    throw new Error(`Failed to generate book: ${error.message}`);
  }
}

export async function generateBookSkeleton(
  theme: string,
  numChapters: number,
  language: string,
  apiKey?: string
): Promise<{ title: string; subtitle: string; chapters: Array<{ number: number; title: string }> }> {
  try {
    const openai = getOpenAI(apiKey);
    console.log("Generating book skeleton with OpenAI API key:", apiKey);
    
    const prompt = `Create a book skeleton for a book about ${theme}. Generate a title, a subtitle, and ${numChapters} chapter titles. The content should be in ${language}.
    Return the result as JSON in this exact format:
    {
      "title": "The main book title",
      "subtitle": "The book subtitle",
      "chapters": [
        { "number": 1, "title": "First chapter title" },
        { "number": 2, "title": "Second chapter title" }
        // etc. for the number of chapters requested
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error: any) {
    console.error("Error generating book skeleton:", error);
    throw new Error(`Failed to generate book skeleton: ${error.message}`);
  }
}

export async function generateChapterContent(
  theme: string,
  chapterTitle: string,
  chapterNumber: number,
  totalChapters: number,
  language: string,
  apiKey?: string
): Promise<{ content: string; summary: string }> {
  try {
    const openai = getOpenAI(apiKey);
    const isFirstChapter = chapterNumber === 1;
    const isLastChapter = chapterNumber === totalChapters;

    const prompt = `Write engaging content for Chapter ${chapterNumber}: "${chapterTitle}" from a book about ${theme}.
    ${isFirstChapter ? "This is the first chapter, so include a brief introduction to the book." : ""}
    ${isLastChapter ? "This is the final chapter, so provide a satisfying conclusion." : ""}
    The content should be rich, informative, and formatted with HTML tags (h2, h3, p, ul, li, etc.) for proper structure and presentation.
    The content should be in ${language}.
    
    Return the result as JSON with this exact format:
    {
      "content": "The full HTML-formatted chapter content",
      "summary": "A brief 2-3 sentence summary of this chapter"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error: any) {
    console.error("Error generating chapter content:", error);
    throw new Error(`Failed to generate chapter content: ${error.message}`);
  }
}

export async function generateImage(prompt: string, apiKey?: string): Promise<string> {
  try {
    const openai = getOpenAI(apiKey);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    if (response?.data?.[0]?.url) {
      return response.data[0].url;
    } else {
      console.error("No image URL returned");
      return "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?&w=1024&h=1024&fit=crop";
    }
  } catch (error: any) {
    console.error("Error generating image:", error);
    return "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?&w=1024&h=1024&fit=crop";
  }
}

// Helper function to format chapter content into pages
function formatChapterIntoPages(content: string, imageUrl?: string, isFirstChapter = false): ChapterPage[] {
  // For simplicity, we'll create a set of pages with a predetermined content length
  const pages: ChapterPage[] = [];
  
  // Create the first page with chapter title, image, and start of content
  pages.push({
    content: content,
    imageUrl,
    isChapterStart: true
  });
  
  // In a real app, we'd split long content into multiple pages
  // For now, we're keeping it simple with just one page per chapter
  
  return pages;
}
