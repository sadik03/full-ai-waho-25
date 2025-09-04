import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

console.log('🔍 Inspecting Transport Table Structure')
console.log('============================================================')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectTransportTable() {
  try {
    console.log('\n🚗 Getting sample transport record...')
    const { data: transport, error } = await supabase
      .from('transports')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Transport query error:', error)
      return
    }

    if (transport && transport.length > 0) {
      console.log('📝 Transport table structure:')
      console.log(JSON.stringify(transport[0], null, 2))
      console.log('\n📋 Available fields:')
      Object.keys(transport[0]).forEach(field => {
        console.log(`   - ${field}`)
      })
    } else {
      console.log('⚠️ No transport records found')
    }

    // Also try to get a count
    const { count, error: countError } = await supabase
      .from('transports')
      .select('*', { count: 'exact', head: true })
    
    if (!countError) {
      console.log(`\n📊 Total transport records: ${count}`)
    }
    
  } catch (error) {
    console.error('❌ Transport table inspection failed:', error)
  }
}

inspectTransportTable()
