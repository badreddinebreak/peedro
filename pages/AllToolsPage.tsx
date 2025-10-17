import React from 'react';
import { tools } from '../data/tools';
import ToolCard from '../components/ToolCard';
import type { Tool } from '../types';

const AllToolsPage: React.FC = () => {
  const categories: Tool['category'][] = ['AI', 'Image', 'PDF', 'DOCX'];

  const groupedTools = categories.reduce((acc, category) => {
    acc[category] = tools.filter(tool => tool.category === category);
    return acc;
  }, {} as Record<Tool['category'], Tool[]>);

  return (
    <section className="space-y-12" id="tools">
      {categories.map(category => (
        groupedTools[category].length > 0 && (
          <div key={category}>
            <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white mb-6 border-b-2 border-primary-light pb-2 inline-block">
              {category} Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedTools[category].map(tool => (
                <ToolCard key={tool.path} tool={tool} />
              ))}
            </div>
          </div>
        )
      ))}
    </section>
  );
};

export default AllToolsPage;