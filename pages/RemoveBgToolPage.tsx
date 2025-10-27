
import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import { removeBackground } from '../services/geminiService';
import { ProcessStatus } from '../types';
import SEO from '../components/SEO';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });

const RemoveBgToolPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    if (status === ProcessStatus.PROCESSING) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? 95 : prev + 5));
      }, 800); // Slower for image processing feel
      return () => clearInterval(interval);
    }
     if (status === ProcessStatus.SUCCESS) {
        setProgress(100);
    }
  }, [status]);

  const handleFileSelect = (selectedFile: File) => {
    resetState();
    if (!selectedFile.type.startsWith('image/')) {
        setError("Invalid file type. Please upload an image file (PNG, JPG, etc.).");
        setStatus(ProcessStatus.ERROR);
        return;
    }
    setFile(selectedFile);
    setOriginalImage(URL.createObjectURL(selectedFile));
  };
  
  const resetState = () => {
    setFile(null);
    if (originalImage) URL.revokeObjectURL(originalImage);
    setOriginalImage('');
    setProcessedImage('');
    setStatus(ProcessStatus.IDLE);
    setProgress(0);
    setError('');
  };

  const handleRemoveBg = async () => {
    if (!file) return;

    setStatus(ProcessStatus.PROCESSING);
    setProgress(10);
    setError('');
    setProcessedImage('');

    try {
        const base64Data = await fileToBase64(file);
        setProgress(40);
        const resultBase64 = await removeBackground(base64Data, file.type);
        setProcessedImage(`data:image/png;base64,${resultBase64}`);
        setStatus(ProcessStatus.SUCCESS);
    } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setStatus(ProcessStatus.ERROR);
    } finally {
        setProgress(100);
    }
  };
  
  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    const originalName = file?.name.split('.').slice(0, -1).join('.') || 'image';
    link.download = `${originalName}-no-bg.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <SEO 
        title="AI Background Remover | SmartDocs.AI"
        description="Automatically remove the background from any image with a single click. Our AI tool provides a transparent background for your photos, free and fast."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">AI Background Remover</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Upload an image to automatically remove its background.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
          {!file && status !== ProcessStatus.SUCCESS && (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes="image/*" label="PNG, JPG, WEBP, etc." />
          )}

          {error && <Alert type="error" message={error} />}

          {file && status !== ProcessStatus.SUCCESS && status !== ProcessStatus.PROCESSING && (
              <div className="text-center">
                  <img src={originalImage} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
                  <button onClick={handleRemoveBg} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                      Remove Background
                  </button>
              </div>
          )}

          {status === ProcessStatus.PROCESSING && (
            <div className="mt-6 text-center">
              <ProgressBar progress={progress} />
              <p className="mt-3 text-gray-600 dark:text-gray-400">AI is analyzing the image... this may take a moment.</p>
            </div>
          )}
          
          {status === ProcessStatus.SUCCESS && (
            <div className="mt-8 animate-fade-in text-center">
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">Here's your image!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <h3 className="text-lg font-semibold mb-2">Original</h3>
                      <img src={originalImage} alt="Original" className="w-full rounded-lg shadow-md" />
                  </div>
                   <div>
                      <h3 className="text-lg font-semibold mb-2">Background Removed</h3>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2" style={{ backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }}>
                          <img src={processedImage} alt="Background removed" className="w-full rounded-lg shadow-md" />
                      </div>
                  </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                   <button onClick={downloadImage} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                      Download Image
                  </button>
                  <button onClick={resetState} className="w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                      Process Another Image
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RemoveBgToolPage;