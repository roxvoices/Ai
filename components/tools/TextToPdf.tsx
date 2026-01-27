
import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../../constants';
import { jsPDF } from 'jspdf';

interface ToolProps {
  language: string;
}

export const TextToPdf: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('document');
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setPdfBlobUrl(null);
    setError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = ''; // Clear input even if no files selected
      return;
    }

    setError(null);
    if (file.type !== 'text/plain') {
      setError("Please upload a valid .txt file.");
      e.target.value = '';
      return;
    }
    
    setLoading(true);
    setPdfBlobUrl(null);
    setFileName(file.name.replace(/\.txt$/, '') || 'document');

    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target?.result as string);
      setLoading(false); // Done with file reading part, actual PDF generation is separate
    };
    reader.onerror = (event) => {
      console.error("Error reading file:", event.target?.error);
      setError(`${t.error}: Failed to read file. Details: ${event.target?.error?.message || 'Unknown error'}`);
      setLoading(false);
    };
    reader.readAsText(file);
    
    e.target.value = ''; // Clear input value after processing
  };

  const generatePdf = () => {
    if (!text.trim()) {
      setError("Please enter some text or upload a file to generate PDF.");
      return;
    }

    setLoading(true);
    setError(null);
    setPdfBlobUrl(null);

    try {
      const doc = new jsPDF();
      const margin = 10;
      let y = margin;
      const lineHeight = 7;
      const fontSize = 12;
      const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;

      doc.setFont('helvetica');
      doc.setFontSize(fontSize);

      const paragraphs = text.split('\n');

      paragraphs.forEach(paragraph => {
        const lines = doc.splitTextToSize(paragraph, maxWidth);
        lines.forEach((line: string) => {
          if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
        y += lineHeight / 2;
      });

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(url);
    } catch (e: any) {
      console.error("Error generating PDF:", e);
      setError(`${t.error}: Could not generate PDF. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfBlobUrl) {
      const a = document.createElement('a');
      a.href = pdfBlobUrl;
      a.download = `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // URL.revokeObjectURL(pdfBlobUrl); // Keeping URL active until cleared by user
    }
  };

  const handleClear = () => {
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl); // Revoke only on clear
    }
    setText('');
    setPdfBlobUrl(null);
    setError(null);
    setLoading(false);
    setFileName('document');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Ensure file input is cleared
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95">
      <header className="text-center">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.textToPdf}</h2>
        <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.textToPdfDescription}</p>
      </header>

      <div className="glass-panel rounded-[3rem] p-12 w-full max-w-3xl space-y-8">
        <div className="space-y-4">
          <label htmlFor="text-input" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Text Input</label>
          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            rows={15}
            placeholder={t.pasteTextPrompt}
            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none resize-none placeholder:text-slate-800 focus:ring-1 focus:ring-blue-500"
            disabled={loading}
            aria-label="Text to convert to PDF"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="file-upload-input" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t.uploadTxtPrompt}</label>
          <input 
            id="file-upload-input"
            type="file" 
            accept=".txt" 
            onChange={handleFileChange} 
            ref={fileInputRef}
            style={{ display: 'none' }} // Hide the input
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all text-xs uppercase tracking-[0.2em]"
            disabled={loading}
            aria-label={`Select a text file to upload`}
          >
            Select .txt File
          </button>
          {text && (
            <p className="text-slate-400 text-xs mt-2" aria-live="polite">
              {fileName === 'document' ? 'Text entered manually' : `${fileName}.txt loaded`}
            </p>
          )}
        </div>

        <button 
          type="button"
          onClick={generatePdf} 
          disabled={loading || !text.trim()}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all disabled:bg-slate-800 disabled:text-slate-600 text-xs uppercase tracking-[0.2em]"
          aria-live="polite"
        >
          {loading ? t.loading : t.generatePdf}
        </button>

        {loading && !error && (
          <div className="flex items-center justify-center py-6 text-slate-400" aria-live="polite">
            <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {t.loading}
          </div>
        )}

        {pdfBlobUrl && (
          <div className="space-y-6 text-center animate-in fade-in">
            <h3 className="text-xl font-black text-white">{t.textToPdf} {t.download}</h3>
            <p className="text-slate-400 text-sm italic">{fileName}.pdf is ready.</p>
            <button 
              type="button"
              onClick={handleDownload} 
              className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all text-xs uppercase tracking-[0.2em]"
              aria-label="Download generated PDF"
            >
              {t.download}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}

        <button 
          type="button"
          onClick={handleClear} 
          disabled={loading || (!text.trim() && !pdfBlobUrl)}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] mt-8"
          aria-label="Clear text and generated PDF"
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
};