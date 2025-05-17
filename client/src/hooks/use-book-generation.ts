import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BookParams, Book } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type GenerationStep = {
  id: string;
  name: string;
  status: "complete" | "in-progress" | "pending";
  progress?: number;
};

export function useBookGeneration() {
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [progress, setProgress] = useState(0);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: "skeleton", name: "Generating book skeleton", status: "pending" },
    { id: "chapters", name: "Creating chapters", status: "pending" },
    { id: "images", name: "Generating images", status: "pending" },
    { id: "assembly", name: "Assembling final book", status: "pending" }
  ]);

  // Set up a mock progress updater (in a real app this would be replaced with SSE or WebSockets)
  const simulateProgressUpdates = (numChapters: number) => {
    // Update skeleton generation (0-20%)
    const updateSkeletonProgress = () => {
      setGenerationSteps(prev => 
        prev.map(step => 
          step.id === "skeleton" 
            ? { ...step, status: "in-progress" } 
            : step
        )
      );
      setProgress(5);
      
      setTimeout(() => {
        setProgress(15);
        setTimeout(() => {
          setGenerationSteps(prev => 
            prev.map(step => 
              step.id === "skeleton" 
                ? { ...step, status: "complete" } 
                : step.id === "chapters" 
                  ? { ...step, status: "in-progress", progress: 0 } 
                  : step
            )
          );
          setProgress(20);
          updateChaptersProgress(0);
        }, 2000);
      }, 3000);
    };
    
    // Update chapters generation (20-60%)
    const updateChaptersProgress = (completedChapters: number) => {
      if (completedChapters < numChapters) {
        const chapterProgress = Math.round((completedChapters / numChapters) * 100);
        setGenerationSteps(prev => 
          prev.map(step => 
            step.id === "chapters" 
              ? { ...step, progress: chapterProgress } 
              : step
          )
        );
        setProgress(20 + Math.round((completedChapters / numChapters) * 40));
        
        setTimeout(() => {
          updateChaptersProgress(completedChapters + 1);
        }, 2000);
      } else {
        setGenerationSteps(prev => 
          prev.map(step => 
            step.id === "chapters" 
              ? { ...step, status: "complete" } 
              : step.id === "images" 
                ? { ...step, status: "in-progress" } 
                : step
          )
        );
        setProgress(60);
        updateImagesProgress();
      }
    };
    
    // Update images generation (60-80%)
    const updateImagesProgress = () => {
      setTimeout(() => {
        setProgress(70);
        setTimeout(() => {
          setGenerationSteps(prev => 
            prev.map(step => 
              step.id === "images" 
                ? { ...step, status: "complete" } 
                : step.id === "assembly" 
                  ? { ...step, status: "in-progress" } 
                  : step
            )
          );
          setProgress(80);
          updateAssemblyProgress();
        }, 3000);
      }, 2000);
    };
    
    // Update assembly progress (80-100%)
    const updateAssemblyProgress = () => {
      setTimeout(() => {
        setProgress(90);
        setTimeout(() => {
          setGenerationSteps(prev => 
            prev.map(step => 
              step.id === "assembly" 
                ? { ...step, status: "complete" } 
                : step
            )
          );
          setProgress(100);
        }, 1000);
      }, 2000);
    };
    
    updateSkeletonProgress();
  };

  const { mutateAsync: generateBookMutation, isPending } = useMutation({
    mutationFn: async (params: BookParams) => {
      const res = await apiRequest("POST", "/api/books/generate", params);
      return res.json();
    },
    onSuccess: (data: Book) => {
      setBook(data);
      toast({
        title: "Book generated successfully",
        description: `Your book "${data.cover.title}" has been created!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error generating book",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  });

  const generateBook = async (params: BookParams) => {
    setProgress(0);
    setGenerationSteps([
      { id: "skeleton", name: "Generating book skeleton", status: "pending" },
      { id: "chapters", name: "Creating chapters", status: "pending" },
      { id: "images", name: "Generating images", status: "pending" },
      { id: "assembly", name: "Assembling final book", status: "pending" }
    ]);
    
    simulateProgressUpdates(params.numChapters);
    const result = await generateBookMutation(params);
    return result;
  };

  return {
    generateBook,
    book,
    progress,
    generationSteps,
    isGenerating: isPending
  };
}
