-- Simple script to create just the travel_submissions table
-- Run this in your Supabase SQL Editor

-- Create Travel Form Submissions Table
CREATE TABLE IF NOT EXISTS travel_submissions (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  trip_duration INTEGER NOT NULL,
  journey_month VARCHAR(50) NOT NULL,
  departure_country VARCHAR(100) NOT NULL,
  emirates TEXT[] NOT NULL, -- Array of selected emirates
  budget VARCHAR(50),
  adults INTEGER NOT NULL DEFAULT 1,
  kids INTEGER DEFAULT 0,
  infants INTEGER DEFAULT 0,
  submission_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, cancelled
  notes TEXT,
  total_travelers INTEGER GENERATED ALWAYS AS (adults + COALESCE(kids, 0) + COALESCE(infants, 0)) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_travel_submissions_email ON travel_submissions(email);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_status ON travel_submissions(submission_status);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_created_at ON travel_submissions(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE travel_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (modify for production use)
CREATE POLICY "Allow public read access to travel_submissions" ON travel_submissions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to travel_submissions" ON travel_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to travel_submissions" ON travel_submissions
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to travel_submissions" ON travel_submissions
    FOR DELETE USING (true);

-- Update trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_travel_submissions_updated_at BEFORE UPDATE ON travel_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO travel_submissions (
  full_name, phone, email, trip_duration, journey_month, 
  departure_country, emirates, budget, adults, kids, infants
) VALUES 
(
  'John Smith', '+1234567890', 'john.smith@email.com', 
  7, 'December', 'United States', ARRAY['Dubai', 'Abu Dhabi'], 
  '18,000-37,000', 2, 1, 0
),
(
  'Sarah Johnson', '+44987654321', 'sarah.j@email.com', 
  5, 'January', 'United Kingdom', ARRAY['all'], 
  '11,000-18,000', 2, 0, 1
),
(
  'Ahmed Ali', '+971501234567', 'ahmed.ali@email.com', 
  3, 'March', 'India', ARRAY['Dubai', 'Sharjah'], 
  '7,000-11,000', 4, 2, 0
)
ON CONFLICT DO NOTHING;
