import { createClient } from '@supabase/supabase-js';

// Test ID type issue in delete operations
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testIdTypeIssue() {
  console.log('🔍 Testing ID Type Issue in Delete Operations...\n');

  try {
    // Create a test record and examine its ID type
    console.log('1️⃣ Creating test record to examine ID type...');
    
    const { data: testRecord, error: createError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'ID TYPE TEST',
        emirates: 'Dubai',
        price: 30,
        image_url: 'https://example.com/id-test.jpg',
        description: 'Testing ID type issue',
        category: 'ID Test',
        duration: '20 minutes',
        rating: 3.5,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create test record:', createError);
      return;
    }

    console.log('✅ Created test record:');
    console.log(`   ID: ${testRecord.id} (type: ${typeof testRecord.id})`);
    console.log(`   Attraction: ${testRecord.attraction}`);

    // Test different ways of deleting
    console.log('\n2️⃣ Testing delete with different ID formats...');

    // Method 1: Delete with ID as-is (should be number)
    console.log(`🔄 Method 1: Delete with ID as-is (${testRecord.id})...`);
    const { count: count1, error: delete1Error } = await supabase
      .from('attractions')
      .delete({ count: 'exact' })
      .eq('id', testRecord.id);
    
    console.log(`   Count deleted: ${count1}, Error: ${delete1Error?.message || 'None'}`);

    if (count1 === 0) {
      // Method 2: Delete with ID converted to number
      console.log(`🔄 Method 2: Delete with Number(${testRecord.id})...`);
      const { count: count2, error: delete2Error } = await supabase
        .from('attractions')
        .delete({ count: 'exact' })
        .eq('id', Number(testRecord.id));
      
      console.log(`   Count deleted: ${count2}, Error: ${delete2Error?.message || 'None'}`);

      if (count2 === 0) {
        // Method 3: Delete with ID as string
        console.log(`🔄 Method 3: Delete with String("${testRecord.id}")...`);
        const { count: count3, error: delete3Error } = await supabase
          .from('attractions')
          .delete({ count: 'exact' })
          .eq('id', String(testRecord.id));
        
        console.log(`   Count deleted: ${count3}, Error: ${delete3Error?.message || 'None'}`);

        if (count3 === 0) {
          // Method 4: Delete with parseInt
          console.log(`🔄 Method 4: Delete with parseInt(${testRecord.id})...`);
          const { count: count4, error: delete4Error } = await supabase
            .from('attractions')
            .delete({ count: 'exact' })
            .eq('id', parseInt(testRecord.id.toString()));
          
          console.log(`   Count deleted: ${count4}, Error: ${delete4Error?.message || 'None'}`);
        }
      }
    }

    // Check if record still exists
    console.log('\n3️⃣ Verifying record status...');
    const { data: checkRecord, error: checkError } = await supabase
      .from('attractions')
      .select('*')
      .eq('id', testRecord.id);

    if (checkError) {
      console.error('❌ Error checking record:', checkError);
    } else {
      if (checkRecord && checkRecord.length > 0) {
        console.log('⚠️ Record still exists - DELETE FAILED');
        console.log('Record data:', checkRecord[0]);
        
        // Try manual cleanup with different approaches
        console.log('\n4️⃣ Attempting manual cleanup...');
        
        // Try with raw SQL approach
        console.log('🔄 Trying RPC delete approach...');
        const { data: rpcResult, error: rpcError } = await supabase
          .rpc('delete_attraction_by_id', { attraction_id: testRecord.id });
        
        if (rpcError) {
          console.log('   RPC function not available (expected)');
        } else {
          console.log('   RPC result:', rpcResult);
        }

        // Try update instead of delete to test if we have write permissions
        console.log('🔄 Testing UPDATE permissions...');
        const { error: updateError } = await supabase
          .from('attractions')
          .update({ description: 'UPDATED - Testing write permissions' })
          .eq('id', testRecord.id);
        
        if (updateError) {
          console.error('   ❌ UPDATE also failed:', updateError.message);
          console.log('   🚨 DIAGNOSIS: No write permissions on attractions table');
        } else {
          console.log('   ✅ UPDATE successful - we have write permissions');
          console.log('   🚨 DIAGNOSIS: DELETE operation has specific restrictions');
        }

      } else {
        console.log('🎉 Record successfully deleted!');
      }
    }

    // Test the same with hotels
    console.log('\n5️⃣ Testing hotels delete as comparison...');
    
    const { data: testHotel, error: createHotelError } = await supabase
      .from('hotels')
      .insert([{
        name: 'ID TYPE TEST Hotel',
        stars: 2,
        price_range_min: 50,
        price_range_max: 100,
        category: 'Budget',
        star_category: '2-star',
        location: 'Dubai Test',
        image_url: 'https://example.com/hotel-id-test.jpg',
        description: 'Testing hotel ID type'
      }])
      .select()
      .single();

    if (createHotelError) {
      console.error('❌ Failed to create test hotel:', createHotelError);
    } else {
      console.log(`✅ Created test hotel: ID ${testHotel.id} (type: ${typeof testHotel.id})`);
      
      const { count: hotelCount, error: hotelDeleteError } = await supabase
        .from('hotels')
        .delete({ count: 'exact' })
        .eq('id', testHotel.id);
      
      console.log(`   Hotel delete count: ${hotelCount}, Error: ${hotelDeleteError?.message || 'None'}`);
    }

  } catch (error) {
    console.error('❌ ID type test failed:', error);
  }
}

testIdTypeIssue();
