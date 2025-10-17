
import React from 'react';

const RemoveBgIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m2 12 5.25 5.25" />
    <path d="m12 2 5.25 5.25" />
    <path d="M2.75 18.25 12 9l9.25 9.25" />
    <path d="m18 12-5.25 5.25" />
    <path d="m12 22 5.25-5.25" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export default RemoveBgIcon;
