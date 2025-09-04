import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('🔧 Please check your .env file contains:')
  console.log('   VITE_SUPABASE_URL=your_supabase_url')
  console.log('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
  process.exit(1)
}

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log('✅ Supabase client configured')
console.log('📡 URL:', supabaseUrl)
console.log('🔑 Key:', supabaseKey.substring(0, 20) + '...')
