import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o'

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to parse price text to number
function parsePrice(priceText) {
  if (!priceText || priceText === 'Free' || priceText === 'N/A') return 0
  if (typeof priceText === 'number') return priceText
  const match = String(priceText).match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

// Helper function to create pricing description
function createPricingDescription(adultPrice, kidPrice, infantPrice) {
  return `Adult: ${adultPrice === 0 ? 'Free' : adultPrice + ' AED'} | Child: ${kidPrice === 0 ? 'Free' : kidPrice + ' AED'} | Infant: ${infantPrice === 0 ? 'Free' : infantPrice + ' AED'}`
}

// Comprehensive UAE attractions data with all pricing information
const attractionsData = [
  // Abu Dhabi Attractions
  { emirates: 'Abu Dhabi', name: 'Abu Dhabi Heritage Village', price: 0, description: createPricingDescription(0, 0, 0), category: 'Cultural', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Buggy Tours', price: 250, description: createPricingDescription(250, 250, 0), category: 'Adventure', image_url: 'https://images.unsplash.com/photo-1544966503-7cc53c1396cc?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Camel Trekking', price: 250, description: createPricingDescription(250, 250, 0), category: 'Adventure', image_url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Caterham Driving', price: 300, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Corniche Beach', price: 0, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Corniche Boat', price: 75, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Emirates Palace', price: 50, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Etihad Towers', price: 95, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Evening Desert Safari', price: 250, image_url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Ferrari World', price: 345, image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Full Moon Kayak', price: 175, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Jubail Mangrove Park', price: 100, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Liwa Desert Safari', price: 400, image_url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Louvre Abu Dhabi', price: 63, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Louvre Kayak', price: 150, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Mangrove National Park', price: 50, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Qasr Al Hosn', price: 30, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Qasr Al Watan', price: 60, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Quad Bike Safari', price: 250, image_url: 'https://images.unsplash.com/photo-1544966503-7cc53c1396cc?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Reem Kayak Tour', price: 175, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Saadiyat Beach', price: 25, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Sheikh Zayed Grand Mosque', price: 0, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Sir Bani Yas Island', price: 250, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Warner Bros. World', price: 345, image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Wilderness Nature Tours', price: 300, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Yas Beach', price: 50, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Yas Marina Circuit', price: 150, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' },
  { emirates: 'Abu Dhabi', name: 'Yas Waterworld', price: 295, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },

  // Ajman Attractions
  { emirates: 'Ajman', name: 'Ajman Beach', price: 0, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Ajman', name: 'Ajman City Centre', price: 0, image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop' },
  { emirates: 'Ajman', name: 'Ajman Marina', price: 0, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Ajman', name: 'Ajman Museum', price: 5, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Ajman', name: 'Al Zorah Nature Reserve', price: 25, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },

  // Al Ain Attractions
  { emirates: 'Al Ain', name: 'Al Ain National Museum', price: 5, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Al Ain Oasis', price: 0, image_url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Al Ain Zoo', price: 30, image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Al Jahili Fort', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Green Mubazzarah', price: 0, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Hili Archaeological Park', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Jebel Hafeet', price: 0, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Qasr Al Muwaiji', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Sheikh Zayed Palace Museum (Qasr Al Ain)', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Al Ain', name: 'Wadi Adventure', price: 65, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },

  // Dubai Attractions (comprehensive list)
  { emirates: 'Dubai', name: 'Ain Dubai', price: 130, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Al Fahidi Historic District', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Al Mamzar Beach Park', price: 5, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Al Seef', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Atlantis Aquaventure', price: 329, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Atlantis The Palm', price: 100, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Balloon Flights', price: 995, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Burj Al Arab', price: 249, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Burj Khalifa', price: 169, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Crocodile Park', price: 95, image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Desert Safari', price: 250, image_url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dhow Cruises', price: 100, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dinner Cruises', price: 225, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dinner in the Sky', price: 699, image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dolphin & Seal Show', price: 105, image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Aquarium', price: 120, image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Autodrome', price: 200, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Butterfly Garden', price: 55, image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Canal', price: 25, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Creek', price: 1, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Dolphinarium', price: 50, image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Fountain', price: 0, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Frame', price: 50, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Garden Glow', price: 65, image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Gold Souk', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Ice Rink', price: 100, image_url: 'https://images.unsplash.com/photo-1544996972-3aacf8c0ec9d?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Mall', price: 0, image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Marina', price: 0, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Marina Yacht Tour', price: 150, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Miracle Garden', price: 95, image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Museum', price: 3, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Opera', price: 200, image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Parks and Resorts', price: 295, image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Dubai Safari Park', price: 50, image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Global Village', price: 25, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'IMG Worlds of Adventure', price: 365, image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Jet Ski', price: 300, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Jumeirah Beach', price: 0, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Jumeirah Mosque', price: 25, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Kite Beach', price: 0, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'La Mer', price: 0, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Legoland Dubai', price: 330, image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Museum of the Future', price: 149, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Palm Jumeirah', price: 0, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Ski Dubai', price: 240, image_url: 'https://images.unsplash.com/photo-1544996972-3aacf8c0ec9d?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Skydive Palm', price: 2199, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Spice Souk', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'The Green Planet', price: 150, image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'Wild Wadi Waterpark', price: 299, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Dubai', name: 'XLine Zipline', price: 650, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },

  // Fujairah Attractions
  { emirates: 'Fujairah', name: 'Al Aqah Beach', price: 0, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Fujairah', name: 'Al Bidya Mosque', price: 0, image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop' },
  { emirates: 'Fujairah', name: 'Dive & Snorkel Trips', price: 225, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'Fujairah', name: 'Fujairah Museum', price: 5, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Fujairah', name: 'Masafi Market', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Fujairah', name: 'Wadi Wurayah National Park', price: 0, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },

  // Ras Al Khaimah Attractions
  { emirates: 'Ras Al Khaimah', name: 'Al Jazirah Al Hamra', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Ras Al Khaimah', name: 'Dhayah Fort', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Ras Al Khaimah', name: 'Jais Sky Tour', price: 299, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
  { emirates: 'Ras Al Khaimah', name: 'Jebel Jais Zipline', price: 399, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
  { emirates: 'Ras Al Khaimah', name: 'Rising Sun Hot Air Balloon', price: 995, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },

  // Sharjah Attractions
  { emirates: 'Sharjah', name: 'Al Hisn Fort', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Sharjah', name: 'Al Majaz Waterfront', price: 0, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop' },
  { emirates: 'Sharjah', name: 'Al Montazah Parks', price: 120, image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop' },
  { emirates: 'Sharjah', name: 'Al Noor Island', price: 50, image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop' },
  { emirates: 'Sharjah', name: 'Arabian Wildlife Center', price: 20, image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop' },
  { emirates: 'Sharjah', name: 'Central Souk (Blue Souk)', price: 0, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
  { emirates: 'Sharjah', name: 'Sharjah Museum of Islamic Civilization', price: 10, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },

  // UAQ (Umm Al Quwain) Attractions
  { emirates: 'UAQ', name: 'Al Sinniyah Island', price: 50, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
  { emirates: 'UAQ', name: 'Dreamland Aqua Park', price: 150, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop' },
  { emirates: 'UAQ', name: 'Umm Al Quwain Fort and Museum', price: 5, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },

  // Multi-Emirate Attractions
  { emirates: 'Multi', name: 'Hot Air Ballooning', price: 1100, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
  { emirates: 'Multi', name: 'Overnight Desert Glamping', price: 1500, image_url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop' }
]

async function updateAttractionsDatabase() {
  try {
    console.log('🚀 Starting attractions database update...')
    
    // First, clear existing attractions
    console.log('🗑️ Clearing existing attractions...')
    const { error: deleteError } = await supabase
      .from('attractions')
      .delete()
      .neq('id', 0) // Delete all records
    
    if (deleteError) {
      console.error('❌ Error clearing attractions:', deleteError)
      return
    }
    
    console.log('✅ Existing attractions cleared')
    
    // Insert new attractions data in batches to avoid limits
    const batchSize = 50
    let successCount = 0
    
    for (let i = 0; i < attractionsData.length; i += batchSize) {
      const batch = attractionsData.slice(i, i + batchSize)
      
      console.log(`📦 Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(attractionsData.length/batchSize)} (${batch.length} attractions)...`)
      
      const { data, error } = await supabase
        .from('attractions')
        .insert(batch)
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error)
        console.error('Failed batch data:', batch.slice(0, 3)) // Show first 3 items of failed batch
      } else {
        successCount += batch.length
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} inserted successfully`)
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`🎉 Database update completed! ${successCount}/${attractionsData.length} attractions inserted.`)
    
    // Get summary statistics
    console.log('📊 Getting summary statistics...')
    const { data: summary, error: summaryError } = await supabase
      .from('attractions')
      .select('emirates, price')
    
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
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Run the update
updateAttractionsDatabase()
