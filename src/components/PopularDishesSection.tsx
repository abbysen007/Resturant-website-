import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { DishCard } from './DishCard';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <section id="popular-dishes" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 relative">
      {/* Header Row with Arrow Buttons matching reference */}
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <span className="font-bengali text-orange-600 font-extrabold text-sm flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>জনপ্রিয় পদসমূহ • Chef's Highlights</span>
          </span>
          <h2 className="font-ultra text-2xl sm:text-4xl text-stone-900 tracking-tight">
            Popular Bestsellers
          </h2>
        </div>

        {/* Circular Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-orange-200/80 hover:border-orange-400 bg-white/80 hover:bg-orange-50 flex items-center justify-center text-stone-700 transition-colors cursor-pointer shadow-xs"
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

      {/* 4-Column Grid with Floating Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularDishes.map((dish, idx) => (
          <motion.div
            key={dish.id}
            animate={{
              y: [0, -8, 0]
            }}
            transition={{
              duration: 3.8 + (idx % 3) * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.4
            }}
            whileHover={{
              y: -12,
              transition: { duration: 0.25 }
            }}
            className="h-full"
          >
            <DishCard dish={dish} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

