import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import "../styles/fonts.css";

// Custom Hover Radius Button Component
function HoverRadiusButton({ text, onClick }) {
  const [hover, setHover] = useState(false);

  const buttonHolderStyle: React.CSSProperties = {
    display: "inline-flex",
    position: "relative",
    margin: "0",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    color: "rgba(255, 255, 255, 0.8)",
    width: "clamp(200px, 45vw, 280px)",
    padding: "clamp(12px, 3vw, 18px) clamp(20px, 5vw, 28px)",
    textDecoration: "none",
    fontWeight: "800",
    fontSize: "clamp(12px, 2.2vw, 16px)",
    fontFamily: "Nunito, sans-serif",
    borderRadius: hover ? "8px" : "0px 0px 60px 0px",
    transition: "all 0.4s ease",
    boxShadow: "none",
    border: "1px solid rgba(255, 165, 0, 0.3)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={buttonHolderStyle}>
      <button
        style={buttonStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);


  const textVariations = [
    {
      line1: "DISCOVER",
      line2: "THE WORLD",
      line3: "DIFFERENTLY"
    },
    {
      line1: "EXPLORE",
      line2: "LUXURY",
      line3: "DESTINATIONS"
    },
    {
      line1: "EXPERIENCE",
      line2: "PREMIUM",
      line3: "ADVENTURES"
    },
    {
      line1: "JOURNEY",
      line2: "BEYOND",
      line3: "IMAGINATION"
    },
    {
      line1: "CREATE",
      line2: "UNFORGETTABLE",
      line3: "MEMORIES"
    }
  ];

  useEffect(() => {
    document.body.style.overflow = "auto";
    
    // Show content immediately without waiting for video
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    
    // Auto-rotate text every 4 seconds
    const textTimer = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textVariations.length);
    }, 4000);
    
    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(contentTimer);
      clearInterval(textTimer);
    };
  }, [textVariations.length]);

  // Handle video load
  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleGetStarted = () => {
    navigate("/travel-form");
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
  src="https://visitabudhabi.ae/-/media/project/vad/Homepage/November-2023/Header/Brand-Amb-Desktop-05-nov-24"
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className="w-full h-full object-cover"
  style={{ border: 'none' }}
/>

        
        {/* Gradient overlay for better text readability and visual depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60"></div>
      </div>

      {/* Main Content Overlay */}
      <div className={`relative z-10 h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Content - Centered */}
          <div className="text-center space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 flex flex-col justify-center min-h-[80vh] py-8 sm:py-12 lg:py-16">
            
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
              transition={{ duration: 1.2, delay: showContent ? 0 : 0 }}
              className="space-y-1 sm:space-y-2 md:space-y-3 mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-4"
            >
             <h1
  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.85] sm:leading-[0.9]"
  style={{ fontFamily: 'HYPE, Boldonse, sans-serif', fontWeight: 'bold', letterSpacing: '-0.19em' }}
>
                <motion.span 
                  key={`line1-${currentTextIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="block text-white/70"
                >
                  {textVariations[currentTextIndex].line1}
                </motion.span>
                <motion.span 
                  key={`line2-${currentTextIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="block text-white/70"
                >
                  {textVariations[currentTextIndex].line2}
                </motion.span>
                <motion.span 
                  key={`line3-${currentTextIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="block text-amber-400/80"
                >
                  {textVariations[currentTextIndex].line3}
                </motion.span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
              transition={{ delay: showContent ? 0.5 : 0, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light text-white/70 px-4 sm:px-6 md:px-8 mb-8 sm:mb-10 lg:mb-12"
              style={{ 
                fontFamily: 'HYPE, Nunito, sans-serif'
              }}
            >
              Experience luxury travel like never before. Curated destinations, 
              premium accommodations, and unforgettable adventures await you.
            </motion.p>

            {/* Custom Button */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 40 }}
              transition={{ delay: showContent ? 1 : 0, duration: 0.8 }}
              className="flex justify-center mb-8 sm:mb-10 lg:mb-12 px-4"
            >
              <HoverRadiusButton 
                text="Start Your Journey" 
                onClick={handleGetStarted}
              />
            </motion.div>

            {/* Secondary Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
              transition={{ delay: showContent ? 1.5 : 0, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 text-white/60 mt-auto pt-6 sm:pt-8 px-4"
              style={{ fontFamily: 'HYPE, Nunito, sans-serif' }}
            >
              <div className="flex items-center gap-3 px-4 py-2 sm:px-6 sm:py-3">
                <div className="w-2 h-2 bg-amber-400/70 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">Premium Destinations</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 sm:px-6 sm:py-3">
                <div className="w-2 h-2 bg-amber-400/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-xs sm:text-sm font-medium">Luxury Accommodations</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 sm:px-6 sm:py-3">
                <div className="w-2 h-2 bg-amber-400/70 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-xs sm:text-sm font-medium">24/7 Concierge</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ delay: showContent ? 2 : 0, duration: 1 }}
        className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 h-2 bg-white/50 rounded-full mt-1.5"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}