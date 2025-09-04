import { supabase } from './supabaseClient.js'
import { hotelsData } from './hotelsData.js'

// Sync hotels data from local file to database
async function syncHotelsData() {
  console.log('🏨 Syncing hotels data to database...')
  console.log('=' .repeat(50))
  
  try {
    // Check current hotels in database
    const { data: currentHotels, error: fetchError } = await supabase
      .from('hotels')
      .select('*')
    
    if (fetchError) {
      console.error('❌ Error fetching current hotels:', fetchError)
      return
    }
    
    console.log(`📊 Current hotels in database: ${currentHotels.length}`)
    console.log(`📁 Hotels in local file: ${hotelsData.length}`)
    
    // Transform data for database
    const transformedHotels = hotelsData.map(hotel => ({
      name: hotel.name,
      stars: hotel.stars,
      cost_per_night: hotel.costPerNight, // Store range format as VARCHAR
      category: hotel.category,
      image_url: hotel.ImageUrl,
      description: hotel.description
    }))
    
    // Delete all existing hotels and insert new ones
    console.log('🗑️ Clearing existing hotels...')
    const { error: deleteError } = await supabase
      .from('hotels')
      .delete()
      .neq('id', 0) // Delete all records
    
    if (deleteError) {
      console.error('❌ Error deleting existing hotels:', deleteError)
      return
    }
    
    console.log('📤 Inserting updated hotels...')
    const { data: insertedHotels, error: insertError } = await supabase
      .from('hotels')
      .insert(transformedHotels)
      .select()
    
    if (insertError) {
      console.error('❌ Error inserting hotels:', insertError)
      return
    }
    
    console.log('✅ Hotels sync completed successfully!')
    console.log(`📊 Inserted ${insertedHotels.length} hotels`)
    
    // Display synced hotels
    console.log('\n🏨 Synced Hotels:')
    insertedHotels.forEach(hotel => {
      console.log(`   • ${hotel.name} (${hotel.stars}⭐) - ${hotel.cost_per_night}`)
    })
    
  } catch (error) {
    console.error('💥 Sync failed:', error.message)
  }
}

// Run the sync
syncHotelsData()
