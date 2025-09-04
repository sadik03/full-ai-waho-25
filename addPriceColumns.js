import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ziahkjoksxweikhbceda.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWhram9rc3h3ZWlraGJjZWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTczMzYsImV4cCI6MjA3MjU3MzMzNn0.a7QBlN8fjQ6vpreQ2OA5cc9Ubi4LbTzWXei3AFw_M-o'
)

async function addPriceColumns() {
  try {
    console.log('🔧 Adding child_price and infant_price columns to attractions table...')
    
    // Try to add the columns using RPC (this might not work with anon key)
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE attractions 
        ADD COLUMN IF NOT EXISTS child_price DECIMAL(10,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS infant_price DECIMAL(10,2) DEFAULT 0;
      `
    })
    
    if (error) {
      console.log('❌ Cannot add columns via RPC:', error.message)
      console.log('📝 Please run this SQL manually in your Supabase dashboard:')
      console.log('ALTER TABLE attractions ADD COLUMN IF NOT EXISTS child_price DECIMAL(10,2) DEFAULT 0;')
      console.log('ALTER TABLE attractions ADD COLUMN IF NOT EXISTS infant_price DECIMAL(10,2) DEFAULT 0;')
      return false
    }
    
    console.log('✅ Columns added successfully')
    return true
  } catch (error) {
    console.error('💥 Error:', error)
    return false
  }
}

addPriceColumns()
