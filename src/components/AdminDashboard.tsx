import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderStatus, MenuItem, DietaryType, SpiceLevel } from '../types';
import {
  LayoutDashboard,
  ChefHat,
  Bike,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  X,
  Calendar,
  Users,
  BatteryCharging,
  Phone,
  BarChart3,
  Award,
  Zap,
  Flame,
  Check,
  AlertTriangle
} from 'lucide-react';
import { formatINR, formatTime } from '../utils/format';
import { RESTAURANT_LOCATION } from '../data/menuData';

interface RiderInfo {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  completedToday: number;
  batteryLevel: number;
  thermalBagTempC: number;
  status: 'on_delivery' | 'waiting' | 'returning';
  currentOrderId?: string;
}

interface TableBooking {
  id: string;
  guestName: string;
  phone: string;
  guestsCount: number;
  date: string;
  timeSlot: string;
  area: 'Courtyard' | 'Verandah' | 'Zamindari Room';
  status: 'confirmed' | 'pending' | 'seated' | 'cancelled';
}

const INITIAL_RIDERS: RiderInfo[] = [
  {
    id: 'rider-1',
    name: 'Raju Mondal',
    phone: '+91 98301 22341',
    vehicle: 'Hero Splendor (WB-02-AK-4412)',
    rating: 4.9,
    completedToday: 14,
    batteryLevel: 88,
    thermalBagTempC: 64,
    status: 'on_delivery',
    currentOrderId: 'ORD-9021'
  },
  {
    id: 'rider-2',
    name: 'Bikram Ghosh',
    phone: '+91 98312 99402',
    vehicle: 'Honda Activa (WB-01-BX-8821)',
    rating: 4.8,
    completedToday: 11,
    batteryLevel: 92,
    thermalBagTempC: 62,
    status: 'on_delivery',
    currentOrderId: 'ORD-9022'
  },
  {
    id: 'rider-3',
    name: 'Sourav Das',
    phone: '+91 98366 11209',
    vehicle: 'Ather 450X EV (WB-04-CY-1102)',
    rating: 5.0,
    completedToday: 9,
    batteryLevel: 74,
    thermalBagTempC: 65,
    status: 'waiting'
  }
];

