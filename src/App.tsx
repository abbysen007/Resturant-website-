import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { QuotaExceededBanner } from './components/QuotaExceededBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PopularDishesSection } from './components/PopularDishesSection';
import { RestaurantGallerySection } from './components/RestaurantGallerySection';
import { BhojMenuSection } from './components/BhojMenuSection';
import { MenuSection } from './components/MenuSection';
import { ReserveTableBanner } from './components/ReserveTableBanner';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { LiveOrderTracker } from './components/LiveOrderTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

// Modals and Drawers
import { LocationModal } from './components/LocationModal';
import { RadiusExceededModal } from './components/RadiusExceededModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DishDetailsModal } from './components/DishDetailsModal';
import { TableReservationModal } from './components/TableReservationModal';
import { UserPanelDrawer } from './components/UserPanelDrawer';
import { AuthModal } from './components/AuthModal';

import { motion } from 'framer-motion';

const sectionMotionProps = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.75, ease: 'easeOut' as const }
};

const AppContent: React.FC = () => {
  const { currentView, activeCustomerTab } = useRestaurant();

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#FFFDF9]">
        <QuotaExceededBanner />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-800 relative selection:bg-orange-200 selection:text-orange-950">
      {/* Super Transparent Ambient Luminous Backdrops */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-transparent overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-[750px] h-[750px] bg-gradient-to-br from-orange-400/12 via-amber-300/10 to-transparent rounded-full blur-[160px]" />
        <div className="absolute top-1/4 -left-32 w-[650px] h-[650px] bg-gradient-to-tr from-amber-400/14 via-rose-300/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute top-2/3 right-10 w-[700px] h-[700px] bg-gradient-to-bl from-orange-300/12 via-yellow-200/10 to-transparent rounded-full blur-[170px]" />
        <div className="absolute -bottom-32 left-1/3 w-[800px] h-[800px] bg-gradient-to-t from-amber-300/12 via-orange-200/10 to-transparent rounded-full blur-[160px]" />
      </div>

      {/* Google Maps Quota Warning Banner */}
      <QuotaExceededBanner />

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Main View Switching */}
      <main className="flex-1">
        {activeCustomerTab === 'menu' && (
          <>
            {/* 1. Hero Section */}
            <HeroSection />

            {/* 2. Popular Dishes Carousel / Grid with Floating Bestsellers */}
            <PopularDishesSection />

            {/* 3. Restaurant Images & Heritage Kitchen Gallery */}
            <RestaurantGallerySection />

            {/* 4. Traditional Festive Bhoj Thalis */}
            <BhojMenuSection />

            {/* 5. Our Regular Menu Pack (Always Visible on Mobile and Desktop) */}
            <div id="regular-menu-container" className="w-full block">
              <MenuSection />
            </div>

            {/* 6. Dinner Table Reservation Banner */}
            <ReserveTableBanner />

            {/* 7. Customer Testimonials (Floating Sideways) */}
            <CustomerReviewsSection />
          </>
        )}

        {activeCustomerTab === 'bhoj-menu' && (
          <>
            <BhojMenuSection />
            <div id="regular-menu-container-bhoj" className="w-full block">
              <MenuSection />
            </div>
          </>
        )}

        {activeCustomerTab === 'tracking' && (
          <LiveOrderTracker />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Interactive Global Modals & User Panels */}
      <LocationModal />
      <RadiusExceededModal />
      <CartDrawer />
      <CheckoutModal />
      <DishDetailsModal />
      <TableReservationModal />
      <UserPanelDrawer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}
