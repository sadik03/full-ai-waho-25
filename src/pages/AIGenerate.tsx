import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/ProgressBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Plane, Car, Sparkles, MapPin, Calendar, AlertCircle, Globe, Compass, Camera, Heart } from "lucide-react";
import { generateContent } from "../services/geminiService";
import { supabase } from "../config/supabaseConfig";
import { GEMINI_CONFIG } from "../config/geminiConfig";
import Lottie from "react-lottie";
import animationData from "../assets/loading.json";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/fonts.css";

export default function AIGenerate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Loading messages array
  const loadingMessages = [
    {
      title: "Analyzing preferences",
      subtitle: "Understanding your travel style and requirements",
      icon: "🔍"
    },
    {
      title: "Finding attractions",
      subtitle: "Discovering the perfect destinations for you",
      icon: "📍"
    },
    {
      title: "Building itinerary",
      subtitle: "Crafting your personalized travel experience",
      icon: "🗓️"
    }
  ];

  // TravelForm Button Component
  function TravelFormButton({ text, onClick, icon }) {
    const [hover, setHover] = useState(false);

    const buttonStyle: React.CSSProperties = {
      backgroundColor: "orange",
      color: "#0d1b2a",
      width: "100%",
      padding: "16px 20px",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "14px",
      fontFamily: "HYPE, sans-serif",
      borderRadius: hover ? "2px" : "0px 0px 50px 0px",
      transition: "all 0.4s ease",
      boxShadow: hover
        ? "0 6px 14px rgba(0,0,0,0.2)"
        : "0 2px 6px rgba(0,0,0,0.1)",
      border: "none",
    };

    return (
      <motion.div
        className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 shadow-2xl transition-all duration-500 ease-in-out"
        style={{
          borderRadius: hover ? '8px' : '0px 0px 60px 0px',
        }}
      >
        <button
          type="button"
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={onClick}
        >
          {text}
          {icon}
        </button>
      </motion.div>
    );
  }

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  useEffect(() => {
    // Loading message animation
    const messageInterval = setInterval(() => {
      setCurrentLoadingMessage(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    // Continuous progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 95) {
          return prev + Math.random() * 3;
        }
        return prev;
      });
    }, 200);

    const generatePackages = async () => {
      try {
        const savedData = localStorage.getItem("travelFormData");
        if (!savedData) {
          console.error("No travel form data found");
          navigate("/travel-form");
          return;
        }

        const data = JSON.parse(savedData);
        setFormData(data);

        console.log("Travel form data:", data);
        console.log("Starting AI-enhanced package generation");

        // Fetch all data from Supabase database
        const fetchDatabaseData = async () => {
          try {
            const selectedEmirates = Array.isArray(data.emirates) ? data.emirates : [data.emirates];
            const includesAll = selectedEmirates.includes("all");
            
            // Fetch attractions - fix filtering logic
            let attractionsQuery = supabase
              .from('attractions')
              .select('*');
            
            // Add is_active filter if column exists, otherwise skip
            try {
              attractionsQuery = attractionsQuery.eq('is_active', true);
            } catch (error) {
              console.warn('is_active column may not exist, continuing without filter');
            }
            
            // Fix emirates filtering - handle "all" selection properly
            if (!includesAll && selectedEmirates.length > 0 && !selectedEmirates.includes('all')) {
              // Convert emirates array to match database format
              const emiratesFilter = selectedEmirates.map(e => {
                // Handle different emirate name formats
                switch(e) {
                  case 'dubai': return 'Dubai';
                  case 'abu-dhabi': return 'Abu Dhabi';
                  case 'sharjah': return 'Sharjah';
                  case 'ajman': return 'Ajman';
                  case 'fujairah': return 'Fujairah';
                  case 'ras-al-khaimah': return 'Ras Al Khaimah';
                  case 'umm-al-quwain': return 'Umm Al Quwain';
                  default: return e;
                }
              });
              attractionsQuery = attractionsQuery.in('emirates', emiratesFilter);
            }
            
            const { data: attractionsData, error: attractionsError } = await attractionsQuery;
            if (attractionsError) {
              console.error("❌ Attractions query error:", attractionsError);
              throw attractionsError;
            }

            // Fetch hotels - try without is_active filter first
            let { data: hotelData, error: hotelsError } = await supabase
              .from('hotels')
              .select('*');
            
            // If that fails, try with different column name
            if (hotelsError) {
              console.warn("⚠️ Hotels query failed, trying without is_active filter:", hotelsError);
              ({ data: hotelData, error: hotelsError } = await supabase
                .from('hotels')
                .select('*')
                .limit(20)); // Get at least some hotels
            }
            
            if (hotelsError) {
              console.error("❌ Hotels query error:", hotelsError);
              // Don't throw, continue with empty array
              hotelData = [];
            }

            // Fetch transport data - fix table name
            let transportData: any[] = [];
            try {
              const { data: transportResult, error: transportError } = await supabase
                .from('transport')
                .select('*');
              
              if (transportError) {
                console.warn("⚠️ Transport query failed:", transportError);
              } else {
                transportData = transportResult || [];
              }
            } catch (error) {
              console.error("Error fetching transport data:", error);
            }

            return {
              attractions: attractionsData || [],
              hotels: hotelData || [],
              transport: transportData
            };
          } catch (error) {
            console.error('Error fetching database data:', error);
            return { attractions: [], hotels: [], transport: [] };
          }
        };

        const generateId = () => {
          return Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
        };

        const getRandomItem = (array: any[]) => {
          return array[Math.floor(Math.random() * array.length)];
        };

        // User-specific random filtering system with session variation
        const generateRandomAttractions = () => {
          console.log("🎲 Generating user-specific random attractions");
          
          // Create user-specific seed for consistent randomization per session
          const userSeed = Date.now() + Math.random() * 1000000;
          const sessionId = Math.floor(userSeed).toString(36);
          
          // Expanded attraction templates for more variety
          const attractionTemplates = [
            { name: "Burj Khalifa", emirates: "Dubai", category: "Architecture", priceRange: [100, 200] },
            { name: "Dubai Mall", emirates: "Dubai", category: "Shopping", priceRange: [0, 50] },
            { name: "Sheikh Zayed Grand Mosque", emirates: "Abu Dhabi", category: "Cultural", priceRange: [0, 0] },
            { name: "Louvre Abu Dhabi", emirates: "Abu Dhabi", category: "Museum", priceRange: [60, 150] },
            { name: "Dubai Marina", emirates: "Dubai", category: "Waterfront", priceRange: [50, 120] },
            { name: "Palm Jumeirah", emirates: "Dubai", category: "Beach", priceRange: [80, 180] },
            { name: "Al Fahidi Historic District", emirates: "Dubai", category: "Heritage", priceRange: [20, 60] },
            { name: "Ferrari World", emirates: "Abu Dhabi", category: "Theme Park", priceRange: [200, 400] },
            { name: "Sharjah Art Museum", emirates: "Sharjah", category: "Art", priceRange: [30, 80] },
            { name: "Ajman Beach", emirates: "Ajman", category: "Beach", priceRange: [0, 40] },
            // Additional attractions for more variety
            { name: "Dubai Fountain", emirates: "Dubai", category: "Entertainment", priceRange: [0, 30] },
            { name: "Atlantis Aquaventure", emirates: "Dubai", category: "Water Park", priceRange: [250, 350] },
            { name: "Ski Dubai", emirates: "Dubai", category: "Adventure", priceRange: [180, 280] },
            { name: "Yas Island", emirates: "Abu Dhabi", category: "Entertainment", priceRange: [100, 300] },
            { name: "Dubai Creek", emirates: "Dubai", category: "Heritage", priceRange: [20, 80] },
            { name: "Miracle Garden", emirates: "Dubai", category: "Nature", priceRange: [40, 60] },
            { name: "Global Village", emirates: "Dubai", category: "Cultural", priceRange: [15, 25] },
            { name: "IMG Worlds", emirates: "Dubai", category: "Theme Park", priceRange: [200, 300] }
          ];
          
          // User-specific shuffling using session-based randomization
          const shuffleArray = (array, seed) => {
            const shuffled = [...array];
            let currentIndex = shuffled.length;
            let randomIndex;
            
            // Use seed for consistent but unique shuffling per user
            let seedValue = seed;
            const seededRandom = () => {
              seedValue = (seedValue * 9301 + 49297) % 233280;
              return seedValue / 233280;
            };
            
            while (currentIndex !== 0) {
              randomIndex = Math.floor(seededRandom() * currentIndex);
              currentIndex--;
              [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
            }
            return shuffled;
          };
          
          // Shuffle attractions uniquely for this user session
          const shuffledTemplates = shuffleArray(attractionTemplates, userSeed);
          
          // Filter by emirates preference
          const selectedEmirates = Array.isArray(data.emirates) ? data.emirates : [data.emirates];
          const includesAll = selectedEmirates.includes("all");
          
          let filteredAttractions = shuffledTemplates;
          if (!includesAll && selectedEmirates.length > 0) {
            filteredAttractions = shuffledTemplates.filter(attr => 
              selectedEmirates.some(emirate => 
                attr.emirates.toLowerCase().includes(emirate.toLowerCase()) ||
                emirate.toLowerCase().includes(attr.emirates.toLowerCase())
              )
            );
          }
          
          // Generate unique attractions for this user with session-based randomization
          const randomAttractions = filteredAttractions.map((template, index) => ({
            attraction: template.name,
            emirates: template.emirates,
            category: template.category,
            price: Math.floor((userSeed + index * 1000) % (template.priceRange[1] - template.priceRange[0] + 1)) + template.priceRange[0],
            description: `Experience the amazing ${template.name} - a ${template.category.toLowerCase()} attraction in ${template.emirates}`,
            image_url: `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center`,
            sessionId: sessionId
          }));
          
          console.log(`🎯 Generated ${randomAttractions.length} user-specific attractions (Session: ${sessionId})`);
          return randomAttractions;
        };

        const { attractions, hotels, transport } = await fetchDatabaseData();

        // Add detailed debugging for AI generation issues
        const analyzeAIGenerationIssues = () => {
          console.log("\n🔍 AI GENERATION ANALYSIS:");
          console.log("===========================");
          
          // Check data availability
          console.log("📊 DATABASE DATA AVAILABILITY:");
          console.log(`- Attractions: ${attractions.length} items`);
          console.log(`- Hotels: ${hotels.length} items`);
          console.log(`- Transport: ${transport.length} items`);
          
          if (attractions.length === 0) {
            console.warn("⚠️ No attractions available - AI cannot create meaningful packages");
          }
          
          // Check API configuration
          console.log("\n🔧 API CONFIGURATION:");
          console.log(`- Max Output Tokens: ${GEMINI_CONFIG.maxOutputTokens}`);
          console.log(`- Model: ${GEMINI_CONFIG.model}`);
          console.log(`- Temperature: ${GEMINI_CONFIG.temperature}`);
          
          // Estimate prompt complexity
          const basePromptLength = 2000; // Base template
          const attractionsText = attractions.slice(0, 20).reduce((acc, attr) => 
            acc + (attr.attraction?.length || 0) + (attr.description?.length || 0) + 50, 0);
          const hotelsText = hotels.reduce((acc, hotel) => 
            acc + (hotel.name?.length || 0) + (hotel.description?.length || 0) + 50, 0);
          const transportText = transport.reduce((acc, trans) => 
            acc + (trans.label?.length || 0) + (trans.description?.length || 0) + 30, 0);
          
          const estimatedPromptSize = basePromptLength + attractionsText + hotelsText + transportText;
          const estimatedTokens = Math.ceil(estimatedPromptSize / 4);
          
          console.log("\n📏 PROMPT SIZE ANALYSIS:");
          console.log(`- Base prompt: ~${basePromptLength} chars`);
          console.log(`- Attractions text: ~${attractionsText} chars`);
          console.log(`- Hotels text: ~${hotelsText} chars`);
          console.log(`- Transport text: ~${transportText} chars`);
          console.log(`- Total estimated: ~${estimatedPromptSize} chars`);
          console.log(`- Estimated tokens: ~${estimatedTokens}`);
          
          if (estimatedTokens > 30000) {
            console.warn("⚠️ PROMPT TOO LARGE! Estimated tokens exceed safe limit");
            console.log("💡 SOLUTIONS:");
            console.log("  1. Reduce attractions list (currently using first 20)");
            console.log("  2. Simplify hotel/transport descriptions");
            console.log("  3. Use shorter prompt template");
          }
          
          // Check for common failure points
          console.log("\n🚨 COMMON FAILURE POINTS:");
          console.log("1. Network connectivity issues");
          console.log("2. API key validity/quota");
          console.log("3. Prompt too complex for model");
          console.log("4. Response not in valid JSON format");
          console.log("5. Model safety filters triggered");
          
          console.log("\n💡 RECOMMENDATIONS:");
          if (attractions.length < 5) {
            console.log("- Add more attractions to database for better AI context");
          }
          if (estimatedTokens > 20000) {
            console.log("- Consider reducing prompt complexity");
          }
          console.log("- Check API key quota and validity");
          console.log("- Ensure network connectivity is stable");
          console.log("===========================\n");
        };

        // AI-powered package generation with full database context
        const generateAIPackages = async () => {
          const totalTravelers = data.adults + (data.kids || 0) + (data.infants || 0);
          const hasChildren = (data.kids || 0) > 0 || (data.infants || 0) > 0;
          const tripDays = parseInt(data.tripDuration) || 3;

          // Determine traveler type
          let travelerType = "couple";
          if (totalTravelers === 1) travelerType = "solo";
          else if (hasChildren) travelerType = "family";
          else if (totalTravelers >= 3) travelerType = "group";

          // Helper function to process AI response
          const processAIResponse = async (aiResponse) => {
            console.log("🔄 AI Response Status:", aiResponse?.success ? "SUCCESS" : "FAILED");
            console.log("📝 AI Response Content Length:", aiResponse?.content?.length || 0);
            
            if (aiResponse.success && aiResponse.content) {
              console.log("✅ AI response received, parsing...");
              console.log("📄 First 500 chars of AI response:", aiResponse.content.substring(0, 500));
              
              // Enhanced JSON cleaning with better error handling
              let cleanJson = aiResponse.content
                .replace(/```json\s*/gi, "")
                .replace(/```\s*/g, "")
                .replace(/^[^[{]*/, "")
                .replace(/[^}\]]*$/, "")
                .trim();
              
              // Additional JSON cleanup with safer regex
              cleanJson = cleanJson
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']')
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
                .replace(/:s*([a-zA-Z_][a-zA-Z0-9_]*)\s*([,}])/g, ': "$1"$2')
                .replace(/\\n/g, ' ')
                .replace(/\\t/g, ' '); // Add quotes to unquoted string values
              
              console.log("🧹 Cleaned JSON (first 300 chars):", cleanJson.substring(0, 300));
              
              try {
                const aiPackages = JSON.parse(cleanJson);
                
                if (Array.isArray(aiPackages) && aiPackages.length > 0) {
                  console.log(`✅ Successfully parsed ${aiPackages.length} AI packages`);
                  return aiPackages;
                } else {
                  console.error("❌ AI response not in expected array format:", typeof aiPackages);
                  console.log("🔄 Attempting to extract packages from object...");
                  
                  // Try to extract packages if wrapped in an object
                  if (aiPackages && typeof aiPackages === 'object') {
                    const possibleArrays = Object.values(aiPackages).filter(Array.isArray);
                    if (possibleArrays.length > 0) {
                      console.log(`✅ Found packages in nested object`);
                      return possibleArrays[0];
                    }
                  }
                  
                  throw new Error("AI response not in expected format");
                }
              } catch (jsonError) {
                console.error("❌ JSON parsing failed:", jsonError);
                console.log("📝 Failed JSON content:", cleanJson.substring(0, 1000));
                
                // Try one more time with even more aggressive cleaning
                try {
                  const ultraCleanJson = cleanJson
                    .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
                    .replace(/\s+/g, ' ')
                    .trim();
                  
                  const retryPackages = JSON.parse(ultraCleanJson);
                  if (Array.isArray(retryPackages) && retryPackages.length > 0) {
                    console.log(`✅ Retry parsing successful with ${retryPackages.length} packages`);
                    return retryPackages;
                  }
                } catch (retryError) {
                  console.error("❌ Retry parsing also failed:", retryError);
                }
                
                throw new Error(`JSON parsing failed: ${jsonError.message}`);
              }
            } else {
              console.error("❌ AI generation failed:", aiResponse.error);
              throw new Error(aiResponse.error || "AI generation failed");
            }
          };

          // Build comprehensive AI prompt with database data
          const optimizeAttractionSelection = (attractions, maxCount = 15) => {
            console.log(`🎯 Selecting ${maxCount} attractions from ${attractions.length} available`);
            
            if (attractions.length <= maxCount) return attractions;
            
            // Simple selection - take variety across price ranges
            const sorted = [...attractions].sort((a, b) => (a.price || 0) - (b.price || 0));
            const selected = [];
            
            // Take attractions spread across price ranges
            for (let i = 0; i < maxCount && i < sorted.length; i++) {
              const index = Math.floor((i / maxCount) * sorted.length);
              selected.push(sorted[index]);
            }
            
            return selected.slice(0, maxCount);
          };

          // Optimize attraction descriptions for AI prompt
          const createOptimizedAttractionText = (attractions) => {
            return attractions.map(attr => {
              // Keep descriptions under 100 chars
              let description = attr.description || 'Premium attraction experience';
              if (description.length > 95) {
                description = description.substring(0, 92) + '...';
              }
              
              // Create clear, descriptive entry
              const priceText = attr.price ? `${attr.price} AED` : 'Free';
              const categoryText = attr.category ? ` [${attr.category}]` : '';
              
              return `• ${attr.attraction} (${attr.emirates}) - ${priceText}${categoryText} - ${description}`;
            }).join('\n');
          };

          // Optimize attraction selection based on emirates filter and travel form data
          const attractionCount = tripDays <= 7 ? 15 : tripDays <= 15 ? 12 : 10; // Reduce attractions for longer trips
          const selectedEmirates = Array.isArray(data.emirates) ? data.emirates : [data.emirates];
          const optimizedAttractions = optimizeAttractionSelection(attractions, attractionCount);
          const attractionsText = createOptimizedAttractionText(optimizedAttractions);
          
          // Use smart prompt structure based on trip duration
          const isLongTrip = tripDays > 10;
          const hotelCount = isLongTrip ? 6 : 10;
          const transportCount = isLongTrip ? 5 : 8;

          console.log(`🎯 Optimizing for ${tripDays}-day trip:`);
          console.log(`- Selected ${optimizedAttractions.length} attractions from ${attractions.length} total`);
          console.log(`- Emirates focus: ${Array.isArray(data.emirates) ? data.emirates.join(', ') : data.emirates}`);
          console.log(`- Long trip mode: ${isLongTrip ? 'YES (streamlined prompt)' : 'NO (detailed prompt)'}`);
          console.log(`- Budget consideration: ${data.budget}`);
          console.log(`- Traveler type: ${travelerType}`);

          // Check if we have sufficient data and provide random generated fallback
          if (attractions.length === 0) {
            console.warn("⚠️ No attractions found in database! Using random filtering system.");
            const randomAttractions = generateRandomAttractions();
            return randomAttractions;
          }

          // Enhanced AI prompt with better structure and error handling
          const aiPrompt = `You are an expert UAE travel consultant. Create exactly 3 unique ${tripDays}-day travel packages for ${travelerType} travelers.

IMPORTANT: Return ONLY valid JSON array. No markdown, no explanations, just the JSON.

TRAVELER DETAILS:
- Group: ${data.adults} adults${data.kids ? `, ${data.kids} children` : ''}${data.infants ? `, ${data.infants} infants` : ''}
- Duration: ${tripDays} days
- Emirates: ${Array.isArray(data.emirates) ? data.emirates.join(', ') : data.emirates}
- Budget: ${data.budget}
- Month: ${data.journeyMonth}

AVAILABLE DATABASE RESOURCES:

ATTRACTIONS (${optimizedAttractions.length} curated from ${attractions.length} total):
${attractionsText}

HOTELS (${Math.min(hotels.length, hotelCount)} available):
${hotels.slice(0, hotelCount).map(hotel => {
  const stars = hotel.stars ? `${hotel.stars} stars` : 'Premium';
  const price = hotel.cost_per_night || hotel.price_range_min || 400;
  let desc = hotel.description || 'Quality accommodation';
  if (desc.length > 60) desc = desc.substring(0, 57) + '...'; // Shorter for long trips
  return `• ${hotel.name} - ${stars} - ${price} AED/night - ${desc}`;
}).join('\n')}

TRANSPORT (${Math.min(transport.length, transportCount)} available):
${transport.slice(0, transportCount).map(trans => {
  const price = trans.cost_per_day || 150;
  let desc = trans.description || 'Quality transport';
  if (desc.length > 40) desc = desc.substring(0, 37) + '...'; // Shorter for long trips
  return `• ${trans.label} - ${price} AED/day - ${desc}`;
}).join('\n')}

CRITICAL REQUIREMENTS:
1. Create exactly 3 distinct packages with different themes
2. Each package must cover all ${tripDays} days with appropriate pacing
3. ${isLongTrip ? 
  'For long trips (10+ days): Create week-based sections with key highlights instead of daily details' : 
  'For shorter trips: Create detailed daily itineraries'}
4. MANDATORY: Use structured attraction lists with at least 1-3 per section
5. Use ONLY attraction names from the database list above (copy exact names)
6. Use ONLY hotel names from the database list above (copy exact names)
7. Use ONLY transport from the database list above (copy exact names)
8. Ensure realistic pricing based on database costs
9. Create unique titles that reflect the package theme

PACKAGE THEMES for ${travelerType}:
${travelerType === 'solo' ? '- Adventure Explorer\n- Cultural Immersion\n- Luxury Solo Experience' :
  travelerType === 'family' ? '- Family Fun Adventure\n- Educational Discovery\n- Beach & Resort Relaxation' :
  travelerType === 'group' ? '- Group Adventure\n- Cultural Exploration\n- Entertainment & Nightlife' :
  '- Romantic Getaway\n- Adventure & Excitement\n- Luxury & Relaxation'}

${isLongTrip ? `
LONG TRIP FORMAT (${tripDays} days - COMPACT Weekly Structure):
Given the 8,192 output token limit, create COMPACT weekly summaries instead of detailed daily plans.
Use this ultra-condensed format:

COMPACT WEEKLY FORMAT:
"weeklyHighlights": [
  {
    "week": 1,
    "days": "1-7", 
    "theme": "Theme Name",
    "keyAttractions": ["Attraction1", "Attraction2", "Attraction3"],
    "budget": 3500
  }
]

IMPORTANT: For ${tripDays} days, create ${Math.ceil(tripDays / 7)} weeks maximum. Keep descriptions minimal.` : `
SHORT TRIP FORMAT (${tripDays} days - Standard Daily Structure):
Create detailed day-by-day itineraries

DAILY FORMAT:
"itinerary": [
  {
    "day": 1,
    "title": "Day 1: Title",
    "attractions": [{"name": "Attraction", "price": 149, "duration": "2h"}],
    "hotel": "Hotel Name",
    "transport": "Transport"
  }
]`}

Return ONLY a valid JSON array. Use this COMPACT structure to fit within 8,192 output tokens:
[
  {
    "id": "package_1",
    "title": "Package Name",
    "description": "Brief description",
    "theme": "adventure/cultural/luxury",
    "totalEstimatedCost": 15000,
    "duration": ${tripDays},
    ${isLongTrip ? '"weeklyStructure": true,' : '"weeklyStructure": false,'}
    ${isLongTrip ? `"weeklyHighlights": [
      {
        "week": 1,
        "days": "1-7",
        "theme": "Theme",
        "keyAttractions": ["Attraction1", "Attraction2"],
        "budget": 3500
      }
    ]` : `"itinerary": [
      {
        "day": 1,
        "title": "Day 1: Title",
        "attractions": [{"name": "Exact Name", "price": 149}],
        "transport": "Transport"
      }
    ]`}
  }
]

CRITICAL RULES:
- Return ONLY the JSON array, no other text
- Use exact names from the database lists provided above
- Ensure all JSON is properly formatted
- Calculate realistic costs based on database prices
- ${isLongTrip ? 'For long trips: Use compact weekly format to fit 8,192 token limit' : 'For short trips: Provide detailed daily schedules'}`;

          console.log("🤖 AI Prompt Summary:");
          console.log("- Traveler Type:", travelerType);
          console.log("- Trip Days:", tripDays, isLongTrip ? '(LONG TRIP - Weekly Mode)' : '(SHORT TRIP - Daily Mode)');
          console.log("- Selected Attractions:", optimizedAttractions.length, "from", attractions.length, "total");
          console.log("- Available Hotels:", Math.min(hotels.length, hotelCount), "from", hotels.length, "total");
          console.log("- Available Transport:", Math.min(transport.length, transportCount), "from", transport.length, "total");
          console.log("- Prompt Length (chars):", aiPrompt.length);
          console.log("- Estimated Input Tokens:", Math.ceil(aiPrompt.length / 4));
          console.log("- Emirates Focus:", Array.isArray(data.emirates) ? data.emirates.join(', ') : data.emirates);
          console.log("- Budget Range:", data.budget);
          console.log("- Group Size:", `${data.adults} adults + ${data.kids || 0} kids`);
          
          // More aggressive token limits for longer trips
          const estimatedTokens = Math.ceil(aiPrompt.length / 4);
          const maxTokens = isLongTrip ? 20000 : 25000; // Lower limit for long trips
          
          if (estimatedTokens > maxTokens) {
            console.warn(`⚠️ Prompt too long for ${isLongTrip ? 'long' : 'short'} trip:`, estimatedTokens, "estimated tokens");
            console.log("🔧 Further reducing content for model limits...");
            
            // Create an even shorter prompt with fewer attractions
            const ultraCoreCount = isLongTrip ? 6 : 8;
            const coreAttractions = optimizedAttractions.slice(0, ultraCoreCount);
            const shorterPrompt = aiPrompt.replace(
              /ATTRACTIONS \([\s\S]*?(?=\n\nHOTELS)/,
              `ATTRACTIONS (${coreAttractions.length} core selections):\n${createOptimizedAttractionText(coreAttractions)}`
            );
            
            console.log("📝 Ultra-shortened prompt length:", shorterPrompt.length);
            console.log("📊 New estimated tokens:", Math.ceil(shorterPrompt.length / 4));
            
            const aiResponse = await generateContent({ prompt: shorterPrompt });
            console.log("🔄 AI Response with ultra-short prompt:", aiResponse?.success ? "SUCCESS" : "FAILED");
            
            if (!aiResponse.success) {
              console.error("❌ Ultra-short prompt also failed:", aiResponse.error);
              throw new Error(`AI failed with minimal prompt: ${aiResponse.error}`);
            }
            
            return await processAIResponse(aiResponse);
          }
          
          try {
            const aiResponse = await generateContent({ prompt: aiPrompt });
            const rawPackages = await processAIResponse(aiResponse);
            
            // Enhance packages with actual database images and validate data
            const enhancedPackages = rawPackages.map((pkg, index) => {
              console.log(`Processing package ${index + 1}:`, pkg.title);
              
              const enhancedItinerary = pkg.itinerary?.map((day, dayIndex) => {
                console.log(`Processing day ${day.day}:`, day);
                
                // Ensure we have attractions - if not, add some from database
                let dayAttractions = day.attractions || [];
                
                if (!dayAttractions || dayAttractions.length === 0) {
                  console.log(`Day ${day.day} has no attractions, adding random filtered attractions`);
                  
                  // User-specific random selection with filtering
              const availableAttractions = attractions.length > 0 ? attractions : generateRandomAttractions();
              const userSeed = Date.now() + Math.random() * 1000000;
              const shuffledAttractions = [...availableAttractions].sort(() => (userSeed % 1000) / 1000 - 0.5);
              const selectedAttractions = shuffledAttractions.slice(0, Math.min(2, shuffledAttractions.length));
                  
                  const randomDurations = ["2 hours", "3 hours", "2-3 hours", "Half day"];
                  const randomTimings = ["9:00 AM - 12:00 PM", "10:00 AM - 1:00 PM", "2:00 PM - 5:00 PM"];
                  
                  const randomAttractions = selectedAttractions.map(attr => ({
                    name: attr.attraction,
                    emirates: attr.emirates, // Preserve emirates information
                    duration: randomDurations[Math.floor(Math.random() * randomDurations.length)],
                    type: attr.category || "sightseeing",
                    description: `Experience the amazing ${attr.attraction}`,
                    price: attr.price || Math.floor(Math.random() * 200) + 50,
                    timing: randomTimings[Math.floor(Math.random() * randomTimings.length)],
                    personalTip: `Don't miss visiting ${attr.attraction}`,
                    imageUrl: attr.image_url || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center`
                  }));
                  
                  dayAttractions = randomAttractions;
                }
                
                const enhancedAttractions = dayAttractions.map(attraction => {
                  // Find matching attraction in database
                  const dbAttraction = attractions.find(attr => 
                    attr.attraction.toLowerCase() === attraction.name.toLowerCase() ||
                    attraction.name.toLowerCase().includes(attr.attraction.toLowerCase()) ||
                    attr.attraction.toLowerCase().includes(attraction.name.toLowerCase())
                  );
                  
                  return {
                    ...attraction,
                    name: dbAttraction?.attraction || attraction.name,
                    emirates: dbAttraction?.emirates || attraction.emirates, // Preserve emirates data
                    price: dbAttraction?.price || attraction.price || 150,
                    imageUrl: dbAttraction?.image_url || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center`
                  };
                });

                // Find matching hotel and transport
                const dbHotel = hotels[Math.floor(dayIndex / 3) % hotels.length] || { name: "Premium Hotel", cost_per_night: 400 };
                const transportOption = transport[dayIndex % transport.length] || { label: "Private Car", cost_per_day: 150 };

                return {
                  ...day,
                  attractions: enhancedAttractions,
                  hotel: dbHotel?.name || day.hotel || "Premium Hotel",
                  transport: transportOption.label || day.transport || "Private Car",
                  image: enhancedAttractions[0]?.imageUrl || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop&crop=center`,
                  images: enhancedAttractions.map(attr => attr.imageUrl).filter(Boolean)
                };
              }) || [];

              // Calculate total cost
              const totalCost = enhancedItinerary.reduce((sum, day) => 
                sum + (day.budgetBreakdown?.attractions || 0) + 
                (day.budgetBreakdown?.meals || 0) + 
                (day.budgetBreakdown?.transport || 0) + 
                (day.budgetBreakdown?.accommodation || 0), 0);

              return {
                ...pkg,
                id: `ai_package_${index + 1}`,
                totalEstimatedCost: totalCost,
                itinerary: enhancedItinerary
              };
            });

            console.log(`Generated ${enhancedPackages.length} enhanced AI packages`);
            return enhancedPackages;
            
          } catch (aiError) {
            console.error("❌ AI generation attempt failed:", aiError);
            throw aiError;
          }
        };

        // Random package creation with filtering system
        const createRandomPackages = () => {
          const totalTravelers = data.adults + (data.kids || 0) + (data.infants || 0);
          const hasChildren = (data.kids || 0) > 0 || (data.infants || 0) > 0;
          const tripDays = parseInt(data.tripDuration) || 3;

          // Determine traveler type
          let travelerType = "couple";
          if (totalTravelers === 1) travelerType = "solo";
          else if (hasChildren) travelerType = "family";
          else if (totalTravelers >= 3) travelerType = "group";

          // Random theme generation with filtering
          const generateRandomThemes = (travelerType) => {
            const themeCategories = {
              adventure: ["Explorer", "Adventurer", "Discoverer", "Pioneer", "Wanderer"],
              cultural: ["Heritage", "Traditional", "Cultural", "Historic", "Authentic"],
              luxury: ["Premium", "Elite", "Exclusive", "Luxury", "VIP"],
              family: ["Family Fun", "Kids Adventure", "Family Bond", "Together Time", "Memory Maker"],
              relaxation: ["Peaceful", "Serene", "Tranquil", "Relaxing", "Calm"]
            };
            
            const activities = ["Journey", "Experience", "Adventure", "Discovery", "Escape", "Getaway", "Tour", "Expedition"];
            const destinations = ["UAE", "Emirates", "Arabian", "Desert", "Coastal", "Urban"];
            
            const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
            
            const themes = Object.keys(themeCategories).map(category => {
              const categoryWords = themeCategories[category];
              const randomWord = getRandomElement(categoryWords);
              const randomActivity = getRandomElement(activities);
              const randomDestination = getRandomElement(destinations);
              
              return {
                title: `${randomWord} ${randomDestination} ${randomActivity}`,
                theme: category,
                description: `${category === 'family' ? 'Perfect for families' : category === 'solo' ? 'Ideal for solo travelers' : 'Great for groups'} seeking ${category} experiences in the UAE`
              };
            });
            
            // Shuffle and return 3 random themes
            return themes.sort(() => Math.random() - 0.5).slice(0, 3);
          };
          
          const packageThemes = generateRandomThemes(travelerType);
          
          const legacyThemes = {
            solo: [
              { title: "Solo Adventure Explorer", theme: "adventure", description: "Thrilling solo experiences across UAE's most exciting destinations" },
              { title: "Cultural Discovery Journey", theme: "cultural", description: "Deep dive into UAE's rich heritage and traditional culture" },
              { title: "Luxury Solo Retreat", theme: "luxury", description: "Premium experiences designed for the discerning solo traveler" }
            ],
            family: [
              { title: "Family Fun Adventure", theme: "family", description: "Exciting family-friendly activities that create lasting memories" },
              { title: "Educational Discovery Tour", theme: "educational", description: "Learning experiences that engage and inspire all family members" },
              { title: "Beach & Resort Relaxation", theme: "relaxation", description: "Perfect blend of fun and relaxation for the whole family" }
            ],
            group: [
              { title: "Group Adventure Experience", theme: "adventure", description: "High-energy adventures perfect for groups of friends" },
              { title: "Cultural Group Exploration", theme: "cultural", description: "Shared cultural experiences that bring groups together" },
              { title: "Entertainment & Nightlife", theme: "entertainment", description: "Vibrant nightlife and entertainment for group enjoyment" }
            ],
            couple: [
              { title: "Romantic Getaway", theme: "romantic", description: "Intimate experiences designed for couples in love" },
              { title: "Adventure & Excitement", theme: "adventure", description: "Thrilling adventures to share as a couple" },
              { title: "Luxury & Relaxation", theme: "luxury", description: "Premium relaxation and luxury experiences for two" }
            ]
          };

          const themes = packageThemes[travelerType] || packageThemes.couple;

          return themes.map((theme, pkgIndex) => {
            // Helper function to generate dynamic day descriptions
            const generateDayDescription = (dayNumber, attractions, theme, travelerType) => {
              const attractionNames = attractions.map(a => a.name).join(', ');
              const mainAttraction = attractions[0]?.name || 'Dubai Experience';
              
              const descriptions = [
                `Immerse yourself in ${mainAttraction} and discover the cultural treasures that make this destination special.`,
                `Experience the thrill of ${mainAttraction} while exploring ${attractions.length > 1 ? `${attractions.length - 1} additional amazing locations` : 'the surrounding area'}.`,
                `Begin your adventure at ${mainAttraction} and uncover the hidden gems of the UAE's rich heritage.`,
                `Dive deep into local culture at ${mainAttraction} and create unforgettable memories.`,
                `Explore the iconic ${mainAttraction} and witness breathtaking panoramic views.`,
                `Discover the magic of ${mainAttraction} and experience authentic Emirati hospitality.`,
                `Journey through ${mainAttraction} and capture breathtaking moments at every turn.`,
                `Embark on a cultural exploration at ${mainAttraction} and connect with local traditions.`
              ];
              
              // Select description based on day number to ensure uniqueness
              const baseDescription = descriptions[dayNumber % descriptions.length];
              
              // Add traveler-specific elements
              const travelerSpecific = {
                solo: "Perfect for independent exploration and self-discovery.",
                couple: "Ideal for creating romantic memories together.",
                family: "Great for family bonding and educational experiences.",
                friends: "Perfect for group adventures and shared experiences."
              };
              
              return `${baseDescription} ${travelerSpecific[travelerType] || travelerSpecific.couple}`;
            };

            // Helper function to generate dynamic day titles
            const generateDayTitle = (dayNumber, attractions, theme) => {
              const mainAttraction = attractions[0]?.name || 'Dubai Experience';
              
              const titleTemplates = [
                `Exploring ${mainAttraction}`,
                `Discovering ${mainAttraction}`,
                `Adventure at ${mainAttraction}`,
                `Journey to ${mainAttraction}`,
                `Cultural Immersion: ${mainAttraction}`,
                `Experiencing ${mainAttraction}`,
                `Unveiling ${mainAttraction}`,
                `Heritage Tour: ${mainAttraction}`
              ];
              
              return `Day ${dayNumber}: ${titleTemplates[dayNumber % titleTemplates.length]}`;
            };

            // Helper function to generate dynamic expert tips
            const generateExpertTip = (dayNumber, attractions, theme) => {
              const mainAttraction = attractions[0]?.name || 'your destination';
              
              const tips = [
                `Start your day early at ${mainAttraction} to avoid crowds and enjoy the best lighting for photos.`,
                `Book your tickets in advance for ${mainAttraction} to skip the lines and save time.`,
                `Visit ${mainAttraction} during sunset for the most spectacular views and photo opportunities.`,
                `Combine your visit to ${mainAttraction} with nearby attractions for a full day experience.`,
                `Dress comfortably for ${mainAttraction} and bring a water bottle to stay hydrated.`,
                `Learn about the history of ${mainAttraction} beforehand to enhance your experience.`,
                `Allow extra time at ${mainAttraction} to fully appreciate its unique features.`,
                `Check the opening hours of ${mainAttraction} and plan your visit accordingly.`
              ];
              
              return tips[dayNumber % tips.length];
            };

            // Helper function to generate varied attraction descriptions
            const generateAttractionDescription = (attractionName, index) => {
              const descriptions = [
                `Experience the magnificent ${attractionName} and immerse yourself in its rich cultural heritage.`,
                `Discover the architectural wonders of ${attractionName} and learn about its fascinating history.`,
                `Marvel at the stunning beauty of ${attractionName} and capture unforgettable memories.`,
                `Explore the iconic ${attractionName} and witness breathtaking panoramic views.`,
                `Journey through ${attractionName} and experience authentic local traditions.`,
                `Uncover the secrets of ${attractionName} with expert guided tours and insights.`,
                `Step into the world of ${attractionName} and enjoy interactive experiences.`,
                `Visit the legendary ${attractionName} and understand its cultural significance.`
              ];
              return descriptions[index % descriptions.length];
            };

            // Helper function to generate varied personal tips
            const generatePersonalTip = (attractionName, index) => {
              const tips = [
                `Arrive early at ${attractionName} for shorter queues and better photo opportunities.`,
                `Don't forget to try the local delicacies near ${attractionName}.`,
                `Bring your camera to ${attractionName} - the views are absolutely stunning!`,
                `Wear comfortable shoes when visiting ${attractionName} as there's lots to explore.`,
                `Check out the gift shop at ${attractionName} for unique souvenirs.`,
                `Take a guided tour at ${attractionName} to learn fascinating historical facts.`,
                `Visit ${attractionName} during golden hour for the most beautiful lighting.`,
                `Book online tickets for ${attractionName} to save time and money.`
              ];
              return tips[index % tips.length];
            };

            // Helper function to generate varied meal options
            const generateMealOptions = (dayNumber) => {
              const mealOptions = [
                { breakfast: "Hotel Restaurant", lunch: "Traditional Emirati", dinner: "Rooftop Dining" },
                { breakfast: "Local Café", lunch: "Street Food Tour", dinner: "Fine Dining" },
                { breakfast: "Continental Breakfast", lunch: "Seafood Restaurant", dinner: "Desert BBQ" },
                { breakfast: "Buffet Breakfast", lunch: "International Cuisine", dinner: "Cultural Experience" },
                { breakfast: "Health Bowl Café", lunch: "Local Market Food", dinner: "Luxury Restaurant" },
                { breakfast: "Arabian Breakfast", lunch: "Food Court", dinner: "Waterfront Dining" },
                { breakfast: "Hotel Brunch", lunch: "Authentic Local", dinner: "Sky Lounge" },
                { breakfast: "Organic Café", lunch: "Fusion Cuisine", dinner: "Traditional Feast" }
              ];
              return mealOptions[dayNumber % mealOptions.length];
            };

            const itinerary = Array.from({ length: tripDays }, (_, dayIndex) => {
              // Ensure we have attractions for each day
              const dayAttractions = [];
              const attractionsPerDay = Math.min(2, Math.max(1, Math.floor(attractions.length / tripDays)));
              
              for (let i = 0; i < attractionsPerDay; i++) {
                const attractionIndex = (dayIndex * attractionsPerDay + i) % attractions.length;
                const attraction = attractions[attractionIndex];
                
                if (attraction) {
                  dayAttractions.push({
                    name: attraction.attraction,
                    duration: "2-3 hours",
                    type: "sightseeing",
                    description: generateAttractionDescription(attraction.attraction, dayIndex * attractionsPerDay + i),
                    price: attraction.price || 150,
                    timing: i === 0 ? "9:00 AM - 12:00 PM" : "2:00 PM - 5:00 PM",
                    personalTip: generatePersonalTip(attraction.attraction, dayIndex * attractionsPerDay + i),
                    imageUrl: attraction.image_url || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center`
                  });
                }
              }

              // Random attraction selection with filtering
              if (dayAttractions.length === 0) {
                const availableAttractions = attractions.length > 0 ? attractions : generateRandomAttractions();
                
                // Random filtering based on day and preferences
                const filteredByBudget = availableAttractions.filter(attr => {
                  const price = attr.price || 150;
                  const budgetLimit = data.budget === 'budget' ? 100 : data.budget === 'mid-range' ? 300 : 1000;
                  return price <= budgetLimit;
                });
                
                const attractionsPool = filteredByBudget.length > 0 ? filteredByBudget : availableAttractions;
                // Use user-specific seed for consistent but unique selection
                const userSeed = Date.now() + dayIndex * 1000 + Math.random() * 10000;
                const randomIndex = Math.floor((userSeed % attractionsPool.length));
                const randomAttraction = attractionsPool[randomIndex];
                
                // Generate random timing
                const timings = [
                  "9:00 AM - 12:00 PM",
                  "10:00 AM - 1:00 PM", 
                  "2:00 PM - 5:00 PM",
                  "3:00 PM - 6:00 PM",
                  "6:00 PM - 9:00 PM"
                ];
                
                const durations = ["2 hours", "3 hours", "4 hours", "Half day", "Full day"];
                
                dayAttractions.push({
                  name: randomAttraction.attraction,
                  emirates: randomAttraction.emirates, // Include emirates information
                  duration: durations[Math.floor(Math.random() * durations.length)],
                  type: randomAttraction.category || "sightseeing",
                  description: generateAttractionDescription(randomAttraction.attraction, dayIndex),
                  price: randomAttraction.price || Math.floor(Math.random() * 200) + 50,
                  timing: timings[Math.floor(Math.random() * timings.length)],
                  personalTip: generatePersonalTip(randomAttraction.attraction, dayIndex),
                  imageUrl: randomAttraction.image_url || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center`
                });
              }

              const hotel = hotels[Math.floor(dayIndex / 3) % hotels.length] || { name: "Premium Hotel", cost_per_night: 400 };
              const transportOption = transport[dayIndex % transport.length] || { label: "Private Car", cost_per_day: 150 };

              return {
                id: `day_${dayIndex + 1}`,
                day: dayIndex + 1,
                title: generateDayTitle(dayIndex + 1, dayAttractions, theme.theme),
                description: generateDayDescription(dayIndex, dayAttractions, theme.theme, travelerType),
                attractions: dayAttractions,
                hotel: hotel.name,
                transport: transportOption.label,
                image: dayAttractions[0]?.imageUrl || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop&crop=center`,
                images: dayAttractions.map(attr => attr.imageUrl).filter(Boolean),
                meals: generateMealOptions(dayIndex),
                budgetBreakdown: {
                  attractions: dayAttractions.reduce((sum, attr) => sum + (attr.price || 0), 0),
                  meals: 180,
                  transport: transportOption.cost_per_day || 150,
                  accommodation: hotel.cost_per_night || 400
                },
                expertTip: generateExpertTip(dayIndex, dayAttractions, theme.theme)
              };
            });

            const totalCost = itinerary.reduce((sum, day) => 
              sum + day.budgetBreakdown.attractions + day.budgetBreakdown.meals + 
              day.budgetBreakdown.transport + day.budgetBreakdown.accommodation, 0);

            return {
              id: `random_package_${pkgIndex + 1}`,
              title: theme.title,
              description: theme.description,
              personalNote: `This ${theme.theme} package is perfect for ${travelerType} travelers seeking memorable experiences in the UAE`,
              theme: theme.theme,
              totalEstimatedCost: totalCost,
              itinerary: itinerary
            };
          });
        };

        // Generate packages using AI with fallback
        let generatedPackages;
        let usingAI = true;
        
        console.log("🤖 ATTEMPTING AI GENERATION...");
        
        // Add detailed analysis before attempting AI generation
        analyzeAIGenerationIssues();
        
        try {
          generatedPackages = await generateAIPackages();
          console.log("✅ AI GENERATION SUCCESSFUL! Generated", generatedPackages?.length || 0, "packages");
          console.log("🎯 Using AI-generated packages");
        } catch (error) {
          console.error("❌ AI GENERATION FAILED, using fallback:", error);
          console.log("📋 FAILURE DETAILS:");
          console.log("- Error Type:", error.constructor.name);
          console.log("- Error Message:", error.message);
          console.log("- Stack:", error.stack?.substring(0, 500));
          
          usingAI = false;
          generatedPackages = createRandomPackages();
          console.log("🔄 RANDOM GENERATION SUCCESSFUL! Generated", generatedPackages?.length || 0, "packages");
          console.log("📝 Using random filtering system packages");
        }
        
        // Ensure we always have packages with attractions
        if (!generatedPackages || generatedPackages.length === 0) {
          console.log("⚠️ NO PACKAGES GENERATED, creating emergency random packages");
          usingAI = false;
          generatedPackages = createRandomPackages();
          console.log("🆘 Using emergency random filtering packages");
        }
        
        // Add generation method info to packages for UI display
        generatedPackages = generatedPackages.map(pkg => ({
          ...pkg,
          generationMethod: usingAI ? "AI" : "Random",
          isAIGenerated: usingAI
        }));
        
        console.log(`🎉 FINAL RESULT: Using ${usingAI ? 'AI-GENERATED' : 'RANDOM FILTERING'} packages`);
        console.log("📊 Package details:", generatedPackages.map(p => ({
          title: p.title,
          method: p.generationMethod,
          attractions: p.itinerary?.reduce((acc, day) => acc + (day.attractions?.length || 0), 0)
        })));
        
        // Validate that all packages have attractions - handle both daily and weekly structures
        generatedPackages = generatedPackages.map(pkg => {
          // Handle long trip weekly structure
          if (pkg.weeklyStructure && pkg.weeklyHighlights && pkg.weeklyHighlights.length > 0) {
            console.log(`📅 Processing weekly structure for: ${pkg.title}`);
            
            // Convert weekly structure to daily itinerary
            const dailyItinerary = [];
            let dayCounter = 1;
            
            pkg.weeklyHighlights.forEach((week, weekIndex) => {
              const daysInWeek = week.days ? parseInt(week.days.split('-')[1]) - parseInt(week.days.split('-')[0]) + 1 : 7;
              
              for (let dayInWeek = 0; dayInWeek < daysInWeek; dayInWeek++) {
                // Handle both detailed attractions array and compact keyAttractions array
                let dayAttraction = null;
                
                if (week.attractions && week.attractions.length > 0) {
                  // Old detailed format
                  dayAttraction = week.attractions[dayInWeek % week.attractions.length];
                } else if (week.keyAttractions && week.keyAttractions.length > 0) {
                  // New compact format
                  const attractionName = week.keyAttractions[dayInWeek % week.keyAttractions.length];
                  dayAttraction = {
                    name: attractionName,
                    duration: "2-3 hours",
                    type: "sightseeing",
                    price: 150
                  };
                }
                
                dailyItinerary.push({
                  id: `day_${dayCounter}`,
                  day: dayCounter,
                  title: `Day ${dayCounter}: ${week.theme}`,
                  description: `Week ${week.week} - ${week.theme}`,
                  attractions: dayAttraction ? [{
                    name: dayAttraction.name,
                    duration: dayAttraction.duration || "2-3 hours",
                    type: dayAttraction.type || "sightseeing",
                    description: `Experience ${dayAttraction.name}`,
                    price: dayAttraction.price || 150,
                    timing: "9:00 AM - 12:00 PM",
                    personalTip: dayAttraction.personalTip || "Book in advance",
                    imageUrl: `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center`
                  }] : [],
                  hotel: week.recommendedHotels && week.recommendedHotels[0] || "Premium Hotel",
                  transport: week.transport || "Private Car",
                  dailyBudget: Math.floor((week.budget || week.weeklyBudget || 3500) / 7)
                });
                dayCounter++;
              }
            });
            
            pkg.itinerary = dailyItinerary;
            delete pkg.weeklyHighlights; // Remove weekly structure, keep daily
            delete pkg.weeklyStructure;
            
            console.log(`✅ Converted ${pkg.title} to ${dailyItinerary.length} daily items`);
          }
          
          // Validate daily structure
          if (!pkg.itinerary || pkg.itinerary.length === 0) {
            console.warn(`Package ${pkg.title} has no itinerary, creating basic structure`);
            
            // Create basic itinerary using database data if none exists
            const tripDays = parseInt(formData?.duration || '7');
            pkg.itinerary = Array.from({ length: Math.min(tripDays, 30) }, (_, index) => {
              // Use database attractions for structure
              const dayAttraction = attractions[index % (attractions.length || 1)];
              const dayHotel = hotels[index % (hotels.length || 1)];
              const dayTransport = transport[index % (transport.length || 1)];
              
              return {
                id: `day_${index + 1}`,
                day: index + 1,
                title: `Day ${index + 1}: ${dayAttraction?.name || 'Dubai Experience'}`,
                description: `Explore ${dayAttraction?.description || 'Dubai attractions and experiences'}`,
                attractions: [{
                  name: dayAttraction?.name || "Dubai Experience",
                  duration: "3 hours",
                  type: dayAttraction?.category || "sightseeing",
                  description: dayAttraction?.description?.substring(0, 100) || "Discover Dubai's highlights",
                  price: dayAttraction?.price || 150,
                  timing: "9:00 AM - 12:00 PM",
                  personalTip: dayAttraction?.personal_tip || "Early visit recommended",
                  imageUrl: dayAttraction?.image_url || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center"
                }],
                hotel: dayHotel?.name || "Premium Hotel",
                transport: dayTransport?.label || "Private Car",
                dailyBudget: 500
              };
            });
          }
          
          pkg.itinerary = pkg.itinerary.map((day, dayIndex) => {
            if (!day.attractions || day.attractions.length === 0) {
              console.warn(`Day ${day.day} has no attractions, adding from database`);
              
              // Use random filtering for attraction selection
              const availableAttractions = attractions && attractions.length > 0 ? attractions : generateRandomAttractions();
              
              // Apply random filtering
              const randomIndex = Math.floor(Math.random() * availableAttractions.length);
              const selectedAttraction = availableAttractions[randomIndex];
              
              // Generate random properties
              const randomDurations = ["2 hours", "3 hours", "4 hours", "Half day"];
              const randomTimings = ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM", "10:00 AM - 1:00 PM"];
              
              day.attractions = [{
                name: selectedAttraction?.attraction || "Dubai Experience",
                emirates: selectedAttraction?.emirates || "Dubai", // Include emirates for proper detection
                duration: randomDurations[Math.floor(Math.random() * randomDurations.length)],
                type: selectedAttraction?.category || "sightseeing",
                description: selectedAttraction?.description?.substring(0, 100) || `Explore ${selectedAttraction?.attraction || "Dubai"}`,
                price: selectedAttraction?.price || Math.floor(Math.random() * 200) + 50,
                timing: randomTimings[Math.floor(Math.random() * randomTimings.length)],
                personalTip: selectedAttraction?.personal_tip || "Early visit recommended",
                imageUrl: selectedAttraction?.image_url || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center`
              }];
            }
            
            // Ensure hotel and transport are set using database data
            if (!day.hotel && hotels && hotels.length > 0) {
              const dayHotel = hotels[dayIndex % hotels.length];
              day.hotel = dayHotel?.name || "Premium Hotel";
            }
            
            if (!day.transport && transport && transport.length > 0) {
              const dayTransport = transport[dayIndex % transport.length];
              day.transport = dayTransport?.label || "Private Car";
            }
            
            return day;
          });
          
          return pkg;
        }).filter(Boolean);
        
        console.log("Final packages with attractions validation:", generatedPackages);
        
        setPackages(generatedPackages);
        localStorage.setItem("generatedPackages", JSON.stringify(generatedPackages));
        console.log("Package generation completed successfully with", generatedPackages.length, "packages");

      } catch (error) {
        console.error("Error generating packages:", error);
        setError(error.message || "An unexpected error occurred. Please try again.");
      } finally {
        setProgress(100);
        setTimeout(() => {
          setSlideDirection('left');
          setTimeout(() => setIsLoading(false), 800);
        }, 500);
      }
    };

    generatePackages();
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  const handleViewDetails = (selectedPackage) => {
    try {
      localStorage.setItem("selectedPackage", JSON.stringify(selectedPackage));
      navigate("/details");
    } catch (error) {
      console.error("Error saving package:", error);
      setError("Failed to save package details");
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setPackages([]);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          className="relative min-h-screen w-full overflow-hidden"
          style={{
            backgroundImage: 'url(/12.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#F5F2E9'
          }}
          initial={{ x: slideDirection === 'right' ? '100%' : 0 }}
          animate={{ x: 0 }}
          exit={{ x: slideDirection === 'left' ? '-100%' : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-white/75"></div>
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-20 opacity-10"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Plane className="w-16 h-16 text-slate-600" />
            </motion.div>
            
            <motion.div
              className="absolute top-32 right-32 opacity-10"
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="w-20 h-20 text-slate-600" />
            </motion.div>
            
            <motion.div
              className="absolute bottom-40 left-16 opacity-10"
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <MapPin className="w-14 h-14 text-slate-600" />
            </motion.div>
            
            <motion.div
              className="absolute bottom-20 right-20 opacity-10"
              animate={{ 
                rotate: [0, 15, -15, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Compass className="w-18 h-18 text-slate-600" />
            </motion.div>
          </div>

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
            <motion.div 
              className="w-full max-w-lg mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLoadingMessage}
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">
                    {loadingMessages[currentLoadingMessage].icon}
                  </div>
                  <h1 
                    className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-tight"
                    style={{ fontFamily: 'HYPE, sans-serif', letterSpacing: '-0.019em' }}
                  >
                    {loadingMessages[currentLoadingMessage].title}
                  </h1>
                  <p className="text-lg text-slate-500">
                    {loadingMessages[currentLoadingMessage].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              <motion.div 
                className="relative mb-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-slate-200/50 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-6 shadow-lg">
                    <Lottie options={defaultOptions} height={140} width={140} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="w-full max-w-md mx-auto mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-slate-600 to-slate-700 rounded-full relative"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </motion.div>
                </div>
                
                <div className="text-center mt-3">
                  <span className="text-sm font-medium text-slate-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-2">
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <p className="text-slate-500 text-sm">
                  This may take a few moments...
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div 
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
          style={{
            backgroundImage: 'url(/15.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#F5F2E9',
            backgroundAttachment: 'fixed'
          }}
        />
        
        <div className="fixed inset-0 bg-white/75 pointer-events-none z-1"></div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center">
          <motion.div 
            className="bg-white/20 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-slate-800">
              Oops! Something went wrong
            </h3>
            <div className="text-slate-600 text-lg mb-8 text-left space-y-2">
              <p className="font-medium">{error}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleRetry}
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-black font-bold px-8 py-3 rounded-xl"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate("/manual-plan")}
                variant="outline"
                className="border-amber-500/50 text-amber-600 hover:bg-amber-500/10 px-8 py-3 rounded-xl"
              >
                Manual Planning
              </Button>
              <Button 
                onClick={() => navigate("/travel-form")}
                variant="outline"
                className="border-amber-500/50 text-amber-600 hover:bg-amber-500/10 px-8 py-3 rounded-xl"
              >
                Back to Form
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/15.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#F5F2E9',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="fixed inset-0 bg-white/75 pointer-events-none z-1"></div>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-2">
        <div className="absolute w-2 h-2 bg-amber-400/30 rounded-full animate-bounce" style={{top: '20%', left: '10%'}}></div>
        <div className="absolute w-1 h-1 bg-amber-300/40 rounded-full animate-pulse" style={{top: '60%', left: '80%'}}></div>
        <div className="absolute w-3 h-3 bg-amber-500/20 rounded-full animate-ping" style={{top: '40%', left: '60%'}}></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <ProgressBar currentStep={2} />
        
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <motion.div 
            className="text-left mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-800"
              style={{ fontFamily: 'HYPE, sans-serif', letterSpacing: '-0.019em' }}
            >
              Choose Your 
              <span className="block bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 bg-clip-text text-transparent">
                Perfect Journey
              </span>
            </h1>
            
            <p 
              className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-2xl"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              AI-curated experiences based on your preferences and Supabase database
            </p>
          </motion.div>

          {packages.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id || index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(pkg)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    className={`relative h-full overflow-hidden backdrop-blur-xl border border-white/20 shadow-lg bg-white/10 transition-all duration-500 ${
                      hoveredCard === index 
                        ? 'scale-[1.02] -translate-y-3 shadow-2xl bg-white/25' 
                        : ''
                    }`}
                    style={{
                      borderRadius: hoveredCard === index ? "8px" : "0px 0px 60px 0px",
                      boxShadow: hoveredCard === index 
                        ? "0 8px 25px rgba(0,0,0,0.15)" 
                        : "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={pkg.itinerary?.[0]?.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop&crop=center"}
                        alt={pkg.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          hoveredCard === index ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      <motion.div 
                        className="absolute top-4 left-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-white text-xs font-medium">
                            {pkg.isAIGenerated ? "AI Enhanced" : "Curated"}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="p-4 sm:p-6 flex flex-col min-h-[300px]">
                      <h3 
                        className={`text-lg sm:text-xl font-bold mb-3 transition-colors duration-300 ${
                          hoveredCard === index ? 'text-slate-600' : 'text-slate-800'
                        }`}
                        style={{ fontFamily: 'HYPE, sans-serif', letterSpacing: '-0.01em' }}
                      >
                        {pkg.title}
                      </h3>
                      
                      <div className="mb-4 flex-1">
                        <p className={`text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed transition-all duration-300 ${
                          hoveredCard === index ? 'line-clamp-none' : 'line-clamp-4'
                        }`}>
                          {pkg.description}
                        </p>
                        
                        {pkg.personalNote && (
                          <div 
                            className={`mt-3 transition-all duration-500 overflow-hidden ${
                              hoveredCard === index 
                                ? 'opacity-100 max-h-20' 
                                : 'opacity-0 max-h-0'
                            }`}
                          >
                            <div className="border-l-2 border-amber-400/40 pl-3 mt-2">
                              <p className="text-slate-500 text-sm italic">
                                💭 "{pkg.personalNote}"
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 py-2 border-t border-slate-200/30">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="font-medium">{pkg.itinerary?.length || 0} Days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="font-medium">{pkg.itinerary?.reduce((acc, day) => acc + (day.attractions?.length || 0), 0)} Places</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="font-medium">{pkg.isAIGenerated ? "AI" : "DB"}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <button
                          type="button"
                          className={`w-full bg-orange-500 text-slate-900 font-semibold px-4 py-3 sm:py-4 text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all duration-400 ${
                            hoveredCard === index 
                              ? 'hover:bg-orange-600 rounded-sm shadow-lg' 
                              : 'rounded-none shadow-md'
                          }`}
                          style={{
                            fontFamily: "HYPE, sans-serif",
                            borderRadius: hoveredCard === index ? "2px" : "0px 0px 50px 0px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(pkg);
                          }}
                        >
                          Explore Journey
                          <Plane 
                            className={`w-4 h-4 transition-transform ${
                              hoveredCard === index ? 'translate-x-1' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">No packages available</h3>
              <p className="text-slate-600 mb-6">Please try generating packages again</p>
              <Button 
                onClick={handleRetry}
                className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-900 hover:to-black text-white font-bold"
              >
                Generate Packages
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
