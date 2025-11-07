import React, { useState, useEffect } from 'react';
import { TicketIcon } from './Icons';

const SplashScreen: React.FC = () => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500); // Start fading out 0.5s before the 3s timeout in App.tsx

    return () => clearTimeout(fadeTimer);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-500 ${
        isFadingOut ? 'animate-fade-out' : 'opacity-100'
      }`}
    >
      <div className="animate-fade-in-scale-up flex flex-col items-center">
        <TicketIcon className="w-28 h-28 text-amber-400" />
        <h1 className="text-5xl font-bold text-white mt-4">
          Movies
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
