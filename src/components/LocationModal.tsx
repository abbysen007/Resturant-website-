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
  Bike,
  User,
  Phone,
  Home,
  Briefcase,
  ChevronLeft,
  Check
} from 'lucide-react';
import { estimateDeliveryMinutes, calculateDeliveryFee } from '../utils/distance';
import { formatINR } from '../utils/format';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    customerLocation,
    updateLocationByCoordinates,
    setCustomerLocation,
    customerDetails,
    setCustomerDetails,
    user,
    addSavedAddress
  } = useRestaurant();

  const [step, setStep] = useState<'select_map' | 'enter_details'>('select_map');

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  // Temporary local state before user clicks "Confirm Location"
  const [tempLat, setTempLat] = useState(customerLocation.lat);
  const [tempLng, setTempLng] = useState(customerLocation.lng);
  const [tempAddress, setTempAddress] = useState(customerLocation.address);
  const [tempDistance, setTempDistance] = useState(customerLocation.distanceKm);
  const [tempWithin25, setTempWithin25] = useState(customerLocation.isWithin25Km);

  // Step 2 Address Details Form
  const [contactName, setContactName] = useState(customerDetails?.name || user?.name || 'Abhijit Sen');
  const [contactPhone, setContactPhone] = useState(customerDetails?.phone || user?.phone || '+91 98301 23456');
  const [flatDetails, setFlatDetails] = useState(customerDetails?.flatDetails || 'Flat 4B, Heritage Enclave');
  const [landmark, setLandmark] = useState(customerDetails?.landmark || 'Near Park Mansions');
  const [addressTag, setAddressTag] = useState<'home' | 'work' | 'other'>('home');
  const [deliveryNote, setDeliveryNote] = useState('');

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
        setDetectError(
          'Location access was denied or timed out. Please choose a preset below or drag the map pin.'
        );
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
      handleLocationUpdate(
        22.56 + (Math.random() - 0.5) * 0.08,
        88.38 + (Math.random() - 0.5) * 0.08,
        `${searchQuery.trim()}, Kolkata`,
        'Kolkata'
      );
    }
  };

  const handleProceedToAddressDetails = () => {
    setStep('enter_details');
  };

  const handleFinalSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDetails = {
      name: contactName,
      phone: contactPhone,
      flatDetails,
      landmark
    };
    setCustomerDetails(updatedDetails);

    const fullFinalAddress = `${flatDetails ? flatDetails + ', ' : ''}${tempAddress}`;

    setCustomerLocation({
      address: fullFinalAddress,
      city: 'Kolkata',
      lat: tempLat,
      lng: tempLng,
      distanceKm: tempDistance,
      isWithin25Km: tempWithin25
    });

    if (user && addSavedAddress) {
      addSavedAddress({
        tag: addressTag,
        name: contactName,
        phone: contactPhone,
        flatDetails,
        landmark,
        fullAddress: fullFinalAddress,
        city: 'Kolkata',
        lat: tempLat,
        lng: tempLng,
        distanceKm: tempDistance
      });
    }

    setStep('select_map');
    setIsLocationModalOpen(false);
  };

  const estMins = estimateDeliveryMinutes(tempDistance);
  const sampleDeliveryFee = calculateDeliveryFee(tempDistance, 500);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl max-w-2xl w-full shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 via-white to-amber-50 border-b border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'enter_details' && (
              <button
                type="button"
                onClick={() => setStep('select_map')}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-ultra text-base sm:text-lg text-stone-900 leading-snug">
                {step === 'select_map'
                  ? 'Kolkata 25 km Delivery & Freshness Zone'
                  : 'Enter Complete Delivery Address & Contact'}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {step === 'select_map'
                  ? 'Authentic slow-cooked Bengali bhoj dispatched within 25 km radius'
                  : 'Specify receiver name, phone number, flat/house details'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setStep('select_map');
              setIsLocationModalOpen(false);
            }}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SELECT MAP / PRESET */}
        {step === 'select_map' && (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
            {/* Search and Auto-detect Row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Kolkata locality (e.g., Salt Lake, New Town, Alipore)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-50/70 border border-stone-200 text-xs text-stone-900 placeholder-stone-400 outline-hidden focus:border-orange-500"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </form>

              <button
                type="button"
                onClick={handleDetectMyLocation}
                disabled={isDetecting}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
                <span>{isDetecting ? 'Detecting...' : 'Detect GPS'}</span>
              </button>
            </div>

            {detectError && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{detectError}</span>
              </div>
            )}

            {/* Google Map Box */}
            <div className="rounded-2xl overflow-hidden border border-orange-100 shadow-inner">
              <InteractiveLocationMap
                customerLat={tempLat}
                customerLng={tempLng}
                onLocationSelect={handleLocationUpdate}
                isWithin25Km={tempWithin25}
                distanceKm={tempDistance}
              />
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Quick Test Delivery Locations:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_TEST_LOCATIONS.slice(0, 4).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      handleLocationUpdate(
                        preset.lat,
                        preset.lng,
                        preset.address,
                        preset.city
                      )
                    }
                    className="p-2.5 rounded-xl border border-stone-200 hover:border-orange-400 hover:bg-orange-50/50 text-left transition-all cursor-pointer text-xs"
                  >
                    <span className="font-bold text-stone-900 block truncate">{preset.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono block mt-0.5">{preset.expectedStatus}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Radius Verification Status Box */}
            <div
              className={`p-4 rounded-2xl border ${
                tempWithin25
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : 'bg-rose-50/80 border-rose-200'
              } space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tempWithin25 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span className="font-extrabold text-stone-900 text-xs sm:text-sm">
                    {tempWithin25 ? 'Inside 25 km Freshness Delivery Radius' : 'Outside 25 km Delivery Limit'}
                  </span>
                </div>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    tempWithin25 ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                  }`}
                >
                  {tempDistance} km away
                </span>
              </div>

              <p className="text-xs text-stone-600">
                {tempWithin25
                  ? `Your pinned location is ${tempDistance} km from our Park Street kitchen. Dispatched in thermal insulated clay handis!`
                  : `Our authentic Bengali bhoj is delivered strictly within 25 km to guarantee aroma and authentic serving heat.`}
              </p>

              {tempWithin25 && (
                <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
                    <span className="text-stone-400 block text-[10px]">Estimated ETA</span>
                    <span className="font-bold text-stone-800">{estMins}–{estMins + 10} mins</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
                    <span className="text-stone-400 block text-[10px]">Delivery Fee</span>
                    <span className="font-bold text-stone-800">{formatINR(sampleDeliveryFee)}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
                    <span className="text-stone-400 block text-[10px]">Packaging</span>
                    <span className="font-bold text-stone-800">Clay Pot &amp; Banana Leaf</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: ENTER ADDRESS DETAILS, NUMBER AND NAME (AS REQUESTED) */}
        {step === 'enter_details' && (
          <form onSubmit={handleFinalSaveAddress} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
            {/* Confirmed Pin Summary */}
            <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-stone-400 block font-bold uppercase">Pinned Locality</span>
                  <span className="font-extrabold text-stone-900 truncate block">{tempAddress}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                {tempDistance} km
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-black uppercase text-stone-600 mb-1">
                  Receiver Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Abhijit Sen"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-stone-600 mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98301 23456"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-mono font-bold text-xs outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-stone-600 mb-1">
                Flat / Floor / House No. / Building Name *
              </label>
              <input
                type="text"
                required
                value={flatDetails}
                onChange={(e) => setFlatDetails(e.target.value)}
                placeholder="e.g. Flat 4B, 3rd Floor, Heritage Enclave"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs outline-hidden focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-stone-600 mb-1">
                Nearby Landmark / Street Detail
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Park Mansions / Opposite South City Mall"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Address Tag Selector */}
            <div>
              <label className="block text-[11px] font-black uppercase text-stone-600 mb-1.5">
                Save As Address Tag:
              </label>
              <div className="flex gap-2">
                {[
                  { tag: 'home', label: 'Home', icon: Home },
                  { tag: 'work', label: 'Work', icon: Briefcase },
                  { tag: 'other', label: 'Other', icon: MapPin }
                ].map(({ tag, label, icon: Icon }) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setAddressTag(tag as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      addressTag === tag
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-stone-600 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="e.g. Ring the doorbell / Leave with building security"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs outline-hidden focus:border-orange-500"
              />
            </div>
          </form>
        )}

        {/* Footer actions */}
        <div className="bg-stone-50/80 p-4 border-t border-stone-200/60 flex items-center justify-between gap-3">
          {step === 'select_map' ? (
            <>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedToAddressDetails}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md transition-all cursor-pointer active:scale-95"
              >
                <span>Confirm Pin &amp; Enter Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('select_map')}
                className="px-4 py-2.5 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Map
              </button>
              <button
                type="button"
                onClick={handleFinalSaveAddress}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Save Address &amp; Set Active</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
