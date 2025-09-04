import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o'

const supabase = createClient(supabaseUrl, supabaseKey)

// Function to extract numeric price from string
function extractPrice(priceStr) {
  if (!priceStr || priceStr === 'Free' || priceStr === 'N/A') return 0
  
  // Handle numeric values
  if (typeof priceStr === 'number') return priceStr
  
  // Extract first number from string
  const match = priceStr.toString().match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0
}

// Function to get appropriate image URL based on attraction type
function getImageUrl(attraction, emirate) {
  const attractionLower = attraction.toLowerCase()
  
  // Specific mappings for different types of attractions
  if (attractionLower.includes('beach') || attractionLower.includes('corniche')) {
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('mosque') || attractionLower.includes('fort') || attractionLower.includes('heritage')) {
    return 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('museum') || attractionLower.includes('palace') || attractionLower.includes('historic')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('water') || attractionLower.includes('aqua') || attractionLower.includes('kayak') || attractionLower.includes('boat')) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('desert') || attractionLower.includes('safari') || attractionLower.includes('camel') || attractionLower.includes('quad')) {
    return 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('zoo') || attractionLower.includes('wildlife') || attractionLower.includes('safari park')) {
    return 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('garden') || attractionLower.includes('park') || attractionLower.includes('oasis') || attractionLower.includes('mangrove')) {
    return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('mall') || attractionLower.includes('souk') || attractionLower.includes('market')) {
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('world') || attractionLower.includes('park') || attractionLower.includes('adventure') || attractionLower.includes('legoland')) {
    return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('tower') || attractionLower.includes('burj') || attractionLower.includes('building')) {
    return 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('ski') || attractionLower.includes('ice')) {
    return 'https://images.unsplash.com/photo-1544996972-3aacf8c0ec9d?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('balloon') || attractionLower.includes('zipline') || attractionLower.includes('skydive')) {
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('horse') || attractionLower.includes('equestrian')) {
    return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('driving') || attractionLower.includes('circuit') || attractionLower.includes('autodrome')) {
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('butterfly') || attractionLower.includes('flower') || attractionLower.includes('miracle')) {
    return 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop'
  } else if (attractionLower.includes('buggy') || attractionLower.includes('dune')) {
    return 'https://images.unsplash.com/photo-1544966503-7cc53c1396cc?w=800&h=600&fit=crop'
  }
  
  // Default image based on emirate
  return 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'
}

