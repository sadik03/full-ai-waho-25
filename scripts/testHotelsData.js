import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

console.log('🏨 Testing Hotels Data Loading')
console.log('============================================================')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testHotelsData() {
  try {
    console.log('\n🏨 Testing Hotels data loading...')
    
    // Get all hotels
    const { data: hotels, error } = await supabase
      .from('hotels')
      .select('*')
      .order('stars', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching hotels:', error)
      return
    }

    console.log(`✅ Successfully loaded ${hotels.length} hotels`)
    
    if (hotels.length > 0) {
      console.log('\n📋 Sample hotel data:')
      console.log('Hotel Name:', hotels[0].name)
      console.log('Stars:', hotels[0].stars)
      console.log('Cost per night:', hotels[0].cost_per_night)
      console.log('Location:', hotels[0].location)
      console.log('Amenities:', hotels[0].amenities)
      console.log('Image URL:', hotels[0].image_url)
      console.log('Is Active:', hotels[0].is_active)
      
      console.log('\n📊 Hotels Summary:')
      hotels.forEach((hotel, index) => {
        console.log(`${index + 1}. ${hotel.name} - ${hotel.stars} stars - AED ${hotel.cost_per_night}/night`)
      })
      
      // Test statistics
      const avgCost = Math.round(hotels.reduce((sum, h) => sum + h.cost_per_night, 0) / hotels.length)
      const fiveStarCount = hotels.filter(h => h.stars === 5).length
      const locations = new Set(hotels.map(h => h.location).filter(Boolean)).size
      
      console.log('\n📈 Statistics:')
      console.log(`Average cost per night: AED ${avgCost}`)
      console.log(`5-Star hotels: ${fiveStarCount}`)
      console.log(`Unique locations: ${locations}`)
    }

    console.log('\n🎉 Hotels data test completed successfully!')
    
  } catch (error) {
    console.error('❌ Hotels data test failed:', error)
  }
}

testHotelsData()
