import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { AlertCircle, ShoppingBag, UtensilsCrossed, MapPin, X } from 'lucide-react';

export const RadiusExceededModal: React.FC = () => {
  const {
    isRadiusExceededModalOpen,
    setIsRadiusExceededModalOpen,
    customerLocation,
    setIsLocationModalOpen,
    setIsReservationModalOpen,
    setIsCheckoutModalOpen
  } = useRestaurant();

  if (!isRadiusExceededModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-amber-300 overflow-hidden relative">
        <button
          onClick={() => setIsRadiusExceededModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-300 shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="font-bengali text-amber-700 font-bold text-sm mb-1">
            ২৫ কিমি সীমার বাইরে
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Delivery Radius Limit Reached
          </h3>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 mb-4 text-left text-xs sm:text-sm text-slate-700">
            <p className="font-semibold text-amber-950 mb-1">
              Selected: <span className="font-normal text-slate-800">{customerLocation.address}</span>
            </p>
            <p className="text-amber-900 font-bold">
              Distance: {customerLocation.distanceKm} km (Delivery limit: 25.0 km)
            </p>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            “We currently deliver only within a <strong>25 km radius</strong> to ensure your food arrives piping hot with authentic aroma! However, you can place an order for <strong>Takeaway</strong> or <strong>Dine-In reservation</strong>.”
          </p>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                setIsRadiusExceededModalOpen(false);
                setIsCheckoutModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Order for Takeaway (Self-Pickup)
            </button>

            <button
              onClick={() => {
                setIsRadiusExceededModalOpen(false);
                setIsReservationModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-300" />
              Reserve a Royal Table (Dine-In)
            </button>

            <button
              onClick={() => {
                setIsRadiusExceededModalOpen(false);
                setIsLocationModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Select a Different Delivery Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
