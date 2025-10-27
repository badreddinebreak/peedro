import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import { translateText } from '../services/geminiService';
import { ProcessStatus } from '../types';
import SEO from '../components/SEO';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
];

const TranslateToolPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [translation, setTranslation] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [targetLang, setTargetLang] = useState('en');

  useEffect(() => {
    if (status === ProcessStatus.PROCESSING) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? 95 : prev + 5));
      }, 500);
      return () => clearInterval(interval);
    }
    if (status === ProcessStatus.SUCCESS) {
        setProgress(100);
    }
  }, [status]);

  const handleFileSelect = (selectedFile: File) => {
    resetState();
    if (selectedFile.type !== 'text/plain') {
        setError("Invalid file type. Please upload a .txt file.");
        setStatus(ProcessStatus.ERROR);
        return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };
  
  const resetState = () => {
    setFile(null);
    setFileName('');
    setStatus(ProcessStatus.IDLE);
    setProgress(0);
    setTranslation('');
    setError('');
  };

  const handleTranslate = async () => {
    if (!file) return;

    setStatus(ProcessStatus.PROCESSING);
    setProgress(10);
    setError('');
    setTranslation('');

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const textContent = event.target?.result as string;
            if (!textContent) {
                throw new Error("Could not read file content.");
            }
            setProgress(30);
            const result = await translateText(textContent, LANGUAGES.find(l => l.code === targetLang)?.name || 'English');
            setTranslation(result);
            setStatus(ProcessStatus.SUCCESS);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            setStatus(ProcessStatus.ERROR);
        } finally {
            setProgress(100);
        }
    };
    reader.onerror = () => {
        setError('Failed to read the file.');
        setStatus(ProcessStatus.ERROR);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <SEO 
        title="AI Document Translator | SmartDocs.AI"
        description="Translate your text documents into multiple languages like Spanish, French, German, and more with our free AI-powered translation tool."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">AI Document Translator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Upload a text file and choose a language to translate it.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-3d border border-gray-200 dark:border-dark-border">
          {!file && status !== ProcessStatus.SUCCESS && (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".txt" label="TEXT files only (.txt)" />
          )}

          {error && <Alert type="error" message={error} />}

          {file && (
              <div className="text-center">
                  <div className="mb-4 bg-gray-100 dark:bg-dark-bg p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{fileName}</span>
                      </div>
                      <button onClick={resetState} className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  {status === ProcessStatus.IDLE && (
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="w-full sm:w-1/3">
                              <label htmlFor="language" className="sr-only">Target Language</label>
                              <select 
                                  id="language"
                                  value={targetLang}
                                  onChange={(e) => setTargetLang(e.target.value)}
                                  className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-dark-bg dark:border-dark-border focus:ring-primary focus:border-primary"
                              >
                                  {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                              </select>
                          </div>
                          <button onClick={handleTranslate} className="w-full sm:w-2/3 bg-gradient-to-br from-primary-light to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 transform transition-all duration-150">
                              Translate Now
                          </button>
                      </div>
                  )}
              </div>
          )}

          {status === ProcessStatus.PROCESSING && (
            <div className="mt-6 text-center">
              <ProgressBar progress={progress} />
              <p className="mt-3 text-gray-600 dark:text-gray-400">AI is translating... please wait.</p>
            </div>
          )}
          
          {status === ProcessStatus.SUCCESS && (
            <div className="mt-8 animate-fade-in">
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">Your Translation:</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none p-6 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border whitespace-pre-wrap">
                <p>{translation}</p>
              </div>
              <button onClick={resetState} className="mt-6 w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                  Process Another File
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TranslateToolPage;