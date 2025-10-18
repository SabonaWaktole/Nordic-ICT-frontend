import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowRight } from 'lucide-react';
import NewsCard from './NewsCard';
import { newsData } from './newsData';

const NewsSection: React.FC = () => {
  const { isDark } = useTheme();
  const [news, setNews] = useState(newsData);

  useEffect(() => {
    const sorted = [...news].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setNews(sorted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="news" className={`py-20 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-orange-400' : 'text-gray-800'}`}>Latest Updates</h2>
            <p className={`${isDark ? 'text-white' : 'text-gray-600'} max-w-2xl`}>
              Stay informed about Nordic ICT's latest initiatives, achievements, and events across Ethiopia.
            </p>
          </div>
          <Link to="/news" className={`group flex items-center mt-4 md:mt-0 ${isDark ? 'text-orange-400' : 'text-gray-800'}`}>
            <span className="relative inline-block group text-sm font-medium cursor-pointer">
              View all updates
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#FFD700] group-hover:w-full transition-all duration-300"></span>
            </span>
            <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {news.map((n, i) => (
            <NewsCard key={n.id} id={n.id} title={n.title} excerpt={n.excerpt} date={n.date} thumbnail={n.thumbnail} pinned={n.pinned} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
