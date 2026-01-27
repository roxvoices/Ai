
import React from 'react';
import { AppTab } from '../types';
import { TRANSLATIONS } from '../constants';

interface HomeProps {
  setActiveTab: (tab: AppTab) => void;
  language: string;
}

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string; // New prop for the image
  tab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  language: string;
  isComingSoon?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, imageUrl, tab, setActiveTab, language, isComingSoon }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div 
      onClick={() => !isComingSoon && setActiveTab(tab)}
      className={`glass-panel p-6 rounded-[2.5rem] border-white/5 flex flex-col items-start space-y-4 transition-all duration-300 group ${
        isComingSoon 
          ? 'opacity-60 grayscale cursor-not-allowed' 
          : 'cursor-pointer hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-600/10 hover:-translate-y-1'
      }`}
    >
      {/* Image / Illustration */}
      <div className="w-full h-40 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center mb-4">
        <img 
          src={imageUrl} 
          alt={`${title} illustration`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
        />
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${isComingSoon ? 'bg-slate-700/50' : 'bg-blue-600 shadow-lg shadow-blue-600/20'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-black uppercase italic text-white leading-tight">{title}</h3>
      <p className="text-sm text-slate-400 flex-1 leading-relaxed">{description}</p>
      <button
        type="button"
        disabled={isComingSoon}
        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
          isComingSoon 
            ? 'bg-slate-800 text-slate-500' 
            : 'bg-white text-black hover:bg-blue-50 active:scale-95'
        }`}
      >
        {isComingSoon ? t.comingSoon : t.tryIt}
      </button>
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ setActiveTab, language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  // Define all tool configurations with an `isComingSoon` flag
  const tools = [
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2"/></svg>,
      title: t.ttsStudio,
      description: t.ttsStudioDescription,
      imageUrl: "https://picsum.photos/id/160/800/600",
      tab: "tts-studio",
      isComingSoon: false,
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth="2"/></svg>,
      title: t.mergeAudio,
      description: t.mergeAudioDescription,
      imageUrl: "https://picsum.photos/id/214/800/600",
      tab: "merge-audio",
      isComingSoon: false,
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 10l-2 1m0 0l-2 1m2-1V3m2 7h-4M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0013.586 5H7a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>,
      title: t.trimAudio,
      description: t.trimAudioDescription,
      imageUrl: "https://picsum.photos/id/257/800/600",
      tab: "trim-audio",
      isComingSoon: false,
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/></svg>,
      title: t.pdfToText,
      description: t.pdfToTextDescription,
      imageUrl: "https://picsum.photos/id/101/800/600",
      tab: "pdf-to-text",
      isComingSoon: false,
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/><path d="M10 7v4l.5-1 .5 1V7m0 0h4m-4 0v4m0 0l.5-1 .5 1V7" strokeWidth="2"/></svg>,
      title: t.textToPdf,
      description: t.textToPdfDescription,
      imageUrl: "https://picsum.photos/id/354/800/600",
      tab: "text-to-pdf",
      isComingSoon: false,
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0013.586 5H7a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/><path d="M10 7v4l.5-1 .5 1V7m0 0h4m-4 0v4m0 0l.5-1 .5 1V7" strokeWidth="2"/></svg>,
      title: t.wordCounter,
      description: t.wordCounterDescription,
      imageUrl: "https://picsum.photos/id/1049/800/600",
      tab: "word-counter",
      isComingSoon: false,
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5"/></svg>,
      title: t.fileCompressor,
      description: t.fileCompressorDescription,
      imageUrl: "https://picsum.photos/id/1080/800/600",
      tab: "file-compressor",
      isComingSoon: false,
    },
    // The following tools are explicitly marked as `isComingSoon`
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/><path d="M15 10l-4 4-4-4" strokeWidth="2"/></svg>,
      title: t.videoToAudio,
      description: t.videoToAudioDescription,
      imageUrl: "https://picsum.photos/id/15/800/600",
      tab: "video-to-audio",
      isComingSoon: true,
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/><path d="M10 7v4l.5-1 .5 1V7m0 0h4m-4 0v4m0 0l.5-1 .5 1V7" strokeWidth="2"/></svg>,
      title: t.pdfToWord,
      description: t.pdfToWordDescription,
      imageUrl: "https://picsum.photos/id/1023/800/600",
      tab: "pdf-to-word",
      isComingSoon: true,
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0013.586 5H7a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/><path d="M10 7v4l.5-1 .5 1V7m0 0h4m-4 0v4m0 0l.5-1 .5 1V7" strokeWidth="2"/></svg>,
      title: t.wordToPdf,
      description: t.wordToPdfDescription,
      imageUrl: "https://picsum.photos/id/1025/800/600",
      tab: "word-to-pdf",
      isComingSoon: true,
    },
    { // Loop Audio
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m0 0H15" strokeWidth="2"/></svg>,
      title: t.loopAudio,
      description: t.loopAudioDescription,
      imageUrl: "https://picsum.photos/id/214/800/600",
      tab: "loop-audio",
      isComingSoon: true,
    },
    { // Volume Booster
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707c.2-.2.45-.293.707-.293h3.586c.26 0 .51.1.707.293l4.707 4.707c.2.2.293.45.293.707v3.586c0 .26-.1.51-.293.707l-4.707 4.707c-.2.2-.45.293-.707.293h-3.586c-.26 0-.51-.1-.707-.293L5.586 15z" strokeWidth="2"/></svg>,
      title: t.volumeBooster,
      description: t.volumeBoosterDescription,
      imageUrl: "https://picsum.photos/id/150/800/600",
      tab: "volume-booster",
      isComingSoon: true,
    },
    { // Add Fade
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 8h16M4 8l3-3m-3 3l3 3m10-3l3-3m-3 3l3 3" strokeWidth="2"/></svg>,
      title: t.addFade,
      description: t.addFadeDescription,
      imageUrl: "https://picsum.photos/id/151/800/600",
      tab: "add-fade",
      isComingSoon: true,
    },
    { // Voice Recorder
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2.5"/></svg>,
      title: t.voiceRecorder,
      description: t.voiceRecorderDescription,
      imageUrl: "https://picsum.photos/id/152/800/600",
      tab: "voice-recorder",
      isComingSoon: true,
    },
    { // Convert Audio Format
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth="2"/></svg>,
      title: t.convertAudioFormat,
      description: t.convertAudioFormatDescription,
      imageUrl: "https://picsum.photos/id/153/800/600",
      tab: "convert-audio-format",
      isComingSoon: true,
    },
    { // Zip Extractor
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeWidth="2"/></svg>,
      title: t.zipExtractor,
      description: t.zipExtractorDescription,
      imageUrl: "https://picsum.photos/id/154/800/600",
      tab: "zip-extractor",
      isComingSoon: true,
    },
    { // Image Resizer
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m0 0l-5 5M4 16v4m0 0h4m0 0l5-5m11 1v4m0 0h-4m0 0l-5-5" strokeWidth="2"/></svg>,
      title: t.imageResizer,
      description: t.imageResizerDescription,
      imageUrl: "https://picsum.photos/id/155/800/600",
      tab: "image-resizer",
      isComingSoon: true,
    },
    { // Docx to Pdf
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/></svg>,
      title: t.docxToPdf,
      description: t.docxToPdfDescription,
      imageUrl: "https://picsum.photos/id/156/800/600",
      tab: "docx-to-pdf",
      isComingSoon: true,
    },
    { // GIF Maker
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2"/></svg>,
      title: t.gifMaker,
      description: t.gifMakerDescription,
      imageUrl: "https://picsum.photos/id/157/800/600",
      tab: "gif-maker",
      isComingSoon: true,
    },
    { // Meme Generator
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6.204a1 1 0 00-.54-.853L5 4m.089 13.911C3.25 18.239 2 16.214 2 13.5c0-2.714 1.25-4.739 3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19M19 6.204a1 1 0 00-.54-.853L15 4m.089 13.911C20.75 18.239 22 16.214 22 13.5c0-2.714-1.25-4.739-3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19" strokeWidth="2"/></svg>,
      title: t.memeGenerator,
      description: t.memeGeneratorDescription,
      imageUrl: "https://picsum.photos/id/158/800/600",
      tab: "meme-generator",
      isComingSoon: true,
    },
    { // Soundboard
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6.204a1 1 0 00-.54-.853L5 4m.089 13.911C3.25 18.239 2 16.214 2 13.5c0-2.714 1.25-4.739 3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19M19 6.204a1 1 0 00-.54-.853L15 4m.089 13.911C20.75 18.239 22 16.214 22 13.5c0-2.714-1.25-4.739-3.089-5.411m0 5.411a1 1 0 01.993-1.127h5.922a1 1 0 01.993 1.127V19" strokeWidth="2"/></svg>,
      title: t.soundboard,
      description: t.soundboardDescription,
      imageUrl: "https://picsum.photos/id/159/800/600",
      tab: "soundboard",
      isComingSoon: true,
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">
          {t.dashboard}
        </h1>
        <p className="text-md text-slate-500 max-w-2xl">
          Quickly access all the powerful AI voice tools and utilities to enhance your workflow.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <ToolCard
            key={index}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            imageUrl={tool.imageUrl}
            tab={tool.tab}
            setActiveTab={setActiveTab}
            language={language}
            isComingSoon={tool.isComingSoon}
          />
        ))}
      </div>
    </div>
  );
};