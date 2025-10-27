
import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | SmartDocs.AI"
        description="Read the privacy policy for SmartDocs.AI. We prioritize your security by processing files in-browser or deleting them immediately after AI processing."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-3d border border-gray-200 dark:border-dark-border space-y-6 prose prose-lg dark:prose-invert max-w-none">
          <p>
            Welcome to SmartDocs.AI. Your privacy is critically important to us. This Privacy Policy document outlines the types of information that is handled by our website and how we use it. Our core principle is to collect as little information as possible and to be transparent about our processes.
          </p>

          <h2 className="font-display">File Handling and Security</h2>
          <p>
            We have designed our systems with your privacy as the top priority.
          </p>
          <ul>
            <li>
              <strong>Client-Side Processing:</strong> Many of our tools, such as PDF merging, splitting, and some conversions, run entirely within your web browser. This means your files are never sent to our servers. They are processed locally on your own computer, ensuring maximum privacy and speed.
            </li>
            <li>
              <strong>Server-Side AI Processing:</strong> For our advanced AI features (e.g., Summarization, Translation, Background Removal), your file is securely uploaded to our servers to be processed by AI models (like Google's Gemini API). We want to be crystal clear about what happens to these files:
              <ul>
                  <li>Files are only stored in memory for the duration of the conversion or analysis process.</li>
                  <li><strong>We do not save, store, or log your files permanently.</strong> They are automatically and irrevocably deleted from our servers immediately after the process is complete.</li>
                  <li>We do not review, copy, or share your file content with any third parties, other than the direct API call to the AI provider for the requested task.</li>
              </ul>
            </li>
          </ul>
          
          <h2 className="font-display">Information We Collect</h2>
          <p>
              SmartDocs.AI does not require you to create an account or provide any personally identifiable information (PII) to use our tools. We do not collect your name, email address, or any other personal details.
          </p>
          
          <h2 className="font-display">Cookies and Analytics</h2>
          <p>
              We may use cookies for essential site functionality, such as remembering your preference for dark mode. We do not use third-party tracking cookies for advertising purposes. We may employ privacy-respecting analytics to understand website traffic and improve our services, but this data is anonymized and cannot be used to identify you personally.
          </p>

          <h2 className="font-display">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="font-display">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please feel free to contact us through our <a href="/#/contact" className="text-primary-light hover:underline">Contact Page</a>.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;