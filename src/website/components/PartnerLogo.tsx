import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface PartnerLogoProps {
  name: string;
  logo: string;
  link: string;
  delay: number;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ name, logo, link, delay }) => {
  const { isDark } = useTheme();
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = logoRef.current;
    if (!current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('opacity-100', 'scale-100');
          entry.target.classList.remove('opacity-0', 'scale-95');
        }, delay);
      }
    }, { threshold: 0.1 });

    current.classList.add('opacity-0', 'scale-95');
    current.classList.remove('opacity-100', 'scale-100');
    observer.observe(current);
    return () => observer.unobserve(current);
  }, [delay, isDark]);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    if (isVisible) {
      el.classList.add('opacity-100', 'scale-100');
      el.classList.remove('opacity-0', 'scale-95');
    }
  }, [isDark]);

  return (
    <div ref={logoRef} className={`group relative aspect-square rounded-lg overflow-hidden transition-all duration-500 transform opacity-0 scale-95 hover:-translate-y-4 ${isDark ? 'bg-[#001f3f] hover:glow-on-hover-dark' : 'bg-gray-300 hover:glow-on-hover-light shadow-md'}`}>
  <a href={link} className="w-full h-full p-4 flex flex-col items-center justify-center" aria-label={`Visit ${name}`}>
        <div className="w-16 h-16 mb-2 overflow-hidden rounded-full">
          <img src={logo} alt={`${name} logo`} className="w-full h-full object-cover" />
        </div>
        <span className={`relative text-xs text-center ${isDark ? 'text-white group-hover:text-orange-400' : 'text-gray-700 group-hover:text-green-500'}`}>{name}</span>
      </a>
      <span className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
    </div>
  );
};

export default PartnerLogo;
