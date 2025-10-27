
import React from 'react';

const PdfToJpgIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <circle cx="10" cy="15" r="2" />
    <path d="m20 13-1.09-1.09a2 2 0 0 0-2.82 0L10 18" />
  </svg>
);

export default PdfToJpgIcon;