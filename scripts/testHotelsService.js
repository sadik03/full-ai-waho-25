import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

console.log('🧪 Testing HotelsService Methods')
console.log('============================================================')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Simulate HotelsService methods
class TestHotelsService {
  static async getAllHotels() {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('stars', { ascending: false })
        .order('name', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching hotels:', error)
      throw error
    }
  }

  static async addHotel(hotelData) {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .insert([hotelData])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding hotel:', error)
      throw error
    }
  }
}

async function testHotelsService() {
  try {
    console.log('\n🔍 Testing getAllHotels...')
    const hotels = await TestHotelsService.getAllHotels()
    console.log(`✅ Found ${hotels.length} hotels`)
    
    if (hotels.length > 0) {
      const sampleHotel = hotels[0]
      console.log('\n📝 Sample hotel fields:')
      console.log('- id:', sampleHotel.id)
      console.log('- name:', sampleHotel.name)
      console.log('- stars:', sampleHotel.stars)
      console.log('- cost_per_night:', sampleHotel.cost_per_night)
      console.log('- location:', sampleHotel.location)
      console.log('- amenities:', sampleHotel.amenities)
      console.log('- image_url:', sampleHotel.image_url)
      console.log('- is_active:', sampleHotel.is_active)
      
      // Test calculations that would be used in the component
      const avgCost = Math.round(hotels.reduce((sum, h) => sum + h.cost_per_night, 0) / hotels.length)
      const fiveStarCount = hotels.filter(h => h.stars === 5).length
      const locations = new Set(hotels.map(h => h.location).filter(Boolean)).size
      
      console.log('\n📊 Component statistics would show:')
      console.log(`- Total Hotels: ${hotels.length}`)
      console.log(`- Avg. Cost/Night: AED ${avgCost}`)
      console.log(`- 5-Star Hotels: ${fiveStarCount}`)
      console.log(`- Locations: ${locations}`)
    }

    console.log('\n✅ HotelsService test completed successfully!')
    console.log('The component should now load data correctly from the database.')
    
  } catch (error) {
    console.error('❌ HotelsService test failed:', error)
  }
}

testHotelsService()
