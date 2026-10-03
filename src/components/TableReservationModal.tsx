import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  X,
  UtensilsCrossed,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Phone,
  ArrowRight
} from 'lucide-react';
import { RESTAURANT_LOCATION } from '../data/menuData';

export const TableReservationModal: React.FC = () => {
  const { isReservationModalOpen, setIsReservationModalOpen } = useRestaurant();

  const [guestName, setGuestName] = useState('Rahul Mukherjee');
  const [guestPhone, setGuestPhone] = useState('+91 98302 99881');
  const [guestCount, setGuestCount] = useState(4);
  const [date, setDate] = useState('2026-10-04');
  const [timeSlot, setTimeSlot] = useState('08:00 PM (Dinner Bhoj)');
  const [seatingArea, setSeatingArea] = useState('Heritage Courtyard (ঐতিহ্যবাহী উঠোন)');
  const [specialRequest, setSpecialRequest] = useState('Special celebration - arrange Gondhoraj lebu & Kasundi platter');

  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  if (!isReservationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedBookingId(id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bengali text-amber-300 text-xs font-bold">
                  টেবিল বুকিং
                </span>
                <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-600">
                  Dine-In Feast
                </span>
              </div>
              <h3 className="font-bold text-lg sm:text-xl">Reserve a Royal Table</h3>
            </div>
          </div>
          <button
            onClick={() => {
              setIsReservationModalOpen(false);
              setConfirmedBookingId(null);
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {confirmedBookingId ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Table Reserved Successfully!
              </h4>
              <p className="text-xs text-slate-500">
                Reservation Code:{' '}
                <strong className="font-mono text-amber-900 text-sm">{confirmedBookingId}</strong>
              </p>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-1.5 text-slate-700 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <strong>{guestCount} Guests</strong>
                </div>
                <div className="flex justify-between">
                  <span>Slot:</span>
                  <strong>{date} at {timeSlot}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Area:</span>
                  <strong>{seatingArea}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <strong>{RESTAURANT_LOCATION.name} (Park Street)</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsReservationModalOpen(false);
                  setConfirmedBookingId(null);
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-amber-700 text-white font-bold text-xs shadow-md"
              >
                Close &amp; Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-hidden focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Guests:</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-hidden bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date:</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-hidden bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Time Slot / Bhoj:
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-hidden bg-white"
                >
                  <option>12:30 PM (Afternoon Lunch Bhoj)</option>
                  <option>01:30 PM (Afternoon Lunch Bhoj)</option>
                  <option>07:30 PM (Evening Dinner Bhoj)</option>
                  <option>08:30 PM (Prime Dinner Bhoj)</option>
                  <option>09:30 PM (Late Night Feast)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seating Ambience:
                </label>
                <select
                  value={seatingArea}
                  onChange={(e) => setSeatingArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-hidden bg-white"
                >
                  <option>Heritage Courtyard (ঐতিহ্যবাহী উঠোন)</option>
                  <option>Vintage Verandah (বারান্দা - Park Street View)</option>
                  <option>Zamindari AC Dining Hall (জমিনদারি মহল)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Dining Request (Optional):
                </label>
                <input
                  type="text"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Birthday celebration, High chair for child..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Confirm Reservation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
