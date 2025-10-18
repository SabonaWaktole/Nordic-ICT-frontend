import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  id?: number;
  name: string;
  overview: string;
  link: string;
  thumbnail: string;
  delay: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, name, overview, link, thumbnail, delay }) => {
  const { isDark } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

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
    return () => observer.unobserve(current);
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
    <div ref={cardRef} className={`group relative rounded-lg overflow-hidden transition-all duration-500 transform opacity-0 translate-y-8 hover:-translate-y-2 ${isDark ? 'bg-[#001f3f] hover:glow-on-hover-dark' : 'bg-gray-300 hover:glow-on-hover-light shadow-md'}`}>
      <span className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
      <div className="relative h-64 overflow-hidden">
        <img src={thumbnail} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-orange-400 group-hover:text-orange-300' : 'text-gray-800 group-hover:text-green-500'}`}>{name}</h3>
        <p className={`${isDark ? 'text-white group-hover:text-orange-300' : 'text-gray-600 group-hover:text-green-400'} mb-4`}>{overview}</p>
        <div className="flex items-center gap-4">
          {typeof id === 'number' && (
            <Link to={`/projects/${id}`} className="inline-flex items-center">
              <span className="relative group/link">
                <span className={`${isDark ? 'text-orange-400 group-hover/link:text-orange-300' : 'text-gray-800 group-hover/link:text-green-500'} font-medium`}>View details</span>
                <span className={`absolute left-0 bottom-0 h-[1px] w-0 transition-all duration-300 group-hover/link:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
              </span>
            </Link>
          )}
          <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
            <span className="relative group/link">
              <span className={`${isDark ? 'text-orange-400 group-hover/link:text-orange-300' : 'text-gray-800 group-hover/link:text-green-500'} font-medium`}>Visit project</span>
              <span className={`absolute left-0 bottom-0 h-[1px] w-0 transition-all duration-300 group-hover/link:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
            </span>
            <ExternalLink size={16} className={`ml-1 ${isDark ? 'text-orange-400 group-hover/link:text-orange-300' : 'text-gray-800 group-hover/link:text-green-500'}`} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
