import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem } from '../types';
import {
  ShoppingBag,
  Sparkles,
  Check,
  Plus,
  Minus,
  ArrowRight,
  Clock,
  ShieldCheck,
  Flame,
  Utensils
} from 'lucide-react';
import { formatINR } from '../utils/format';

interface BhojComboItem {
  id: string;
  bengaliTitle: string;
  englishTitle: string;
  price: number;
  perPersonText: string;
  totalWeight: string;
  imageUrl: string;
  tagline: string;
  items: { bengali: string; english: string }[];
  dietary: 'veg' | 'non-veg';
  prepTimeMinutes: number;
  description: string;
}

const BHOJ_SPECIALS: BhojComboItem[] = [
  {
    id: 'bhoj-shasthi',
    bengaliTitle: 'ষষ্ঠী স্পেশাল',
    englishTitle: 'Shasthi Mahabhoj Special',
    price: 449,
    perPersonText: '₹৪৪৯/- (জন প্রতি)',
    totalWeight: 'TOTAL WEIGHT OF COMBO - 1100gm',
    tagline: 'পাত পেড়ে বাঙালিয়ানা • The Grand Festive Starter',
    imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    prepTimeMinutes: 25,
    description: 'Traditional slow-cooked festive feast serving fragrant steamed rice, rich fish head murighonto, succulent Katla Kaliya, and fluffy gorom luchi with classic sides.',
    items: [
      { bengali: 'জল ফড়িং', english: 'Jol Phoring (Welcome Cooler)' },
      { bengali: 'লুচি (২ পিস)', english: 'Phulko Luchi (2 pcs)' },
      { bengali: 'বেগুন বাহার', english: 'Begun Bahar (Spiced Aubergine)' },
      { bengali: 'সাদা ভাত', english: 'Sada Bhaat (Steamed Rice)' },
      { bengali: 'মুড়িঘন্ট', english: 'Murighonto (Carp Head & Rice)' },
      { bengali: 'কাতলা কালিয়া', english: 'Katla Kaliya (Rich Golden Gravy)' },
      { bengali: 'চাটনি', english: 'Tomato-Aamsotto Chutney' },
      { bengali: 'রসগোল্লা', english: 'Spongy Rosogolla (1 pc)' }
    ]
  },
  {
    id: 'bhoj-saptami',
    bengaliTitle: 'সপ্তমী ইলিশ মহোৎসব',
    englishTitle: 'Saptami Padma Ilish Utsab',
    price: 649,
    perPersonText: '₹৬৪৯/- (জন প্রতি)',
    totalWeight: 'TOTAL WEIGHT OF COMBO - 1250gm',
    tagline: 'পদ্মার খাঁটি রুপোলী শস্য • Queen of River Delicacies',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    prepTimeMinutes: 30,
    description: 'An ode to Padma river Hilsa: Pristine Shorshe Ilish served alongside hot Ilish fish oil drizzled over aromatic Gobindobhog rice with fish roe fritters.',
    items: [
      { bengali: 'গন্ধরাজ ঘোল', english: 'Gondhoraj Buttermilk Cooler' },
      { bengali: 'গোবিন্দভোগ চালের ভাত', english: 'Gobindobhog Steamed Rice' },
      { bengali: 'তপ্ত ইলিশ তেল ও লঙ্কা', english: 'Hot Ilish Tel with Green Chilli' },
      { bengali: 'ইলিশ মাছের ডিম ভাজা', english: 'Crispy Ilish Egg Fritter' },
      { bengali: 'সর্ষে ইলিশ (১ টুকরো)', english: 'Shorshe Ilish (Mustard Gravy)' },
      { bengali: 'ছোলার ডাল নারকেল দিয়ে', english: 'Chholar Dal with Coconut Chips' },
      { bengali: 'কাঁচা আমের চাটনি', english: 'Raw Mango Sweet Chutney' },
      { bengali: 'বেকড রসগোল্লা', english: 'Baked Rosogolla in Rabri' }
    ]
  },
  {
    id: 'bhoj-ashtami',
    bengaliTitle: 'অষ্টমী রাজকীয় নিরামিষ',
    englishTitle: 'Ashtami Royal Niramish Bhoj',
    price: 399,
    perPersonText: '₹৩৯৯/- (জন প্রতি)',
    totalWeight: 'TOTAL WEIGHT OF COMBO - 1050gm',
    tagline: 'মা দুর্গার ভোগ প্রসাদী সুবাস • Sattvic Temple Spread',
    imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    prepTimeMinutes: 20,
    description: 'Pure sattvic temple banquet cooked in desi ghee and whole spices, without onion or garlic, featuring traditional Shukto, Basanti Pulao, and Dhokar Dalna.',
    items: [
      { bengali: 'আম পোড়া শরবত', english: 'Aam Pora Sharbat' },
      { bengali: 'ঘিয়ে ভাজা লুচি (৩ পিস)', english: 'Ghee-Fried Luchi (3 pcs)' },
      { bengali: 'বাসন্তী মিষ্টি পোলাও', english: 'Fragrant Basanti Pulao' },
      { bengali: 'দুধ শুক্তো বড়ি সহযোগে', english: 'Traditional Doodh Shukto' },
      { bengali: 'ধোঁকার ডালনা', english: 'Lentil Cake Dhokar Dalna' },
      { bengali: 'ঝুড়ি আলু ভাজা', english: 'Crispy Jhuri Aloo Bhaja' },
      { bengali: 'প্লাস্টিক চাটনি (পেঁপে)', english: 'Translucent Papaya Chutney' },
      { bengali: 'মাটির ভাঁড়ের মিষ্টি দই', english: 'Clay Pot Mishti Doi' }
    ]
  },
  {
    id: 'bhoj-nabami',
    bengaliTitle: 'নবমী কষা মাংস মহাভোজ',
    englishTitle: 'Nabami Kosha Mangsho Mahabhoj',
    price: 549,
    perPersonText: '₹৫৪৯/- (জন প্রতি)',
    totalWeight: 'TOTAL WEIGHT OF COMBO - 1200gm',
    tagline: 'গোলবাড়ির স্টাইলে ৩ ঘণ্টা কষানো • Slow-Cooked Legend',
    imageUrl: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    prepTimeMinutes: 30,
    description: 'The celebratory pinnacle of Nabami: Slow-simmered dark mutton kosha with Basanti Pulao, fluffy luchi, and juicy prawn malaikari accompaniment.',
    items: [
      { bengali: 'লেবু পাতার শরবত', english: 'Lemon Leaf Welcome Cooler' },
      { bengali: 'গরম ফুলকো লুচি (২ পিস)', english: 'Gorom Phulko Luchi (2 pcs)' },
      { bengali: 'জাফরানি বাসন্তী পোলাও', english: 'Saffron Basanti Pulao' },
      { bengali: 'কষা মাংস (৩ পিস ও আলু)', english: 'Kosha Mangsho (3 pcs & Potato)' },
      { bengali: 'চিংড়ি মালাইকারি', english: 'Chingri Malaikari (1 pc)' },
      { bengali: 'টমেটো খেজুরের চাটনি', english: 'Tomato-Date Chutney' },
      { bengali: 'ভাজা মশলার পাঁপড়', english: 'Roasted Spiced Papad' },
      { bengali: 'নলেন গুড়ের সন্দেশ', english: 'Nolen Gur Sandesh' }
    ]
  },
  {
    id: 'bhoj-dashami',
    bengaliTitle: 'দশমী বিজয়া স্পেশাল',
    englishTitle: 'Bijoya Dashami Special Bhoj',
    price: 349,
    perPersonText: '₹৩৪৯/- (জন প্রতি)',
    totalWeight: 'TOTAL WEIGHT OF COMBO - 950gm',
    tagline: 'শুভ বিজয়ার মিষ্টিমুখ ও জলখাবার • Sweet & Savory Reunion',
    imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b30decb272?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    prepTimeMinutes: 20,
    description: 'The auspicious Bijoya reunion platter packed with savory fish fry with mustard kasundi, stuffed koraishutir kochuri, baby potato alur dom, and royal sweets.',
    items: [
      { bengali: 'ভেটকি মাছের ফ্রাই (১ পিস)', english: 'Bhetki Fish Fry & Kasundi' },
      { bengali: 'কড়াইশুঁটির কচুরি (৩ পিস)', english: 'Green Peas Stuffed Kochuri' },
      { bengali: 'কাশ্মীরি আলুর দম', english: 'Kashmiri Alur Dom' },
      { bengali: 'খাস্তা কুঁচো নিমকি', english: 'Crispy Kucho Nimki' },
      { bengali: 'আনারস ও কিসমিসের চাটনি', english: 'Pineapple Raisin Chutney' },
      { bengali: 'ছানার জিলিপি', english: 'Chanar Jilipi (Cottage Cheese Sweet)' },
      { bengali: 'নরম পাকের রসগোল্লা', english: 'Soft Rosogolla (2 pcs)' }
    ]
  }
];

