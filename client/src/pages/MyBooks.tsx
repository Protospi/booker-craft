import { useBooks } from "@/context/BookContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronLeft, List, Download } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { BookViewer } from "@/components/BookViewer";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Book } from "@shared/schema";
import { generatePDF } from "@/lib/pdf";

export default function MyBooks() {
  const { savedBooks } = useBooks();
  const { t } = useLanguage();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [, setLocation] = useLocation();
  
  // Check if we need to show a specific book (after generation)
  useEffect(() => {
    const lastGeneratedBookTitle = localStorage.getItem('last-generated-book');
    
    if (lastGeneratedBookTitle && savedBooks.length > 0) {
      // Find the book with the matching title
      const bookToShow = savedBooks.find(book => book.cover.title === lastGeneratedBookTitle);
      
      if (bookToShow) {
        setSelectedBook(bookToShow);
        // Clear the last generated book so we don't auto-select it next time
        localStorage.removeItem('last-generated-book');
      }
    }
  }, [savedBooks]);

  const handleViewBook = useCallback((book: Book) => {
    setSelectedBook(book);
  }, []);

  const handleCreateNew = useCallback(() => {
    setLocation("/");
  }, [setLocation]);
  
  const handleBackToList = useCallback(() => {
    setSelectedBook(null);
  }, []);

  // Function to handle PDF download
  const handleDownload = useCallback(async () => {
    if (selectedBook) {
      try {
        await generatePDF(selectedBook);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  }, [selectedBook]);

  if (selectedBook) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="outline" 
          size="sm"
          className="mb-6 flex items-center gap-1"
          onClick={handleBackToList}
        >
          <ChevronLeft className="h-4 w-4" />
          <List className="h-4 w-4 mr-1" />
          Back to All Books
        </Button>
        
        {/* Use the original BookViewer component */}
        <BookViewer 
          book={selectedBook} 
          onCreateNew={handleCreateNew} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          {t.header.myBooks}
        </h1>
        <p className="text-gray-600">
          {savedBooks.length > 0
            ? "Here are all your created books. Click on any book to view it."
            : "You haven't created any books yet. Go to the home page to create your first book!"}
        </p>
      </div>

      {savedBooks.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-6">Start creating your first AI-powered book now</p>
          <Button 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setLocation("/")}
          >
            Create Your First Book
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {savedBooks.map((book, index) => (
            <motion.div
              key={book.cover.title + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col md:flex-row">
                  {/* Book Cover Miniature */}
                  <div className="w-full md:w-1/5 h-48 md:h-auto relative">
                    <img
                      src={book.cover.imageUrl}
                      alt={book.cover.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Book Information */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {book.cover.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {book.cover.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      <div className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                        <span className="font-medium">Genre:</span> {book.chapters[0].title.split(' ')[0]}
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                        <span className="font-medium">Chapters:</span> {book.chapters.length}
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                        <span className="font-medium">Pages:</span> {book.chapters.reduce((total, chapter) => total + chapter.pages.length, 0) + 2}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Created on {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-6 flex flex-row md:flex-col justify-end gap-4 items-center border-t md:border-t-0 md:border-l border-gray-200">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 w-full"
                      onClick={() => handleViewBook(book)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 w-full"
                      onClick={async () => {
                        try {
                          await generatePDF(book);
                        } catch (error) {
                          console.error('Error generating PDF:', error);
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}