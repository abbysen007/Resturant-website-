import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  X,
  Plus,
  Minus,
  Clock,
  Users,
  Flame,
  ShieldAlert,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { formatINR } from '../utils/format';

export const DishDetailsModal: React.FC = () => {
  const {
    selectedDishDetails,
    setSelectedDishDetails,
    addToCart
  } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [cookingInstructions, setCookingInstructions] = useState('');

  if (!selectedDishDetails) return null;

  const dish = selectedDishDetails;

  const handleAdd = () => {
    addToCart(dish, quantity, cookingInstructions.trim() || undefined);
    setSelectedDishDetails(null);
    setCookingInstructions('');
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Hero Image */}
        <div className="relative aspect-16/9 w-full bg-slate-900 shrink-0">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          <button
            onClick={() => setSelectedDishDetails(null)}
            className="absolute top-3 right-3 text-white/90 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bengali text-amber-300 font-bold text-sm">
                {dish.bengaliName}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  dish.dietary === 'veg'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {dish.dietary === 'veg' ? 'Pure Veg' : 'Non-Veg'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {dish.name}
            </h2>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-700 text-sm">
          {/* Bengali Lore */}
          {dish.bengaliLore && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs sm:text-sm italic">
              <span className="font-bold not-italic text-amber-900 block mb-0.5">
                Heritage Story &amp; Culinary Lore:
              </span>
              “{dish.bengaliLore}”
            </div>
          )}

          {/* Full description */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1">About the Dish</h4>
            <p className="leading-relaxed text-slate-600 text-xs sm:text-sm">
              {dish.description}
            </p>
          </div>

          {/* Ingredients list */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Key Ingredients</h4>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cooking instructions input */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Custom Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra green chili, send kasundi dip..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden"
            />
          </div>

          {/* Allergens warning */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 text-orange-600" />
              <span>
                <strong>Allergen advisory:</strong> Contains {dish.allergens.join(', ')}.
              </span>
            </div>
          )}
        </div>

        {/* Footer: Quantity and Add to Cart */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-slate-600 hover:text-amber-800 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-slate-600 hover:text-amber-800 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={!dish.inStock}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer ${
              dish.inStock
                ? 'bg-amber-700 hover:bg-amber-800 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {dish.inStock
                ? `Add ${quantity} to Feast • ${formatINR(dish.price * quantity)}`
                : 'Currently Sold Out'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
