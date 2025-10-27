// FIX: Import React to resolve 'React' namespace errors.
import React from 'react';

export interface Tool {
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
  category: 'PDF' | 'DOCX' | 'Image' | 'AI';
  color: string;
  isComingSoon?: boolean;
}

export enum ProcessStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}