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
      {/* Fully Transparent & Floating Ambient Backdrops */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EE]/70 to-[#FFF3E0]/50 backdrop-blur-3xl">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-300/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-amber-300/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-[600px] h-[600px] bg-red-300/12 rounded-full blur-[150px]" />
      </div>

      {/* Google Maps Quota Warning Banner */}
      <QuotaExceededBanner />

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Main View Switching with Smooth Framer Motion Scroll Triggers */}
      <main className="flex-1">
        {activeCustomerTab === 'menu' && (
          <>
            {/* 1. Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <HeroSection />
            </motion.div>

            {/* 2. Popular Dishes Carousel / Grid with Floating Bestsellers */}
            <motion.div {...sectionMotionProps}>
              <PopularDishesSection />
            </motion.div>

            {/* 3. Restaurant Images & Heritage Kitchen Gallery */}
            <motion.div {...sectionMotionProps}>
              <RestaurantGallerySection />
            </motion.div>

            {/* 4. Traditional Festive Bhoj Thalis */}
            <motion.div {...sectionMotionProps}>
              <BhojMenuSection />
            </motion.div>

            {/* 5. Our Regular Menu Pack (Borderless & Transparent) */}
            <motion.div {...sectionMotionProps}>
              <MenuSection />
            </motion.div>

            {/* 6. Dinner Table Reservation Banner */}
            <motion.div {...sectionMotionProps}>
              <ReserveTableBanner />
            </motion.div>

            {/* 7. Customer Testimonials (Floating Sideways) */}
            <motion.div {...sectionMotionProps}>
              <CustomerReviewsSection />
            </motion.div>
          </>
        )}

        {activeCustomerTab === 'bhoj-menu' && (
          <>
            <motion.div {...sectionMotionProps}>
              <BhojMenuSection />
            </motion.div>
            <motion.div {...sectionMotionProps}>
              <MenuSection />
            </motion.div>
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
