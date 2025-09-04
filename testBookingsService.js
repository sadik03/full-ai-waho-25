// Test script to verify bookings functionality
// Run this with: node testBookingsService.js

import { createClient } from '@supabase/supabase-js';

// Using your Supabase configuration
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBookingsService() {
  try {
    console.log('🏨 Testing Bookings Service...');
    
    // Test 1: Check if bookings table exists and fetch data
    console.log('\n📊 Fetching bookings...');
    const { data: bookings, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .limit(5);

    if (fetchError) {
      console.error('❌ Error fetching bookings:', fetchError.message);
      console.log('\n💡 This usually means:');
      console.log('   1. The bookings table does not exist');
      console.log('   2. Run the bookings_schema.sql in your Supabase SQL Editor first');
      return;
    }

    console.log('✅ Successfully connected to bookings table!');
    console.log(`📈 Found ${bookings.length} bookings:`);
    
    if (bookings.length > 0) {
      bookings.forEach((booking, index) => {
        console.log(`\n${index + 1}. ${booking.full_name}`);
        console.log(`   Email: ${booking.email}`);
        console.log(`   Package: ${booking.package_title}`);
        console.log(`   Status: ${booking.booking_status}`);
        console.log(`   Travelers: ${booking.total_travelers}`);
        console.log(`   Cost: AED ${booking.estimated_cost}`);
        console.log(`   Downloads: ${booking.download_count}`);
        console.log(`   Created: ${new Date(booking.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('   No bookings found (table is empty but exists)');
    }

    // Test 2: Test insert capability (simulate Summary page booking)
    console.log('\n🧪 Testing booking insertion...');
    const testBooking = {
      full_name: 'Test Customer',
      email: 'test.customer@example.com',
      phone: '555123456',
      country_code: '+1',
      trip_duration: 7,
      journey_month: 'March',
      departure_country: 'United States',
      emirates: ['Dubai', 'Abu Dhabi'],
      budget: '18,000-37,000',
      adults: 2,
      kids: 1,
      infants: 0,
      package_title: 'Test UAE Adventure',
      package_description: 'A wonderful test package for Dubai and Abu Dhabi',
      itinerary_data: [
        {
          id: 'day1',
          day: 1,
          title: 'Arrival in Dubai',
          description: 'Welcome to Dubai!',
          attractions: [{ name: 'Dubai Mall', price: 0 }],
          hotel: 'Test Hotel',
          transport: 'Private Car'
        }
      ],
      estimated_cost: 4500,
      price_range_min: 3500,
      price_range_max: 6000,
      booking_status: 'confirmed',
      download_count: 1
    };

    console.log('📝 Inserting test booking...');

    const { data: insertData, error: insertError } = await supabase
      .from('bookings')
      .insert([testBooking])
      .select();

    if (insertError) {
      console.error('❌ Error inserting booking:', insertError.message);
    } else {
      console.log('✅ Successfully inserted test booking!');
      console.log(`   ID: ${insertData[0].id}`);
      console.log(`   Total Travelers: ${insertData[0].total_travelers}`);
      
      // Test 3: Test update capability
      console.log('\n🔄 Testing booking update...');
      const { data: updateData, error: updateError } = await supabase
        .from('bookings')
        .update({ booking_status: 'completed', download_count: 2 })
        .eq('id', insertData[0].id)
        .select();

      if (updateError) {
        console.error('❌ Error updating booking:', updateError.message);
      } else {
        console.log('✅ Successfully updated booking status!');
        console.log(`   New Status: ${updateData[0].booking_status}`);
        console.log(`   Download Count: ${updateData[0].download_count}`);
      }

      // Test 4: Test status filtering
      console.log('\n🔍 Testing status filtering...');
      const { data: confirmedBookings, error: filterError } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_status', 'confirmed');

      if (filterError) {
        console.error('❌ Error filtering bookings:', filterError.message);
      } else {
        console.log(`✅ Found ${confirmedBookings.length} confirmed bookings`);
      }

      // Clean up test data
      console.log('\n🧹 Cleaning up test data...');
      await supabase
        .from('bookings')
        .delete()
        .eq('email', 'test.customer@example.com');
      console.log('✅ Test data cleaned up');
    }

    // Test 5: Check demo data
    console.log('\n📋 Checking demo data...');
    const { data: allBookings, error: allError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Error fetching all bookings:', allError.message);
    } else {
      console.log(`✅ Total bookings in database: ${allBookings.length}`);
      
      if (allBookings.length > 0) {
        console.log('\n📝 All bookings:');
        allBookings.forEach((booking, index) => {
          console.log(`${index + 1}. ${booking.full_name} - ${booking.package_title} (${booking.booking_status})`);
        });

        // Statistics
        const stats = {
          confirmed: allBookings.filter(b => b.booking_status === 'confirmed').length,
          pending: allBookings.filter(b => b.booking_status === 'pending').length,
          completed: allBookings.filter(b => b.booking_status === 'completed').length,
          totalRevenue: allBookings.reduce((sum, b) => sum + (b.estimated_cost || 0), 0),
          totalTravelers: allBookings.reduce((sum, b) => sum + (b.total_travelers || 0), 0)
        };

        console.log('\n📊 Booking Statistics:');
        console.log(`   📦 Total Bookings: ${allBookings.length}`);
        console.log(`   ✅ Confirmed: ${stats.confirmed}`);
        console.log(`   ⏳ Pending: ${stats.pending}`);
        console.log(`   🏆 Completed: ${stats.completed}`);
        console.log(`   💰 Total Revenue: $${stats.totalRevenue.toLocaleString()}`);
        console.log(`   👥 Total Travelers: ${stats.totalTravelers}`);
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the test
testBookingsService();
