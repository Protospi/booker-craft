import { Link } from "wouter";
import { BookOpen, Globe } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900">Booker</h1>
        </div>
        
        <nav className="hidden md:flex space-x-8 text-sm">
          <Link href="/">
            <span className="cursor-pointer font-medium text-primary">{t.header.home}</span>
          </Link>
          <Link href="/books">
            <span className="cursor-pointer font-medium text-gray-500 hover:text-gray-900">{t.header.myBooks}</span>
          </Link>
          <Link href="/about">
            <span className="cursor-pointer font-medium text-gray-500 hover:text-gray-900">{t.header.about}</span>
          </Link>
          <Link href="/help">
            <span className="cursor-pointer font-medium text-gray-500 hover:text-gray-900">{t.header.help}</span>
          </Link>
        </nav>
        
        <div className="flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button 
                type="button" 
                className="flex items-center space-x-2"
                aria-label="Language settings"
              >
                <Avatar className="h-8 w-8 bg-primary-100 text-primary-700 cursor-pointer">
                  <AvatarFallback><Globe className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <LanguageSelector onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