export const BhojMenuSection: React.FC = () => {
  const { addToCart, setIsCartOpen } = useRestaurant();
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'bhoj-shasthi': 1,
    'bhoj-saptami': 1,
    'bhoj-ashtami': 1,
    'bhoj-nabami': 1,
    'bhoj-dashami': 1
  });
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddBhojToCart = (combo: BhojComboItem) => {
    const qty = quantities[combo.id] || 1;
    // Map combo to MenuItem format for cart
    const comboMenuItem: MenuItem = {
      id: combo.id,
      name: combo.englishTitle,
      bengaliName: combo.bengaliTitle,
      category: 'thalis',
      description: combo.description,
      price: combo.price,
      dietary: combo.dietary,
      spiceLevel: 'royal',
      imageUrl: combo.imageUrl,
      inStock: true,
      prepTimeMinutes: combo.prepTimeMinutes,
      serves: combo.totalWeight,
      ingredients: combo.items.map((i) => `${i.english} (${i.bengali})`)
    };

    addToCart(comboMenuItem, qty, `Festive Combo: ${combo.totalWeight}`);
    setAddedNotice(combo.bengaliTitle);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  const filteredCombos = selectedDay === 'all'
    ? BHOJ_SPECIALS
    : BHOJ_SPECIALS.filter((c) => c.id.includes(selectedDay));

  return (
    <section id="bhoj-menu-section" className="py-12 sm:py-20 bg-[#FFFDF9] border-t border-orange-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-900 border border-red-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-red-700" />
            <span className="font-bengali text-sm font-black">ঐতিহ্যবাহী ভোজ মেনু • Festive Mahabhoj Combos</span>
          </div>

          <h2 className="font-ultra text-3xl sm:text-5xl text-stone-900 tracking-tight">
            পাত পেড়ে বাঙালিয়ানা ভোজ
          </h2>

          <p className="text-stone-600 text-xs sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            Authentic, slow-cooked Bengali Mahabhoj Platters presented in royal Zamindari thali style. Every combo comes with authentic course-by-course pairings from welcome cooler to earthen sweets.
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white hover:bg-orange-50 text-stone-700 border border-stone-200'
            }`}
          >
            All Bhoj Thalis (সব ভোজ)
          </button>
          <button
            onClick={() => setSelectedDay('shasthi')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              selectedDay === 'shasthi'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white hover:bg-orange-50 text-stone-700 border border-stone-200'
            }`}
          >
            ষষ্ঠী স্পেশাল (₹449)
          </button>
          <button
            onClick={() => setSelectedDay('saptami')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              selectedDay === 'saptami'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white hover:bg-orange-50 text-stone-700 border border-stone-200'
            }`}
          >
            সপ্তমী ইলিশ (₹649)
          </button>
          <button
            onClick={() => setSelectedDay('ashtami')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              selectedDay === 'ashtami'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white hover:bg-orange-50 text-stone-700 border border-stone-200'
            }`}
          >
            অষ্টমী নিরামিষ (₹399)
          </button>
          <button
            onClick={() => setSelectedDay('nabami')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              selectedDay === 'nabami'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white hover:bg-orange-50 text-stone-700 border border-stone-200'
            }`}
          >
            নবমী কষা মাংস (₹549)
          </button>
          <button
            onClick={() => setSelectedDay('dashami')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              selectedDay === 'dashami'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white hover:bg-orange-50 text-stone-700 border border-stone-200'
            }`}
          >
            দশমী বিজয়া (₹349)
          </button>
        </div>

        {/* Global Toast if added */}
        {addedNotice && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 text-xs font-bold">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              ✓
            </span>
            <span>
              {addedNotice} has been added to your feast!
            </span>
            <button
              onClick={() => setIsCartOpen(true)}
              className="ml-2 underline text-orange-400 font-extrabold cursor-pointer"
            >
              View Cart
            </button>
          </div>
        )}

        {/* Cards Grid: Styled Exactly like the Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {filteredCombos.map((combo) => {
            const currentQty = quantities[combo.id] || 1;

            return (
              <div
                key={combo.id}
                className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-red-900/30 bg-[#8E1B1B] text-white flex flex-col justify-between"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 25%, #A82424 0%, #821515 50%, #5E0D0D 100%)`
                }}
              >
                {/* Traditional Alpona vertical lace margins */}
                <div
                  className="absolute left-1.5 top-0 bottom-0 w-3 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`,
                    backgroundSize: '8px 16px'
                  }}
                />
                <div
                  className="absolute right-1.5 top-0 bottom-0 w-3 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`,
                    backgroundSize: '8px 16px'
                  }}
                />

                {/* Top Mascot Branding Tag matching reference */}
                <div className="relative pt-6 px-6 sm:px-8 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-white text-red-900 flex items-center justify-center font-black shadow-md">
                      <span className="font-bengali text-2xl">র</span>
                    </div>
                    <div>
                      <span className="font-black text-sm tracking-wide text-white uppercase block">
                        Roshoi Ghor
                      </span>
                      <span className="font-bengali text-amber-200 text-xs font-bold block -mt-1">
                        — পাত পেড়ে বাঙালিয়ানা —
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full ${
                      combo.dietary === 'veg'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 text-red-950'
                    }`}
                  >
                    {combo.dietary === 'veg' ? 'Pure Veg' : 'Non-Veg Bhoj'}
                  </span>
                </div>

                {/* Circular Plate Presentation with Alpona Rings */}
                <div className="relative py-6 flex items-center justify-center">
                  {/* Concentric Traditional Alpona Mandala Rings */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                    {/* Alpona lace circle backdrop */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-200/40 animate-spin-slow" />
                    <div className="absolute inset-4 rounded-full border border-white/30" />
                    <div className="absolute inset-8 rounded-full bg-red-950/50 shadow-inner" />

                    {/* Circular Plate */}
                    <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-2xl border-4 border-amber-300/80">
                      <img
                        src={combo.imageUrl}
                        alt={combo.bengaliTitle}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Titles & Pricing Banner matching reference */}
                <div className="px-6 sm:px-8 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {/* Bold chunky Bengali display heading matching reference image */}
                      <h3 className="font-bengali text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-xs">
                        {combo.bengaliTitle}
                      </h3>
                      <h4 className="font-ultra text-base sm:text-lg text-amber-300 font-normal mt-0.5">
                        {combo.englishTitle}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bengali text-xl sm:text-2xl font-black text-amber-300">
                        {combo.perPersonText}
                      </div>
                      <span className="text-[11px] text-amber-100 font-mono block">
                        ({formatINR(combo.price)} / guest)
                      </span>
                    </div>
                  </div>

                  {/* Weight / Portion badge */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-black text-amber-200 uppercase tracking-wider bg-red-950/60 px-3 py-1 rounded-md border border-amber-300/30">
                      {combo.totalWeight}
                    </span>
                    <span className="text-[11px] text-stone-300 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {combo.prepTimeMinutes} mins prep
                    </span>
                  </div>
                </div>

                {/* Two-Column Itemized List matching reference image layout */}
                <div className="px-6 sm:px-8 py-5">
                  <div className="bg-red-950/40 rounded-2xl p-4 border border-amber-300/20 backdrop-blur-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm">
                      {combo.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-1.5">
                          {/* Bengali name on left */}
                          <span className="font-bengali text-white font-extrabold text-sm tracking-wide">
                            {it.bengali}
                          </span>
                          {/* English translation on right */}
                          <span className="font-lato text-amber-200/90 text-xs font-semibold text-right">
                            {it.english}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-amber-100/70 italic mt-3 text-center">
                      * Quantity mentioned here may slightly differ with portion size. উল্লেখিত খাবারের পরিমাণের সাথে আসল পরিমাণের সামান্য তফাৎ থাকতে পারে।
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer with Stepper & Add To Cart */}
                <div className="p-6 sm:px-8 bg-red-950/80 border-t border-amber-300/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-amber-200 font-bold">Thalis:</span>
                    <div className="flex items-center bg-black/40 border border-amber-300/40 rounded-full px-2 py-1">
                      <button
                        onClick={() => handleQtyChange(combo.id, -1)}
                        className="p-1 text-white hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono font-bold text-sm text-white">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(combo.id, 1)}
                        className="p-1 text-white hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono text-base font-black text-amber-300">
                      = {formatINR(combo.price * currentQty)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddBhojToCart(combo)}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-stone-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-stone-950" />
                    <span>Add Bhoj To Cart (অর্ডার করুন)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
