import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MapPin, CheckCircle2, AlertTriangle, Navigation2, Clock } from 'lucide-react';
import { estimateDeliveryMinutes } from '../utils/distance';

export const DeliveryRadiusBanner: React.FC = () => {
  const { customerLocation, setIsLocationModalOpen } = useRestaurant();
  const estMins = estimateDeliveryMinutes(customerLocation.distanceKm);

  return (
    <div
      className={`border-b transition-colors ${
        customerLocation.isWithin25Km
          ? 'bg-gradient-to-r from-amber-50 via-emerald-50/40 to-amber-50 border-emerald-200/70'
          : 'bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-rose-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              customerLocation.isWithin25Km
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {customerLocation.isWithin25Km ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-semibold text-slate-900">
              {customerLocation.isWithin25Km ? 'Delivering to:' : 'Delivery Unavailable:'}
            </span>
            <span className="text-slate-700 truncate max-w-[200px] sm:max-w-xs font-medium">
              {customerLocation.address}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                customerLocation.isWithin25Km
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {customerLocation.distanceKm} km from Kitchen
            </span>

            {customerLocation.isWithin25Km ? (
              <span className="hidden md:inline-flex items-center gap-1 text-slate-600 text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                Est. {estMins}–{estMins + 10} mins
              </span>
            ) : (
              <span className="text-rose-700 font-semibold text-xs">
                Exceeds 25 km radius (Takeaway & Dine-in available)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/60 font-medium text-xs shadow-xs transition-all hover:border-amber-400"
          >
            <Navigation2 className="w-3.5 h-3.5 text-amber-700" />
            Change Location
          </button>
        </div>
      </div>
    </div>
  );
};
