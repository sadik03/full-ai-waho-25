import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ziahkjoksxweikhbceda.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database table definitions
export type Attraction = {
  id?: string
  emirates: string
  attraction: string  // Actual database field name
  name?: string  // Optional legacy field
  price: number
  child_price?: number
  infant_price?: number
  duration?: string
  description?: string
  image_url: string
  category?: string
  rating?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export type Hotel = {
  id?: number
  name: string
  stars: number
  price_range_min?: number
  price_range_max?: number
  category?: string
  star_category?: string
  location?: string
  image_url: string
  description?: string
  created_at?: string
  updated_at?: string
}

export type Transport = {
  id?: number
  label: string
  cost_per_day: number
  type?: string
  description?: string
  image_url: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export type TravelSubmission = {
  id?: number
  full_name: string
  phone: string
  email: string
  trip_duration: number
  journey_month: string
  departure_country: string
  emirates: string[]
  budget?: string
  adults: number
  kids?: number
  infants?: number
  submission_status?: 'pending' | 'processing' | 'completed' | 'cancelled'
  notes?: string
  total_travelers?: number
  created_at?: string
  updated_at?: string
}

// Booking type for completed travel bookings
export type Booking = {
  id?: number
  full_name: string
  email: string
  phone: string
  country_code: string
  trip_duration: number
  journey_month: string
  departure_country: string
  emirates: string[]
  budget?: string
  adults: number
  kids?: number
  infants?: number
  total_travelers?: number
  package_title?: string
  package_description?: string
  itinerary_data?: any[]
  estimated_cost?: number
  price_range_min?: number
  price_range_max?: number
  booking_status?: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  download_count?: number
  special_requirements?: string
  notes?: string
  created_at?: string
  updated_at?: string
}
