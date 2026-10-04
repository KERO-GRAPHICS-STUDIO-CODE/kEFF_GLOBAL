import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, CheckCircle } from 'lucide-react';

interface AudioTnCProps {
  onAccept: () => void;
  termsText: string;
}

const AudioTnC: React.FC<AudioTnCProps> = ({ onAccept, termsText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      utteranceRef.current = new SpeechSynthesisUtterance(termsText);

      utteranceRef.current.onend = () => {
        setIsPlaying(false);
        setHasFinished(true);
      };

      utteranceRef.current.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsPlaying(false);
        // Fallback in case of error so user isn't stuck
        setHasFinished(true);
      };
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [termsText]);

  const handlePlayPause = () => {
    if (!synthRef.current || !utteranceRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      synthRef.current.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 shadow-sleek w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Terms & Conditions</h3>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
        {termsText}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handlePlayPause}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
        >
          {isPlaying ? <Square className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-1" fill="currentColor" />}
        </button>
        <div className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
          Listen to the Terms & Conditions to accept.
        </div>
      </div>

      <button
        onClick={onAccept}
        disabled={!hasFinished}
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          hasFinished
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        Accept All
      </button>
    </div>
  );
};

export default AudioTnC;
