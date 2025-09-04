// Simple test to check form submission from frontend
// Run this with: node testFormFlow.js

import { createClient } from '@supabase/supabase-js';

// Using your Supabase configuration
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simulate the exact data structure from TravelForm
const simulateFormSubmission = async () => {
  console.log('🔍 Testing Form Submission Flow\n');

  // This mimics exactly what TravelForm.tsx does
  const formData = {
    fullName: "John Frontend",
    phone: "+971501234567",
    email: "john.frontend@test.com",
    tripDuration: "7",
    journeyMonth: "March", 
    departureCountry: "United States",
    emirates: ["Dubai", "Abu Dhabi"],
    budget: "18,000-37,000",
    adults: 2,
    kids: 1,
    infants: 0
  };

  console.log('📝 Original Form Data:');
  console.log(JSON.stringify(formData, null, 2));

  // Transform to database format (exactly like TravelForm does)
  const submissionData = {
    full_name: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    trip_duration: parseInt(formData.tripDuration),
    journey_month: formData.journeyMonth,
    departure_country: formData.departureCountry,
    emirates: formData.emirates,
    budget: formData.budget || '',
    adults: formData.adults,
    kids: formData.kids || 0,
    infants: formData.infants || 0,
    submission_status: 'pending'
  };

  console.log('\n📊 Transformed Database Data:');
  console.log(JSON.stringify(submissionData, null, 2));

  try {
    // Attempt direct database insertion
    console.log('\n🔄 Inserting into database...');
    const { data, error } = await supabase
      .from('travel_submissions')
      .insert([submissionData])
      .select();

    if (error) {
      console.error('❌ Database Error:', error);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      return;
    }

    console.log('✅ Successfully inserted!');
    console.log('📊 Returned data:', data[0]);

    // Verify it appears in customer management query
    console.log('\n🔍 Testing Customer Management Query...');
    const { data: allSubmissions, error: fetchError } = await supabase
      .from('travel_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (fetchError) {
      console.error('❌ Fetch Error:', fetchError);
      return;
    }

    console.log(`✅ Found ${allSubmissions.length} submissions:`);
    allSubmissions.forEach((sub, index) => {
      console.log(`   ${index + 1}. ${sub.full_name} (${sub.email}) - ${sub.submission_status}`);
    });

    // Clean up test data
    console.log('\n🧹 Cleaning up...');
    await supabase
      .from('travel_submissions')
      .delete()
      .eq('email', 'john.frontend@test.com');
    console.log('✅ Cleanup complete');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
};

// Test what the Customer Management page sees
const testCustomerManagementQuery = async () => {
  console.log('\n🏪 Testing Customer Management Page Query\n');

  try {
    // This is exactly what CustomersManager.tsx does
    const { data, error } = await supabase
      .from('travel_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ CustomersManager Query Error:', error);
      return;
    }

    console.log('✅ Customer Management Query Success!');
    console.log(`📊 Found ${data.length} total submissions:`);
    
    if (data.length === 0) {
      console.log('   ⚠️  No submissions found - this explains why Customer Management shows empty');
    } else {
      data.forEach((submission, index) => {
        console.log(`   ${index + 1}. ${submission.full_name}`);
        console.log(`      Email: ${submission.email}`);
        console.log(`      Status: ${submission.submission_status}`);
        console.log(`      Created: ${new Date(submission.created_at).toLocaleString()}`);
        console.log(`      Total Travelers: ${submission.total_travelers}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('💥 Customer Management Query Error:', error);
  }
};

// Check if there are any permission or RLS issues
const testPermissions = async () => {
  console.log('\n🔐 Testing Database Permissions\n');

  // Test SELECT permissions
  try {
    const { data, error } = await supabase
      .from('travel_submissions')
      .select('count(*)')
      .single();

    if (error) {
      console.error('❌ SELECT permission error:', error);
    } else {
      console.log('✅ SELECT permissions working');
      console.log(`   Current record count: ${data.count}`);
    }
  } catch (error) {
    console.error('💥 SELECT test error:', error);
  }

  // Test INSERT permissions
  try {
    const testRecord = {
      full_name: 'Permission Test',
      phone: '+971555000000',
      email: 'permission.test@example.com',
      trip_duration: 3,
      journey_month: 'Test Month',
      departure_country: 'Test Country',
      emirates: ['Dubai'],
      budget: 'Test Budget',
      adults: 1,
      kids: 0,
      infants: 0,
      submission_status: 'pending'
    };

    const { data, error } = await supabase
      .from('travel_submissions')
      .insert([testRecord])
      .select();

    if (error) {
      console.error('❌ INSERT permission error:', error);
    } else {
      console.log('✅ INSERT permissions working');
      
      // Clean up
      await supabase
        .from('travel_submissions')
        .delete()
        .eq('email', 'permission.test@example.com');
      console.log('✅ Cleanup completed');
    }
  } catch (error) {
    console.error('💥 INSERT test error:', error);
  }
};

// Run all tests
const runAllTests = async () => {
  await testCustomerManagementQuery();
  await testPermissions();
  await simulateFormSubmission();
};

runAllTests();
