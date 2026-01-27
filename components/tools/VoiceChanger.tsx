
import React, { useState, useRef, useEffect } from 'react';
import { TRANSLATIONS } from '../../constants';

interface ToolProps {
  language: string;
}

export const VoiceChanger: React.FC<ToolProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const [isMicActive, setIsMicActive] = useState(false);
  const [pitch, setPitch] = useState(1); // 0.5 to 2.0 (normal is 1)
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Fix: Initialize canvasRef with null to avoid block-scoped variable error
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // New state for preview functionality
  const previewSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopMic();
      stopPreview(); // Stop any active preview
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const getAudioContext = (): AudioContext => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    // Ensure context is running, especially if it was suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  // Helper to create a simple sine wave audio buffer for preview
  const createSineWaveBuffer = (context: AudioContext, duration: number, frequency: number): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 0.5; // 0.5 amplitude
    }
    return buffer;
  };

  const stopPreview = () => {
    if (previewSourceRef.current) {
      previewSourceRef.current.stop();
      previewSourceRef.current.disconnect();
      previewSourceRef.current = null;
    }
    setIsPreviewing(false);
  };

  const handlePreview = () => {
    stopMic(); // Stop microphone if active
    stopPreview(); // Stop any existing preview

    const context = getAudioContext();
    
    // Create a 1-second 440Hz sine wave as a preview sound
    const previewBuffer = createSineWaveBuffer(context, 1, 440); 
    const source = context.createBufferSource();
    source.buffer = previewBuffer;
    source.playbackRate.value = pitch; // Apply current pitch to playback rate
    source.connect(context.destination);

    source.onended = () => {
      stopPreview(); // Clean up after playback ends
    };

    source.start(0);
    previewSourceRef.current = source;
    setIsPreviewing(true);
  };


  const startMic = async () => {
    setError(null);
    stopPreview(); // Stop any active preview before starting mic
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const context = getAudioContext();

      const source = context.createMediaStreamSource(stream);
      mediaStreamSourceRef.current = source;

      // Create a ScriptProcessorNode to modify audio data
      // Note: ScriptProcessorNode is deprecated, AudioWorkletNode is preferred for production
      // For simplicity and browser compatibility in this example, using ScriptProcessorNode
      const bufferSize = 2048; // Must be power of 2: 256, 512, 1024, 2048, 4096, 8192, 16384
      const scriptProcessor = context.createScriptProcessor(bufferSize, 1, 1);
      scriptProcessorRef.current = scriptProcessor;

      scriptProcessor.onaudioprocess = (event) => {
        if (!isMicActive) return; // Only process if active

        const inputBuffer = event.inputBuffer.getChannelData(0);
        const outputBuffer = event.outputBuffer.getChannelData(0);

        // Simple pitch shift: change playback rate (this also changes tempo)
        // A more advanced pitch shift would require resampling and FFT/IFFT
        // This simulates the "chipmunk" effect by speeding up/slowing down playback
        for (let i = 0; i < inputBuffer.length; i++) {
          outputBuffer[i] = inputBuffer[Math.floor(i * pitch) % inputBuffer.length];
        }
      };

      const gainNode = context.createGain();
      gainNode.gain.value = 1; // Default volume
      gainNodeRef.current = gainNode;

      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 2048;
      analyserNodeRef.current = analyserNode;

      source.connect(scriptProcessor);
      scriptProcessor.connect(analyserNode);
      analyserNode.connect(gainNode);
      gainNode.connect(context.destination);

      setIsMicActive(true);
      drawWaveform();
    } catch (err: any) {
      console.error("Microphone access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError(t.micPermissionDenied);
      } else {
        setError(t.error + ": " + err.message);
      }
      setIsMicActive(false);
    }
  };

  const stopMic = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (analyserNodeRef.current) {
      analyserNodeRef.current.disconnect();
      analyserNodeRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      // Don't close the context, just suspend it for faster restarts.
      audioContextRef.current.suspend();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsMicActive(false);
    stopPreview(); // Ensure any active preview is stopped
  };

  const drawWaveform = () => {
    if (!analyserNodeRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    analyserNodeRef.current.fftSize = 2048;
    const bufferLength = analyserNodeRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserNodeRef.current || !isMicActive) {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        return;
      }
      animationFrameRef.current = requestAnimationFrame(draw);

      analyserNodeRef.current.getByteTimeDomainData(dataArray);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT); // Clear previous frame
      canvasCtx.fillStyle = '#0f172a'; // Background matching panel
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#3b82f6'; // Blue waveform

      canvasCtx.beginPath();

      const sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const handlePitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPitch(parseFloat(event.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95">
      <header className="text-center">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.voiceChanger}</h2>
        <p className="text-slate-500 font-medium max-w-sm text-lg mt-4 uppercase tracking-widest opacity-60">{t.voiceChangerDescription}</p>
      </header>

      <div className="glass-panel rounded-[3rem] p-12 w-full max-w-2xl space-y-8">
        <div className="flex justify-center gap-4">
          <button 
            type="button"
            onClick={handlePreview} 
            className={`py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
              isPreviewing 
                ? 'bg-blue-600/50 text-white shadow-blue-600/20' 
                : 'bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
            disabled={isMicActive} // Disable if mic is active
          >
            {isPreviewing ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t.previewing}
              </div>
            ) : (
              t.preview
            )}
          </button>
          <button 
            type="button"
            onClick={isMicActive ? stopMic : startMic} 
            className={`py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
              isMicActive 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
            disabled={isPreviewing} // Disable if preview is active
          >
            {isMicActive ? t.stopMic : t.startMic}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{t.pitch}</label>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.05" 
            value={pitch} 
            onChange={handlePitchChange} 
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            disabled={isPreviewing || isMicActive} // Disable if preview or mic is active
          />
          <p className="text-center text-blue-400 font-bold">{pitch.toFixed(2)}x Speed</p>
        </div>

        <div className="relative w-full h-48 bg-[#0f172a] rounded-xl overflow-hidden border border-white/5">
            <canvas ref={canvasRef} width="600" height="200" className="w-full h-full"></canvas>
            {!isMicActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                {t.startMic} to see waveform
              </div>
            )}
        </div>
      </div>
    </div>
  );
};