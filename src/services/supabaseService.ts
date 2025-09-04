import { supabase } from '../config/supabaseConfig'
import type { Attraction, Hotel, Transport, TravelSubmission, Booking } from '../config/supabaseConfig'

// Transport Service
export class TransportService {
  
  // Get all transport
  static async getAllTransport(): Promise<Transport[]> {
    try {
      const { data, error } = await supabase
        .from('transport') // ✅ fixed
        .select('*')
        .order('label', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching transport:', error)
      throw error
    }
  }

  // Get transport by price range
  static async getTransportByPriceRange(minPrice: number, maxPrice: number): Promise<Transport[]> {
    try {
      const { data, error } = await supabase
        .from('transport') // ✅ fixed
        .select('*')
        .gte('cost_per_day', minPrice)
        .lte('cost_per_day', maxPrice)
        .order('cost_per_day', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching transport by price range:', error)
      throw error
    }
  }

  // Get transport by ID
  static async getTransportById(transportId: string): Promise<Transport | null> {
    try {
      const { data, error } = await supabase
        .from('transport') // ✅ fixed
        .select('*')
        .eq('id', transportId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching transport by ID:', error)
      throw error
    }
  }

  // Add new transport
  static async addTransport(transportData: Omit<Transport, 'id' | 'created_at' | 'updated_at'>): Promise<Transport> {
    try {
      const { data, error } = await supabase
        .from('transport') // ✅ fixed
        .insert([transportData])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding transport:', error)
      throw error
    }
  }

  // Update transport
  static async updateTransport(id: number, transportData: Partial<Transport>): Promise<Transport> {
    try {
      const { data, error } = await supabase
        .from('transport') // ✅ fixed
        .update(transportData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating transport:', error)
      throw error
    }
  }

  // Delete transport
  static async deleteTransport(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('transport') // ✅ fixed
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting transport:', error)
      throw error
    }
  }
}


// Attractions Service
export class AttractionsService {
  
  // Get all attractions
  static async getAllAttractions(): Promise<Attraction[]> {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .order('emirates', { ascending: true })
        .order('attraction', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching attractions:', error)
      throw error
    }
  }

  // Get attractions by emirates
  static async getAttractionsByEmirates(emirates: string[]): Promise<Attraction[]> {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .in('emirates', emirates)
        .order('price', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching attractions by emirates:', error)
      throw error
    }
  }

  // Get attractions by price range
  static async getAttractionsByPriceRange(minPrice: number, maxPrice: number): Promise<Attraction[]> {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .gte('price', minPrice)
        .lte('price', maxPrice)
        .order('price', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching attractions by price range:', error)
      throw error
    }
  }

  // Get family-friendly attractions (has child pricing)
  static async getFamilyFriendlyAttractions(): Promise<Attraction[]> {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .gt('child_price', 0)
        .order('child_price', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching family-friendly attractions:', error)
      throw error
    }
  }

  // Search attractions by name
  static async searchAttractions(searchTerm: string): Promise<Attraction[]> {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .ilike('attraction', `%${searchTerm}%`)
        .order('attraction', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching attractions:', error)
      throw error
    }
  }

  // Add new attraction
  static async addAttraction(attractionData: Omit<Attraction, 'id' | 'created_at' | 'updated_at'>): Promise<Attraction> {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .insert([attractionData])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding attraction:', error)
      throw error
    }
  }

  // Update attraction
  static async updateAttraction(id: number, attractionData: Partial<Attraction>): Promise<Attraction> {
    try {
      // First perform the update (without select)
      const { error: updateError } = await supabase
        .from('attractions')
        .update(attractionData)
        .eq('id', id)
      
      if (updateError) throw updateError
      
      // Then fetch the updated record separately
      const { data, error: fetchError } = await supabase
        .from('attractions')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      return data
    } catch (error) {
      console.error('Error updating attraction:', error)
      throw error
    }
  }

  // Delete attraction (real database deletion like transports)
  static async deleteAttraction(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('attractions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting attraction:', error)
      throw error
    }
  }
}

// Hotels Service
export class HotelsService {
  
  // Get all hotels (exclude soft-deleted ones)
  static async getAllHotels(): Promise<Hotel[]> {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .not('name', 'ilike', '[DELETED%')  // Filter out soft-deleted hotels
        .order('stars', { ascending: false })
        .order('name', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching hotels:', error)
      throw error
    }
  }

  // Get hotels by star rating
  static async getHotelsByStars(stars: number[]): Promise<Hotel[]> {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .in('stars', stars)
        .order('stars', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching hotels by stars:', error)
      throw error
    }
  }

  // Get hotels by category
  static async getHotelsByCategory(category: string): Promise<Hotel[]> {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .ilike('category', `%${category}%`)
        .order('stars', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching hotels by category:', error)
      throw error
    }
  }

