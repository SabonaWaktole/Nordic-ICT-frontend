import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Code, BookOpen, HeadsetIcon, Handshake } from 'lucide-react';
import ServiceCard from './ServiceCard';

const ServicesSection: React.FC = () => {
  const { isDark } = useTheme();
  
  const services = [
    {
      title: 'Software Development',
      description: 'Custom software solutions designed for African businesses and institutions, with a focus on scalability and localization.',
      icon: <Code size={32} />,
      delay: 0
    },
    {
      title: 'E-book & Audiobook Platforms',
      description: 'Digital publishing solutions that make educational content accessible across Ethiopia, in multiple languages.',
      icon: <BookOpen size={32} />,
      delay: 100
    },
    {
      title: 'IT Consulting',
      description: 'Strategic technology guidance to help organizations leverage digital tools effectively in the Ethiopian context.',
      icon: <HeadsetIcon size={32} />,
      delay: 200
    },
    {
      title: 'Tech Partnership Projects',
      description: 'Collaborative initiatives with local and international partners to drive technological advancement in Ethiopia.',
      icon: <Handshake size={32} />,
      delay: 300
    }
  ];

  return (
    <section 
      id="services" 
      className={`py-20 px-4 ${
        isDark ? 'bg-black' : 'bg-gray-50'
      }`}
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDark ? 'text-orange-400' : 'text-gray-800'
          }`}>
            Our Services
          </h2>
          <p className={`max-w-2xl mx-auto ${
            isDark ? 'text-orange-300/80' : 'text-gray-600'
          }`}>
            Comprehensive technology solutions tailored to empower Ethiopian businesses, 
            educational institutions, and communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              delay={service.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;