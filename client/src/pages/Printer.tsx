import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { BookViewer } from "@/components/BookViewer";
import { useBooks } from "@/context/BookContext";
import { Book } from "@shared/schema";

export default function Printer() {
  const [, setLocation] = useLocation();
  const [book, setBook] = useState<Book | null>(null);
  const { savedBooks } = useBooks();
  const [, params] = useRoute<{ bookTitle: string }>("/printer/:bookTitle");
  const bookTitle = params?.bookTitle ? decodeURIComponent(params.bookTitle) : null;

  useEffect(() => {
    if (bookTitle && savedBooks.length > 0) {
      const foundBook = savedBooks.find(b => b.cover.title === bookTitle);
      if (foundBook) {
        setBook(foundBook);
      } else {
        // Book not found, redirect to my-books
        setLocation('/my-books');
      }
    } else if (!bookTitle) {
      // No book title in URL, redirect to my-books
      setLocation('/my-books');
    }
  }, [bookTitle, savedBooks, setLocation]);

  const handleCreateNew = () => {
    setLocation('/');
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BookViewer book={book} onCreateNew={handleCreateNew} />
  );
}