import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  UtensilsCrossed
} from 'lucide-react';
import { formatINR } from '../utils/format';
import { RESTAURANT_LOCATION } from '../data/menuData';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    taxAndPackaging,
    deliveryFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSpecialInstructions,
    setCartSpecialInstructions,
    customerLocation,
    setIsLocationModalOpen,
    setIsCheckoutModalOpen,
    setIsRadiusExceededModalOpen
  } = useRestaurant();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    if (!customerLocation.isWithin25Km) {
      setIsRadiusExceededModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const freeDeliveryThreshold = RESTAURANT_LOCATION.freeDeliveryThreshold;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-amber-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-800 to-amber-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-700/80 border border-amber-500/40">
              <ShoppingBag className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base sm:text-lg">Your Feast Bag</h3>
                <span className="font-bengali text-amber-300 text-xs">খাবারের থলে</span>
              </div>
              <p className="text-[11px] text-amber-200/90">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-amber-200 hover:text-white p-1.5 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200/80 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
            <span>
              {amountNeededForFreeDelivery === 0 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Unlocked FREE 25km Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-amber-900">{formatINR(amountNeededForFreeDelivery)}</strong> more for FREE delivery
                </span>
              )}
            </span>
            <span className="text-[11px] text-slate-500">{freeDeliveryProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-800">Your feast bag is empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore our authentic Bengali delicacies like Shorshe Ilish, Kosha Mangsho, or Mochar Chop!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2.5 rounded-xl bg-amber-700 text-white font-bold text-xs"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Delivery Zone Notice */}
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                  customerLocation.isWithin25Km
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin
                    className={`w-4 h-4 shrink-0 ${
                      customerLocation.isWithin25Km ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  />
                  <span className="truncate font-medium">
                    {customerLocation.distanceKm} km ({customerLocation.address})
                  </span>
                </div>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0 text-[11px]"
                >
                  Change
                </button>
              </div>

              {!customerLocation.isWithin25Km && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Outside 25 km Delivery Radius</span>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    Online delivery is restricted past 25 km. You can still order for <strong>Takeaway</strong> or dine at Roshoi Ghor!
                  </p>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.dish.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-amber-200 transition-all flex gap-3 shadow-2xs"
                  >
                    <img
                      src={item.dish.imageUrl}
                      alt={item.dish.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.dish.name}
                          </h5>
                          <span className="font-bengali text-amber-800 text-[11px] block">
                            {item.dish.bengaliName}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.dish.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.specialInstructions && (
                        <p className="text-[10px] text-slate-500 italic truncate">
                          Note: {item.specialInstructions}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                        <span className="font-black text-xs sm:text-sm text-slate-900">
                          {formatINR(item.dish.price * item.quantity)}
                        </span>

                        <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.dish.id, item.quantity - 1)
                            }
                            className="p-1 text-slate-700 hover:bg-slate-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-xs text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.dish.id, item.quantity + 1)
                            }
                            className="p-1 text-slate-700 hover:bg-slate-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Cooking Instructions for Kitchen */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kitchen Notes / Special Requests:
                </label>
                <textarea
                  rows={2}
                  value={cartSpecialInstructions}
                  onChange={(e) => setCartSpecialInstructions(e.target.value)}
                  placeholder="e.g. Less oil, extra green chilies, separate Kasundi mustard container..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20 outline-hidden"
                />
              </div>

              {/* Coupon Code Section */}
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-amber-700 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon (e.g. BENGAL15, SHORSHE50)"
                      className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-amber-300 text-xs uppercase font-semibold focus:border-amber-700 outline-hidden bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1.5 font-semibold ${
                      couponMsg.success ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {couponMsg.message}
                  </p>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/80 text-xs">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-600" />
                      {appliedCoupon.code} Applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 font-bold hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Bill Details Breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <h5 className="font-bold text-slate-800 mb-2">Itemized Bill</h5>
                <div className="flex justify-between text-slate-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (5%) &amp; Earthen Handi Packaging</span>
                  <span className="font-semibold text-slate-900">
                    {formatINR(taxAndPackaging)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <div className="flex items-center gap-1">
                    <span>25km Radius Delivery Fee</span>
                    <span className="text-[10px] text-slate-400">({customerLocation.distanceKm} km)</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      deliveryFee === 0 ? 'text-emerald-700 font-bold' : 'text-slate-900'
                    }`}
                  >
                    {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                    <span>Royal Discount</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-300">
                  <span>Grand Total</span>
                  <span className="text-amber-900 text-base">{formatINR(grandTotal)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 space-y-2">
            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-between py-3.5 px-5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-800/30 transition-all cursor-pointer active:scale-98"
            >
              <div className="text-left">
                <span className="block text-xs text-amber-200 font-normal">Total to Pay</span>
                <span className="text-lg font-black">{formatINR(grandTotal)}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-100">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-slate-400 hover:text-rose-600 transition-colors py-1 font-medium"
            >
              Empty Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
