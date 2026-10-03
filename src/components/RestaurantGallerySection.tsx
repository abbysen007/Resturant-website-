import React, { useState } from 'react';
import { Camera, Sparkles, MapPin, Eye, X, ArrowRight, Utensils } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  bengaliTitle: string;
  category: 'spaces' | 'kitchen' | 'setup' | 'decor';
  imageUrl: string;
  description: string;
}

const GALLERY_PHOTOS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Zamindari Inner Courtyard',
    bengaliTitle: 'জমিদারি নাটমন্দির ও অলিন্দ',
    category: 'spaces',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    description: 'Restored 19th-century Calcutta heritage courtyard with marble checkerboard floors, teak arches, and natural daylight dining.'
  },
  {
    id: 'gal-2',
    title: 'Slow-Cooking Earthen Handis',
    bengaliTitle: 'মাটির হাঁড়িতে ধিম আঁচে রন্ধন',
    category: 'kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    description: 'Our traditional kitchen where Kosha Mangsho and Daab Chingri simmer gently in unglazed terracotta handis over low coal heat.'
  },
  {
    id: 'gal-3',
    title: 'Traditional Kansa (Bell-Metal) Dining',
    bengaliTitle: 'কাঁসার থালায় পাত পেড়ে ভোজ',
    category: 'setup',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    description: 'Hand-beaten Muradabad brass bell-metal plates lined with fresh tender banana leaves, authentic brass water lotas, and katoris.'
  },
  {
    id: 'gal-4',
    title: 'Warm Lantern Verandah Dining',
    bengaliTitle: 'সন্ধ্যাবাতির স্নিগ্ধতায় বারান্দা',
    category: 'spaces',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Intimate evening seating on our vintage colonial verandah overlooking heritage Park Street foliage under soft amber lamps.'
  },
  {
    id: 'gal-5',
    title: 'Artisanal Kasundi & Stone Grinding',
    bengaliTitle: 'শীল-পাটায় বাটা খাঁটি মশলা',
    category: 'kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80',
    description: 'Fresh yellow and black mustard seeds ground fresh on granite shil-nora with green chillies and raw cold-pressed mustard oil.'
  },
  {
    id: 'gal-6',
    title: 'Antique Teak & Gramophone Lounge',
    bengaliTitle: 'সাবেকি আবহ ও গ্রামোফোন বৈঠকখানা',
    category: 'decor',
    imageUrl: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80',
    description: 'A nostalgic waiting lounge playing classic Rabindra Sangeet on vintage gramophones alongside framed sketches of Old Calcutta.'
  }
];

export const RestaurantGallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'spaces' | 'kitchen' | 'setup' | 'decor'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredPhotos = activeCategory === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  return (
    <section id="gallery-section" className="py-14 sm:py-20 bg-[#FFFDF9] border-t border-orange-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-bengali text-sm font-black">আমাদের ঐতিহ্য ও আতিথেয়তা • Heritage Ambiance</span>
          </div>

          <h2 className="font-ultra text-3xl sm:text-5xl text-stone-900 tracking-tight">
            Inside The Kitchen & Dining Halls
          </h2>

          <p className="text-stone-600 text-xs sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            Step into our restored Park Street mansion. From authentic bell-metal tableware to unhurried earthen clay ovens, experience the vintage warmth of a traditional Bengali home.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Photos (সব ছবি)' },
            { id: 'spaces', label: 'Dining Spaces (বৈঠকখানা ও অলিন্দ)' },
            { id: 'kitchen', label: 'Bawarchi Kitchen (রন্ধনশালা)' },
            { id: 'setup', label: 'Royal Table Setup (কাঁসার থালা)' },
            { id: 'decor', label: 'Heritage Decor (সাবেকি আসবাব)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white hover:bg-orange-50 text-stone-700 border border-stone-200 hover:border-orange-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-3xl overflow-hidden bg-white border border-orange-200/90 shadow-sm hover:shadow-xl hover:border-orange-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-100">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 font-bold text-[10px] uppercase tracking-wider border border-white/40 shadow-xs">
                    {photo.category}
                  </span>
                </div>

                {/* View Icon on Hover */}
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 text-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <Eye className="w-4 h-4 text-orange-600" />
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="font-bengali text-amber-300 text-xs font-black block">
                    {photo.bengaliTitle}
                  </span>
                  <h3 className="font-black text-base sm:text-lg leading-snug drop-shadow-xs">
                    {photo.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-orange-100/60">
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {photo.description}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs font-bold text-orange-700">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Park Street Flagship
                  </span>
                  <span className="text-[11px] text-stone-400 group-hover:text-orange-600 flex items-center gap-1 transition-colors">
                    Click to enlarge <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden border border-orange-200 shadow-2xl space-y-4"
          >
            <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bengali text-orange-600 text-sm font-black">
                  {selectedPhoto.bengaliTitle}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  {selectedPhoto.category}
                </span>
              </div>
              <h3 className="font-ultra text-xl sm:text-2xl text-stone-900">
                {selectedPhoto.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed pt-1">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