  // Add new hotel
  static async addHotel(hotelData: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>): Promise<Hotel> {
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

  // Update hotel
  static async updateHotel(id: number, hotelData: Partial<Hotel>): Promise<Hotel> {
    try {
      // First perform the update (without select)
      const { error: updateError } = await supabase
        .from('hotels')
        .update(hotelData)
        .eq('id', id)
      
      if (updateError) throw updateError
      
      // Then fetch the updated record separately
      const { data, error: fetchError } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      return data
    } catch (error) {
      console.error('Error updating hotel:', error)
      throw error
    }
  }

  // Delete hotel (using soft delete via hidden status)
  static async deleteHotel(id: number): Promise<void> {
    try {
      // Mark as deleted by updating name and description
      const timestamp = new Date().toISOString();
      const { error } = await supabase
        .from('hotels')
        .update({ 
          name: `[DELETED-${timestamp}]`,
          description: `[DELETED] Removed on ${timestamp}`
        })
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting hotel:', error)
      throw error
    }
  }
}

// Combined Data Service (for backward compatibility with existing code)
export class DataService {
  
  // Get all data (equivalent to current attractionsData, hotelData, transportData)
  static async getAllData() {
    try {
      const [attractions, hotels, transport] = await Promise.all([
        AttractionsService.getAllAttractions(),
        HotelsService.getAllHotels(),
        TransportService.getAllTransport()
      ])
      
      return {
        attractionsData: attractions,
        hotelData: hotels,
        transportData: transport
      }
    } catch (error) {
      console.error('Error fetching all data:', error)
      throw error
    }
  }

  // Get filtered data based on travel form (for AIGenerate compatibility)
  static async getFilteredData(filters: {
    emirates?: string[]
    budget?: string
    priceRange?: { min: number, max: number }
    familyFriendly?: boolean
  }) {
    try {
      let attractionsPromise = AttractionsService.getAllAttractions()
      
      // Apply filters
      if (filters.emirates && !filters.emirates.includes('all')) {
        attractionsPromise = AttractionsService.getAttractionsByEmirates(filters.emirates)
      }
      
      if (filters.priceRange) {
        attractionsPromise = AttractionsService.getAttractionsByPriceRange(
          filters.priceRange.min, 
          filters.priceRange.max
        )
      }
      
      if (filters.familyFriendly) {
        attractionsPromise = AttractionsService.getFamilyFriendlyAttractions()
      }
      
      const [attractions, hotels, transport] = await Promise.all([
        attractionsPromise,
        HotelsService.getAllHotels(),
        TransportService.getAllTransport()
      ])
      
      return {
        filteredAttractions: attractions,
        filteredHotels: hotels,
        filteredTransport: transport
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error)
      throw error
    }
  }
}

// Cache service for better performance
export class CacheService {
  private static cache = new Map()
  private static cacheExpiry = 5 * 60 * 1000 // 5 minutes

  static async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data
    }
    
    const data = await fetcher()
    this.cache.set(key, { data, timestamp: Date.now() })
    
    return data
  }

  static clear(key?: string) {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }
}

// Travel Submissions Service
export class TravelSubmissionService {
  static async getAllSubmissions(): Promise<TravelSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('travel_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching travel submissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Travel submissions service error:', error);
      throw error;
    }
  }

  static async addSubmission(submission: Omit<TravelSubmission, 'id' | 'created_at' | 'updated_at' | 'total_travelers'>): Promise<TravelSubmission> {
    try {
      const { data, error } = await supabase
        .from('travel_submissions')
        .insert(submission)
        .select()
        .single();

      if (error) {
        console.error('Error adding travel submission:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Add travel submission error:', error);
      throw error;
    }
  }

  static async updateSubmission(id: number, updates: Partial<TravelSubmission>): Promise<TravelSubmission> {
    try {
      const { data, error } = await supabase
        .from('travel_submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating travel submission:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Update travel submission error:', error);
      throw error;
    }
  }

  static async deleteSubmission(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('travel_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting travel submission:', error);
        throw error;
      }
    } catch (error) {
      console.error('Delete travel submission error:', error);
      throw error;
    }
  }

  static async getSubmissionsByStatus(status: string): Promise<TravelSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('travel_submissions')
        .select('*')
        .eq('submission_status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions by status:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Get submissions by status error:', error);
      throw error;
    }
  }
}

// Booking Service for completed travel bookings
export class BookingService {
  
  // Get all bookings
  static async getAllBookings(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all bookings error:', error);
      throw error;
    }
  }

  // Add new booking
  static async addBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Add booking error:', error);
      throw error;
    }
  }

  // Update booking
  static async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update booking error:', error);
      throw error;
    }
  }

  // Delete booking
  static async deleteBooking(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Delete booking error:', error);
      throw error;
    }
  }

  // Get bookings by status
  static async getBookingsByStatus(status: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_status', status)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get bookings by status error:', error);
      throw error;
    }
  }

  // Check if booking exists by email and package title
  static async getBookingByEmailAndPackage(email: string, packageTitle: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', email)
        .eq('package_title', packageTitle)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get booking by email and package error:', error);
      throw error;
    }
  }

  // Increment download count
  static async incrementDownloadCount(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('increment_download_count', { booking_id: id });
      
      if (error) {
        // Fallback to manual increment if RPC doesn't exist
        const { data: currentBooking } = await supabase
          .from('bookings')
          .select('download_count')
          .eq('id', id)
          .single();
        
        if (currentBooking) {
          await supabase
            .from('bookings')
            .update({ download_count: (currentBooking.download_count || 0) + 1 })
            .eq('id', id);
        }
      }
    } catch (error) {
      console.error('Increment download count error:', error);
      throw error;
    }
  }
}

// Export everything
export default {
  AttractionsService,
  HotelsService,
  TransportService,
  TravelSubmissionService,
  BookingService,
  DataService,
  CacheService
}
