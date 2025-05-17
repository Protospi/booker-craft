import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Book } from '@shared/schema';

type BookContextType = {
  savedBooks: Book[];
  saveBook: (book: Book) => void;
  removeBook: (bookTitle: string) => void;
};

const BookContext = createContext<BookContextType>({
  savedBooks: [],
  saveBook: () => {},
  removeBook: () => {},
});

export const useBooks = () => useContext(BookContext);

type BookProviderProps = {
  children: ReactNode;
};

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  // Initialize from localStorage if available
  const [savedBooks, setSavedBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('saved-books');
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage when books change
  useEffect(() => {
    localStorage.setItem('saved-books', JSON.stringify(savedBooks));
  }, [savedBooks]);

  const saveBook = useCallback((book: Book) => {
    setSavedBooks(prevBooks => {
      // Check if book already exists by title
      const exists = prevBooks.some(b => b.cover.title === book.cover.title);
      if (exists) {
        // Replace existing book
        return prevBooks.map(b => 
          b.cover.title === book.cover.title ? book : b
        );
      } else {
        // Add new book
        return [...prevBooks, book];
      }
    });
  }, []);

  const removeBook = useCallback((bookTitle: string) => {
    setSavedBooks(prevBooks => 
      prevBooks.filter(book => book.cover.title !== bookTitle)
    );
  }, []);

  return (
    <BookContext.Provider value={{ savedBooks, saveBook, removeBook }}>
      {children}
    </BookContext.Provider>
  );
};