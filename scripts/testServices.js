import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

console.log('🧪 Testing Database Connection')
console.log('============================================================')

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabaseQueries() {
  try {
    // Test Attractions
    console.log('\n🎯 Testing Attractions query...')
    const { data: attractions, error: attractionsError } = await supabase
      .from('attractions')
      .select('*')
      .order('name', { ascending: true })
      .limit(3)
    
    if (attractionsError) throw attractionsError
    console.log(`✅ Found ${attractions.length} attractions`)
    if (attractions.length > 0) {
      console.log(`📝 Sample attraction: ${attractions[0].name} in ${attractions[0].emirates}`)
    }

    // Test Hotels
    console.log('\n🏨 Testing Hotels query...')
    const { data: hotels, error: hotelsError } = await supabase
      .from('hotels')
      .select('*')
      .order('stars', { ascending: false })
      .limit(3)
    
    if (hotelsError) throw hotelsError
    console.log(`✅ Found ${hotels.length} hotels`)
    if (hotels.length > 0) {
      console.log(`📝 Sample hotel: ${hotels[0].name} - ${hotels[0].stars} stars`)
    }

    // Test Transport
    console.log('\n🚗 Testing Transport query...')
    const { data: transport, error: transportError } = await supabase
      .from('transports')
      .select('*')
      .order('label', { ascending: true })
      .limit(3)
    
    if (transportError) throw transportError
    console.log(`✅ Found ${transport.length} transport options`)
    if (transport.length > 0) {
      console.log(`📝 Sample transport: ${transport[0].label} - ${transport[0].cost_per_day} AED/day`)
      console.log(`📋 Transport fields:`, Object.keys(transport[0]))
    }

    console.log('\n🎉 All database queries working correctly!')
    
  } catch (error) {
    console.error('❌ Database query test failed:', error)
  }
}

testDatabaseQueries()
