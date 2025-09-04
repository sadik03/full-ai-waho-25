# Supabase Database Setup Guide

This guide will help you upload all UAE travel data (attractions, hotels, transport) to your Supabase database.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project in your Supabase dashboard
3. **Node.js**: Ensure you have Node.js installed

## 🚀 Quick Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project name (e.g., "UAE Travel Database")
5. Enter a secure database password
6. Select a region (choose closest to your users)
7. Click "Create new project"

### Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xyz123.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire content from `database/schema.sql`
4. Click "Run" to execute the SQL
5. Verify tables are created in **Table Editor**

### Step 5: Upload Data

Run the upload script to populate your database:

```bash
# Upload all data
npm run db:upload

# Or upload with clearing existing data first
npm run db:upload:clear
```

## 📊 What Gets Uploaded

The script will upload:

- **🏛️ Attractions**: ~1000+ UAE attractions with pricing and images
- **🏨 Hotels**: Multiple hotel categories with star ratings and pricing
- **🚗 Transport**: Various transport options with daily costs

## 🔍 Database Schema

### Attractions Table
```sql
- id (Primary Key)
- emirates (varchar) - Emirate location
- attraction (varchar) - Attraction name  
- price (decimal) - Adult price in AED
- child_price (decimal) - Child price in AED
- infant_price (decimal) - Infant price in AED
- image_url (text) - Image URL
- created_at, updated_at (timestamps)
```

### Hotels Table
```sql
- id (Primary Key)
- name (varchar) - Hotel name
- stars (integer) - Star rating (1-5)
- cost_per_night (varchar) - Price range per night
- category (varchar) - Hotel category
- image_url (text) - Image URL
- created_at, updated_at (timestamps)
```

### Transport Table
```sql
- id (Primary Key)
- transport_id (varchar) - Unique transport identifier
- label (varchar) - Transport type name
- cost_per_day (decimal) - Daily cost in AED
- image_url (text) - Image URL
- created_at, updated_at (timestamps)
```

## 🛠️ Using the Data in Your App

### Option 1: Use Supabase Service (Recommended)

Replace your current data imports:

```typescript
// Old way
import { attractionsData, hotelData, transportData } from '../data/attractions'

// New way - use Supabase service
import { DataService } from '../services/supabaseService'

// Get all data
const { attractionsData, hotelData, transportData } = await DataService.getAllData()

// Get filtered data
const filteredData = await DataService.getFilteredData({
  emirates: ['Dubai', 'Abu Dhabi'],
  budget: 'medium',
  familyFriendly: true
})
```

### Option 2: Direct Supabase Queries

```typescript
import { supabase } from '../config/supabaseConfig'

// Get all attractions
const { data: attractions } = await supabase
  .from('attractions')
  .select('*')

// Get Dubai attractions under 200 AED
const { data: dubaiAttractions } = await supabase
  .from('attractions')
  .select('*')
  .eq('emirates', 'Dubai')
  .lte('price', 200)
```

## 🔒 Security & RLS

The setup includes Row Level Security (RLS) policies that allow:
- ✅ Public read access to all tables
- ✅ Public insert access for data uploads
- ❌ No update/delete access (modify as needed)

**For Production**: Review and customize the RLS policies in `database/schema.sql`

## 🧹 Maintenance Commands

```bash
# Re-upload all data (clears first)
npm run db:upload:clear

# Upload without clearing
npm run db:upload

# Check upload status
# (The script includes verification)
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot connect to Supabase"**
   - Check your `.env` file has correct URL and key
   - Verify your Supabase project is active

2. **"Relation does not exist"**
   - Run the SQL schema first in Supabase SQL Editor
   - Ensure all tables are created

3. **"RLS Policy violation"**
   - The schema includes public access policies
   - Check if RLS is enabled and policies are applied

4. **Upload fails with rate limits**
   - The script includes automatic delays
   - Supabase free tier has generous limits

### Getting Help:

1. Check the Supabase dashboard logs
2. Verify table structure in Table Editor
3. Test connection with a simple query in SQL Editor

## 📈 Performance Tips

1. **Indexes**: The schema includes optimized indexes for common queries
2. **Caching**: Use the built-in `CacheService` for frequently accessed data
3. **Filtering**: Always filter at the database level rather than in-app
4. **Batch Operations**: The upload script uses batching for large datasets

## 🎯 Next Steps

After successful upload:

1. ✅ Verify data in Supabase Table Editor
2. ✅ Test queries in SQL Editor  
3. ✅ Update your React components to use Supabase service
4. ✅ Set up real-time subscriptions if needed
5. ✅ Configure backup policies in Supabase

## 📞 Support

- 📚 [Supabase Documentation](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐛 [Report Issues](https://github.com/supabase/supabase/issues)

---

**🎉 Your UAE Travel Database is now ready for production!**
