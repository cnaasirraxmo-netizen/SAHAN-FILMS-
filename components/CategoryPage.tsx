import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { PRIME_MOVIES, PRIME_ORIGINALS, CONTINUE_WATCHING } from '../constants';

interface CategoryPageProps {
  category: string;
  onMovieClick: (movie: Movie) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onMovieClick }) => {
  let movies: Movie[] = [];
  let showPlaceholder = false;

  switch (category) {
    case 'Movies':
      // Combine movies and filter from continue watching
      movies = [
        ...PRIME_MOVIES,
        ...CONTINUE_WATCHING.filter(m => m.duration.includes('h') || m.duration.includes('m'))
      ].filter((movie, index, self) => index === self.findIndex(t => t.id === movie.id)); // Remove duplicates
      break;
    case 'TV shows':
      // Combine TV shows and filter from continue watching
      movies = [
        ...PRIME_ORIGINALS,
        ...CONTINUE_WATCHING.filter(m => m.duration.toLowerCase().includes('season'))
      ].filter((movie, index, self) => index === self.findIndex(t => t.id === movie.id)); // Remove duplicates
      break;
    default:
      showPlaceholder = true;
      break;
  }

  if (showPlaceholder) {
    return (
      <div className="p-4 text-center text-[var(--text-color-secondary)] mt-8">
        <p>Content for '{category}' is not yet available.</p>
        <p className="text-sm mt-2">Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[var(--text-color)] mb-4">{category}</h1>
      <div className="grid grid-cols-3 gap-3">
        {movies.map(movie => (
          <MovieCard key={`${category}-${movie.id}`} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
