import { Link } from "wouter";
import { BookOpen, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900">Booker</h1>
        </div>
        
        <nav className="hidden md:flex space-x-8 text-sm">
          <Link href="/">
            <a className="font-medium text-primary">Home</a>
          </Link>
          <Link href="/books">
            <a className="font-medium text-gray-500 hover:text-gray-900">My Books</a>
          </Link>
          <Link href="/about">
            <a className="font-medium text-gray-500 hover:text-gray-900">About</a>
          </Link>
          <Link href="/help">
            <a className="font-medium text-gray-500 hover:text-gray-900">Help</a>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            type="button" 
            className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-primary"
          >
            <Settings className="h-5 w-5 mr-1" />
            Settings
          </button>
          <Avatar className="h-8 w-8 bg-primary-100 text-primary-700">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
