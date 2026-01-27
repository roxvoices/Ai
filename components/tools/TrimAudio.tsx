
import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const TrimAudio: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [trimmedAudioUrl, setTrimmedAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);

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
    const length = audioBuffer.length * numOfChan * 2 + 44; // 2 bytes per sample (16-bit)
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels: Float32Array[] = [];
    let i, sample;
    let offset = 0;

    // write WAV header
    const writeString = (view: DataView, offset: number, s: string) => {
      for (let i = 0; i < s.length; i++) {
        view.setUint8(offset + i, s.charCodeAt(i));
      }
    };

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

    // write the data
    for (i = 0; i < audioBuffer.numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    let sampleIndex = 0;
    while(offset < length) {
      for (i = 0; i < numOfChan; i++) {
        // Correctly calculate the sample index for each channel based on current offset
        sample = Math.max(-1, Math.min(1, channels[i][Math.floor(sampleIndex)])); // Clamp to [-1, 1]
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
    const file = event.target.files?.[0];
    if (!file) {
      event.target.value = ''; // Clear input even if no files selected
      return;
    }

    setAudioFile(file);
    setLoading(true);
    setError(null); // Clear previous errors
    setTrimmedAudioUrl(null);
    setCurrentPlayTime(0);
    event.target.value = ''; // Clear input value after processing

    try {
      const context = getAudioContext(); 
      if (!context) {
        throw new Error("Audio context could not be initialized.");
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = await context.decodeAudioData(arrayBuffer); 
      setAudioBuffer(buffer);
      setStartTime(0);
      setEndTime(buffer.duration); // Default end time to full duration
    } catch (e: any) {
      console.error("Error during file change/decoding:", e);
      setError(`${t.error}: ${e.message}`);
      setAudioFile(null);
      setAudioBuffer(null);
      setStartTime(0);
      setEndTime(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTrim = async () => {
    if (!audioBuffer) {
      setError("No audio file loaded to trim.");
      return;
    }
    if (startTime >= endTime || startTime < 0 || endTime > audioBuffer.duration) {
      setError("Invalid trim times. Please ensure start time is less than end time, and within the audio duration.");
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    setTrimmedAudioUrl(null);
    setCurrentPlayTime(0);

    try {
      const context = getAudioContext(); 
      if (!context) {
        throw new Error("Audio context could not be initialized.");
      }

      // Use OfflineAudioContext for efficient non-realtime rendering
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        (endTime - startTime) * audioBuffer.sampleRate,
        audioBuffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      source.connect(offlineContext.destination);
      source.start(0, startTime, endTime - startTime); // start at 0 of offline context, from startTime of original, for duration

      const renderedBuffer = await offlineContext.startRendering(); 

      const wavBlob = await audioBufferToWavBlob(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setTrimmedAudioUrl(url);
    } catch (e: any) {
      console.error("Error during audio trimming:", e);
      setError(`${t.error}: Failed to trim audio. ${e.message}`);
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

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      setCurrentPlayTime(audioPlayerRef.current.currentTime);
    }
  };

  const handleDownload = () => {
    if (trimmedAudioUrl && audioFile) {
      const a = document.createElement('a');
      a.href = trimmedAudioUrl;
      a.download = `trimmed-${audioFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // URL.revokeObjectURL(trimmedAudioUrl); // Keeping URL active until cleared by user
    }
  };

  const handleClear = () => {
    setAudioFile(null);
    setAudioBuffer(null);
    setStartTime(0);
    setEndTime(0);
    if (trimmedAudioUrl) {
      URL.revokeObjectURL(trimmedAudioUrl); // Revoke only on clear
    }
    setTrimmedAudioUrl(null);
    setLoading(false);
    setError(null);
    setIsPlaying(false);
    setCurrentPlayTime(0);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = '';
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(e => console.error("Failed to close AudioContext:", e));
      audioContextRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Ensure file input is cleared
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95">
      <header className="text-center">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.trimAudio}</h2>
        <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.trimAudioDescription}</p>
      </header>

      <div className="glass-panel rounded-[3rem] p-12 w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <label htmlFor="audio-upload-input" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t.uploadFile}</label>
          <input 
            id="audio-upload-input"
            type="file" 
            accept="audio/*" 
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
            aria-label={`Select an audio file to upload`}
          >
            Select Audio File
          </button>
          {audioFile && <p className="text-slate-400 text-xs mt-2" aria-live="polite">{audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
        </div>

        {audioBuffer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={togglePlay} 
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:scale-105 transition-transform"
                disabled={loading}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18h4V6H6v12zm8 0h4V6h-4v12z"/></svg> : <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
              </button>
              <audio 
                ref={audioPlayerRef} 
                src={trimmedAudioUrl || (audioFile ? URL.createObjectURL(audioFile) : '')} 
                controls={false}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                className="hidden"
                aria-label="Audio playback"
              />
              <div className="flex-1">
                <p className="text-slate-400 text-xs" aria-live="polite">{currentPlayTime.toFixed(2)}s / {audioBuffer.duration.toFixed(2)}s</p>
                <input 
                    type="range" 
                    min="0" 
                    max={audioBuffer.duration} 
                    value={currentPlayTime} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer range-sm" 
                    onChange={(e) => { if (audioPlayerRef.current) audioPlayerRef.current.currentTime = parseFloat(e.target.value); }}
                    disabled={loading}
                    aria-label="Audio playback progress"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-time-input" className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{t.startTime}</label>
                <input 
                  id="start-time-input"
                  type="number" 
                  value={startTime} 
                  onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value)))} 
                  step="0.1" 
                  min="0" 
                  max={audioBuffer.duration}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Start time in seconds"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end-time-input" className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{t.endTime}</label>
                <input 
                  id="end-time-input"
                  type="number" 
                  value={endTime} 
                  onChange={(e) => setEndTime(Math.min(audioBuffer.duration, parseFloat(e.target.value)))} 
                  step="0.1" 
                  min="0" 
                  max={audioBuffer.duration}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="End time in seconds"
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={handleTrim} 
              disabled={loading || !audioBuffer || startTime >= endTime || startTime < 0 || endTime > audioBuffer.duration}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all disabled:bg-slate-800 disabled:text-slate-600 text-xs uppercase tracking-[0.2em]"
              aria-live="polite"
            >
              {loading ? t.trimmingAudio : t.process}
            </button>
          </div>
        )}

        {trimmedAudioUrl && (
          <div className="space-y-6 text-center animate-in fade-in">
            <h3 className="text-xl font-black text-white">{t.trimmedAudio}</h3>
            <audio src={trimmedAudioUrl} controls className="w-full rounded-xl bg-black/40 p-3" aria-label="Trimmed audio playback" />
            <button 
              type="button"
              onClick={handleDownload} 
              className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all text-xs uppercase tracking-[0.2em]"
              aria-label="Download trimmed audio"
            >
              {t.download}
            </button>
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
          disabled={loading || (!audioFile && !trimmedAudioUrl)}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] mt-8"
          aria-label="Clear all and reset"
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
};