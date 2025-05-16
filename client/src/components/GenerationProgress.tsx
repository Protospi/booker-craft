import { Progress } from "@/components/ui/progress";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type GenerationStep = {
  id: string;
  name: string;
  status: "complete" | "in-progress" | "pending";
  progress?: number;
};

type GenerationProgressProps = {
  progress: number;
  steps: GenerationStep[];
};

export function GenerationProgress({ progress, steps }: GenerationProgressProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Creating Your Book</h2>
          <p className="text-gray-600">Please wait while we generate your content...</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-4" />
          </div>
          
          <div className="space-y-3 pt-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  step.status === "complete" 
                    ? "bg-success text-white" 
                    : step.status === "in-progress" 
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-500"
                }`}>
                  {step.status === "complete" ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : step.status === "in-progress" ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="text-xs font-medium">{steps.findIndex(s => s.id === step.id) + 1}</span>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${
                      step.status === "pending" ? "text-gray-500" : ""
                    }`}>
                      {step.name}
                    </span>
                    {step.status === "complete" && (
                      <span className="text-sm text-success">Complete</span>
                    )}
                    {step.status === "in-progress" && step.progress !== undefined && (
                      <span className="text-sm text-primary">{step.progress}% complete</span>
                    )}
                  </div>
                  {step.status === "in-progress" && step.progress !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertDescription className="flex items-start gap-2">
              <div className="flex-shrink-0 text-amber-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>
                Creating your book may take a few minutes. We're generating high-quality content customized to your specifications.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
