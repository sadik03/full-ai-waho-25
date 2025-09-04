import { createClient } from '@supabase/supabase-js';

// Test real deletion for attractions after the fix
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAttractionRealDeletion() {
  console.log('🧪 Testing REAL DELETION for Attractions...\n');

  try {
    // Create a test attraction
    console.log('1️⃣ Creating test attraction...');
    const { data: testAttraction, error: createError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'REAL DELETE TEST - Attraction',
        emirates: 'Dubai',
        price: 100,
        image_url: 'https://example.com/test-attraction.jpg',
        description: 'Testing real deletion functionality',
        category: 'Test',
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

    console.log(`✅ Test attraction created with ID: ${testAttraction.id}`);

    // Now try to delete it using real deletion
    console.log('\n2️⃣ Attempting REAL deletion...');
    const { error: deleteError } = await supabase
      .from('attractions')
      .delete()
      .eq('id', testAttraction.id);

    if (deleteError) {
      console.error('❌ REAL DELETE failed:', deleteError);
      console.log('🔍 This means database permissions are still blocking real deletion');
      
      // Try to clean up with soft delete
      await supabase
        .from('attractions')
        .update({ is_active: false })
        .eq('id', testAttraction.id);
      
      return;
    }

    // Check if it's really gone
    console.log('\n3️⃣ Verifying deletion...');
    const { data: checkResult, error: checkError } = await supabase
      .from('attractions')
      .select('*')
      .eq('id', testAttraction.id);

    if (checkError) {
      console.error('❌ Verification failed:', checkError);
      return;
    }

    console.log(`📋 Records found after delete: ${checkResult.length}`);

    if (checkResult.length === 0) {
      console.log('\n🎉 SUCCESS! Real deletion is now working for attractions!');
      console.log('✅ Attractions can now be permanently deleted like transports');
    } else {
      console.log('\n⚠️ Deletion failed - record still exists');
      console.log('🔧 Database permissions may still be preventing real deletion');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAttractionRealDeletion();
