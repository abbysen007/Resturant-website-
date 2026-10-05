import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  CustomerLocation,
  DeliveryMode,
  PaymentMethod,
  UserProfile,
  SavedAddress
} from '../types';
import { INITIAL_MENU_ITEMS, RESTAURANT_LOCATION, PRESET_TEST_LOCATIONS } from '../data/menuData';
import { calculateHaversineDistanceKm, calculateDeliveryFee, estimateDeliveryMinutes } from '../utils/distance';

interface RestaurantContextType {
  // Location & Radius
  customerLocation: CustomerLocation;
  setCustomerLocation: (loc: CustomerLocation) => void;
  updateLocationByCoordinates: (lat: number, lng: number, address?: string, city?: string) => CustomerLocation;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isRadiusExceededModalOpen: boolean;
  setIsRadiusExceededModalOpen: (open: boolean) => void;

  // Menu
  menuItems: MenuItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: MenuItem) => void;
  toggleItemStock: (id: string) => void;
  deleteMenuItem: (id: string) => void;
  selectedDishDetails: MenuItem | null;
  setSelectedDishDetails: (dish: MenuItem | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (dish: MenuItem, quantity?: number, specialInstructions?: string) => void;
  updateCartItemQuantity: (dishId: string, quantity: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartSpecialInstructions: string;
  setCartSpecialInstructions: (note: string) => void;
  appliedCoupon: { code: string; discountPercent?: number; flatDiscount?: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Financials
  subtotal: number;
  taxAndPackaging: number;
  deliveryFee: number;
  discountAmount: number;
  grandTotal: number;

  // Checkout & Orders
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  orders: Order[];
  createOrder: (data: {
    customerName: string;
    customerPhone: string;
    deliveryMode: DeliveryMode;
    detailedAddress?: string;
    paymentMethod: PaymentMethod;
    tableNumber?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  currentTrackingOrderId: string | null;
  setCurrentTrackingOrderId: (id: string | null) => void;
  currentTrackingOrder: Order | undefined;

  // Active View Navigation
  currentView: 'customer' | 'admin';
  setCurrentView: (view: 'customer' | 'admin') => void;
  activeCustomerTab: 'menu' | 'bhoj-menu' | 'tracking' | 'story';
  setActiveCustomerTab: (tab: 'menu' | 'bhoj-menu' | 'tracking' | 'story') => void;

  // Table reservation
  isReservationModalOpen: boolean;
  setIsReservationModalOpen: (open: boolean) => void;

  // User Authentication & Panel
  user: UserProfile | null;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => void;
  loginWithNumber: (phone: string, name?: string) => void;
  logout: () => void;
  isUserPanelOpen: boolean;
  setIsUserPanelOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  addSavedAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  deleteSavedAddress: (id: string) => void;
  toggleFavoriteDish: (dishId: string) => void;

  // Customer Contact & Detailed Address
  customerDetails: {
    name: string;
    phone: string;
    flatDetails: string;
    landmark: string;
  };
  setCustomerDetails: (details: {
    name: string;
    phone: string;
    flatDetails: string;
    landmark: string;
  }) => void;

  // Reset demo data
  resetDemoData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Initial default location (Salt Lake Sector V, 8.4 km - inside 25 km radius)
const DEFAULT_LOCATION: CustomerLocation = {
  address: 'Sector V, Salt Lake City, Kolkata',
  city: 'Kolkata',
  lat: 22.5735,
  lng: 88.4331,
  distanceKm: 8.4,
  isWithin25Km: true
};

const SEED_ORDERS: Order[] = [
  {
    id: 'RG-782914',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    customerName: 'Ananya Banerjee',
    customerPhone: '+91 98301 23456',
    deliveryMode: 'delivery',
    deliveryLocation: {
      address: 'Tower 4, Silver Spring, EM Bypass, Kolkata',
      city: 'Kolkata',
      lat: 22.5398,
      lng: 88.3962,
      distanceKm: 5.6,
      isWithin25Km: true
    },
    detailedAddress: 'Flat 802, Tower 4, Silver Spring, EM Bypass',
    items: [
      {
        dish: INITIAL_MENU_ITEMS[0], // Bhetki Macher Paturi
        quantity: 2,
        specialInstructions: 'Extra Kasundi mustard dip'
      },
      {
        dish: INITIAL_MENU_ITEMS[5], // Kosha Mangsho
        quantity: 1,
        specialInstructions: 'Medium spicy, tender pieces'
      },
      {
        dish: INITIAL_MENU_ITEMS[8], // Basanti Pulao
        quantity: 2
      },
      {
        dish: INITIAL_MENU_ITEMS[16], // Mishti Doi
        quantity: 2
      }
    ],
    subtotal: 1780,
    taxAndPackaging: 119,
    deliveryFee: 0, // Free delivery since > 799
    discount: 178, // BENGAL10
    total: 1721,
    status: 'out_for_delivery',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    estimatedDeliveryTimeMinutes: 18,
    assignedRider: {
      name: 'Bikash Mukherjee',
      phone: '+91 91234 56789',
      vehicleNumber: 'WB-02-AK-9821 (Electric Scooter)',
      currentLat: 22.5440,
      currentLng: 88.3750
    }
  },
  {
    id: 'RG-540192',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    customerName: 'Debanjan Chatterjee',
    customerPhone: '+91 98310 99887',
    deliveryMode: 'delivery',
    deliveryLocation: {
      address: 'Block CF, Sector 1, Salt Lake, Kolkata',
      city: 'Kolkata',
      lat: 22.5850,
      lng: 88.4090,
      distanceKm: 7.2,
      isWithin25Km: true
    },
    detailedAddress: 'CF-142, Sector 1, Salt Lake',
    items: [
      {
        dish: INITIAL_MENU_ITEMS[12], // Jamai Shoshthi Mahabhoj Thali
        quantity: 1
      },
      {
        dish: INITIAL_MENU_ITEMS[18], // Gondhoraj Ghol
        quantity: 2
      }
    ],
    subtotal: 1180,
    taxAndPackaging: 89,
    deliveryFee: 0,
    discount: 0,
    total: 1269,
    status: 'preparing',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    estimatedDeliveryTimeMinutes: 32,
    assignedRider: {
      name: 'Subhendu Roy',
      phone: '+91 98745 61230',
      vehicleNumber: 'WB-01-BH-4512',
      currentLat: 22.5516,
      currentLng: 88.3524
    }
  }
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [activeCustomerTab, setActiveCustomerTab] = useState<'menu' | 'bhoj-menu' | 'tracking' | 'story'>('menu');

  // Location State
  const [customerLocation, setCustomerLocationState] = useState<CustomerLocation>(() => {
    try {
      const saved = localStorage.getItem('roshoi_customer_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRadiusExceededModalOpen, setIsRadiusExceededModalOpen] = useState(false);

  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('roshoi_menu_items');
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDishDetails, setSelectedDishDetails] = useState<MenuItem | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('roshoi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSpecialInstructions, setCartSpecialInstructions] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent?: number;
    flatDiscount?: number;
  } | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('roshoi_orders');
      return saved ? JSON.parse(saved) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  const [currentTrackingOrderId, setCurrentTrackingOrderId] = useState<string | null>(() => {
    return SEED_ORDERS[0]?.id || null;
  });

  // Modals
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  // User Authentication & Panel State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('roshoi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Customer Contact & Detailed Address State
  const [customerDetails, setCustomerDetailsState] = useState<{
    name: string;
    phone: string;
    flatDetails: string;
    landmark: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('roshoi_customer_details');
      return saved ? JSON.parse(saved) : {
        name: 'Abhijit Sen',
        phone: '+91 98301 23456',
        flatDetails: 'Flat 4B, Heritage Enclave',
        landmark: 'Near Park Mansions'
      };
    } catch {
      return {
        name: 'Abhijit Sen',
        phone: '+91 98301 23456',
        flatDetails: 'Flat 4B, Heritage Enclave',
        landmark: 'Near Park Mansions'
      };
    }
  });

  const setCustomerDetails = (details: {
    name: string;
    phone: string;
    flatDetails: string;
    landmark: string;
  }) => {
    setCustomerDetailsState(details);
    localStorage.setItem('roshoi_customer_details', JSON.stringify(details));
  };

  const loginWithGoogle = (email?: string, name?: string, avatar?: string) => {
    const userName = name || 'Abhijit Sen';
    const userEmail = email || 'senabby420@gmail.com';
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: userName,
      email: userEmail,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      authProvider: 'google',
      memberTier: 'সোনার সদস্য • Shonali Gold VIP',
      points: 480,
      savedAddresses: [
        {
          id: 'addr-1',
          tag: 'home',
          name: userName,
          phone: customerDetails.phone || '+91 98301 23456',
          flatDetails: 'Flat 4B, Heritage Enclave',
          landmark: 'Near Park Mansions',
          fullAddress: '18/1 Park Street, Kolkata',
          city: 'Kolkata',
          lat: 22.5519,
          lng: 88.3530,
          distanceKm: 0.2
        },
        {
          id: 'addr-2',
          tag: 'work',
          name: userName,
          phone: customerDetails.phone || '+91 98301 23456',
          flatDetails: 'Floor 8, Godrej Waterside Tower',
          landmark: 'Sector V Ring Road',
          fullAddress: 'Sector V, Salt Lake City, Kolkata',
          city: 'Kolkata',
          lat: 22.5735,
          lng: 88.4331,
          distanceKm: 8.4
        }
      ],
      favoriteDishIds: ['curry-1', 'curry-2', 'rice-1', 'thali-1']
    };
    setUser(newUser);
    localStorage.setItem('roshoi_user', JSON.stringify(newUser));
    setCustomerDetailsState((prev) => ({
      ...prev,
      name: userName,
      phone: prev.phone || '+91 98301 23456'
    }));
    setIsAuthModalOpen(false);
  };

  const loginWithNumber = (phone: string, name?: string) => {
    const userName = name || 'Kolkata Foodie';
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: userName,
      phone: phone,
      authProvider: 'number',
      memberTier: 'রৌপ্য সদস্য • Silver Foodie',
      points: 250,
      savedAddresses: [
        {
          id: 'addr-1',
          tag: 'home',
          name: userName,
          phone: phone,
          flatDetails: customerDetails.flatDetails || 'House 22, Heritage Lane',
          landmark: customerDetails.landmark || 'Near Metro Gate',
          fullAddress: customerLocation.address,
          city: customerLocation.city,
          lat: customerLocation.lat,
          lng: customerLocation.lng,
          distanceKm: customerLocation.distanceKm
        }
      ],
      favoriteDishIds: ['curry-1', 'thali-1']
    };
    setUser(newUser);
    localStorage.setItem('roshoi_user', JSON.stringify(newUser));
    setCustomerDetailsState((prev) => ({
      ...prev,
      name: userName,
      phone: phone
    }));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('roshoi_user');
    setIsUserPanelOpen(false);
  };

  const addSavedAddress = (addr: Omit<SavedAddress, 'id'>) => {
    if (!user) return;
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    const updatedUser: UserProfile = {
      ...user,
      savedAddresses: [newAddr, ...user.savedAddresses]
    };
    setUser(updatedUser);
    localStorage.setItem('roshoi_user', JSON.stringify(updatedUser));
  };

  const deleteSavedAddress = (id: string) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      savedAddresses: user.savedAddresses.filter((a) => a.id !== id)
    };
    setUser(updatedUser);
    localStorage.setItem('roshoi_user', JSON.stringify(updatedUser));
  };

  const toggleFavoriteDish = (dishId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const exists = user.favoriteDishIds.includes(dishId);
    const updatedUser: UserProfile = {
      ...user,
      favoriteDishIds: exists
        ? user.favoriteDishIds.filter((id) => id !== dishId)
        : [...user.favoriteDishIds, dishId]
    };
    setUser(updatedUser);
    localStorage.setItem('roshoi_user', JSON.stringify(updatedUser));
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('roshoi_customer_location', JSON.stringify(customerLocation));
  }, [customerLocation]);

  useEffect(() => {
    localStorage.setItem('roshoi_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('roshoi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('roshoi_orders', JSON.stringify(orders));
  }, [orders]);

  // Location handler with accurate 25km radius check
  const updateLocationByCoordinates = (
    lat: number,
    lng: number,
    address?: string,
    city?: string
  ): CustomerLocation => {
    const distanceKm = calculateHaversineDistanceKm(
      RESTAURANT_LOCATION.lat,
      RESTAURANT_LOCATION.lng,
      lat,
      lng
    );
    const isWithin25Km = distanceKm <= RESTAURANT_LOCATION.maxDeliveryRadiusKm;

    const newLoc: CustomerLocation = {
      lat,
      lng,
      address: address || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      city: city || 'Kolkata Metropolitan Area',
      distanceKm,
      isWithin25Km
    };

    setCustomerLocationState(newLoc);

    // If customer selected outside 25km, show radius notification modal
    if (!isWithin25Km) {
      setIsRadiusExceededModalOpen(true);
    }

    return newLoc;
  };

  const setCustomerLocation = (loc: CustomerLocation) => {
    setCustomerLocationState(loc);
    if (!loc.isWithin25Km) {
      setIsRadiusExceededModalOpen(true);
    }
  };

  // Cart operations
  const addToCart = (dish: MenuItem, quantity: number = 1, specialInstructions?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.dish.id === dish.id);
      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex].quantity += quantity;
        if (specialInstructions) {
          nextCart[existingIndex].specialInstructions = specialInstructions;
        }
        return nextCart;
      } else {
        return [...prevCart, { dish, quantity, specialInstructions }];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartItemQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.dish.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (dishId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.dish.id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCartSpecialInstructions('');
  };

  // Coupon handling
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'BENGAL15' || cleanCode === 'ROSNA15') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 15 });
      return { success: true, message: '🎉 15% Royal Bengali discount applied!' };
    }
    if (cleanCode === 'SHORSHE50' || cleanCode === 'ILISH50') {
      setAppliedCoupon({ code: cleanCode, flatDiscount: 50 });
      return { success: true, message: '🎉 ₹50 discount applied on your meal!' };
    }
    if (cleanCode === 'FIRSTBHOJ') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 20 });
      return { success: true, message: '🎉 20% First Feast celebration applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try BENGAL15 or SHORSHE50.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const taxAndPackaging = subtotal > 0 ? Math.round(subtotal * 0.05 + 30) : 0; // 5% GST + ₹30 eco-friendly earthen packaging

  // Dynamic delivery fee based on 25km radius engine
  const deliveryFee = subtotal > 0 ? calculateDeliveryFee(customerLocation.distanceKm, subtotal) : 0;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discountAmount = Math.min(appliedCoupon.flatDiscount, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal + taxAndPackaging + deliveryFee - discountAmount);

  // Menu Management for Admin
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const toggleItemStock = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Order Operations
  const createOrder = (data: {
    customerName: string;
    customerPhone: string;
    deliveryMode: DeliveryMode;
    detailedAddress?: string;
    paymentMethod: PaymentMethod;
    tableNumber?: string;
  }): Order => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `RG-${randomSuffix}`;

    const estMinutes = data.deliveryMode === 'delivery'
      ? estimateDeliveryMinutes(customerLocation.distanceKm)
      : data.deliveryMode === 'takeaway'
      ? 20
      : 15;

    // Pick a delivery rider simulation
    const riderRoster = [
      { name: 'Bikash Mukherjee', phone: '+91 98301 98765', vehicle: 'WB-02-AX-3810 (Electric Scooter)' },
      { name: 'Debasish Ghosh', phone: '+91 98312 87654', vehicle: 'WB-01-DK-9021 (Motorbike)' },
      { name: 'Sourav Mondal', phone: '+91 98741 23450', vehicle: 'WB-03-EM-1142 (Electric Scooter)' }
    ];
    const rider = riderRoster[Math.floor(Math.random() * riderRoster.length)];

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryMode: data.deliveryMode,
      deliveryLocation: { ...customerLocation },
      detailedAddress: data.detailedAddress || customerLocation.address,
      items: [...cart],
      subtotal,
      taxAndPackaging,
      deliveryFee: data.deliveryMode === 'delivery' ? deliveryFee : 0,
      discount: discountAmount,
      total: grandTotal,
      status: 'placed',
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
      estimatedDeliveryTimeMinutes: estMinutes,
      assignedRider: {
        name: rider.name,
        phone: rider.phone,
        vehicleNumber: rider.vehicle,
        currentLat: RESTAURANT_LOCATION.lat,
        currentLng: RESTAURANT_LOCATION.lng
      },
      tableNumber: data.tableNumber
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentTrackingOrderId(orderId);
    clearCart();
    setIsCheckoutModalOpen(false);
    setActiveCustomerTab('tracking');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        // If moving out for delivery, simulate rider moving halfway
        let riderLoc = order.assignedRider;
        if (riderLoc && status === 'out_for_delivery') {
          riderLoc = {
            ...riderLoc,
            currentLat: (RESTAURANT_LOCATION.lat + order.deliveryLocation.lat) / 2,
            currentLng: (RESTAURANT_LOCATION.lng + order.deliveryLocation.lng) / 2
          };
        } else if (riderLoc && status === 'delivered') {
          riderLoc = {
            ...riderLoc,
            currentLat: order.deliveryLocation.lat,
            currentLng: order.deliveryLocation.lng
          };
        }

        return {
          ...order,
          status,
          assignedRider: riderLoc,
          estimatedDeliveryTimeMinutes:
            status === 'delivered' ? 0 : status === 'out_for_delivery' ? 12 : order.estimatedDeliveryTimeMinutes
        };
      })
    );
  };

  const currentTrackingOrder = orders.find((o) => o.id === currentTrackingOrderId) || orders[0];

  const resetDemoData = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(SEED_ORDERS);
    setCustomerLocationState(DEFAULT_LOCATION);
    clearCart();
    setCurrentTrackingOrderId(SEED_ORDERS[0].id);
    localStorage.removeItem('roshoi_menu_items');
    localStorage.removeItem('roshoi_orders');
    localStorage.removeItem('roshoi_cart');
    localStorage.removeItem('roshoi_customer_location');
  };

  return (
    <RestaurantContext.Provider
      value={{
        customerLocation,
        setCustomerLocation,
        updateLocationByCoordinates,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isRadiusExceededModalOpen,
        setIsRadiusExceededModalOpen,

        menuItems,
        searchQuery,
        setSearchQuery,
        updateMenuItem,
        addMenuItem,
        toggleItemStock,
        deleteMenuItem,
        selectedDishDetails,
        setSelectedDishDetails,

        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSpecialInstructions,
        setCartSpecialInstructions,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        subtotal,
        taxAndPackaging,
        deliveryFee,
        discountAmount,
        grandTotal,

        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        orders,
        createOrder,
        updateOrderStatus,
        currentTrackingOrderId,
        setCurrentTrackingOrderId,
        currentTrackingOrder,

        currentView,
        setCurrentView,
        activeCustomerTab,
        setActiveCustomerTab,

        isReservationModalOpen,
        setIsReservationModalOpen,

        // User Auth & Profile
        user,
        loginWithGoogle,
        loginWithNumber,
        logout,
        isUserPanelOpen,
        setIsUserPanelOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        addSavedAddress,
        deleteSavedAddress,
        toggleFavoriteDish,

        // Customer details
        customerDetails,
        setCustomerDetails,

        resetDemoData
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
