import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About ConvertAI.life | Our Mission & Technology"
        description="Learn about ConvertAI.life's mission to provide free, secure, and AI-powered file processing tools for everyone."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary">ConvertAI.life</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Rethinking Document Workflow with Artificial Intelligence.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-3d border border-gray-200 dark:border-dark-border space-y-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-primary-light mb-3">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At ConvertAI.life, our mission is to simplify the way people interact with their digital files. We believe that powerful document and image processing tools should be accessible to everyone—for free. By harnessing the power of cutting-edge artificial intelligence, we provide fast, secure, and intuitive solutions that streamline your workflow and unlock new possibilities for your documents.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-primary-light mb-3">Our Technology</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              ConvertAI.life is built on a foundation of modern, privacy-focused technology. Many of our tools, like PDF merging and splitting, run directly in your browser. This means your files are never uploaded to a server, offering unparalleled speed and security. For our advanced AI features, we utilize powerful models like Google's Gemini to deliver intelligent summarization, translation, and image editing capabilities, ensuring your files are processed securely and deleted immediately after.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-primary-light mb-3">Our Commitment to You</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your trust is our top priority. We are committed to providing a seamless user experience without compromising your privacy. We will never store your files, sell your data, or require you to sign up for an account. ConvertAI.life is designed to be a simple, effective, and trustworthy resource for all your file conversion needs.
            </p>
          </div>

          <div className="text-center pt-4">
             <Link
              to="/#tools"
              className="inline-block bg-gradient-to-br from-primary-light to-secondary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 transform transition-all duration-150"
            >
              Explore Our Tools
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;