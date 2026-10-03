import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { DishCard } from './DishCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const PopularDishesSection: React.FC = () => {
  const { menuItems } = useRestaurant();

  // Pick top 4 bestsellers/specials
  const popularDishes = menuItems.filter((d) => d.isBestseller || d.isChefSpecial).slice(0, 4);

  const [slideOffset, setSlideOffset] = useState(0);

  const handlePrev = () => {
    setSlideOffset((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSlideOffset((prev) => Math.min(2, prev + 1));
  };

  return (
    <section id="popular-dishes" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Row with Arrow Buttons matching reference */}
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <span className="font-bengali text-orange-600 font-extrabold text-sm block mb-1">
            জনপ্রিয় পদসমূহ • Chef's Highlights
          </span>
          <h2 className="font-ultra text-2xl sm:text-4xl text-stone-900 tracking-tight">
            Popular Dishes
          </h2>
        </div>

        {/* Circular Arrows matching reference */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-orange-200 hover:border-orange-400 bg-white hover:bg-orange-50 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex items-center justify-center text-white transition-colors cursor-pointer shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Column Grid matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </section>
  );
};
