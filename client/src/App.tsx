import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MyBooks from "@/pages/MyBooks";
import About from "@/pages/About";
import Help from "@/pages/Help";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { BookProvider } from "@/context/BookContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/my-books" component={MyBooks} />
      <Route path="/about" component={About} />
      <Route path="/help" component={Help} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BookProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow pt-20">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </BookProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
