import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Clock, Pin } from 'lucide-react';

interface NewsCardProps {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  thumbnail: string;
  pinned: boolean;
  delay: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ id, title, excerpt, date, thumbnail, pinned, delay }) => {
  const { isDark } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  useEffect(() => {
    const current = cardRef.current;
    if (!current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }, delay);
      }
    }, { threshold: 0.1 });
    current.classList.add('opacity-0', 'translate-y-8');
    current.classList.remove('opacity-100', 'translate-y-0');
    observer.observe(current);
    return () => { observer.unobserve(current); };
  }, [delay, isDark]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom >= 0;
    if (visible) {
      el.classList.add('opacity-100', 'translate-y-0');
      el.classList.remove('opacity-0', 'translate-y-8');
    }
  }, [isDark]);

  return (
    <div ref={cardRef} className={`group relative rounded-lg overflow-hidden transition-all duration-500 transform opacity-0 translate-y-8 h-full flex flex-col hover:-translate-y-4 ${isDark ? 'bg-[#001f3f] hover:glow-on-hover-dark' : 'bg-gray-300 hover:glow-on-hover-light shadow-md'}`}>
      <span className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
      <div className="relative h-48 overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {pinned && (
          <div className={`absolute top-0 right-0 p-2 ${isDark ? 'bg-orange-500' : 'bg-gray-800'} text-white flex items-center text-xs`}>
            <Pin size={12} className="mr-1" /> Featured
          </div>
        )}
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className={`flex items-center text-sm mb-3 ${isDark ? 'text-orange-300/70' : 'text-gray-500'}`}>
          <Clock size={14} className="mr-1" />{formatDate(date)}
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-orange-400 group-hover:text-orange-300' : 'text-gray-800 group-hover:text-green-500'}`}>{title}</h3>
        <p className={`${isDark ? 'text-white group-hover:text-orange-300' : 'text-gray-600 group-hover:text-green-400'} mb-4 flex-grow`}>{excerpt}</p>
        <Link to={`/news/${id}`} className="inline-flex items-center group/link">
          <span className={`relative font-medium ${isDark ? 'text-orange-400 group-hover/link:text-orange-300' : 'text-gray-800 group-hover/link:text-green-500'}`}>
            Read more →
            <span className={`absolute left-0 -bottom-1 h-[1px] w-0 transition-all duration-300 group-hover/link:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
