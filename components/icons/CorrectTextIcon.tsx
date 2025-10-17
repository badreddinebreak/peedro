import React from 'react';

const CorrectTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m2 12 5 5L17 7" />
    <path d="M20 12h-5" />
    <path d="M17.5 7H13" />
    <path d="m5 12-3 3" />
  </svg>
);

export default CorrectTextIcon;
