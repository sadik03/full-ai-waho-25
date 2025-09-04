-- Complete Attractions Database Schema for UAE Travel Application
-- This schema supports all features used in AttractionsManager.tsx component

-- Create Attractions Table with all required fields
CREATE TABLE IF NOT EXISTS attractions (
  id BIGSERIAL PRIMARY KEY,
  attraction VARCHAR(200) NOT NULL UNIQUE, -- Main attraction name (required field)
  name VARCHAR(200), -- Optional legacy field for compatibility
  emirates VARCHAR(100) NOT NULL, -- Location/Emirates (required)
  price DECIMAL(10,2) NOT NULL DEFAULT 0, -- Main price in AED
  child_price DECIMAL(10,2), -- Optional child pricing
  infant_price DECIMAL(10,2), -- Optional infant pricing
  duration VARCHAR(100), -- Duration like "2-3 hours", "Half day"
  description TEXT, -- Detailed description
  image_url TEXT, -- Image URL for the attraction
  category VARCHAR(100), -- Category like "Landmark", "Museum", "Adventure"
  rating DECIMAL(3,2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5), -- Rating out of 5
  is_active BOOLEAN DEFAULT true, -- Active status
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attractions_attraction ON attractions(attraction);
CREATE INDEX IF NOT EXISTS idx_attractions_emirates ON attractions(emirates);
CREATE INDEX IF NOT EXISTS idx_attractions_price ON attractions(price);
CREATE INDEX IF NOT EXISTS idx_attractions_category ON attractions(category);
CREATE INDEX IF NOT EXISTS idx_attractions_rating ON attractions(rating);
CREATE INDEX IF NOT EXISTS idx_attractions_is_active ON attractions(is_active);
CREATE INDEX IF NOT EXISTS idx_attractions_created_at ON attractions(created_at);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_attractions_emirates_active ON attractions(emirates, is_active);
CREATE INDEX IF NOT EXISTS idx_attractions_category_active ON attractions(category, is_active);
CREATE INDEX IF NOT EXISTS idx_attractions_price_range ON attractions(price, is_active) WHERE is_active = true;

-- Enable Row Level Security (RLS)
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for CRUD operations
-- Allow public read access to active attractions
CREATE POLICY "Allow public read access to attractions" ON attractions
  FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access to attractions" ON attractions
  FOR INSERT WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update access to attractions" ON attractions
  FOR UPDATE USING (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access to attractions" ON attractions
  FOR DELETE USING (true);

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_attractions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at updates
DROP TRIGGER IF EXISTS trigger_update_attractions_updated_at ON attractions;
CREATE TRIGGER trigger_update_attractions_updated_at
  BEFORE UPDATE ON attractions
  FOR EACH ROW
  EXECUTE FUNCTION update_attractions_updated_at();

-- Insert comprehensive attractions data
INSERT INTO attractions (emirates, attraction, price, child_price, infant_price, image_url) VALUES
-- Abu Dhabi Attractions
('Abu Dhabi', 'Abu Dhabi Heritage Village', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Buggy Tours', 250, 250, 0, 'https://images.unsplash.com/photo-1544966503-7cc53c1396cc?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Camel Trekking', 250, 200, 0, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Caterham Driving', 300, 250, 0, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Corniche Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Corniche Boat', 75, 75, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Emirates Palace', 50, 25, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Etihad Towers', 95, 50, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Evening Desert Safari', 250, 200, 0, 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Ferrari World', 345, 275, 0, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Full Moon Kayak', 175, 150, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Jubail Mangrove Park', 100, 50, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Liwa Desert Safari', 400, 350, 0, 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Louvre Abu Dhabi', 63, 31, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Louvre Kayak', 150, 120, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Mangrove National Park', 50, 25, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Qasr Al Hosn', 30, 15, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Qasr Al Watan', 60, 30, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Quad Bike Safari', 250, 200, 0, 'https://images.unsplash.com/photo-1544966503-7cc53c1396cc?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Reem Kayak Tour', 175, 150, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Saadiyat Beach', 25, 15, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Sheikh Zayed Grand Mosque', 0, 0, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Sir Bani Yas Island', 250, 200, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Warner Bros. World', 345, 275, 0, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Wilderness Nature Tours', 300, 250, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Yas Beach', 50, 25, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Yas Marina Circuit', 150, 100, 0, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'),
('Abu Dhabi', 'Yas Waterworld', 295, 235, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),

-- Ajman Attractions
('Ajman', 'Ajman Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Ajman', 'Ajman City Centre', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Ajman', 'Ajman Marina', 0, 0, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Ajman', 'Ajman Museum', 5, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Ajman', 'Al Zorah Nature Reserve', 25, 15, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),

-- Al Ain Attractions
('Al Ain', 'Al Ain National Museum', 5, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Al Ain', 'Al Ain Oasis', 0, 0, 0, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop'),
('Al Ain', 'Al Ain Zoo', 30, 10, 0, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'),
('Al Ain', 'Al Jahili Fort', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Al Ain', 'Green Mubazzarah', 0, 0, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Al Ain', 'Hili Archaeological Park', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Al Ain', 'Jebel Hafeet', 0, 0, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Al Ain', 'Qasr Al Muwaiji', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Al Ain', 'Sheikh Zayed Palace Museum (Qasr Al Ain)', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Al Ain', 'Wadi Adventure', 65, 45, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),

-- Dubai Attractions (Part 1)
('Dubai', 'Ain Dubai', 130, 100, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Al Barari Playground', 0, 0, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Dubai', 'Al Fahidi Historic District', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'Al Mamzar Beach Park', 5, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Dubai', 'Al Seef', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'Atlantis Aquaventure', 329, 299, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Atlantis The Palm', 100, 50, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Balloon Flights', 995, 895, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Dubai', 'Bla Bla Dubai', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Burj Al Arab', 249, 249, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Burj Khalifa', 169, 139, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Crocodile Park', 95, 50, 0, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'),
('Dubai', 'Desert Safari', 250, 250, 0, 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop'),
('Dubai', 'Dhow Cruises', 100, 100, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Dinner Cruises', 225, 225, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Dinner in the Sky', 699, 599, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dolphin & Seal Show', 105, 75, 0, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Aquarium', 120, 120, 0, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Autodrome', 200, 100, 0, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Butterfly Garden', 55, 55, 0, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Canal', 25, 0, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Creek', 1, 0, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Creek Harbour', 0, 0, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Design District', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Dolphinarium', 50, 30, 0, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Festival City', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Festival Plaza', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Fountain', 0, 0, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Frame', 50, 20, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Garden Glow', 65, 65, 0, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Gold Souk', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Healthcare City', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Hills Estate', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Ice Rink', 100, 100, 0, 'https://images.unsplash.com/photo-1544996972-3aacf8c0ec9d?w=800&h=600&fit=crop'),
('Dubai', 'Dubai International City', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Internet City', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Knowledge Park', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Mall', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Marina', 0, 0, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Marina Mall', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Marina Yacht Tour', 150, 150, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Media City', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Miracle Garden', 95, 80, 0, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Museum', 3, 1, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Opera', 200, 100, 50, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Outlet Mall', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Parks', 200, 200, 0, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Parks and Resorts', 295, 295, 0, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Safari Park', 50, 20, 0, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Silicon Oasis', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Sports City', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Water Canal', 0, 0, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Dubai World Trade Centre', 0, 0, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Etihad Museum', 25, 10, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'Fishing Trip', 400, 400, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Flyboard', 300, 0, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Global Village', 25, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'Horse Riding Dubai', 200, 200, 0, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop'),
('Dubai', 'IMG Worlds of Adventure', 365, 325, 0, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('Dubai', 'Jet Ski', 300, 0, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Jumeirah Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Dubai', 'Jumeirah Mosque', 25, 0, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Jumeirah Public Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Dubai', 'Kayak', 100, 100, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Kite Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Dubai', 'La Mer', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Dubai', 'La Mer Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Dubai', 'Legoland Dubai', 330, 330, 0, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('Dubai', 'Marina Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Dubai', 'Mega Yacht Dinner', 200, 200, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Miracle Garden (Main)', 95, 80, 0, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop'),
('Dubai', 'Motiongate', 330, 330, 0, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('Dubai', 'Musandam Tour', 250, 200, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Museum of the Future', 149, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'Palm Jumeirah', 0, 0, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Dubai', 'Pavilion Dive Centre', 400, 200, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Dubai Safari Park (Alternative)', 50, 20, 0, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'),
('Dubai', 'Seakart', 250, 0, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Ski Dubai', 240, 240, 0, 'https://images.unsplash.com/photo-1544996972-3aacf8c0ec9d?w=800&h=600&fit=crop'),
('Dubai', 'Skydive Palm', 2199, 0, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Dubai', 'Souk Madinat Jumeirah', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'Speedboats', 150, 150, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Spice Souk', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Dubai', 'The Beach JBR', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Dubai', 'The Green Planet', 150, 150, 0, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop'),
('Dubai', 'Topgolf', 200, 100, 0, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'),
('Dubai', 'Wild Wadi Waterpark', 299, 249, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Wind Rises Sailing', 200, 100, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'XLine Zipline', 650, 0, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Dubai', 'Xclusive Yachts', 1000, 500, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Dubai', 'Zero Gravity', 100, 50, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),

-- Fujairah Attractions
('Fujairah', 'Ain al-Madhab Hot Springs', 0, 0, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('Fujairah', 'Al Aqah Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Fujairah', 'Al Bidya Mosque', 0, 0, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Fujairah', 'Dive & Snorkel Trips', 225, 150, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Fujairah', 'Fujairah Museum', 5, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Fujairah', 'Masafi Market', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Fujairah', 'Sheikh Zayed Mosque - Fujairah', 0, 0, 0, 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop'),
('Fujairah', 'Umbrella Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Fujairah', 'Wadi Wurayah National Park', 0, 0, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),

-- Multi-Emirate Attractions
('Multi', 'Hot Air Ballooning', 1100, 995, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Multi', 'Overnight Desert Glamping', 1500, 1200, 0, 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop'),

-- Ras Al Khaimah Attractions
('Ras Al Khaimah', 'Al Jazirah Al Hamra', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Ras Al Khaimah', 'Dhayah Fort', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Ras Al Khaimah', 'Equestrian Centre', 200, 150, 0, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop'),
('Ras Al Khaimah', 'Jais Sky Tour', 299, 199, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Ras Al Khaimah', 'Jebel Jais Zipline', 399, 0, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Ras Al Khaimah', 'National Museum of Ras Al Khaimah', 5, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Ras Al Khaimah', 'Rising Sun Hot Air Balloon', 995, 895, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Ras Al Khaimah', 'Suwaidi Pearls', 200, 150, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),

-- Sharjah Attractions
('Sharjah', 'Al Hisn Fort', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Sharjah', 'Al Majaz Waterfront', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('Sharjah', 'Al Montazah Parks', 120, 99, 0, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('Sharjah', 'Al Noor Island', 50, 25, 0, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop'),
('Sharjah', 'Arabian Wildlife Center', 20, 0, 0, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'),
('Sharjah', 'Boat Tour', 100, 75, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('Sharjah', 'Central Souk (Blue Souk)', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Sharjah', 'Dune Buggy', 200, 150, 0, 'https://images.unsplash.com/photo-1544966503-7cc53c1396cc?w=800&h=600&fit=crop'),
('Sharjah', 'Horse Riding Sharjah', 150, 100, 0, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop'),
('Sharjah', 'Mleiha Camping', 300, 200, 0, 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=800&h=600&fit=crop'),
('Sharjah', 'Mleiha Stargazing', 150, 100, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Sharjah', 'Mleiha Tours', 100, 75, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Sharjah', 'Paragliding', 400, 0, 0, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'),
('Sharjah', 'Sharjah Classic Car Museum', 10, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Sharjah', 'Sharjah Heritage Museum', 10, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Sharjah', 'Sharjah Museum of Islamic Civilization', 10, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Sharjah', 'Valley of the Caves', 0, 0, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),

-- UAQ (Umm Al Quwain) Attractions
('UAQ', 'Al Sinniyah Island', 50, 25, 0, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'),
('UAQ', 'Dreamland Aqua Park', 150, 100, 0, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),
('UAQ', 'Falaj Al Mualla Fort', 0, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('UAQ', 'Kite Beach Center', 25, 15, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('UAQ', 'Mangrove Beach', 0, 0, 0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop'),
('UAQ', 'Umm Al Quwain Fort and Museum', 5, 0, 0, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop');

-- Create view for active attractions only
CREATE OR REPLACE VIEW active_attractions AS
SELECT * FROM attractions 
WHERE is_active = true
ORDER BY rating DESC, attraction ASC;

-- Function to get attractions by emirate
CREATE OR REPLACE FUNCTION get_attractions_by_emirate(emirate_name TEXT)
RETURNS TABLE (
  id BIGINT,
  attraction VARCHAR(200),
  emirates VARCHAR(100),
  price DECIMAL(10,2),
  child_price DECIMAL(10,2),
  infant_price DECIMAL(10,2),
  duration VARCHAR(100),
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  rating DECIMAL(3,2),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.attraction, a.emirates, a.price, a.child_price, a.infant_price, 
         a.duration, a.description, a.image_url, a.category, a.rating, a.is_active,
         a.created_at, a.updated_at
  FROM attractions a
  WHERE (emirate_name = 'All' OR a.emirates = emirate_name)
    AND a.is_active = true
  ORDER BY a.rating DESC, a.attraction ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to search attractions
CREATE OR REPLACE FUNCTION search_attractions(search_term TEXT)
RETURNS TABLE (
  id BIGINT,
  attraction VARCHAR(200),
  emirates VARCHAR(100),
  price DECIMAL(10,2),
  child_price DECIMAL(10,2),
  infant_price DECIMAL(10,2),
  duration VARCHAR(100),
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  rating DECIMAL(3,2),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  relevance_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.attraction, a.emirates, a.price, a.child_price, a.infant_price,
         a.duration, a.description, a.image_url, a.category, a.rating, a.is_active,
         a.created_at, a.updated_at,
         (
           CASE WHEN LOWER(a.attraction) LIKE LOWER('%' || search_term || '%') THEN 3 ELSE 0 END +
           CASE WHEN LOWER(a.emirates) LIKE LOWER('%' || search_term || '%') THEN 2 ELSE 0 END +
           CASE WHEN LOWER(a.description) LIKE LOWER('%' || search_term || '%') THEN 1 ELSE 0 END +
           CASE WHEN LOWER(a.category) LIKE LOWER('%' || search_term || '%') THEN 2 ELSE 0 END
         )::NUMERIC as relevance_score
  FROM attractions a
  WHERE a.is_active = true
    AND (
      LOWER(a.attraction) LIKE LOWER('%' || search_term || '%') OR
      LOWER(a.emirates) LIKE LOWER('%' || search_term || '%') OR
      LOWER(a.description) LIKE LOWER('%' || search_term || '%') OR
      LOWER(a.category) LIKE LOWER('%' || search_term || '%')
    )
  ORDER BY relevance_score DESC, a.rating DESC, a.attraction ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get attraction statistics
CREATE OR REPLACE FUNCTION get_attraction_statistics()
RETURNS TABLE (
  total_attractions BIGINT,
  active_attractions BIGINT,
  inactive_attractions BIGINT,
  total_emirates BIGINT,
  average_price DECIMAL(10,2),
  highest_rated_attraction VARCHAR(200),
  most_expensive_attraction VARCHAR(200),
  free_attractions BIGINT,
  paid_attractions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_attractions,
    COUNT(*) FILTER (WHERE is_active = true)::BIGINT as active_attractions,
    COUNT(*) FILTER (WHERE is_active = false)::BIGINT as inactive_attractions,
    COUNT(DISTINCT emirates)::BIGINT as total_emirates,
    ROUND(AVG(price) FILTER (WHERE price > 0), 2) as average_price,
    (SELECT attraction FROM attractions WHERE is_active = true ORDER BY rating DESC, attraction ASC LIMIT 1) as highest_rated_attraction,
    (SELECT attraction FROM attractions WHERE is_active = true ORDER BY price DESC, attraction ASC LIMIT 1) as most_expensive_attraction,
    COUNT(*) FILTER (WHERE price = 0 AND is_active = true)::BIGINT as free_attractions,
    COUNT(*) FILTER (WHERE price > 0 AND is_active = true)::BIGINT as paid_attractions
  FROM attractions;
END;
$$ LANGUAGE plpgsql;

-- Function to get attractions by category
CREATE OR REPLACE FUNCTION get_attractions_by_category(category_name TEXT DEFAULT NULL)
RETURNS TABLE (
  category VARCHAR(100),
  attraction_count BIGINT,
  average_price DECIMAL(10,2),
  average_rating DECIMAL(3,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.category,
    COUNT(*)::BIGINT as attraction_count,
    ROUND(AVG(a.price), 2) as average_price,
    ROUND(AVG(a.rating), 2) as average_rating,
    MIN(a.price) as min_price,
    MAX(a.price) as max_price
  FROM attractions a
  WHERE a.is_active = true
    AND (category_name IS NULL OR a.category = category_name)
    AND a.category IS NOT NULL
  GROUP BY a.category
  ORDER BY attraction_count DESC, a.category ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get attractions by price range
CREATE OR REPLACE FUNCTION get_attractions_by_price_range(
  min_price DECIMAL(10,2) DEFAULT 0,
  max_price DECIMAL(10,2) DEFAULT 999999
)
RETURNS TABLE (
  id BIGINT,
  attraction VARCHAR(200),
  emirates VARCHAR(100),
  price DECIMAL(10,2),
  child_price DECIMAL(10,2),
  infant_price DECIMAL(10,2),
  duration VARCHAR(100),
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  rating DECIMAL(3,2),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.attraction, a.emirates, a.price, a.child_price, a.infant_price,
         a.duration, a.description, a.image_url, a.category, a.rating, a.is_active,
         a.created_at, a.updated_at
  FROM attractions a
  WHERE a.is_active = true
    AND a.price >= min_price
    AND a.price <= max_price
  ORDER BY a.price ASC, a.rating DESC, a.attraction ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get popular attractions (top rated)
CREATE OR REPLACE FUNCTION get_popular_attractions(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id BIGINT,
  attraction VARCHAR(200),
  emirates VARCHAR(100),
  price DECIMAL(10,2),
  child_price DECIMAL(10,2),
  infant_price DECIMAL(10,2),
  duration VARCHAR(100),
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  rating DECIMAL(3,2),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.attraction, a.emirates, a.price, a.child_price, a.infant_price,
         a.duration, a.description, a.image_url, a.category, a.rating, a.is_active,
         a.created_at, a.updated_at
  FROM attractions a
  WHERE a.is_active = true
  ORDER BY a.rating DESC, a.attraction ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get emirates with attraction counts
CREATE OR REPLACE FUNCTION get_emirates_with_counts()
RETURNS TABLE (
  emirate VARCHAR(100),
  attraction_count BIGINT,
  average_price DECIMAL(10,2),
  average_rating DECIMAL(3,2),
  free_attractions BIGINT,
  paid_attractions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.emirates as emirate,
    COUNT(*)::BIGINT as attraction_count,
    ROUND(AVG(a.price), 2) as average_price,
    ROUND(AVG(a.rating), 2) as average_rating,
    COUNT(*) FILTER (WHERE a.price = 0)::BIGINT as free_attractions,
    COUNT(*) FILTER (WHERE a.price > 0)::BIGINT as paid_attractions
  FROM attractions a
  WHERE a.is_active = true
  GROUP BY a.emirates
  ORDER BY attraction_count DESC, a.emirates ASC;
END;
$$ LANGUAGE plpgsql;

-- Create indexes on computed columns for better performance
CREATE INDEX IF NOT EXISTS idx_attractions_search_name ON attractions USING gin(to_tsvector('english', attraction));
CREATE INDEX IF NOT EXISTS idx_attractions_search_description ON attractions USING gin(to_tsvector('english', COALESCE(description, '')));

-- Comments for documentation
COMMENT ON TABLE attractions IS 'Stores UAE tourist attractions and destinations with pricing, ratings, and details';
COMMENT ON COLUMN attractions.attraction IS 'Name of the tourist attraction (required, unique)';
COMMENT ON COLUMN attractions.name IS 'Legacy field for backward compatibility';
COMMENT ON COLUMN attractions.emirates IS 'Emirates/location where the attraction is located';
COMMENT ON COLUMN attractions.price IS 'Main admission price in AED';
COMMENT ON COLUMN attractions.child_price IS 'Child admission price in AED (optional)';
COMMENT ON COLUMN attractions.infant_price IS 'Infant admission price in AED (optional)';
COMMENT ON COLUMN attractions.duration IS 'Recommended visit duration (e.g., "2-3 hours", "Half day")';
COMMENT ON COLUMN attractions.description IS 'Detailed description of the attraction';
COMMENT ON COLUMN attractions.image_url IS 'URL to the attraction image';
COMMENT ON COLUMN attractions.category IS 'Category type (e.g., "Landmark", "Museum", "Adventure")';
COMMENT ON COLUMN attractions.rating IS 'User rating out of 5 stars';
COMMENT ON COLUMN attractions.is_active IS 'Whether the attraction is currently active/available';
