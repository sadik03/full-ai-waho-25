import { supabase } from './supabaseClient.js'

// Check database connection and table structure
async function checkDatabaseConnection() {
  console.log('🔍 CHECKING DATABASE CONNECTION')
  console.log('=' .repeat(60))
  
  try {
    // Test basic connection
    console.log('📡 Testing Supabase connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('attractions')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError)
      return
    }
    
    console.log('✅ Database connection successful!')
    
    // Check what tables exist
    console.log('\n📋 Checking table structure...')
    
    // Check attractions table
    console.log('\n🎯 ATTRACTIONS TABLE:')
    const { data: attractions, error: attractionsError } = await supabase
      .from('attractions')
      .select('*')
      .limit(5)
    
    if (attractionsError) {
      console.error('❌ Attractions table error:', attractionsError)
    } else {
      console.log(`   📊 Found ${attractions.length} attraction records`)
      if (attractions.length > 0) {
        console.log('   📝 Sample record structure:')
        console.log('   ', attractions[0])
      }
    }
    
    // Check hotels table
    console.log('\n🏨 HOTELS TABLE:')
    const { data: hotels, error: hotelsError } = await supabase
      .from('hotels')
      .select('*')
      .limit(5)
    
    if (hotelsError) {
      console.error('❌ Hotels table error:', hotelsError)
    } else {
      console.log(`   📊 Found ${hotels.length} hotel records`)
      if (hotels.length > 0) {
        console.log('   📝 Sample record structure:')
        console.log('   ', hotels[0])
      }
    }
    
    // Check transport table
    console.log('\n🚗 TRANSPORT TABLE:')
    const { data: transport, error: transportError } = await supabase
      .from('transport')
      .select('*')
      .limit(5)
    
    if (transportError) {
      console.error('❌ Transport table error:', transportError)
    } else {
      console.log(`   📊 Found ${transport.length} transport records`)
      if (transport.length > 0) {
        console.log('   📝 Sample record structure:')
        console.log('   ', transport[0])
      }
    }
    
    // Get table counts
    console.log('\n📈 DATABASE SUMMARY:')
    
    const { count: attractionCount } = await supabase
      .from('attractions')
      .select('*', { count: 'exact', head: true })
      
    const { count: hotelCount } = await supabase
      .from('hotels')
      .select('*', { count: 'exact', head: true })
      
    const { count: transportCount } = await supabase
      .from('transport')
      .select('*', { count: 'exact', head: true })
    
    console.log(`   🎯 Total Attractions: ${attractionCount || 0}`)
    console.log(`   🏨 Total Hotels: ${hotelCount || 0}`)
    console.log(`   🚗 Total Transport: ${transportCount || 0}`)
    
    console.log('\n✅ Database connection check completed!')
    
  } catch (error) {
    console.error('💥 Database check failed:', error.message)
    console.log('\n🔧 Troubleshooting steps:')
    console.log('1. Check your .env file has correct Supabase credentials')
    console.log('2. Verify Supabase project is active and accessible')
    console.log('3. Check if tables exist in Supabase dashboard')
    console.log('4. Run database schema.sql script if tables are missing')
  }
}

// Run the check
checkDatabaseConnection()
