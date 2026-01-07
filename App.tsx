
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SummarizeToolPage from './pages/SummarizeToolPage';
import TranslateToolPage from './pages/TranslateToolPage';
import CorrectTextToolPage from './pages/CorrectTextToolPage';
import RemoveBgToolPage from './pages/RemoveBgToolPage';
import EditImageToolPage from './pages/EditImageToolPage';
import MergePdfToolPage from './pages/MergePdfToolPage';
import SplitPdfToolPage from './pages/SplitPdfToolPage';
import ConvertDocxToolPage from './pages/ConvertDocxToolPage';
import ImageToPdfToolPage from './pages/ImageToPdfToolPage';
import PdfToJpgToolPage from './pages/PdfToJpgToolPage';
import WordToPdfToolPage from './pages/WordToPdfToolPage';
import PdfToWordToolPage from './pages/PdfToWordToolPage';
import PdfToExcelToolPage from './pages/PdfToExcelToolPage';
import QrToolPage from './pages/QrToolPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ComingSoonPage from './pages/ComingSoonPage';
import { tools } from './data/tools';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const componentMap: Record<string, React.ComponentType> = {
  '/summarize': SummarizeToolPage,
  '/translate': TranslateToolPage,
  '/correct-text': CorrectTextToolPage,
  '/remove-background': RemoveBgToolPage,
  '/edit-image': EditImageToolPage,
  '/image-to-pdf': ImageToPdfToolPage,
  '/merge-pdf': MergePdfToolPage,
  '/split-pdf': SplitPdfToolPage,
  '/pdf-to-jpg': PdfToJpgToolPage,
  '/pdf-to-word': PdfToWordToolPage,
  '/pdf-to-excel': PdfToExcelToolPage,
  '/word-to-pdf': WordToPdfToolPage,
  '/docx-to-text': ConvertDocxToolPage,
  '/qr-generator': QrToolPage,
};


function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {tools.map(tool => {
              const Component = componentMap[tool.path];
              if (tool.isComingSoon) {
                return <Route key={tool.path} path={tool.path} element={<ComingSoonPage toolName={tool.title} />} />
              }
              if (Component) {
                return <Route key={tool.path} path={tool.path} element={<Component />} />
              }
              return null;
            })}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
