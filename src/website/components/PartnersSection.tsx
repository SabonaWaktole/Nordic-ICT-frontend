import { useTheme } from '../../contexts/ThemeContext';
import PartnerLogo from './PartnerLogo';

const partners = [
  { id: 1, name: 'Falcon Group', logo: '/assets/falcon_group.png', link: '#' },
  { id: 2, name: 'Frafan Trading', logo: '/assets/frafan_trading.png', link: '#' },
  { id: 3, name: 'EastStar FZC', logo: '/assets/east_star.png', link: '#' },
  { id: 4, name: 'Professor Mihiretu Shanko ', logo: '/assets/mihretu_shanko.png', link: '#' },
  { id: 5, name: 'Wako Getachew', logo: '/assets/wako_getachew.png', link: '#' },
];

const PartnersSection: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <section id="partners" className={`py-20 px-4 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-orange-400' : 'text-gray-800'}`}>Our Partners</h2>
          <p className={`${isDark ? 'text-white' : 'text-gray-600'} max-w-2xl mx-auto`}>
            We collaborate with leading organizations across Ethiopia and internationally to drive technological innovation.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((p, i) => (
            <PartnerLogo key={p.id} name={p.name} logo={p.logo} link={p.link} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
