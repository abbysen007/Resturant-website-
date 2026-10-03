import React from 'react';
import { Sparkles, Utensils, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { RESTAURANT_LOCATION } from '../data/menuData';

export const StorySection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-amber-50/60 border-t border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-amber-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                alt="Heritage Bengali Cooking"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 bg-white">
                <span className="font-bengali text-orange-600 text-sm font-black block">
                  রসুই ঘরের ঐতিহ্য
                </span>
                <p className="text-xs text-stone-600 mt-1">
                  Hand-crafted earthen handis, brass bell-metal plates, and cold-pressed mustard oil.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-bengali font-bold">বাঙালির খাঁটি রান্নাঘর • Our Culinary Soul</span>
            </div>

            <h3 className="font-ultra text-2xl sm:text-4xl text-stone-900 tracking-tight">
              Why We Enforce a Strict 25 km Delivery Radius
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Authentic Bengali delicacies rely on delicate, temperature-sensitive sensory magic. From the crisp crackle of freshly fried <em>Posto Bora</em> to the piping steam encased in banana-leaf <em>Bhetki Paturi</em> and the sharp, nasal punch of virgin <em>Kasundi</em> mustard oil—these ephemeral aromas begin to diminish if trapped in transit for too long.
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              By bounding our real-time delivery to a <strong>25 kilometer zone</strong> radiating from our flagship Park Street kitchen, we guarantee that every feast reaches your doorstep steaming hot, packaged in natural clay pots and roasted banana leaf wraps.
            </p>

            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="font-bold text-slate-900 block">Kachi Ghani Mustard</span>
                <span className="text-[11px] text-slate-500">Unfiltered cold-pressed oil</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="font-bold text-slate-900 block">Gobindobhog Rice</span>
                <span className="text-[11px] text-slate-500">Sourced from Burdwan paddies</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 col-span-2 sm:col-span-1">
                <span className="font-bold text-slate-900 block">Clay Handis</span>
                <span className="text-[11px] text-slate-500">Traditional moisture absorption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
