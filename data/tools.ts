import type { Tool } from '../types';
import MergeIcon from '../components/icons/MergeIcon';
import SplitIcon from '../components/icons/SplitIcon';
import CompressIcon from '../components/icons/CompressIcon';
import SummarizeIcon from '../components/icons/SummarizeIcon';
import TranslateIcon from '../components/icons/TranslateIcon';
import RemoveBgIcon from '../components/icons/RemoveBgIcon';
import DocxToTextIcon from '../components/icons/DocxToTextIcon';
import ImageToPdfIcon from '../components/icons/ImageToPdfIcon';
import EditImageIcon from '../components/icons/EditImageIcon';
import CorrectTextIcon from '../components/icons/CorrectTextIcon';
import PdfToJpgIcon from '../components/icons/PdfToJpgIcon';
import WordToPdfIcon from '../components/icons/WordToPdfIcon';
import PdfToWordIcon from '../components/icons/PdfToWordIcon';
import PdfToExcelIcon from '../components/icons/PdfToExcelIcon';
import ExcelToPdfIcon from '../components/icons/ExcelToPdfIcon';

export const tools: Tool[] = [
  // AI Tools
  {
    title: 'Summarize Document',
    description: 'Use AI to get a quick summary of any text file.',
    Icon: SummarizeIcon,
    path: '/summarize',
    category: 'AI',
    color: '#6366F1',
  },
  {
    title: 'Translate Document',
    description: 'Translate text files into different languages.',
    Icon: TranslateIcon,
    path: '/translate',
    category: 'AI',
    color: '#EC4899',
  },
  {
    title: 'Correct Grammar',
    description: 'Fix spelling and grammar mistakes in your text.',
    Icon: CorrectTextIcon,
    path: '/correct-text',
    category: 'AI',
    color: '#10B981',
  },
  // Image Tools
  {
    title: 'Remove Background',
    description: 'Automatically remove the background from an image.',
    Icon: RemoveBgIcon,
    path: '/remove-background',
    category: 'Image',
    color: '#F59E0B',
  },
  {
    title: 'Edit Image with AI',
    description: 'Describe the edits you want and let AI apply them.',
    Icon: EditImageIcon,
    path: '/edit-image',
    category: 'Image',
    color: '#3B82F6',
  },
  {
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, and other images to PDF.',
    Icon: ImageToPdfIcon,
    path: '/image-to-pdf',
    category: 'Image',
    color: '#8B5CF6',
  },
  // PDF Tools
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one single document.',
    Icon: MergeIcon,
    path: '/merge-pdf',
    category: 'PDF',
    color: '#EF4444',
  },
  {
    title: 'Split PDF',
    description: 'Extract specific pages from a PDF file.',
    Icon: SplitIcon,
    path: '/split-pdf',
    category: 'PDF',
    color: '#0EA5E9',
  },
  {
    title: 'PDF to JPG',
    description: 'Convert each page of a PDF into a JPG image.',
    Icon: PdfToJpgIcon,
    path: '/pdf-to-jpg',
    category: 'PDF',
    color: '#D946EF',
  },
  {
    title: 'PDF to Word',
    description: 'Convert your PDF files to editable DOCX documents.',
    Icon: PdfToWordIcon,
    path: '/pdf-to-word',
    category: 'PDF',
    color: '#2563EB',
  },
  {
    title: 'PDF to Excel',
    description: 'Extract tables from PDF files into a CSV file.',
    Icon: PdfToExcelIcon,
    path: '/pdf-to-excel',
    category: 'PDF',
    color: '#16A34A',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce the file size of your PDF documents.',
    Icon: CompressIcon,
    path: '/compress-pdf',
    category: 'PDF',
    color: '#64748B',
    isComingSoon: true,
  },
  // DOCX Tools
  {
    title: 'Word to PDF',
    description: 'Convert DOCX files to PDF for easy sharing.',
    Icon: WordToPdfIcon,
    path: '/word-to-pdf',
    category: 'DOCX',
    color: '#2563EB',
  },
  {
    title: 'DOCX to Text',
    description: 'Extract plain text from a Word document.',
    Icon: DocxToTextIcon,
    path: '/docx-to-text',
    category: 'DOCX',
    color: '#475569',
  },
  {
    title: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF documents.',
    Icon: ExcelToPdfIcon,
    path: '/excel-to-pdf',
    category: 'DOCX',
    color: '#16A34A',
    isComingSoon: true,
  },
];
