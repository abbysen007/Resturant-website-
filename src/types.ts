export type DietaryType = 'veg' | 'non-veg';
export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'royal';
export type MenuCategory = 'all' | 'starters' | 'curries' | 'rice-breads' | 'thalis' | 'desserts' | 'beverages';

export interface MenuItem {
  id: string;
  name: string;
  bengaliName: string;
  category: 'starters' | 'curries' | 'rice-breads' | 'thalis' | 'desserts' | 'beverages';
  description: string;
  bengaliLore?: string;
  price: number;
  dietary: DietaryType;
  spiceLevel: SpiceLevel;
  imageUrl: string;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  inStock: boolean;
  prepTimeMinutes: number;
  serves: string;
  allergens?: string[];
  ingredients?: string[];
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type DeliveryMode = 'delivery' | 'takeaway' | 'dine_in';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface CustomerLocation {
  address: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  isWithin25Km: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryMode: DeliveryMode;
  deliveryLocation: CustomerLocation;
  detailedAddress?: string;
  items: CartItem[];
  subtotal: number;
  taxAndPackaging: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  estimatedDeliveryTimeMinutes: number;
  assignedRider?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    currentLat: number;
    currentLng: number;
  };
  tableNumber?: string;
}

export interface RestaurantCoordinates {
  lat: number;
  lng: number;
  address: string;
  name: string;
  bengaliName: string;
  phone: string;
}

export interface SavedAddress {
  id: string;
  tag: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  flatDetails: string;
  landmark: string;
  fullAddress: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  authProvider: 'google' | 'number';
  memberTier: string;
  points: number;
  savedAddresses: SavedAddress[];
  favoriteDishIds: string[];
}

