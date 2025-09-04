import { createClient } from '@supabase/supabase-js';

// Script to inspect database schema
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDatabaseSchema() {
  console.log('🔍 Inspecting Database Schema...\n');

  try {
    // Check attractions table structure
    console.log('🎡 ATTRACTIONS TABLE:');
    const { data: attractionSample, error: attrError } = await supabase
      .from('attractions')
      .select('*')
      .limit(1);
    
    if (attrError) {
      console.error('❌ Error:', attrError.message);
    } else if (attractionSample && attractionSample[0]) {
      console.log('Available columns:', Object.keys(attractionSample[0]));
    }

    // Check hotels table structure
    console.log('\n🏨 HOTELS TABLE:');
    const { data: hotelSample, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .limit(1);
    
    if (hotelError) {
      console.error('❌ Error:', hotelError.message);
    } else if (hotelSample && hotelSample[0]) {
      console.log('Available columns:', Object.keys(hotelSample[0]));
    }

    // Check transports table structure
    console.log('\n🚗 TRANSPORTS TABLE:');
    const { data: transportSample, error: transportError } = await supabase
      .from('transports')
      .select('*')
      .limit(1);
    
    if (transportError) {
      console.error('❌ Error:', transportError.message);
    } else if (transportSample && transportSample[0]) {
      console.log('Available columns:', Object.keys(transportSample[0]));
    }

  } catch (error) {
    console.error('❌ Schema inspection failed:', error);
  }
}

inspectDatabaseSchema();
