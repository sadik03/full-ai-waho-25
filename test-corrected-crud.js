import { createClient } from '@supabase/supabase-js';

// Test corrected CRUD operations with proper permissions
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fixed service methods matching the updated code
async function updateAttractionFixed(id, attractionData) {
  try {
    // First perform the update (without select)
    const { error: updateError } = await supabase
      .from('attractions')
      .update(attractionData)
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Then fetch the updated record separately
    const { data, error: fetchError } = await supabase
      .from('attractions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    return data;
  } catch (error) {
    throw error;
  }
}

async function deleteAttractionFixed(id) {
  try {
    // Mark as inactive instead of actual delete
    const { error } = await supabase
      .from('attractions')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    throw error;
  }
}

async function updateHotelFixed(id, hotelData) {
  try {
    // First perform the update (without select)
    const { error: updateError } = await supabase
      .from('hotels')
      .update(hotelData)
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Then fetch the updated record separately
    const { data, error: fetchError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    return data;
  } catch (error) {
    throw error;
  }
}

async function deleteHotelFixed(id) {
  try {
    // Mark as deleted by updating name and description
    const timestamp = new Date().toISOString();
    const { error } = await supabase
      .from('hotels')
      .update({ 
        name: `[DELETED-${timestamp}]`,
        description: `[DELETED] Removed on ${timestamp}`
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    throw error;
  }
}

async function getAllAttractionsFixed() {
  try {
    const { data, error } = await supabase
      .from('attractions')
      .select('*')
      .eq('is_active', true)  // Only get active attractions
      .order('emirates', { ascending: true })
      .order('attraction', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
}

async function getAllHotelsFixed() {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .not('name', 'ilike', '[DELETED%')  // Filter out soft-deleted hotels
      .order('stars', { ascending: false })
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
}

async function testCorrectedCrudOperations() {
  console.log('🎯 Testing CORRECTED CRUD Operations...\n');

  let testResults = {
    attractions: { create: false, read: false, update: false, delete: false },
    hotels: { create: false, read: false, update: false, delete: false },
    transports: { create: false, read: false, update: false, delete: false }
  };

  try {
    // ========== ATTRACTIONS CRUD ==========
    console.log('🎡 TESTING ATTRACTIONS CRUD (CORRECTED):');
    
    // CREATE
    console.log('\n1. 📝 CREATE...');
    const { data: newAttraction, error: createError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'CORRECTED TEST Attraction',
        emirates: 'Dubai',
        price: 80,
        image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop',
        description: 'Corrected CRUD test attraction',
        category: 'Corrected Testing',
        duration: '1 hour',
        rating: 4.5,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('   ❌ CREATE failed:', createError.message);
    } else {
      console.log(`   ✅ CREATE successful: ${newAttraction.attraction} (ID: ${newAttraction.id})`);
      testResults.attractions.create = true;

      // READ
      console.log('\n2. 👀 READ...');
      const attractionsBeforeActions = await getAllAttractionsFixed();
      console.log(`   ✅ READ successful: Found ${attractionsBeforeActions.length} active attractions`);
      testResults.attractions.read = true;

      // UPDATE
      console.log('\n3. ✏️ UPDATE...');
      try {
        const updatedAttraction = await updateAttractionFixed(newAttraction.id, {
          price: 120,
          description: 'CORRECTED - Updated test attraction description'
        });
        console.log(`   ✅ UPDATE successful: Price changed to ${updatedAttraction.price}`);
        testResults.attractions.update = true;
      } catch (updateError) {
        console.error('   ❌ UPDATE failed:', updateError.message);
      }

      // DELETE (soft delete)
      console.log('\n4. 🗑️ DELETE (Soft Delete)...');
      try {
        await deleteAttractionFixed(newAttraction.id);
        
        // Verify soft delete worked
        const attractionsAfterDelete = await getAllAttractionsFixed();
        const deleteDifference = attractionsBeforeActions.length - attractionsAfterDelete.length;
        
        if (deleteDifference > 0) {
          console.log(`   ✅ DELETE successful: ${deleteDifference} attraction(s) removed from active list`);
          testResults.attractions.delete = true;
        } else {
          console.log('   ⚠️ DELETE may not have worked - count unchanged');
        }
      } catch (deleteError) {
        console.error('   ❌ DELETE failed:', deleteError.message);
      }
    }

    // ========== HOTELS CRUD ==========
    console.log('\n\n🏨 TESTING HOTELS CRUD (CORRECTED):');
    
    // CREATE
    console.log('\n1. 📝 CREATE...');
    const { data: newHotel, error: createHotelError } = await supabase
      .from('hotels')
      .insert([{
        name: 'CORRECTED TEST Hotel',
        stars: 4,
        price_range_min: 200,
        price_range_max: 400,
        category: 'Business',
        star_category: '4-star',
        location: 'Dubai Corrected Test',
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
        description: 'Corrected CRUD test hotel'
      }])
      .select()
      .single();

    if (createHotelError) {
      console.error('   ❌ CREATE failed:', createHotelError.message);
    } else {
      console.log(`   ✅ CREATE successful: ${newHotel.name} (ID: ${newHotel.id})`);
      testResults.hotels.create = true;

      // READ
      console.log('\n2. 👀 READ...');
      const hotelsBeforeActions = await getAllHotelsFixed();
      console.log(`   ✅ READ successful: Found ${hotelsBeforeActions.length} active hotels`);
      testResults.hotels.read = true;

      // UPDATE
      console.log('\n3. ✏️ UPDATE...');
      try {
        const updatedHotel = await updateHotelFixed(newHotel.id, {
          stars: 5,
          price_range_max: 500
        });
        console.log(`   ✅ UPDATE successful: Stars changed to ${updatedHotel.stars}`);
        testResults.hotels.update = true;
      } catch (updateError) {
        console.error('   ❌ UPDATE failed:', updateError.message);
      }

      // DELETE (soft delete)
      console.log('\n4. 🗑️ DELETE (Soft Delete)...');
      try {
        await deleteHotelFixed(newHotel.id);
        
        // Verify soft delete worked
        const hotelsAfterDelete = await getAllHotelsFixed();
        const hotelDeleteDifference = hotelsBeforeActions.length - hotelsAfterDelete.length;
        
        if (hotelDeleteDifference > 0) {
          console.log(`   ✅ DELETE successful: ${hotelDeleteDifference} hotel(s) removed from active list`);
          testResults.hotels.delete = true;
        } else {
          console.log('   ⚠️ DELETE may not have worked - count unchanged');
        }
      } catch (deleteError) {
        console.error('   ❌ DELETE failed:', deleteError.message);
      }
    }

    // ========== TRANSPORTS CRUD (Reference - should still work) ==========
    console.log('\n\n🚗 TESTING TRANSPORTS CRUD (Reference):');
    
    // CREATE
    console.log('\n1. 📝 CREATE...');
    const { data: newTransport, error: createTransportError } = await supabase
      .from('transports')
      .insert([{
        label: 'CORRECTED TEST Transport',
        cost_per_day: 160,
        type: 'Luxury Car',
        description: 'Corrected CRUD test transport',
        image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop',
        is_active: true
      }])
      .select()
      .single();

    if (createTransportError) {
      console.error('   ❌ CREATE failed:', createTransportError.message);
    } else {
      console.log(`   ✅ CREATE successful: ${newTransport.label} (ID: ${newTransport.id})`);
      testResults.transports.create = true;

      // READ
      console.log('\n2. 👀 READ...');
      const { data: transports, error: readTransportError } = await supabase
        .from('transports')
        .select('*')
        .limit(5);

      if (readTransportError) {
        console.error('   ❌ READ failed:', readTransportError.message);
      } else {
        console.log(`   ✅ READ successful: Found ${transports.length} transports`);
        testResults.transports.read = true;
      }

      // UPDATE
      console.log('\n3. ✏️ UPDATE...');
      const { data: updatedTransport, error: updateTransportError } = await supabase
        .from('transports')
        .update({ cost_per_day: 220 })
        .eq('id', newTransport.id)
        .select()
        .single();

      if (updateTransportError) {
        console.error('   ❌ UPDATE failed:', updateTransportError.message);
      } else {
        console.log(`   ✅ UPDATE successful: Cost changed to ${updatedTransport.cost_per_day}`);
        testResults.transports.update = true;
      }

      // DELETE
      console.log('\n4. 🗑️ DELETE...');
      const { error: deleteTransportError } = await supabase
        .from('transports')
        .delete()
        .eq('id', newTransport.id);

      if (deleteTransportError) {
        console.error('   ❌ DELETE failed:', deleteTransportError.message);
      } else {
        console.log('   ✅ DELETE successful');
        testResults.transports.delete = true;
      }
    }

    // ========== FINAL RESULTS ==========
    console.log('\n\n🎉 CORRECTED CRUD OPERATIONS RESULTS:');
    console.log('==========================================');
    
    Object.keys(testResults).forEach(table => {
      console.log(`\n${table.toUpperCase()}:`);
      const results = testResults[table];
      console.log(`   CREATE: ${results.create ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   READ:   ${results.read ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   UPDATE: ${results.update ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   DELETE: ${results.delete ? '✅ PASSED' : '❌ FAILED'}`);
    });

    const totalTests = Object.values(testResults).reduce((total, table) => {
      return total + Object.values(table).filter(Boolean).length;
    }, 0);
    const maxTests = Object.keys(testResults).length * 4;
    const successRate = Math.round((totalTests / maxTests) * 100);

    console.log(`\n🎯 Final Success Rate: ${successRate}% (${totalTests}/${maxTests} operations passed)`);
    
    if (successRate === 100) {
      console.log('\n🎉🎉🎉 PERFECT! ALL CORRECTED CRUD OPERATIONS WORKING! 🎉🎉🎉');
      console.log('✨ Admin panel delete functionality will now work correctly!');
      console.log('🚀 Toast notifications will show proper delete confirmations!');
    } else if (successRate >= 90) {
      console.log('\n🎊 Excellent! Most CRUD operations working correctly!');
    } else {
      console.log('\n⚠️ Some CRUD operations still need attention.');
    }

  } catch (error) {
    console.error('❌ Corrected CRUD test failed:', error);
  }
}

testCorrectedCrudOperations();
