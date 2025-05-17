import { useState } from "react";
import { useLocation } from "wouter";
import { BookCreationForm } from "@/components/BookCreationForm";
import { GenerationProgress } from "@/components/GenerationProgress";
import { useBookGeneration } from "@/hooks/use-book-generation";
import { BookParams } from "@shared/schema";
import { useBooks } from "@/context/BookContext";

export default function Crafter() {
  const [view, setView] = useState<"form" | "progress">("form");
  const [, setLocation] = useLocation();
  const { 
    generateBook, 
    book, 
    progress, 
    generationSteps 
  } = useBookGeneration();
  const { saveBook } = useBooks();

  const handleFormSubmit = async (params: BookParams) => {
    setView("progress");
    try {
      const generatedBook = await generateBook(params);
      if (generatedBook) {
        saveBook(generatedBook);
        // Navigate to printer page with the book title as a param
        setLocation(`/printer/${encodeURIComponent(generatedBook.cover.title)}`);
      }
    } catch (error) {
      console.error("Error generating book:", error);
      setView("form");
    }
  };

  return (
    <>
      {view === "form" && (
        <BookCreationForm onSubmit={handleFormSubmit} />
      )}
      
      {view === "progress" && (
        <GenerationProgress 
          progress={progress} 
          steps={generationSteps}
        />
      )}
    </>
  );
}