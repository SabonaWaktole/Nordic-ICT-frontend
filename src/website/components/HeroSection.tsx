"use client";

import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const HeroSection: React.FC = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isExploreHovered, setIsExploreHovered] = useState(false);
  const pointIdCounter = useRef(0);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 100 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 100 });

  const [cursorPoints, setCursorPoints] = useState<Array<{ x: number; y: number; id: string }>>([]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 60]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const ball1X = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const ball1Y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const ball2X = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const ball2Y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ball3X = useTransform(mouseX, [0, 1], [-20, 20]);
  const ball3Y = useTransform(mouseY, [0, 1], [-20, 20]);

  const lineWidth = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.8, 0]);
  const invertedLineWidth = useTransform(lineWidth, (value) => 100 - value);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const targetX = e.clientX / window.innerWidth;
      const targetY = e.clientY / window.innerHeight;

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      mouseX.set(targetX);
      mouseY.set(targetY);

      pointIdCounter.current += 1;
      const newPoint = { x: e.clientX, y: e.clientY, id: `${Date.now()}-${pointIdCounter.current}` };
      setCursorPoints((prev) => [...prev.slice(-5), newPoint]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, mouseX, mouseY]);

  const scrollToNextSection = () => {
    const next = document.getElementById('services');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  const title = 'Nordic ICT';
  const tagline = "Bridging Ethiopia's Digital Future";
  const subtitle = 'Through Innovation and Inclusion';


  return (
  <div ref={sectionRef} className={`relative min-h-screen flex items-center justify-center overflow-hidden px-6 ${isDark ? 'text-orange-400' : 'text-orange-400'}`}>
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/1460853312/photo/abstract-connected-dots-and-lines-concept-of-ai-technology-motion-of-digital-data-flow.jpg?b=1&s=612x612&w=0&k=20&c=x0QPuKC83SPVcM7Wx364nTusL776cWWPL23U8HmlCfw=')] bg-cover bg-center"
          style={{ backgroundImage: "url('https://media.istockphoto.com/id/1460853312/photo/abstract-connected-dots-and-lines-concept-of-ai-technology-motion-of-digital-data-flow.jpg?b=1&s=612x612&w=0&k=20&c=x0QPuKC83SPVcM7Wx364nTusL776cWWPL23U8HmlCfw=')" }}
        />
  <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-white/30'}`} />
      </div>

  <motion.div className="fixed w-6 h-6 rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block" style={{ x: cursorXSpring, y: cursorYSpring, backgroundColor: isDark ? '#F48207' : '#F48207', opacity: 0.6, scale: isExploreHovered ? 1.5 : 1 }} transition={{ scale: { duration: 0.3 } }} />

      {cursorPoints.map((point, index) => (
  <motion.div key={point.id} className="fixed w-2 h-2 rounded-full pointer-events-none z-40 mix-blend-difference hidden md:block" style={{ x: point.x, y: point.y, backgroundColor: isDark ? '#F48207' : '#F48207', opacity: 0.15 * (index / cursorPoints.length), scale: 0.5 + index * 0.1 }} initial={{ opacity: 0.2 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }} />
      ))}

      <motion.div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-purple-400/10 pointer-events-none z-1" style={{ opacity, scale }} />
      <motion.div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent pointer-events-none z-1" style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]), scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.1]) }} />

      <motion.div className="absolute inset-0 opacity-[0.03] pointer-events-none z-1" style={{ y: bgY }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="url(#smallGrid)" />
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <motion.svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity: lineOpacity }}>
          <motion.line x1="0" y1="30" x2={lineWidth} y2="30" stroke={isDark ? '#F48207' : '#01203D'} strokeWidth="0.1" strokeDasharray="1 3" />
          <motion.line x1="100" y1="70" x2={invertedLineWidth} y2="70" stroke={isDark ? '#F48207' : '#01203D'} strokeWidth="0.1" strokeDasharray="1 3" />
        </motion.svg>
      </div>

      <motion.div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] z-0" style={{ x: ball1X, y: ball1Y }} />
      <motion.div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-400/20 rounded-full blur-[80px] z-0" style={{ x: ball2X, y: ball2Y }} />
      <motion.div className="absolute top-1/3 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-[60px] z-0" style={{ x: ball3X, y: ball3Y }} />
      <motion.div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-green-400/10 rounded-full blur-[70px] z-0" style={{ x: useTransform(mouseX, [0, 1], [10, -10]), y: useTransform(mouseY, [0, 1], [10, -10]) }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {Array.from({ length: 15 }, (_, i) => i).map((id) => (
          <motion.div key={id} className={`absolute rounded-full ${isDark ? 'bg-orange-400' : 'bg-gray-800'}`} style={{ width: `${(Math.random() * 4 + 2).toFixed(2)}px`, height: `${(Math.random() * 4 + 2).toFixed(2)}px`, left: `${(Math.random() * 100).toFixed(2)}%`, top: `${(Math.random() * 100).toFixed(2)}%`, opacity: 0.1 }} animate={{ y: ['0%', '-10%', '0%'] }} transition={{ duration: 10 + Math.random() * 10, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }} />
        ))}
      </div>

      <motion.div className="relative z-10 max-w-4xl text-center pt-24" style={{ y }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="relative mx-auto mb-8 w-28 h-28 flex items-center justify-center">
          <motion.div className={`absolute inset-0 rounded-full ${isDark ? 'border-orange-400/20' : 'border-gray-800/10'}`} style={{ borderWidth: '1px' }} animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }, scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } }} />
          <motion.div className={`absolute w-24 h-24 rounded-full border ${isDark ? 'border-orange-400/30' : 'border-gray-800/20'}`} animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }} />
          <motion.div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${isDark ? 'bg-[#1e293b]' : 'bg-gray-100'}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}>
            <img src='/assets/logo.jpg' alt='logo' className={`w-20 h-20 rounded-full ${isDark ? 'text-orange-400' : 'text-gray-800'}`} />
          </motion.div>
        </div>

        <div className="overflow-hidden mb-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold inline-flex">
            {title.split('').map((char, i) => (
              <motion.span key={i} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.05, duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }} className="inline-block relative">
                {char === ' ' ? '\u00A0' : char}
                <motion.span className={`absolute -bottom-1 left-0 w-full h-[2px] ${isDark ? 'bg-orange-400/50' : 'bg-gray-800/30'}`} initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9 + i * 0.05, duration: 0.4 }} />
              </motion.span>
            ))}
          </h1>
        </div>

  <motion.div className={`relative h-0.5 w-0 mx-10 mb-8 overflow-hidden ${isDark ? 'bg-orange-400/30' : 'bg-orange-400/30'}`} animate={{ width: '80%' }} transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}>
          <motion.div className={`absolute top-0 left-0 h-full ${isDark ? 'bg-orange-400' : 'bg-orange-400'}`} initial={{ width: '0%' }} animate={{ width: ['0%', '100%', '0%'] }} transition={{ delay: 1.3, duration: 2, times: [0, 0.5, 1], ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }} />
        </motion.div>

        <div className="relative mb-4">
    <motion.p className={`text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
            {tagline.split(' ').map((word, i) => (
              <motion.span key={i} className="inline-block mr-2 relative" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4 + i * 0.15, duration: 0.6, ease: 'easeOut' }}>
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>

  <motion.p className={`text-lg md:text-xl mb-10 ${isDark ? 'text-white/70' : 'text-gray-600'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.7 }}>
          {subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4, duration: 0.5 }} className="relative inline-block" onMouseEnter={() => setIsExploreHovered(true)} onMouseLeave={() => setIsExploreHovered(false)}>
          <motion.div className={`absolute inset-0 rounded-full blur-lg ${isDark ? 'bg-orange-500/20' : 'bg-gray-800/10'}`} animate={{ scale: isExploreHovered ? 1.1 : 1, opacity: isExploreHovered ? 0.6 : 0.3 }} transition={{ duration: 0.3 }} />
          <motion.button onClick={scrollToNextSection} className={`relative z-10 flex items-center px-8 py-4 rounded-full text-lg font-medium ${isDark ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-800 text-white hover:bg-gray-900'}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <span className="mr-2">Explore Our Work</span>
            <motion.div animate={{ x: isExploreHovered ? 5 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 2.8 }}>
  <motion.button onClick={scrollToNextSection} className={`flex flex-col items-center group ${isDark ? 'text-orange-400' : 'text-gray-700'}`} whileHover={{ y: -3 }}>
          <span className="text-sm mb-2 opacity-70 group-hover:opacity-100 transition-opacity tracking-wider">SCROLL</span>
          <motion.div className={`w-8 h-12 border-2 rounded-full ${isDark ? 'border-orange-400/30' : 'border-gray-700/30'} flex items-center justify-center overflow-hidden`}>
            <motion.div className={isDark ? 'bg-orange-400' : 'bg-gray-800'} style={{ width: 2, height: 6, borderRadius: 1 }} animate={{ y: [0, 20, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: 'loop', ease: 'easeInOut' }} />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
