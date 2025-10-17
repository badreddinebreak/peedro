import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ProcessStatus } from '../types';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import SEO from '../components/SEO';

const MergePdfToolPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [error, setError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  const resetState = () => {
    setFiles([]);
    setStatus(ProcessStatus.IDLE);
    setError('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).filter(file => file.type === 'application/pdf');
      if (newFiles.length !== event.target.files.length) {
        setError('Only PDF files are accepted.');
      } else {
        setError('');
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please upload at least two PDF files to merge.');
      setStatus(ProcessStatus.ERROR);
      return;
    }

    setStatus(ProcessStatus.PROCESSING);
    setError('');

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setStatus(ProcessStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'An error occurred while merging PDFs.');
      setStatus(ProcessStatus.ERROR);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event.dataTransfer.files) {
        const newFiles = Array.from(event.dataTransfer.files).filter(file => file.type === 'application/pdf');
        if (newFiles.length !== event.dataTransfer.files.length) {
            setError('Only PDF files are accepted.');
        } else {
            setError('');
        }
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  return (
    <>
      <SEO 
        title="Merge PDF Files Free Online | Combine Multiple PDFs"
        description="Easily combine multiple PDF documents into one single file. Our free PDF merger is fast, secure, and runs in your browser."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Merge PDF Files</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Combine multiple PDFs into a single, unified document.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
          {status !== ProcessStatus.SUCCESS ? (
          <div>
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300 ${isDragOver ? 'border-primary-light bg-indigo-50 dark:bg-primary-dark/10' : 'border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-gray-500'}`}
            >
              <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-primary-light">Click to upload</span> or drag and drop PDFs
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Add two or more files</p>
              </div>
              <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
              />
            </div>
            
            {error && <div className="mt-4"><Alert type="error" message={error} /></div>}

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Files to Merge ({files.length}):</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="bg-gray-100 dark:bg-dark-bg p-3 rounded-lg flex items-center justify-between animate-fade-in">
                        <div className="flex items-center space-x-3 text-sm">
                           <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.172 2H4zm6 6a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 12a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
                <button onClick={handleMerge} disabled={status === ProcessStatus.PROCESSING || files.length < 2} className="mt-6 w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {status === ProcessStatus.PROCESSING ? 'Merging...' : 'Merge PDFs'}
                </button>
              </div>
            )}
            {status === ProcessStatus.PROCESSING && <ProgressBar progress={90} />}

          </div>
          ) : (
            <div className="text-center animate-fade-in">
               <div className="mb-4 inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full">
                  <svg className="w-12 h-12 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">Merge Successful!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your document has been created and the download should have started.</p>
              <button onClick={resetState} className="w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                  Merge More PDFs
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MergePdfToolPage;