import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { ChevronRightIcon } from './Icons';

interface ContentRowProps {
  title: string;
  items: Movie[];
  wide?: boolean;
  onMovieClick: (movie: Movie) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items, wide = false, onMovieClick }) => {
  return (
    <section className="py-4">
      <div className="px-4 mb-2 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[var(--text-color)]">{title}</h2>
        <ChevronRightIcon className="w-4 h-4 text-[var(--text-color-secondary)]" />
      </div>
      <div className="flex overflow-x-auto space-x-3 px-4 no-scrollbar">
        {items.map((movie) => (
          <MovieCard key={movie.id} movie={movie} wide={wide} onClick={onMovieClick} />
        ))}
      </div>
    </section>
  );
};

export default ContentRow;