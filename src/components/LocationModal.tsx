import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { InteractiveLocationMap } from './MapComponents';
import { PRESET_TEST_LOCATIONS, RESTAURANT_LOCATION } from '../data/menuData';
import {
  MapPin,
  X,
  Crosshair,
  Search,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Bike
} from 'lucide-react';
import { estimateDeliveryMinutes, calculateDeliveryFee } from '../utils/distance';
import { formatINR } from '../utils/format';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    customerLocation,
    updateLocationByCoordinates,
    setCustomerLocation
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  // Temporary local state before user clicks "Confirm Location"
  const [tempLat, setTempLat] = useState(customerLocation.lat);
  const [tempLng, setTempLng] = useState(customerLocation.lng);
  const [tempAddress, setTempAddress] = useState(customerLocation.address);
  const [tempDistance, setTempDistance] = useState(customerLocation.distanceKm);
  const [tempWithin25, setTempWithin25] = useState(customerLocation.isWithin25Km);

  if (!isLocationModalOpen) return null;

  const handleLocationUpdate = (lat: number, lng: number, address?: string, city?: string) => {
    setTempLat(lat);
    setTempLng(lng);
    const updated = updateLocationByCoordinates(lat, lng, address, city);
    setTempAddress(updated.address);
    setTempDistance(updated.distanceKm);
    setTempWithin25(updated.isWithin25Km);
  };

  const handleDetectMyLocation = () => {
    setIsDetecting(true);
    setDetectError(null);

    if (!navigator.geolocation) {
      setDetectError('Geolocation is not supported by your browser.');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetecting(false);
        const { latitude, longitude } = position.coords;
        handleLocationUpdate(
          latitude,
          longitude,
          `Detected GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          'Current Location'
        );
      },
      (err) => {
        setIsDetecting(false);
        // Fallback for iframe or blocked permissions
        setDetectError(
          'Location access was denied or timed out. Please choose a preset below or drag the map pin.'
        );
        // Select Salt Lake Sector V as high quality demo location
        handleLocationUpdate(
          22.5735,
          88.4331,
          'Sector V, Salt Lake City (Default Kolkata Hub)',
          'Kolkata'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search query matched against preset locations or mock geocode
    const matchedPreset = PRESET_TEST_LOCATIONS.find((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedPreset) {
      handleLocationUpdate(
        matchedPreset.lat,
        matchedPreset.lng,
        matchedPreset.address,
        matchedPreset.city
      );
    } else {
      // Approximate geocode around Kolkata metropolitan area
      handleLocationUpdate(
        22.56 + (Math.random() - 0.5) * 0.08,
        88.38 + (Math.random() - 0.5) * 0.08,
        `${searchQuery.trim()}, Kolkata Metropolitan Area`,
        'Kolkata'
      );
    }
  };

  const handleConfirm = () => {
    updateLocationByCoordinates(tempLat, tempLng, tempAddress);
    setIsLocationModalOpen(false);
  };

  const estMins = estimateDeliveryMinutes(tempDistance);
  const sampleDeliveryFee = calculateDeliveryFee(tempDistance, 500);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bengali text-amber-300 text-sm tracking-wide">
                অবস্থান নির্ধারণ
              </span>
              <span className="bg-amber-600/60 text-amber-100 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-400/40">
                25 km Radius Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5 flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-300" />
              Delivery Location & Radius
            </h2>
            <p className="text-amber-100/90 text-xs sm:text-sm mt-1">
              Central Kitchen: <span className="font-semibold text-white">{RESTAURANT_LOCATION.name}</span>, Park Street
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="text-amber-200 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Action Row: Auto Detect & Search */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleDetectMyLocation}
              disabled={isDetecting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-semibold text-sm transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Crosshair className={`w-4 h-4 text-amber-700 ${isDetecting ? 'animate-spin' : ''}`} />
              {isDetecting ? 'Detecting GPS...' : 'Detect My Location'}
            </button>

            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kolkata locality (e.g., Salt Lake, New Town, Howrah)..."
                className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-slate-50/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold"
              >
                Search
              </button>
            </form>
          </div>

          {detectError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{detectError}</span>
            </div>
          )}

          {/* Quick Preset Locations (Includes inside and outside 25km test cases) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Quick Test Locations (Inside vs Outside 25km Radius):
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_TEST_LOCATIONS.map((loc) => {
                const isSelected = tempAddress.includes(loc.name) || tempAddress.includes(loc.city);
                const isInside = loc.expectedStatus.includes('Inside');
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleLocationUpdate(loc.lat, loc.lng, loc.address, loc.city)}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/30 font-medium'
                        : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="font-semibold text-slate-800 truncate">{loc.name}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span
                        className={`font-medium ${
                          isInside ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'
                        }`}
                      >
                        {loc.expectedStatus}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Google Map with 25 km Delivery Radius Circle */}
          <div>
            <div className="flex items-center justify-between mb-1 text-xs text-slate-500">
              <span>Interactive Map (Click anywhere or drag pin to test radius):</span>
              <span className="text-[11px] text-amber-800 font-medium">
                Terracotta Circle = 25 km zone
              </span>
            </div>
            <InteractiveLocationMap
              customerLat={tempLat}
              customerLng={tempLng}
              onLocationSelect={(lat, lng) => handleLocationUpdate(lat, lng)}
              isWithin25Km={tempWithin25}
              distanceKm={tempDistance}
            />
          </div>

          {/* Distance Calculation & Delivery Verdict Card */}
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              tempWithin25
                ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/60 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  tempWithin25 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {tempWithin25 ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base">
                    {tempWithin25
                      ? '✓ Online Food Delivery Available'
                      : '⚠ Outside 25 km Delivery Radius'}
                  </h4>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${
                      tempWithin25
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    Distance: {tempDistance} km
                  </span>
                </div>

                {tempWithin25 ? (
                  <p className="text-xs text-slate-700">
                    Your location is <span className="font-semibold text-emerald-800">{tempDistance} km</span> from our Park Street kitchen (within the 25.0 km threshold). Food arrives steaming hot!
                  </p>
                ) : (
                  <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    We currently deliver exclusively within a 25 km radius to preserve traditional Bengali aroma, crunch, and authentic temperature. However, you can still place orders for <strong>Takeaway (Self-Pickup)</strong> or <strong>Dine-In Table Reservations</strong>!
                  </p>
                )}

                {tempWithin25 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                      <span className="text-slate-500 block text-[10px]">Estimated Delivery</span>
                      <span className="font-bold text-slate-800">
                        {estMins}–{estMins + 10} mins
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                      <span className="text-slate-500 block text-[10px]">Delivery Fee</span>
                      <span className="font-bold text-slate-800">
                        {formatINR(sampleDeliveryFee)} <span className="text-[10px] text-emerald-600 font-normal">(Free &gt; ₹799)</span>
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-200 col-span-2 sm:col-span-1">
                      <span className="text-slate-500 block text-[10px]">Packaging</span>
                      <span className="font-bold text-slate-800">Clay &amp; Eco Banana Leaf</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Confirm This Location</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
