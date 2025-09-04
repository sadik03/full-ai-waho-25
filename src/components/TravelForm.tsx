import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Settings } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageContainer from "./ImageContainer";
import { TravelSubmissionService } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Custom Hover Radius Button Component from Landing page
function HoverRadiusButton({ text, onClick, className = "", type = "button" }: {
  text: React.ReactNode;
  onClick: (e?: React.FormEvent) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  const [hover, setHover] = useState(false);

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#2C3E50",
    color: "#FFFFFF",
    width: "100%",
    padding: "16px 20px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "Nunito, sans-serif",
    borderRadius: hover ? "2px" : "0px 0px 50px 0px",
    transition: "all 0.4s ease",
    boxShadow: hover
      ? "0 6px 14px rgba(0,0,0,0.2)"
      : "0 2px 6px rgba(0,0,0,0.1)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
// Tailwind custom color utility for #2C3E50
// Usage: className="text-[#2C3E50] bg-[#2C3E50] border-[#2C3E50]"
// Or style={{ color: '#2C3E50' }}

  return (
    <button
      type={type}
      style={buttonStyle}
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => onClick(e)}
    >
      {text}
    </button>
  );
}

// Add subtle CSS animations
const ovalAnimationStyles = `
  @keyframes subtleFloat {
    0%, 100% { transform: translateY(0px); opacity: 0.05; }
    50% { transform: translateY(-5px); opacity: 0.08; }
  }
  
  @keyframes gentleMove {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-48%, -52%) scale(1.02); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = ovalAnimationStyles;
  document.head.appendChild(styleSheet);
}

// Country codes data with flags and dial codes
const countryCodes = [
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
  { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "PE", name: "Peru", dial: "+51", flag: "🇵🇪" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭" },
  { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { code: "JO", name: "Jordan", dial: "+962", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", dial: "+961", flag: "🇱🇧" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱" },
  { code: "RU", name: "Russia", dial: "+7", flag: "🇷🇺" },
  { code: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦" },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", dial: "+420", flag: "🇨🇿" },
  { code: "HU", name: "Hungary", dial: "+36", flag: "🇭🇺" },
  { code: "RO", name: "Romania", dial: "+40", flag: "🇷🇴" },
  { code: "GR", name: "Greece", dial: "+30", flag: "🇬🇷" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { code: "IS", name: "Iceland", dial: "+354", flag: "🇮🇸" },
  { code: "LU", name: "Luxembourg", dial: "+352", flag: "🇱🇺" },
  { code: "MT", name: "Malta", dial: "+356", flag: "🇲🇹" },
  { code: "CY", name: "Cyprus", dial: "+357", flag: "🇨🇾" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" }
].sort((a, b) => a.name.localeCompare(b.name));

// Emirates list with image thumbnails (external URLs)
const emiratesList = [
  { id: "dubai", name: "Dubai", thumbnail: "https://media.easemytrip.com/media/Deal/DL638542352450108717/SightSeeing/SightSeeing1Rr9LK.jpg" },
  { id: "abu-dhabi", name: "Abu Dhabi", thumbnail: "https://wahawonders.blob.core.windows.net/wahawonders/image/emirate/abudhabi.jpg" },
  { id: "sharjah", name: "Sharjah", thumbnail: "https://wahawonders.blob.core.windows.net/wahawonders/image/emirate/sharjah.jpg" },
  { id: "ajman", name: "Ajman", thumbnail: "https://wahawonders.blob.core.windows.net/wahawonders/image/emirate/ajman.webp" },
  { id: "fujairah", name: "Fujairah", thumbnail: "https://wahawonders.blob.core.windows.net/wahawonders/image/emirate/fujairah3.jpg" },
  { id: "ras-al-khaimah", name: "Ras Al Khaimah", thumbnail: "https://wahawonders.blob.core.windows.net/wahawonders/image/emirate/Ras%20Al%20Khaimah.jpg" },
  { id: "umm-al-quwain", name: "Umm Al Quwain", thumbnail: "https://wahawonders.blob.core.windows.net/wahawonders/image/emirate/Umm%20Al%20Quwain3.jpg" }
];

// ✅ Validation schema
const travelFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string()
    .min(5, "Phone number is required")
    .max(25, "Phone number is too long"),
  email: z.string().email("Invalid email address"),
  tripDuration: z.string()
    .min(1, "Trip duration is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number")
    .refine((val) => Number(val) >= 1, "Minimum 1 night required")
    .refine((val) => Number(val) <= 30, "Maximum 30 nights allowed"),
  journeyMonth: z.string().min(1, "Journey month is required"),
  departureCountry: z.string().min(1, "Departure country is required"),
  emirates: z.array(z.string()).min(1, "Please select at least one emirate"),
  budget: z.string().optional(),
  adults: z.coerce.number().min(1, "At least 1 adult required").max(20, "Maximum 20 adults allowed"),
  kids: z.coerce.number().min(0).max(15, "Maximum 15 kids allowed").optional(),
  infants: z.coerce.number().min(0).max(10, "Maximum 10 infants allowed").optional(),
}).refine((data) => {
  const total = data.adults + (data.kids || 0) + (data.infants || 0);
  return total <= 30;
}, {
  message: "Total group size cannot exceed 30 travelers",
  path: ["adults"]
});

type TravelFormData = z.infer<typeof travelFormSchema>;

export function TravelForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCountryCode, setSelectedCountryCode] = useState("+971"); // Default to UAE
  const [phoneInput, setPhoneInput] = useState("");
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [isDepartureCountryDropdownOpen, setIsDepartureCountryDropdownOpen] = useState(false); // for Departing Country
  const [isPhoneCountryDropdownOpen, setIsPhoneCountryDropdownOpen] = useState(false); // for phone country code
  const [selectedEmirates, setSelectedEmirates] = useState<string[]>(emiratesList.map(e => e.id)); // Default to all individual emirates
  const [isAllEmiratesSelected, setIsAllEmiratesSelected] = useState(true);
  const [isEmiratesDropdownOpen, setIsEmiratesDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TravelFormData>({
    resolver: zodResolver(travelFormSchema),
    defaultValues: {
      fullName: "",
      phone: "+971",
      email: "",
      tripDuration: "5",
      journeyMonth: "january",
      departureCountry: "United Arab Emirates",
      emirates: emiratesList.map(e => e.id),
      budget: "3,000 - 5,000",
      adults: 1,
      kids: 0,
      infants: 0,
    },
  });

  // Watch form values for real-time updates
  const watchedValues = watch();

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    if (!countrySearchTerm) return countryCodes;
    return countryCodes.filter(country => 
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.dial.includes(countrySearchTerm) ||
      country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
    );
  }, [countrySearchTerm]);

  // Handle emirates selection logic
  const handleEmirateChange = (emirateId: string, checked: boolean) => {
    if (emirateId === "all") {
      if (checked) {
        // When "All Emirates" is checked, select all individual emirates
        const allEmirateIds = emiratesList.map(e => e.id);
        setSelectedEmirates(allEmirateIds);
        setIsAllEmiratesSelected(true);
        setValue("emirates", allEmirateIds);
      } else {
        // When "All Emirates" is unchecked, uncheck all emirates
        setSelectedEmirates([]);
        setIsAllEmiratesSelected(false);
        setValue("emirates", []);
      }
    } else {
      let newSelection: string[];
      if (checked) {
        // Add individual emirate
        newSelection = [...selectedEmirates.filter(id => id !== "all"), emirateId];
        
        // Check if all individual emirates are now selected
        if (newSelection.length === emiratesList.length) {
          setIsAllEmiratesSelected(true);
        } else {
          setIsAllEmiratesSelected(false);
        }
      } else {
        // Remove individual emirate
        newSelection = selectedEmirates.filter(id => id !== emirateId && id !== "all");
        setIsAllEmiratesSelected(false);
      }
      
      // If no emirates selected, fall back to empty selection
      if (newSelection.length === 0) {
        setSelectedEmirates([]);
        setIsAllEmiratesSelected(false);
        setValue("emirates", []);
      } else {
        setSelectedEmirates(newSelection);
        setValue("emirates", newSelection);
      }
    }
  };

  // Update form value when emirates selection changes
  useEffect(() => {
    setValue("emirates", selectedEmirates);
  }, [selectedEmirates, setValue]);

  // Get display text for emirates dropdown
  const getEmiratesDisplayText = () => {
    if (isAllEmiratesSelected) {
      return "All Emirates";
    }
    if (selectedEmirates.length === 0) {
      return "Select Emirates";
    }
    if (selectedEmirates.length === 1) {
      const emirate = emiratesList.find(e => e.id === selectedEmirates[0]);
      return emirate ? emirate.name : "Select Emirates";
    }
    return `${selectedEmirates.length} Emirates Selected`;
  };

  // Build the list of images to preview and auto-cycle when multiple are selected
  const selectedEmirateImages = useMemo(() => {
    if (isAllEmiratesSelected) {
      // Show all emirates images when "All Emirates" is selected
      return emiratesList.map(e => e.thumbnail);
    }
    if (selectedEmirates.length === 0) {
      const abuDhabiThumb = emiratesList.find(e => e.id === "abu-dhabi")?.thumbnail || "https://wahawonders.blob.core.windows.net/wahawonders/image/emirate/abudhabi.jpg";
      return [abuDhabiThumb];
    }
    const urls = selectedEmirates
      .map((id) => emiratesList.find((e) => e.id === id)?.thumbnail)
      .filter((u): u is string => Boolean(u));
    return urls.length ? urls : ["https://wahawonders.blob.core.windows.net/wahawonders/image/emirate/abudhabi.jpg"];
  }, [isAllEmiratesSelected, selectedEmirates]);

  const [previewIndex, setPreviewIndex] = useState(0);

  // Reset to first image whenever selection changes
  useEffect(() => {
    setPreviewIndex(0);
  }, [selectedEmirateImages]);

  // Cycle through images every 3s if multiple selected
  useEffect(() => {
    if (selectedEmirateImages.length <= 1) return;
    const id = setInterval(() => {
      setPreviewIndex((i) => (i + 1) % selectedEmirateImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [selectedEmirateImages]);

  const previewImageUrl = selectedEmirateImages[Math.min(previewIndex, selectedEmirateImages.length - 1)];

  // Handle AI Planning submission
  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 AI Submit button clicked');
    
    // Validate form first
    handleSubmit(
      (data) => {
        console.log('✅ Form validation passed:', data);
        onSubmit(data, "/ai-generate");
      },
      (errors) => {
        console.log('⚠️ Form validation failed:', errors);
        toast({
          title: "Please complete all required fields",
          description: "Check the highlighted fields and try again.",
          variant: "destructive",
        });
        // Don't navigate on validation errors
      }
    )();
  };

  // Handle Manual Planning submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Manual Submit button clicked');
    
    // Validate form first
    handleSubmit(
      (data) => {
        console.log('✅ Form validation passed:', data);
        onSubmit(data, "/manual-plan");
      },
      (errors) => {
        console.log('⚠️ Form validation failed:', errors);
        toast({
          title: "Please complete all required fields",
          description: "Check the highlighted fields and try again.",
          variant: "destructive",
        });
        // Don't navigate on validation errors
      }
    )();
  };

  const onSubmit = async (data: TravelFormData, path: string) => {
    console.log('🚀 Form submission started:', data);
    
    try {
      // Store in localStorage for backward compatibility
      localStorage.setItem("travelFormData", JSON.stringify(data));
      
      // Submit to database (but don't block navigation if it fails)
      const submissionData = {
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        trip_duration: parseInt(data.tripDuration),
        journey_month: data.journeyMonth,
        departure_country: data.departureCountry,
        emirates: data.emirates,
        budget: data.budget || '',
        adults: data.adults,
        kids: data.kids || 0,
        infants: data.infants || 0,
        submission_status: 'pending' as const
      };

      console.log('📊 Submitting to database:', submissionData);
      
      // Try to submit to database, but don't wait for it
      TravelSubmissionService.addSubmission(submissionData)
        .then((result) => {
          console.log('✅ Travel form submitted successfully to database:', result);
        })
        .catch((error) => {
          console.error('❌ Error submitting to database (but continuing):', error);
        });
      
      // Navigate immediately without waiting for database
      console.log('🧭 Navigating to:', path);
      navigate(path);
      
    } catch (error) {
      console.error('❌ Error in form submission:', error);
      
      // Always navigate even if there's an error
      console.log('🧭 Navigating anyway to:', path);
      navigate(path);
    }
  };

  return (
    <>
      <Toaster />
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-auto"
          style={{
            backgroundImage: 'url(/16.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#F5F2E9'
          }}
        >
          {/* Background Overlay for better readability */}
          <div className="fixed inset-0 bg-white/75 min-h-screen w-full" ></div>
          <div className="relative min-h-screen flex flex-col">
            {/* Progress Bar */}
            <div className="flex-shrink-0 py-0">
              <ProgressBar currentStep={1} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-80 py-2 sm:py-4">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="w-full max-w-[1200px] mx-auto lg:ml-[-210px]"
              >
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="px-2 sm:px-6">
                    <h1 
                      className="text-[#1A252F] text-[24px] sm:text-[30px] lg:text-[40px] leading-[1.1] mb-2"
                      style={{ fontFamily: 'Delius, sans-serif', fontWeight: 'bold', letterSpacing: '-0.04em' }}
                    >
  
                      Design Your UAE Adventure, Your Way
                    </h1>
                    <h5 className="text-[#2C3E50] text-[16px] sm:text-[18px] lg:text-[20px] font-medium font-Nunito leading-tight max-w-2xl mx-auto">
                      Embark on an extraordinary journey through the jewels of the Arabian Peninsula
                    </h5>
                  </div>
                </div>

                {/* Main Card */}
                <Card className="border-2 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
                  <CardContent className="p-0">
                    <div>
                      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[400px] sm:min-h-[450px]">
                        
                        {/* Left Side - Masked Image Preview */}
                        <div className="lg:col-span-2 relative order-2 lg:order-1 hidden lg:block">
                          <div className="relative h-full min-h-[450px] overflow-hidden ">
                            {/* Image */}
                            <img 
                              src={previewImageUrl} 
                              alt="Emirates Preview" 
                              className="w-full h-full object-cover transition-all duration-1000 ease-out transform hover:scale-105" 
                            />
                            
                            {/* Overlay Elements */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-20"></div>
                            
                            {/* Rounded Corner Decorations */}
                            <div className="absolute top-6 left-6 w-12 h-12 border-l-3 border-t-3 rounded-tl-2xl z-30" style={{ borderColor: '#2C3E50' }}></div>
                            <div className="absolute top-6 right-6 w-12 h-12 border-r-3 border-t-3 rounded-tr-2xl z-30" style={{ borderColor: '#2C3E50' }}></div>
                            <div className="absolute bottom-6 left-6 w-12 h-12 border-l-3 border-b-3 rounded-bl-2xl z-30" style={{ borderColor: '#2C3E50' }}></div>
                            <div className="absolute bottom-6 right-6 w-12 h-12 border-r-3 border-b-3 rounded-br-2xl z-30" style={{ borderColor: '#2C3E50' }}></div>
                            
                            {/* Destination Badge */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30">
                              <div className="px-6 py-3 rounded-full shadow-xl backdrop-blur-md bg-white/20 border border-white/30">
                                <span className="text-[#2C3E50] text-sm font-semibold tracking-wider drop-shadow-sm">
                                  {isAllEmiratesSelected ? "ALL UAE EMIRATES" : getEmiratesDisplayText().toUpperCase()}
                                </span>
                              </div>
                            </div>
                            
                            {/* Image Indicators */}
                            {selectedEmirateImages.length > 1 && (
                              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                                {selectedEmirateImages.map((_, index) => (
                                  <div
                                    key={index}
                                    className={`transition-all duration-500 rounded-full cursor-pointer ${
                                      index === previewIndex 
                                        ? 'w-8 h-3 shadow-xl' 
                                        : 'w-3 h-3 hover:opacity-80'
                                    }`}
                                    style={{ 
                                      backgroundColor: index === previewIndex ? '#2C3E50' : '#FFFFFF60'
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            
                            {/* Trust Indicators */}
                           
                          </div>
                        </div>

                        {/* Right Side - Form with Inline Inputs */}
                        <div className="lg:col-span-3 p-3 sm:p-4 lg:p-6 relative order-1 lg:order-2">
                          {/* Subtle Background Shape */}
                          <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div 
                              className="absolute w-80 h-80 rounded-full"
                              style={{
                                background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.03), rgba(26, 37, 47, 0.05)),',
                                top: '20%',
                                right: '-10%',
                                animation: 'subtleFloat 12s ease-in-out infinite'
                              }}
                            ></div>
                            <div 
                              className="absolute w-60 h-60 rounded-full"
                              style={{
                                background: 'radial-gradient(circle, rgba(44, 62, 80, 0.04), transparent),',
                                bottom: '10%',
                                left: '-5%',
                                animation: 'gentleMove 15s ease-in-out infinite'
                              }}
                            ></div>
                          </div>
                          
                    <div className="h-full flex flex-col relative z-10">
                      
                      {/* Form Header */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#2C3E50' }}></div>
                          <h2 className="text-xl font-bold text-[#1A252F]">Travel Details</h2>
                        </div>
                        <p className="text-[#2C3E50] text-sm">Complete your luxury travel preferences</p>
                      </div>

                      {/* Form Grid with Outlined Inputs */}
                      <div className="flex-1 space-y-3">
                        
                        {/* Personal Information - Compact Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Full Name */}
                          <div className="space-y-2">
                            <Label className="text-[#1A252F] text-xs font-semibold flex items-center gap-2">
                              Full Name <span style={{ color: '#2C3E50' }}>*</span>
                            </Label>
                            <Input 
                              {...register("fullName")} 
                              placeholder="Your full name"
                              className="h-10 bg-transparent border-0 border-b-2 text-[#1A252F] placeholder:text-[#2C3E50] rounded-none focus:ring-0 focus:outline-none focus:border-b-2 transition-all duration-300 px-0"
                              style={{ borderBottomColor: '#2C3E50', boxShadow: 'none' }}
                            />
                            {errors.fullName && <p className="text-amber-600 text-xs">{errors.fullName.message}</p>}
                          </div>

                          {/* Phone Number with Country Code */}
                          <div className="space-y-2">
                            <Label className="text-[#1A252F] text-xs font-semibold flex items-center gap-2">
                              Phone Number <span style={{ color: '#2C3E50' }}>*</span>
                            </Label>
                            <div className="relative">
                              {/* Country Flag Dropdown */}
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                              <Select 
                                open={isPhoneCountryDropdownOpen}
                                onOpenChange={(open) => {
                                  setIsPhoneCountryDropdownOpen(open);
                                  if (open) setIsDepartureCountryDropdownOpen(false);
                                }}
                                value={selectedCountryCode} 
                                onValueChange={(value) => {
                                  setSelectedCountryCode(value);
                                  const currentPhone = watch("phone") || "";
                                  const phoneWithoutCode = currentPhone.replace(/^\+\d+\s*/, "");
                                  const newPhone = phoneWithoutCode ? `${value} ${phoneWithoutCode}` : value;
                                  setValue("phone", newPhone);
                                  setCountrySearchTerm(""); // Reset search when country is selected
                                }}
                              >
                                  <SelectTrigger className="w-7 h-7 sm:w-8 sm:h-8 bg-transparent border-0 p-0 focus:outline-none focus:ring-0">
                                    <SelectValue>
                                      <span className="text-base sm:text-lg">{countryCodes.find(c => c.dial === selectedCountryCode)?.flag}</span>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-2 rounded-xl shadow-lg max-h-80 overflow-hidden" style={{ borderColor: '#2C3E50' }}>
                                    {/* Search Input */}
                                    <div className="p-3 border-b" style={{ borderColor: '#2C3E5020' }}>
                                      <Input
                                        placeholder="Search countries..."
                                        value={countrySearchTerm}
                                        onChange={(e) => setCountrySearchTerm(e.target.value)}
                                        className="h-8 bg-gray-50 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-[#2C3E50] transition-all duration-300"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                    
                                    {/* Countries List */}
                                    <div className="max-h-60 overflow-y-auto">
                                      {filteredCountries.length > 0 ? (
                                        filteredCountries.map((country) => (
                                          <SelectItem key={country.code} value={country.dial} className="text-[#1A252F] hover:bg-[#0d1b2a] focus:bg-[#0d1b2a] data-[state=checked]:bg-[#0d1b2a] data-[state=checked]:text-white px-3 py-2">
                                            <div className="flex items-center gap-3">
                                              <span className="text-lg">{country.flag}</span>
                                              <div className="flex-1">
                                                <span className="text-sm font-medium">{country.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">{country.dial}</span>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <div className="px-3 py-4 text-center text-sm text-gray-500">
                                          No countries found
                                        </div>
                                      )}
                                    </div>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Country Code Display */}
                              <div className="absolute left-8 sm:left-10 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-[#2C3E50] font-medium z-10 pointer-events-none">
                                {selectedCountryCode}
                              </div>
                              
                              {/* Phone Input */}
                              <Input 
                                placeholder="50 123 4567"
                                className="h-10 bg-transparent border-0 border-b-2 text-[#1A252F] placeholder:text-[#2C3E50] rounded-none focus:ring-0 focus:outline-none focus:border-b-2 transition-all duration-300 pl-16 sm:pl-20 pr-0"
                                style={{ borderBottomColor: '#2C3E50', boxShadow: 'none' }}
                                type="tel"
                                value={watch("phone")?.replace(/^\+\d+\s*/, "") || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Only allow numeric characters and spaces
                                  const numericValue = value.replace(/[^0-9\s]/g, '');
                                  // Only store the phone number part, country code is displayed separately
                                  const cleanValue = numericValue.replace(/^\+\d+\s*/, "");
                                  // Combine with selected country code for form submission
                                  const newPhone = cleanValue ? `${selectedCountryCode} ${cleanValue}` : selectedCountryCode;
                                  setValue("phone", newPhone);
                                }}
                                onKeyPress={(e) => {
                                  // Prevent non-numeric characters from being typed
                                  if (!/[0-9\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                            {errors.phone && <p className="text-amber-600 text-xs">{errors.phone.message}</p>}
                          </div>
                        </div>

                        {/* Email Row */}
                        <div className="grid grid-cols-1 gap-3">
                          {/* Email */}
                          <div className="space-y-2">
                            <Label className="text-black text-xs font-semibold flex items-center gap-2">
                              Email Address <span style={{ color: '#AD803B' }}>*</span>
                            </Label>
                            <Input 
                              {...register("email")} 
                              type="email"
                              placeholder="your@email.com"
                              className="h-10 bg-transparent border-0 border-b-2 text-black placeholder:text-gray-400 rounded-none focus:ring-0 focus:outline-none focus:border-b-2 transition-all duration-300 px-0"
                              style={{ borderBottomColor: '#AD803B', boxShadow: 'none' }}
                            />
                            {errors.email && <p className="text-amber-600 text-xs">{errors.email.message}</p>}
                          </div>
                        </div>

                        {/* Trip Details - Compact Layout */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                          {/* Duration */}
                          <div className="space-y-2">
                            <Label className="text-[#1A252F] text-xs font-semibold">Duration (Nights)</Label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const current = parseInt(watchedValues.tripDuration || "5");
                                  const newValue = Math.max(1, current - 1);
                                  setValue("tripDuration", newValue.toString());
                                }}
                                className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center hover:bg-[#1A252F] transition-colors"
                              >
                                -
                              </button>
                              <div className="w-16 h-10 bg-transparent border-0 border-b-2 text-[#1A252F] text-center flex items-center justify-center" style={{ borderBottomColor: '#2C3E50' }}>
                                {watchedValues.tripDuration || "5"}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = parseInt(watchedValues.tripDuration || "5");
                                  const newValue = Math.min(30, current + 1);
                                  setValue("tripDuration", newValue.toString());
                                }}
                                className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center hover:bg-[#1A252F] transition-colors"
                              >
                                +
                              </button>
                            </div>
                            {errors.tripDuration && <p className="text-amber-600 text-xs">{errors.tripDuration.message}</p>}
                          </div>

                          {/* Travel Month */}
                          <div className="space-y-2">
                            <Label className="text-[#1A252F] text-xs font-semibold">Travel Month</Label>
                            <Select value={watch("journeyMonth")} onValueChange={(v) => setValue("journeyMonth", v)}>
                              <SelectTrigger className="h-10 bg-transparent border-0 border-b-2 text-[#1A252F] rounded-none px-0 focus:outline-none focus:border-b-2" style={{ borderBottomColor: '#2C3E50', boxShadow: 'none' }}>
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2 rounded-xl shadow-lg" style={{ borderColor: '#2C3E50' }}>
                                {["January","February","March","April","May","June","July","August","September","October","November","December"].map((month) => (
                                  <SelectItem key={month.toLowerCase()} value={month.toLowerCase()} className="text-[#1A252F] hover:bg-[#0d1b2a] focus:bg-[#0d1b2a] data-[state=checked]:bg-[#0d1b2a] data-[state=checked]:text-white">
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.journeyMonth && <p className="text-amber-600 text-xs">{errors.journeyMonth.message}</p>}
                          </div>

                          {/* Departure */}
                          <div className="space-y-2">
                            <Label className="text-black text-xs font-semibold">Departing Country</Label>
                            <Select
                              value={watch("departureCountry")}
                              onValueChange={(v) => {
                                setValue("departureCountry", v);
                                setCountrySearchTerm("");
                              }}
                              open={isDepartureCountryDropdownOpen}
                              onOpenChange={(open) => {
                                setIsDepartureCountryDropdownOpen(open);
                                if (open) setIsPhoneCountryDropdownOpen(false);
                              }}
                            >
                              <SelectTrigger className="h-10 bg-transparent border-0 border-b-2 text-black rounded-none px-0 focus:ring-0 focus:outline-none focus:border-b-2 transition-all duration-300" style={{ borderBottomColor: '#AD803B', boxShadow: 'none' }}>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2 rounded-xl max-h-60 overflow-y-auto p-0" style={{ borderColor: '#0d1b2a' }}>
                                {/* Single container: search and scroll together */}
                                <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-100">
                                  <Input
                                    placeholder="Type to search..."
                                    value={countrySearchTerm}
                                    onChange={e => setCountrySearchTerm(e.target.value)}
                                    className="h-8 px-2 text-sm border border-gray-200 rounded"
                                    autoFocus
                                  />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                  {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                      <SelectItem key={country.code} value={country.name} className="text-black hover:bg-[#0d1b2a] focus:bg-[#0d1b2a] data-[state=checked]:bg-[#0d1b2a] data-[state=checked]:text-white">
                                        <span className="mr-2">{country.flag}</span>{country.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="px-3 py-4 text-center text-sm text-gray-500">No countries found</div>
                                  )}
                                </div>
                              </SelectContent>
                            </Select>
                            {errors.departureCountry && <p className="text-amber-600 text-xs">{errors.departureCountry.message}</p>}
                          </div>

                          {/* Emirates */}
                          <div className="space-y-2">
                            <Label className="text-black text-xs font-semibold">Destinations</Label>
                            <Select 
                              open={isEmiratesDropdownOpen}
                              onOpenChange={setIsEmiratesDropdownOpen}
                              value="placeholder"
                            >
                              <SelectTrigger className="h-10 bg-transparent border-0 border-b-2 text-[#1A252F] rounded-none px-0 focus:outline-none focus:border-b-2" style={{ borderBottomColor: '#2C3E50', boxShadow: 'none' }}>
                                <SelectValue>
                                  <span className="text-sm">{getEmiratesDisplayText()}</span>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2 rounded-xl max-h-[280px]" style={{ borderColor: '#AD803B' }}>
                                <div className="p-2">
                                  {/* All Emirates Option */}
                                  <div 
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleEmirateChange("all", !isAllEmiratesSelected);
                                    }}
                                  >
                                    <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-green-500 rounded-lg flex items-center justify-center text-xs">🇦🇪</div>
                                    <input
                                      type="checkbox"
                                      checked={isAllEmiratesSelected}
                                      className="w-3 h-3 rounded focus:ring-2 pointer-events-none"
                                      style={{ accentColor: '#AD803B' }}
                                      readOnly
                                    />
                                    <label className="text-black text-sm font-semibold cursor-pointer">All Emirates</label>
                                  </div>
                                  
                                  <div className="border-t my-2" style={{ borderColor: '#AD803B40' }}></div>
                                  
                                  {/* Individual Emirates */}
                                  {emiratesList.map((emirate) => (
                                    <div 
                                      key={emirate.id}
                                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleEmirateChange(emirate.id, !selectedEmirates.includes(emirate.id));
                                      }}
                                    >
                                      <div className="w-5 h-5 rounded-lg overflow-hidden">
                                        <img src={emirate.thumbnail} alt={emirate.name} className="w-full h-full object-cover" />
                                      </div>
                                      <input
                                        type="checkbox"
                                        checked={selectedEmirates.includes(emirate.id)}
                                        className="w-3 h-3 rounded focus:ring-2 pointer-events-none"
                                        style={{ accentColor: '#AD803B' }}
                                        readOnly
                                      />
                                      <label className="text-black text-sm cursor-pointer">{emirate.name}</label>
                                    </div>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                            {errors.emirates && <p className="text-red-400 text-xs">{errors.emirates.message}</p>}
                          </div>
                        </div>

                        {/* Budget & Group Information - Compact Layout */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                          {/* Budget */}
                          <div className="space-y-2">
                            <Label className="text-black text-xs font-semibold">Budget (AED)</Label>
                            <Select value={watch("budget")} onValueChange={(v) => setValue("budget", v)}>
                              <SelectTrigger className="h-10 bg-transparent border-0 border-b-2 text-black rounded-none px-0 focus:border-blue-600" style={{ borderBottomColor: '#2563eb' }}>
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2 rounded-xl" style={{ borderColor: '#2563eb' }}>
                                <SelectItem value="1,000 - 3,000" className="text-black hover:bg-[#0d1b2a] data-[state=checked]:bg-[#0d1b2a] data-[state=checked]:text-white focus:bg-[#0d1b2a]">Value (1K-3K AED)</SelectItem>
                                <SelectItem value="3,000 - 5,000" className="text-black hover:bg-[#0d1b2a] data-[state=checked]:bg-[#0d1b2a] data-[state=checked]:text-white focus:bg-[#0d1b2a]">Mid-Range (3K-5K AED)</SelectItem>
                                <SelectItem value="5,000 - 10,000" className="text-black hover:bg-[#0d1b2a] data-[state=checked]:bg-[#0d1b2a] data-[state=checked]:text-white focus:bg-[#0d1b2a]">Premium (5K-10K AED)</SelectItem>
                                <SelectItem value="10,000 - 20,000" className="text-black hover:bg-[#0d1b2a] data-[state=checked]:bg-[#0d1b2a] data-[state=checked]:text-white focus:bg-[#0d1b2a]">Luxury (10K-20K AED)</SelectItem>
                                <SelectItem value="20,000+" className="text-black hover:bg-[#0d1b2a] data-[state=checked]:bg-[#0d1b2a] data-[state=checked]:text-white focus:bg-[#0d1b2a]">Ultra-Luxury (20K+ AED)</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.budget && <p className="text-red-400 text-xs">{errors.budget.message}</p>}
                          </div>

                          {/* Adults */}
                          <div className="space-y-2">
                            <Label className="text-[#1A252F] text-xs font-semibold">Adults</Label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const current = watchedValues.adults || 1;
                                  const newValue = Math.max(1, current - 1);
                                  setValue("adults", newValue);
                                }}
                                className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center hover:bg-[#1A252F] transition-colors"
                              >
                                -
                              </button>
                              <div className="w-16 h-10 bg-transparent border-0 border-b-2 text-[#1A252F] text-center flex items-center justify-center" style={{ borderBottomColor: '#2C3E50' }}>
                                {watchedValues.adults || 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = watchedValues.adults || 1;
                                  const newValue = Math.min(8, current + 1);
                                  setValue("adults", newValue);
                                }}
                                className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center hover:bg-[#1A252F] transition-colors"
                              >
                                +
                              </button>
                            </div>
                            {errors.adults && <p className="text-red-400 text-xs">{errors.adults.message}</p>}
                          </div>

                          {/* Children */}
                          <div className="space-y-2">
                            <Label className="text-[#1A252F] text-xs font-semibold">Children</Label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const current = watchedValues.kids || 0;
                                  const newValue = Math.max(0, current - 1);
                                  setValue("kids", newValue);
                                }}
                                className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center hover:bg-[#1A252F] transition-colors"
                              >
                                -
                              </button>
                              <div className="w-16 h-10 bg-transparent border-0 border-b-2 text-[#1A252F] text-center flex items-center justify-center" style={{ borderBottomColor: '#2C3E50' }}>
                                {watchedValues.kids || 0}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = watchedValues.kids || 0;
                                  const newValue = Math.min(6, current + 1);
                                  setValue("kids", newValue);
                                }}
                                className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center hover:bg-[#1A252F] transition-colors"
                              >
                                +
                              </button>
                            </div>
                            {errors.kids && <p className="text-red-400 text-xs">{errors.kids.message}</p>}
                          </div>

                          {/* Infants */}
                          <div className="space-y-2">
                            <Label className="text-[#1A252F] text-xs font-semibold">Infants</Label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const current = watchedValues.infants || 0;
                                  const newValue = Math.max(0, current - 1);
                                  setValue("infants", newValue);
                                }}
                                className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center hover:bg-[#1A252F] transition-colors"
                              >
                                -
                              </button>
                              <div className="w-16 h-10 bg-transparent border-0 border-b-2 text-[#1A252F] text-center flex items-center justify-center" style={{ borderBottomColor: '#2C3E50' }}>
                                {watchedValues.infants || 0}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = watchedValues.infants || 0;
                                  const newValue = Math.min(4, current + 1);
                                  setValue("infants", newValue);
                                }}
                                className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center hover:bg-[#1A252F] transition-colors"
                              >
                                +
                              </button>
                            </div>
                            {errors.infants && <p className="text-red-400 text-xs">{errors.infants.message}</p>}
                          </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <HoverRadiusButton
                            text={
                              <div className="flex items-center justify-center sm:justify-start">
                                <Sparkles className="w-4 h-4 mr-2" />
                                <div className="text-center sm:text-left">
                                  <div className="text-sm font-bold">AI Planning</div>
                                  <div className="text-xs opacity-90">Smart recommendations</div>
                                </div>
                              </div>
                            }
                            onClick={handleAISubmit}
                            type="submit"
                            className="h-12 sm:h-14"
                          />

                          <HoverRadiusButton
                            text={
                              <div className="flex items-center justify-center sm:justify-start">
                                <Settings className="w-4 h-4 mr-2" style={{ color: '#0d1b2a' }} />
                                <div className="text-center sm:text-left">
                                  <div className="text-sm font-bold">Manual Planning</div>
                                  <div className="text-xs opacity-80">Custom itinerary</div>
                                </div>
                              </div>
                            }
                            onClick={handleManualSubmit}
                            type="button"
                            className="h-12 sm:h-14"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Image Container */}
        <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-10 hidden lg:block mt-[189px]">
          <ImageContainer className="w-99" />
        </div>
      </div>
    </div>
  </motion.div>
</AnimatePresence>
</>
);
};




