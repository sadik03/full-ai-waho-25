import { Check, User, MapPin, Settings, Eye, Plane, Map, Palette, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface ProgressBarProps {
  currentStep: number; // 1-based index
}

const steps = [
  { 
    id: 1, 
    title: "Traveller Details", 
    description: "Share Your Personal & Trip Information",
    icon: User,
    color: "from-[#2C3D4F] to-[#4A5D6F]",
    bgColor: "bg-[#2C3D4F]/20"
  },
  { 
    id: 2, 
    title: "AI Trip Itinerary", 
    description: "Instantly Generate Your Smart UAE Itinerary",
    icon: Map,
    color: "from-[#2C3D4F] to-[#4A5D6F]", 
    bgColor: "bg-[#2C3D4F]/20"
  },
  { 
    id: 3, 
    title: "Customization", 
    description: "Fine-Tune Your Journey to Match Your Style",
    icon: Palette,
    color: "from-[#2C3D4F] to-[#4A5D6F]",
    bgColor: "bg-[#2C3D4F]/20"
  },
  { 
    id: 4, 
    title: "Final Review", 
    description: "Confirm & Book Your Perfect UAE Experience",
    icon: CheckCircle,
    color: "from-[#2C3D4F] to-[#4A5D6F]",
    bgColor: "bg-[#2C3D4F]/20"
  },
];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const total = steps.length;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStep - 1) / (total - 1)) * 100)
  );
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content immediately without waiting for video
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="relative w-full">
      {/* Background Video */}
      {/* <div className="absolute inset-0 w-full h-[200px] overflow-hidden">
        <iframe
          ref={videoRef}
          src="https://kinescope.io/embed/4XX8Nxok73rwh8yxqQMqqq?player_id=d226cc96-6688-4b30-a74c-8fcf16e5f39e&v=2.164.2&_=cGxheWVySWQ9X19raW5lc2NvcGVfcGxheWVyXzMmc2l6ZSU1QndpZHRoJTVEPTEwMCUyNSZzaXplJTVCaGVpZ2h0JTVEPTEwMCUyNSZiZWhhdmlvciU1QmF1dG9QYXVzZSU1RD1mYWxzZSZiZWhhdmlvciU1QmF1dG9QbGF5JTVEPXRydWUmYmVoYXZpb3IlNUJsb29wJTVEPXRydWUmYmVoYXZpb3IlNUJtdXRlZCU1RD10cnVlJmJlaGF2aW9yJTVCcGxheXNJbmxpbmUlNUQ9dHJ1ZSZiZWhhdmlvciU1QmxvY2FsU3RvcmFnZSU1RD1mYWxzZSZ1aSU1QmNvbnRyb2xzJTVEPWZhbHNlJnVpJTVCbWFpblBsYXlCdXR0b24lNUQ9ZmFsc2UmdWklNUJwbGF5YmFja1JhdGVCdXR0b24lNUQ9ZmFsc2U%3D"
          className="w-full h-full object-cover"
          style={{ border: 'none' }}
          allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleVideoLoad}
          loading="eager"
        />
       
        <div className="absolute inset-0 bg-black/50"></div>
      </div> */}
      
      {/* Progress Bar Content */}
      <div className={`relative z-10 w-full h-[200px] flex items-center justify-center transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          

          {/* Steps Container */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {steps.map((step, index) => {
              const isDone = step.id < currentStep;
              const isActive = step.id === currentStep;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  {/* Step Card */}
                  <motion.div
                    className="flex flex-col items-center text-center flex-1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
                    transition={{ 
                      delay: showContent ? index * 0.15 : 0, 
                      duration: 0.6,
                      ease: "easeOut" 
                    }}
                  >
                    {/* Icon Container */}
                    <motion.div
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl transition-all duration-500 border-2 ${
                        isDone
                          ? `bg-[#2C3D4F]/20 border-[#2C3D4F]/40 text-[#2C3D4F] shadow-xl`
                          : isActive
                          ? `bg-[#2C3D4F]/20 border-[#2C3D4F]/60 text-[#2C3D4F] shadow-lg backdrop-blur-md`
                          : "bg-[#2C3D4F]/10 border-[#2C3D4F]/20 text-[#2C3D4F]/50"
                      }`}
                      style={{ backgroundColor: 'rgba(44,61,79,0.10)', boxShadow: isActive ? '0 4px 24px 0 rgba(44,61,79,0.10)' : isDone ? '0 2px 12px 0 rgba(44,61,79,0.10)' : 'none' }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -2
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isDone ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            delay: 0.3 + index * 0.1, 
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <Check className="w-6 h-6 sm:w-7 sm:h-7 text-[#2C3D4F]" />
                        </motion.div>
                      ) : (
                        <StepIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#2C3D4F]" />
                      )}

                      {/* Active Step Animations */}
                      {isActive && (
                        <>
                          {/* Rotating Ring */}
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-[#2C3D4F]/60"
                            animate={{ rotate: 360 }}
                            transition={{ 
                              duration: 8, 
                              repeat: Infinity, 
                              ease: "linear" 
                            }}
                          />
                          
                          {/* Pulsing Glow */}
                          <motion.div
                            className="absolute inset-0 rounded-2xl bg-[#2C3D4F]/20"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0.8, 0.5] 
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut" 
                            }}
                          />
                        </>
                      )}

                      {/* Step Status Indicator */}
                      <motion.div
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone
                            ? "bg-[#2C3D4F] text-white shadow-lg"
                            : isActive
                            ? "bg-[#2C3D4F] text-white shadow-lg"
                            : "bg-[#2C3D4F]/50 text-[#2C3D4F]"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      >
                        {isDone ? "✓" : step.id}
                      </motion.div>
                    </motion.div>

                    {/* Step Title */}
                    <motion.h4
                      className={`mt-3 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                        step.id <= currentStep 
                          ? "text-[#2C3D4F]" 
                          : "text-[#2C3D4F]/60"
                      }`}
                      style={{ 
                        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    >
                      {step.title}
                    </motion.h4>

                    {/* Step Description */}
                    <motion.p 
                      className={`hidden sm:block text-xs mt-1 transition-all duration-300 text-center max-w-[120px] ${
                        step.id <= currentStep ? "text-[#2C3D4F]/70" : "text-[#2C3D4F]/40"
                      }`}
                      style={{ 
                        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                        fontSize: '10px',
                        lineHeight: '1.3'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    >
                      {step.description}
                    </motion.p>
                  </motion.div>

                  {/* Travel Route Connector */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
                      <div className="relative w-full h-1">
                        {/* Route Path */}
                        <div className="h-1 w-full bg-[#2C3D4F]/20 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div
                            className={`h-full bg-gradient-to-r from-[#2C3D4F] via-[#3A4B5C] to-[#4A5D6F] rounded-full relative ${
                              isDone ? "w-full" : "w-0"
                            }`}
                            initial={{ width: "0%" }}
                            animate={{ 
                              width: isDone ? "100%" : "0%" 
                            }}
                            transition={{ 
                              duration: 1, 
                              delay: 0.6 + index * 0.2,
                              ease: "easeInOut" 
                            }}
                          >
                            {/* Moving Travel Dot */}
                            {isDone && (
                              <motion.div
                                className="absolute top-1/2 right-0 w-3 h-3 bg-[#2C3D4F] rounded-full transform -translate-y-1/2 shadow-lg"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ 
                                  duration: 0.8, 
                                  delay: 0.8 + index * 0.2,
                                  ease: "easeOut" 
                                }}
                              />
                            )}
                          </motion.div>
                        </div>
                        
                        {/* Route Landmarks */}
                        <motion.div
                          className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#2C3D4F]/60 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}