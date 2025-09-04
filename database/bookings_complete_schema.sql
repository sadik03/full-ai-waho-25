-- Complete Bookings Database Schema for UAE Travel Application
-- This schema supports all features used in BookingsManager.tsx component

-- Create Bookings Table with all required fields
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  country_code VARCHAR(10) DEFAULT '+971',
  trip_duration INTEGER NOT NULL,
  journey_month VARCHAR(50) NOT NULL,
  departure_country VARCHAR(100) NOT NULL,
  emirates TEXT[] NOT NULL, -- Array of selected emirates
  budget VARCHAR(50),
  adults INTEGER NOT NULL DEFAULT 1,
  kids INTEGER DEFAULT 0,
  infants INTEGER DEFAULT 0,
  total_travelers INTEGER GENERATED ALWAYS AS (adults + COALESCE(kids, 0) + COALESCE(infants, 0)) STORED,
  package_title VARCHAR(300),
  package_description TEXT,
  itinerary_data JSONB, -- JSON array of itinerary details
  estimated_cost DECIMAL(12,2),
  price_range_min DECIMAL(12,2),
  price_range_max DECIMAL(12,2),
  booking_status VARCHAR(20) DEFAULT 'pending' CHECK (booking_status IN ('confirmed', 'pending', 'cancelled', 'completed')),
  download_count INTEGER DEFAULT 0,
  special_requirements TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_full_name ON bookings(full_name);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_departure_country ON bookings(departure_country);
CREATE INDEX IF NOT EXISTS idx_bookings_journey_month ON bookings(journey_month);
CREATE INDEX IF NOT EXISTS idx_bookings_estimated_cost ON bookings(estimated_cost);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_total_travelers ON bookings(total_travelers);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_duration ON bookings(trip_duration);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for CRUD operations
-- Read policy - allow public read access
DROP POLICY IF EXISTS "Allow public read access to bookings" ON bookings;
CREATE POLICY "Allow public read access to bookings" ON bookings
    FOR SELECT USING (true);

-- Insert policy - allow public insert access
DROP POLICY IF EXISTS "Allow public insert access to bookings" ON bookings;
CREATE POLICY "Allow public insert access to bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- Update policy - allow public update access
DROP POLICY IF EXISTS "Allow public update access to bookings" ON bookings;
CREATE POLICY "Allow public update access to bookings" ON bookings
    FOR UPDATE USING (true);

-- Delete policy - allow public delete access
DROP POLICY IF EXISTS "Allow public delete access to bookings" ON bookings;
CREATE POLICY "Allow public delete access to bookings" ON bookings
    FOR DELETE USING (true);

-- Create or replace function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings
    FOR EACH ROW 
    EXECUTE FUNCTION update_bookings_updated_at();

-- Insert comprehensive sample booking data matching the BookingsManager component
INSERT INTO bookings (
    full_name, email, phone, country_code, trip_duration, journey_month, 
    departure_country, emirates, budget, adults, kids, infants,
    package_title, package_description, itinerary_data, estimated_cost,
    price_range_min, price_range_max, booking_status, download_count,
    special_requirements, notes
) VALUES 
-- Confirmed Bookings
(
    'Ahmed Al Mansouri', 'ahmed.mansouri@email.com', '501234567', '+971', 
    7, 'December', 'United Arab Emirates', ARRAY['Dubai', 'Abu Dhabi'], 
    '18,000-37,000', 2, 1, 0,
    'Luxury UAE Discovery - 7 Days', 'Premium luxury experience across Dubai and Abu Dhabi with 5-star accommodations',
    '[
        {"day": 1, "title": "Arrival in Dubai", "description": "Airport transfer to Burj Al Arab, welcome dinner"},
        {"day": 2, "title": "Dubai City Tour", "description": "Burj Khalifa, Dubai Mall, Dubai Fountain"},
        {"day": 3, "title": "Desert Safari", "description": "Premium desert experience with BBQ dinner"},
        {"day": 4, "title": "Abu Dhabi Tour", "description": "Sheikh Zayed Mosque, Emirates Palace"},
        {"day": 5, "title": "Cultural Experience", "description": "Dubai Museum, Gold Souk, Spice Souk"},
        {"day": 6, "title": "Leisure Day", "description": "Beach activities, spa treatments"},
        {"day": 7, "title": "Departure", "description": "Shopping at Dubai Mall, airport transfer"}
    ]'::jsonb,
    25500.00, 18000.00, 37000.00, 'confirmed', 3,
    'Halal food required, wheelchair accessible rooms needed',
    'VIP customer - provide premium service'
),
(
    'Sarah Johnson', 'sarah.johnson@email.com', '447123456789', '+44', 
    5, 'January', 'United Kingdom', ARRAY['Dubai', 'Sharjah'], 
    '11,000-18,000', 2, 0, 1,
    'Family UAE Adventure - 5 Days', 'Family-friendly exploration of Dubai and Sharjah with cultural experiences',
    '[
        {"day": 1, "title": "Dubai Arrival", "description": "Hotel check-in, Dubai Marina walk"},
        {"day": 2, "title": "Dubai Attractions", "description": "Dubai Aquarium, Atlantis Aquaventure"},
        {"day": 3, "title": "Sharjah Cultural Tour", "description": "Sharjah Museum, Heritage Area"},
        {"day": 4, "title": "Dubai Parks", "description": "IMG Worlds of Adventure"},
        {"day": 5, "title": "Shopping & Departure", "description": "Dubai Mall shopping, departure"}
    ]'::jsonb,
    14500.00, 11000.00, 18000.00, 'confirmed', 2,
    'Baby stroller required, family rooms preferred',
    'First time visitors to UAE'
),

