-- Complete Transport Database Schema for UAE Travel Application
-- This schema supports all features used in TransportManager.tsx component

-- Create Transport Table with all required fields
CREATE TABLE IF NOT EXISTS transport (
  id BIGSERIAL PRIMARY KEY,
  label VARCHAR(200) NOT NULL UNIQUE,
  cost_per_day DECIMAL(10,2) NOT NULL DEFAULT 0,
  type VARCHAR(100), -- Car, Bus, Flight, Sedan, SUV, Coach, etc.
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transport_label ON transport(label);
CREATE INDEX IF NOT EXISTS idx_transport_type ON transport(type);
CREATE INDEX IF NOT EXISTS idx_transport_cost_per_day ON transport(cost_per_day);
CREATE INDEX IF NOT EXISTS idx_transport_is_active ON transport(is_active);
CREATE INDEX IF NOT EXISTS idx_transport_created_at ON transport(created_at);

-- Enable Row Level Security
ALTER TABLE transport ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for CRUD operations
-- Read policy - allow public read access to active transport
DROP POLICY IF EXISTS "Allow public read access to transport" ON transport;
CREATE POLICY "Allow public read access to transport" ON transport
    FOR SELECT USING (is_active = true);

-- Insert policy - allow public insert access
DROP POLICY IF EXISTS "Allow public insert access to transport" ON transport;
CREATE POLICY "Allow public insert access to transport" ON transport
    FOR INSERT WITH CHECK (true);

-- Update policy - allow public update access
DROP POLICY IF EXISTS "Allow public update access to transport" ON transport;
CREATE POLICY "Allow public update access to transport" ON transport
    FOR UPDATE USING (true);

-- Delete policy - allow public delete access
DROP POLICY IF EXISTS "Allow public delete access to transport" ON transport;
CREATE POLICY "Allow public delete access to transport" ON transport
    FOR DELETE USING (true);

-- Create or replace function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_transport_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS update_transport_updated_at ON transport;
CREATE TRIGGER update_transport_updated_at 
    BEFORE UPDATE ON transport
    FOR EACH ROW 
    EXECUTE FUNCTION update_transport_updated_at();

-- Insert comprehensive sample transport data matching the TransportManager component
INSERT INTO transport (
    label, cost_per_day, type, description, image_url, is_active
) VALUES 
-- Economy Cars
(
    'Economy Sedan', 120.00, 'Car',
    'Comfortable and fuel-efficient sedan perfect for city tours and short trips',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop',
    true
),
(
    'Compact Car', 100.00, 'Car',
    'Small and economical vehicle ideal for couples and solo travelers',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
    true
),

-- Premium Cars
(
    'Luxury Sedan', 250.00, 'Sedan',
    'Premium comfort with leather seats and advanced features for business travelers',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop',
    true
),
(
    'Executive SUV', 350.00, 'SUV',
    'Spacious luxury SUV with premium amenities for family trips and group travel',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
    true
),

-- Sports Cars
(
    'Sports Car Rental', 500.00, 'Car',
    'High-performance sports car for special occasions and luxury experiences',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
    true
),
(
    'Convertible', 450.00, 'Car',
    'Open-top driving experience perfect for coastal drives and scenic routes',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
    true
),

-- Group Transport
(
    'Mini Bus (12 Seater)', 300.00, 'Bus',
    'Comfortable mini bus perfect for small groups and family outings',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop',
    true
),
(
    'Tour Coach (25 Seater)', 500.00, 'Coach',
    'Large comfortable coach with air conditioning for group tours and excursions',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop',
    true
),
(
    'Luxury Coach (45 Seater)', 800.00, 'Coach',
    'Premium coach with reclining seats, entertainment system, and refreshments',
    'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=400&h=250&fit=crop',
    true
),

-- Specialized Vehicles
(
    'Desert Safari 4WD', 400.00, 'SUV',
    '4-wheel drive vehicle equipped for desert adventures and dune bashing',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop',
    true
),
(
    'Limousine Service', 600.00, 'Car',
    'Luxury limousine service for special events, weddings, and VIP transport',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
    true
),
(
    'Airport Transfer Van', 200.00, 'Van',
    'Spacious van service for airport transfers with luggage capacity',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop',
    true
),

-- Premium Services
(
    'Chauffeur Driven Mercedes', 700.00, 'Sedan',
    'Professional chauffeur service with luxury Mercedes-Benz vehicles',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop',
    true
),
(
    'BMW Executive Series', 650.00, 'Sedan',
    'Executive BMW series with premium features and professional driver',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
    true
),
(
    'Range Rover Experience', 750.00, 'SUV',
    'Luxury Range Rover for premium travel experience with all-terrain capability',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop',
    true
)
ON CONFLICT (label) DO NOTHING;

-- Create a view for active transport with calculated statistics
CREATE OR REPLACE VIEW active_transport_view AS
SELECT 
    id,
    label,
    cost_per_day,
    type,
    description,
    image_url,
    created_at,
    updated_at
FROM transport 
WHERE is_active = true
ORDER BY type ASC, cost_per_day ASC;

-- Create function to get transport by type
CREATE OR REPLACE FUNCTION get_transport_by_type(transport_type TEXT)
RETURNS TABLE (
    id BIGINT,
    label VARCHAR(200),
    cost_per_day DECIMAL(10,2),
    type VARCHAR(100),
    description TEXT,
    image_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.label,
        t.cost_per_day,
        t.type,
        t.description,
        t.image_url
    FROM transport t
    WHERE t.is_active = true 
    AND (transport_type IS NULL OR LOWER(t.type) = LOWER(transport_type))
    ORDER BY t.cost_per_day ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to search transport options
CREATE OR REPLACE FUNCTION search_transport(search_term TEXT)
RETURNS TABLE (
    id BIGINT,
    label VARCHAR(200),
    cost_per_day DECIMAL(10,2),
    type VARCHAR(100),
    description TEXT,
    image_url TEXT,
    relevance_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.label,
        t.cost_per_day,
        t.type,
        t.description,
        t.image_url,
        CASE 
            WHEN LOWER(t.label) LIKE LOWER('%' || search_term || '%') THEN 3
            WHEN LOWER(t.type) LIKE LOWER('%' || search_term || '%') THEN 2
            WHEN LOWER(t.description) LIKE LOWER('%' || search_term || '%') THEN 1
            ELSE 0
        END as relevance_score
    FROM transport t
    WHERE t.is_active = true 
    AND (
        LOWER(t.label) LIKE LOWER('%' || search_term || '%') OR
        LOWER(t.type) LIKE LOWER('%' || search_term || '%') OR
        LOWER(t.description) LIKE LOWER('%' || search_term || '%')
    )
    ORDER BY relevance_score DESC, t.cost_per_day ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get transport statistics
CREATE OR REPLACE FUNCTION get_transport_statistics()
RETURNS TABLE (
    total_options BIGINT,
    avg_cost_per_day DECIMAL(10,2),
    active_options BIGINT,
    vehicle_types BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_options,
        ROUND(AVG(cost_per_day), 2) as avg_cost_per_day,
        COUNT(*) FILTER (WHERE is_active = true) as active_options,
        COUNT(DISTINCT type) FILTER (WHERE type IS NOT NULL) as vehicle_types
    FROM transport;
END;
$$ LANGUAGE plpgsql;

-- Create function to get transport by price range
CREATE OR REPLACE FUNCTION get_transport_by_price_range(min_price DECIMAL, max_price DECIMAL)
RETURNS TABLE (
    id BIGINT,
    label VARCHAR(200),
    cost_per_day DECIMAL(10,2),
    type VARCHAR(100),
    description TEXT,
    image_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.label,
        t.cost_per_day,
        t.type,
        t.description,
        t.image_url
    FROM transport t
    WHERE t.is_active = true 
    AND t.cost_per_day >= min_price 
    AND t.cost_per_day <= max_price
    ORDER BY t.cost_per_day ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get cheapest transport by type
CREATE OR REPLACE FUNCTION get_cheapest_transport_by_type()
RETURNS TABLE (
    type VARCHAR(100),
    label VARCHAR(200),
    cost_per_day DECIMAL(10,2),
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (t.type)
        t.type,
        t.label,
        t.cost_per_day,
        t.description
    FROM transport t
    WHERE t.is_active = true AND t.type IS NOT NULL
    ORDER BY t.type, t.cost_per_day ASC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your security requirements)
-- GRANT ALL ON transport TO authenticated;
-- GRANT ALL ON transport TO anon;

-- Example queries to test the schema:
/*
-- Get all active transport options
SELECT * FROM active_transport_view;

-- Search for transport options
SELECT * FROM search_transport('luxury');

-- Get transport by type
SELECT * FROM get_transport_by_type('Car');

-- Get transport statistics
SELECT * FROM get_transport_statistics();

-- Get transport within price range
SELECT * FROM get_transport_by_price_range(100, 300);

-- Get cheapest option for each type
SELECT * FROM get_cheapest_transport_by_type();

-- Get transport options ordered by cost
SELECT label, cost_per_day, type FROM transport 
WHERE is_active = true 
ORDER BY cost_per_day ASC;

-- Get average cost by transport type
SELECT type, ROUND(AVG(cost_per_day), 2) as avg_cost, COUNT(*) as count
FROM transport 
WHERE is_active = true AND type IS NOT NULL
GROUP BY type 
ORDER BY avg_cost ASC;
*/
