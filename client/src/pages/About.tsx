import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function About() {
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
            {t.about.title}
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-2 md:order-1 flex flex-col justify-start h-full"
          >
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
              {t.about.aiPowered.title}
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="mb-3">
                {t.about.aiPowered.content1}
              </p>
              <p className="mb-3">
                {t.about.aiPowered.content2}
              </p>
              <h3 className="text-xl font-medium text-gray-800 mt-5 mb-2">
                {t.about.howItWorks.title}
              </h3>
              <p className="mb-3">
                {t.about.howItWorks.content}
              </p>
              <h3 className="text-xl font-medium text-gray-800 mt-5 mb-2">
                {t.about.future.title}
              </h3>
              <p>
                {t.about.future.content}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="order-1 md:order-2 flex items-start md:sticky md:top-24 self-start"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full bg-white border-y-0 border-x-8 border-black">
              <video 
                ref={videoRef}
                src="/videos/crafting_robots.mp4" 
                className="w-full h-auto"
                controls
                loop
                muted
                playsInline
                poster="/images/craft.png"
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-lg shadow-sm"
        >
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
            {t.about.mission.title}
          </h2>
          <p className="text-gray-700">
            {t.about.mission.content}
          </p>
        </motion.div>
      </div>
    </div>
  );
}