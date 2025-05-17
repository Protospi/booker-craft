import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function About() {
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
            About Booker
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
              AI-Powered Book Creation
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="mb-4">
                Booker is a revolutionary platform that harnesses the power of artificial intelligence to create personalized, 
                illustrated books tailored to your specifications. Our AI intelligent agents transform your ideas into fully 
                realized literary works, complete with engaging narratives and beautiful illustrations.
              </p>
              <p className="mb-4">
                Whether you're looking to create educational material, children's stories, or creative fiction, 
                our platform provides a seamless way to generate professional-quality books without the need for 
                traditional publishing processes.
              </p>
              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">
                How It Works
              </h3>
              <p className="mb-4">
                Our AI technology combines advanced language models with state-of-the-art image generation capabilities 
                to create cohesive, engaging books. You provide the theme, genre, and general direction, and our AI handles 
                the rest – from crafting compelling narratives to generating illustrations that complement the text.
              </p>
              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">
                The Future of Book Creation
              </h3>
              <p>
                Booker represents the frontier of AI-assisted creativity. By democratizing the book creation process, 
                we're opening new possibilities for storytelling, education, and creative expression. Our vision is 
                to empower anyone to become an author and bring their unique ideas to life through the power of artificial intelligence.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="order-1 md:order-2"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <svg className="w-full h-auto" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                {/* Background elements - desk and bookshelves */}
                <rect x="50" y="250" width="300" height="20" fill="#8B4513" />
                <rect x="60" y="270" width="280" height="80" fill="#A0522D" />
                <rect x="300" y="50" width="70" height="200" fill="#8B4513" />
                
                {/* Books on shelves */}
                <rect x="305" y="60" width="15" height="40" fill="#B22222" />
                <rect x="325" y="60" width="15" height="40" fill="#4169E1" />
                <rect x="345" y="60" width="15" height="40" fill="#2E8B57" />
                
                <rect x="305" y="110" width="15" height="40" fill="#9932CC" />
                <rect x="325" y="110" width="15" height="40" fill="#FF8C00" />
                <rect x="345" y="110" width="15" height="40" fill="#20B2AA" />
                
                <rect x="305" y="160" width="15" height="40" fill="#6495ED" />
                <rect x="325" y="160" width="15" height="40" fill="#FF6347" />
                <rect x="345" y="160" width="15" height="40" fill="#3CB371" />
                
                {/* Books on table */}
                <rect x="70" y="220" width="40" height="30" fill="#4682B4" />
                <rect x="75" y="190" width="30" height="30" fill="#DB7093" />
                <rect x="240" y="220" width="40" height="30" fill="#8FBC8F" />
                
                {/* Candle */}
                <rect x="150" y="200" width="10" height="50" fill="#FFF8DC" />
                <ellipse cx="155" cy="200" rx="5" ry="2" fill="#FFD700" />
                <polygon points="155,190 158,200 152,200" fill="#FF4500" />
                
                {/* Ink pot */}
                <ellipse cx="180" cy="230" rx="10" ry="8" fill="#483D8B" />
                
                {/* Robot drawing at desk */}
                <circle cx="200" cy="150" r="30" fill="#C0C0C0" /> {/* Head */}
                <rect x="185" y="180" width="30" height="50" fill="#A9A9A9" /> {/* Body */}
                
                {/* Robot face */}
                <circle cx="190" cy="145" r="5" fill="#191970" /> {/* Left eye */}
                <circle cx="210" cy="145" r="5" fill="#191970" /> {/* Right eye */}
                <line x1="195" y1="160" x2="205" y2="160" stroke="#191970" strokeWidth="2" /> {/* Mouth */}
                
                {/* Robot arms */}
                <line x1="185" y1="190" x2="140" y2="230" stroke="#A9A9A9" strokeWidth="8" /> {/* Left arm */}
                <line x1="215" y1="190" x2="250" y2="200" stroke="#A9A9A9" strokeWidth="8" /> {/* Right arm */}
                
                {/* Feather pen */}
                <line x1="140" y1="230" x2="120" y2="210" stroke="#DAA520" strokeWidth="2" />
                <path d="M120,210 C115,205 110,208 112,200 L125,212 Z" fill="#F0E68C" />
                
                {/* Open book being written */}
                <path d="M170,230 L220,230 L220,200 L170,200 Z" fill="#FFFFF0" />
                <path d="M170,230 C160,225 160,205 170,200" fill="none" stroke="#000000" strokeWidth="1" />
                <path d="M220,230 C230,225 230,205 220,200" fill="none" stroke="#000000" strokeWidth="1" />
                <path d="M195,215 L215,215 M195,220 L210,220" stroke="#000080" strokeWidth="1" />
              </svg>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-lg shadow-sm"
        >
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700">
            We believe that everyone has stories worth telling. Our mission is to break down the barriers to book creation 
            and publishing, making it accessible to all. By leveraging AI technology, we're empowering individuals to 
            express their creativity and share their knowledge with the world through beautifully crafted books.
          </p>
        </motion.div>
      </div>
    </div>
  );
}