
import React from 'react';
import { Link } from 'react-router-dom';

interface ComingSoonPageProps {
  toolName: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ toolName }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in">
      <div className="bg-white dark:bg-dark-card p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-dark-border">
        <h1 className="text-4xl font-display font-bold text-primary-light mb-2">{toolName}</h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Coming Soon!</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
          We're working hard to bring this feature to you. Our AI is learning new tricks and this tool will be available shortly.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Back to Tools
        </Link>
      </div>
    </div>
  );
};

export default ComingSoonPage;