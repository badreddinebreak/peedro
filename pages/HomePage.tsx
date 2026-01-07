
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AllToolsPage from './AllToolsPage';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we were navigated here with a state telling us to scroll
    if (location.state?.scrollToTools) {
      const toolsElement = document.getElementById('tools');
      if (toolsElement) {
        toolsElement.scrollIntoView({ behavior: 'smooth' });
      }
      // Clean up the state so it doesn't re-trigger on refresh/back navigation
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleScrollToTools = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const toolsElement = document.getElementById('tools');
    if (toolsElement) {
      toolsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO 
        title="convertai.life | Free AI-Powered Document Processing Tools"
        description="A suite of free, modern, and intelligent tools to convert, process, and enhance your files. Merge PDFs, remove backgrounds from images, summarize documents with AI, and more."
      />
      <div className="animate-fade-in">
        {/* Hero Section */}
        <div className="relative -mx-4 -mt-8 md:-mt-12 mb-16 text-center overflow-hidden shadow-2xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 w-auto min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 z-0"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230C111D'/%3E%3C/svg%3E"
          >
            <source src="https://cdn.coverr.co/videos/coverr-abstract-digital-grid-in-motion-5100/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="relative z-20 py-24 md:py-32 px-4">
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight drop-shadow-lg">
              Intelligent Document Processing
              <br />
              Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-sky-400">AI</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
              Transform your documents with our free, secure, and AI-powered tools. Summarize, translate, edit, and convert with ease.
            </p>
            <div className="mt-8">
              <a 
                href="#tools" 
                onClick={handleScrollToTools}
                className="inline-block bg-gradient-to-br from-primary-light to-secondary text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 transform transition-all duration-150 text-lg"
              >
                Explore Tools
              </a>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <AllToolsPage />
      </div>
    </>
  );
};

export default HomePage;
