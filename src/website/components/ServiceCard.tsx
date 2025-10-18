import React, { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, delay }) => {
  const { isDark } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`group p-6 rounded-lg transform transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        hover:-translate-y-2 hover:shadow-xl
        ${isDark
          ? 'bg-[#001f3f] hover:glow-on-hover-dark'
          : 'bg-gray-300 hover:glow-on-hover-light shadow-md'
        }
      `}
    >
      {/* Icon Container */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300
          ${isDark ? 'bg-black/50 text-orange-400' : 'bg-gray-100 text-green-700'}
          group-hover:scale-110
        `}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={`text-xl font-semibold mb-3 transition-colors duration-300
          ${isDark ? 'text-white group-hover:text-orange-400' : 'text-green-600 group-hover:text-green-500'}
        `}
      >
        {title}
      </h3>

      {/* Description */}
      <p className={`${isDark ? 'text-white group-hover:text-orange-400' : 'text-gray-600 group-hover:text-green-400'} transition-colors duration-300`}>
        {description}
      </p>
      {/* <div className="h-1 w-0 bg-orange-400 absolute bottom-0 left-0 group-hover:w-full transition-all duration-500 ease-in-out"></div> */}
      {/* Underline animation - green in light theme, orange in dark theme */}
      <span className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full rounded-full ${
        isDark ? 'bg-orange-500' : 'bg-green-500'
      }`}></span>
    </div>
  );
};

export default ServiceCard;