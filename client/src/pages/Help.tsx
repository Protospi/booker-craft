import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useRef } from "react";

export default function Help() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        // Handle auto-play restrictions in browsers
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-serif font-bold text-center text-gray-900 mb-8">
            {t.help.title}
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-start h-full"
          >
            <div className="prose prose-slate max-w-none">
              <p className="mb-6 text-lg">
                {t.help.subtitle}
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">
                    {t.help.gettingStarted.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      {t.help.gettingStarted.content1}
                    </p>
                    <p>
                      {t.help.gettingStarted.content2}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">
                    {t.help.creatingBook.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">{t.help.creatingBook.intro}</p>
                    <ol className="list-decimal pl-5 space-y-2 mb-4">
                      <li>{t.help.creatingBook.step1}</li>
                      <li>{t.help.creatingBook.step2}</li>
                      <li>{t.help.creatingBook.step3}</li>
                      <li>{t.help.creatingBook.step4}</li>
                      <li>{t.help.creatingBook.step5}</li>
                    </ol>
                    <p>
                      {t.help.creatingBook.tip}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">
                    {t.help.managingBooks.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      {t.help.managingBooks.intro}
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>{t.help.managingBooks.action1}</li>
                      <li>{t.help.managingBooks.action2}</li>
                      <li>{t.help.managingBooks.action3}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">
                    {t.help.generationProcess.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      {t.help.generationProcess.intro}
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>{t.help.generationProcess.phase1}</li>
                      <li>{t.help.generationProcess.phase2}</li>
                      <li>{t.help.generationProcess.phase3}</li>
                      <li>{t.help.generationProcess.phase4}</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">
                    {t.help.languageSettings.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      {t.help.languageSettings.content}
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
            className="flex items-start md:sticky md:top-24 self-start"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full bg-white border-y-0 border-x-8 border-black">
              <video 
                ref={videoRef}
                src="/videos/help.mp4" 
                className="w-full h-auto"
                controls
                loop
                muted
                playsInline
                poster="/images/help-poster.png"
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-lg shadow-sm"
        >
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
            {t.help.needMoreHelp}
          </h2>
          <p className="text-gray-700 mb-4">
            {t.help.helpText}
          </p>
          <p className="text-gray-700">
            {t.help.technicalIssues}
          </p>
        </motion.div>
      </div>
    </div>
  );
}