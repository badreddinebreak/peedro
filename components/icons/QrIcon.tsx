
import React from 'react';

const QrIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
    <line x1="7" y1="7" x2="7" y2="7.01"></line>
    <line x1="17" y1="7" x2="17" y2="7.01"></line>
    <line x1="17" y1="17" x2="17" y2="17.01"></line>
    <line x1="7" y1="17" x2="7" y2="17.01"></line>
  </svg>
);

export default QrIcon;
