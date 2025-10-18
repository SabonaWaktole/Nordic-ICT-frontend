import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Target, Eye, History, Heart } from 'lucide-react';
import AboutTab from './AboutTab';

const AboutSection: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('mission');
  
  const aboutData = {
    mission: {
      title: 'Our Mission',
      icon: <Target size={32} />,
      content: [
        {
          title: 'Digital Inclusion',
          description: 'Creating technological solutions that ensure no Ethiopian is left behind in the digital revolution.'
        },
        {
          title: 'Educational Access',
          description: 'Empowering Ethiopian students and educators with affordable, accessible learning tools.'
        },
        {
          title: 'Localized Innovation',
          description: 'Developing context-specific solutions that address unique Ethiopian challenges.'
        }
      ]
    },
    vision: {
      title: 'Our Vision',
      icon: <Eye size={32} />,
      content: [
        {
          title: 'Leading Digital Development:',
          description: `Nordic ICT PLC envisions being a leading force in Ethiopia’s digital development and contributing to the country’s technological transformation..`
        },
        {
          title: 'Innovative and Sustainable Solutions',
          description: `We aim to provide innovative and sustainable digital solutions across various sectors, bridging local expertise with international opportunities`
        },
        {
          title: 'Strengthening Digital Infrastructure',
          description: `By combining experience and resources from Scandinavia with local talent development, we work to strengthen the digital infrastructure.`
        },
        {
          title: 'Enhancing Accessibility',
          description: `We provide developers, businesses, and communities with access to modern technological solutions.`
        },
        {
          title: 'Driving Efficiency and Value',
          description: `Our goal is to make technology more accessible, efficient, and value-driven for everyone`
        }
      ]
    },
    background: {
      title: 'Background',
      icon: <History size={32} />,
      content: [
        {
          title: 'Founded 2023',
          description: `Established in 2023, but with prior experience operating under different names, Nordic ICT PLC has built expertise in software development, digital transformation, and IT consulting. We collaborate with both local and international partners to create innovative solutions that meet today’s technological demands.`
        },
        {
          title: 'Impact on technology',
          description: `Nordic ICT PLC is a technology company that develops digital solutions and platforms across various sectors. The company specializes in e-books, audiobooks, and digital services that enhance access to information and technology`
        },
        {
          title: 'Value added',
          description: `With strong ties to Scandinavia, we bring valuable resources and expertise to the market while working to promote local developers and technological initiatives`
        }
      ]
    },
    values: {
      title: 'Core Values',
      icon: <Heart size={32} />,
      content: [
        {
          title: 'People at the Center',
          description: `We believe in technology that serves people. Our solutions are designed to create real value and improve lives`
        },
        {
          title: 'Respect and Inclusion ',
          description: `We value diversity and treat everyone with respect. We foster an environment where all voices are heard, and collaboration across cultures and experiences makes us stronger`
        },
        {
          title: 'Honesty and Integrity',
          description: `We operate with transparency and uphold high ethical standards. We stand for honest and fair processes in everything we do`
        },
        {
          title: 'Responsibility and Sustainability',
          description: `We take responsibility for how our technology impacts society and the environment. We develop solutions with longterm sustainability and positive social impact in mind`
        },
        {
          title: 'Security and Trust',
          description: `We build technology that people can rely on, prioritizing safety, privacy, and responsible data use.`
        }
      ]
    }
  };
  
  return (
    <section 
      id="about" 
      className={`py-20 px-4 ${
        isDark ? 'bg-gray-950' : 'bg-white'
      }`}
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDark ? 'text-orange-400' : 'text-gray-800'
          }`}>
            About Us
          </h2>
          <p className={`max-w-2xl mx-auto ${
            isDark ? 'text-white' : 'text-gray-600'
          }`}>
            Learn more about Nordic ICT's mission, vision, background, and the core values that drive our work in Ethiopia.
          </p>
        </div>
        
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {Object.entries(aboutData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === key
                  ? isDark
                    ? 'bg-orange-500 text-white glow-on-hover-dark'
                    : 'bg-gray-800 text-white glow-on-hover-light'
                  : isDark
                  ? 'bg-transparent text-[#8C600C] border border-orange-400/30 hover:border-orange-400 hover:shadow-[0_0_15px_4px_rgba(255,215,0,0.7)]'
                  : 'bg-transparent text-green-400 border border-green-300 hover:border-green-500 hover:shadow-[0_0_15px_4px_rgba(34,197,94,0.7)]'
              }`}
            >
              <span className="flex items-center gap-2">
                {/* Clone icon to adjust color and size contextually */}
                {data.icon}
                {data.title}
              </span>
            </button>
          ))}
        </div>
        
        <div className="mt-8">
          {Object.entries(aboutData).map(([key, data]) => (
            activeTab === key && (
              <AboutTab 
                key={key}
                title={data.title}
                content={data.content}
                icon={data.icon}
              />
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
