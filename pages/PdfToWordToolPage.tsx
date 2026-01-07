
import React, { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Packer, Document, Paragraph } from 'docx';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import { ProcessStatus } from '../types';
import SEO from '../components/SEO';

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

const PdfToWordToolPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  
  const handleFileSelect = (selectedFile: File) => {
    resetState();
    if (selectedFile.type !== 'application/pdf') {
        setError("Invalid file type. Please upload a .pdf file.");
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
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        let fullText = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
            fullText += pageText + '\n\n';
        }
        
        const doc = new Document({
            sections: [{
                children: fullText.split('\n').map(text => new Paragraph(text)),
            }],
        });

        const blob = await Packer.toBlob(doc);
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const newFileName = file.name.replace(/\.pdf$/, '.docx');
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        setStatus(ProcessStatus.SUCCESS);
    } catch (err: any) {
        setError(err.message || 'An error occurred while converting the PDF file.');
        setStatus(ProcessStatus.ERROR);
    }
  };

  return (
    <>
      <SEO 
        title="PDF to Word Converter | convertai.life"
        description="Convert your PDF files into editable Microsoft Word (.docx) documents. Our tool extracts text for easy editing."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Convert PDF to WORD</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Extract text from your PDF into an editable Word document.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
          {status !== ProcessStatus.SUCCESS && !file && (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".pdf" label="PDF files only" />
          )}
          
          {error && <Alert type="error" message={error} />}

          {file && status !== ProcessStatus.SUCCESS && (
              <div className="text-center">
                   <div className="mb-4 bg-gray-100 dark:bg-dark-bg p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                           <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.172 2H4zm6 6a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 12a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{fileName}</span>
                      </div>
                      <button onClick={resetState} className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  {status === ProcessStatus.PROCESSING ? (
                      <div className="mt-6 text-center">
                          <ProgressBar progress={90} />
                          <p className="mt-3 text-gray-600 dark:text-gray-400">Extracting text and building document...</p>
                      </div>
                  ) : (
                      <button onClick={handleConvert} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                          Convert to WORD & Download
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
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your .docx file has been created and should be downloading now.</p>
              <button onClick={resetState} className="w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                  Convert Another File
              </button>
            </div>
          )}
           <div className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
              Note: This tool extracts text content. Complex layouts, tables, and images from the original PDF will not be preserved.
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfToWordToolPage;
