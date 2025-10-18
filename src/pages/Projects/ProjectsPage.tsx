import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProjectsSection from '../../website/components/ProjectsSection';
import ScrollToTop from '../../website/components/ScrollToTop';
import { Link } from 'react-router-dom';

const ProjectsPage: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <div className={isDark ? 'min-h-screen bg-black text-orange-400' : 'min-h-screen bg-white text-gray-900'}>
      <Navbar />
      <div className="pt-28" />
      <div className="container mx-auto px-4 mb-6">
        <nav className="text-sm" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className={`${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-gray-700 hover:text-green-600'}`}>Home</Link>
              <span className={`${isDark ? 'text-orange-300/60' : 'text-gray-400'} mx-2`}>{'/'}</span>
            </li>
            <li className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Projects</li>
          </ol>
        </nav>
        <h1 className={`text-3xl md:text-4xl font-bold mt-2 ${isDark ? 'text-orange-400' : 'text-gray-900'}`}>Our Projects</h1>
      </div>
      <ProjectsSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ProjectsPage;
