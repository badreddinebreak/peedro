
import React from 'react';
import { Link } from 'react-router-dom';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { title, description, Icon, path, color, isComingSoon } = tool;

  const cardContent = (
      <>
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg shadow-lg`} style={{ backgroundColor: color, color: 'white' }}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
          </div>
        </div>
      </>
  );

  const cardClasses = "relative group block p-6 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl shadow-3d border border-gray-200 dark:border-dark-border transition-all duration-300";

  if (isComingSoon) {
      return (
          <div className={`${cardClasses} opacity-60 cursor-not-allowed`}>
              <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  SOON
              </div>
              {cardContent}
          </div>
      );
  }

  return (
    <div style={{ perspective: '1000px' }}>
      <Link 
        to={path}
        aria-label={`Learn more about the ${title} tool`}
        className={`${cardClasses} hover:shadow-3d-hover hover:-translate-y-2 [transform-style:preserve-3d]`}
      >
        <div className="[transform:translateZ(20px)] transition-transform duration-300 group-hover:[transform:translateZ(40px)]">
            {cardContent}
        </div>
      </Link>
    </div>
  );
};

export default ToolCard;