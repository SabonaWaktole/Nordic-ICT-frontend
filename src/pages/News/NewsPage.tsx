import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import NewsSection from '../../website/components/NewsSection';
import ScrollToTop from '../../website/components/ScrollToTop';

const NewsPage: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <div className={isDark ? 'min-h-screen bg-black text-orange-400' : 'min-h-screen bg-white text-gray-900'}>
      <Navbar />
      <div className="pt-28" />
      <NewsSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default NewsPage;
