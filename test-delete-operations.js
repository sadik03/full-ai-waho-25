import { createClient } from '@supabase/supabase-js';

// Test delete operations specifically
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDeleteOperations() {
  console.log('🔥 Testing DELETE operations specifically...\n');

  try {
    // Test attractions delete
    console.log('1️⃣ Testing ATTRACTIONS DELETE...');
    
    // Create a test attraction first
    const { data: testAttraction, error: createError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'DELETE TEST Attraction',
        emirates: 'Dubai',
        price: 50,
        image_url: 'https://example.com/test.jpg',
        description: 'Test attraction for delete operation',
        category: 'Testing',
        duration: '30 minutes',
        rating: 3.0,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create test attraction:', createError);
      return;
    }

    console.log(`✅ Created test attraction: ID ${testAttraction.id}, Name: "${testAttraction.attraction}"`);

    // Verify it exists
    const { data: beforeDelete, error: verifyError } = await supabase
      .from('attractions')
      .select('*')
      .eq('id', testAttraction.id);

    console.log(`📋 Before delete: Found ${beforeDelete?.length || 0} records with ID ${testAttraction.id}`);

    // Now try to delete it
    console.log(`🗑️ Attempting to delete attraction ID ${testAttraction.id}...`);
    const { error: deleteError } = await supabase
      .from('attractions')
      .delete()
      .eq('id', testAttraction.id);

    if (deleteError) {
      console.error('❌ DELETE operation failed:', deleteError.message);
      console.error('Error details:', deleteError);
    } else {
      console.log('✅ DELETE operation completed without error');
    }

    // Verify deletion
    const { data: afterDelete, error: verifyDeleteError } = await supabase
      .from('attractions')
      .select('*')
      .eq('id', testAttraction.id);

    if (verifyDeleteError) {
      console.error('❌ Error verifying deletion:', verifyDeleteError);
    } else {
      console.log(`📋 After delete: Found ${afterDelete?.length || 0} records with ID ${testAttraction.id}`);
      if (afterDelete && afterDelete.length === 0) {
        console.log('🎉 DELETE SUCCESSFUL - Record was actually deleted!');
      } else {
        console.log('⚠️ DELETE FAILED - Record still exists in database!');
        console.log('Remaining record:', afterDelete[0]);
      }
    }

    // Test hotels delete
    console.log('\n2️⃣ Testing HOTELS DELETE...');
    
    // Create a test hotel first
    const { data: testHotel, error: createHotelError } = await supabase
      .from('hotels')
      .insert([{
        name: 'DELETE TEST Hotel',
        stars: 3,
        price_range_min: 100,
        price_range_max: 200,
        category: 'Budget',
        star_category: '3-star',
        location: 'Dubai Test Area',
        image_url: 'https://example.com/hotel.jpg',
        description: 'Test hotel for delete operation'
      }])
      .select()
      .single();

    if (createHotelError) {
      console.error('❌ Failed to create test hotel:', createHotelError);
      return;
    }

    console.log(`✅ Created test hotel: ID ${testHotel.id}, Name: "${testHotel.name}"`);

    // Now try to delete it
    console.log(`🗑️ Attempting to delete hotel ID ${testHotel.id}...`);
    const { error: deleteHotelError } = await supabase
      .from('hotels')
      .delete()
      .eq('id', testHotel.id);

    if (deleteHotelError) {
      console.error('❌ Hotel DELETE operation failed:', deleteHotelError.message);
      console.error('Error details:', deleteHotelError);
    } else {
      console.log('✅ Hotel DELETE operation completed without error');
    }

    // Verify hotel deletion
    const { data: afterHotelDelete, error: verifyHotelDeleteError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', testHotel.id);

    if (verifyHotelDeleteError) {
      console.error('❌ Error verifying hotel deletion:', verifyHotelDeleteError);
    } else {
      console.log(`📋 After hotel delete: Found ${afterHotelDelete?.length || 0} records with ID ${testHotel.id}`);
      if (afterHotelDelete && afterHotelDelete.length === 0) {
        console.log('🎉 HOTEL DELETE SUCCESSFUL - Record was actually deleted!');
      } else {
        console.log('⚠️ HOTEL DELETE FAILED - Record still exists in database!');
        console.log('Remaining hotel record:', afterHotelDelete[0]);
      }
    }

    // Test database permissions
    console.log('\n3️⃣ Testing database permissions...');
    
    // Try to get current user info
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', user ? `${user.email} (${user.id})` : 'Anonymous');

    // Check table permissions
    const { data: permTest, error: permError } = await supabase
      .from('attractions')
      .select('id')
      .limit(1);

    if (permError) {
      console.error('❌ No read permission on attractions table:', permError);
    } else {
      console.log('✅ Read permission confirmed for attractions table');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testDeleteOperations();
