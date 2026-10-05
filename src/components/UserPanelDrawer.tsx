import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  X,
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Calendar,
  LogOut,
  Award,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { formatINR, formatTime } from '../utils/format';
import { SavedAddress } from '../types';

export const UserPanelDrawer: React.FC = () => {
  const {
    user,
    logout,
    isUserPanelOpen,
    setIsUserPanelOpen,
    orders,
    menuItems,
    addToCart,
    setCurrentTrackingOrderId,
    setActiveCustomerTab,
    setCurrentView,
    deleteSavedAddress,
    addSavedAddress,
    updateLocationByCoordinates,
    toggleFavoriteDish
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'favorites' | 'bookings'>('orders');

  // New address state
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [newTag, setNewTag] = useState<'home' | 'work' | 'other'>('home');
  const [newFlat, setNewFlat] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newFullAddress, setNewFullAddress] = useState('Ballygunge Circular Road, Kolkata');

  if (!isUserPanelOpen || !user) return null;

  // Filter user orders
  const userOrders = orders;

  // Favorited dishes
  const favoriteDishes = menuItems.filter((m) => user.favoriteDishIds.includes(m.id));

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSavedAddress({
      tag: newTag,
      name: user.name,
      phone: user.phone || '+91 98301 23456',
      flatDetails: newFlat || 'Flat 2A',
      landmark: newLandmark || 'Near Landmark',
      fullAddress: newFullAddress,
      city: 'Kolkata',
      lat: 22.5312,
      lng: 88.3582,
      distanceKm: 3.8
    });
    setIsAddingAddr(false);
    setNewFlat('');
    setNewLandmark('');
  };

  const handleSelectDeliveryAddress = (addr: SavedAddress) => {
    updateLocationByCoordinates(addr.lat, addr.lng, addr.fullAddress, addr.city);
    setIsUserPanelOpen(false);
  };

  return (
    <div
      onClick={() => setIsUserPanelOpen(false)}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex justify-end animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white/85 backdrop-blur-2xl border-l border-white/60 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header Profile Section */}
        <div className="p-6 bg-gradient-to-br from-orange-50/80 via-white/60 to-amber-50/80 border-b border-orange-100/70 relative">
          <button
            onClick={() => setIsUserPanelOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-black">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-ultra text-lg text-stone-900 leading-tight">
                {user.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                {user.email ? (
                  <span className="flex items-center gap-1 text-[11px] truncate max-w-[190px]">
                    <Mail className="w-3 h-3 text-orange-600" />
                    {user.email}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3 text-orange-600" />
                    {user.phone}
                  </span>
                )}
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 text-[10px] font-black text-amber-900">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{user.memberTier}</span>
              </div>
            </div>
          </div>

          {/* Points & Rewards Card */}
          <div className="mt-4 p-3 rounded-2xl bg-white/70 border border-orange-200/80 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Roshoi Points
                </span>
                <span className="font-mono font-black text-sm text-stone-900">
                  {user.points} Coins
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded-lg">
              ₹1 = 1 Point
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 p-2 bg-stone-50/80 border-b border-stone-200/60 text-xs font-bold text-stone-600">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'orders' ? 'bg-white text-orange-700 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px]">Orders ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'addresses' ? 'bg-white text-orange-700 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-[10px]">Addresses ({user.savedAddresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'favorites' ? 'bg-white text-orange-700 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-[10px]">Favorites ({favoriteDishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'bookings' ? 'bg-white text-orange-700 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px]">Dine-In</span>
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="text-center py-10 text-stone-400 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs">You have not placed any orders yet.</p>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-white/70 border border-orange-100 shadow-xs hover:shadow-md transition-all space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                        {ord.id}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {formatTime(ord.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-stone-700">
                          <span className="truncate pr-2">{it.quantity}x {it.dish.name}</span>
                          <span className="font-mono font-bold text-stone-900 shrink-0">
                            {formatINR(it.dish.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Total</span>
                        <span className="font-mono font-black text-stone-900">
                          {formatINR(ord.total)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentTrackingOrderId(ord.id);
                          setCurrentView('customer');
                          setActiveCustomerTab('tracking');
                          setIsUserPanelOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Live Tracking</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">Kolkata Delivery Spots:</span>
                <button
                  onClick={() => setIsAddingAddr(!isAddingAddr)}
                  className="text-xs font-black text-orange-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {isAddingAddr && (
                <form onSubmit={handleAddNewAddressSubmit} className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3 text-xs">
                  <div className="flex gap-2">
                    {(['home', 'work', 'other'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewTag(t)}
                        className={`flex-1 py-1 rounded-lg uppercase text-[10px] font-black cursor-pointer ${
                          newTag === t ? 'bg-orange-500 text-white' : 'bg-white text-stone-700 border border-stone-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Flat / Floor / House No."
                    value={newFlat}
                    onChange={(e) => setNewFlat(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white border border-stone-200 text-stone-900 outline-hidden"
                  />

                  <input
                    type="text"
                    placeholder="Nearby Landmark"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white border border-stone-200 text-stone-900 outline-hidden"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Full Street & Area Address"
                    value={newFullAddress}
                    onChange={(e) => setNewFullAddress(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white border border-stone-200 text-stone-900 outline-hidden"
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddr(false)}
                      className="px-3 py-1 rounded-lg text-stone-500 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-orange-500 text-white font-bold shadow-xs"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {user.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl bg-white/70 border border-orange-100 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md uppercase font-black text-[10px] bg-stone-100 text-stone-800">
                      {addr.tag}
                    </span>
                    <button
                      onClick={() => deleteSavedAddress(addr.id)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-stone-900">{addr.flatDetails}</h5>
                    <p className="text-[11px] text-stone-500 truncate">{addr.fullAddress}</p>
                    {addr.landmark && (
                      <p className="text-[10px] text-stone-400">Landmark: {addr.landmark}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectDeliveryAddress(addr)}
                    className="w-full py-2 rounded-xl bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>Deliver Here (Set Active)</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-3">
              {favoriteDishes.length === 0 ? (
                <div className="text-center py-10 text-stone-400 space-y-2">
                  <Heart className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs">No saved favorites yet.</p>
                </div>
              ) : (
                favoriteDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-2xl bg-white/70 border border-orange-100 shadow-xs flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-extrabold text-stone-900 block truncate">
                          {dish.name}
                        </span>
                        <span className="font-bengali text-orange-700 text-[11px] block truncate">
                          {dish.bengaliName}
                        </span>
                        <span className="font-mono font-bold text-stone-900 text-xs">
                          {formatINR(dish.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(dish, 1);
                        setIsUserPanelOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shrink-0 shadow-2xs cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/70 border border-orange-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900">Park Street Courtyard Feast</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    Confirmed
                  </span>
                </div>
                <div className="text-stone-600 text-[11px] space-y-0.5">
                  <p>Guests: <strong>4 Persons</strong></p>
                  <p>Slot: <strong>Tonight, 8:30 PM (Dinner)</strong></p>
                  <p>Seating: <strong>Traditional Bel-Metal Brass Table</strong></p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Logout Action */}
        <div className="p-4 sm:p-5 border-t border-stone-200/60 bg-white/50">
          <button
            onClick={logout}
            className="w-full py-2.5 px-4 rounded-2xl border border-stone-300 hover:border-rose-300 hover:bg-rose-50 text-stone-700 hover:text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-stone-400 group-hover:text-rose-600" />
            <span>Sign Out from Account (লগ আউট)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
