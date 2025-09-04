import { createClient } from '@supabase/supabase-js';

// Debug UPDATE issue specifically
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUpdateOperations() {
  console.log('🔍 Debugging UPDATE operations...\n');

  try {
    // Create test attraction first
    console.log('1️⃣ Creating test attraction...');
    const { data: testAttraction, error: createError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'Debug Test Attraction',
        emirates: 'Dubai',
        price: 100,
        image_url: 'https://example.com/test.jpg',
        description: 'Debug test attraction',
        category: 'Testing',
        duration: '1 hour',
        rating: 4.0,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('❌ CREATE failed:', createError);
      return;
    }

    console.log(`✅ Created test attraction with ID: ${testAttraction.id}`);

    // Test different UPDATE approaches
    console.log('\n2️⃣ Testing UPDATE without .single()...');
    const { data: updateData1, error: updateError1 } = await supabase
      .from('attractions')
      .update({ price: 150 })
      .eq('id', testAttraction.id)
      .select(); // Remove .single()

    if (updateError1) {
      console.error('❌ UPDATE (no single) failed:', updateError1.message);
    } else {
      console.log(`✅ UPDATE (no single) successful: Found ${updateData1.length} records`);
      console.log('Data:', updateData1);
    }

    // Test UPDATE with .single()
    console.log('\n3️⃣ Testing UPDATE with .single()...');
    const { data: updateData2, error: updateError2 } = await supabase
      .from('attractions')
      .update({ price: 175 })
      .eq('id', testAttraction.id)
      .select()
      .single();

    if (updateError2) {
      console.error('❌ UPDATE (with single) failed:', updateError2.message);
    } else {
      console.log('✅ UPDATE (with single) successful');
      console.log('Data:', updateData2);
    }

    // Check if there are duplicate records
    console.log('\n4️⃣ Checking for duplicate records...');
    const { data: duplicates, error: dupError } = await supabase
      .from('attractions')
      .select('*')
      .eq('id', testAttraction.id);

    if (dupError) {
      console.error('❌ Duplicate check failed:', dupError.message);
    } else {
      console.log(`Found ${duplicates.length} records with ID ${testAttraction.id}`);
      duplicates.forEach((record, index) => {
        console.log(`Record ${index + 1}:`, {
          id: record.id,
          attraction: record.attraction,
          price: record.price
        });
      });
    }

    // Test hotel UPDATE as well
    console.log('\n5️⃣ Testing hotel UPDATE...');
    
    // Create test hotel
    const { data: testHotel, error: createHotelError } = await supabase
      .from('hotels')
      .insert([{
        name: 'Debug Test Hotel',
        stars: 3,
        price_range_min: 200,
        price_range_max: 300,
        category: 'Business',
        star_category: '3-star',
        location: 'Dubai Test',
        image_url: 'https://example.com/hotel.jpg',
        description: 'Debug test hotel'
      }])
      .select()
      .single();

    if (createHotelError) {
      console.error('❌ Hotel CREATE failed:', createHotelError);
    } else {
      console.log(`✅ Created test hotel with ID: ${testHotel.id}`);

      // Test hotel UPDATE without .single()
      const { data: hotelUpdateData, error: hotelUpdateError } = await supabase
        .from('hotels')
        .update({ stars: 4 })
        .eq('id', testHotel.id)
        .select();

      if (hotelUpdateError) {
        console.error('❌ Hotel UPDATE failed:', hotelUpdateError.message);
      } else {
        console.log(`✅ Hotel UPDATE successful: Found ${hotelUpdateData.length} records`);
      }

      // Clean up hotel
      await supabase.from('hotels').delete().eq('id', testHotel.id);
      console.log('🧹 Cleaned up test hotel');
    }

    // Clean up attraction
    await supabase.from('attractions').delete().eq('id', testAttraction.id);
    console.log('🧹 Cleaned up test attraction');

  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

debugUpdateOperations();
