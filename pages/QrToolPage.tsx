
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import Alert from '../components/Alert';
import SEO from '../components/SEO';

const QrToolPage: React.FC = () => {
  const [text, setText] = useState('https://convertai.life');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [error, setError] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQr();
  }, [text, darkColor, lightColor]);

  const generateQr = async () => {
    if (!canvasRef.current || !text.trim()) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: 300,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });
      setError('');
    } catch (err: any) {
      setError('Could not generate QR code. Content might be too large.');
      console.error(err);
    }
  };

  const downloadQr = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'convertai-qr.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <>
      <SEO 
        title="QR Code Generator | convertai.life"
        description="Create custom, high-quality QR codes for URLs, text, and more. Free, fast, and secure online QR generator with color customization."
      />
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">QR Code Generator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Create custom QR codes for your links or information instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Customization</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content (URL or Text)</label>
                <textarea
                  id="qr-text"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-dark-bg dark:border-dark-border focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter URL or text here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dark-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foreground Color</label>
                  <input
                    type="color"
                    id="dark-color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-full h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label htmlFor="light-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Color</label>
                  <input
                    type="color"
                    id="light-color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-full h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {error && <div className="mt-4"><Alert type="error" message={error} /></div>}
          </div>

          <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border flex flex-col items-center justify-center">
            <div className="p-4 bg-white rounded-lg shadow-inner-3d mb-8 border border-gray-100">
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            </div>

            <button
              onClick={downloadQr}
              className="w-full max-w-xs bg-gradient-to-br from-primary-light to-secondary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 transform transition-all duration-150 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download PNG</span>
            </button>
            
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Generated in high definition (300dpi equivalent).
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default QrToolPage;
