import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import SearchModal from '../ui/SearchModal';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection('');
      return;
    }

    const sectionIds = ['home', 'about', 'works', 'blog-section', 'contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(el => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -20% 0px', // Highlights the section when it's in the central 60% of the viewport
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section as Element));

    // On initial load, if there's no hash, set home as active
    if (!location.hash) {
      setActiveSection('home');
    }

    return () => {
      sections.forEach(section => observer.unobserve(section as Element));
    };
  }, [isHomePage, location.key]);


  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  // キーボードショートカット (Ctrl+K / Cmd+K) で検索を開く
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string => {
    const isBlogSectionActive = isHomePage && activeSection === 'blog-section';
    return `block py-2 px-3 text-lg transition duration-300 ${
      isActive || isBlogSectionActive ? 'text-accent-blue font-bold' : 'text-main-text dark:text-gray-100 hover:text-accent-pink'
    }`;
  };

  const anchorLinkClasses = (sectionId: string): string => {
    const isActive = isHomePage && activeSection === sectionId;
    return `block py-2 px-3 text-lg transition duration-300 ${isActive ? 'text-accent-blue font-bold' : 'text-main-text dark:text-gray-100 hover:text-accent-pink'}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-off-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold font-serif text-main-text dark:text-gray-100 hover:text-accent-blue transition duration-300">
              Mohiro
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <div className="flex items-baseline space-x-4">
                <Link to="/#home" className={anchorLinkClasses('home')}>Home</Link>
                <Link to="/#about" className={anchorLinkClasses('about')}>About</Link>
                <Link to="/#works" className={anchorLinkClasses('works')}>Works</Link>
                <NavLink to="/blog" className={navLinkClasses}>Blog</NavLink>
                <Link to="/#contact" className={anchorLinkClasses('contact')}>Contact</Link>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300"
                  aria-label="検索"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300"
              aria-label="検索"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-main-text hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <Link to="/#home" className={anchorLinkClasses('home')} onClick={handleMobileLinkClick}>Home</Link>
            <Link to="/#about" className={anchorLinkClasses('about')} onClick={handleMobileLinkClick}>About</Link>
            <Link to="/#works" className={anchorLinkClasses('works')} onClick={handleMobileLinkClick}>Works</Link>
            <NavLink to="/blog" className={navLinkClasses} onClick={handleMobileLinkClick}>Blog</NavLink>
            <Link to="/#contact" className={anchorLinkClasses('contact')} onClick={handleMobileLinkClick}>Contact</Link>
          </div>
        </div>
      )}

      {/* 検索モーダル */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;