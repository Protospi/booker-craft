import { useBooks } from "@/context/BookContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useCallback, useState } from "react";
import { BookViewer } from "@/components/BookViewer";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Book } from "@shared/schema";

export default function MyBooks() {
  const { savedBooks } = useBooks();
  const { t } = useLanguage();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [, setLocation] = useLocation();

  const handleViewBook = useCallback((book: Book) => {
    setSelectedBook(book);
  }, []);

  const handleCreateNew = useCallback(() => {
    setLocation("/");
  }, [setLocation]);

  if (selectedBook) {
    return (
      <BookViewer book={selectedBook} onCreateNew={handleCreateNew} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedBooks.map((book, index) => (
            <motion.div
              key={book.cover.title + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={book.cover.imageUrl}
                    alt={book.cover.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-xl mb-1 line-clamp-2">
                        {book.cover.title}
                      </h3>
                      <p className="text-gray-200 text-sm line-clamp-2">
                        {book.cover.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 flex flex-col space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {book.chapters.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {book.chapters.length} chapters
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => handleViewBook(book)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}