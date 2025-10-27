
import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import { ProcessStatus } from '../types';
import SEO from '../components/SEO';

const SplitPdfToolPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [totalPages, setTotalPages] = useState(0);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  
  const handleFileSelect = async (selectedFile: File) => {
    resetState();
    if (selectedFile.type !== 'application/pdf') {
        setError("Invalid file type. Please upload a .pdf file.");
        setStatus(ProcessStatus.ERROR);
        return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
    try {
        const pdfBytes = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        setTotalPages(pdfDoc.getPageCount());
        setStartPage('1');
        setEndPage(pdfDoc.getPageCount().toString());
    } catch (err) {
        setError("Could not read the PDF file. It may be corrupted.");
        setStatus(ProcessStatus.ERROR);
        setFile(null);
    }
  };
  
  const resetState = () => {
    setFile(null);
    setFileName('');
    setStatus(ProcessStatus.IDLE);
    setTotalPages(0);
    setStartPage('');
    setEndPage('');
    setError('');
  };

  const handleSplit = async () => {
    if (!file) return;

    const start = parseInt(startPage, 10);
    const end = parseInt(endPage, 10);

    if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
      setError(`Invalid page range. Please enter numbers between 1 and ${totalPages}.`);
      return;
    }
    setError('');
    setStatus(ProcessStatus.PROCESSING);

    try {
        const existingPdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newDoc = await PDFDocument.create();

        const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => i + start - 1);
        const copiedPages = await newDoc.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newDoc.addPage(page));

        const newPdfBytes = await newDoc.save();
        
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName.replace('.pdf', '')}-pages-${start}-${end}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setStatus(ProcessStatus.SUCCESS);
    } catch (err: any) {
        setError(err.message || 'An error occurred while splitting the PDF.');
        setStatus(ProcessStatus.ERROR);
    }
  };

  return (
    <>
      <SEO 
        title="Split PDF | SmartDocs.AI"
        description="Extract a range of pages or split a large PDF into multiple smaller files. A free and easy-to-use online PDF splitter."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Split PDF File</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Extract a range of pages from your PDF document.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
          {!file && (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".pdf" label="PDF files only" />
          )}

          {error && <Alert type="error" message={error} />}

          {file && (
              <div className="text-center">
                  <div className="mb-6 bg-gray-100 dark:bg-dark-bg p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                           <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.172 2H4zm6 6a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 12a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{fileName} ({totalPages} pages)</span>
                      </div>
                      <button onClick={resetState} className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  
                  {status !== ProcessStatus.SUCCESS && (
                      <div>
                          <div className="flex items-center justify-center gap-4 mb-6">
                              <div>
                                  <label htmlFor="startPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Page</label>
                                  <input type="number" id="startPage" value={startPage} onChange={e => setStartPage(e.target.value)} min="1" max={totalPages} className="w-full p-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-dark-border" />
                              </div>
                              <span className="mt-6 font-bold text-gray-500">-</span>
                              <div>
                                  <label htmlFor="endPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Page</label>
                                  <input type="number" id="endPage" value={endPage} onChange={e => setEndPage(e.target.value)} min="1" max={totalPages} className="w-full p-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-dark-border" />
                              </div>
                          </div>

                          {status === ProcessStatus.PROCESSING ? (
                              <div className="mt-6 text-center">
                                  <ProgressBar progress={90} />
                                  <p className="mt-3 text-gray-600 dark:text-gray-400">Splitting document...</p>
                              </div>
                          ) : (
                              <button onClick={handleSplit} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                                  Split PDF
                              </button>
                          )}
                      </div>
                  )}
              </div>
          )}
          
          {status === ProcessStatus.SUCCESS && (
            <div className="text-center animate-fade-in">
               <div className="mb-4 inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full">
                  <svg className="w-12 h-12 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">Split Successful!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your new PDF has been created and should be downloading now.</p>
              <button onClick={resetState} className="w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                  Split Another PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SplitPdfToolPage;