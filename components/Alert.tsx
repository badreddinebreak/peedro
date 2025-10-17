
import React from 'react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const baseClasses = "p-4 mb-4 text-sm rounded-lg animate-fade-in";
  const typeClasses = {
    success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    error: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span className="font-medium">{type === 'success' ? 'Success!' : 'Error!'}</span> {message}
    </div>
  );
};

export default Alert;
