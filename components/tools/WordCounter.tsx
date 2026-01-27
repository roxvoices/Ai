
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const WordCounter: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCountWithSpaces, setCharCountWithSpaces] = useState(0);
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const calculateCounts = useCallback((inputText: string) => {
    if (!inputText) {
      setWordCount(0);
      setCharCountWithSpaces(0);
      setCharCountNoSpaces(0);
      setSentenceCount(0);
      setParagraphCount(0);
      return;
    }

    setCharCountWithSpaces(inputText.length);
    setCharCountNoSpaces(inputText.replace(/\s/g, '').length);

    const words = inputText.match(/\b\w+\b/g);
    setWordCount(words ? words.length : 0);

    // Sentence detection (basic: ends with . ! ?)
    const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length === 0 && inputText.trim() !== '') {
      setSentenceCount(1); // Count as one sentence if there's text but no punctuation
    } else {
      setSentenceCount(sentences.length);
    }
    
    // Paragraph detection: split by one or more newline characters and filter empty ones
    const paragraphs = inputText.split(/\r?\n\s*\r?\n/g).filter(p => p.trim() !== '');
    setParagraphCount(paragraphs.length || (inputText.trim() ? 1 : 0)); // If text exists but no explicit paragraphs, count as 1
  }, []);

  useEffect(() => {
    calculateCounts(text);
  }, [text, calculateCounts]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
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
    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target?.result as string);
      setLoading(false);
    };
    reader.onerror = (event) => {
      console.error("Error reading file:", event.target?.error);
      setError(`${t.error}: Failed to read file. Details: ${event.target?.error?.message || 'Unknown error'}`);
      setLoading(false);
    };
    reader.readAsText(file);
    e.target.value = ''; // Clear input value after processing
  };

  const handleClear = () => {
    setText('');
    setError(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Ensure file input is cleared
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95">
      <header className="text-center">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.wordCounter}</h2>
        <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.wordCounterDescription}</p>
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
            aria-label="Text to count words, characters, sentences, and paragraphs"
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
            style={{ display: 'none' }}
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
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" aria-live="polite">
          <StatCard label={t.words} value={wordCount} />
          <StatCard label={t.charactersWithSpaces} value={charCountWithSpaces} />
          <StatCard label={t.charactersNoSpaces} value={charCountNoSpaces} />
          <StatCard label={t.sentences} value={sentenceCount} />
          <StatCard label={t.paragraphs} value={paragraphCount} />
        </div>

        <button 
          type="button"
          onClick={handleClear} 
          disabled={loading || !text.trim()}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em]"
          aria-label="Clear text input"
        >
          {t.clear}
        </button>

        {loading && !error && (
          <div className="flex items-center justify-center py-6 text-slate-400" aria-live="polite">
            <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {t.loading}
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-center">
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);