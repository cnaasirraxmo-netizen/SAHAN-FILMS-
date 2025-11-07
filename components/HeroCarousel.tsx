import React, { useState, useEffect, useCallback, useContext } from 'react';
import { CarouselItem } from '../types';
import { CheckIcon } from './Icons';
import { ThemeContext } from '../App';

interface HeroCarouselProps {
  items: CarouselItem[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useContext(ThemeContext);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  const gradientClass = theme === 'dark'
    ? 'from-black/60 via-transparent to-black/20'
    : 'from-gray-900/40 via-transparent to-gray-500/10';

  return (
    <div className="relative w-full mt-4">
      <div className="relative aspect-video">
        <img
          src={currentItem.imageUrl}
          alt={currentItem.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}`} />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          {currentItem.showBrand && <span className="text-blue-400 font-bold text-sm">RIYOBOX</span>}
          <p className="text-xs font-light tracking-widest">{currentItem.title}</p>
          <h2 className="text-2xl font-extrabold tracking-tighter">{currentItem.subtitle}</h2>
          <div className="flex items-center mt-1">
            <div className="bg-blue-500 rounded-full p-0.5">
                <CheckIcon className="w-3 h-3 text-black" />
            </div>
            <span className="ml-2 text-sm font-semibold">Included with RIYOBOX</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-4 flex space-x-1.5">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 w-1.5 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;