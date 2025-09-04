import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ziahkjoksxweikhbceda.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o'
)

async function checkColumns() {
  try {
    // Test if child_price and infant_price columns exist
    console.log('🔍 Checking database columns...')
    
    const { data, error } = await supabase
      .from('attractions')
      .select('id, emirates, name, price, child_price, infant_price, image_url')
      .limit(1)

    if (error) {
      console.log('❌ Error accessing columns:', error.message)
      
      // Try with just the basic columns
      const { data: basicData, error: basicError } = await supabase
        .from('attractions')
        .select('*')
        .limit(1)
      
      if (!basicError && basicData?.[0]) {
        console.log('✅ Available columns:', Object.keys(basicData[0]))
      }
    } else {
      console.log('✅ All columns exist:', Object.keys(data[0] || {}))
      console.log('📊 Sample data:', data[0])
    }
  } catch (error) {
    console.error('💥 Error:', error)
  }
}

checkColumns()
