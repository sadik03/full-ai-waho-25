import { createClient } from '@supabase/supabase-js';

// Test what operations actually work
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAllPermissions() {
  console.log('🔐 Testing ALL Database Permissions...\n');

  try {
    // Test which operations actually work
    console.log('1️⃣ Testing CREATE (INSERT) permissions...');
    const { data: testRecord, error: createError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'PERMISSION TEST',
        emirates: 'Dubai',
        price: 35,
        image_url: 'https://example.com/permission-test.jpg',
        description: 'Testing all permissions',
        category: 'Permission Test',
        duration: '30 minutes',
        rating: 3.0,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('❌ CREATE failed:', createError);
    } else {
      console.log(`✅ CREATE successful: ID ${testRecord.id}`);

      // Test READ permissions
      console.log('\n2️⃣ Testing READ (SELECT) permissions...');
      const { data: readData, error: readError } = await supabase
        .from('attractions')
        .select('*')
        .eq('id', testRecord.id)
        .single();

      if (readError) {
        console.error('❌ READ failed:', readError);
      } else {
        console.log('✅ READ successful');
      }

      // Test UPDATE permissions
      console.log('\n3️⃣ Testing UPDATE permissions...');
      const { data: updateData, error: updateError } = await supabase
        .from('attractions')
        .update({ price: 45 })
        .eq('id', testRecord.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ UPDATE failed:', updateError);
        console.log('   Trying UPDATE without SELECT...');
        
        const { error: updateError2 } = await supabase
          .from('attractions')
          .update({ price: 55 })
          .eq('id', testRecord.id);
        
        if (updateError2) {
          console.error('❌ UPDATE (no select) also failed:', updateError2);
        } else {
          console.log('✅ UPDATE (no select) successful');
        }
      } else {
        console.log('✅ UPDATE successful');
      }

      // Test DELETE permissions
      console.log('\n4️⃣ Testing DELETE permissions...');
      const { error: deleteError } = await supabase
        .from('attractions')
        .delete()
        .eq('id', testRecord.id);

      if (deleteError) {
        console.error('❌ DELETE failed:', deleteError);
      } else {
        console.log('✅ DELETE successful');
        
        // Verify deletion
        const { data: verifyData, error: verifyError } = await supabase
          .from('attractions')
          .select('*')
          .eq('id', testRecord.id);

        if (verifyError) {
          console.error('❌ Verification failed:', verifyError);
        } else {
          console.log(`📋 After delete: Found ${verifyData.length} records`);
        }
      }

      // Test specific field updates if general update failed
      console.log('\n5️⃣ Testing specific field updates...');
      
      // Try updating different fields one by one
      const fieldsToTest = [
        { field: 'description', value: 'Updated description' },
        { field: 'price', value: 60 },
        { field: 'is_active', value: false },
        { field: 'rating', value: 2.5 }
      ];

      for (const field of fieldsToTest) {
        console.log(`   Testing ${field.field} update...`);
        const { error: fieldError } = await supabase
          .from('attractions')
          .update({ [field.field]: field.value })
          .eq('id', testRecord.id);

        if (fieldError) {
          console.log(`   ❌ ${field.field}: ${fieldError.message}`);
        } else {
          console.log(`   ✅ ${field.field}: Success`);
        }
      }

      // Test transports (which worked in our earlier tests)
      console.log('\n6️⃣ Testing transports table for comparison...');
      
      const { data: transportTest, error: transportCreateError } = await supabase
        .from('transports')
        .insert([{
          label: 'PERMISSION TEST Transport',
          cost_per_day: 120,
          type: 'Test Vehicle',
          description: 'Testing transport permissions',
          image_url: 'https://example.com/transport-test.jpg',
          is_active: true
        }])
        .select()
        .single();

      if (transportCreateError) {
        console.error('❌ Transport CREATE failed:', transportCreateError);
      } else {
        console.log(`✅ Transport CREATE successful: ID ${transportTest.id}`);

        // Test transport update
        const { error: transportUpdateError } = await supabase
          .from('transports')
          .update({ cost_per_day: 150 })
          .eq('id', transportTest.id);

        if (transportUpdateError) {
          console.error('❌ Transport UPDATE failed:', transportUpdateError);
        } else {
          console.log('✅ Transport UPDATE successful');
        }

        // Test transport delete
        const { error: transportDeleteError } = await supabase
          .from('transports')
          .delete()
          .eq('id', transportTest.id);

        if (transportDeleteError) {
          console.error('❌ Transport DELETE failed:', transportDeleteError);
        } else {
          console.log('✅ Transport DELETE successful');
        }
      }
    }

  } catch (error) {
    console.error('❌ Permission test failed:', error);
  }
}

testAllPermissions();
