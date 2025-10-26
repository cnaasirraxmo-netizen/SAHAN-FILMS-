import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  wide?: boolean;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, wide, onClick }) => {
  const cardClasses = wide 
    ? "w-48 h-28" // 16:9 ratio approx for wide cards
    : "w-32 h-48"; // 2:3 ratio approx for posters

  return (
    <button 
        onClick={() => onClick(movie)}
        className={`flex-shrink-0 ${cardClasses} bg-[var(--card-bg)] rounded-lg overflow-hidden relative shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400`}
        aria-label={`View details for ${movie.title}`}
    >
      <img
        src={movie.posterUrl}
        alt={`${movie.title} Poster`}
        className="w-full h-full object-cover"
      />
      {movie.progress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600/70">
          <div 
            className="h-full bg-sky-400" 
            style={{ width: `${movie.progress}%` }}
          ></div>
        </div>
      )}
    </button>
  );
};

export default MovieCard;