
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleToolsClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    
    // If we're already on the homepage, just scroll
    if (location.pathname === '/') {
      const toolsElement = document.getElementById('tools');
      if (toolsElement) {
        toolsElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to the homepage first,
      // and pass state to tell the page to scroll after loading.
      navigate('/', { state: { scrollToTools: true } });
    }
  };

  return (
    <header className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-dark-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-display font-bold">
            <span className="text-gray-900 dark:text-white">SmartDocs</span>
            <span className="text-primary-light">.AI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/#tools" onClick={handleToolsClick} className="text-gray-600 dark:text-gray-300 hover:text-primary-light transition-colors cursor-pointer">Tools</a>
              <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-light transition-colors">About</Link>
              <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary-light transition-colors">Contact</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;