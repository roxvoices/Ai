
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
  const [compressionQuality, setCompressionQuality] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imagePreviewRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Always clear the file input's value to ensure onChange fires again if the same file is selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!file) {
      return;
    }

    setError(null);
    // Explicitly check for supported image types
    if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png')) {
      setError(t.fileNotSupported); // Use specific message
      setOriginalFile(null);
      setCompressedFileUrl(null);
      setCompressedFileSize(null);
      return;
    }
    setOriginalFile(file);
    setCompressedFileUrl(null);
    setCompressedFileSize(null);
    processFile(file, compressionQuality);
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
            setError(`${t.error}: Canvas element not available for image processing.`);
            setLoading(false);
            return;
          }
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError(`${t.error}: 2D rendering context not available for canvas.`);
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
              setError(`${t.error}: Failed to create compressed image blob. The image might be too large or corrupted.`);
            }
            setLoading(false);
          }, mimeType, quality);
        };
        img.onerror = () => {
          setError(`${t.error}: Failed to load image into memory. The file might be corrupted or an unsupported image format.`);
          setLoading(false);
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = (e) => {
        setError(`${t.error}: Failed to read file data. Details: ${e.target?.error?.message || 'Unknown error'}`);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (e: any) {
      console.error("Compression process error:", e);
      setError(`${t.error}: An unexpected error occurred during compression. ${e.message}`);
    } finally {
      // Ensure loading is turned off even if an error occurs outside of specific callbacks
      if (loading) setLoading(false);
    }
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseFloat(e.target.value);
    setCompressionQuality(newQuality);
    if (originalFile && !loading) {
      processFile(originalFile, newQuality);
    }
  };

  const handleDownload = () => {
    if (compressedFileUrl && originalFile) {
      const a = document.createElement('a');
      a.href = compressedFileUrl;
      const originalExtension = originalFile.name.split('.').pop();
      const downloadExtension = originalFile.type.includes('png') ? 'png' : 'jpg';
      a.download = `compressed-${originalFile.name.replace(`.${originalExtension}`, '')}.${downloadExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleClear = () => {
    setOriginalFile(null);
    if (compressedFileUrl) {
      URL.revokeObjectURL(compressedFileUrl);
    }
    setCompressedFileUrl(null);
    setCompressedFileSize(null);
    setCompressionQuality(0.8);
    setLoading(false);
    setError(null);
    if (imagePreviewRef.current) imagePreviewRef.current.src = '';
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95">
      <header className="text-center">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.fileCompressor}</h2>
        <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.fileCompressorDescription}</p>
      </header>

      <div className="glass-panel rounded-[3rem] p-12 w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <label htmlFor="image-upload-input" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Upload Image File (.jpg, .png)</label> {/* Updated label */}
          <input 
            id="image-upload-input"
            type="file" 
            accept="image/jpeg,image/png" 
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
            aria-label={`Select an image file to compress`}
          >
            Select Image File
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
        {/* Removed audioCompressionWarning as it's now covered by specific error and description */}

        {originalFile && !error && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white text-center">{t.imageCompression}</h3>
            
            <div className="space-y-3">
                <label htmlFor="quality-slider" className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{t.compressionQuality} ({Math.round(compressionQuality * 100)}%)</label>
                <input 
                    id="quality-slider"
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.05" 
                    value={compressionQuality} 
                    onChange={handleQualityChange} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    disabled={loading || originalFile.type === 'image/png'}
                    title={originalFile.type === 'image/png' ? "Quality applies only to JPEG images." : ""}
                    aria-label="Image compression quality"
                />
                {originalFile.type === 'image/png' && (
                  <p className="text-xs text-slate-500 italic text-center" aria-live="polite">PNG is a lossless format; quality slider has no effect.</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{t.originalSize}</p>
                    <p className="text-lg font-bold text-white">{originalFile ? (originalFile.size / 1024).toFixed(2) : '0.00'} KB</p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{t.compressedSize}</p>
                    <p className="text-lg font-bold text-blue-400">
                        {compressedFileSize ? (compressedFileSize / 1024).toFixed(2) : '0.00'} KB
                        {originalFile && compressedFileSize && (
                            <span className="text-[8px] ml-2 text-green-500" aria-live="polite">
                                (-{(((originalFile.size - compressedFileSize) / originalFile.size) * 100).toFixed(0)}%)
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {loading && !error && (
              <div className="flex items-center justify-center py-6 text-slate-400" aria-live="polite">
                <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t.loading}
              </div>
            )}

            {compressedFileUrl && (
              <div className="space-y-6 text-center animate-in fade-in">
                <h3 className="text-xl font-black text-white">Preview</h3>
                <div className="relative aspect-video max-h-64 mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img ref={imagePreviewRef} src={compressedFileUrl} alt="Compressed preview" className="w-full h-full object-contain" aria-live="polite" />
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true"></canvas>
                <button 
                  type="button"
                  onClick={handleDownload} 
                  className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all text-xs uppercase tracking-[0.2em]"
                  aria-label="Download compressed image"
                >
                  {t.download}
                </button>
              </div>
            )}
          </div>
        )}

        <button 
          type="button"
          onClick={handleClear} 
          disabled={loading || !originalFile}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] mt-8"
          aria-label="Clear all files and reset"
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
};