import { createClient } from '@supabase/supabase-js';

// Test database policies and permissions
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabasePolicies() {
  console.log('🔐 Testing Database Policies and Permissions...\n');

  try {
    // Test with service key instead of anon key
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmYmRlZGdrb252Y3h2aHNicGhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU4NzI1MSwiZXhwIjoyMDcyMTYzMjUxfQ.cqDMQe8ELx4b4oj3DojFr9AzwKk5zn_Q6qhzSxEP_BA';
    const serviceSupabase = createClient(supabaseUrl, serviceKey);

    console.log('1️⃣ Testing with SERVICE KEY (bypass RLS)...');
    
    // Create test record with service key
    const { data: testRecord, error: createError } = await serviceSupabase
      .from('attractions')
      .insert([{
        attraction: 'SERVICE KEY TEST',
        emirates: 'Dubai',
        price: 25,
        image_url: 'https://example.com/service-test.jpg',
        description: 'Service key test record',
        category: 'Service Test',
        duration: '15 minutes',
        rating: 2.5,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('❌ Service key CREATE failed:', createError);
      return;
    }

    console.log(`✅ Service key created record: ID ${testRecord.id}`);

    // Try to delete with service key
    const { error: serviceDeleteError } = await serviceSupabase
      .from('attractions')
      .delete()
      .eq('id', testRecord.id);

    if (serviceDeleteError) {
      console.error('❌ Service key DELETE failed:', serviceDeleteError);
    } else {
      console.log('✅ Service key DELETE completed');
    }

    // Verify with service key
    const { data: afterServiceDelete, error: verifyServiceError } = await serviceSupabase
      .from('attractions')
      .select('*')
      .eq('id', testRecord.id);

    if (verifyServiceError) {
      console.error('❌ Service key verification failed:', verifyServiceError);
    } else {
      console.log(`📋 After service delete: Found ${afterServiceDelete?.length || 0} records`);
      if (afterServiceDelete && afterServiceDelete.length === 0) {
        console.log('🎉 SERVICE KEY DELETE SUCCESSFUL!');
      } else {
        console.log('⚠️ SERVICE KEY DELETE ALSO FAILED!');
      }
    }

    // Test anon key permissions specifically
    console.log('\n2️⃣ Testing ANON KEY permissions...');
    
    // Try different delete approaches with anon key
    const { data: anonTestRecord, error: anonCreateError } = await supabase
      .from('attractions')
      .insert([{
        attraction: 'ANON KEY TEST',
        emirates: 'Dubai',
        price: 15,
        image_url: 'https://example.com/anon-test.jpg',
        description: 'Anon key test record',
        category: 'Anon Test',
        duration: '10 minutes',
        rating: 1.5,
        is_active: true
      }])
      .select()
      .single();

    if (anonCreateError) {
      console.error('❌ Anon key CREATE failed:', anonCreateError);
    } else {
      console.log(`✅ Anon key created record: ID ${anonTestRecord.id}`);

      // Try delete with anon key using different methods
      console.log('🔄 Trying anon delete method 1: Standard delete...');
      const { error: anonDelete1 } = await supabase
        .from('attractions')
        .delete()
        .eq('id', anonTestRecord.id);

      console.log('Delete error:', anonDelete1 || 'No error');

      console.log('🔄 Trying anon delete method 2: Delete with count...');
      const { count, error: anonDelete2 } = await supabase
        .from('attractions')
        .delete({ count: 'exact' })
        .eq('id', anonTestRecord.id);

      console.log('Delete count:', count, 'Error:', anonDelete2 || 'No error');

      // Clean up with service key if anon failed
      if (anonDelete1 || count === 0) {
        console.log('🧹 Cleaning up with service key...');
        await serviceSupabase
          .from('attractions')
          .delete()
          .eq('id', anonTestRecord.id);
      }
    }

    // Check RLS policies info
    console.log('\n3️⃣ Checking RLS policy information...');
    
    // This won't work with anon key, but let's try to get some info
    const { data: policyInfo, error: policyError } = await serviceSupabase
      .from('pg_policies')
      .select('*')
      .in('tablename', ['attractions', 'hotels']);

    if (policyError) {
      console.log('ℹ️ Cannot access RLS policy information (expected)');
    } else {
      console.log('📋 RLS Policies found:', policyInfo?.length || 0);
    }

    // Final cleanup - remove test records with service key
    console.log('\n4️⃣ Final cleanup...');
    const { error: cleanupError } = await serviceSupabase
      .from('attractions')
      .delete()
      .in('attraction', ['DELETE TEST Attraction', 'SERVICE KEY TEST', 'ANON KEY TEST']);

    const { error: cleanupHotelError } = await serviceSupabase
      .from('hotels')
      .delete()
      .eq('name', 'DELETE TEST Hotel');

    if (cleanupError || cleanupHotelError) {
      console.log('⚠️ Some cleanup errors occurred');
    } else {
      console.log('✅ Cleanup completed');
    }

  } catch (error) {
    console.error('❌ Policy test failed:', error);
  }
}

testDatabasePolicies();
