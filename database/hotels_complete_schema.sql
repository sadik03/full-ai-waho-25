-- Complete Hotels Database Schema for UAE Travel Application
-- This schema supports all features used in HotelsManager.tsx component

-- Create Hotels Table with all required fields
CREATE TABLE IF NOT EXISTS hotels (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL UNIQUE,
  stars INTEGER DEFAULT 5 CHECK (stars >= 1 AND stars <= 7),
  price_range_min DECIMAL(10,2) DEFAULT 0,
  price_range_max DECIMAL(10,2) DEFAULT 0,
  category VARCHAR(100),
  star_category VARCHAR(100), -- 3-Star, 4-Star, 5-Star Standard, 5-Star Premium, 5-Star Luxury, 7-Star
  location VARCHAR(200) DEFAULT 'UAE',
  image_url TEXT,
  amenities TEXT[], -- Array of amenities like WiFi, Pool, Spa, Gym
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_name ON hotels(name);
CREATE INDEX IF NOT EXISTS idx_hotels_stars ON hotels(stars);
CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(location);
CREATE INDEX IF NOT EXISTS idx_hotels_price_range ON hotels(price_range_min, price_range_max);
CREATE INDEX IF NOT EXISTS idx_hotels_star_category ON hotels(star_category);
CREATE INDEX IF NOT EXISTS idx_hotels_is_active ON hotels(is_active);
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON hotels(created_at);

-- Enable Row Level Security
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for CRUD operations
-- Read policy - allow public read access to active hotels
DROP POLICY IF EXISTS "Allow public read access to hotels" ON hotels;
CREATE POLICY "Allow public read access to hotels" ON hotels
    FOR SELECT USING (is_active = true);

-- Insert policy - allow public insert access
DROP POLICY IF EXISTS "Allow public insert access to hotels" ON hotels;
CREATE POLICY "Allow public insert access to hotels" ON hotels
    FOR INSERT WITH CHECK (true);

-- Update policy - allow public update access
DROP POLICY IF EXISTS "Allow public update access to hotels" ON hotels;
CREATE POLICY "Allow public update access to hotels" ON hotels
    FOR UPDATE USING (true);

-- Delete policy - allow public delete access (soft delete by setting is_active = false)
DROP POLICY IF EXISTS "Allow public delete access to hotels" ON hotels;
CREATE POLICY "Allow public delete access to hotels" ON hotels
    FOR DELETE USING (true);

-- Create or replace function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_hotels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS update_hotels_updated_at ON hotels;
CREATE TRIGGER update_hotels_updated_at 
    BEFORE UPDATE ON hotels
    FOR EACH ROW 
    EXECUTE FUNCTION update_hotels_updated_at();

-- Insert comprehensive sample hotel data matching the HotelsManager component
INSERT INTO hotels (
    name, stars, price_range_min, price_range_max, category, star_category, 
    location, image_url, amenities, description, is_active
) VALUES 
-- 3-Star Hotels
(
    'Comfort Inn Dubai Marina', 3, 147, 294, 'Budget Comfort', '3-Star',
    'Dubai Marina, UAE', 
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Air Conditioning', '24/7 Reception', 'Room Service'],
    'Comfortable accommodation with essential amenities in the heart of Dubai Marina',
    true
),
(
    'City Center Hotel Sharjah', 3, 120, 250, 'Budget Comfort', '3-Star',
    'Sharjah, UAE',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Parking', 'Restaurant', 'Laundry'],
    'Affordable comfort in Sharjah city center with modern amenities',
    true
),

-- 4-Star Hotels
(
    'Smart Hotel Premium Dubai', 4, 220, 551, 'Smart Premium', '4-Star',
    'Downtown Dubai, UAE',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar'],
    'Premium comfort with enhanced services and modern facilities in Downtown Dubai',
    true
),
(
    'Business Plaza Abu Dhabi', 4, 200, 480, 'Business Premium', '4-Star',
    'Abu Dhabi, UAE',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Business Center', 'Meeting Rooms', 'Gym', 'Restaurant'],
    'Ideal for business travelers with comprehensive meeting facilities',
    true
),

-- 5-Star Standard Hotels
(
    'Grand Palace Classic Dubai', 5, 918, 1285, 'Classic Premium', '5-Star Standard',
    'Palm Jumeirah, UAE',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Pool', 'Spa', 'Gym', 'Multiple Restaurants', 'Beach Access', 'Concierge'],
    'Luxury accommodation with world-class amenities on the iconic Palm Jumeirah',
    true
),
(
    'Royal Suites Abu Dhabi', 5, 850, 1200, 'Royal Comfort', '5-Star Standard',
    'Abu Dhabi Corniche, UAE',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Pool', 'Spa', 'Gym', 'Fine Dining', 'Butler Service', 'Beach Access'],
    'Royal treatment with stunning Corniche views and premium amenities',
    true
),

-- 5-Star Premium Hotels
(
    'Exclusive Resort Dubai', 5, 1000, 2000, 'Exclusive Comfort', '5-Star Premium',
    'Jumeirah Beach, UAE',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Private Beach', 'Multiple Pools', 'World-Class Spa', 'Fine Dining', 'Butler Service', 'Golf Course'],
    'Premium luxury with exclusive comfort and personalized service on Jumeirah Beach',
    true
),
(
    'Desert Oasis Premium Resort', 5, 950, 1800, 'Desert Luxury', '5-Star Premium',
    'Al Ain, UAE',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Desert Safari', 'Spa', 'Pool', 'Fine Dining', 'Camel Riding', 'Stargazing'],
    'Unique desert luxury experience with traditional Emirati hospitality',
    true
),

-- 5-Star Luxury Hotels
(
    'Grand Luxury Palace Dubai', 5, 2000, 4500, 'Grand Luxury', '5-Star Luxury',
    'Burj Khalifa District, UAE',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Private Butler', 'Helicopter Pad', 'Michelin Star Dining', 'Private Pool', 'Yacht Charter', 'Shopping Concierge'],
    'Ultimate luxury with personalized butler service and premium amenities near Burj Khalifa',
    true
),
(
    'Platinum Towers Abu Dhabi', 5, 1800, 4000, 'Platinum Elite', '5-Star Luxury',
    'Emirates Palace Area, UAE',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Private Butler', 'Spa Suite', 'Private Dining', 'Yacht Access', 'Helicopter Tours', 'Personal Shopper'],
    'Platinum-level luxury with exclusive privileges and world-class service',
    true
),

-- 7-Star Ultra Luxury Hotels
(
    'Ultra Elite Collection Dubai', 7, 4500, 25708, 'Ultra Luxury', '7-Star',
    'Burj Al Arab Area, UAE',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Personal Butler', 'Private Jet Access', 'Michelin Star Chefs', 'Private Island', 'Yacht Fleet', 'Diamond Concierge', 'Royal Suite'],
    'Ultra-luxury experience with unparalleled service and exclusive privileges',
    true
),
(
    'Royal Emirates Ultra Palace', 7, 5000, 30000, 'Royal Ultra', '7-Star',
    'Private Island, UAE',
    'https://images.unsplash.com/photo-1549294413-26f195200c16?w=400&h=250&fit=crop',
    ARRAY['WiFi', 'Royal Butler', 'Private Jet', 'Personal Chef', 'Private Beach', 'Yacht Collection', 'Helicopter Fleet', 'Diamond Service'],
    'Royal ultra-luxury on a private island with unprecedented service levels',
    true
)
ON CONFLICT (name) DO NOTHING;

-- Create a view for active hotels with calculated average price
CREATE OR REPLACE VIEW active_hotels_view AS
SELECT 
    id,
    name,
    stars,
    price_range_min,
    price_range_max,
    ROUND((price_range_min + price_range_max) / 2, 2) as avg_price,
    category,
    star_category,
    location,
    image_url,
    amenities,
    description,
    created_at,
    updated_at
FROM hotels 
WHERE is_active = true
ORDER BY stars DESC, avg_price ASC;

-- Create function to get hotels by star rating
CREATE OR REPLACE FUNCTION get_hotels_by_stars(star_rating INTEGER)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR(200),
    stars INTEGER,
    price_range_min DECIMAL(10,2),
    price_range_max DECIMAL(10,2),
    avg_price DECIMAL(10,2),
    category VARCHAR(100),
    star_category VARCHAR(100),
    location VARCHAR(200),
    image_url TEXT,
    amenities TEXT[],
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.id,
        h.name,
        h.stars,
        h.price_range_min,
        h.price_range_max,
        ROUND((h.price_range_min + h.price_range_max) / 2, 2) as avg_price,
        h.category,
        h.star_category,
        h.location,
        h.image_url,
        h.amenities,
        h.description
    FROM hotels h
    WHERE h.is_active = true AND h.stars = star_rating
    ORDER BY h.price_range_min ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to search hotels by name or location
CREATE OR REPLACE FUNCTION search_hotels(search_term TEXT)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR(200),
    stars INTEGER,
    price_range_min DECIMAL(10,2),
    price_range_max DECIMAL(10,2),
    category VARCHAR(100),
    star_category VARCHAR(100),
    location VARCHAR(200),
    image_url TEXT,
    amenities TEXT[],
    description TEXT,
    relevance_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.id,
        h.name,
        h.stars,
        h.price_range_min,
        h.price_range_max,
        h.category,
        h.star_category,
        h.location,
        h.image_url,
        h.amenities,
        h.description,
        CASE 
            WHEN LOWER(h.name) LIKE LOWER('%' || search_term || '%') THEN 3
            WHEN LOWER(h.location) LIKE LOWER('%' || search_term || '%') THEN 2
            WHEN LOWER(h.description) LIKE LOWER('%' || search_term || '%') THEN 1
            ELSE 0
        END as relevance_score
    FROM hotels h
    WHERE h.is_active = true 
    AND (
        LOWER(h.name) LIKE LOWER('%' || search_term || '%') OR
        LOWER(h.location) LIKE LOWER('%' || search_term || '%') OR
        LOWER(h.description) LIKE LOWER('%' || search_term || '%')
    )
    ORDER BY relevance_score DESC, h.stars DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get hotel statistics
CREATE OR REPLACE FUNCTION get_hotel_statistics()
RETURNS TABLE (
    total_hotels BIGINT,
    avg_price DECIMAL(10,2),
    five_star_count BIGINT,
    unique_locations BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_hotels,
        ROUND(AVG((price_range_min + price_range_max) / 2), 2) as avg_price,
        COUNT(*) FILTER (WHERE stars = 5) as five_star_count,
        COUNT(DISTINCT location) as unique_locations
    FROM hotels
    WHERE is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your security requirements)
-- GRANT ALL ON hotels TO authenticated;
-- GRANT ALL ON hotels TO anon;

-- Example queries to test the schema:
/*
-- Get all active hotels
SELECT * FROM active_hotels_view;

-- Search for hotels in Dubai
SELECT * FROM search_hotels('Dubai');

-- Get all 5-star hotels
SELECT * FROM get_hotels_by_stars(5);

-- Get hotel statistics
SELECT * FROM get_hotel_statistics();

-- Get hotels with specific amenities
SELECT name, amenities FROM hotels 
WHERE 'Pool' = ANY(amenities) AND is_active = true;

-- Get hotels within price range
SELECT name, price_range_min, price_range_max FROM hotels 
WHERE price_range_min >= 500 AND price_range_max <= 2000 AND is_active = true
ORDER BY price_range_min;
*/
