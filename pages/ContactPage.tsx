import React, { useState } from 'react';
import Alert from '../components/Alert';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle form submission here (e.g., API call)
    // For this demo, we'll just simulate a success response.
    if (name && email && message) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
    } else {
        setStatus('error');
    }
  };


  return (
    <>
      <SEO
        title="Contact Us | ConvertAI.life"
        description="Have a question, feedback, or suggestion? Get in touch with the ConvertAI.life team. We'd love to hear from you."
      />
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-3d border border-gray-200 dark:border-dark-border">
          {status === 'success' && <Alert type="success" message="Thank you for your message! We'll get back to you soon." />}
          {status === 'error' && <Alert type="error" message="Please fill out all fields before submitting." />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-dark-bg dark:border-dark-border focus:ring-primary focus:border-primary transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-dark-bg dark:border-dark-border focus:ring-primary focus:border-primary transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-dark-bg dark:border-dark-border focus:ring-primary focus:border-primary transition-colors"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-br from-primary-light to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 transform transition-all duration-150"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;