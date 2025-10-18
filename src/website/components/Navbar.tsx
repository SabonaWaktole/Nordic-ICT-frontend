import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Menu, X, Info, Mail, HandPlatter, FolderGit2, Handshake, Newspaper } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-black/40 backdrop-blur-sm shadow-md'
            : 'bg-white/70 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="text-orange-400 font-bold text-2xl">
            <img src="/assets/home_logo.png" alt="logo" className="w-72" />
          </a>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          <a href="#services" className={`nav-link flex gap-2 ${isDark ? 'text-white' : 'text-gray-900'} hover:text-orange-400 transition-colors`}>
            <HandPlatter className="h-4 w-4 inline-block mr-1 text-orange-400" />
            Services
          </a>
          <a href="#about" className={`nav-link flex gap-2 ${isDark ? 'text-white' : 'text-gray-900'} hover:text-orange-400 transition-colors`}>
            <Info className="h-4 w-4 inline-block mr-1 text-orange-400" />
            About Us
          </a>
          <a href="#news" className={`nav-link flex gap-2 ${isDark ? 'text-white' : 'text-gray-900'} hover:text-orange-400 transition-colors`}>
            <Newspaper className="h-4 w-4 inline-block mr-1 text-orange-400" />
            Updates
          </a>
          <a href="#partners" className={`nav-link flex gap-2 ${isDark ? 'text-white' : 'text-gray-900'} hover:text-orange-400 transition-colors`}>
            <Handshake className="h-4 w-4 inline-block mr-1 text-orange-400" />
            Partners
          </a>
          <a href="#projects" className={`nav-link flex gap-2 ${isDark ? 'text-white' : 'text-gray-900'} hover:text-orange-400 transition-colors`}>
            <FolderGit2 className="h-4 w-4 inline-block mr-1 text-orange-400" />
            Projects
          </a>
          <a href="#contact" className={`nav-link flex gap-2 ${isDark ? 'text-white' : 'text-gray-900'} hover:text-orange-400 transition-colors`}>
            <Mail className="h-4 w-4 inline-block mr-1 text-orange-400" />
            Contact
          </a>
        </nav>

        {/* Theme Toggle + Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`} aria-label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5 text-orange-400" /> : <Moon className="h-5 w-5 text-gray-800" />}
          </button>

          <button className="md:hidden p-2 text-orange-400 focus:outline-none" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden animate-fadeIn ${isDark ? 'bg-navy-900' : 'bg-white'}`}>
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {['services', 'about', 'news', 'partners', 'projects', 'contact'].map((id) => (
              <a key={id} href={`#${id}`} className={`py-2 border-b ${isDark ? 'text-orange-400 border-gray-800' : 'text-gray-900 border-gray-200'}`} onClick={() => setIsMobileMenuOpen(false)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
