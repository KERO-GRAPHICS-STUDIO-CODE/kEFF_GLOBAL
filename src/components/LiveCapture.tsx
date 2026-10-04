import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  label?: string;
}

const LiveCapture: React.FC<LiveCaptureProps> = ({ onCapture, label = "Take Photo" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Camera access denied or unavailable.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageUrl);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return stopCamera;
  }, [stopCamera]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {label} <span className="text-xs text-red-500 ml-2">(Live Capture Only - Uploads Disabled)</span>
      </div>

      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 shadow-sleek">
        {!stream && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
             <Camera className="w-12 h-12 text-slate-400 mb-4" />
             <p className="text-slate-300 text-sm mb-4">Camera access is required for verification.</p>
             <button
               onClick={startCamera}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
             >
               Open Camera
             </button>
             {error && <p className="text-red-400 text-xs mt-4">{error}</p>}
          </div>
        )}

        {stream && !capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </button>
            </div>
          </>
        )}

        {capturedImage && (
          <>
            <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
               <button
                  onClick={retakePhoto}
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
               >
                 <RefreshCw className="w-5 h-5" /> Retake
               </button>
               <button
                  onClick={confirmPhoto}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
               >
                 <Check className="w-5 h-5" /> Use Photo
               </button>
            </div>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default LiveCapture;
