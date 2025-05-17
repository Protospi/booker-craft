import { useState } from "react";
import { BookCreationForm } from "@/components/BookCreationForm";
import { GenerationProgress } from "@/components/GenerationProgress";
import { BookViewer } from "@/components/BookViewer";
import { useBookGeneration } from "@/hooks/use-book-generation";
import { BookParams } from "@shared/schema";
import { useBooks } from "@/context/BookContext";

export default function Crafter() {
  const [view, setView] = useState<"form" | "progress" | "book">("form");
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
        setView("book");
      }
    } catch (error) {
      console.error("Error generating book:", error);
      setView("form");
    }
  };

  const handleCreateNew = () => {
    setView("form");
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
      
      {view === "book" && book && (
        <BookViewer 
          book={book} 
          onCreateNew={handleCreateNew} 
        />
      )}
    </>
  );
}