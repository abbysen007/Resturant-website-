import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuCategory, DietaryType } from '../types';
import { DishCard } from './DishCard';
import { Search, Sparkles } from 'lucide-react';

const CATEGORIES: { id: MenuCategory; label: string; bengaliLabel: string }[] = [
  { id: 'all', label: 'Special Foods', bengaliLabel: 'সকল পদ' },
  { id: 'starters', label: 'Starters', bengaliLabel: 'শুরুয়াত' },
  { id: 'curries', label: 'Curries', bengaliLabel: 'তরকারি' },
  { id: 'rice-breads', label: 'Rice & Breads', bengaliLabel: 'পোলাও ও লুচি' },
  { id: 'thalis', label: 'Royal Thalis', bengaliLabel: 'মহাভোজ' },
  { id: 'desserts', label: 'Desserts', bengaliLabel: 'মিষ্টি' },
  { id: 'beverages', label: 'Drinks', bengaliLabel: 'শরবত' }
];

export const MenuSection: React.FC = () => {
  const { menuItems, searchQuery, setSearchQuery } = useRestaurant();

  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | DietaryType>('all');

  // Filter items
  const filteredDishes = menuItems.filter((dish) => {
    if (activeCategory !== 'all' && dish.category !== activeCategory) {
      return false;
    }
    if (dietaryFilter !== 'all' && dish.dietary !== dietaryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = dish.name.toLowerCase().includes(q);
      const inBengali = dish.bengaliName.includes(q);
      const inDesc = dish.description.toLowerCase().includes(q);
      if (!inName && !inBengali && !inDesc) return false;
    }
    return true;
  });

  return (
    <section id="menu-section" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Centered Section Title matching reference */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="font-bengali text-orange-600 font-extrabold text-sm block mb-1">
          আমাদের নিয়মিত খাদ্য তালিকা • Handcrafted Heritage
        </span>
        <h2 className="font-ultra text-3xl sm:text-5xl text-stone-900 tracking-tight">
          Our Regular Menu Pack
        </h2>
      </div>

      {/* Pill Category Buttons matching reference */}
      <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white hover:bg-orange-50/60 text-stone-600 border border-stone-200 hover:border-orange-300'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Optional Search & Veg/Non-Veg Quick Toggle */}
      <div className="max-w-md mx-auto mb-8 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bengali dishes (e.g. Ilish, Kosha, Posto)..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-stone-300 text-xs sm:text-sm outline-hidden focus:border-amber-500 bg-white"
          />
        </div>

        <div className="flex bg-stone-100 p-1 rounded-full text-xs font-bold text-slate-700">
          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
              dietaryFilter === 'all' ? 'bg-white shadow-xs' : ''
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDietaryFilter('veg')}
            className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
              dietaryFilter === 'veg' ? 'bg-emerald-600 text-white' : ''
            }`}
          >
            Veg
          </button>
          <button
            onClick={() => setDietaryFilter('non-veg')}
            className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
              dietaryFilter === 'non-veg' ? 'bg-rose-600 text-white' : ''
            }`}
          >
            Non-Veg
          </button>
        </div>
      </div>

      {/* 4-Column Grid matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </section>
  );
};
