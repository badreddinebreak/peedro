
import React from 'react';

const ImageToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
    <path d="M15 2H6a2 2 0 0 0-2 2v2h10v12h2a2 2 0 0 0 2-2V8z"></path>
  </svg>
);

export default ImageToPdfIcon;