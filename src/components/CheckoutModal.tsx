import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { DeliveryMode, PaymentMethod } from '../types';
import {
  X,
  MapPin,
  CheckCircle2,
  CreditCard,
  QrCode,
  Landmark,
  Banknote,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  ShoppingBag,
  UtensilsCrossed
} from 'lucide-react';
import { formatINR } from '../utils/format';
import { estimateDeliveryMinutes } from '../utils/distance';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    customerLocation,
    setIsLocationModalOpen,
    cart,
    subtotal,
    taxAndPackaging,
    deliveryFee,
    discountAmount,
    grandTotal,
    createOrder,
    cartSpecialInstructions
  } = useRestaurant();

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(
    customerLocation.isWithin25Km ? 'delivery' : 'takeaway'
  );
  const [customerName, setCustomerName] = useState('Ananya Sen');
  const [customerPhone, setCustomerPhone] = useState('+91 98301 44556');
  const [detailedAddress, setDetailedAddress] = useState(customerLocation.address);
  const [tableNumber, setTableNumber] = useState('Table 4 (Courtyard)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  // Simulation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('7492');
  const [createdOrderSummary, setCreatedOrderSummary] = useState<any | null>(null);

  if (!isCheckoutModalOpen) return null;

  const currentDeliveryFee = deliveryMode === 'delivery' ? deliveryFee : 0;
  const currentTotal = Math.max(0, subtotal + taxAndPackaging + currentDeliveryFee - discountAmount);
  const estMins = deliveryMode === 'delivery' ? estimateDeliveryMinutes(customerLocation.distanceKm) : 20;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (deliveryMode === 'delivery' && !customerLocation.isWithin25Km) {
      alert('Your address exceeds our 25 km delivery radius. Please switch to Takeaway or select an address within 25 km.');
      return;
    }

    if (paymentMethod === 'card') {
      // Simulate 3D Secure OTP step
      setShowOtpModal(true);
      return;
    }

    executeOrderCreation();
  };

  const executeOrderCreation = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpModal(false);

      const order = createOrder({
        customerName,
        customerPhone,
        deliveryMode,
        detailedAddress,
        paymentMethod,
        tableNumber: deliveryMode === 'dine_in' ? tableNumber : undefined
      });

      setCreatedOrderSummary(order);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // safe fallback
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-700/80 border border-amber-500/40">
              <ShoppingBag className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bengali text-amber-300 text-xs font-bold">
                  নিশ্চিতকরণ ও পেমেন্ট
                </span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Secure Checkout
                </span>
              </div>
              <h3 className="font-bold text-lg sm:text-xl">Review &amp; Place Order</h3>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCheckoutModalOpen(false);
              setCreatedOrderSummary(null);
            }}
            className="text-amber-200 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {createdOrderSummary ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="font-bengali text-amber-800 text-sm font-bold block mb-1">
                  অর্ডার সফল হয়েছে • Roshoi Ghor Kitchen
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Feast Confirmed!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Order ID: <span className="font-mono font-bold text-slate-900">{createdOrderSummary.id}</span>
                </p>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-left text-xs sm:text-sm max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Mode:</span>
                  <span className="font-bold text-slate-900 capitalize">
                    {createdOrderSummary.deliveryMode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Delivery To:</span>
                  <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
                    {createdOrderSummary.detailedAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estimated Arrival:</span>
                  <span className="font-bold text-emerald-700">
                    ~{createdOrderSummary.estimatedDeliveryTimeMinutes} mins
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-amber-200 font-black">
                  <span>Total Amount Paid:</span>
                  <span className="text-amber-900">{formatINR(createdOrderSummary.total)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setCreatedOrderSummary(null);
                  }}
                  className="w-full py-3 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Track Live Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Delivery Mode Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Order Mode:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('delivery')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      deliveryMode === 'delivery'
                        ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-5 h-5 text-amber-700" />
                    <span className="text-xs font-bold">Home Delivery</span>
                    <span className="text-[10px] text-slate-400">25 km zone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode('takeaway')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      deliveryMode === 'takeaway'
                        ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 text-amber-700" />
                    <span className="text-xs font-bold">Takeaway</span>
                    <span className="text-[10px] text-slate-400">Self Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode('dine_in')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      deliveryMode === 'dine_in'
                        ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UtensilsCrossed className="w-5 h-5 text-amber-700" />
                    <span className="text-xs font-bold">Dine-In Table</span>
                    <span className="text-[10px] text-slate-400">Pre-order</span>
                  </button>
                </div>
              </div>

              {/* Mode-specific Fields */}
              {deliveryMode === 'delivery' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      Delivery Address:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLocationModalOpen(true)}
                      className="text-amber-800 font-bold underline hover:text-amber-950"
                    >
                      Change Pin on Map
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    placeholder="Flat / Floor / Street name, Landmark..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-amber-600 outline-hidden"
                  />

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
                    <span>
                      Kitchen distance: <strong>{customerLocation.distanceKm} km</strong>
                    </span>
                    <span
                      className={`font-bold ${
                        customerLocation.isWithin25Km ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {customerLocation.isWithin25Km
                        ? '✓ Within 25 km Delivery Radius'
                        : '⚠ Outside 25 km Delivery Radius'}
                    </span>
                  </div>
                </div>
              )}

              {deliveryMode === 'takeaway' && (
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <span className="font-bold block">Pickup Location:</span>
                  <p>Roshoi Ghor Central Kitchen, 17/1B Park Street, Kolkata 700016</p>
                  <p className="text-[11px] text-slate-600">Your order will be ready packed in 20 minutes.</p>
                </div>
              )}

              {deliveryMode === 'dine_in' && (
                <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200 space-y-2 text-xs">
                  <label className="font-bold text-indigo-950 block">Select Table / Seating:</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 4 (Courtyard), Table 8 (Verandah)"
                    className="w-full px-3 py-2 rounded-xl border border-indigo-300 bg-white text-xs outline-hidden"
                  />
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-amber-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-amber-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'upi'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-amber-700" />
                    <span className="text-xs">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-700" />
                    <span className="text-xs">Card (Credit/Debit)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'netbanking'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Landmark className="w-5 h-5 text-amber-700" />
                    <span className="text-xs">Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'cod'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-700" />
                    <span className="text-xs">Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Details Section */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center gap-4 text-xs">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border border-amber-300 shadow-xs flex flex-col items-center justify-center shrink-0">
                    <QrCode className="w-16 h-16 text-slate-800" />
                    <span className="text-[9px] font-bold text-amber-800">Scan &amp; Pay</span>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="font-bold text-slate-900 block">Instant UPI Payment</span>
                    <p className="text-slate-600">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM. Simulation auto-confirms payment on clicking Complete Order below.
                    </p>
                    <span className="inline-block bg-white px-2 py-0.5 rounded border border-amber-200 font-mono text-slate-800 font-bold text-[11px]">
                      roshoi.ghor@okaxis
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Card Credentials Simulation</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type="text"
                    defaultValue="4111 •••• •••• 8842"
                    placeholder="Card Number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="08/29"
                      placeholder="MM/YY"
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden font-mono"
                    />
                    <input
                      type="password"
                      defaultValue="724"
                      placeholder="CVV"
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block mb-1.5">Select Your Bank:</span>
                  <select className="w-full p-2.5 rounded-xl border border-slate-300 bg-white outline-hidden font-medium">
                    <option>HDFC Bank (Popular in Kolkata)</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Bank of Baroda</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950">
                  <p className="font-semibold">
                    ✓ Pay cash or card/UPI to the delivery rider at your doorstep.
                  </p>
                </div>
              )}

              {/* Order Final Summary */}
              <div className="p-3.5 rounded-2xl bg-amber-100/60 border border-amber-300/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 block">Grand Total to Pay:</span>
                  <span className="text-xl font-black text-amber-950">{formatINR(currentTotal)}</span>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <span>{cart.length} items</span>
                  <span className="block font-semibold text-emerald-800">
                    Est: {estMins} mins
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-base shadow-xl shadow-amber-800/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 animate-spin" />
                    Confirming with Roshoi Ghor Kitchen...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-200" />
                    <span>Confirm Feast Order • {formatINR(currentTotal)}</span>
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3D Secure OTP Simulation Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-300 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">
              Bank 3D Secure OTP Verification
            </h4>
            <p className="text-xs text-slate-500">
              Enter the 4-digit code sent to your mobile ending in ••56 to authorize {formatINR(currentTotal)}.
            </p>
            <input
              type="text"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              className="text-center tracking-widest text-2xl font-mono font-bold w-36 mx-auto py-2 border-2 border-amber-600 rounded-xl outline-hidden"
              maxLength={4}
            />
            <button
              onClick={executeOrderCreation}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
            >
              Verify &amp; Authorize
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
