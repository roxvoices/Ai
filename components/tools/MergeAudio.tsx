
import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const MergeAudio: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [audioBuffers, setAudioBuffers] = useState<AudioBuffer[]>([]);
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudioContext = (): AudioContext => {
    if (!audioContextRef.current) {
      // Fix: Replace deprecated window.webkitAudioContext with AudioContext
      audioContextRef.current = new AudioContext();
    }
    // Ensure context is running if it was suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(e => console.error("Failed to resume AudioContext:", e));
    }
    return audioContextRef.current;
  };

  // Helper to convert AudioBuffer to WAV Blob
  const audioBufferToWavBlob = async (audioBuffer: AudioBuffer): Promise<Blob> => {
    const numOfChan = audioBuffer.numberOfChannels;
    const channels: Float32Array[] = [];
    const length = audioBuffer.length * numOfChan * 2 + 44; // 2 bytes per sample (16-bit)
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    let i, sample;
    let offset = 0;

    const writeString = (view: DataView, offset: number, s: string) => {
      for (let i = 0; i < s.length; i++) {
        view.setUint8(offset + i, s.charCodeAt(i));
      }
    };

    // Write WAV header
    writeString(view, offset, 'RIFF'); offset += 4;
    view.setUint32(offset, length - 8, true); offset += 4;
    writeString(view, offset, 'WAVE'); offset += 4;
    writeString(view, offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4; // Subchunk1Size for PCM
    view.setUint16(offset, 1, true); offset += 2; // AudioFormat (1 = PCM)
    view.setUint16(offset, numOfChan, true); offset += 2; // NumChannels
    view.setUint32(offset, audioBuffer.sampleRate, true); offset += 4; // SampleRate
    view.setUint32(offset, audioBuffer.sampleRate * numOfChan * 2, true); offset += 4; // ByteRate
    view.setUint16(offset, numOfChan * 2, true); offset += 2; // BlockAlign
    view.setUint16(offset, 16, true); offset += 2; // BitsPerSample
    writeString(view, offset, 'data'); offset += 4;
    view.setUint32(offset, length - offset - 4, true); offset += 4; // DataSize

    // Get channel data
    for (i = 0; i < audioBuffer.numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    // Write the audio data
    let sampleIndex = 0;
    while(offset < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][sampleIndex])); // Clamp to [-1, 1]
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF; // Convert to 16-bit int
        view.setInt16(offset, sample, true); offset += 2;
      }
      sampleIndex++;
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(event.target.files || []);
    if (files.length === 0) {
      event.target.value = ''; // Clear input even if no files selected
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    setMergedAudioUrl(null);
    event.target.value = ''; // Clear input value after processing

    const newUploadedFiles: File[] = [];
    const newAudioBuffers: AudioBuffer[] = [];

    try {
      const context = getAudioContext(); 
      if (!context) {
        throw new Error("Audio context could not be initialized.");
      }

      for (const file of files) {
        if (!file.type.startsWith('audio/')) {
          throw new Error(`File '${file.name}' is not an audio file.`);
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = await context.decodeAudioData(arrayBuffer); 
        newUploadedFiles.push(file);
        newAudioBuffers.push(buffer);
      }
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      setAudioBuffers(prev => [...prev, ...newAudioBuffers]);
    } catch (e: any) {
      console.error("Error during file change/decoding:", e);
      setError(`${t.error}: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setAudioBuffers(prev => prev.filter((_, i) => i !== index));
    setMergedAudioUrl(null); // Clear merged audio if inputs change
    setIsPlaying(false);
  };

  const handleMerge = async () => {
    if (audioBuffers.length < 2) {
      setError("Please upload at least two audio files to merge.");
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    setMergedAudioUrl(null);
    setIsPlaying(false);

    try {
      let totalDuration = 0;
      let maxChannels = 0;
      let sampleRate = audioBuffers[0].sampleRate; // Assume consistent sample rate

      audioBuffers.forEach(buffer => {
        totalDuration += buffer.duration;
        maxChannels = Math.max(maxChannels, buffer.numberOfChannels);
        if (buffer.sampleRate !== sampleRate) {
          console.warn("Mismatched sample rates detected. Using first file's sample rate. Audio quality may vary.");
          // A more robust solution would resample all audio to a common sample rate.
        }
      });

      const offlineContext = new OfflineAudioContext(
        maxChannels,
        totalDuration * sampleRate,
        sampleRate
      );

      let currentOffset = 0;
      for (const buffer of audioBuffers) {
        const source = offlineContext.createBufferSource();
        source.buffer = buffer;
        source.connect(offlineContext.destination);
        source.start(currentOffset); // Start at the current cumulative offset
        currentOffset += buffer.duration;
      }

      const renderedBuffer = await offlineContext.startRendering(); 
      const wavBlob = await audioBufferToWavBlob(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setMergedAudioUrl(url);
    } catch (e: any) {
      console.error("Error during audio merging:", e);
      setError(`${t.error}: Failed to merge audio. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play().catch(e => console.error("Audio playback error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (mergedAudioUrl) {
      const a = document.createElement('a');
      a.href = mergedAudioUrl;
      a.download = `merged-audio-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // URL.revokeObjectURL(mergedAudioUrl); // Keeping URL active until cleared by user
    }
  };

  const handleClear = () => {
    setUploadedFiles([]);
    setAudioBuffers([]);
    if (mergedAudioUrl) {
      URL.revokeObjectURL(mergedAudioUrl); // Revoke only on clear
    }
    setMergedAudioUrl(null);
    setLoading(false);
    setError(null);
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = '';
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(e => console.error("Failed to close AudioContext:", e));
      audioContextRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95">
      <header className="text-center">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.mergeAudio}</h2>
        <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.mergeAudioDescription || "Combine multiple audio files into a single, seamless track."}</p>
      </header>

      <div className="glass-panel rounded-[3rem] p-12 w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <label htmlFor="audio-upload-input" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t.uploadFile} (Multiple)</label>
          <input 
            id="audio-upload-input"
            type="file" 
            accept="audio/*" 
            multiple
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
            aria-label={`Select multiple audio files to upload`}
          >
            Select Audio Files
          </button>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white">{t.uploadedFiles || "Uploaded Files"}</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar" aria-label="List of uploaded audio files">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl p-3 text-white text-sm">
                  <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <button type="button" onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-400" aria-label={`Remove ${file.name}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button 
          type="button"
          onClick={handleMerge} 
          disabled={loading || audioBuffers.length < 2}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all disabled:bg-slate-800 disabled:text-slate-600 text-xs uppercase tracking-[0.2em]"
          aria-live="polite"
        >
          {loading ? t.loading : t.process}
        </button>

        {mergedAudioUrl && (
          <div className="space-y-6 text-center animate-in fade-in">
            <h3 className="text-xl font-black text-white">{t.mergedAudio || "Merged Audio"}</h3>
            <audio 
              ref={audioPlayerRef} 
              src={mergedAudioUrl} 
              controls={false}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
              aria-label="Merged audio playback"
            />
            <div className="flex items-center gap-4 justify-center" role="group" aria-label="Audio controls">
              <button 
                type="button"
                onClick={togglePlay} 
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:scale-105 transition-transform"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18h4V6H6v12zm8 0h4V6h-4v12z"/></svg> : <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
              </button>
              <button 
                type="button"
                onClick={handleDownload} 
                className="py-3 px-6 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all text-xs uppercase tracking-[0.2em]"
                aria-label="Download merged audio"
              >
                {t.download}
              </button>
            </div>
          </div>
        )}

        {loading && !error && (
          <div className="flex items-center justify-center py-6 text-slate-400" aria-live="polite">
            <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {t.loading}
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}

        <button 
          type="button"
          onClick={handleClear} 
          disabled={loading || (uploadedFiles.length === 0 && !mergedAudioUrl)}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] mt-8"
          aria-label="Clear all files and reset"
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
};