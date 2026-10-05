import React from 'react';
import { MenuItem } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { Plus, Minus, Info, Sparkles, Clock, Flame } from 'lucide-react';
import { formatINR } from '../utils/format';

interface DishCardProps {
  dish: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const {
    cart,
    addToCart,
    updateCartItemQuantity,
    setSelectedDishDetails
  } = useRestaurant();

  const cartItem = cart.find((item) => item.dish.id === dish.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0 flex flex-col justify-between group hover:-translate-y-1 bg-[#FAF6EE]">
      {/* --- UPPER HALF: WARM CREAM PARCHMENT WITH CIRCULAR KANSA BRASS PLATE --- */}
      <div className="relative pt-6 pb-4 px-4 bg-[#F8F3E8] flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle Traditional Bengali Seal in Top Corner matching reference */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 opacity-80">
          <div className="w-7 h-7 rounded-xl border border-amber-800/40 text-amber-900 flex items-center justify-center text-xs font-black bg-amber-50">
            <span className="font-bengali text-sm">র</span>
          </div>
          <span className="font-bengali text-[10px] text-amber-900 font-extrabold tracking-wider hidden sm:inline">
            রসুই ঘর
          </span>
        </div>

        {/* Dietary & Info Icon on Top-Right */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
          <button
            onClick={() => setSelectedDishDetails(dish)}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-amber-800 transition-colors shadow-2xs"
            title="Dish Heritage & Recipe Details"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div
            className={`w-4 h-4 rounded-sm border-2 bg-white flex items-center justify-center shadow-2xs ${
              dish.dietary === 'veg' ? 'border-emerald-600' : 'border-rose-600'
            }`}
            title={dish.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                dish.dietary === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>
        </div>

        {/* Circular Kansa (Brass Bell-Metal) Plate with Mandala Pattern behind */}
        <div className="relative my-2 w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
          {/* Concentric Traditional Mandala Ring Line Art */}
          <div className="absolute inset-0 rounded-full border border-dashed border-amber-700/25 pointer-events-none" />
          <div className="absolute inset-2.5 rounded-full border border-amber-800/20 pointer-events-none" />

          {/* Heavy Hand-Beaten Bell-Metal (Kansa / পিতল) Rim */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full p-2 bg-gradient-to-br from-[#D4AF37] via-[#C59B27] to-[#8C6D1F] shadow-xl border border-amber-200/50">
            {/* Inner Banana Leaf Tinted Border */}
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#2E5A1C] bg-[#1E3F10] relative group-hover:scale-102 transition-transform duration-500">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {!dish.inStock && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 px-2.5 py-0.5 rounded-full">
                    Sold Out
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-bold text-amber-900/70 tracking-widest uppercase mt-0.5">
          {dish.category} • {dish.serves || 'Serves 2'}
        </div>
      </div>

      {/* --- LOWER HALF: DEEP TERRACOTTA / CRIMSON WITH BOLD TYPOGRAPHY (MATCHING REFERENCE) --- */}
      <div className="bg-[#842222] text-white p-5 sm:p-6 space-y-3 relative flex-1 flex flex-col justify-between">
        {/* Subtle mandala watermark in corner */}
        <div className="absolute right-0 bottom-0 w-32 h-32 opacity-10 pointer-events-none rounded-full border-4 border-amber-300" />

        <div className="space-y-2 text-center">
          {/* Large bold Bengali typography matching reference image 2 */}
          <h3 className="font-bengali text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-xs">
            {dish.bengaliName}
          </h3>

          <div className="font-ultra text-xs sm:text-sm text-amber-300 font-normal uppercase tracking-wide">
            {dish.name}
          </div>

          {/* Uppercase poetic subtitle matching reference image layout */}
          <p className="font-lato text-[11px] sm:text-xs text-amber-100/90 leading-relaxed uppercase tracking-wider line-clamp-2 px-1 font-medium">
            {dish.bengaliLore || dish.description}
          </p>
        </div>

        {/* Pricing & Outlined Action Button / Quantity Controls */}
        <div className="pt-3 border-t border-amber-300/20 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-200/80 font-bold uppercase tracking-wider text-[10px]">
              Heritage Price:
            </span>
            <span className="font-mono text-lg font-black text-amber-300">
              {formatINR(dish.price)}
            </span>
          </div>

          {dish.inStock ? (
            quantity === 0 ? (
              <button
                onClick={() => addToCart(dish, 1)}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-amber-300/80 hover:border-amber-300 hover:bg-amber-300/10 text-white font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-sm group-hover:bg-amber-400 group-hover:text-stone-950 group-hover:border-amber-400"
              >
                <span>Add To Feast • যোগ করুন</span>
              </button>
            ) : (
              <div className="flex items-center justify-between bg-black/30 border border-amber-300/40 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => updateCartItemQuantity(dish.id, quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="text-center font-mono font-black text-sm text-amber-300">
                  {quantity} in cart
                </div>
                <button
                  onClick={() => updateCartItemQuantity(dish.id, quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center font-black transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          ) : (
            <div className="w-full py-2 text-center text-xs text-stone-400 font-bold bg-black/20 rounded-xl">
              Currently Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
