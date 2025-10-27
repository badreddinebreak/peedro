
import React, { useState } from 'react';
import * as mammoth from 'mammoth';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import { ProcessStatus } from '../types';
import SEO from '../components/SEO';

const ConvertDocxToolPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  
  const handleFileSelect = (selectedFile: File) => {
    resetState();
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Please upload a .docx file.");
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
    setError('');
  };

  const handleConvert = async () => {
    if (!file) return;

    setStatus(ProcessStatus.PROCESSING);
    setError('');
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const { value: textContent } = await mammoth.extractRawText({ arrayBuffer });
        
        const blob = new Blob([textContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const newFileName = file.name.replace(/\.docx?$/, '.txt');
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        setStatus(ProcessStatus.SUCCESS);
    } catch (err: any) {
        setError(err.message || 'An error occurred while converting the DOCX file.');
        setStatus(ProcessStatus.ERROR);
    }
  };

  return (
    <>
      <SEO 
        title="DOCX to Text Converter | SmartDocs.AI"
        description="Easily extract plain text from Microsoft Word (.docx) documents. Free, fast, and secure online converter."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Convert DOCX to Text</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Easily extract plain text from your Word documents.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
          {status !== ProcessStatus.SUCCESS && !file && (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" label="DOCX files only" />
          )}
          
          {error && <Alert type="error" message={error} />}

          {file && status !== ProcessStatus.SUCCESS && (
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
                  {status === ProcessStatus.PROCESSING ? (
                      <div className="mt-6 text-center">
                          <ProgressBar progress={90} />
                          <p className="mt-3 text-gray-600 dark:text-gray-400">Converting document...</p>
                      </div>
                  ) : (
                      <button onClick={handleConvert} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                          Convert to Text & Download
                      </button>
                  )}
              </div>
          )}
          
          {status === ProcessStatus.SUCCESS && (
            <div className="text-center animate-fade-in">
               <div className="mb-4 inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full">
                  <svg className="w-12 h-12 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">Conversion Successful!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your .txt file has been created and should be downloading now.</p>
              <button onClick={resetState} className="w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                  Convert Another File
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConvertDocxToolPage;