import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  wide?: boolean;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, wide, onClick }) => {
  const cardImageClasses = wide 
    ? "w-48 h-28" // 16:9 ratio for wide cards
    : "w-32 h-48"; // 2:3 ratio for posters

  return (
    <button 
        onClick={() => onClick(movie)}
        className={`flex-shrink-0 text-left bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 group ${wide ? 'w-48' : 'w-32'}`}
        aria-label={`View details for ${movie.title}`}
    >
      <div className={`${cardImageClasses} bg-[var(--card-bg)] rounded-lg overflow-hidden relative shadow-md`}>
        <img
          src={movie.posterUrl}
          alt={`${movie.title} Poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {movie.progress !== undefined && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600/70">
            <div 
              className="h-full bg-sky-400" 
              style={{ width: `${movie.progress}%` }}
            ></div>
          </div>
        )}
      </div>
       {wide && (
        <div className="mt-2 px-1">
            <h3 className="font-semibold text-sm text-[var(--text-color)] truncate">{movie.title}</h3>
            <p className="text-xs text-[var(--text-color-secondary)] flex items-center space-x-1.5 mt-0.5">
                <span>{movie.year}</span>
                <span>&bull;</span>
                <span>{movie.duration}</span>
                <span>&bull;</span>
                <span className="border border-gray-500/80 px-1 rounded text-xs font-semibold tracking-wide">{movie.rating}</span>
            </p>
        </div>
      )}
    </button>
  );
};

export default MovieCard;