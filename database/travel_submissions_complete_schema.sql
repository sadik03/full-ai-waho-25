-- Complete Travel Submissions Database Schema for UAE Travel Application
-- This schema supports all features used in CustomersManager.tsx component

-- Create Travel Submissions Table with all required fields
CREATE TABLE IF NOT EXISTS travel_submissions (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  trip_duration INTEGER NOT NULL,
  journey_month VARCHAR(50) NOT NULL,
  departure_country VARCHAR(100) NOT NULL,
  emirates TEXT[] NOT NULL, -- Array of selected emirates
  budget VARCHAR(50),
  adults INTEGER NOT NULL DEFAULT 1,
  kids INTEGER DEFAULT 0,
  infants INTEGER DEFAULT 0,
  submission_status VARCHAR(20) DEFAULT 'pending' CHECK (submission_status IN ('pending', 'processing', 'completed', 'cancelled')),
  notes TEXT,
  total_travelers INTEGER GENERATED ALWAYS AS (adults + COALESCE(kids, 0) + COALESCE(infants, 0)) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_travel_submissions_email ON travel_submissions(email);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_phone ON travel_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_full_name ON travel_submissions(full_name);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_submission_status ON travel_submissions(submission_status);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_departure_country ON travel_submissions(departure_country);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_journey_month ON travel_submissions(journey_month);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_created_at ON travel_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_total_travelers ON travel_submissions(total_travelers);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_trip_duration ON travel_submissions(trip_duration);

-- Enable Row Level Security
ALTER TABLE travel_submissions ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for CRUD operations
-- Read policy - allow public read access
DROP POLICY IF EXISTS "Allow public read access to travel_submissions" ON travel_submissions;
CREATE POLICY "Allow public read access to travel_submissions" ON travel_submissions
    FOR SELECT USING (true);

-- Insert policy - allow public insert access
DROP POLICY IF EXISTS "Allow public insert access to travel_submissions" ON travel_submissions;
CREATE POLICY "Allow public insert access to travel_submissions" ON travel_submissions
    FOR INSERT WITH CHECK (true);

-- Update policy - allow public update access
DROP POLICY IF EXISTS "Allow public update access to travel_submissions" ON travel_submissions;
CREATE POLICY "Allow public update access to travel_submissions" ON travel_submissions
    FOR UPDATE USING (true);

-- Delete policy - allow public delete access
DROP POLICY IF EXISTS "Allow public delete access to travel_submissions" ON travel_submissions;
CREATE POLICY "Allow public delete access to travel_submissions" ON travel_submissions
    FOR DELETE USING (true);

-- Create or replace function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_travel_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS update_travel_submissions_updated_at ON travel_submissions;
CREATE TRIGGER update_travel_submissions_updated_at 
    BEFORE UPDATE ON travel_submissions
    FOR EACH ROW 
    EXECUTE FUNCTION update_travel_submissions_updated_at();

-- Insert comprehensive sample travel submission data matching the CustomersManager component
INSERT INTO travel_submissions (
    full_name, phone, email, trip_duration, journey_month, departure_country, 
    emirates, budget, adults, kids, infants, submission_status, notes
) VALUES 
-- Pending Submissions
(
    'Ahmed Al Mansouri', '+971501234567', 'ahmed.mansouri@email.com', 
    7, 'December', 'United Arab Emirates', ARRAY['Dubai', 'Abu Dhabi'], 
    '18,000-37,000', 2, 1, 0, 'pending',
    'Looking for luxury accommodations with cultural experiences'
),
(
    'Sarah Johnson', '+447123456789', 'sarah.johnson@email.com', 
    5, 'January', 'United Kingdom', ARRAY['Dubai', 'Sharjah'], 
    '11,000-18,000', 2, 0, 1, 'pending',
    'Family trip with infant, need baby-friendly facilities'
),
(
    'Michael Chen', '+6591234567', 'michael.chen@email.com', 
    10, 'March', 'Singapore', ARRAY['all'], 
    '37,000-55,000', 4, 2, 0, 'pending',
    'Corporate group booking, need meeting facilities and team activities'
),

-- Processing Submissions
(
    'Emma Rodriguez', '+34612345678', 'emma.rodriguez@email.com', 
    4, 'February', 'Spain', ARRAY['Dubai'], 
    '7,000-11,000', 1, 0, 0, 'processing',
    'Solo female traveler, interested in photography and cultural sites'
),
(
    'David Thompson', '+12125551234', 'david.thompson@email.com', 
    6, 'November', 'United States', ARRAY['Dubai', 'Abu Dhabi'], 
    '18,000-37,000', 2, 0, 0, 'processing',
    'Honeymoon trip, looking for romantic experiences and luxury'
),
(
    'Priya Sharma', '+919876543210', 'priya.sharma@email.com', 
    8, 'October', 'India', ARRAY['Dubai', 'Abu Dhabi', 'Sharjah'], 
    '11,000-18,000', 3, 1, 1, 'processing',
    'Family cultural journey, vegetarian meals required'
),

-- Completed Submissions
(
    'Robert Wilson', '+61412345678', 'robert.wilson@email.com', 
    5, 'September', 'Australia', ARRAY['Dubai'], 
    '11,000-18,000', 2, 0, 0, 'completed',
    'Business and leisure combination trip completed successfully'
),
(
    'Maria Garcia', '+525512345678', 'maria.garcia@email.com', 
    7, 'August', 'Mexico', ARRAY['Dubai', 'Abu Dhabi'], 
    '18,000-37,000', 3, 2, 0, 'completed',
    'Extended family vacation with cultural focus - excellent experience'
),
(
    'James Miller', '+14165551234', 'james.miller@email.com', 
    3, 'July', 'Canada', ARRAY['Dubai'], 
    '7,000-11,000', 1, 0, 0, 'completed',
    'Short business trip with leisure activities - very satisfied'
),

-- Cancelled Submissions
(
    'Lisa Anderson', '+4720123456', 'lisa.anderson@email.com', 
    6, 'April', 'Norway', ARRAY['Dubai', 'Abu Dhabi'], 
    '18,000-37,000', 2, 1, 0, 'cancelled',
    'Cancelled due to personal circumstances - will reschedule later'
),

-- Additional Recent Submissions
(
    'Yuki Tanaka', '+81312345678', 'yuki.tanaka@email.com', 
    9, 'May', 'Japan', ARRAY['all'], 
    '37,000-55,000', 2, 0, 0, 'pending',
    'Comprehensive UAE tour for anniversary celebration'
),
(
    'Hans Mueller', '+4930123456', 'hans.mueller@email.com', 
    4, 'June', 'Germany', ARRAY['Dubai'], 
    '11,000-18,000', 1, 0, 0, 'processing',
    'Architecture and engineering focused tour'
),
(
    'Sophie Dubois', '+33142345678', 'sophie.dubois@email.com', 
    5, 'March', 'France', ARRAY['Dubai', 'Abu Dhabi'], 
    '18,000-37,000', 2, 0, 0, 'pending',
    'Art and culture enthusiasts, interested in museums and galleries'
),
(
    'Carlos Silva', '+5511987654321', 'carlos.silva@email.com', 
    8, 'December', 'Brazil', ARRAY['Dubai', 'Abu Dhabi', 'Sharjah'], 
    '18,000-37,000', 4, 1, 0, 'processing',
    'Large family group, need connecting rooms and group activities'
),
(
    'Anna Kowalski', '+48221234567', 'anna.kowalski@email.com', 
    6, 'January', 'Poland', ARRAY['Dubai'], 
    '11,000-18,000', 2, 0, 0, 'completed',
    'Winter escape trip - exceeded expectations'
)
ON CONFLICT (email) DO NOTHING;

-- Create a view for active submissions with calculated statistics
CREATE OR REPLACE VIEW active_submissions_view AS
SELECT 
    id,
    full_name,
    phone,
    email,
    trip_duration,
    journey_month,
    departure_country,
    emirates,
    budget,
    adults,
    kids,
    infants,
    total_travelers,
    submission_status,
    notes,
    created_at,
    updated_at
FROM travel_submissions 
WHERE submission_status != 'cancelled'
ORDER BY created_at DESC;

-- Create function to get submissions by status
CREATE OR REPLACE FUNCTION get_submissions_by_status(status_filter TEXT)
RETURNS TABLE (
    id BIGINT,
    full_name VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(20),
    departure_country VARCHAR(100),
    trip_duration INTEGER,
    total_travelers INTEGER,
    submission_status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.full_name,
        s.email,
        s.phone,
        s.departure_country,
        s.trip_duration,
        s.total_travelers,
        s.submission_status,
        s.created_at
    FROM travel_submissions s
    WHERE (status_filter = 'all' OR s.submission_status = status_filter)
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to search submissions
CREATE OR REPLACE FUNCTION search_submissions(search_term TEXT)
RETURNS TABLE (
    id BIGINT,
    full_name VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(20),
    departure_country VARCHAR(100),
    submission_status VARCHAR(20),
    total_travelers INTEGER,
    relevance_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.full_name,
        s.email,
        s.phone,
        s.departure_country,
        s.submission_status,
        s.total_travelers,
        CASE 
            WHEN LOWER(s.full_name) LIKE LOWER('%' || search_term || '%') THEN 4
            WHEN LOWER(s.email) LIKE LOWER('%' || search_term || '%') THEN 3
            WHEN s.phone LIKE '%' || search_term || '%' THEN 3
            WHEN LOWER(s.departure_country) LIKE LOWER('%' || search_term || '%') THEN 2
            WHEN LOWER(s.notes) LIKE LOWER('%' || search_term || '%') THEN 1
            ELSE 0
        END as relevance_score
    FROM travel_submissions s
    WHERE (
        LOWER(s.full_name) LIKE LOWER('%' || search_term || '%') OR
        LOWER(s.email) LIKE LOWER('%' || search_term || '%') OR
        s.phone LIKE '%' || search_term || '%' OR
        LOWER(s.departure_country) LIKE LOWER('%' || search_term || '%') OR
        LOWER(s.notes) LIKE LOWER('%' || search_term || '%')
    )
    ORDER BY relevance_score DESC, s.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get submission statistics
CREATE OR REPLACE FUNCTION get_submission_statistics()
RETURNS TABLE (
    total_submissions BIGINT,
    pending_submissions BIGINT,
    processing_submissions BIGINT,
    completed_submissions BIGINT,
    cancelled_submissions BIGINT,
    total_travelers BIGINT,
    avg_trip_duration DECIMAL(10,2),
    avg_travelers_per_submission DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_submissions,
        COUNT(*) FILTER (WHERE submission_status = 'pending') as pending_submissions,
        COUNT(*) FILTER (WHERE submission_status = 'processing') as processing_submissions,
        COUNT(*) FILTER (WHERE submission_status = 'completed') as completed_submissions,
        COUNT(*) FILTER (WHERE submission_status = 'cancelled') as cancelled_submissions,
        COALESCE(SUM(total_travelers), 0) as total_travelers,
        COALESCE(ROUND(AVG(trip_duration), 2), 0) as avg_trip_duration,
        COALESCE(ROUND(AVG(total_travelers), 2), 0) as avg_travelers_per_submission
    FROM travel_submissions;
END;
$$ LANGUAGE plpgsql;

-- Create function to get monthly submission trends
CREATE OR REPLACE FUNCTION get_monthly_submission_trends()
RETURNS TABLE (
    month_year TEXT,
    submission_count BIGINT,
    total_travelers BIGINT,
    avg_trip_duration DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month_year,
        COUNT(*) as submission_count,
        COALESCE(SUM(total_travelers), 0) as total_travelers,
        COALESCE(ROUND(AVG(trip_duration), 2), 0) as avg_trip_duration
    FROM travel_submissions
    WHERE submission_status != 'cancelled'
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY month_year DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get popular destinations from submissions
CREATE OR REPLACE FUNCTION get_popular_submission_destinations()
RETURNS TABLE (
    emirate TEXT,
    submission_count BIGINT,
    total_travelers BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        UNNEST(emirates) as emirate,
        COUNT(*) as submission_count,
        SUM(total_travelers) as total_travelers
    FROM travel_submissions
    WHERE submission_status != 'cancelled'
    GROUP BY UNNEST(emirates)
    ORDER BY submission_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get submissions by journey month
CREATE OR REPLACE FUNCTION get_submissions_by_journey_month()
RETURNS TABLE (
    journey_month VARCHAR(50),
    submission_count BIGINT,
    avg_travelers DECIMAL(10,2),
    avg_duration DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.journey_month,
        COUNT(*) as submission_count,
        COALESCE(ROUND(AVG(s.total_travelers), 2), 0) as avg_travelers,
        COALESCE(ROUND(AVG(s.trip_duration), 2), 0) as avg_duration
    FROM travel_submissions s
    WHERE s.submission_status != 'cancelled'
    GROUP BY s.journey_month
    ORDER BY submission_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get submissions by departure country
CREATE OR REPLACE FUNCTION get_submissions_by_country()
RETURNS TABLE (
    departure_country VARCHAR(100),
    submission_count BIGINT,
    total_travelers BIGINT,
    avg_trip_duration DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.departure_country,
        COUNT(*) as submission_count,
        SUM(s.total_travelers) as total_travelers,
        COALESCE(ROUND(AVG(s.trip_duration), 2), 0) as avg_trip_duration
    FROM travel_submissions s
    WHERE s.submission_status != 'cancelled'
    GROUP BY s.departure_country
    ORDER BY submission_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your security requirements)
-- GRANT ALL ON travel_submissions TO authenticated;
-- GRANT ALL ON travel_submissions TO anon;

-- Example queries to test the schema:
/*
-- Get all active submissions
SELECT * FROM active_submissions_view;

-- Search for submissions
SELECT * FROM search_submissions('Ahmed');

-- Get submissions by status
SELECT * FROM get_submissions_by_status('pending');

-- Get submission statistics
SELECT * FROM get_submission_statistics();

-- Get monthly trends
SELECT * FROM get_monthly_submission_trends();

-- Get popular destinations
SELECT * FROM get_popular_submission_destinations();

-- Get submissions by journey month
SELECT * FROM get_submissions_by_journey_month();

-- Get submissions by country
SELECT * FROM get_submissions_by_country();

-- Get recent submissions
SELECT full_name, email, departure_country, submission_status, created_at
FROM travel_submissions 
ORDER BY created_at DESC 
LIMIT 10;

-- Get submissions needing attention (pending/processing)
SELECT full_name, email, phone, submission_status, created_at
FROM travel_submissions 
WHERE submission_status IN ('pending', 'processing')
ORDER BY created_at ASC;
*/
