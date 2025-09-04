import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ziahkjoksxweikhbceda.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o'

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectDatabase() {
  try {
    console.log('🔍 Inspecting attractions table structure...')
    
    // Try to get table info by selecting with limit 0 to see columns
    const { data, error } = await supabase
      .from('attractions')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error querying attractions table:', error)
      return
    }
    
    console.log('✅ Attractions table exists')
    
    if (data && data.length > 0) {
      console.log('📋 Sample record structure:')
      console.log(Object.keys(data[0]))
      console.log('📄 Sample data:')
      console.log(data[0])
    } else {
      console.log('📭 Table is empty')
      
      // Try to insert a test record to see what columns are expected
      console.log('🧪 Testing column structure with a sample insert...')
      
      const testRecord = {
        emirates: 'Test',
        attraction: 'Test Attraction',
        price: 0,
        child_price: 0,
        infant_price: 0,
        image_url: 'test.jpg'
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('attractions')
        .insert([testRecord])
        .select()
      
      if (insertError) {
        console.error('❌ Insert test failed:', insertError)
        console.log('💡 Trying with "name" instead of "attraction"...')
        
        const testRecord2 = {
          emirates: 'Test',
          name: 'Test Attraction',
          price: 0,
          child_price: 0,
          infant_price: 0,
          image_url: 'test.jpg'
        }
        
        const { data: insertData2, error: insertError2 } = await supabase
          .from('attractions')
          .insert([testRecord2])
          .select()
        
        if (insertError2) {
          console.error('❌ Insert with "name" also failed:', insertError2)
        } else {
          console.log('✅ Insert with "name" column succeeded!')
          console.log('📋 Correct column structure uses "name" not "attraction"')
          console.log(insertData2[0])
          
          // Clean up test record
          await supabase
            .from('attractions')
            .delete()
            .eq('emirates', 'Test')
        }
      } else {
        console.log('✅ Insert with "attraction" column succeeded!')
        console.log(insertData[0])
        
        // Clean up test record
        await supabase
          .from('attractions')
          .delete()
          .eq('emirates', 'Test')
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Run the inspection
inspectDatabase()
