import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const response = await fetch('https://nordic-backend-production.up.railway.app/api/subscribe', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      let data: unknown;
      try { data = await response.json(); } catch { throw new Error('Invalid response from server'); }
      if (response.ok) {
        setStatus('success');
        setMessage((data as { message?: string }).message || 'Successfully subscribed to newsletter!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage((data as { error?: string })?.error || 'Failed to subscribe. Please try again.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
    setTimeout(() => { setStatus('idle'); setMessage(''); }, 5000);
  };

  return (
    <footer id="contact" className={isDark ? 'bg-[#001f3f] text-white' : 'bg-gray-800 text-white'}>
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-orange-400' : 'text-green-600'}`}>Nordic ICT</h3>
            <p className="mb-4 opacity-80">Bridging Ethiopia's Digital Future Through Innovation and Inclusion.</p>
            <div className="space-y-2">
              <div className="flex items-center"><Mail size={16} className="mr-2" />
                <a href="mailto:contact@nordicict.com" className={`group relative inline-block opacity-80 hover:opacity-100 transition-opacity ${isDark ? 'hover:text-orange-300' : 'hover:text-green-500'}`}>
                  <span>contact@nordicict.com</span>
                  <span className={`absolute left-0 -bottom-0.5 h-[1px] w-0 transition-all duration-300 group-hover:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                </a>
              </div>
              <div className="flex items-center"><Phone size={16} className="mr-2" />
                <a href="tel:+251925818585" className={`group relative inline-block opacity-80 hover:opacity-100 transition-opacity ${isDark ? 'hover:text-orange-300' : 'hover:text-green-500'}`}>
                  <span>+251 925 818 585</span>
                  <span className={`absolute left-0 -bottom-0.5 h-[1px] w-0 transition-all duration-300 group-hover:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                </a>
              </div>
              <div className="flex items-center"><MapPin size={16} className="mr-2" />
                <a href="https://maps.app.goo.gl/Mvw552jWQZj7jG7N9" target="_blank" rel="noopener noreferrer" className={`group relative inline-block opacity-80 hover:opacity-100 transition-opacity ${isDark ? 'hover:text-orange-300' : 'hover:text-green-500'}`}>
                  <span>Bole Bulbula, Woreda 12, Addis Ababa, Ethiopia</span>
                  <span className={`absolute left-0 -bottom-0.5 h-[1px] w-0 transition-all duration-300 group-hover:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-orange-400' : 'text-green-600'}`}>Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '#services', label: 'Our Services' },
                { href: '#about', label: 'About Us' },
                { href: '#news', label: 'Latest Updates' },
                { href: '#partners', label: 'Our Partners' },
                { href: '#projects', label: 'Current Projects' },
                { href: '#services', label: 'Careers' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={`group relative inline-block opacity-80 hover:opacity-100 transition-opacity ${isDark ? 'hover:text-orange-300' : 'hover:text-green-500'}`}>
                    {link.label}
                    <span className={`absolute left-0 -bottom-0.5 h-[1px] w-0 transition-all duration-300 group-hover:w-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-orange-400' : 'text-green-600'}`}>Subscribe to Our Newsletter</h3>
            <p className="mb-4 opacity-80">Stay updated with our latest news, events, and initiatives.</p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
              <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className={`px-4 py-3 rounded-lg flex-grow ${isDark ? 'bg-black border border-gray-800 text-orange-400' : 'bg-gray-700 border border-gray-600 text-white'} focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-orange-500' : 'focus:ring-white'}`} required />
              <div className="flex flex-col sm:flex-row gap-2">
                <button type="submit" disabled={status === 'loading'} className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''} ${isDark ? 'bg-orange-500 text-white hover:bg-orange-600 glow-on-hover-dark' : 'bg-green-400 text-gray-800 hover:bg-green-600 glow-on-hover-light'}`}>
                  {status === 'loading' ? (<div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent" />) : (<>Subscribe<ArrowRight size={16} className="ml-2" /></>)}
                </button>
                <button type="button" onClick={async () => {
                  if (!email) { setStatus('error'); setMessage('Please enter your email address'); return; }
                  setStatus('loading');
                  try {
                    const response = await fetch('https://nordic-backend-production.up.railway.app/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim() }) });
                    const data = await response.json();
                    if (response.ok) { setStatus('success'); setMessage('Successfully unsubscribed from newsletter'); setEmail(''); }
                    else { setStatus('error'); setMessage(data.error || 'Failed to unsubscribe'); }
                  } catch {
                    setStatus('error'); setMessage('Network error. Please try again');
                  }
                  setTimeout(() => { setStatus('idle'); setMessage(''); }, 5000);
                }} className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''} ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-600 text-white hover:bg-gray-500'}`} disabled={status === 'loading'}>
                  Unsubscribe
                </button>
              </div>
            </form>

            {(status === 'success' || status === 'error') && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${status === 'success' ? (isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') : (isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')}`}>
                {status === 'success' ? (<CheckCircle className="w-5 h-5 flex-shrink-0" />) : (<XCircle className="w-5 h-5 flex-shrink-0" />)}
                <p className="text-sm">{message}</p>
              </motion.div>
            )}

            <div className="mt-8">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                  <a key={idx} href="#" aria-label="social" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-black hover:bg-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center opacity-80 text-sm">
          <p>&copy; {new Date().getFullYear()} Nordic ICT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