-- Pending Bookings
(
    'Michael Chen', 'michael.chen@email.com', '6591234567', '+65', 
    10, 'March', 'Singapore', ARRAY['all'], 
    '37,000-55,000', 4, 2, 0,
    'Complete UAE Experience - 10 Days', 'Comprehensive tour covering all seven emirates with luxury accommodations',
    '[
        {"day": 1, "title": "Dubai Arrival", "description": "Luxury hotel check-in, welcome dinner"},
        {"day": 2, "title": "Dubai Modern", "description": "Burj Khalifa, Dubai Mall, Marina"},
        {"day": 3, "title": "Dubai Traditional", "description": "Old Dubai, souks, creek cruise"},
        {"day": 4, "title": "Abu Dhabi", "description": "Sheikh Zayed Mosque, Louvre Abu Dhabi"},
        {"day": 5, "title": "Al Ain", "description": "Oasis city tour, Jebel Hafeet"},
        {"day": 6, "title": "Sharjah & Ajman", "description": "Cultural sites, beaches"},
        {"day": 7, "title": "Ras Al Khaimah", "description": "Jebel Jais, adventure activities"},
        {"day": 8, "title": "Fujairah", "description": "East coast beaches, snorkeling"},
        {"day": 9, "title": "Umm Al Quwain", "description": "Mangroves, water sports"},
        {"day": 10, "title": "Departure", "description": "Last-minute shopping, departure"}
    ]'::jsonb,
    45000.00, 37000.00, 55000.00, 'pending', 0,
    'Vegetarian meals, connecting rooms for families',
    'Group booking - corporate incentive trip'
),
(
    'Emma Rodriguez', 'emma.rodriguez@email.com', '34612345678', '+34', 
    4, 'February', 'Spain', ARRAY['Dubai'], 
    '7,000-11,000', 1, 0, 0,
    'Dubai Solo Explorer - 4 Days', 'Perfect solo travel experience in Dubai with guided tours and free time',
    '[
        {"day": 1, "title": "Arrival & City Overview", "description": "Airport transfer, Dubai Frame visit"},
        {"day": 2, "title": "Modern Dubai", "description": "Burj Khalifa, Dubai Mall, fountain show"},
        {"day": 3, "title": "Desert Adventure", "description": "Desert safari with cultural dinner"},
        {"day": 4, "title": "Shopping & Departure", "description": "Gold Souk, departure"}
    ]'::jsonb,
    8500.00, 7000.00, 11000.00, 'pending', 1,
    'Solo female traveler, prefer female guides when possible',
    'Photography enthusiast - interested in Instagram spots'
),

