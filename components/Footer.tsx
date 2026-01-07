
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} convertai.life. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-light transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-light transition-colors">Contact</Link>
            <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-light transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
