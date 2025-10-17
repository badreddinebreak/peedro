import React from 'react';

const EditImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 15 3.5-3.5a2.12 2.12 0 1 0-3-3L8.5 12" />
    <path d="M15 12 9 18" />
    <path d="M11.6 2.1 7 6.7" />
    <path d="m17.3 7.7 4.6-4.6" />
    <path d="M2 16.2c-2 2 1.2 5.2 3.2 3.2" />
    <path d="M7.8 20.8c2-2 5.2 1.2 3.2 3.2" />
    <path d="M16 2a3 3 0 0 0-3 3" />
  </svg>
);

export default EditImageIcon;