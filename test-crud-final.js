import { createClient } from '@supabase/supabase-js';

// Final CRUD test with fixed UPDATE operations
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

// Updated service-style UPDATE functions
async function updateAttractionFixed(id, attractionData) {
  try {
    // First perform the update
    const { error: updateError } = await supabase
      .from('attractions')
      .update(attractionData)
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Then fetch the updated record
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

async function updateHotelFixed(id, hotelData) {
  try {
    // First perform the update
    const { error: updateError } = await supabase
      .from('hotels')
      .update(hotelData)
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Then fetch the updated record
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

async function testFinalCrud() {
  console.log('🎯 Final CRUD Operations Test (All Fixed)...\n');
  
  let testResults = {
    attractions: { create: false, read: false, update: false, delete: false },
    hotels: { create: false, read: false, update: false, delete: false },
    transports: { create: false, read: false, update: false, delete: false }
  };

  let createdAttraction = null;
  let createdHotel = null;
  let createdTransport = null;

  try {
    // ========== ATTRACTIONS CRUD ==========
    console.log('🎡 TESTING ATTRACTIONS CRUD (Final):');
    
    // CREATE
    console.log('\n1. 📝 CREATE...');
    const newAttraction = {
      attraction: 'Final Test Attraction',
      emirates: 'Dubai',
      price: 99,
      image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop',
      description: 'Final test attraction',
      category: 'Testing',
      duration: '1 hour',
      rating: 4.5,
      is_active: true
    };

    const { data: attractionResult, error: createAttractionError } = await supabase
      .from('attractions')
      .insert([newAttraction])
      .select()
      .single();

    if (createAttractionError) {
      console.error('   ❌ CREATE failed:', createAttractionError.message);
    } else {
      createdAttraction = attractionResult;
      console.log(`   ✅ CREATE successful: ${createdAttraction.attraction} (ID: ${createdAttraction.id})`);
      testResults.attractions.create = true;
    }

    // READ
    console.log('\n2. 👀 READ...');
    const { data: attractions, error: readAttractionError } = await supabase
      .from('attractions')
      .select('*')
      .limit(5);

    if (readAttractionError) {
      console.error('   ❌ READ failed:', readAttractionError.message);
    } else {
      console.log(`   ✅ READ successful: Found ${attractions.length} attractions`);
      testResults.attractions.read = true;
    }

    // UPDATE (using fixed method)
    if (createdAttraction) {
      console.log('\n3. ✏️ UPDATE (Fixed)...');
      try {
        const updatedAttraction = await updateAttractionFixed(createdAttraction.id, {
          price: 149,
          description: 'Final updated test attraction'
        });
        console.log(`   ✅ UPDATE successful: Price changed to ${updatedAttraction.price}`);
        testResults.attractions.update = true;
      } catch (updateError) {
        console.error('   ❌ UPDATE failed:', updateError.message);
      }

      // DELETE
      console.log('\n4. 🗑️ DELETE...');
      const { error: deleteAttractionError } = await supabase
        .from('attractions')
        .delete()
        .eq('id', createdAttraction.id);

      if (deleteAttractionError) {
        console.error('   ❌ DELETE failed:', deleteAttractionError.message);
      } else {
        console.log('   ✅ DELETE successful');
        testResults.attractions.delete = true;
      }
    }

    // ========== HOTELS CRUD ==========
    console.log('\n\n🏨 TESTING HOTELS CRUD (Final):');
    
    // CREATE
    console.log('\n1. 📝 CREATE...');
    const newHotel = {
      name: 'Final Test Hotel',
      stars: 4,
      price_range_min: 200,
      price_range_max: 400,
      category: 'Business',
      star_category: '4-star',
      location: 'Dubai Final Test',
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
      description: 'Final test hotel'
    };

    const { data: hotelResult, error: createHotelError } = await supabase
      .from('hotels')
      .insert([newHotel])
      .select()
      .single();

    if (createHotelError) {
      console.error('   ❌ CREATE failed:', createHotelError.message);
    } else {
      createdHotel = hotelResult;
      console.log(`   ✅ CREATE successful: ${createdHotel.name} (ID: ${createdHotel.id})`);
      testResults.hotels.create = true;
    }

    // READ
    console.log('\n2. 👀 READ...');
    const { data: hotels, error: readHotelError } = await supabase
      .from('hotels')
      .select('*')
      .limit(5);

    if (readHotelError) {
      console.error('   ❌ READ failed:', readHotelError.message);
    } else {
      console.log(`   ✅ READ successful: Found ${hotels.length} hotels`);
      testResults.hotels.read = true;
    }

    // UPDATE (using fixed method)
    if (createdHotel) {
      console.log('\n3. ✏️ UPDATE (Fixed)...');
      try {
        const updatedHotel = await updateHotelFixed(createdHotel.id, {
          stars: 5,
          price_range_max: 500
        });
        console.log(`   ✅ UPDATE successful: Stars changed to ${updatedHotel.stars}`);
        testResults.hotels.update = true;
      } catch (updateError) {
        console.error('   ❌ UPDATE failed:', updateError.message);
      }

      // DELETE
      console.log('\n4. 🗑️ DELETE...');
      const { error: deleteHotelError } = await supabase
        .from('hotels')
        .delete()
        .eq('id', createdHotel.id);

      if (deleteHotelError) {
        console.error('   ❌ DELETE failed:', deleteHotelError.message);
      } else {
        console.log('   ✅ DELETE successful');
        testResults.hotels.delete = true;
      }
    }

    // ========== TRANSPORTS CRUD ==========
    console.log('\n\n🚗 TESTING TRANSPORTS CRUD:');
    
    // CREATE
    console.log('\n1. 📝 CREATE...');
    const newTransport = {
      label: 'Final Test Transport',
      cost_per_day: 150,
      type: 'Luxury Car',
      description: 'Final test transport',
      image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop',
      is_active: true
    };

    const { data: transportResult, error: createTransportError } = await supabase
      .from('transports')
      .insert([newTransport])
      .select()
      .single();

    if (createTransportError) {
      console.error('   ❌ CREATE failed:', createTransportError.message);
    } else {
      createdTransport = transportResult;
      console.log(`   ✅ CREATE successful: ${createdTransport.label} (ID: ${createdTransport.id})`);
      testResults.transports.create = true;
    }

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

    // UPDATE (transports still work with original method)
    if (createdTransport) {
      console.log('\n3. ✏️ UPDATE...');
      const { data: updatedTransport, error: updateTransportError } = await supabase
        .from('transports')
        .update({ 
          cost_per_day: 200,
          description: 'Final updated test transport' 
        })
        .eq('id', createdTransport.id)
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
        .eq('id', createdTransport.id);

      if (deleteTransportError) {
        console.error('   ❌ DELETE failed:', deleteTransportError.message);
      } else {
        console.log('   ✅ DELETE successful');
        testResults.transports.delete = true;
      }
    }

    // ========== FINAL RESULTS ==========
    console.log('\n\n🎉 FINAL CRUD OPERATIONS RESULTS:');
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
      console.log('\n🎉🎉🎉 PERFECT! ALL CRUD OPERATIONS WORKING! 🎉🎉🎉');
      console.log('✨ Database operations are fully functional across all tables!');
      console.log('🚀 Ready for production use!');
    } else if (successRate >= 90) {
      console.log('\n🎊 Excellent! Almost all CRUD operations working!');
    } else {
      console.log('\n⚠️ Some CRUD operations still need attention.');
    }

  } catch (error) {
    console.error('❌ Final CRUD test failed:', error);
  }
}

testFinalCrud();
