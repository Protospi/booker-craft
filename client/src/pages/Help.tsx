import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Help() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-serif font-bold text-center text-gray-900 mb-8">
            How to Use Booker
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="prose prose-slate max-w-none">
              <p className="mb-6 text-lg">
                Welcome to Booker! Here's a quick guide to help you create and manage your AI-generated books.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">
                    Getting Started
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      To begin creating books with Booker, you'll need to set up your OpenAI API key. Click the 
                      settings icon in the top-right corner and enter your API key in the provided field.
                    </p>
                    <p>
                      Once your API key is set, you're ready to create your first book! Navigate to the home page 
                      and fill out the book creation form to get started.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">
                    Creating a Book
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To create a new book:</p>
                    <ol className="list-decimal pl-5 space-y-2 mb-4">
                      <li>Go to the Home page</li>
                      <li>Fill out the book creation form with your desired settings</li>
                      <li>Click "Create Book" to begin the generation process</li>
                      <li>Wait for the AI to generate your book (this may take a few minutes)</li>
                      <li>Once completed, you'll be redirected to view your new book</li>
                    </ol>
                    <p>
                      The more specific you are with your inputs, the better the results will be!
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">
                    Managing Your Books
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      All your created books are saved in the "My Books" section. From there, you can:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>View any of your books</li>
                      <li>Download books as PDF files for printing or sharing</li>
                      <li>Delete books you no longer need</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">
                    Book Generation Process
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      Our AI follows a structured process to create your book:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li><strong>Planning:</strong> The AI develops the overall structure, including title, subtitle, and chapter outline</li>
                      <li><strong>Writing:</strong> Each chapter is written with engaging, coherent content based on your specifications</li>
                      <li><strong>Illustrating:</strong> Images are generated to complement the text and enhance the visual appeal</li>
                      <li><strong>Formatting:</strong> Everything is assembled into a professionally formatted book with proper layout</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">
                    Language Settings
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Booker supports multiple languages for the application interface. To change the language, 
                      click the settings icon in the top-right corner and select your preferred language from the options.
                      You can also specify the language of your book content during the creation process.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl w-full max-w-md">
              <svg className="w-full h-auto" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                {/* Background */}
                <rect x="0" y="0" width="400" height="400" fill="#f8fafc" />
                <rect x="50" y="50" width="300" height="300" rx="20" fill="#f1f5f9" />
                
                {/* Chatbot body */}
                <circle cx="200" cy="160" r="70" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
                
                {/* Chatbot face */}
                <circle cx="175" cy="150" r="10" fill="#0ea5e9" /> {/* Left eye */}
                <circle cx="225" cy="150" r="10" fill="#0ea5e9" /> {/* Right eye */}
                
                {/* Chatbot smile */}
                <path 
                  d="M160,180 Q200,220 240,180" 
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                />
                
                {/* Antenna */}
                <line x1="200" y1="90" x2="200" y2="40" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="200" cy="30" r="10" fill="#0ea5e9" />
                
                {/* Chat bubbles */}
                <g>
                  <path 
                    d="M100,250 Q80,250 80,270 L80,290 Q80,310 100,310 L150,310 Q170,310 170,290 L170,270 Q170,250 150,250 Z" 
                    fill="#ffffff" 
                    stroke="#cbd5e1" 
                    strokeWidth="2" 
                  />
                  <circle cx="110" cy="280" r="5" fill="#cbd5e1" />
                  <circle cx="125" cy="280" r="5" fill="#cbd5e1" />
                  <circle cx="140" cy="280" r="5" fill="#cbd5e1" />
                </g>
                
                <g>
                  <path 
                    d="M230,250 Q210,250 210,270 L210,290 Q210,310 230,310 L280,310 Q300,310 300,290 L300,270 Q300,250 280,250 Z" 
                    fill="#0ea5e9" 
                    stroke="#0ea5e9" 
                    strokeWidth="2" 
                  />
                  <rect x="230" y="270" width="50" height="4" rx="2" fill="white" />
                  <rect x="230" y="280" width="30" height="4" rx="2" fill="white" />
                  <rect x="230" y="290" width="40" height="4" rx="2" fill="white" />
                </g>
                
                {/* Connection lines */}
                <line x1="120" y1="250" x2="150" y2="220" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="250" y1="250" x2="230" y2="220" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5,5" />
                
                {/* Decorative elements */}
                <circle cx="80" cy="100" r="15" fill="#bae6fd" opacity="0.5" />
                <circle cx="320" cy="120" r="10" fill="#bae6fd" opacity="0.5" />
                <circle cx="100" cy="350" r="12" fill="#bae6fd" opacity="0.5" />
                <circle cx="300" cy="330" r="18" fill="#bae6fd" opacity="0.5" />
              </svg>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-lg shadow-sm"
        >
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
            Need More Help?
          </h2>
          <p className="text-gray-700 mb-4">
            We're constantly improving Booker to make book creation as seamless as possible. If you have any questions
            or suggestions, please don't hesitate to reach out!
          </p>
          <p className="text-gray-700">
            For technical issues, ensure your OpenAI API key is valid and has sufficient credits available.
            The quality of generated content depends on the specificity of your inputs and the capabilities of the
            underlying AI models.
          </p>
        </motion.div>
      </div>
    </div>
  );
}