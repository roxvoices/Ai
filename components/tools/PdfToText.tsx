
import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../../constants';

// Declare pdfjsLib globally, as it's loaded via CDN script
declare const pdfjsLib: any;

interface ToolProps {
  language: string;
}

export const PdfToText: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      event.target.value = ''; // Clear input even if no files selected
      return;
    }

    setError(null); // Clear previous errors
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setExtractedText('');
    } else {
      setPdfFile(null);
      setExtractedText('');
      setError("Please upload a valid PDF file (.pdf).");
    }
    event.target.value = ''; // Clear input value after processing
  };

  const extractTextFromPdf = async () => {
    if (!pdfFile) {
      setError("No PDF file selected.");
      return;
    }
    // Check if pdfjsLib is loaded
    if (typeof pdfjsLib === 'undefined' || !pdfjsLib.getDocument) {
      setError("PDF processing library (pdf.js) not loaded. Please check your internet connection and try again.");
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    setExtractedText('');

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer }); 
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i); 
        const textContent = await page.getTextContent(); 
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      setExtractedText(fullText.trim());
    } catch (e: any) {
      console.error("Error extracting text from PDF:", e);
      setError(`${t.error}: Could not extract text from PDF. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadText = () => {
    if (extractedText && pdfFile) {
      const blob = new Blob([extractedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFile?.name.replace('.pdf', '') || 'extracted_text'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the object URL
    }
  };

  const handleClear = () => {
    setPdfFile(null);
    setExtractedText('');
    setLoading(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Ensure file input is cleared
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95">
      <header className="text-center">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.pdfToText}</h2>
        <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.pdfToTextDescription}</p>
      </header>

      <div className="glass-panel rounded-[3rem] p-12 w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <label htmlFor="pdf-upload-input" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t.uploadFile}</label>
          <input 
            id="pdf-upload-input"
            type="file" 
            accept=".pdf" 
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
            aria-label={`Select a PDF file to upload`}
          >
            Select PDF File
          </button>
          {pdfFile && <p className="text-slate-400 text-xs mt-2" aria-live="polite">{pdfFile.name}</p>}
        </div>

        <button 
          type="button"
          onClick={extractTextFromPdf} 
          disabled={loading || !pdfFile}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all disabled:bg-slate-800 disabled:text-slate-600 text-xs uppercase tracking-[0.2em]"
          aria-live="polite"
        >
          {loading ? t.extractingText : t.process}
        </button>

        {loading && !error && (
          <div className="flex items-center justify-center py-6 text-slate-400" aria-live="polite">
            <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {t.loading}
          </div>
        )}

        {extractedText && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-xl font-black text-white">{t.extractedText}</h3>
            <textarea
              readOnly
              value={extractedText}
              rows={10}
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none resize-none"
              aria-label="Extracted text from PDF"
            />
            <button 
              type="button"
              onClick={handleDownloadText} 
              className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all text-xs uppercase tracking-[0.2em]"
              aria-label="Download extracted text as TXT"
            >
              {t.download}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}

        <button 
          type="button"
          onClick={handleClear} 
          disabled={loading || (!pdfFile && !extractedText)}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] mt-8"
          aria-label="Clear PDF file and extracted text"
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
};