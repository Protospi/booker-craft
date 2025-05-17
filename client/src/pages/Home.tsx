import { useState } from "react";
import { BookCreationForm } from "@/components/BookCreationForm";
import { GenerationProgress } from "@/components/GenerationProgress";
import { BookViewer } from "@/components/BookViewer";
import { useBookGeneration } from "@/hooks/use-book-generation";
import { BookParams } from "@shared/schema";
import { useLanguage } from "@/context/LanguageContext";
import { useBooks } from "@/context/BookContext";
import { useLocation } from "wouter";

export default function Home() {
  const [view, setView] = useState<"form" | "progress">("form");
  const { saveBook } = useBooks();
  const [, navigate] = useLocation();
  const { 
    generateBook, 
    progress, 
    generationSteps 
  } = useBookGeneration();

  const handleFormSubmit = async (params: BookParams) => {
    setView("progress");
    try {
      const generatedBook = await generateBook(params);
      // Save the generated book to our context
      if (generatedBook) {
        saveBook(generatedBook);
        
        // Store the newly created book title in localStorage so MyBooks can select it
        localStorage.setItem('last-generated-book', generatedBook.cover.title);
        
        // Redirect to My Books page
        navigate("/my-books");
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
