// Migration helper to transition from local data to Supabase
// This file helps you gradually migrate your existing code

import { attractionsData, hotelData, transportData } from '../data/attractions'
import { DataService, AttractionsService, HotelsService, TransportService } from '../services/supabaseService'

/**
 * MIGRATION STRATEGY:
 * 
 * Phase 1: Hybrid Mode (Fallback to local data)
 * Phase 2: Supabase Only (Remove local imports)
 * Phase 3: Real-time Features (Add subscriptions)
 */

// Phase 1: Hybrid Data Service with fallback
export class HybridDataService {
  
  // Use Supabase with fallback to local data
  static async getAttractionsData() {
    try {
      // Try Supabase first
      const data = await AttractionsService.getAllAttractions()
      
      // Transform to match existing format
      return data.map(item => ({
        Emirates: item.emirates,
        Attraction: item.attraction,
        Price: item.price,
        ChildPrice: item.child_price,
        InfantPrice: item.infant_price,
        ImageUrl: item.image_url
      }))
    } catch (error) {
      console.warn('Falling back to local attractions data:', error)
      return attractionsData
    }
  }

  static async getHotelData() {
    try {
      const data = await HotelsService.getAllHotels()
      
      return data.map(item => ({
        name: item.name,
        stars: item.stars,
        costPerNight: item.cost_per_night,
        category: item.category,
        ImageUrl: item.image_url
      }))
    } catch (error) {
      console.warn('Falling back to local hotel data:', error)
      return hotelData
    }
  }

  static async getTransportData() {
    try {
      const data = await TransportService.getAllTransport()
      
      return data.map(item => ({
        id: item.transport_id,
        label: item.label,
        costPerDay: item.cost_per_day,
        ImageUrl: item.image_url
      }))
    } catch (error) {
      console.warn('Falling back to local transport data:', error)
      return transportData
    }
  }

  // Get all data in original format
  static async getAllData() {
    const [attractions, hotels, transport] = await Promise.all([
      this.getAttractionsData(),
      this.getHotelData(),
      this.getTransportData()
    ])

    return {
      attractionsData: attractions,
      hotelData: hotels,
      transportData: transport
    }
  }
}

// Migration helper for AIGenerate.tsx
export class AIGenerateMigrationHelper {
  
  // Drop-in replacement for the filterDataByTravelForm function
  static async getFilteredData(formData: any) {
    try {
      // Use Supabase with intelligent filtering
      const { filteredAttractions, filteredHotels, filteredTransport } = await DataService.getFilteredData({
        emirates: Array.isArray(formData.emirates) ? formData.emirates : [formData.emirates],
        budget: formData.budget,
        familyFriendly: (formData.kids || 0) > 0 || (formData.infants || 0) > 0
      })

      // Transform back to original format
      return {
        filteredAttractions: filteredAttractions.map(item => ({
          Emirates: item.emirates,
          Attraction: item.attraction,
          Price: item.price,
          ChildPrice: item.child_price,
          InfantPrice: item.infant_price,
          ImageUrl: item.image_url
        })),
        filteredHotels: filteredHotels.map(item => ({
          name: item.name,
          stars: item.stars,
          costPerNight: item.cost_per_night,
          category: item.category,
          ImageUrl: item.image_url
        })),
        filteredTransport: filteredTransport.map(item => ({
          id: item.transport_id,
          label: item.label,
          costPerDay: item.cost_per_day,
          ImageUrl: item.image_url
        }))
      }
    } catch (error) {
      console.warn('Supabase unavailable, using local data:', error)
      
      // Fallback to local data with basic filtering
      const selectedEmirates = Array.isArray(formData.emirates) ? formData.emirates : [formData.emirates]
      const includesAll = selectedEmirates.includes("all")
      
      const filteredAttractions = attractionsData.filter(attraction => {
        if (includesAll) return true
        return selectedEmirates.some(emirate => 
          attraction.Emirates.toLowerCase().includes(emirate.toLowerCase())
        )
      })

      return {
        filteredAttractions,
        filteredHotels: hotelData,
        filteredTransport: transportData
      }
    }
  }
}

// Real-time data hooks for React components
export function useRealtimeAttractions() {
  // This can be expanded to include Supabase real-time subscriptions
  // For now, it's a placeholder for future enhancement
  return {
    attractions: [],
    loading: true,
    error: null,
    refetch: () => Promise.resolve()
  }
}

// Performance monitoring
export class DataPerformanceMonitor {
  private static metrics = new Map()

  static startTimer(operation: string) {
    this.metrics.set(operation, Date.now())
  }

  static endTimer(operation: string) {
    const start = this.metrics.get(operation)
    if (start) {
      const duration = Date.now() - start
      console.log(`🏎️ ${operation} took ${duration}ms`)
      this.metrics.delete(operation)
      return duration
    }
    return 0
  }

  static async measureAsync<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(operation)
    try {
      const result = await fn()
      this.endTimer(operation)
      return result
    } catch (error) {
      this.endTimer(operation)
      throw error
    }
  }
}

/**
 * MIGRATION INSTRUCTIONS:
 * 
 * 1. Replace existing imports in your components:
 * 
 *    // Before
 *    import { attractionsData, hotelData, transportData } from '../data/attractions'
 * 
 *    // After (Phase 1)
 *    import { HybridDataService } from '../services/migrationHelper'
 *    const { attractionsData, hotelData, transportData } = await HybridDataService.getAllData()
 * 
 * 2. Update AIGenerate.tsx:
 * 
 *    // Before
 *    const { filteredAttractions, filteredHotels, filteredTransport } = filterDataByTravelForm()
 * 
 *    // After
 *    const { filteredAttractions, filteredHotels, filteredTransport } = await AIGenerateMigrationHelper.getFilteredData(data)
 * 
 * 3. Gradually replace with direct Supabase calls:
 * 
 *    // Phase 2
 *    import { DataService } from '../services/supabaseService'
 *    const data = await DataService.getAllData()
 * 
 * 4. Add real-time features:
 * 
 *    // Phase 3
 *    import { supabase } from '../config/supabaseConfig'
 *    supabase.channel('attractions').on('postgres_changes', ...)
 */

export default {
  HybridDataService,
  AIGenerateMigrationHelper,
  DataPerformanceMonitor
}
