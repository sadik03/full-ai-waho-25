// Enhanced data service for admin panel integration
export interface Attraction {
  id: string;
  name: string;
  emirates: string;
  price: number;
  duration: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  costPerNight: number;
  location: string;
  description: string;
  amenities: string[];
  imageUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transport {
  id: string;
  label: string;
  costPerDay: number;
  type: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Default data if nothing exists
const defaultAttractions: Attraction[] = [
  {
    id: "attr-1",
    name: "Burj Khalifa",
    emirates: "Dubai",
    price: 150,
    duration: "2-3 hours",
    description: "The world's tallest building with stunning views from the observation deck",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop",
    category: "Landmark",
    rating: 5,
    isActive: true
  },
  {
    id: "attr-2",
    name: "Dubai Mall",
    emirates: "Dubai",
    price: 0,
    duration: "4-6 hours",
    description: "One of the world's largest shopping malls with entertainment and dining",
    imageUrl: "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=400&h=250&fit=crop",
    category: "Shopping",
    rating: 4,
    isActive: true
  },
  {
    id: "attr-3",
    name: "Louvre Abu Dhabi",
    emirates: "Abu Dhabi",
    price: 120,
    duration: "3-4 hours",
    description: "World-class art museum showcasing global cultural artifacts",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=250&fit=crop",
    category: "Museum",
    rating: 5,
    isActive: true
  },
  {
    id: "attr-4",
    name: "Sheikh Zayed Grand Mosque",
    emirates: "Abu Dhabi",
    price: 0,
    duration: "2-3 hours",
    description: "Magnificent mosque known for its stunning Islamic architecture",
    imageUrl: "https://images.unsplash.com/photo-1570552800495-c437d43fddd4?w=400&h=250&fit=crop",
    category: "Religious",
    rating: 5,
    isActive: true
  },
  {
    id: "attr-5",
    name: "Sharjah Arts Museum",
    emirates: "Sharjah",
    price: 25,
    duration: "2-3 hours",
    description: "Contemporary and traditional art from the Arab world",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba16b19?w=400&h=250&fit=crop",
    category: "Museum",
    rating: 4,
    isActive: true
  }
];

const defaultHotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "Burj Al Arab",
    stars: 5,
    costPerNight: 2000,
    location: "Dubai",
    description: "Iconic luxury hotel shaped like a sail",
    amenities: ["Beach Access", "Spa", "Multiple Restaurants", "Butler Service"],
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop",
    isActive: true
  },
  {
    id: "hotel-2",
    name: "Emirates Palace",
    stars: 5,
    costPerNight: 1500,
    location: "Abu Dhabi",
    description: "Opulent palace hotel with private beach",
    amenities: ["Private Beach", "Spa", "Gold ATM", "Marina"],
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop",
    isActive: true
  },
  {
    id: "hotel-3",
    name: "Atlantis The Palm",
    stars: 5,
    costPerNight: 800,
    location: "Dubai",
    description: "Resort with water park and underwater suites",
    amenities: ["Water Park", "Aquarium", "Beach", "Multiple Pools"],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    isActive: true
  },
  {
    id: "hotel-4",
    name: "Jumeirah Beach Hotel",
    stars: 4,
    costPerNight: 400,
    location: "Dubai",
    description: "Beachfront hotel with wave-shaped architecture",
    amenities: ["Beach Access", "Pool", "Spa", "Kids Club"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
    isActive: true
  },
  {
    id: "hotel-5",
    name: "The Ritz-Carlton Abu Dhabi",
    stars: 5,
    costPerNight: 600,
    location: "Abu Dhabi",
    description: "Luxury hotel with canal views",
    amenities: ["Canal Views", "Spa", "Fine Dining", "Business Center"],
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop",
    isActive: true
  }
];

const defaultTransports: Transport[] = [
  {
    id: "transport-1",
    label: "Luxury Car Rental",
    costPerDay: 150,
    type: "Car",
    description: "Premium vehicle with driver service",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop",
    isActive: true
  },
  {
    id: "transport-2",
    label: "Dubai Metro",
    costPerDay: 15,
    type: "Metro",
    description: "Modern metro system covering major attractions",
    imageUrl: "https://images.unsplash.com/photo-1581093804475-577d72e38aa0?w=400&h=250&fit=crop",
    isActive: true
  },
  {
    id: "transport-3",
    label: "Private Taxi",
    costPerDay: 80,
    type: "Taxi",
    description: "Air-conditioned taxi service",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
    isActive: true
  },
  {
    id: "transport-4",
    label: "Tourist Bus",
    costPerDay: 45,
    type: "Bus",
    description: "Hop-on hop-off bus service",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop",
    isActive: true
  },
  {
    id: "transport-5",
    label: "Water Taxi",
    costPerDay: 60,
    type: "Boat",
    description: "Scenic water transport across Dubai Creek",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isActive: true
  }
];

class DataService {
  private static instance: DataService;

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Initialize data if not exists
  initializeData(): void {
    if (!localStorage.getItem('admin_attractions')) {
      this.saveAttractions(defaultAttractions);
    }
    if (!localStorage.getItem('admin_hotels')) {
      this.saveHotels(defaultHotels);
    }
    if (!localStorage.getItem('admin_transports')) {
      this.saveTransports(defaultTransports);
    }
    
    // Sync with main application data
    this.syncToMainApp();
  }