-- Completed Bookings
(
    'David Thompson', 'david.thompson@email.com', '12125551234', '+1', 
    6, 'November', 'United States', ARRAY['Dubai', 'Abu Dhabi'], 
    '18,000-37,000', 2, 0, 0,
    'Honeymoon UAE Special - 6 Days', 'Romantic honeymoon package with luxury experiences and couple activities',
    '[
        {"day": 1, "title": "Romantic Arrival", "description": "Private transfer, couples spa"},
        {"day": 2, "title": "Dubai Romance", "description": "Private yacht cruise, fine dining"},
        {"day": 3, "title": "Desert Romance", "description": "Private desert camp, stargazing"},
        {"day": 4, "title": "Abu Dhabi Luxury", "description": "Emirates Palace, private beach"},
        {"day": 5, "title": "Couple Activities", "description": "Hot air balloon, couples massage"},
        {"day": 6, "title": "Farewell", "description": "Shopping, romantic dinner, departure"}
    ]'::jsonb,
    28000.00, 18000.00, 37000.00, 'completed', 5,
    'Honeymoon couple, romantic setup preferred',
    'Celebrating 1st anniversary - provide special touches'
),
(
    'Priya Sharma', 'priya.sharma@email.com', '919876543210', '+91', 
    8, 'October', 'India', ARRAY['Dubai', 'Abu Dhabi', 'Sharjah'], 
    '11,000-18,000', 3, 1, 1,
    'Family Cultural Journey - 8 Days', 'Cultural and family-friendly exploration with educational experiences',
    '[
        {"day": 1, "title": "Welcome to UAE", "description": "Arrival, cultural orientation"},
        {"day": 2, "title": "Dubai Heritage", "description": "Dubai Museum, Heritage Village"},
        {"day": 3, "title": "Modern Marvels", "description": "Burj Khalifa, Dubai Aquarium"},
        {"day": 4, "title": "Abu Dhabi Culture", "description": "Sheikh Zayed Mosque, Heritage Village"},
        {"day": 5, "title": "Sharjah Arts", "description": "Art museums, cultural centers"},
        {"day": 6, "title": "Family Fun", "description": "Theme parks, beach activities"},
        {"day": 7, "title": "Desert Experience", "description": "Family desert safari"},
        {"day": 8, "title": "Departure", "description": "Souvenir shopping, departure"}
    ]'::jsonb,
    15500.00, 11000.00, 18000.00, 'completed', 4,
    'Vegetarian family, child-friendly activities required',
    'Educational focus for children, cultural immersion important'
),

-- Cancelled Booking
(
    'Robert Wilson', 'robert.wilson@email.com', '61412345678', '+61', 
    5, 'April', 'Australia', ARRAY['Dubai'], 
    '11,000-18,000', 2, 0, 0,
    'Dubai Business & Leisure - 5 Days', 'Combination of business meetings and leisure activities in Dubai',
    '[
        {"day": 1, "title": "Business Arrival", "description": "Airport transfer, business district tour"},
        {"day": 2, "title": "Business Meetings", "description": "DIFC meetings, networking dinner"},
        {"day": 3, "title": "Leisure Day", "description": "Dubai Mall, Burj Khalifa"},
        {"day": 4, "title": "Cultural Experience", "description": "Old Dubai, desert safari"},
        {"day": 5, "title": "Departure", "description": "Final meetings, departure"}
    ]'::jsonb,
    13500.00, 11000.00, 18000.00, 'cancelled', 0,
    'Business traveler, need meeting room facilities',
    'Cancelled due to business schedule conflict'
)
ON CONFLICT (email) DO NOTHING;

-- Create a view for active bookings with calculated statistics
CREATE OR REPLACE VIEW active_bookings_view AS
SELECT 
    id,
    full_name,
    email,
    phone,
    country_code,
    trip_duration,
    journey_month,
    departure_country,
    emirates,
    budget,
    adults,
    kids,
    infants,
    total_travelers,
    package_title,
    package_description,
    estimated_cost,
    booking_status,
    download_count,
    created_at,
    updated_at
FROM bookings 
WHERE booking_status != 'cancelled'
ORDER BY created_at DESC;

