import { supabase } from './supabaseClient.js'

// Transport data from local file
export const transportData = [
  {
    "id": "basic",
    "label": "Basic Sedan",
    "costPerDay": 200,
    "ImageUrl": "https://i.imgur.com/Q2G4B1g.jpeg"
  },
  {
    "id": "mid",
    "label": "Mid Luxury Van",
    "costPerDay": 350,
    "ImageUrl": "https://i.imgur.com/c6E7v6b.jpeg"
  },
  {
    "id": "lux-suv",
    "label": "Luxury SUV",
    "costPerDay": 600,
    "ImageUrl": "https://i.imgur.com/e2h2v4a.jpeg"
  },
  {
    "id": "premium",
    "label": "Premium Luxury",
    "costPerDay": 1200,
    "ImageUrl": "https://i.imgur.com/z0j5k3E.jpeg"
  }
]
