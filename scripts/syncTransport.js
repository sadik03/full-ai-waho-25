import { supabase } from './supabaseClient.js'
import { transportData } from './transportData.js'

// Sync transport data from local file to database
async function syncTransportData() {
  console.log('🚗 Syncing transport data to database...')
  console.log('=' .repeat(50))
  
  try {
    // Check current transport in database
    const { data: currentTransport, error: fetchError } = await supabase
      .from('transport')
      .select('*')
    
    if (fetchError) {
      console.error('❌ Error fetching current transport:', fetchError)
      return
    }
    
    console.log(`📊 Current transport in database: ${currentTransport.length}`)
    console.log(`📁 Transport in local file: ${transportData.length}`)
    
    // Transform data for database
    const transformedTransport = transportData.map(transport => ({
      transport_id: transport.id,
      label: transport.label,
      cost_per_day: transport.costPerDay,
      image_url: transport.ImageUrl
    }))
    
    // Delete all existing transport and insert new ones
    console.log('🗑️ Clearing existing transport...')
    const { error: deleteError } = await supabase
      .from('transport')
      .delete()
      .neq('id', 0) // Delete all records
    
    if (deleteError) {
      console.error('❌ Error deleting existing transport:', deleteError)
      return
    }
    
    console.log('📤 Inserting updated transport...')
    const { data: insertedTransport, error: insertError } = await supabase
      .from('transport')
      .insert(transformedTransport)
      .select()
    
    if (insertError) {
      console.error('❌ Error inserting transport:', insertError)
      return
    }
    
    console.log('✅ Transport sync completed successfully!')
    console.log(`📊 Inserted ${insertedTransport.length} transport options`)
    
    // Display synced transport
    console.log('\n🚗 Synced Transport:')
    insertedTransport.forEach(transport => {
      console.log(`   • ${transport.label} - ${transport.cost_per_day} AED/day`)
    })
    
  } catch (error) {
    console.error('💥 Sync failed:', error.message)
  }
}

// Run the sync
syncTransportData()
