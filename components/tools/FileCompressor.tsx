
import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const FileCompressor: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFileUrl, setCompressedFileUrl] = useState<string | null>(null);
  const [compressedFileSize, setCompressedFileSize] = useState<number | null>(null);
  const [compressionQuality, setCompressionQuality] = useState(0.8); // 0.1 to 1.0 (JPEG)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imagePreviewRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png')) {
        setError(t.fileNotSupported);
        setOriginalFile(null);
        setCompressedFileUrl(null);
        setCompressedFileSize(null);
        return;
      }
      setOriginalFile(file);
      setCompressedFileUrl(null);
      setCompressedFileSize(null);
      setError(null);
      // Automatically process on file change
      processFile(file, compressionQuality);
    }
  };

  const processFile = async (file: File, quality: number) => {
    setLoading(true);
    setError(null);
    setCompressedFileUrl(null);
    setCompressedFileSize(null);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) {
            setError(t.error + ": Canvas not available.");
            setLoading(false);
            return;
          }
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError(t.error + ": Canvas context not available.");
            setLoading(false);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          canvas.toBlob((blob) => {
            if (blob) {
              setCompressedFileUrl(URL.createObjectURL(blob));
              setCompressedFileSize(blob.size);
            } else {
              setError(t.error + ": Failed to compress image.");
            }
            setLoading(false);
          }, mimeType, quality);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (e: any) {
      setError(t.error + ": " + e.message);
      setLoading(false);
    }
  };

  const handleQualityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseFloat(event.target.value);
    setCompressionQuality(newQuality);
    if (originalFile) {
      processFile(originalFile, newQuality);
    }
  };

  const handleDownload = () => {
    if (compressedFileUrl && originalFile) {
      const a = document.createElement('a');
      a.href = compressedFileUrl;
      const originalFileName = originalFile.name.split('.').slice(0, -1).join('.');
      const fileExtension = originalFile.type.split('/')[1];
      a.download = `${originalFileName}_compressed.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // No need to revokeObjectURL here, it's revoked on clear
    }
  };

  const handleClear = () => {
    if (compressedFileUrl) {
      URL.revokeObjectURL(compressedFileUrl);
    }
    setOriginalFile(null);
    setCompressedFileUrl(null);
    setCompressedFileSize(null);
    setCompressionQuality(0.8);
    setLoading(false);
    setError(null);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95">
      <header className="text-center">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.fileCompressor}</h2>
        <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.fileCompressorDescription}</p>
      </header>

      <div className="glass-panel rounded-[3rem] p-12 w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t.uploadFile}</label>
          <input 
            type="file" 
            accept="image/jpeg,image/png" // Only allow JPEG and PNG for now
            onChange={handleFileChange} 
            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-600 file:text-white"
            disabled={loading}
          />
          {originalFile && <p className="text-slate-400 text-xs mt-2">{originalFile.name} ({formatBytes(originalFile.size)})</p>}
        </div>

        {originalFile && !error && (
          <div className="space-y-6">
            <p className="text-slate-500 text-sm italic">{t.audioCompressionWarning}</p> {/* Placeholder for audio */}

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{t.compressionQuality} ({Math.round(compressionQuality * 100)}%)</label>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.01" 
                value={compressionQuality} 
                onChange={handleQualityChange} 
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                disabled={loading}
              />
            </div>

            <div className="flex justify-around text-center mt-6">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex-1 mx-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{t.originalSize}</p>
                <p className="text-lg font-bold text-white">{originalFile ? formatBytes(originalFile.size) : 'N/A'}</p>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex-1 mx-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{t.compressedSize}</p>
                <p className="text-lg font-bold text-blue-400">{compressedFileSize ? formatBytes(compressedFileSize) : t.loading}</p>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-white text-center mt-8">{t.imageCompression} Preview</h3>
            <div className="relative w-full h-auto bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center p-4 min-h-[200px] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-6 text-slate-400">
                        <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {t.loading}
                    </div>
                ) : compressedFileUrl ? (
                    <img 
                        ref={imagePreviewRef} 
                        src={compressedFileUrl} 
                        alt="Compressed Preview" 
                        className="max-w-full max-h-[400px] object-contain rounded-lg" 
                    />
                ) : (
                    <p className="text-slate-500 text-xs uppercase tracking-widest">{t.uploadFile} to preview</p>
                )}
                {/* Hidden canvas for image processing */}
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            </div>

            <button 
              onClick={handleDownload} 
              disabled={loading || !compressedFileUrl}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all disabled:bg-slate-800 disabled:text-slate-600 text-xs uppercase tracking-[0.2em]"
            >
              {loading ? t.loading : t.download}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button 
          onClick={handleClear} 
          disabled={loading || (!originalFile && !compressedFileUrl)}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] mt-8"
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
};
