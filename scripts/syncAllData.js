import { supabase } from './supabaseClient.js'
import { hotelsData } from './hotelsData.js'
import { transportData } from './transportData.js'

// Sync all data from local files to database
async function syncAllData() {
  console.log('🔄 SYNCING ALL DATA TO DATABASE')
  console.log('=' .repeat(60))
  
  try {
    // 1. Sync Hotels
    console.log('\n🏨 SYNCING HOTELS...')
    const transformedHotels = hotelsData.map(hotel => ({
      name: hotel.name,
      stars: hotel.stars,
      cost_per_night: hotel.costPerNight,
      category: hotel.category,
      image_url: hotel.ImageUrl,
      description: hotel.description
    }))
    
    // Clear and insert hotels
    await supabase.from('hotels').delete().neq('id', 0)
    const { data: insertedHotels, error: hotelsError } = await supabase
      .from('hotels')
      .insert(transformedHotels)
      .select()
    
    if (hotelsError) {
      console.error('❌ Hotels sync failed:', hotelsError)
    } else {
      console.log(`✅ Hotels synced: ${insertedHotels.length} records`)
    }
    
    // 2. Sync Transport
    console.log('\n🚗 SYNCING TRANSPORT...')
    const transformedTransport = transportData.map(transport => ({
      transport_id: transport.id,
      label: transport.label,
      cost_per_day: transport.costPerDay,
      image_url: transport.ImageUrl
    }))
    
    // Clear and insert transport
    await supabase.from('transport').delete().neq('id', 0)
    const { data: insertedTransport, error: transportError } = await supabase
      .from('transport')
      .insert(transformedTransport)
      .select()
    
    if (transportError) {
      console.error('❌ Transport sync failed:', transportError)
    } else {
      console.log(`✅ Transport synced: ${insertedTransport.length} records`)
    }
    
    // 3. Verify final state
    console.log('\n🔍 VERIFICATION:')
    
    const { count: hotelCount } = await supabase
      .from('hotels')
      .select('*', { count: 'exact', head: true })
      
    const { count: transportCount } = await supabase
      .from('transport')
      .select('*', { count: 'exact', head: true })
      
    const { count: attractionCount } = await supabase
      .from('attractions')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Final database state:`)
    console.log(`   🏨 Hotels: ${hotelCount}`)
    console.log(`   🚗 Transport: ${transportCount}`)
    console.log(`   🎯 Attractions: ${attractionCount}`)
    
    console.log('\n🎉 ALL DATA SYNC COMPLETED SUCCESSFULLY!')
    
  } catch (error) {
    console.error('💥 Sync failed:', error.message)
  }
}

// Run the sync
syncAllData()