-- Create function to get bookings by status
CREATE OR REPLACE FUNCTION get_bookings_by_status(status_filter TEXT)
RETURNS TABLE (
    id BIGINT,
    full_name VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(20),
    package_title VARCHAR(300),
    estimated_cost DECIMAL(12,2),
    total_travelers INTEGER,
    booking_status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.full_name,
        b.email,
        b.phone,
        b.package_title,
        b.estimated_cost,
        b.total_travelers,
        b.booking_status,
        b.created_at
    FROM bookings b
    WHERE (status_filter = 'all' OR b.booking_status = status_filter)
    ORDER BY b.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to search bookings
CREATE OR REPLACE FUNCTION search_bookings(search_term TEXT)
RETURNS TABLE (
    id BIGINT,
    full_name VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(20),
    departure_country VARCHAR(100),
    package_title VARCHAR(300),
    estimated_cost DECIMAL(12,2),
    booking_status VARCHAR(20),
    relevance_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.full_name,
        b.email,
        b.phone,
        b.departure_country,
        b.package_title,
        b.estimated_cost,
        b.booking_status,
        CASE 
            WHEN LOWER(b.full_name) LIKE LOWER('%' || search_term || '%') THEN 4
            WHEN LOWER(b.email) LIKE LOWER('%' || search_term || '%') THEN 3
            WHEN b.phone LIKE '%' || search_term || '%' THEN 3
            WHEN LOWER(b.package_title) LIKE LOWER('%' || search_term || '%') THEN 2
            WHEN LOWER(b.departure_country) LIKE LOWER('%' || search_term || '%') THEN 1
            ELSE 0
        END as relevance_score
    FROM bookings b
    WHERE (
        LOWER(b.full_name) LIKE LOWER('%' || search_term || '%') OR
        LOWER(b.email) LIKE LOWER('%' || search_term || '%') OR
        b.phone LIKE '%' || search_term || '%' OR
        LOWER(b.departure_country) LIKE LOWER('%' || search_term || '%') OR
        LOWER(b.package_title) LIKE LOWER('%' || search_term || '%')
    )
    ORDER BY relevance_score DESC, b.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get booking statistics
CREATE OR REPLACE FUNCTION get_booking_statistics()
RETURNS TABLE (
    total_bookings BIGINT,
    pending_bookings BIGINT,
    confirmed_bookings BIGINT,
    completed_bookings BIGINT,
    cancelled_bookings BIGINT,
    total_revenue DECIMAL(12,2),
    total_travelers BIGINT,
    avg_booking_value DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE booking_status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE booking_status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE booking_status = 'completed') as completed_bookings,
        COUNT(*) FILTER (WHERE booking_status = 'cancelled') as cancelled_bookings,
        COALESCE(SUM(estimated_cost), 0) as total_revenue,
        COALESCE(SUM(total_travelers), 0) as total_travelers,
        COALESCE(ROUND(AVG(estimated_cost), 2), 0) as avg_booking_value
    FROM bookings;
END;
$$ LANGUAGE plpgsql;

-- Create function to get monthly booking trends
CREATE OR REPLACE FUNCTION get_monthly_booking_trends()
RETURNS TABLE (
    month_year TEXT,
    booking_count BIGINT,
    total_revenue DECIMAL(12,2),
    avg_travelers DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month_year,
        COUNT(*) as booking_count,
        COALESCE(SUM(estimated_cost), 0) as total_revenue,
        COALESCE(ROUND(AVG(total_travelers), 2), 0) as avg_travelers
    FROM bookings
    WHERE booking_status != 'cancelled'
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY month_year DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get popular destinations
CREATE OR REPLACE FUNCTION get_popular_destinations()
RETURNS TABLE (
    emirate TEXT,
    booking_count BIGINT,
    total_travelers BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        UNNEST(emirates) as emirate,
        COUNT(*) as booking_count,
        SUM(total_travelers) as total_travelers
    FROM bookings
    WHERE booking_status != 'cancelled'
    GROUP BY UNNEST(emirates)
    ORDER BY booking_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your security requirements)
-- GRANT ALL ON bookings TO authenticated;
-- GRANT ALL ON bookings TO anon;

-- Example queries to test the schema:
/*
-- Get all active bookings
SELECT * FROM active_bookings_view;

-- Search for bookings
SELECT * FROM search_bookings('Ahmed');

-- Get bookings by status
SELECT * FROM get_bookings_by_status('confirmed');

-- Get booking statistics
SELECT * FROM get_booking_statistics();

-- Get monthly trends
SELECT * FROM get_monthly_booking_trends();

-- Get popular destinations
SELECT * FROM get_popular_destinations();

-- Get bookings with high revenue
SELECT full_name, package_title, estimated_cost, booking_status 
FROM bookings 
WHERE estimated_cost > 20000 
ORDER BY estimated_cost DESC;

-- Get recent bookings
SELECT full_name, email, package_title, booking_status, created_at
FROM bookings 
ORDER BY created_at DESC 
LIMIT 10;

-- Get bookings by journey month
SELECT journey_month, COUNT(*) as count, AVG(estimated_cost) as avg_cost
FROM bookings 
WHERE booking_status != 'cancelled'
GROUP BY journey_month 
ORDER BY count DESC;
*/
