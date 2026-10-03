import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { LiveTrackingMap } from './MapComponents';
import { RESTAURANT_LOCATION } from '../data/menuData';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  Sparkles,
  Phone,
  MapPin,
  Utensils,
  ShieldCheck,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { formatINR, formatTime } from '../utils/format';
import { OrderStatus } from '../types';

export const LiveOrderTracker: React.FC = () => {
  const {
    orders,
    currentTrackingOrderId,
    setCurrentTrackingOrderId,
    currentTrackingOrder,
    updateOrderStatus,
    setActiveCustomerTab
  } = useRestaurant();

  if (!currentTrackingOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Clock className="w-16 h-16 text-slate-300 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-800">No Orders in Tracking</h3>
        <p className="text-xs text-slate-500 mt-1">
          Explore our menu and place an order to see real-time 25km delivery tracking!
        </p>
        <button
          onClick={() => setActiveCustomerTab('menu')}
          className="mt-4 px-5 py-2.5 rounded-xl bg-amber-700 text-white font-bold text-xs"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const order = currentTrackingOrder;

  const STEPS: { id: OrderStatus; label: string; bengaliLabel: string; desc: string; icon: any }[] = [
    {
      id: 'placed',
      label: 'Order Confirmed',
      bengaliLabel: 'অর্ডার নিশ্চিত হয়েছে',
      desc: 'Central Kitchen received your banquet request',
      icon: CheckCircle2
    },
    {
      id: 'preparing',
      label: 'Kitchen Preparing',
      bengaliLabel: 'রান্না চলছে',
      desc: 'Chef crafting slow-simmered gravies in clay handis',
      icon: ChefHat
    },
    {
      id: 'out_for_delivery',
      label: 'Out for Delivery',
      bengaliLabel: 'ডেলিভারির পথে',
      desc: 'Assigned rider dispatched within the 25 km zone',
      icon: Bike
    },
    {
      id: 'delivered',
      label: 'Delivered',
      bengaliLabel: 'উপভোগ করুন!',
      desc: 'Enjoy your piping hot authentic Bengali feast',
      icon: Sparkles
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'preparing':
        return 1;
      case 'out_for_delivery':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  // Fast forward simulation helper
  const handleSimulateNextStage = () => {
    if (order.status === 'placed') updateOrderStatus(order.id, 'preparing');
    else if (order.status === 'preparing') updateOrderStatus(order.id, 'out_for_delivery');
    else if (order.status === 'out_for_delivery') updateOrderStatus(order.id, 'delivered');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Back button and Order Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActiveCustomerTab('menu')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-amber-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu (মেনু)</span>
        </button>

        {/* Order Switcher if multiple */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-semibold whitespace-nowrap">Your Orders:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setCurrentTrackingOrderId(o.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono font-bold whitespace-nowrap transition-all ${
                  o.id === order.id
                    ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                }`}
              >
                {o.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-lg overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-indigo-950 text-white p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bengali text-amber-300 font-bold text-sm">
                লাইভ ট্র্যাকিং
              </span>
              <span className="bg-emerald-500/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-bold uppercase tracking-wider">
                Live Status: {order.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Order {order.id}
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
              Placed at {formatTime(order.createdAt)} • Mode:{' '}
              <strong className="capitalize text-white">{order.deliveryMode}</strong>
            </p>
          </div>

          {/* Estimated countdown badge */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/30 text-amber-300">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] text-amber-200 uppercase font-bold tracking-wider block">
                {order.status === 'delivered' ? 'Delivered' : 'Estimated Arrival'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {order.status === 'delivered'
                  ? 'Completed 🎉'
                  : `${order.estimatedDeliveryTimeMinutes} mins`}
              </span>
            </div>
          </div>
        </div>

        {/* 4-Step Stepper Progress Bar */}
        <div className="p-5 sm:p-8 bg-amber-50/40 border-b border-amber-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded-2xl transition-all ${
                    isCurrent
                      ? 'bg-white shadow-md border border-amber-300 ring-2 ring-amber-500/20'
                      : isCompleted
                      ? 'bg-emerald-50/60 border border-emerald-200'
                      : 'opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bengali text-amber-800 text-xs font-bold">
                    {step.bengaliLabel}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Simulation fast-forward banner for demo testing */}
          <div className="mt-4 pt-4 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>
                Want to test the next state right now? Click to advance kitchen progression:
              </span>
            </span>
            {order.status !== 'delivered' && (
              <button
                onClick={handleSimulateNextStage}
                className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Advance to Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Map & Rider Details Grid */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Google Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Live Route (Central Kitchen ➔ Destination)</span>
              </span>
              <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded">
                Distance: {order.deliveryLocation.distanceKm} km (Within 25km radius)
              </span>
            </div>

            <LiveTrackingMap
              restaurantLat={RESTAURANT_LOCATION.lat}
              restaurantLng={RESTAURANT_LOCATION.lng}
              customerLat={order.deliveryLocation.lat}
              customerLng={order.deliveryLocation.lng}
              riderLat={order.assignedRider?.currentLat}
              riderLng={order.assignedRider?.currentLng}
              orderStatus={order.status}
            />

            <p className="text-[11px] text-slate-500 italic">
              * Route plotted from Roshoi Ghor Central Kitchen (Park Street) to your delivery drop.
            </p>
          </div>

          {/* Right: Rider & Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            {/* Rider Card */}
            {order.assignedRider && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base border-2 border-blue-400">
                      BM
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">
                        Assigned Delivery Partner
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">
                        {order.assignedRider.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {order.assignedRider.vehicleNumber}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.assignedRider.phone}`}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    title="Call Delivery Partner"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Insulated thermal pack &amp; sanitized delivery bag</span>
                </div>
              </div>
            )}

            {/* Order Items Breakdown */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Feast Items ({order.items.length})
              </h5>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="truncate pr-2">
                      <span className="font-semibold text-slate-800">
                        {item.quantity}x {item.dish.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-bengali">
                        {item.dish.bengaliName}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatINR(item.dish.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery (25km zone)</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-1">
                  <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
                  <span className="text-amber-900">{formatINR(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
