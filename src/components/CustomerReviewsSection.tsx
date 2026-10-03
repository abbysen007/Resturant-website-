import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Arindam Ganguly',
    location: 'Salt Lake City, Kolkata',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: '“The Shorshe Ilish delivered to Salt Lake was piping hot within 35 minutes! The mustard pungency was authentic, exactly like my grandmother’s heirloom recipe.”'
  },
  {
    id: 2,
    name: 'Madhurima Sen',
    location: 'New Town Action Area I',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: '“The Kosha Mangsho and Basanti Pulao in earthen handis made our family Bhoj extraordinary. The 25 km delivery radius ensures food never arrives cold or soggy.”'
  },
  {
    id: 3,
    name: 'Sayantani Das',
    location: 'Ballygunge Circular Road',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    comment: '“Outstanding Bhetki Paturi and earthen pot Mishti Doi! The staff at Park Street was remarkably courteous during our dine-in dinner. Truly authentic Bengali hospitality.”'
  }
];

export const CustomerReviewsSection: React.FC = () => {
  const [index, setIndex] = useState(0);

  return (
    <section id="reviews-section" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header with Arrows matching reference */}
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <span className="font-bengali text-orange-600 font-extrabold text-sm block mb-1">
            ভোজনরসিকদের মতামত • Diner Testimonials
          </span>
          <h2 className="font-ultra text-2xl sm:text-4xl text-stone-900 tracking-tight">
            What Our Customer Says?
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
            className="w-10 h-10 rounded-full border border-orange-200 hover:border-orange-400 bg-white hover:bg-orange-50 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIndex((prev) => Math.min(REVIEWS.length - 1, prev + 1))}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex items-center justify-center text-white transition-colors cursor-pointer shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Reviews Cards matching reference layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-amber-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
              {rev.comment}
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-amber-100/80">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#E5A93B]"
              />
              <div>
                <h5 className="font-extrabold text-sm text-slate-900">{rev.name}</h5>
                <span className="text-[11px] text-slate-400">{rev.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
