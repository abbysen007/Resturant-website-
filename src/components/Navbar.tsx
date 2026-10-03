import React, { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  Search,
  ShoppingBag,
  MapPin,
  Clock,
  LayoutDashboard,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Plus,
  UtensilsCrossed,
  Sparkles,
  Crosshair,
  Compass,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Bike,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { formatINR } from '../utils/format';
import { PRESET_TEST_LOCATIONS, RESTAURANT_LOCATION } from '../data/menuData';
import { estimateDeliveryMinutes, calculateDeliveryFee } from '../utils/distance';

export const Navbar: React.FC = () => {
  const {
    customerLocation,
    updateLocationByCoordinates,
    setIsLocationModalOpen,
    cart,
    setIsCartOpen,
    orders,
    currentView,
    setCurrentView,
    activeCustomerTab,
    setActiveCustomerTab,
    setIsReservationModalOpen,
    menuItems,
    searchQuery,
    setSearchQuery,
    setSelectedDishDetails,
    addToCart
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Professional Location Popover & GPS State
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locateStatus, setLocateStatus] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrderCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const estimatedMins = estimateDeliveryMinutes(customerLocation.distanceKm);
  const deliveryCost = calculateDeliveryFee(customerLocation.distanceKm, 0);

  // Auto-Detect Current GPS Location
  const handleDetectMyLocation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsLocating(true);
    setLocateStatus('Detecting your GPS position...');

    if (!navigator.geolocation) {
      setLocateStatus('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const updated = updateLocationByCoordinates(lat, lng, 'Current Detected Location, Kolkata', 'Kolkata');
        setIsLocating(false);
        setLocateStatus(`Located! (${updated.distanceKm} km from kitchen)`);
        setTimeout(() => {
          setLocateStatus(null);
          setIsLocationDropdownOpen(false);
        }, 1200);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsLocating(false);
        setLocateStatus('Could not detect position. Please choose a preset below or use the map.');
        setTimeout(() => setLocateStatus(null), 3000);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleSelectPreset = (preset: typeof PRESET_TEST_LOCATIONS[0]) => {
    updateLocationByCoordinates(preset.lat, preset.lng, preset.address, preset.city);
    setIsLocationDropdownOpen(false);
  };

  // Filter matching dishes for live dropdown search
  const matchingDishes = searchQuery.trim()
    ? menuItems
        .filter((d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.bengaliName.includes(searchQuery) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    setCurrentView('customer');
    setActiveCustomerTab('menu');
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    setCurrentView('customer');
    setActiveCustomerTab('menu');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Left: Brand Logo & Sleek Location Dropdown */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => {
                setCurrentView('customer');
                setActiveCustomerTab('menu');
                setSearchQuery('');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
                <span className="font-bengali text-xl sm:text-2xl">র</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-stone-900 font-lato">
                    Roshoi Ghor
                  </span>
                </div>
                <span className="font-bengali text-orange-600 text-[10px] sm:text-[11px] font-black block -mt-1">
                  রসুই ঘর • The Bengal Palette
                </span>
              </div>
            </button>

            {/* Professional Restaurant Location Detection & Delivery Zone Module */}
            <div ref={locationRef} className="relative hidden md:block">
              <div className="flex items-center bg-stone-50/90 hover:bg-orange-50/50 border border-stone-200 hover:border-orange-300 rounded-2xl p-1 transition-all shadow-2xs group">
                {/* Main Clickable Address Trigger */}
                <button
                  type="button"
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 text-left cursor-pointer transition-colors"
                  title="Click to view or change delivery address"
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 max-w-[130px] lg:max-w-[180px]">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="text-[10px] uppercase font-black tracking-wider text-stone-400 block truncate">
                        Delivering To
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          customerLocation.isWithin25Km
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {customerLocation.distanceKm} km
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs font-black text-stone-900 truncate block">
                        {customerLocation.city || customerLocation.address.split(',')[0] || 'Kolkata'}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600 transition-transform shrink-0 ${
                          isLocationDropdownOpen ? 'rotate-180 text-orange-600' : ''
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-stone-200 mx-0.5" />

                {/* Instant 1-Click GPS Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleDetectMyLocation}
                  disabled={isLocating}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-orange-100/70 text-orange-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                  title="Auto-detect current GPS location instantly"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600 shrink-0" />
                  ) : (
                    <Crosshair className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  )}
                  <span className="hidden xl:inline text-[11px] font-extrabold">GPS</span>
                </button>
              </div>

              {/* Status Toast Notification when locating */}
              {locateStatus && (
                <div className="absolute top-full left-0 mt-2 px-3 py-1.5 rounded-xl bg-stone-900 text-white text-[11px] font-bold shadow-xl border border-stone-800 z-50 animate-in fade-in flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{locateStatus}</span>
                </div>
              )}

              {/* Interactive Professional Dropdown Popover */}
              {isLocationDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 lg:w-96 bg-white rounded-3xl shadow-2xl border border-orange-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                  {/* Popover Header */}
                  <div className="p-4 bg-orange-50/70 border-b border-orange-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900">
                        Delivery Coverage in Kolkata
                      </h4>
                      <span className="font-bengali text-orange-700 text-[11px] font-bold block">
                        ২৫ কিমি টাটকা ভোজ সরবরাহ ব্যবস্থা
                      </span>
                    </div>
                    <button
                      onClick={() => setIsLocationDropdownOpen(false)}
                      className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Current Selected Location Card */}
                  <div className="p-4 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-orange-100 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">
                              Active Delivery Address
                            </span>
                            <span className="font-bold text-xs text-stone-900 leading-snug block">
                              {customerLocation.address}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                            customerLocation.isWithin25Km
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {customerLocation.distanceKm} km away
                        </span>
                      </div>

                      {/* Distance & Time KPI Row */}
                      <div className="pt-2 border-t border-stone-200/60 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span>~{estimatedMins} mins in thermal pots</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <Bike className="w-3.5 h-3.5 text-orange-500" />
                          <span>Fee: {deliveryCost === 0 ? 'Free' : formatINR(deliveryCost)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Primary GPS Auto-Detect Button */}
                    <button
                      onClick={handleDetectMyLocation}
                      disabled={isLocating}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      {isLocating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Crosshair className="w-4 h-4" />
                      )}
                      <span>Auto-Detect My Current GPS Location</span>
                    </button>

                    {/* Quick Popular Kolkata Delivery Hubs */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        Quick Select Kolkata Hubs:
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {PRESET_TEST_LOCATIONS.slice(0, 4).map((loc, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectPreset(loc)}
                            className="w-full text-left p-2 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-950 transition-colors flex items-center justify-between text-xs cursor-pointer border border-transparent hover:border-orange-200"
                          >
                            <span className="font-semibold truncate pr-2">
                              {loc.name}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400 shrink-0">
                              {loc.expectedStatus}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Open Full Google Maps Modal Action */}
                    <div className="pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setIsLocationDropdownOpen(false);
                          setIsLocationModalOpen(true);
                        }}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:border-orange-300 text-stone-700 hover:text-orange-700 bg-stone-50/50 hover:bg-orange-50/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-orange-600" />
                        <span>Open Interactive 25km Map & Search Address</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Real-Time Menu Items Search Bar (Embedded in Navbar) */}
          <div ref={searchRef} className="hidden sm:block flex-1 max-w-xs md:max-w-sm lg:max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search menu (e.g. Shorshe Ilish, Kosha, Paturi)..."
                className="w-full pl-9 pr-8 py-2 rounded-full border border-stone-200 hover:border-amber-300 focus:border-amber-500 bg-stone-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-hidden transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                {matchingDishes.length > 0 ? (
                  <div className="divide-y divide-stone-100">
                    <div className="p-2 bg-amber-50/50 text-[11px] font-bold text-amber-900 flex justify-between">
                      <span>Menu Results ({matchingDishes.length})</span>
                      <button
                        onClick={handleSearchSubmit}
                        className="text-amber-700 hover:underline cursor-pointer"
                      >
                        View in menu ➔
                      </button>
                    </div>

                    {matchingDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="p-2.5 hover:bg-stone-50 transition-colors flex items-center justify-between gap-2.5 cursor-pointer"
                        onClick={() => {
                          setSelectedDishDetails(dish);
                          setIsSearchFocused(false);
                        }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-bold text-slate-900 block truncate">
                              {dish.name}
                            </span>
                            <span className="font-bengali text-amber-700 text-[10px] block truncate">
                              {dish.bengaliName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-slate-900 font-mono">
                            {formatINR(dish.price)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(dish, 1);
                              setIsSearchFocused(false);
                            }}
                            className="p-1.5 rounded-lg bg-[#E5A93B] hover:bg-[#d8992a] text-slate-950 font-bold"
                            title="Add to cart"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-xs">
                    No dishes found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Navigation Links, Cart & Reserve Table Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden p-2 rounded-xl text-slate-700 hover:bg-stone-100"
              title="Search menu"
            >
              <Search className="w-5 h-5 text-slate-700" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-3.5 text-xs xl:text-sm font-semibold text-stone-700">
              {/* Dedicated Bhoj Menu section link */}
              <button
                onClick={() => {
                  setCurrentView('customer');
                  setActiveCustomerTab('menu');
                  scrollToSection('bhoj-menu-section');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border border-red-200 text-red-900 transition-all cursor-pointer font-bold shadow-2xs group"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-600 group-hover:rotate-12 transition-transform" />
                <span className="font-bengali text-xs">ভোজ মেনু</span>
                <span className="text-[11px] font-extrabold uppercase text-red-700">Bhoj Thalis</span>
              </button>

              <button
                onClick={() => scrollToSection('menu-section')}
                className={`hover:text-orange-700 transition-colors cursor-pointer flex items-center gap-1 ${
                  currentView === 'customer' && activeCustomerTab === 'menu'
                    ? 'text-orange-700 font-bold'
                    : ''
                }`}
              >
                <span>Menu</span>
                <span className="font-bengali text-xs text-orange-600 font-bold">মেনু</span>
              </button>

              <button
                onClick={() => scrollToSection('reviews-section')}
                className="hover:text-orange-700 transition-colors cursor-pointer"
              >
                Reviews
              </button>

              <button
                onClick={() => {
                  setCurrentView('customer');
                  setActiveCustomerTab('tracking');
                }}
                className={`hover:text-orange-700 transition-colors cursor-pointer flex items-center gap-1 relative ${
                  currentView === 'customer' && activeCustomerTab === 'tracking'
                    ? 'text-orange-700 font-bold'
                    : ''
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>Tracking</span>
                {activeOrderCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>
            </nav>

            {/* Shopping Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-orange-50 text-stone-800 transition-colors cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              {totalCartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Orange & Yellow Reserve Table Pill Button */}
            <button
              onClick={() => setIsReservationModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>Reserve Table</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Professional Location Detection Strip */}
        <div className="md:hidden py-2 px-1 border-t border-stone-100 flex items-center justify-between text-xs gap-2">
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 min-w-0 text-left cursor-pointer flex-1"
          >
            <div className="relative shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute" />
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <div className="truncate">
              <span className="text-[10px] text-stone-400 block -mb-0.5 uppercase font-bold">
                Deliver to:
              </span>
              <span className="font-black text-stone-900 truncate text-xs block">
                {customerLocation.city || customerLocation.address.split(',')[0]}
              </span>
            </div>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                customerLocation.isWithin25Km
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {customerLocation.distanceKm} km
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={handleDetectMyLocation}
            disabled={isLocating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider shrink-0 transition-colors border border-orange-200"
          >
            {isLocating ? (
              <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
            ) : (
              <Crosshair className="w-3 h-3 text-orange-600" />
            )}
            <span>Detect GPS</span>
          </button>
        </div>

        {/* Mobile Search Bar Expansion */}
        {mobileSearchOpen && (
          <div className="sm:hidden pb-3 pt-1 border-t border-stone-100">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu dishes..."
                className="w-full pl-9 pr-8 py-2 rounded-full border border-stone-300 text-xs text-slate-800 bg-white outline-hidden focus:border-amber-500"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-stone-200 space-y-2.5 animate-in slide-in-from-top-2">
            {/* Mobile Location Badge */}
            <button
              onClick={() => {
                setIsLocationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-xs font-bold text-amber-950 border border-amber-200"
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="truncate">Delivering: {customerLocation.address}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  customerLocation.isWithin25Km ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {customerLocation.distanceKm} km
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-800">
              <button
                onClick={() => scrollToSection('bhoj-menu-section')}
                className="p-2.5 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 text-red-950 border border-red-200 text-left col-span-2 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <span className="font-bengali">ঐতিহ্যবাহী ভোজ মেনু (Bhoj Thalis)</span>
                </div>
                <span className="text-[10px] bg-red-800 text-white px-2 py-0.5 rounded-full font-sans font-black">
                  Special
                </span>
              </button>
              <button
                onClick={() => scrollToSection('menu-section')}
                className="p-2.5 rounded-xl bg-stone-100 text-left"
              >
                Menu (মেনু)
              </button>
              <button
                onClick={() => scrollToSection('about-services')}
                className="p-2.5 rounded-xl bg-stone-100 text-left"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('reviews-section')}
                className="p-2.5 rounded-xl bg-stone-100 text-left"
              >
                Reviews
              </button>
              <button
                onClick={() => {
                  setCurrentView('customer');
                  setActiveCustomerTab('tracking');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-stone-100 text-left flex items-center justify-between"
              >
                <span>Live Tracking</span>
                {activeOrderCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            <button
              onClick={() => {
                setIsReservationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs text-center shadow-xs"
            >
              Reserve Table (টেবিল বুকিং)
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
