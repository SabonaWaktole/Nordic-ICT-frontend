import ProjectCard from './ProjectCard';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { projectsData } from './projectsData';

// const projects = [
//   { id: 1, name: 'ETHIO BOOK', overview: 'Innovative platform that offers digital books and audiobooks.', link: 'https://www.nordic-et-platform.nordicict.com/', thumbnail: 'https://images.pexels.com/photos/5053740/pexels-photo-5053740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
//   { id: 2, name: 'BAZARO', overview: 'Digital marketplace solution with modern design and functionality.', link: 'https://diestus.com/referanser/bazaro/', thumbnail: '/assets/bazaro.png' },
//   { id: 3, name: 'KNKT', overview: 'Innovative digital platform for seamless connectivity.', link: 'https://diestus.com/referanser/knkt/', thumbnail: '/assets/knkt.png' },
// ];

const ProjectsSection: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <section id="projects" className={`py-20 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-orange-400' : 'text-gray-800'}`}>Our Projects</h2>
          <p className={`${isDark ? 'text-white' : 'text-gray-600'} max-w-2xl mx-auto`}>Explore our portfolio of successful projects and digital solutions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsData.map((p, i) => (
            <ProjectCard key={p.id} id={p.id} name={p.name} overview={p.overview} link={p.link} thumbnail={p.thumbnail} delay={i * 150} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/projects" className={`group relative inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 overflow-hidden ${isDark ? 'bg-orange-400 text-black hover:bg-orange-500' : 'bg-green-500 text-white hover:bg-green-700'}`}>
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute left-0 top-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[45deg] translate-x-[-200%] group-hover:translate-x-[400%] transition-transform duration-700"></span>
            </span>
            <span className="relative flex items-center">View More Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
