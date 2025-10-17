import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import { editImage } from '../services/geminiService';
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

const EditImageToolPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
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
    setPrompt('');
    setStatus(ProcessStatus.IDLE);
    setProgress(0);
    setError('');
  };

  const handleEdit = async () => {
    if (!file || !prompt.trim()) {
        setError("Please provide an image and describe the edit you want to make.");
        return;
    };

    setStatus(ProcessStatus.PROCESSING);
    setProgress(10);
    setError('');
    setProcessedImage('');

    try {
        const base64Data = await fileToBase64(file);
        setProgress(40);
        const resultBase64 = await editImage(base64Data, file.type, prompt);
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
    link.download = `${originalName}-edited.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <SEO 
        title="AI Image Editor | Edit Photos with Text Prompts"
        description="Describe the edits you want, and our AI will do the magic. Edit images online by adding objects, changing styles, and more with simple text commands."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">AI Image Editor</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Describe the changes you want, and let AI do the magic.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
          {!file && status !== ProcessStatus.SUCCESS && (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes="image/*" label="PNG, JPG, WEBP, etc." />
          )}

          {error && <Alert type="error" message={error} />}

          {file && status !== ProcessStatus.SUCCESS && status !== ProcessStatus.PROCESSING && (
              <div className="text-center">
                  <img src={originalImage} alt="Preview" className="max-h-80 mx-auto rounded-lg mb-4 shadow-md" />
                  <div className="my-4">
                      <label htmlFor="prompt" className="sr-only">Editing Instructions</label>
                      <input 
                          type="text"
                          id="prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="e.g., 'Add a birthday hat on the cat'"
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-dark-bg dark:border-dark-border focus:ring-primary focus:border-primary"
                      />
                  </div>
                  <button onClick={handleEdit} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                      Edit with AI
                  </button>
              </div>
          )}

          {status === ProcessStatus.PROCESSING && (
            <div className="mt-6 text-center">
              <ProgressBar progress={progress} />
              <p className="mt-3 text-gray-600 dark:text-gray-400">AI is working its magic... this may take a moment.</p>
            </div>
          )}
          
          {status === ProcessStatus.SUCCESS && (
            <div className="mt-8 animate-fade-in text-center">
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">Edit Complete!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <h3 className="text-lg font-semibold mb-2">Original</h3>
                      <img src={originalImage} alt="Original" className="w-full rounded-lg shadow-md" />
                  </div>
                   <div>
                      <h3 className="text-lg font-semibold mb-2">Edited</h3>
                      <img src={processedImage} alt="Edited by AI" className="w-full rounded-lg shadow-md" />
                  </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                   <button onClick={downloadImage} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                      Download Edited Image
                  </button>
                  <button onClick={resetState} className="w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                      Edit Another Image
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditImageToolPage;