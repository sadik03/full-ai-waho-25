import { createClient } from '@supabase/supabase-js';

// Test which tables actually support real deletion
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealDeletion() {
  console.log('🧪 Testing Real Deletion Across All Tables...\n');

  try {
    // Test each table with create + delete
    
    // 1. TRANSPORTS TEST
    console.log('1️⃣ Testing TRANSPORTS (known to work)...');
    const { data: testTransport, error: createTransportError } = await supabase
      .from('transports')
      .insert([{
        label: 'REAL DELETE TEST Transport',
        cost_per_day: 100,
        type: 'Test Vehicle',
        description: 'Testing real deletion',
        image_url: 'https://example.com/test-transport.jpg',
        is_active: true
      }])
      .select()
      .single();

    if (createTransportError) {
      console.error('❌ Transport CREATE failed:', createTransportError);
    } else {
      console.log(`✅ Transport created: ID ${testTransport.id}`);
      
      // Try to delete it
      const { error: deleteTransportError } = await supabase
        .from('transports')
        .delete()
        .eq('id', testTransport.id);

      if (deleteTransportError) {
        console.error('❌ Transport DELETE failed:', deleteTransportError);
      } else {
        // Check if it's really gone
        const { data: checkTransport, error: checkTransportError } = await supabase
          .from('transports')
          .select('*')
          .eq('id', testTransport.id);

        if (checkTransportError) {
          console.error('❌ Transport verification failed:', checkTransportError);
        } else {
          console.log(`📋 Transport after delete: Found ${checkTransport.length} records`);
          if (checkTransport.length === 0) {
            console.log('🎉 TRANSPORT DELETE WORKS - Real deletion confirmed!');
          } else {
            console.log('⚠️ Transport delete failed - record still exists');
          }
        }
      }
    }

    // 2. ATTRACTIONS TEST
    console.log('\n2️⃣ Testing ATTRACTIONS...');
    const { data: testAttraction, error: createAttractionError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'REAL DELETE TEST Attraction',
        emirates: 'Dubai',
        price: 75,
        image_url: 'https://example.com/test-attraction.jpg',
        description: 'Testing real deletion',
        category: 'Test',
        duration: '1 hour',
        rating: 4.0,
        is_active: true
      }])
      .select()
      .single();

    if (createAttractionError) {
      console.error('❌ Attraction CREATE failed:', createAttractionError);
    } else {
      console.log(`✅ Attraction created: ID ${testAttraction.id}`);
      
      // Try to delete it
      const { error: deleteAttractionError } = await supabase
        .from('attractions')
        .delete()
        .eq('id', testAttraction.id);

      if (deleteAttractionError) {
        console.error('❌ Attraction DELETE failed:', deleteAttractionError);
      } else {
        // Check if it's really gone
        const { data: checkAttraction, error: checkAttractionError } = await supabase
          .from('attractions')
          .select('*')
          .eq('id', testAttraction.id);

        if (checkAttractionError) {
          console.error('❌ Attraction verification failed:', checkAttractionError);
        } else {
          console.log(`📋 Attraction after delete: Found ${checkAttraction.length} records`);
          if (checkAttraction.length === 0) {
            console.log('🎉 ATTRACTION DELETE WORKS - Real deletion confirmed!');
          } else {
            console.log('⚠️ Attraction delete failed - record still exists');
          }
        }
      }
    }

    // 3. HOTELS TEST
    console.log('\n3️⃣ Testing HOTELS...');
    const { data: testHotel, error: createHotelError } = await supabase
      .from('hotels')
      .insert([{
        name: 'REAL DELETE TEST Hotel',
        stars: 3,
        price_range_min: 150,
        price_range_max: 300,
        category: 'Test',
        star_category: '3-star',
        location: 'Dubai Test',
        image_url: 'https://example.com/test-hotel.jpg',
        description: 'Testing real deletion'
      }])
      .select()
      .single();

    if (createHotelError) {
      console.error('❌ Hotel CREATE failed:', createHotelError);
    } else {
      console.log(`✅ Hotel created: ID ${testHotel.id}`);
      
      // Try to delete it
      const { error: deleteHotelError } = await supabase
        .from('hotels')
        .delete()
        .eq('id', testHotel.id);

      if (deleteHotelError) {
        console.error('❌ Hotel DELETE failed:', deleteHotelError);
      } else {
        // Check if it's really gone
        const { data: checkHotel, error: checkHotelError } = await supabase
          .from('hotels')
          .select('*')
          .eq('id', testHotel.id);

        if (checkHotelError) {
          console.error('❌ Hotel verification failed:', checkHotelError);
        } else {
          console.log(`📋 Hotel after delete: Found ${checkHotel.length} records`);
          if (checkHotel.length === 0) {
            console.log('🎉 HOTEL DELETE WORKS - Real deletion confirmed!');
          } else {
            console.log('⚠️ Hotel delete failed - record still exists');
          }
        }
      }
    }

    // 4. SUMMARY
    console.log('\n📊 REAL DELETION TEST SUMMARY:');
    console.log('======================================');
    console.log('This test will show which tables support real deletion');
    console.log('and which ones need the client-side workaround approach.');

  } catch (error) {
    console.error('❌ Real deletion test failed:', error);
  }
}

testRealDeletion();
