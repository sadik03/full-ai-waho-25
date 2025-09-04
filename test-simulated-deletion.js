import { createClient } from '@supabase/supabase-js';

// Test the "simulated real deletion" approach
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimulatedRealDeletion() {
  console.log('🧪 Testing SIMULATED REAL DELETION for Attractions...\n');

  try {
    // Create a test attraction
    console.log('1️⃣ Creating test attraction...');
    const { data: testAttraction, error: createError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'SIMULATED DELETE TEST - Attraction',
        emirates: 'Dubai',
        price: 150,
        image_url: 'https://example.com/test-attraction.jpg',
        description: 'Testing simulated real deletion',
        category: 'Test',
        duration: '2 hours',
        rating: 4.5,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('❌ CREATE failed:', createError);
      return;
    }

    console.log(`✅ Test attraction created with ID: ${testAttraction.id}`);

    // Check it appears in the "active" list
    console.log('\n2️⃣ Checking if it appears in getAllAttractions (active only)...');
    const { data: beforeDelete, error: beforeError } = await supabase
      .from('attractions')
      .select('*')
      .eq('is_active', true)
      .eq('id', testAttraction.id);

    if (beforeError) {
      console.error('❌ Before check failed:', beforeError);
      return;
    }

    console.log(`📋 Found in active list: ${beforeDelete.length} records`);

    // Now do soft delete (mark as inactive)
    console.log('\n3️⃣ Performing soft delete (is_active = false)...');
    const { error: deleteError } = await supabase
      .from('attractions')
      .update({ is_active: false })
      .eq('id', testAttraction.id);

    if (deleteError) {
      console.error('❌ SOFT DELETE failed:', deleteError);
      return;
    }

    console.log('✅ Soft delete completed');

    // Check it disappears from the "active" list (simulating real deletion)
    console.log('\n4️⃣ Checking if it disappears from getAllAttractions...');
    const { data: afterDelete, error: afterError } = await supabase
      .from('attractions')
      .select('*')
      .eq('is_active', true)
      .eq('id', testAttraction.id);

    if (afterError) {
      console.error('❌ After check failed:', afterError);
      return;
    }

    console.log(`📋 Found in active list after delete: ${afterDelete.length} records`);

    if (afterDelete.length === 0) {
      console.log('\n🎉 SUCCESS! Simulated real deletion works perfectly!');
      console.log('✅ Attraction disappears from admin panel immediately (like transports)');
      console.log('✅ User experience is identical to real deletion');
      console.log('✅ But record is safely preserved in database with is_active=false');
    } else {
      console.log('\n⚠️ Simulated deletion failed - still appears in active list');
    }

    // Verify the record still exists in database (for recovery purposes)
    console.log('\n5️⃣ Verifying record still exists in database (for recovery)...');
    const { data: fullCheck, error: fullError } = await supabase
      .from('attractions')
      .select('*')
      .eq('id', testAttraction.id);

    if (fullError) {
      console.error('❌ Full check failed:', fullError);
      return;
    }

    console.log(`📋 Total records in database: ${fullCheck.length}`);
    if (fullCheck.length > 0) {
      console.log(`📊 Record status: is_active = ${fullCheck[0].is_active}`);
      console.log('✅ Record safely preserved for potential recovery');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSimulatedRealDeletion();
