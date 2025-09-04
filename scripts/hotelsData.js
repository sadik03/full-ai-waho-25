import { supabase } from './supabaseClient.js'

// Hotels data from local file
export const hotelsData = [
  {
    "name": "3‑Star (Comfort Stay)",
    "stars": 3,
    "costPerNight": "147–294 AED",
    "category": "Comfort Stay",
    "ImageUrl": "https://i.imgur.com/J5p5H3m.jpeg",
    "description": "Comfortable accommodation with essential amenities"
  },
  {
    "name": "4‑Star (Smart Premium)", 
    "stars": 4,
    "costPerNight": "220–551 AED",
    "category": "Smart Premium",
    "ImageUrl": "https://i.imgur.com/GkQx44e.jpeg",
    "description": "Premium comfort with enhanced services and facilities"
  },
  {
    "name": "5‑Star Standard (Classic Premium)",
    "stars": 5,
    "costPerNight": "918–1,285 AED",
    "category": "Classic Premium",
    "ImageUrl": "https://i.imgur.com/k6wMv1P.jpeg",
    "description": "Premium luxury with world-class amenities and service"
  },
  {
    "name": "5‑Star Enhanced (Premium Luxury)",
    "stars": 5,
    "costPerNight": "1,000–2,000 AED",
    "category": "Premium Luxury",
    "ImageUrl": "https://i.imgur.com/j8n6z2W.jpeg",
    "description": "Enhanced luxury experience with exclusive facilities"
  },
  {
    "name": "6‑Star (Ultimate Luxury)",
    "stars": 6,
    "costPerNight": "2,000–4,500+ AED",
    "category": "Ultimate Luxury",
    "ImageUrl": "https://i.imgur.com/8M0pzzX.jpeg",
    "description": "Ultimate luxury with personalized butler service and premium suites"
  },
  {
    "name": "7‑Star (Elite Collection / Ultra Luxury)",
    "stars": 7,
    "costPerNight": "4,500–25,708+ AED",
    "category": "Elite Collection",
    "ImageUrl": "https://i.imgur.com/F2L9vHw.jpeg",
    "description": "Ultra-exclusive accommodation with unparalleled luxury and world-renowned service"
  }
]
