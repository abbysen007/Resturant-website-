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
    <div className="min-h-screen flex flex-col bg-[#FCFBF8] text-slate-800">
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

            {/* 2. Popular Dishes Carousel / Grid */}
            <PopularDishesSection />

            {/* 3. Restaurant Images & Heritage Kitchen Gallery */}
            <RestaurantGallerySection />

            {/* 4. Traditional Festive Bhoj Thalis (Matching Mahalaya / Bhoj Poster Reference) */}
            <BhojMenuSection />

            {/* 5. Our Regular Menu Pack (Categorized Menu Grid) */}
            <MenuSection />

            {/* 6. Dinner Table Reservation Banner */}
            <ReserveTableBanner />

            {/* 7. Customer Testimonials */}
            <CustomerReviewsSection />
          </>
        )}

        {activeCustomerTab === 'bhoj-menu' && (
          <>
            <BhojMenuSection />
            <MenuSection />
          </>
        )}

        {activeCustomerTab === 'tracking' && (
          <LiveOrderTracker />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      <LocationModal />
      <RadiusExceededModal />
      <CartDrawer />
      <CheckoutModal />
      <DishDetailsModal />
      <TableReservationModal />
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