const INITIAL_BOOKINGS: TableBooking[] = [
  {
    id: 'book-1',
    guestName: 'Anirban & Debolina Banerjee',
    phone: '+91 98300 44551',
    guestsCount: 4,
    date: 'Today, 3 Oct',
    timeSlot: '8:00 PM',
    area: 'Courtyard',
    status: 'confirmed'
  },
  {
    id: 'book-2',
    guestName: 'Debasmita Sen & Family',
    phone: '+91 98310 77123',
    guestsCount: 2,
    date: 'Today, 3 Oct',
    timeSlot: '8:30 PM',
    area: 'Verandah',
    status: 'confirmed'
  },
  {
    id: 'book-3',
    guestName: 'Dr. Pronob Roy (Grand Bhoj)',
    phone: '+91 98322 88410',
    guestsCount: 6,
    date: 'Today, 3 Oct',
    timeSlot: '9:00 PM',
    area: 'Zamindari Room',
    status: 'pending'
  }
];

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    updateMenuItem,
    addMenuItem,
    toggleItemStock,
    deleteMenuItem,
    resetDemoData,
    setCurrentView,
    setActiveCustomerTab
  } = useRestaurant();

  // Internal Admin Navigation Bar Tabs
  const [adminTab, setAdminTab] = useState<'kanban' | 'menu' | 'analytics' | 'riders' | 'bookings'>('kanban');

  // Search in Admin
  const [globalAdminSearch, setGlobalAdminSearch] = useState('');

  // Riders & Bookings State
  const [riders, setRiders] = useState<RiderInfo[]>(INITIAL_RIDERS);
  const [bookings, setBookings] = useState<TableBooking[]>(INITIAL_BOOKINGS);

  // New / Edit Dish Modal
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formBengaliName, setFormBengaliName] = useState('');
  const [formCategory, setFormCategory] = useState<any>('curries');
  const [formPrice, setFormPrice] = useState(350);
  const [formDietary, setFormDietary] = useState<DietaryType>('non-veg');
  const [formSpice, setFormSpice] = useState<SpiceLevel>('medium');
  const [formImg, setFormImg] = useState('https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80');
  const [formDesc, setFormDesc] = useState('');
  const [formPrepTime, setFormPrepTime] = useState(20);

  // Kanban Columns
  const COLUMNS: { id: OrderStatus; label: string; bengaliLabel: string; countBadge: string }[] = [
    { id: 'placed', label: 'New Orders', bengaliLabel: 'নতুন অর্ডার', countBadge: 'bg-orange-100 text-orange-900 border border-orange-200' },
    { id: 'preparing', label: 'In Kitchen', bengaliLabel: 'রান্না চলছে', countBadge: 'bg-amber-100 text-amber-900 border border-amber-200' },
    { id: 'out_for_delivery', label: 'Dispatched (25km)', bengaliLabel: 'ডেলিভারির পথে', countBadge: 'bg-orange-200 text-orange-950 border border-orange-300' },
    { id: 'delivered', label: 'Delivered', bengaliLabel: 'সম্পূর্ণ', countBadge: 'bg-emerald-100 text-emerald-900 border border-emerald-200' }
  ];

  const handleEditDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDish) {
      updateMenuItem({
        ...editingDish,
        name: formName,
        bengaliName: formBengaliName,
        category: formCategory,
        price: Number(formPrice),
        dietary: formDietary,
        spiceLevel: formSpice,
        imageUrl: formImg,
        description: formDesc,
        prepTimeMinutes: Number(formPrepTime)
      });
      setEditingDish(null);
    } else {
      const newDish: MenuItem = {
        id: `dish-${Date.now()}`,
        name: formName,
        bengaliName: formBengaliName || formName,
        category: formCategory,
        price: Number(formPrice),
        dietary: formDietary,
        spiceLevel: formSpice,
        imageUrl: formImg,
        description: formDesc,
        inStock: true,
        prepTimeMinutes: Number(formPrepTime),
        serves: '2 persons'
      };
      addMenuItem(newDish);
      setIsAddingDish(false);
    }
  };

  const openEditModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormBengaliName(dish.bengaliName);
    setFormCategory(dish.category);
    setFormPrice(dish.price);
    setFormDietary(dish.dietary);
    setFormSpice(dish.spiceLevel);
    setFormImg(dish.imageUrl);
    setFormDesc(dish.description);
    setFormPrepTime(dish.prepTimeMinutes);
    setIsAddingDish(true);
  };

  // Booking updates
  const updateBookingStatus = (id: string, status: TableBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const deliveryOrders = orders.filter((o) => o.deliveryMode === 'delivery');
  const avgDistance = deliveryOrders.length > 0
    ? (deliveryOrders.reduce((sum, o) => sum + o.deliveryLocation.distanceKm, 0) / deliveryOrders.length).toFixed(1)
    : '7.8';

  const filteredMenuItems = menuItems.filter((m) =>
    m.name.toLowerCase().includes(globalAdminSearch.toLowerCase()) ||
    m.bengaliName.includes(globalAdminSearch) ||
    m.category.toLowerCase().includes(globalAdminSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-stone-800 font-lato">
      {/* ======================================================== */}
      {/* 1. TOP DEDICATED NAVIGATION BAR INSIDE ADMIN PORTAL      */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-orange-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
            {/* Left: Brand & Live Kitchen Indicator */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20">
                <span className="font-bengali text-2xl">র</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base sm:text-lg text-stone-900 font-sans tracking-tight">
                    Roshoi Ghor Ops
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Kitchen Live
                  </span>
                </div>
                <span className="font-bengali text-orange-700 text-xs font-bold block -mt-0.5">
                  রন্ধনশালা ও কেন্দ্রীয় নিয়ন্ত্রণ ব্যবস্থা • Park Street Flagship
                </span>
              </div>
            </div>

            {/* Center: Sleek Modern Tab Navigation Bar */}
            <nav className="hidden md:flex items-center bg-orange-50/70 p-1.5 rounded-2xl border border-orange-200 text-xs font-bold text-stone-700">
              <button
                onClick={() => setAdminTab('kanban')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === 'kanban'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-stone-600 hover:text-orange-700'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('menu')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === 'menu'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-stone-600 hover:text-orange-700'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Menu Inventory</span>
              </button>

              <button
                onClick={() => setAdminTab('analytics')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === 'analytics'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-stone-600 hover:text-orange-700'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics & 25km</span>
              </button>

              <button
                onClick={() => setAdminTab('riders')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === 'riders'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-stone-600 hover:text-orange-700'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Fleet &amp; Riders ({riders.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('bookings')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === 'bookings'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-stone-600 hover:text-orange-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Table Bookings ({bookings.length})</span>
              </button>
            </nav>

            {/* Right: Exit to Store & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setCurrentView('customer');
                  setActiveCustomerTab('menu');
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
              >
                <span>Exit To Store</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
            </div>
          </div>

          {/* Mobile Tab Bar */}
          <div className="md:hidden flex items-center gap-1 overflow-x-auto pb-3 pt-1 text-xs font-bold">
            <button
              onClick={() => setAdminTab('kanban')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${adminTab === 'kanban' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-stone-700'}`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setAdminTab('menu')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${adminTab === 'menu' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-stone-700'}`}
            >
              Menu
            </button>
            <button
              onClick={() => setAdminTab('analytics')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${adminTab === 'analytics' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-stone-700'}`}
            >
              Analytics
            </button>
            <button
              onClick={() => setAdminTab('riders')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${adminTab === 'riders' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-stone-700'}`}
            >
              Riders
            </button>
            <button
              onClick={() => setAdminTab('bookings')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${adminTab === 'bookings' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-stone-700'}`}
            >
              Bookings
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ======================================================== */}
        {/* 2. MODERN TOP KPI ROW (WHITE & LIGHT ORANGE)             */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-200/90 shadow-sm shadow-orange-950/5 flex flex-col justify-between hover:border-orange-400 transition-all">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Today's Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
                  {formatINR(totalRevenue)}
                </span>
                <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  +16.4%
                </span>
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">
                42 orders fulfilled today
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-200/90 shadow-sm shadow-orange-950/5 flex flex-col justify-between hover:border-orange-400 transition-all">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Radius Limit</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
                  {RESTAURANT_LOCATION.maxDeliveryRadiusKm} km
                </span>
                <span className="text-[11px] font-black text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded-md">
                  Strict Active
                </span>
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">
                Avg trip: {avgDistance} km from Park Street
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-200/90 shadow-sm shadow-orange-950/5 flex flex-col justify-between hover:border-orange-400 transition-all">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Riders</span>
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <Bike className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
                  {riders.filter((r) => r.status === 'on_delivery').length} / {riders.length}
                </span>
                <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Thermal Insulated
                </span>
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">
                Avg transit: 28 mins
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-200/90 shadow-sm shadow-orange-950/5 flex flex-col justify-between hover:border-orange-400 transition-all">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Courtyard Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
                  {bookings.filter((b) => b.status === 'confirmed').length} Tables
                </span>
                <span className="text-[11px] font-black text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md">
                  12 Guests
                </span>
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">
                Heritage dinner spread
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: KITCHEN ORDER PIPELINE (KANBAN)                   */}
        {/* ======================================================== */}
        {adminTab === 'kanban' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-orange-200/90 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={globalAdminSearch}
                    onChange={(e) => setGlobalAdminSearch(e.target.value)}
                    placeholder="Search by order ID, customer, address..."
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-orange-500 bg-stone-50/50 w-64"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetDemoData}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-orange-300 text-stone-600 hover:text-orange-700 bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                  title="Reset sample orders & kitchen state"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-orange-600" />
                  <span>Reset Demo Orders</span>
                </button>
              </div>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {COLUMNS.map((col) => {
                const colOrders = orders
                  .filter((o) => o.status === col.id)
                  .filter((o) => {
                    if (!globalAdminSearch.trim()) return true;
                    const q = globalAdminSearch.toLowerCase();
                    return (
                      o.id.toLowerCase().includes(q) ||
                      o.customerName.toLowerCase().includes(q) ||
                      o.deliveryLocation.address.toLowerCase().includes(q)
                    );
                  });

                return (
                  <div
                    key={col.id}
                    className="bg-white rounded-3xl border border-orange-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden"
                  >
                    <div className="p-4 border-b border-orange-100 bg-orange-50/50 flex items-center justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm text-stone-900">{col.label}</h3>
                        <span className="font-bengali text-xs text-orange-700 font-bold block mt-0.5">
                          {col.bengaliLabel}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${col.countBadge}`}>
                        {colOrders.length}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto bg-stone-50/30">
                      {colOrders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 text-xs">
                          <CheckCircle2 className="w-8 h-8 text-stone-300 mb-2" />
                          <span>No orders in this stage</span>
                        </div>
                      ) : (
                        colOrders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all space-y-3 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                                {order.id}
                              </span>
                              <span className="text-[11px] text-stone-400 font-medium">
                                {formatTime(order.createdAt)}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-stone-900 leading-snug">
                                {order.customerName}
                              </h4>
                              <p className="text-[11px] text-stone-500 flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                <span className="truncate">{order.detailedAddress}</span>
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-stone-500 pt-0.5">
                                <span className="font-bold text-orange-800">{order.deliveryLocation.distanceKm} km</span>
                                <span>•</span>
                                <span className="capitalize font-semibold text-stone-700">{order.deliveryMode}</span>
                              </div>
                            </div>

                            {/* Items list */}
                            <div className="bg-orange-50/40 p-2.5 rounded-xl border border-orange-100/70 space-y-1">
                              {order.items.map((it, i) => (
                                <div key={i} className="flex justify-between items-center text-[11px] text-stone-700">
                                  <span className="truncate pr-2 font-medium">
                                    {it.quantity}x {it.dish.name}
                                  </span>
                                  <span className="font-bold font-mono text-stone-900 shrink-0">
                                    {formatINR(it.dish.price * it.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                              <div>
                                <span className="text-[10px] text-stone-400 block">Total Amount</span>
                                <span className="font-black text-stone-900 text-sm">
                                  {formatINR(order.total)}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600">
                                {order.paymentMethod}
                              </span>
                            </div>

                            {/* Status progression action */}
                            <div className="pt-1">
                              {col.id === 'placed' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                  className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                                >
                                  <ChefHat className="w-3.5 h-3.5" />
                                  <span>Send to Kitchen</span>
                                </button>
                              )}

                              {col.id === 'preparing' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                                >
                                  <Bike className="w-3.5 h-3.5" />
                                  <span>Dispatch Rider</span>
                                </button>
                              )}

                              {col.id === 'out_for_delivery' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Mark Delivered</span>
                                </button>
                              )}

                              {col.id === 'delivered' && (
                                <div className="w-full py-1.5 text-center text-emerald-700 font-bold text-[11px] bg-emerald-50 rounded-lg flex items-center justify-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Delivered Hot (Within 25km)</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MENU INVENTORY & STOCK CONTROL                    */}
        {/* ======================================================== */}
        {adminTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-orange-200/90 shadow-xs">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={globalAdminSearch}
                  onChange={(e) => setGlobalAdminSearch(e.target.value)}
                  placeholder="Filter dishes by name or category..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-orange-500 bg-stone-50/50"
                />
              </div>

              <button
                onClick={() => {
                  setEditingDish(null);
                  setFormName('');
                  setFormBengaliName('');
                  setFormPrice(320);
                  setFormDesc('');
                  setIsAddingDish(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Bengali Dish</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-orange-200/90 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-orange-50/60 text-stone-600 font-extrabold border-b border-orange-100">
                    <tr>
                      <th className="p-4">Dish</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Dietary</th>
                      <th className="p-4">Live Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100/60">
                    {filteredMenuItems.map((dish) => (
                      <tr key={dish.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-12 h-12 rounded-xl object-cover border border-orange-200 shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-sm text-stone-900">{dish.name}</div>
                              <div className="font-bengali text-orange-700 text-xs">
                                {dish.bengaliName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 capitalize font-semibold text-stone-700">
                          {dish.category}
                        </td>
                        <td className="p-4 font-black font-mono text-stone-900 text-sm">
                          {formatINR(dish.price)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              dish.dietary === 'veg'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {dish.dietary}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleItemStock(dish.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                              dish.inStock
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {dish.inStock ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-emerald-600" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 text-rose-600" />
                                <span>Sold Out</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(dish)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-orange-700 hover:bg-orange-100/60 transition-colors"
                              title="Edit Dish"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteMenuItem(dish.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Dish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MODERN & ATTRACTIVE ANALYTICS DASHBOARD           */}
        {/* ======================================================== */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-bengali text-amber-200 text-xs font-bold block mb-1">
                  রসুই ঘর পারফর্মেন্স রিপোর্ট • Live Metrics Engine
                </span>
                <h3 className="font-ultra text-2xl sm:text-3xl text-white tracking-tight">
                  Kitchen Velocity & 25km Radius Insights
                </h3>
                <p className="text-xs text-orange-100 mt-1 max-w-xl">
                  Real-time analytics on delivery radius performance, rush hour demand patterns, and top-selling culinary creations.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/30 text-center">
                  <span className="text-[10px] uppercase font-bold text-orange-100 block">Radius Adherence</span>
                  <span className="font-mono text-xl font-black text-white">99.4%</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/30 text-center">
                  <span className="text-[10px] uppercase font-bold text-orange-100 block">Customer Rating</span>
                  <span className="font-mono text-xl font-black text-white">4.92 ★</span>
                </div>
              </div>
            </div>

            {/* 2-Column Modern Analysis Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Delivery Zones & Radius Heatmap */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-orange-200/90 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-base text-stone-900">
                      25 km Distance Zones & Freshness Retention
                    </h4>
                    <p className="text-xs text-stone-500">
                      Orders grouped by radial distance from Park Street flagship kitchen
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    Max: 25.0 km
                  </span>
                </div>

                <div className="space-y-4 pt-1 text-xs">
                  {/* Zone 1 */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-stone-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Zone 1: Central Core (0–5 km)
                      </span>
                      <span className="font-mono text-stone-700">48% volume • 18-22 mins avg</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '48%' }} />
                    </div>
                    <span className="text-[10px] text-stone-500 block">
                      Park Street, Ballygunge, Alipore, Camac Street (₹40 base delivery fee)
                    </span>
                  </div>

                  {/* Zone 2 */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-stone-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        Zone 2: Sector V & Suburbs (5–15 km)
                      </span>
                      <span className="font-mono text-stone-700">37% volume • 30-36 mins avg</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '37%' }} />
                    </div>
                    <span className="text-[10px] text-stone-500 block">
                      Salt Lake City, New Town, EM Bypass, Gariahat (₹65 delivery fee)
                    </span>
                  </div>

                  {/* Zone 3 */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-stone-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        Zone 3: Outer Radius (15–25 km)
                      </span>
                      <span className="font-mono text-stone-700">15% volume • 40-48 mins avg</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: '15%' }} />
                    </div>
                    <span className="text-[10px] text-stone-500 block">
                      Barrackpore, Howrah, Jadavpur, Behala (₹95 delivery fee in insulated hot-packs)
                    </span>
                  </div>
                </div>

                {/* Radius enforcement quote */}
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>
                    <strong>Strict 25km Safety Enforced:</strong> 6 customer addresses exceeding 25 km were automatically prevented from checkout today to protect meal freshness.
                  </span>
                </div>
              </div>

              {/* Right Column: Hourly Sales Rush Peak Chart */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-orange-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-base text-stone-900">
                      Peak Kitchen Rush Hours
                    </h4>
                    <p className="text-xs text-stone-500">
                      Hourly order volume today
                    </p>
                  </div>
                  <span className="text-xs font-bold text-orange-700">Lunch &amp; Dinner Bhoj</span>
                </div>

                {/* CSS Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-1.5 pt-6 pb-2 border-b border-stone-200 text-[10px] text-stone-500 font-mono">
                  {[
                    { hour: '11am', height: '20%', count: 4 },
                    { hour: '12pm', height: '55%', count: 12 },
                    { hour: '1pm', height: '90%', count: 28, isPeak: true },
                    { hour: '2pm', height: '70%', count: 18 },
                    { hour: '3pm', height: '25%', count: 5 },
                    { hour: '5pm', height: '30%', count: 7 },
                    { hour: '7pm', height: '65%', count: 16 },
                    { hour: '8pm', height: '100%', count: 34, isPeak: true },
                    { hour: '9pm', height: '85%', count: 24 },
                    { hour: '10pm', height: '40%', count: 10 }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div
                        className={`w-full rounded-t-lg transition-all group-hover:opacity-80 relative ${
                          bar.isPeak
                            ? 'bg-gradient-to-t from-orange-500 to-amber-400 shadow-xs'
                            : 'bg-orange-200/80 hover:bg-orange-300'
                        }`}
                        style={{ height: bar.height }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black bg-stone-900 text-white px-1 rounded transition-opacity">
                          {bar.count}
                        </span>
                      </div>
                      <span className="text-[9px]">{bar.hour}</span>
                    </div>
                  ))}
                </div>

                {/* Top Selling Items Mini List */}
                <div className="space-y-2 pt-1 text-xs">
                  <span className="font-bold text-stone-900 block text-xs">
                    Top Selling Bengali Delicacies Today
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Shorshe Ilish (Padma Hilsa)', plates: 32, rev: '₹21,760' },
                      { name: 'Kosha Mangsho (Golbari Style)', plates: 44, rev: '₹23,760' },
                      { name: 'ষষ্ঠী স্পেশাল ভোজ থালি (Combo)', plates: 26, rev: '₹11,674' },
                      { name: 'Basanti Pulao with Kaju & Kishmish', plates: 38, rev: '₹9,880' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="font-semibold text-stone-800 truncate pr-2">
                          #{idx + 1} {item.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 font-mono">
                          <span className="text-[11px] text-stone-500">{item.plates} sold</span>
                          <span className="font-black text-orange-700">{item.rev}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: RIDERS & DELIVERY FLEET TRACKING                  */}
        {/* ======================================================== */}
        {adminTab === 'riders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-orange-200/90 shadow-xs">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Active Delivery Fleet (25km Radius Partners)
                </h3>
                <p className="text-xs text-stone-500">
                  Live status, battery power, and insulated bag temperature of Kolkata delivery fleet.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">Fleet Status:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  All 3 Online
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {riders.map((rider) => (
                <div
                  key={rider.id}
                  className="bg-white rounded-3xl p-5 border border-orange-200/90 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-stone-900">
                        {rider.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        {rider.vehicle}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        rider.status === 'on_delivery'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : rider.status === 'waiting'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {rider.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-orange-50/50 border border-orange-100 text-stone-700">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Rating</span>
                      <span className="font-black text-amber-600 text-sm">
                        {rider.rating} ★
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">Trips Today</span>
                      <span className="font-black text-stone-900 text-sm">
                        {rider.completedToday} orders
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[10px] text-stone-400 block">Phone</span>
                      <span className="font-mono text-[11px] font-bold text-stone-700">
                        {rider.phone}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[10px] text-stone-400 block">Thermal Bag</span>
                      <span className="font-mono text-[11px] font-bold text-orange-700 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-600" />
                        {rider.thermalBagTempC}°C Hot
                      </span>
                    </div>
                  </div>

                  {rider.currentOrderId && (
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                      <span className="text-stone-500">Delivering:</span>
                      <span className="font-mono font-black text-orange-700">
                        {rider.currentOrderId}
                      </span>
                    </div>
                  )}

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => alert(`Calling ${rider.name} at ${rider.phone}`)}
                      className="flex-1 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Rider</span>
                    </button>
                    <button
                      onClick={() => alert(`Live GPS location pinged for ${rider.name} (Within 25km radius)`)}
                      className="flex-1 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span>Ping GPS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: TABLE RESERVATIONS MANAGER                        */}
        {/* ======================================================== */}
        {adminTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-orange-200/90 shadow-xs">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Dine-In Table Reservations (Park Street Courtyard)
                </h3>
                <p className="text-xs text-stone-500">
                  Manage heritage dining table allocations and seating status.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">Courtyard Capacity:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  65% Booked
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-orange-200/90 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-orange-50/60 text-stone-600 font-extrabold border-b border-orange-100">
                    <tr>
                      <th className="p-4">Guest Name</th>
                      <th className="p-4">Party Size</th>
                      <th className="p-4">Date &amp; Time</th>
                      <th className="p-4">Seating Area</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100/60">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-sm text-stone-900">{booking.guestName}</div>
                          <span className="text-[11px] text-stone-400 font-mono">{booking.phone}</span>
                        </td>
                        <td className="p-4 font-black text-stone-800 text-sm">
                          {booking.guestsCount} Guests
                        </td>
                        <td className="p-4 font-semibold text-stone-700">
                          <div>{booking.date}</div>
                          <span className="text-orange-700 font-bold font-mono">{booking.timeSlot}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-bold text-[11px]">
                            {booking.area}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : booking.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : booking.status === 'seated'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'seated')}
                                className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer"
                              >
                                Seat Guests
                              </button>
                            )}
                            {booking.status === 'seated' && (
                              <span className="text-stone-400 text-xs font-semibold">Dining</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Dish Modal */}
      {isAddingDish && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-orange-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {editingDish ? 'Edit Bengali Dish' : 'Add New Authentic Dish'}
              </h3>
              <button
                onClick={() => setIsAddingDish(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditDishSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Dish Name (English):</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Bengali Script Name:</label>
                  <input
                    type="text"
                    required
                    value={formBengaliName}
                    onChange={(e) => setFormBengaliName(e.target.value)}
                    placeholder="সর্ষে ইলিশ / কষা মাংস"
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden focus:border-orange-500 font-bengali"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Category:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden capitalize font-medium"
                  >
                    <option value="starters">Starters</option>
                    <option value="curries">Curries</option>
                    <option value="rice-breads">Rice &amp; Breads</option>
                    <option value="thalis">Thalis</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-bold mb-1">Price (₹):</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-bold mb-1">Dietary:</label>
                  <select
                    value={formDietary}
                    onChange={(e) => setFormDietary(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden font-medium"
                  >
                    <option value="non-veg">Non-Veg</option>
                    <option value="veg">Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Image URL:</label>
                <input
                  type="url"
                  required
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Culinary Description:</label>
                <textarea
                  rows={3}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Ingredients, stone-ground mustard paste, pure ghee..."
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDish(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