// Comprehensive attractions data from user's JSON
const attractionsData = [
  // Abu Dhabi
  { "Emirate": "Abu Dhabi", "Attraction": "Abu Dhabi Heritage Village", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Buggy Tours", "Adult Price (AED)": "250+ (varies by operator)", "Kid Price (AED)": "250+ (varies)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Camel Trekking", "Adult Price (AED)": "250+ (varies)", "Kid Price (AED)": "250+ (varies)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Caterham Driving", "Adult Price (AED)": "300+ (per session)", "Kid Price (AED)": "N/A (age restrictions)", "Infant Price (AED)": "N/A" },
  { "Emirate": "Abu Dhabi", "Attraction": "Corniche Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Corniche Boat", "Adult Price (AED)": "50-100 (rental)", "Kid Price (AED)": "50-100", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Emirates Palace", "Adult Price (AED)": "Free (entry); tours 100+", "Kid Price (AED)": "Free (entry)", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Etihad Towers", "Adult Price (AED)": "Free (entry); observation deck 95", "Kid Price (AED)": "50 (ages 6-12)", "Infant Price (AED)": "Free (under 6)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Evening Desert Safari", "Adult Price (AED)": 250, "Kid Price (AED)": 250, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Ferrari World", "Adult Price (AED)": 345, "Kid Price (AED)": "265 (under 1.3m)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Full Moon Kayak", "Adult Price (AED)": "150-200", "Kid Price (AED)": "150-200", "Infant Price (AED)": "Free (under 5)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Jubail Mangrove Park", "Adult Price (AED)": "15 (entry); kayak 100+", "Kid Price (AED)": 10, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Liwa Desert Safari", "Adult Price (AED)": "400+", "Kid Price (AED)": "400+", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Louvre Abu Dhabi", "Adult Price (AED)": 63, "Kid Price (AED)": "Free (under 18)", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Louvre Kayak", "Adult Price (AED)": 150, "Kid Price (AED)": 150, "Infant Price (AED)": "Free (under 5)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Mangrove National Park", "Adult Price (AED)": "Free (entry); tours 100+", "Kid Price (AED)": "Free (entry)", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Qasr Al Hosn", "Adult Price (AED)": 30, "Kid Price (AED)": "Free (under 18)", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Qasr Al Watan", "Adult Price (AED)": 60, "Kid Price (AED)": "30 (ages 4-17)", "Infant Price (AED)": "Free (under 4)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Quad Bike Safari", "Adult Price (AED)": "250+", "Kid Price (AED)": "250+", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Reem Kayak Tour", "Adult Price (AED)": "150-200", "Kid Price (AED)": "150-200", "Infant Price (AED)": "Free (under 5)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Saadiyat Beach", "Adult Price (AED)": "25 (entry)", "Kid Price (AED)": "Free (under 12)", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Sheikh Zayed Grand Mosque", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Sir Bani Yas Island", "Adult Price (AED)": "Ferry 250+; activities vary", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Warner Bros. World", "Adult Price (AED)": 345, "Kid Price (AED)": "265 (under 1.3m)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Wilderness Nature Tours", "Adult Price (AED)": "300+", "Kid Price (AED)": "300+", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Yas Beach", "Adult Price (AED)": 50, "Kid Price (AED)": "Free (under 8)", "Infant Price (AED)": "Free" },
  { "Emirate": "Abu Dhabi", "Attraction": "Yas Marina Circuit", "Adult Price (AED)": "Tours 150", "Kid Price (AED)": "75 (ages 5-12)", "Infant Price (AED)": "Free (under 5)" },
  { "Emirate": "Abu Dhabi", "Attraction": "Yas Waterworld", "Adult Price (AED)": 295, "Kid Price (AED)": "250 (under 1.3m)", "Infant Price (AED)": "Free (under 3)" },

  // Ajman
  { "Emirate": "Ajman", "Attraction": "Ajman Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Ajman", "Attraction": "Ajman City Centre", "Adult Price (AED)": "Free (shopping mall)", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Ajman", "Attraction": "Ajman Marina", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Ajman", "Attraction": "Ajman Museum", "Adult Price (AED)": 5, "Kid Price (AED)": "Free (under 12)", "Infant Price (AED)": "Free" },
  { "Emirate": "Ajman", "Attraction": "Al Zorah Nature Reserve", "Adult Price (AED)": "Free (entry); tours 50+", "Kid Price (AED)": "Free (entry)", "Infant Price (AED)": "Free" },

  // Al Ain
  { "Emirate": "Al Ain", "Attraction": "Al Ain National Museum", "Adult Price (AED)": 5, "Kid Price (AED)": "Free (under 12)", "Infant Price (AED)": "Free" },
  { "Emirate": "Al Ain", "Attraction": "Al Ain Oasis", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Al Ain", "Attraction": "Al Ain Zoo", "Adult Price (AED)": 30, "Kid Price (AED)": "10 (ages 3-12)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Al Ain", "Attraction": "Al Jahili Fort", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Al Ain", "Attraction": "Green Mubazzarah", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Al Ain", "Attraction": "Hili Archaeological Park", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Al Ain", "Attraction": "Jebel Hafeet", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Al Ain", "Attraction": "Qasr Al Muwaiji", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Al Ain", "Attraction": "Sheikh Zayed Palace Museum (Qasr Al Ain)", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Al Ain", "Attraction": "Wadi Adventure", "Adult Price (AED)": "65 (entry); rides extra", "Kid Price (AED)": "45 (ages 3-12)", "Infant Price (AED)": "Free (under 3)" },

  // Dubai attractions (large set)
  { "Emirate": "Dubai", "Attraction": "Ain Dubai", "Adult Price (AED)": 130, "Kid Price (AED)": "100 (ages 3-12)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Al Barari Playground", "Adult Price (AED)": "Varies (play area free)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Al Fahidi Historic District", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Al Mamzar Beach Park", "Adult Price (AED)": "5 (entry)", "Kid Price (AED)": "Free (under 5)", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Al Seef", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Atlantis Aquaventure", "Adult Price (AED)": 329, "Kid Price (AED)": "299 (under 1.2m)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Atlantis The Palm", "Adult Price (AED)": "Varies (aquarium 100+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Balloon Flights", "Adult Price (AED)": 995, "Kid Price (AED)": "895 (ages 5-11)", "Infant Price (AED)": "N/A (under 5 not allowed)" },
  { "Emirate": "Dubai", "Attraction": "Bla Bla Dubai", "Adult Price (AED)": "Free (entry); activities vary", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Burj Al Arab", "Adult Price (AED)": "Tours 249", "Kid Price (AED)": 249, "Infant Price (AED)": "Free (under 4)" },
  { "Emirate": "Dubai", "Attraction": "Burj Khalifa", "Adult Price (AED)": "169 (level 124)", "Kid Price (AED)": "139 (ages 4-12)", "Infant Price (AED)": "Free (under 4)" },
  { "Emirate": "Dubai", "Attraction": "Crocodile Park", "Adult Price (AED)": 95, "Kid Price (AED)": "50 (ages 3-12)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Desert Safari", "Adult Price (AED)": 250, "Kid Price (AED)": 250, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dhow Cruises", "Adult Price (AED)": "50-150", "Kid Price (AED)": "50-150", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dinner Cruises", "Adult Price (AED)": "150-300", "Kid Price (AED)": "150-300", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dinner in the Sky", "Adult Price (AED)": 699, "Kid Price (AED)": "599 (ages 5-12)", "Infant Price (AED)": "N/A (under 5)" },
  { "Emirate": "Dubai", "Attraction": "Dolphin & Seal Show", "Adult Price (AED)": 105, "Kid Price (AED)": "75 (ages 2-11)", "Infant Price (AED)": "Free (under 2)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Aquarium", "Adult Price (AED)": 120, "Kid Price (AED)": 120, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Autodrome", "Adult Price (AED)": "200+ (experiences)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "N/A" },
  { "Emirate": "Dubai", "Attraction": "Dubai Butterfly Garden", "Adult Price (AED)": 55, "Kid Price (AED)": 55, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Canal", "Adult Price (AED)": "Free; cruises 50+", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Creek", "Adult Price (AED)": "Free; abra ride 1", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Creek Harbour", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Design District", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Dolphinarium", "Adult Price (AED)": "50 (entry)", "Kid Price (AED)": "30 (ages 2-11)", "Infant Price (AED)": "Free (under 2)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Festival City", "Adult Price (AED)": "Free (mall)", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Festival Plaza", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Fountain", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Frame", "Adult Price (AED)": 50, "Kid Price (AED)": "20 (ages 3-12)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Garden Glow", "Adult Price (AED)": 65, "Kid Price (AED)": 65, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Gold Souk", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Healthcare City", "Adult Price (AED)": "Free (area)", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Hills Estate", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Ice Rink", "Adult Price (AED)": 100, "Kid Price (AED)": 100, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai International City", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Internet City", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Knowledge Park", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Mall", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Marina", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Marina Mall", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Marina Yacht Tour", "Adult Price (AED)": "150+", "Kid Price (AED)": "150+", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Media City", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Miracle Garden", "Adult Price (AED)": 95, "Kid Price (AED)": "80 (ages 3-11)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Museum", "Adult Price (AED)": 3, "Kid Price (AED)": "1 (under 6)", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Opera", "Adult Price (AED)": "Varies by show", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Varies" },
  { "Emirate": "Dubai", "Attraction": "Dubai Outlet Mall", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Parks", "Adult Price (AED)": "Varies per park", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Parks and Resorts", "Adult Price (AED)": "295 (multi-park)", "Kid Price (AED)": 295, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Safari Park", "Adult Price (AED)": 50, "Kid Price (AED)": "20 (ages 3-12)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Dubai Silicon Oasis", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Sports City", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai Water Canal", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Dubai World Trade Centre", "Adult Price (AED)": "Free (events vary)", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Etihad Museum", "Adult Price (AED)": 25, "Kid Price (AED)": "10 (ages 5-18)", "Infant Price (AED)": "Free (under 5)" },
  { "Emirate": "Dubai", "Attraction": "Fishing Trip", "Adult Price (AED)": "400+", "Kid Price (AED)": "400+", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Flyboard", "Adult Price (AED)": "300+", "Kid Price (AED)": "N/A (age restrictions)", "Infant Price (AED)": "N/A" },
  { "Emirate": "Dubai", "Attraction": "Global Village", "Adult Price (AED)": 25, "Kid Price (AED)": "Free (under 3)", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Horse Riding", "Adult Price (AED)": "200+", "Kid Price (AED)": "200+", "Infant Price (AED)": "N/A" },
  { "Emirate": "Dubai", "Attraction": "IMG Worlds of Adventure", "Adult Price (AED)": 365, "Kid Price (AED)": "325 (under 1.2m)", "Infant Price (AED)": "Free (under 1.05m)" },
  { "Emirate": "Dubai", "Attraction": "Jet Ski", "Adult Price (AED)": "300+ (30 min)", "Kid Price (AED)": "N/A", "Infant Price (AED)": "N/A" },
  { "Emirate": "Dubai", "Attraction": "Jumeirah Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Jumeirah Mosque", "Adult Price (AED)": "Tours 25", "Kid Price (AED)": "Free (under 5)", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Jumeirah Public Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Kayak", "Adult Price (AED)": "100+", "Kid Price (AED)": "100+", "Infant Price (AED)": "Free (under 5)" },
  { "Emirate": "Dubai", "Attraction": "Kite Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "La Mer", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "La Mer Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Legoland Dubai", "Adult Price (AED)": 330, "Kid Price (AED)": 330, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Marina Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Mega Yacht Dinner", "Adult Price (AED)": "200+", "Kid Price (AED)": "200+", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Miracle Garden", "Adult Price (AED)": 95, "Kid Price (AED)": "80 (ages 3-11)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Motiongate", "Adult Price (AED)": 330, "Kid Price (AED)": 330, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Musandam Tour", "Adult Price (AED)": 250, "Kid Price (AED)": 200, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Museum of the Future", "Adult Price (AED)": 149, "Kid Price (AED)": "Free (under 3)", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Palm Jumeirah", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Pavilion Dive Centre", "Adult Price (AED)": "Diving 400+", "Kid Price (AED)": "Varies", "Infant Price (AED)": "N/A" },
  { "Emirate": "Dubai", "Attraction": "Safari Park", "Adult Price (AED)": 50, "Kid Price (AED)": 20, "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Seakart", "Adult Price (AED)": "250+", "Kid Price (AED)": "N/A", "Infant Price (AED)": "N/A" },
  { "Emirate": "Dubai", "Attraction": "Ski Dubai", "Adult Price (AED)": 240, "Kid Price (AED)": 240, "Infant Price (AED)": "Free (under 2)" },
  { "Emirate": "Dubai", "Attraction": "Skydive Palm", "Adult Price (AED)": 2199, "Kid Price (AED)": "N/A (age 18+)", "Infant Price (AED)": "N/A" },
  { "Emirate": "Dubai", "Attraction": "Souk Madinat Jumeirah", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "Speedboats", "Adult Price (AED)": "150+", "Kid Price (AED)": "150+", "Infant Price (AED)": "Free (under 5)" },
  { "Emirate": "Dubai", "Attraction": "Spice Souk", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "The Beach JBR", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Dubai", "Attraction": "The Green Planet", "Adult Price (AED)": 150, "Kid Price (AED)": 150, "Infant Price (AED)": "Free (under 2)" },
  { "Emirate": "Dubai", "Attraction": "Topgolf", "Adult Price (AED)": "Varies (bay rental 200+/hr)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 6)" },
  { "Emirate": "Dubai", "Attraction": "Wild Wadi Waterpark", "Adult Price (AED)": 299, "Kid Price (AED)": "249 (under 1.1m)", "Infant Price (AED)": "Free (under 2)" },
  { "Emirate": "Dubai", "Attraction": "Wind Rises Sailing", "Adult Price (AED)": "Varies (200+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "XLine Zipline", "Adult Price (AED)": 650, "Kid Price (AED)": "N/A (age 12+)", "Infant Price (AED)": "N/A" },
  { "Emirate": "Dubai", "Attraction": "Xclusive Yachts", "Adult Price (AED)": "Varies (yacht rental 1000+/hr)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Dubai", "Attraction": "Zero Gravity", "Adult Price (AED)": "Beach club 100", "Kid Price (AED)": "50 (ages 5-17)", "Infant Price (AED)": "Free (under 5)" },

  // Fujairah
  { "Emirate": "Fujairah", "Attraction": "Ain al-Madhab Hot Springs", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Fujairah", "Attraction": "Al Aqah Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Fujairah", "Attraction": "Al Bidya Mosque", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Fujairah", "Attraction": "Dive & Snorkel Trips", "Adult Price (AED)": "Varies (150–300)", "Kid Price (AED)": "Varies (100–200)", "Infant Price (AED)": "Free (under 5)" },
  { "Emirate": "Fujairah", "Attraction": "Fujairah Museum", "Adult Price (AED)": 5, "Kid Price (AED)": "Free (under 10)", "Infant Price (AED)": "Free" },
  { "Emirate": "Fujairah", "Attraction": "Masafi Market", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Fujairah", "Attraction": "Sheikh Zayed Mosque - Fujairah", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Fujairah", "Attraction": "Umbrella Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Fujairah", "Attraction": "Wadi Wurayah National Park", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },

  // Multi-Emirate
  { "Emirate": "Multi", "Attraction": "Hot Air Ballooning", "Adult Price (AED)": 1100, "Kid Price (AED)": "995 (ages 5-11)", "Infant Price (AED)": "N/A (under 5)" },
  { "Emirate": "Multi", "Attraction": "Overnight Desert Glamping", "Adult Price (AED)": 1500, "Kid Price (AED)": 1200, "Infant Price (AED)": "Free (under 2)" },

  // Ras Al Khaimah
  { "Emirate": "Ras Al Khaimah", "Attraction": "Al Jazirah Al Hamra", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Ras Al Khaimah", "Attraction": "Dhayah Fort", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Ras Al Khaimah", "Attraction": "Equestrian Centre", "Adult Price (AED)": "Varies (riding 200+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "N/A" },
  { "Emirate": "Ras Al Khaimah", "Attraction": "Jais Sky Tour", "Adult Price (AED)": 299, "Kid Price (AED)": "199 (ages 10-16)", "Infant Price (AED)": "N/A (under 10)" },
  { "Emirate": "Ras Al Khaimah", "Attraction": "Jebel Jais Zipline", "Adult Price (AED)": 399, "Kid Price (AED)": "N/A (age 14+)", "Infant Price (AED)": "N/A" },
  { "Emirate": "Ras Al Khaimah", "Attraction": "National Museum of Ras Al Khaimah", "Adult Price (AED)": 5, "Kid Price (AED)": "Free (under 6)", "Infant Price (AED)": "Free" },
  { "Emirate": "Ras Al Khaimah", "Attraction": "Rising Sun Hot Air Balloon", "Adult Price (AED)": 995, "Kid Price (AED)": "895 (ages 5-11)", "Infant Price (AED)": "N/A (under 5)" },
  { "Emirate": "Ras Al Khaimah", "Attraction": "Suwaidi Pearls", "Adult Price (AED)": "Tours 200+", "Kid Price (AED)": "150+", "Infant Price (AED)": "Free (under 5)" },

  // Sharjah
  { "Emirate": "Sharjah", "Attraction": "Al Hisn Fort", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Sharjah", "Attraction": "Al Majaz Waterfront", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Sharjah", "Attraction": "Al Montazah Parks", "Adult Price (AED)": 120, "Kid Price (AED)": "99 (under 1.2m)", "Infant Price (AED)": "Free (under 0.8m)" },
  { "Emirate": "Sharjah", "Attraction": "Al Noor Island", "Adult Price (AED)": 50, "Kid Price (AED)": "25 (ages 3-12)", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Sharjah", "Attraction": "Arabian Wildlife Center", "Adult Price (AED)": 20, "Kid Price (AED)": "Free (under 12)", "Infant Price (AED)": "Free" },
  { "Emirate": "Sharjah", "Attraction": "Boat Tour", "Adult Price (AED)": "Varies (100+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Sharjah", "Attraction": "Central Souk (Blue Souk)", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "Sharjah", "Attraction": "Dune Buggy", "Adult Price (AED)": "Varies (200+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "N/A" },
  { "Emirate": "Sharjah", "Attraction": "Horse Riding", "Adult Price (AED)": "Varies (150+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "N/A" },
  { "Emirate": "Sharjah", "Attraction": "Mleiha Camping", "Adult Price (AED)": "Varies (300+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Sharjah", "Attraction": "Mleiha Stargazing", "Adult Price (AED)": "Varies (150+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Sharjah", "Attraction": "Mleiha Tours", "Adult Price (AED)": "Varies (100+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free (under 3)" },
  { "Emirate": "Sharjah", "Attraction": "Paragliding", "Adult Price (AED)": "Varies (400+)", "Kid Price (AED)": "N/A", "Infant Price (AED)": "N/A" },
  { "Emirate": "Sharjah", "Attraction": "Sharjah Classic Car Museum", "Adult Price (AED)": 10, "Kid Price (AED)": "Free (under 12)", "Infant Price (AED)": "Free" },
  { "Emirate": "Sharjah", "Attraction": "Sharjah Heritage Museum", "Adult Price (AED)": 10, "Kid Price (AED)": "Free (under 12)", "Infant Price (AED)": "Free" },
  { "Emirate": "Sharjah", "Attraction": "Sharjah Museum of Islamic Civilization", "Adult Price (AED)": 10, "Kid Price (AED)": "Free (under 12)", "Infant Price (AED)": "Free" },
  { "Emirate": "Sharjah", "Attraction": "Valley of the Caves", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },

  // UAQ (Umm Al Quwain)
  { "Emirate": "UAQ", "Attraction": "Al Sinniyah Island", "Adult Price (AED)": "Free (boat tours 100+)", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free" },
  { "Emirate": "UAQ", "Attraction": "Dreamland Aqua Park", "Adult Price (AED)": 150, "Kid Price (AED)": "100 (under 1.2m)", "Infant Price (AED)": "Free (under 0.9m)" },
  { "Emirate": "UAQ", "Attraction": "Falaj Al Mualla Fort", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "UAQ", "Attraction": "Kite Beach Center", "Adult Price (AED)": "Free; activities 50+", "Kid Price (AED)": "Varies", "Infant Price (AED)": "Free" },
  { "Emirate": "UAQ", "Attraction": "Mangrove Beach", "Adult Price (AED)": "Free", "Kid Price (AED)": "Free", "Infant Price (AED)": "Free" },
  { "Emirate": "UAQ", "Attraction": "Umm Al Quwain Fort and Museum", "Adult Price (AED)": 5, "Kid Price (AED)": "Free (under 12)", "Infant Price (AED)": "Free" }
]

async function updateComprehensiveAttractions() {
  try {
    console.log('🚀 Starting comprehensive attractions database update...')
    console.log(`📊 Processing ${attractionsData.length} attractions from all Emirates...`)
    
    // First, clear existing attractions
    console.log('🗑️ Clearing existing attractions...')
    
    // Get all records first, then delete them
    const { data: existingAttractions, error: fetchError } = await supabase
      .from('attractions')
      .select('id')
    
    if (fetchError) {
      console.error('❌ Error fetching existing attractions:', fetchError)
      return
    }
    
    if (existingAttractions && existingAttractions.length > 0) {
      console.log(`🗑️ Found ${existingAttractions.length} existing attractions to delete...`)
      
      // Delete all records using a simple condition that works for any ID type
      const { error: deleteError } = await supabase
        .from('attractions')
        .delete()
        .not('id', 'is', null) // Delete where id is not null (all records)
      
      if (deleteError) {
        console.error('❌ Error clearing attractions:', deleteError)
        return
      }
    }
    
    console.log('✅ Existing attractions cleared')
    
    // Process and insert new attractions data
    const processedAttractions = attractionsData
      .filter(item => item.Emirate && item.Attraction && item.Emirate !== '```') // Filter out invalid entries
      .map(item => {
        const adultPrice = extractPrice(item['Adult Price (AED)'])
        const kidPrice = extractPrice(item['Kid Price (AED)'])
        const infantPrice = extractPrice(item['Infant Price (AED)'])
        const imageUrl = getImageUrl(item.Attraction, item.Emirate)
        
        // Create a pricing summary for description field
        const pricingInfo = {
          adult: typeof item['Adult Price (AED)'] === 'string' ? item['Adult Price (AED)'] : `${adultPrice} AED`,
          child: typeof item['Kid Price (AED)'] === 'string' ? item['Kid Price (AED)'] : `${kidPrice} AED`,
          infant: typeof item['Infant Price (AED)'] === 'string' ? item['Infant Price (AED)'] : `${infantPrice} AED`
        }
        
        const description = `Adult: ${pricingInfo.adult} | Child: ${pricingInfo.child} | Infant: ${pricingInfo.infant}`
        
        return {
          name: item.Attraction,
          emirates: item.Emirate,
          price: adultPrice,
          image_url: imageUrl,
          description: description,
          category: getCategoryByName(item.Attraction),
          duration: getDurationByType(item.Attraction),
          is_active: true
        }
      })
    
    console.log(`📦 Processed ${processedAttractions.length} valid attractions`)
    
    // Insert in batches to avoid API limits
    const batchSize = 50
    let successCount = 0
    
    for (let i = 0; i < processedAttractions.length; i += batchSize) {
      const batch = processedAttractions.slice(i, i + batchSize)
      
      console.log(`📦 Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(processedAttractions.length/batchSize)} (${batch.length} attractions)...`)
      
      const { data, error } = await supabase
        .from('attractions')
        .insert(batch)
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error)
        console.error('First item in failed batch:', batch[0])
      } else {
        successCount += batch.length
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} inserted successfully`)
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`🎉 Database update completed! ${successCount}/${processedAttractions.length} attractions inserted.`)
    
    // Get summary statistics
    console.log('📊 Getting summary statistics...')
    const { data: summary, error: summaryError } = await supabase
      .from('attractions')
      .select('emirates, price, name')
    
    if (!summaryError && summary) {
      const byEmirate = summary.reduce((acc, item) => {
        if (!acc[item.emirates]) {
          acc[item.emirates] = { count: 0, totalPrice: 0, prices: [] }
        }
        acc[item.emirates].count++
        acc[item.emirates].totalPrice += item.price || 0
        acc[item.emirates].prices.push(item.price || 0)
        return acc
      }, {})
      
      console.log('\n📈 Summary by Emirate:')
      Object.entries(byEmirate).forEach(([emirate, stats]) => {
        const avgPrice = stats.totalPrice / stats.count
        const maxPrice = Math.max(...stats.prices)
        const minPrice = Math.min(...stats.prices)
        console.log(`${emirate}: ${stats.count} attractions, Avg: ${avgPrice.toFixed(0)} AED, Range: ${minPrice}-${maxPrice} AED`)
      })
      
      console.log(`\n🏆 Total attractions in database: ${summary.length}`)
      console.log('✅ All attractions data successfully updated with comprehensive pricing!')
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Helper function to categorize attractions
function getCategoryByName(attractionName) {
  const name = attractionName.toLowerCase()
  
  if (name.includes('beach') || name.includes('water') || name.includes('diving')) return 'Beach & Water Sports'
  if (name.includes('museum') || name.includes('heritage') || name.includes('historic')) return 'Cultural & Heritage'
  if (name.includes('desert') || name.includes('safari') || name.includes('camel')) return 'Desert & Adventure'
  if (name.includes('world') || name.includes('park') || name.includes('adventure')) return 'Theme Parks'
  if (name.includes('mall') || name.includes('souk') || name.includes('market')) return 'Shopping'
  if (name.includes('mosque') || name.includes('palace') || name.includes('fort')) return 'Religious & Historical'
  if (name.includes('zoo') || name.includes('wildlife') || name.includes('garden')) return 'Nature & Wildlife'
  if (name.includes('sky') || name.includes('balloon') || name.includes('zipline')) return 'Extreme Sports'
  
  return 'Entertainment'
}

// Helper function to estimate duration
function getDurationByType(attractionName) {
  const name = attractionName.toLowerCase()
  
  if (name.includes('safari') || name.includes('tour') || name.includes('trip')) return '4-8 hours'
  if (name.includes('world') || name.includes('park')) return 'Full day'
  if (name.includes('museum') || name.includes('palace')) return '2-3 hours'
  if (name.includes('beach') || name.includes('mall')) return '2-4 hours'
  if (name.includes('show') || name.includes('cruise')) return '1-2 hours'
  
  return '2-4 hours'
}

// Run the update
updateComprehensiveAttractions()
