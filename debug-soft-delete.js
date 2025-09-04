import { createClient } from '@supabase/supabase-js';

// Debug the soft delete operation
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSoftDelete() {
  console.log('🔍 Debugging Soft Delete Operations...\n');

  try {
    // Check the records we just created
    console.log('1️⃣ Checking recent test records...');
    
    // Find our test records
    const { data: recentAttractions, error: recentError } = await supabase
      .from('attractions')
      .select('*')
      .ilike('attraction', '%CORRECTED TEST%')
      .order('created_at', { ascending: false });

    if (recentError) {
      console.error('❌ Error finding recent attractions:', recentError);
    } else {
      console.log(`📋 Found ${recentAttractions.length} test attraction records:`);
      recentAttractions.forEach((record, index) => {
        console.log(`   ${index + 1}. ID: ${record.id}, Active: ${record.is_active}, Name: "${record.attraction}"`);
      });

      // Try to soft delete one of them
      if (recentAttractions.length > 0) {
        const testRecord = recentAttractions[0];
        console.log(`\n2️⃣ Attempting soft delete on ID ${testRecord.id}...`);
        
        // Check current is_active status
        console.log(`   Before: is_active = ${testRecord.is_active}`);
        
        // Perform soft delete
        const { error: deleteError } = await supabase
          .from('attractions')
          .update({ is_active: false })
          .eq('id', testRecord.id);

        if (deleteError) {
          console.error('   ❌ Soft delete failed:', deleteError);
        } else {
          console.log('   ✅ Soft delete UPDATE completed');
          
          // Check the record after soft delete
          const { data: afterDelete, error: checkError } = await supabase
            .from('attractions')
            .select('*')
            .eq('id', testRecord.id)
            .single();

          if (checkError) {
            console.error('   ❌ Error checking after delete:', checkError);
          } else {
            console.log(`   After: is_active = ${afterDelete.is_active}`);
            
            if (afterDelete.is_active === false) {
              console.log('   🎉 Soft delete SUCCESSFUL - Record marked as inactive!');
            } else {
              console.log('   ⚠️ Soft delete FAILED - Record still active');
            }
          }
        }

        // Test our filtered query
        console.log('\n3️⃣ Testing filtered queries...');
        
        const { data: activeAttractions, error: activeError } = await supabase
          .from('attractions')
          .select('*')
          .eq('is_active', true)
          .order('attraction');

        if (activeError) {
          console.error('   ❌ Error fetching active attractions:', activeError);
        } else {
          console.log(`   ✅ Active attractions query: ${activeAttractions.length} records`);
        }

        const { data: inactiveAttractions, error: inactiveError } = await supabase
          .from('attractions')
          .select('*')
          .eq('is_active', false)
          .order('attraction');

        if (inactiveError) {
          console.error('   ❌ Error fetching inactive attractions:', inactiveError);
        } else {
          console.log(`   ✅ Inactive attractions query: ${inactiveAttractions.length} records`);
          if (inactiveAttractions.length > 0) {
            console.log('   📋 First few inactive records:');
            inactiveAttractions.slice(0, 3).forEach((record, index) => {
              console.log(`      ${index + 1}. ID: ${record.id}, Name: "${record.attraction}"`);
            });
          }
        }
      }
    }

    // Test hotels soft delete
    console.log('\n4️⃣ Testing hotels soft delete...');
    
    const { data: recentHotels, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .ilike('name', '%CORRECTED TEST%')
      .order('created_at', { ascending: false });

    if (hotelError) {
      console.error('❌ Error finding recent hotels:', hotelError);
    } else {
      console.log(`📋 Found ${recentHotels.length} test hotel records:`);
      recentHotels.forEach((record, index) => {
        console.log(`   ${index + 1}. ID: ${record.id}, Name: "${record.name}"`);
      });

      if (recentHotels.length > 0) {
        const testHotel = recentHotels[0];
        console.log(`\n   Attempting hotel soft delete on ID ${testHotel.id}...`);
        
        const timestamp = new Date().toISOString();
        const { error: hotelDeleteError } = await supabase
          .from('hotels')
          .update({ 
            name: `[DELETED-${timestamp}]`,
            description: `[DELETED] Removed on ${timestamp}`
          })
          .eq('id', testHotel.id);

        if (hotelDeleteError) {
          console.error('   ❌ Hotel soft delete failed:', hotelDeleteError);
        } else {
          console.log('   ✅ Hotel soft delete UPDATE completed');
          
          // Check the record after soft delete
          const { data: afterHotelDelete, error: checkHotelError } = await supabase
            .from('hotels')
            .select('*')
            .eq('id', testHotel.id)
            .single();

          if (checkHotelError) {
            console.error('   ❌ Error checking hotel after delete:', checkHotelError);
          } else {
            console.log(`   After: name = "${afterHotelDelete.name}"`);
            
            if (afterHotelDelete.name.includes('[DELETED')) {
              console.log('   🎉 Hotel soft delete SUCCESSFUL - Record marked as deleted!');
            } else {
              console.log('   ⚠️ Hotel soft delete FAILED - Record name unchanged');
            }
          }
          
          // Test hotel filtered query
          const { data: activeHotels, error: activeHotelError } = await supabase
            .from('hotels')
            .select('*')
            .not('name', 'ilike', '[DELETED%');

          if (activeHotelError) {
            console.error('   ❌ Error fetching active hotels:', activeHotelError);
          } else {
            console.log(`   ✅ Active hotels query: ${activeHotels.length} records`);
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

debugSoftDelete();
