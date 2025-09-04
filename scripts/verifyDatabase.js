import { supabase } from './supabaseClient.js'

// Verify database connection and display current data
async function verifyDatabase() {
  console.log('🔍 Verifying database connection and data...')
  console.log('=' .repeat(60))
  
  try {
    // Test connection
    console.log('📡 Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('hotels')
      .select('count', { count: 'exact', head: true })
    
    if (testError) {
      console.error('❌ Connection failed:', testError)
      return
    }
    
    console.log('✅ Database connection successful!')
    
    // Check Hotels
    console.log('\n🏨 HOTELS TABLE:')
    const { data: hotels, error: hotelsError } = await supabase
      .from('hotels')
      .select('*')
      .order('stars')
    
    if (hotelsError) {
      console.error('❌ Error fetching hotels:', hotelsError)
    } else {
      console.log(`   📊 Total hotels: ${hotels.length}`)
      hotels.forEach(hotel => {
        console.log(`   • ${hotel.name} (${hotel.stars}⭐)`)
        console.log(`     💰 Cost: ${hotel.cost_per_night}`)
        console.log(`     🏷️ Category: ${hotel.category}`)
        console.log('')
      })
    }
    
    // Check Transport
    console.log('\n🚗 TRANSPORT TABLE:')
    const { data: transport, error: transportError } = await supabase
      .from('transport')
      .select('*')
      .order('cost_per_day')
    
    if (transportError) {
      console.error('❌ Error fetching transport:', transportError)
    } else {
      console.log(`   📊 Total transport: ${transport.length}`)
      transport.forEach(t => {
        console.log(`   • ${t.label} - ${t.cost_per_day} AED/day`)
      })
    }
    
    // Check Attractions
    console.log('\n🎯 ATTRACTIONS TABLE:')
    const { data: attractions, error: attractionsError } = await supabase
      .from('attractions')
      .select('emirates, count(*)')
      .group('emirates')
    
    if (attractionsError) {
      console.error('❌ Error fetching attractions:', attractionsError)
    } else {
      console.log(`   📊 Attractions by emirate:`)
      attractions.forEach(a => {
        console.log(`   • ${a.emirates}: ${a.count} attractions`)
      })
    }
    
    console.log('\n✅ Database verification complete!')
    
  } catch (error) {
    console.error('💥 Verification failed:', error.message)
  }
}

// Run the verification
verifyDatabase()
