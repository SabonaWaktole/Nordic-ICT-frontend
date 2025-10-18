import React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../website/components/ScrollToTop';
import { projectsData } from '../../website/components/projectsData';

const ProjectDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const { id } = useParams();
  const item = projectsData.find(p => String(p.id) === id);

  return (
    <div className={isDark ? 'min-h-screen bg-black text-orange-400' : 'min-h-screen bg-white text-gray-900'}>
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-12">
        {item ? (
          <article className="max-w-3xl mx-auto">
            <img src={item.thumbnail} alt={item.name} className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-orange-400' : 'text-gray-900'}`}>{item.name}</h1>
            <p className={`${isDark ? 'text-white' : 'text-gray-700'} mb-6`}>{item.overview}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-green-600 hover:text-green-700'} underline`}>Visit project site</a>
          </article>
        ) : (
          <div className="text-center py-24">
            <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>The project you’re looking for was not found.</p>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ProjectDetailPage;
