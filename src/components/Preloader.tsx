import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for fade out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <svg className="w-64 h-32" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <style>
              {`
                @keyframes dash {
                  to { stroke-dashoffset: 0; }
                }
                @keyframes colors {
                  0% { stroke: var(--color-carnival-red); }
                  25% { stroke: var(--color-carnival-green); }
                  50% { stroke: var(--color-carnival-orange); }
                  75% { stroke: var(--color-carnival-blue); }
                  100% { stroke: var(--color-carnival-yellow); }
                }
                .text-path {
                  fill: none;
                  stroke-width: 3;
                  stroke-dasharray: 500;
                  stroke-dashoffset: 500;
                  animation: dash 2s ease-in-out forwards, colors 3s linear infinite;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                }
              `}
            </style>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-path font-bold text-6xl tracking-widest uppercase font-sans"
            >
              RiVuG
            </text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