  // Attractions
  getAttractions(): Attraction[] {
    const data = localStorage.getItem('admin_attractions');
    return data ? JSON.parse(data) : defaultAttractions;
  }

  saveAttractions(attractions: Attraction[]): void {
    localStorage.setItem('admin_attractions', JSON.stringify(attractions));
    this.syncToMainApp();
  }

  addAttraction(attraction: Omit<Attraction, 'id' | 'createdAt' | 'updatedAt'>): Attraction {
    const newAttraction: Attraction = {
      ...attraction,
      id: `attr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const attractions = this.getAttractions();
    attractions.push(newAttraction);
    this.saveAttractions(attractions);
    return newAttraction;
  }

  updateAttraction(id: string, updates: Partial<Attraction>): Attraction | null {
    const attractions = this.getAttractions();
    const index = attractions.findIndex(a => a.id === id);
    
    if (index !== -1) {
      attractions[index] = { 
        ...attractions[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.saveAttractions(attractions);
      return attractions[index];
    }
    return null;
  }

  deleteAttraction(id: string): boolean {
    const attractions = this.getAttractions();
    const filtered = attractions.filter(a => a.id !== id);
    
    if (filtered.length !== attractions.length) {
      this.saveAttractions(filtered);
      return true;
    }
    return false;
  }

  // Hotels
  getHotels(): Hotel[] {
    const data = localStorage.getItem('admin_hotels');
    return data ? JSON.parse(data) : defaultHotels;
  }

  saveHotels(hotels: Hotel[]): void {
    localStorage.setItem('admin_hotels', JSON.stringify(hotels));
    this.syncToMainApp();
  }

  addHotel(hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>): Hotel {
    const newHotel: Hotel = {
      ...hotel,
      id: `hotel-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const hotels = this.getHotels();
    hotels.push(newHotel);
    this.saveHotels(hotels);
    return newHotel;
  }

  updateHotel(id: string, updates: Partial<Hotel>): Hotel | null {
    const hotels = this.getHotels();
    const index = hotels.findIndex(h => h.id === id);
    
    if (index !== -1) {
      hotels[index] = { 
        ...hotels[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.saveHotels(hotels);
      return hotels[index];
    }
    return null;
  }

  deleteHotel(id: string): boolean {
    const hotels = this.getHotels();
    const filtered = hotels.filter(h => h.id !== id);
    
    if (filtered.length !== hotels.length) {
      this.saveHotels(filtered);
      return true;
    }
    return false;
  }

  // Transports
  getTransports(): Transport[] {
    const data = localStorage.getItem('admin_transports');
    return data ? JSON.parse(data) : defaultTransports;
  }

  saveTransports(transports: Transport[]): void {
    localStorage.setItem('admin_transports', JSON.stringify(transports));
    this.syncToMainApp();
  }

  addTransport(transport: Omit<Transport, 'id' | 'createdAt' | 'updatedAt'>): Transport {
    const newTransport: Transport = {
      ...transport,
      id: `transport-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const transports = this.getTransports();
    transports.push(newTransport);
    this.saveTransports(transports);
    return newTransport;
  }

  updateTransport(id: string, updates: Partial<Transport>): Transport | null {
    const transports = this.getTransports();
    const index = transports.findIndex(t => t.id === id);
    
    if (index !== -1) {
      transports[index] = { 
        ...transports[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.saveTransports(transports);
      return transports[index];
    }
    return null;
  }

  deleteTransport(id: string): boolean {
    const transports = this.getTransports();
    const filtered = transports.filter(t => t.id !== id);
    
    if (filtered.length !== transports.length) {
      this.saveTransports(filtered);
      return true;
    }
    return false;
  }

  // Sync data to main application format
  private syncToMainApp(): void {
    const attractions = this.getAttractions().filter(a => a.isActive);
    const hotels = this.getHotels().filter(h => h.isActive);
    const transports = this.getTransports().filter(t => t.isActive);

    // Convert to main app format
    const mainAttractions = attractions.map(attr => ({
      Attraction: attr.name,
      Emirates: attr.emirates,
      Price: attr.price,
      ImageUrl: attr.imageUrl,
      Duration: attr.duration,
      Category: attr.category,
      Rating: attr.rating
    }));

    const mainHotels = hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      stars: hotel.stars,
      costPerNight: hotel.costPerNight,
      location: hotel.location,
      amenities: hotel.amenities,
      imageUrl: hotel.imageUrl
    }));

    const mainTransports = transports.map(transport => ({
      id: transport.id,
      label: transport.label,
      costPerDay: transport.costPerDay,
      type: transport.type,
      imageUrl: transport.imageUrl
    }));

    // Save to main app storage
    localStorage.setItem('attractionsData', JSON.stringify(mainAttractions));
    localStorage.setItem('hotelData', JSON.stringify(mainHotels));
    localStorage.setItem('transportData', JSON.stringify(mainTransports));
  }

  // Export data
  exportData(): { attractions: Attraction[], hotels: Hotel[], transports: Transport[] } {
    return {
      attractions: this.getAttractions(),
      hotels: this.getHotels(),
      transports: this.getTransports()
    };
  }

  // Import data
  importData(data: { attractions?: Attraction[], hotels?: Hotel[], transports?: Transport[] }): void {
    if (data.attractions) {
      this.saveAttractions(data.attractions);
    }
    if (data.hotels) {
      this.saveHotels(data.hotels);
    }
    if (data.transports) {
      this.saveTransports(data.transports);
    }
  }

  // Get statistics
  getStats() {
    const attractions = this.getAttractions();
    const hotels = this.getHotels();
    const transports = this.getTransports();

    return {
      attractions: {
        total: attractions.length,
        active: attractions.filter(a => a.isActive).length,
        inactive: attractions.filter(a => !a.isActive).length,
        byEmirate: this.groupByField(attractions, 'emirates')
      },
      hotels: {
        total: hotels.length,
        active: hotels.filter(h => h.isActive).length,
        inactive: hotels.filter(h => !h.isActive).length,
        byStars: this.groupByField(hotels, 'stars')
      },
      transports: {
        total: transports.length,
        active: transports.filter(t => t.isActive).length,
        inactive: transports.filter(t => !t.isActive).length,
        byType: this.groupByField(transports, 'type')
      }
    };
  }

  private groupByField(items: any[], field: string): Record<string, number> {
    return items.reduce((acc, item) => {
      const key = item[field];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }
}

export const dataService = DataService.getInstance();
