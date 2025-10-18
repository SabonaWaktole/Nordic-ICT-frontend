import { type ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ContentItem {
  title: string;
  description: string;
}

interface AboutTabProps {
  title: string;
  content: ContentItem[];
  icon: ReactNode;
}

const AboutTab: React.FC<AboutTabProps> = ({ title, content, icon }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="fade-in">
      <div className="flex items-center justify-center mb-10">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
          isDark ? 'bg-navy-800 text-orange-400' : 'bg-gray-100 text-green-500'
        }`}>
          {icon}
        </div>
        <h3 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.map((item, index) => (
          <div 
            key={index}
            className={`relative p-6 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-4 overflow-hidden group ${
              isDark 
                ? 'bg-[#001f3f] hover:glow-on-hover-dark'
                : 'bg-gray-300 hover:glow-on-hover-light shadow-md'
            }`}
          >
            <h4 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
              isDark
                ? 'text-orange-400 group-hover:text-orange-300'
                : 'text-green-600 group-hover:text-green-500'
            }`}>
              {item.title}
            </h4>
            <p className={`transition-colors duration-300 ${
              isDark
                ? 'text-white group-hover:text-orange-300'
                : 'text-gray-600 group-hover:text-green-400'
            }`}>
              {item.description}
            </p>

            <span className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full rounded-full ${
              isDark ? 'bg-orange-500' : 'bg-green-500'
            }`}></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTab;
