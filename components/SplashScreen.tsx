import React, { useState, useEffect } from 'react';

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
      <div className="animate-fade-in-scale-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-wider animate-glow">
          SAHAN FILMS ™
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
