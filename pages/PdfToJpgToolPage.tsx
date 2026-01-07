
import React, { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import { ProcessStatus } from '../types';
import SEO from '../components/SEO';

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

const PdfToJpgToolPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [totalPages, setTotalPages] = useState(0);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

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
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);
    } catch (err: any) {
      setError("Could not read the PDF file. It may be corrupted or encrypted.");
      setStatus(ProcessStatus.ERROR);
      setFile(null);
    }
  };

  const resetState = () => {
    setFile(null);
    setFileName('');
    setStatus(ProcessStatus.IDLE);
    setTotalPages(0);
    setError('');
    setConvertedImages([]);
    setProgress(0);
  };

  const handleConvert = async () => {
    if (!file) return;

    setError('');
    setStatus(ProcessStatus.PROCESSING);
    setProgress(0);
    setConvertedImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const images: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg', 0.9)); // 90% quality
        }
        
        setProgress(Math.round((i / pdf.numPages) * 100));
      }
      setConvertedImages(images);
      setStatus(ProcessStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'An error occurred while converting the PDF.');
      setStatus(ProcessStatus.ERROR);
    }
  };

  const downloadImage = (imageUrl: string, pageNum: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${fileName.replace('.pdf', '')}-page-${pageNum}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <SEO 
        title="PDF to JPG Converter | convertai.life"
        description="Convert each page of your PDF file into a high-quality JPG image. Free, fast, and no watermarks."
      />
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">PDF to JPG Converter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Convert every page of your PDF into a high-quality JPG image.</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
          {!file && (
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".pdf" label="PDF files only" />
          )}

          {error && <Alert type="error" message={error} />}

          {file && (
            <div className="text-center">
              {status !== ProcessStatus.SUCCESS && (
                <>
                  <div className="mb-6 bg-gray-100 dark:bg-dark-bg p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.172 2H4zm6 6a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 12a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{fileName} ({totalPages} pages)</span>
                    </div>
                    <button onClick={resetState} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  {status === ProcessStatus.PROCESSING ? (
                    <div className="mt-6 text-center">
                      <ProgressBar progress={progress} />
                      <p className="mt-3 text-gray-600 dark:text-gray-400">Converting page {Math.ceil(progress/100 * totalPages)} of {totalPages}...</p>
                    </div>
                  ) : (
                    <button onClick={handleConvert} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                      Convert to JPG
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {status === ProcessStatus.SUCCESS && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4 text-center">Conversion Successful!</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                {convertedImages.map((imageSrc, index) => (
                  <div key={index} className="group relative border dark:border-dark-border rounded-lg shadow-sm">
                    <img src={imageSrc} alt={`Page ${index + 1}`} className="w-full h-auto rounded-lg" />
                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
                        <button onClick={() => downloadImage(imageSrc, index + 1)} className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg transform group-hover:scale-100 scale-90 transition-all duration-300">
                          Download
                        </button>
                      </div>
                  </div>
                ))}
              </div>
              <button onClick={resetState} className="mt-6 w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                Convert Another PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PdfToJpgToolPage;
