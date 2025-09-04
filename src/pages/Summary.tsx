import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Hotel, 
  Car, 
  Plane, 
  DollarSign, 
  Clock,
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  Camera,
  Navigation,
  Mail,
  Phone,
  User,
  Download,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProgressBar } from "@/components/ProgressBar";
import AirplaneLoader from "@/components/AirplaneLoader";
import { BookingService } from "@/services/supabaseService";

interface TravelData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  tripDuration: string;
  journeyMonth: string;
  departureCountry: string;
  emirates: string[];
  budget: string;
  adults: number;
  kids: number;
  infants: number;
}

interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
  duration: string;
  attractions: any[];
  hotel: string;
  transport: string;
  image: string;
  images: string[];
}

interface PackageData {
  id: string;
  title: string;
  description: string;
  itinerary: ItineraryDay[];
}

export default function Summary() {
  const navigate = useNavigate();
  const [travelData, setTravelData] = useState<TravelData | null>(null);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generatePDF = async () => {
    try {
      setIsSaving(true);
      
      // First, save booking to database
      const bookingData = {
        full_name: travelData?.fullName || 'Guest',
        email: travelData?.email || '',
        phone: travelData?.phone || '',
        country_code: travelData?.countryCode || '',
        trip_duration: parseInt(travelData?.tripDuration || '0'),
        journey_month: travelData?.journeyMonth || '',
        departure_country: travelData?.departureCountry || '',
        emirates: travelData?.emirates || [],
        budget: travelData?.budget || '',
        adults: travelData?.adults || 1,
        kids: travelData?.kids || 0,
        infants: travelData?.infants || 0,
        package_title: packageData?.title || 'UAE Journey',
        package_description: packageData?.description || '',
        itinerary_data: itinerary,
        estimated_cost: totalCost,
        price_range_min: priceRange.min,
        price_range_max: priceRange.max,
        booking_status: 'confirmed' as const,
        download_count: 1
      };

      // Check if booking already exists
      const existingBooking = await BookingService.getBookingByEmailAndPackage(
        bookingData.email,
        bookingData.package_title
      );

      if (existingBooking) {
        // Increment download count for existing booking
        await BookingService.incrementDownloadCount(existingBooking.id!);
        console.log('Updated existing booking download count');
      } else {
        // Create new booking
        const savedBooking = await BookingService.addBooking(bookingData);
        console.log('Booking saved to database:', savedBooking);
      }

      // Generate PDF content
      const content = `
Travel Itinerary - ${packageData?.title || 'UAE Journey'}

Traveler: ${travelData?.fullName || 'Guest'}
Email: ${travelData?.email || 'Not provided'}
Phone: ${travelData?.countryCode} ${travelData?.phone || 'Not provided'}

Trip Details:
- Duration: ${getTotalDays()} days
- Destination: ${getEmiratesDisplayText()}
- Travel Month: ${travelData?.journeyMonth?.charAt(0).toUpperCase() + travelData?.journeyMonth?.slice(1) || "Not specified"}
- Travelers: ${getTotalTravelers()}
- Budget: ${travelData?.budget || "Not specified"}

Daily Itinerary:
${itinerary.map((day, index) => `
Day ${day.day || index + 1}: ${day.title || `Day ${index + 1}`}
${day.description}
Attractions: ${day.attractions?.map(a => a.name).join(', ') || 'None specified'}
Hotel: ${day.hotel || 'Premium Hotel'}
Transport: ${day.transport || 'Private Transport'}
`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `;

      // Create a blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `UAE-Travel-Itinerary-${travelData?.fullName?.replace(/\s+/g, '-') || 'Guest'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Error saving booking to database. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Load travel form data
    const formData = localStorage.getItem("travelFormData");
    if (formData) {
      try {
        const parsedData = JSON.parse(formData);
        setTravelData(parsedData);
      } catch (error) {
        console.error("Error parsing travel form data:", error);
      }
    }

    // Load selected package data from details page
    const selectedPackage = localStorage.getItem("selectedPackage");
    if (selectedPackage) {
      try {
        const parsedPackage = JSON.parse(selectedPackage);
        setPackageData(parsedPackage);
        setItinerary(parsedPackage.itinerary || []);
        calculateCosts(parsedPackage.itinerary || []);
      } catch (error) {
        console.error("Error parsing package data:", error);
      }
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  const calculateCosts = (days: ItineraryDay[]) => {
    let total = 0;
    days.forEach(day => {
      // Add attractions cost
      if (day.attractions) {
        day.attractions.forEach(attraction => {
          total += attraction.price || 0;
        });
      }
      // Add estimated hotel cost (assuming per night)
      total += 300; // Average hotel cost per night
      // Add estimated transport cost
      total += 150; // Average transport cost per day
    });

    setTotalCost(total);
    
    // Calculate price range based on budget preference
    const baseMin = total * 0.8;
    const baseMax = total * 1.3;
    setPriceRange({ min: Math.round(baseMin), max: Math.round(baseMax) });
  };

  const getTotalDays = () => {
    return parseInt(travelData?.tripDuration || "0") || itinerary.length;
  };

  const getEmiratesDisplayText = () => {
    if (!travelData?.emirates || travelData.emirates.includes("all")) {
      return "All UAE Emirates";
    }
    return travelData.emirates.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(", ");
  };

  const getTotalTravelers = () => {
    const adults = travelData?.adults || 0;
    const kids = travelData?.kids || 0;
    const infants = travelData?.infants || 0;
    return adults + kids + infants;
  };

  if (isLoading) {
    return <AirplaneLoader visible={true} onComplete={handleLoadingComplete} />;
  }

  if (!showContent) {
    return null; // Don't show content until animation is complete
  }

  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundImage: 'url(/15.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#F5F2E9'
      }}
    >
      {/* Light Background Overlay */}
      <div className="absolute inset-0 bg-white/80"></div>
      
      {/* Elegant Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-stone-300/30 to-stone-400/40 rounded-full backdrop-blur-sm opacity-50"></div>
        <div className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-br from-amber-200/25 to-amber-300/35 rounded-full backdrop-blur-sm opacity-45"></div>
        <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-stone-200/20 to-stone-300/30 rounded-full opacity-35"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <ProgressBar currentStep={4} />

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-between mb-6">
               
                <div className="flex-1" />
              </div>

             
              
              <h1 
                className="text-4xl md:text-5xl font-bold mb-4 text-slate-800"
                style={{ fontFamily: 'HYPE, sans-serif', letterSpacing: '-0.019em' }}
              >
                Your Dream Journey Awaits
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {packageData?.description || `Experience the magic of ${getEmiratesDisplayText()} with this carefully crafted itinerary`}
              </p>
            </motion.div>

            {/* User Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8"
            >
              <Card 
                className="bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-xl shadow-stone-400/20 transition-all duration-500 ease-in-out"
                style={{borderRadius: '0px 0px 60px 0px'}}
                onMouseEnter={(e) => e.currentTarget.style.borderRadius = '8px'}
                onMouseLeave={(e) => e.currentTarget.style.borderRadius = '0px 0px 60px 0px'}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                    <User className="w-5 h-5 mr-3 text-slate-600" />
                    Traveler Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-sm text-slate-500">Full Name</p>
                        <p className="text-slate-800 font-semibold">{travelData?.fullName || "Not provided"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="text-slate-800 font-semibold">{travelData?.email || "Not provided"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="text-slate-800 font-semibold">
                          {travelData?.countryCode} {travelData?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trip Overview Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {/* Duration Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/90 backdrop-blur-xl border border-stone-200/60 rounded-xl p-4 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full mb-3">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{getTotalDays()}</h3>
                <p className="text-slate-500 text-sm">Days</p>
              </motion.div>

              {/* Destinations Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/90 backdrop-blur-xl border border-stone-200/60 rounded-xl p-4 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full mb-3">
                  <Globe className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {travelData?.emirates?.includes("all") ? "All" : travelData?.emirates?.length || 0}
                </h3>
                <p className="text-slate-500 text-sm">Emirates</p>
              </motion.div>

              {/* Travelers Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/90 backdrop-blur-xl border border-stone-200/60 rounded-xl p-4 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full mb-3">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{getTotalTravelers()}</h3>
                <p className="text-slate-500 text-sm">Travelers</p>
              </motion.div>

              {/* Total Attractions Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-amber-50 to-amber-100/50 backdrop-blur-xl border border-amber-200 rounded-xl p-4 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-200/50 rounded-full mb-3">
                  <MapPin className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {itinerary.reduce((total, day) => total + (day.attractions?.length || 0), 0)}
                </h3>
                <p className="text-slate-600 text-sm">Attractions</p>
              </motion.div>
            </motion.div>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Travel Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="lg:col-span-1"
              >
                <Card className="bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-xl shadow-stone-400/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                      <Navigation className="w-5 h-5 mr-3 text-slate-600" />
                      Trip Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Destination */}
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-slate-600 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500">Destination</p>
                        <p className="text-slate-800 font-semibold text-sm">{getEmiratesDisplayText()}</p>
                      </div>
                    </div>

                    {/* Travel Month */}
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-4 h-4 text-slate-600 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500">Travel Month</p>
                        <p className="text-slate-800 font-semibold text-sm">
                          {travelData?.journeyMonth?.charAt(0).toUpperCase() + travelData?.journeyMonth?.slice(1) || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Departure */}
                    <div className="flex items-start space-x-3">
                      <Plane className="w-4 h-4 text-slate-600 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500">Departing Country</p>
                        <p className="text-slate-800 font-semibold text-sm">{travelData?.departureCountry || "Not specified"}</p>
                      </div>
                    </div>

                    {/* Travelers Breakdown */}
                    <div className="flex items-start space-x-3">
                      <Users className="w-4 h-4 text-slate-600 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500">Travelers</p>
                        <div className="space-y-1">
                          {travelData?.adults && (
                            <p className="text-slate-800 font-semibold text-sm">
                              {travelData.adults} Adult{travelData.adults > 1 ? 's' : ''}
                            </p>
                          )}
                          {travelData?.kids && travelData.kids > 0 && (
                            <p className="text-slate-800 font-semibold text-sm">
                              {travelData.kids} Child{travelData.kids > 1 ? 'ren' : ''}
                            </p>
                          )}
                          {travelData?.infants && travelData.infants > 0 && (
                            <p className="text-slate-800 font-semibold text-sm">
                              {travelData.infants} Infant{travelData.infants > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-start space-x-3">
                      <DollarSign className="w-4 h-4 text-slate-600 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500">Budget Preference</p>
                        <Badge className="bg-gradient-to-r from-amber-100 to-amber-200 text-slate-700 border-amber-300">
                          {travelData?.budget || "Not specified"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Itinerary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="lg:col-span-2"
              >
                <Card className="bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-xl shadow-stone-400/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                      <Camera className="w-5 h-5 mr-3 text-slate-600" />
                      {packageData?.title || "Daily Itinerary"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {itinerary.length > 0 ? (
                      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {itinerary.map((day, index) => (
                          <motion.div
                            key={day.id || index}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                            className="relative"
                          >
                            {/* Timeline line */}
                            {index < itinerary.length - 1 && (
                              <div className="absolute left-4 top-8 w-0.5 h-full bg-gradient-to-b from-slate-400/60 to-slate-300/20" />
                            )}
                            
                            <div className="flex items-start space-x-3">
                              {/* Day number */}
                              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full text-white font-bold text-sm shadow-lg">
                                {day.day || index + 1}
                              </div>
                              
                              {/* Day content */}
                              <div className="flex-1 bg-white/80 backdrop-blur-lg border border-stone-200/60 rounded-lg p-3 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-2">{day.title || `Day ${index + 1}`}</h3>
                                <p className="text-xs text-slate-600 mb-2 line-clamp-2">{day.description}</p>
                                
                                {/* Attractions */}
                                {day.attractions && day.attractions.length > 0 && (
                                  <div className="mb-2">
                                    <p className="text-xs text-slate-500 mb-1">Attractions ({day.attractions.length})</p>
                                    <div className="flex flex-wrap gap-1">
                                      {day.attractions.slice(0, 3).map((attraction, idx) => (
                                        <Badge key={idx} className="bg-slate-100 text-slate-700 border-slate-300 text-xs">
                                          {attraction.name}
                                        </Badge>
                                      ))}
                                      {day.attractions.length > 3 && (
                                        <Badge className="bg-slate-200 text-slate-600 border-slate-400 text-xs">
                                          +{day.attractions.length - 3} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Hotel & Transport */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <Hotel className="w-3 h-3 text-slate-600" />
                                    <span className="text-slate-700 truncate">{day.hotel || "Premium Hotel"}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Car className="w-3 h-3 text-slate-600" />
                                    <span className="text-slate-700 truncate">{day.transport || "Private Transport"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm mb-1">No itinerary available</p>
                        <p className="text-xs">Please generate an itinerary first</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>



            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* Terms and Conditions Checkbox */}
              <div className="flex flex-col items-center w-full mt-6">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-amber-600"
                    checked={termsChecked}
                    onChange={e => setTermsChecked(e.target.checked)}
                  />
                  I agree to the <Link to="/terms" className="underline text-amber-700 hover:text-amber-900">Terms and Conditions</Link>
                </label>
              </div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white font-bold transition-all duration-500 hover:shadow-amber-500/40 hover:shadow-lg"
                  disabled={!termsChecked || isSaving}
                  onClick={generatePDF}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Itinerary
                    </>
                  )}
                </Button>
              </motion.div>
              {showToast && (
                <div className="fixed top-8 right-8 z-50 px-6 py-4 rounded-xl shadow-xl font-semibold transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #FFD580',
                    boxShadow: '0 4px 24px rgba(218, 165, 32, 0.12)'
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-amber-700 text-lg">✅ Booking saved & Itinerary downloaded!</span>
                    <span className="text-slate-600 text-sm">Your booking has been saved to our database.</span>
                    <span className="text-slate-600 text-sm">Contact us on WhatsApp for Inquiry: 
                      <a 
                        href="https://wa.me/971501234567" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 font-bold ml-1 hover:underline"
                      >
                        +971 50 123 4567
                      </a>
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}