import React from "react";
import Navbar from "./components/Navbar";
import ServicesSection from "./components/ServicesSection";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import NewsSection from "./components/NewsSection";
import PartnersSection from "./components/PartnersSection";
import ProjectsSection from "./components/ProjectsSection";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useTheme } from "../contexts/ThemeContext";

const WebsiteContent: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <div className={isDark ? 'min-h-screen bg-black text-orange-400' : 'min-h-screen bg-white text-gray-900'}>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <NewsSection />
      <ProjectsSection />
      <PartnersSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

const WebsiteApp: React.FC = () => {
  return <WebsiteContent />;
};

export default WebsiteApp;
