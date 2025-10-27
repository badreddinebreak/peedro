import React, { useState, useCallback } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { ProcessStatus } from '../types';
import ProgressBar from '../components/ProgressBar';
import Alert from '../components/Alert';
import SEO from '../components/SEO';

const ImageToPdfToolPage: React.FC = () => {
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
      // FIX: Explicitly type 'file' as File to resolve property 'type' does not exist error.
      const newFiles = Array.from(event.target.files).filter((file: File) => file.type.startsWith('image/'));
      if (newFiles.length !== event.target.files.length) {
        setError('Only image files are accepted.');
      } else {
        setError('');
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleConvert = async () => {
    if (files.length < 1) {
      setError('Please upload at least one image file.');
      setStatus(ProcessStatus.ERROR);
      return;
    }

    setStatus(ProcessStatus.PROCESSING);
    setError('');

    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        
        let image;
        if (file.type === 'image/jpeg') {
            image = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === 'image/png') {
            image = await pdfDoc.embedPng(imageBytes);
        } else {
            console.warn(`Unsupported image type: ${file.type}. Skipping this file.`);
            continue; // Or handle other types if pdf-lib supports them via another library
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'images-to-pdf.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setStatus(ProcessStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'An error occurred while converting images to PDF.');
      setStatus(ProcessStatus.ERROR);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event.dataTransfer.files) {
        // FIX: Explicitly type 'file' as File to resolve property 'type' does not exist error.
        const newFiles = Array.from(event.dataTransfer.files).filter((file: File) => file.type.startsWith('image/'));
        if (newFiles.length !== event.dataTransfer.files.length) {
            setError('Only image files (JPG, PNG) are accepted.');
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
        title="Image to PDF Converter | SmartDocs.AI"
        description="Convert your images (JPG, PNG) into a single PDF file. Perfect for creating documents from photos and scans."
      />
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Image to PDF Converter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Combine multiple JPG or PNG images into a single PDF document.</p>
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
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-primary-light">Click to upload</span> or drag and drop images
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, JPEG supported</p>
              </div>
              <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleFileChange}
              />
            </div>
            
            {error && <div className="mt-4"><Alert type="error" message={error} /></div>}

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Files to Convert ({files.length}):</h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <li key={index} className="bg-gray-100 dark:bg-dark-bg p-3 rounded-lg flex items-center justify-between animate-fade-in">
                        <div className="flex items-center space-x-3 text-sm">
                          <img src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 object-cover rounded" />
                          <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-4">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
                <button onClick={handleConvert} disabled={status === ProcessStatus.PROCESSING || files.length < 1} className="mt-6 w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {status === ProcessStatus.PROCESSING ? 'Converting...' : 'Convert to PDF'}
                </button>
              </div>
            )}
            {status === ProcessStatus.PROCESSING && <div className="mt-4"><ProgressBar progress={90} /></div>}

          </div>
          ) : (
            <div className="text-center animate-fade-in">
               <div className="mb-4 inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full">
                  <svg className="w-12 h-12 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">Conversion Successful!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your PDF has been created and the download should have started.</p>
              <button onClick={resetState} className="w-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                  Convert More Images
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageToPdfToolPage;