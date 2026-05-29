/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';

// LAZY LOADING: This is a massive performance boost. 
// It tells the browser NOT to download a page until the user actually clicks on it.
const Home = lazy(() => import('./components/Home'));
const Services = lazy(() => import('./components/Services'));
const Training = lazy(() => import('./components/Training'));
const Gallery = lazy(() => import('./components/Gallery'));
const Booking = lazy(() => import('./components/Booking'));
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));

// GPU-Accelerated Page Transition Animation
const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } }
};

// A beautiful, branded loading screen while pages download in the background
const PageLoader = () => (
  <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center">
    <Loader2 className="animate-spin text-brand-gold mb-4" size={40} />
    <span className="text-brand-charcoal/50 font-black tracking-[0.2em] uppercase text-xs">
      Loading Experience
    </span>
  </div>
);

function App() {
  // Global State: Tracks which page the user is currently viewing
  const [currentPage, setCurrentPage] = useState('home');

  // Scroll to top automatically whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // The Routing Engine
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home setPage={setCurrentPage} />;
      case 'services': return <Services setPage={setCurrentPage} />;
      case 'training': return <Training setPage={setCurrentPage} />;
      case 'gallery': return <Gallery setPage={setCurrentPage} />;
      case 'booking': return <Booking />;
      case 'login': return <Login setPage={setCurrentPage} />;
      case 'dashboard': return <Dashboard setPage={setCurrentPage} />;
      default: return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    // The main wrapper uses the new soft cream background automatically
    <div className="min-h-screen bg-white text-brand-charcoal selection:bg-brand-gold selection:text-white font-sans overflow-x-hidden">
      
      {/* BUG FIX: The Navbar is strictly hidden when on the Login or Dashboard pages */}
      {currentPage !== 'login' && currentPage !== 'dashboard' && (
        <Navbar setPage={setCurrentPage} />
      )}

      {/* AnimatePresence handles the smooth fading between pages.
        mode="wait" ensures the current page exits completely before the next one enters.
      */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          // Forces hardware acceleration for page swaps
          style={{ willChange: "opacity, transform" }}
          className="min-h-screen"
        >
          {/* Suspense catches the lazy-loaded components and shows the PageLoader while they fetch */}
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}

export default App;