import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/ui/page";
import { Download, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Book, BookCover, BookChapter } from "@shared/schema";
import { motion } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { generatePDF } from "@/lib/pdf";

type BookViewerProps = {
  book: Book;
  onCreateNew: () => void;
};

export function BookViewer({ book, onCreateNew }: BookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<HTMLDivElement>(null);
  const totalPages = book.chapters.reduce((total, chapter) => total + chapter.pages.length, 0) + 2; // +2 for cover and TOC
  
  const handleDownload = async () => {
    await generatePDF(book);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const jumpToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  // Define page types for better type safety
  type CoverPage = { type: 'cover'; content: BookCover };
  type TocPage = { type: 'toc'; content: { title: string; chapters: BookChapter[] } };
  type ChapterPage = { 
    type: 'chapter'; 
    content: { 
      content: string; 
      imageUrl?: string; 
      isChapterStart?: boolean; 
      chapterTitle: string; 
      chapterNumber: number 
    } 
  };
  
  type BookPage = CoverPage | TocPage | ChapterPage;
  
  // Flatten book pages for easy navigation
  const flattenedPages: BookPage[] = [
    { type: 'cover', content: book.cover },
    { type: 'toc', content: { title: 'Table of Contents', chapters: book.chapters } },
    ...book.chapters.flatMap(chapter => 
      chapter.pages.map(page => ({ 
        type: 'chapter' as const, 
        content: { ...page, chapterTitle: chapter.title, chapterNumber: chapter.number } 
      }))
    )
  ];

  const currentPageData = flattenedPages[currentPage];
  
  return (
    <div className="pt-6 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Your Generated Book</h2>
          <div className="flex space-x-3">
            <Button 
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={onCreateNew}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Book
            </Button>
          </div>
        </div>
        
        {/* Book navigation controls */}
        <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous Page
          </Button>
          
          <div className="text-sm font-medium text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </div>
          
          <Button 
            variant="outline" 
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1"
          >
            Next Page
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="book-container">
          <div className="flex justify-center">
            <div 
              ref={bookRef}
              className="book-wrapper w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
            >
              {currentPageData.type === 'cover' && (
                <motion.div 
                  className="book-cover relative bg-gradient-to-r from-slate-800 to-slate-700 aspect-[2/3] max-h-[600px] w-full mx-auto shadow-lg rounded-md overflow-hidden transform transition-all duration-300"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {book.cover.imageUrl && (
                    <img 
                      src={book.cover.imageUrl} 
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" 
                      alt="Book cover background" 
                    />
                  )}
                  
                  <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12">
                    <div className="text-center">
                      <h3 className="font-serif font-bold text-2xl sm:text-4xl text-white mb-2">
                        {book.cover.title}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base italic">
                        {book.cover.subtitle}
                      </p>
                    </div>
                    
                    {book.cover.centralImageUrl && (
                      <div className="text-center">
                        <img 
                          src={book.cover.centralImageUrl} 
                          className="w-32 h-32 sm:w-40 sm:h-40 mx-auto object-cover rounded-full border-4 border-white/30" 
                          alt="Book cover central image" 
                        />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className="text-gray-200 text-sm">Generated by AI</p>
                      <p className="text-white font-medium mt-2">
                        {new Date().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                      <div className="mt-4 bg-white/20 rounded-md p-2 text-white text-sm max-w-xs mx-auto backdrop-blur-sm">
                        <p className="font-medium">Browse this book</p>
                        <p>Use the navigation buttons above and below to view all pages</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {currentPageData.type === 'toc' && (
                <div className="book-content bg-white p-6 sm:p-10">
                  <h2 className="font-serif text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
                    Table of Contents
                  </h2>
                  <ul className="space-y-3">
                    {book.chapters.map((chapter) => (
                      <li key={chapter.number} className="flex items-baseline">
                        <span className="font-medium">Chapter {chapter.number}:</span>
                        <span className="flex-grow border-b border-dotted border-gray-300 mx-2"></span>
                        <span>{chapter.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {currentPageData.type === 'chapter' && (
                <div className="book-content bg-white p-6 sm:p-10">
                  {currentPageData.content.imageUrl && (
                    <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={currentPageData.content.imageUrl} 
                        className="w-full h-full object-cover" 
                        alt={`Chapter ${currentPageData.content.chapterNumber}`} 
                      />
                    </div>
                  )}
                  
                  {currentPageData.content.isChapterStart && (
                    <h2 className="font-serif text-2xl font-bold mb-4">
                      Chapter {currentPageData.content.chapterNumber}: {currentPageData.content.chapterTitle}
                    </h2>
                  )}
                  
                  <div 
                    className="prose prose-slate max-w-none" 
                    dangerouslySetInnerHTML={{ __html: currentPageData.content.content }}
                  />
                
                  
                  {/* Chapter navigation */}
                  <div className="flex justify-between mt-12 pt-6 border-t border-gray-200">
                    <Button 
                      variant="ghost" 
                      className="flex items-center text-gray-600 hover:text-primary hover:bg-transparent"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" />
                      Previous
                    </Button>
                    <div className="text-gray-500">
                      Page {currentPage + 1} of {totalPages}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="flex items-center text-gray-600 hover:text-primary hover:bg-transparent"
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
