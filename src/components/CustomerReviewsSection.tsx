import React, { useState } from 'react';
import { Quote, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    id: 1,
    name: 'Arindam Ganguly',
    location: 'Salt Lake City, Sector V',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: '“The Shorshe Ilish delivered to Salt Lake was piping hot within 35 minutes! The mustard pungency was authentic, exactly like my grandmother’s heirloom recipe.”'
  },
  {
    id: 2,
    name: 'Madhurima Sen',
    location: 'New Town Action Area I',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: '“The Kosha Mangsho and Basanti Pulao in earthen handis made our family Bhoj extraordinary. The 25 km delivery radius ensures food never arrives cold or soggy.”'
  },
  {
    id: 3,
    name: 'Sayantani Das',
    location: 'Ballygunge Circular Road',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    comment: '“Outstanding Bhetki Paturi and earthen pot Mishti Doi! The staff at Park Street was remarkably courteous during our dine-in dinner. Truly authentic Bengali hospitality.”'
  },
  {
    id: 4,
    name: 'Dr. Pronob Roy',
    location: 'Alipore, South Kolkata',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    comment: '“The Jamai Shoshthi Mahabhoj Thali on Kansa bell-metal plate was regal. The Murighonto and Daab Chingri are the finest in all of Calcutta!”'
  },
  {
    id: 5,
    name: 'Debasmita Mukherjee',
    location: 'Jadavpur, Kolkata',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    comment: '“Ordering for 12 guests was effortless. Every earthen handi arrived sealed with dough, preserving the slow-cooked coal chulha aroma. 10/10!”'
  }
];

export const CustomerReviewsSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate for seamless infinite loop
  const duplicatedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section id="reviews-section" className="py-14 sm:py-24 overflow-hidden relative">
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10 sm:mb-14">
        <span className="font-bengali text-orange-600 font-extrabold text-sm inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 border border-orange-200/50 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>ভোজনরসিকদের মতামত • Diner Testimonials</span>
        </span>
        <h2 className="font-ultra text-3xl sm:text-5xl text-stone-900 tracking-tight">
          What Our Connoisseurs Say
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-xl mx-auto mt-2">
          Honest words from patrons across Kolkata savoring authentic flavors delivered fresh within our 25 km radius.
        </p>
      </div>

      {/* Floating Sideways Marquee Track */}
      <div
        className="relative w-full overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft edge blur masks for floating feel */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 w-max"
          animate={{
            x: isPaused ? undefined : ['0%', '-50%']
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {duplicatedReviews.map((rev, index) => (
            <motion.div
              key={`${rev.id}-${index}`}
              animate={{
                y: [0, index % 2 === 0 ? -6 : 6, 0]
              }}
              transition={{
                duration: 4.5 + (index % 3) * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.3
              }}
              className="w-80 sm:w-96 p-6 sm:p-7 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(255,140,0,0.06)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between select-none cursor-grab active:cursor-grabbing shrink-0"
            >
              {/* Star Rating & Quote Mark */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-orange-400/40" />
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                {rev.comment}
              </p>

              {/* Customer Profile Row */}
              <div className="flex items-center gap-3 pt-3.5 border-t border-orange-100/60">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-300 shadow-xs"
                />
                <div>
                  <h5 className="font-extrabold text-sm text-stone-900">{rev.name}</h5>
                  <span className="text-[11px] text-stone-400">{rev.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-6">
        <span className="text-[11px] text-stone-400 italic">
          Hover to pause floating scroll • Swipe/drag on mobile
        </span>
      </div>
    </section>
  );
};
