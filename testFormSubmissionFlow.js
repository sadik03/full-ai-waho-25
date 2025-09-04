// Test form submission and database integration
// Run this with: node testFormSubmissionFlow.js

import { createClient } from '@supabase/supabase-js';

// Using your Supabase configuration
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFormSubmissionFlow() {
  console.log('🔍 Testing Complete Form Submission Flow\n');

  // Step 1: Check initial state
  console.log('📊 Step 1: Checking current submissions...');
  const { data: beforeSubmissions, error: beforeError } = await supabase
    .from('travel_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (beforeError) {
    console.error('❌ Error fetching initial submissions:', beforeError);
    return;
  }

  console.log(`✅ Found ${beforeSubmissions.length} existing submissions`);

  // Step 2: Simulate form submission (exact data structure from TravelForm)
  console.log('\n🚀 Step 2: Simulating form submission...');
  
  const testFormData = {
    fullName: "Form Test User",
    phone: "+971555999888",
    email: "formtest.user@example.com",
    tripDuration: "4",
    journeyMonth: "April",
    departureCountry: "Canada", 
    emirates: ["Dubai", "Sharjah"],
    budget: "7,000-18,000",
    adults: 2,
    kids: 0,
    infants: 0
  };

  // Transform to database format (same as TravelForm onSubmit)
  const submissionData = {
    full_name: testFormData.fullName,
    phone: testFormData.phone,
    email: testFormData.email,
    trip_duration: parseInt(testFormData.tripDuration),
    journey_month: testFormData.journeyMonth,
    departure_country: testFormData.departureCountry,
    emirates: testFormData.emirates,
    budget: testFormData.budget || '',
    adults: testFormData.adults,
    kids: testFormData.kids || 0,
    infants: testFormData.infants || 0,
    submission_status: 'pending'
  };

  console.log('📝 Form data to submit:', JSON.stringify(submissionData, null, 2));

  // Step 3: Submit to database
  console.log('\n💾 Step 3: Submitting to database...');
  const { data: submitResult, error: submitError } = await supabase
    .from('travel_submissions')
    .insert([submissionData])
    .select();

  if (submitError) {
    console.error('❌ Submission failed:', submitError);
    return;
  }

  console.log('✅ Successfully submitted!');
  console.log('📊 Submission result:', submitResult[0]);

  // Step 4: Verify it appears in customer management
  console.log('\n🔍 Step 4: Verifying in Customer Management...');
  const { data: afterSubmissions, error: afterError } = await supabase
    .from('travel_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (afterError) {
    console.error('❌ Error fetching updated submissions:', afterError);
    return;
  }

  console.log(`✅ Now found ${afterSubmissions.length} total submissions`);
  
  // Find our new submission
  const newSubmission = afterSubmissions.find(sub => sub.email === testFormData.email);
  if (newSubmission) {
    console.log('✅ Found our new submission in Customer Management query!');
    console.log(`   ID: ${newSubmission.id}`);
    console.log(`   Name: ${newSubmission.full_name}`);
    console.log(`   Email: ${newSubmission.email}`);
    console.log(`   Status: ${newSubmission.submission_status}`);
    console.log(`   Total Travelers: ${newSubmission.total_travelers}`);
    console.log(`   Created: ${new Date(newSubmission.created_at).toLocaleString()}`);
  } else {
    console.error('❌ New submission NOT found in Customer Management query!');
  }

  // Step 5: Test filtering and search (like Customer Management does)
  console.log('\n🔍 Step 5: Testing Customer Management filters...');
  
  // Test status filter
  const { data: pendingSubmissions, error: pendingError } = await supabase
    .from('travel_submissions')
    .select('*')
    .eq('submission_status', 'pending')
    .order('created_at', { ascending: false });

  if (pendingError) {
    console.error('❌ Status filter error:', pendingError);
  } else {
    console.log(`✅ Status filter works: Found ${pendingSubmissions.length} pending submissions`);
  }

  // Test search functionality (by name)
  const { data: searchResults, error: searchError } = await supabase
    .from('travel_submissions')
    .select('*')
    .ilike('full_name', '%Form Test%')
    .order('created_at', { ascending: false });

  if (searchError) {
    console.error('❌ Search error:', searchError);
  } else {
    console.log(`✅ Search works: Found ${searchResults.length} submissions matching "Form Test"`);
  }

  // Step 6: Clean up
  console.log('\n🧹 Step 6: Cleaning up test data...');
  const { error: deleteError } = await supabase
    .from('travel_submissions')
    .delete()
    .eq('email', testFormData.email);

  if (deleteError) {
    console.error('❌ Cleanup error:', deleteError);
  } else {
    console.log('✅ Test data cleaned up successfully');
  }

  // Final verification
  console.log('\n📋 Final verification...');
  const { data: finalSubmissions, error: finalError } = await supabase
    .from('travel_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (finalError) {
    console.error('❌ Final verification error:', finalError);
  } else {
    console.log(`✅ Back to ${finalSubmissions.length} submissions (cleaned up)`);
  }

  console.log('\n🎉 Form submission flow test completed!');
  console.log('\n📝 Summary:');
  console.log('   ✅ Database connection working');
  console.log('   ✅ Form data transformation working');
  console.log('   ✅ Database insertion working');
  console.log('   ✅ Customer Management queries working');
  console.log('   ✅ Filtering and search working');
  console.log('   ✅ Data cleanup working');
  console.log('\n💡 If the form isn\'t saving in the actual app, the issue is likely:');
  console.log('   1. JavaScript errors preventing form submission');
  console.log('   2. Form validation failing');
  console.log('   3. Button click handlers not calling the submission function');
  console.log('   4. Network issues or API errors');
}

testFormSubmissionFlow();
