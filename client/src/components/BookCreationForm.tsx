import { useState } from "react";
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

export type BookFormProps = {
  onSubmit: (values: z.infer<typeof bookParamsSchema>) => void;
};

export function BookCreationForm({ onSubmit }: BookFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof bookParamsSchema>>({
    resolver: zodResolver(bookParamsSchema),
    defaultValues: {
      theme: "",
      totalPages: 50,
      numImages: 5,
      numChapters: 5,
      language: "english"
    },
  });

  async function handleSubmit(values: z.infer<typeof bookParamsSchema>) {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate book. Please try again.",
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
                      placeholder="e.g., Cooking recipes, Science fiction, Travel guide..."
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
                        <div className="ml-2 text-sm text-gray-500">pages</div>
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
                    <FormLabel>{t.bookForm.genre}</FormLabel>
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
                    <FormLabel>{t.bookForm.setting}</FormLabel>
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
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
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
