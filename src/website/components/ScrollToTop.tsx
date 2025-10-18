import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  
  return (
    <button onClick={scrollToTop} className={`fixed bottom-6 right-6 p-3 rounded-full z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${isDark ? 'bg-orange-500 text-white hover:bg-orange-600 glow-on-hover-dark' : 'bg-gray-800 text-white hover:bg-green-600 glow-on-hover-light'}`} aria-label="Scroll to top">
      <ArrowUp size={20} />
    </button>
  );
};

export default ScrollToTop;
