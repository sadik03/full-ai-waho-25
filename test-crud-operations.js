import { createClient } from '@supabase/supabase-js';

// Test script to verify all CRUD operations across the website
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCrudOperations() {
  console.log('🔧 Testing CRUD Operations Across All Tables...\n');
  
  let testResults = {
    attractions: { create: false, read: false, update: false, delete: false },
    hotels: { create: false, read: false, update: false, delete: false },
    transports: { create: false, read: false, update: false, delete: false }
  };

  try {
    // ========== ATTRACTIONS CRUD TESTING ==========
    console.log('🎡 TESTING ATTRACTIONS CRUD OPERATIONS:');
    
    // CREATE - Test adding new attraction
    console.log('\n1. 📝 Testing CREATE operation...');
    const newAttraction = {
      attraction: 'Test Attraction CRUD',
      emirates: 'Dubai',
      price: 99,
      image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop',
      description: 'Test attraction for CRUD operations',
      category: 'Testing',
      duration: '1 hour',
      rating: 4.5,
      is_active: true
    };

    const { data: createdAttraction, error: createError } = await supabase
      .from('attractions')
      .insert([newAttraction])
      .select()
      .single();

    if (createError) {
      console.error('   ❌ CREATE failed:', createError.message);
    } else {
      console.log('   ✅ CREATE successful:', createdAttraction.attraction);
      testResults.attractions.create = true;
    }

    // READ - Test fetching attractions
    console.log('\n2. 👀 Testing READ operation...');
    const { data: attractions, error: readError } = await supabase
      .from('attractions')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('   ❌ READ failed:', readError.message);
    } else {
      console.log(`   ✅ READ successful: Found ${attractions.length} attractions`);
      testResults.attractions.read = true;
    }

    // UPDATE - Test updating attraction
    if (createdAttraction) {
      console.log('\n3. ✏️ Testing UPDATE operation...');
      const { data: updatedAttraction, error: updateError } = await supabase
        .from('attractions')
        .update({ 
          price: 149,
          description: 'Updated test attraction description'
        })
        .eq('id', createdAttraction.id)
        .select()
        .single();

      if (updateError) {
        console.error('   ❌ UPDATE failed:', updateError.message);
      } else {
        console.log('   ✅ UPDATE successful: Price changed to', updatedAttraction.price);
        testResults.attractions.update = true;
      }

      // DELETE - Test deleting attraction
      console.log('\n4. 🗑️ Testing DELETE operation...');
      const { error: deleteError } = await supabase
        .from('attractions')
        .delete()
        .eq('id', createdAttraction.id);

      if (deleteError) {
        console.error('   ❌ DELETE failed:', deleteError.message);
      } else {
        console.log('   ✅ DELETE successful: Test attraction removed');
        testResults.attractions.delete = true;
      }
    }

    // ========== HOTELS CRUD TESTING ==========
    console.log('\n\n🏨 TESTING HOTELS CRUD OPERATIONS:');
    
    // CREATE - Test adding new hotel
    console.log('\n1. 📝 Testing CREATE operation...');
    const newHotel = {
      name: 'Test Hotel CRUD',
      stars: 4,
      price_range_min: 200,
      price_range_max: 400,
      category: 'Testing',
      location: 'Dubai Test Area',
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
      description: 'Test hotel for CRUD operations',
      is_active: true
    };

    const { data: createdHotel, error: createHotelError } = await supabase
      .from('hotels')
      .insert([newHotel])
      .select()
      .single();

    if (createHotelError) {
      console.error('   ❌ CREATE failed:', createHotelError.message);
    } else {
      console.log('   ✅ CREATE successful:', createdHotel.name);
      testResults.hotels.create = true;
    }

    // READ - Test fetching hotels
    console.log('\n2. 👀 Testing READ operation...');
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

    // UPDATE - Test updating hotel
    if (createdHotel) {
      console.log('\n3. ✏️ Testing UPDATE operation...');
      const { data: updatedHotel, error: updateHotelError } = await supabase
        .from('hotels')
        .update({ 
          stars: 5,
          price_range_max: 500
        })
        .eq('id', createdHotel.id)
        .select()
        .single();

      if (updateHotelError) {
        console.error('   ❌ UPDATE failed:', updateHotelError.message);
      } else {
        console.log('   ✅ UPDATE successful: Stars changed to', updatedHotel.stars);
        testResults.hotels.update = true;
      }

      // DELETE - Test deleting hotel
      console.log('\n4. 🗑️ Testing DELETE operation...');
      const { error: deleteHotelError } = await supabase
        .from('hotels')
        .delete()
        .eq('id', createdHotel.id);

      if (deleteHotelError) {
        console.error('   ❌ DELETE failed:', deleteHotelError.message);
      } else {
        console.log('   ✅ DELETE successful: Test hotel removed');
        testResults.hotels.delete = true;
      }
    }

    // ========== TRANSPORTS CRUD TESTING ==========
    console.log('\n\n🚗 TESTING TRANSPORTS CRUD OPERATIONS:');
    
    // CREATE - Test adding new transport
    console.log('\n1. 📝 Testing CREATE operation...');
    const newTransport = {
      label: 'Test Transport CRUD',
      cost_per_day: 150,
      type: 'Testing',
      description: 'Test transport for CRUD operations',
      image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop',
      is_active: true
    };

    const { data: createdTransport, error: createTransportError } = await supabase
      .from('transports')
      .insert([newTransport])
      .select()
      .single();

    if (createTransportError) {
      console.error('   ❌ CREATE failed:', createTransportError.message);
    } else {
      console.log('   ✅ CREATE successful:', createdTransport.label);
      testResults.transports.create = true;
    }

    // READ - Test fetching transports
    console.log('\n2. 👀 Testing READ operation...');
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

    // UPDATE - Test updating transport
    if (createdTransport) {
      console.log('\n3. ✏️ Testing UPDATE operation...');
      const { data: updatedTransport, error: updateTransportError } = await supabase
        .from('transports')
        .update({ 
          cost_per_day: 200,
          description: 'Updated test transport description'
        })
        .eq('id', createdTransport.id)
        .select()
        .single();

      if (updateTransportError) {
        console.error('   ❌ UPDATE failed:', updateTransportError.message);
      } else {
        console.log('   ✅ UPDATE successful: Cost changed to', updatedTransport.cost_per_day);
        testResults.transports.update = true;
      }

      // DELETE - Test deleting transport
      console.log('\n4. 🗑️ Testing DELETE operation...');
      const { error: deleteTransportError } = await supabase
        .from('transports')
        .delete()
        .eq('id', createdTransport.id);

      if (deleteTransportError) {
        console.error('   ❌ DELETE failed:', deleteTransportError.message);
      } else {
        console.log('   ✅ DELETE successful: Test transport removed');
        testResults.transports.delete = true;
      }
    }

    // ========== RESULTS SUMMARY ==========
    console.log('\n\n📊 CRUD OPERATIONS TEST RESULTS:');
    console.log('==========================================');
    
    Object.keys(testResults).forEach(table => {
      console.log(`\n${table.toUpperCase()}:`);
      const results = testResults[table];
      console.log(`   CREATE: ${results.create ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   READ:   ${results.read ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   UPDATE: ${results.update ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   DELETE: ${results.delete ? '✅ PASSED' : '❌ FAILED'}`);
    });

    // Calculate overall success rate
    const totalTests = Object.values(testResults).reduce((total, table) => {
      return total + Object.values(table).filter(Boolean).length;
    }, 0);
    const maxTests = Object.keys(testResults).length * 4; // 4 operations per table
    const successRate = Math.round((totalTests / maxTests) * 100);

    console.log(`\n🎯 Overall Success Rate: ${successRate}% (${totalTests}/${maxTests} operations passed)`);
    
    if (successRate === 100) {
      console.log('🎉 Perfect! All CRUD operations are working correctly!');
    } else {
      console.log('⚠️ Some CRUD operations need attention. Check the failures above.');
    }

  } catch (error) {
    console.error('❌ CRUD test failed with error:', error);
  }
}

testCrudOperations();
