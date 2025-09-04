// Test script to verify database connection and travel submissions
// Run this with: node testDatabaseConnection.js

import { createClient } from '@supabase/supabase-js';

// Using your Supabase configuration
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Test 1: Check if travel_submissions table exists and fetch data
    console.log('\n📊 Fetching travel submissions...');
    const { data, error } = await supabase
      .from('travel_submissions')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching data:', error.message);
      console.log('\n💡 This usually means:');
      console.log('   1. The travel_submissions table does not exist');
      console.log('   2. Run the SQL script in your Supabase SQL Editor first');
      console.log('   3. Check your Supabase URL and API key in .env file');
      return;
    }

    console.log('✅ Successfully connected to database!');
    console.log(`📈 Found ${data.length} travel submissions:`);
    
    if (data.length > 0) {
      data.forEach((submission, index) => {
        console.log(`\n${index + 1}. ${submission.full_name}`);
        console.log(`   Email: ${submission.email}`);
        console.log(`   Status: ${submission.submission_status}`);
        console.log(`   Travelers: ${submission.total_travelers}`);
        console.log(`   Created: ${new Date(submission.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('   No submissions found (table is empty but exists)');
    }

    // Test 2: Test insert capability
    console.log('\n🧪 Testing insert capability...');
    const testSubmission = {
      full_name: 'Test User',
      phone: '+1234567890',
      email: 'test@example.com',
      trip_duration: 5,
      journey_month: 'December',
      departure_country: 'Test Country',
      emirates: ['Dubai'],
      budget: '11,000-18,000',
      adults: 2,
      kids: 0,
      infants: 0
    };

    const { data: insertData, error: insertError } = await supabase
      .from('travel_submissions')
      .insert([testSubmission])
      .select();

    if (insertError) {
      console.error('❌ Error inserting test data:', insertError.message);
    } else {
      console.log('✅ Successfully inserted test submission!');
      console.log(`   ID: ${insertData[0].id}`);
      
      // Clean up test data
      await supabase
        .from('travel_submissions')
        .delete()
        .eq('email', 'test@example.com');
      console.log('🧹 Cleaned up test data');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Run the test
testDatabaseConnection();
