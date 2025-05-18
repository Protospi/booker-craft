import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BookExamples } from "./BookExamples";
import { bookParamsSchema } from "@shared/schema";
import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type BookFormProps = {
  onSubmit: (values: z.infer<typeof bookParamsSchema>) => void;
};

export function BookCreationForm({ onSubmit }: BookFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check if API key exists in localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai-api-key');
    setHasApiKey(!!storedApiKey && storedApiKey.trim() !== '');
  }, []);

  const form = useForm<z.infer<typeof bookParamsSchema>>({
    resolver: zodResolver(bookParamsSchema),
    defaultValues: {
      theme: "",
      totalPages: 10,
      numImages: 5,
      numChapters: 5,
      language: "english"
    },
  });

  async function handleSubmit(values: z.infer<typeof bookParamsSchema>) {
    try {
      // Check if API key exists, if not show error and prevent submission
      const apiKey = localStorage.getItem('openai-api-key');
      console.log("Frontend - API Key retrieved from localStorage:", apiKey ? "API key exists" : "No API key found");
      
      if (!apiKey || apiKey.trim() === '') {
        toast({
          title: t.bookForm.apiKeyRequired,
          description: t.bookForm.apiKeyRequiredDescription,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      // Add API key to the form values
      const valuesWithApiKey = { ...values, apiKey };
      console.log("Frontend - Submitting with API key:", valuesWithApiKey.apiKey ? "API key included" : "No API key included");
      await onSubmit(valuesWithApiKey);
    } catch (error) {
      toast({
        title: t.bookForm.error,
        description: t.bookForm.errorDescription,
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-gray-900 sm:text-4xl mb-2">
          {t.home.title}
        </h2>
        <p className="text-lg text-gray-600">
          {t.home.subtitle}
        </p>
      </div>

      {!hasApiKey && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>OpenAI API Key Required</AlertTitle>
          <AlertDescription>
            To generate a book, please provide your OpenAI API key in the settings. Your API key is stored securely in your browser.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.bookForm.theme}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.bookForm.themePlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalPages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.bookForm.length}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min={10}
                          max={200}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numChapters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.bookForm.numChapters}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.bookForm.numImages}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.bookForm.language}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">{t.bookForm.languageEnglish}</SelectItem>
                        <SelectItem value="spanish">{t.bookForm.languageSpanish}</SelectItem>
                        <SelectItem value="french">{t.bookForm.languageFrench}</SelectItem>
                        <SelectItem value="german">{t.bookForm.languageGerman}</SelectItem>
                        <SelectItem value="italian">{t.bookForm.languageItalian}</SelectItem>
                        <SelectItem value="portuguese">{t.bookForm.languagePortuguese}</SelectItem>
                        <SelectItem value="chinese">{t.bookForm.languageChinese}</SelectItem>
                        <SelectItem value="japanese">{t.bookForm.languageJapanese}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-primary py-3 h-auto text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : t.bookForm.createButton}
              </Button>
            </div>
          </form>
        </Form>

        <BookExamples />
      </div>
    </div>
  );
}
