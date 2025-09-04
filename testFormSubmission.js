// Test form submission to database
// Run this with: node testFormSubmission.js

import { createClient } from '@supabase/supabase-js';

// Using your Supabase configuration
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFormSubmission() {
  try {
    console.log('🧪 Testing travel form submission...');
    
    // Simulate a form submission like the TravelForm component does
    const formData = {
      full_name: 'Test User from Form',
      phone: '+1555123456',
      email: 'testuser@example.com',
      trip_duration: 5,
      journey_month: 'December',
      departure_country: 'United States',
      emirates: ['Dubai', 'Abu Dhabi'],
      budget: '11,000-18,000',
      adults: 2,
      kids: 1,
      infants: 0,
      submission_status: 'pending'
    };

    console.log('📝 Submitting form data:', formData);

    // Insert the data using the same method as TravelSubmissionService
    const { data, error } = await supabase
      .from('travel_submissions')
      .insert([formData])
      .select();

    if (error) {
      console.error('❌ Error submitting form:', error.message);
      return;
    }

    console.log('✅ Form submitted successfully!');
    console.log('📊 Submitted data:', data[0]);
    console.log(`🆔 New submission ID: ${data[0].id}`);
    console.log(`👥 Total travelers: ${data[0].total_travelers}`);
    console.log(`📅 Created at: ${new Date(data[0].created_at).toLocaleString()}`);

    // Now verify it shows up when fetching all submissions
    console.log('\n📋 Fetching all submissions to verify...');
    const { data: allSubmissions, error: fetchError } = await supabase
      .from('travel_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching submissions:', fetchError.message);
      return;
    }

    console.log(`✅ Total submissions in database: ${allSubmissions.length}`);
    console.log('\n📝 Recent submissions:');
    allSubmissions.slice(0, 5).forEach((submission, index) => {
      console.log(`${index + 1}. ${submission.full_name} (${submission.email}) - ${submission.submission_status}`);
    });

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await supabase
      .from('travel_submissions')
      .delete()
      .eq('email', 'testuser@example.com');
    console.log('✅ Test data cleaned up');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the test
testFormSubmission();
