import React, { useState } from 'react';
import * as mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import { ProcessStatus } from '../types';
import SEO from '../components/SEO';

const WordToPdfToolPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    resetState();
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
      const { value: htmlContent } = await mammoth.convertToHtml({ arrayBuffer });

      // Create a hidden element to render the HTML for conversion
      const renderContainer = document.createElement('div');
      renderContainer.innerHTML = htmlContent;
      // A4 paper size in pixels at 96 DPI: 794x1123. We give it a fixed width.
      Object.assign(renderContainer.style, {
        position: 'fixed',
        top: '-9999px',
        left: '0',
        width: '794px',
        padding: '20px',
        backgroundColor: 'white',
        color: 'black',
      });
      document.body.appendChild(renderContainer);
      
      const canvas = await html2canvas(renderContainer, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
      });

      document.body.removeChild(renderContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const imgHeight = canvasHeight / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      const newFileName = file.name.replace(/\.docx?$/, '.pdf');
      pdf.save(newFileName);

      setStatus(ProcessStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while converting the DOCX file.');
      setStatus(ProcessStatus.ERROR);
    }
  };

  return (
    <>
      <SEO 
        title="Convert Word to PDF Free Online | DOCX to PDF"
        description="Convert your Microsoft Word documents (.docx) to high-quality PDF files for free. Fast, secure, and maintains formatting."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Convert WORD to PDF</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Easily convert your .docx files to professional PDFs.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
          {status !== ProcessStatus.SUCCESS && !file && (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" label="DOCX files only" />
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
                          <p className="mt-3 text-gray-600 dark:text-gray-400">Converting document... this can take a moment.</p>
                      </div>
                  ) : (
                      <button onClick={handleConvert} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                          Convert to PDF & Download
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
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your PDF file has been created and should be downloading now.</p>
              <button onClick={resetState} className="w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                  Convert Another File
              </button>
            </div>
          )}
           <div className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
              Note: Conversion is powered by an in-browser engine. Complex layouts and formatting may vary from the original document.
          </div>
        </div>
      </div>
    </>
  );
};

export default WordToPdfToolPage;