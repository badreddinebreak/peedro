
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes: string;
  label: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, acceptedFileTypes, label }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileSelect(event.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

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
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`relative rounded-lg p-12 text-center transition-all duration-300 bg-gray-50 dark:bg-dark-bg shadow-inner-3d ${isDragOver ? 'ring-2 ring-primary-light' : ''}`}
    >
      <div className="flex flex-col items-center">
        <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-primary-light">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{label}</p>
      </div>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;